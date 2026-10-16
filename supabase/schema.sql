-- Le dernier virage : comptes, pronostics et classement des joueurs.
-- À coller une seule fois dans Supabase > SQL Editor > New query, puis « Run ».
-- Le script peut être relancé sans risque : il ne supprime aucune donnée.

-- ---------------------------------------------------------------------------
-- Extensions : requêtes HTTP (pour lire les résultats officiels) et tâches planifiées.
-- ---------------------------------------------------------------------------
create extension if not exists http with schema extensions;
create extension if not exists pg_cron;

-- ---------------------------------------------------------------------------
-- Barème : modifie les chiffres ici puis relance le script.
-- ---------------------------------------------------------------------------
create or replace function public.points_for(
  pick_pole text, pick_p1 text, pick_p2 text, pick_p3 text,
  real_pole text, real_p1 text, real_p2 text, real_p3 text
) returns int language sql immutable as $$
  select
      case when pick_p1 = real_p1 then 10 else 0 end           -- vainqueur exact
    + case when pick_p2 = real_p2 then 6 else 0 end            -- 2e exact
    + case when pick_p3 = real_p3 then 4 else 0 end            -- 3e exact
    -- pilote annoncé sur le podium, mais à une autre place
    + 2 * ((pick_p1 in (real_p2, real_p3))::int
         + (pick_p2 in (real_p1, real_p3))::int
         + (pick_p3 in (real_p1, real_p2))::int)
    + case when pick_pole = real_pole then 5 else 0 end        -- pole position exacte
    + case when pick_p1 = real_p1 and pick_p2 = real_p2 and pick_p3 = real_p3 then 5 else 0 end; -- podium parfait
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null unique check (char_length(pseudo) between 3 and 20),
  created_at timestamptz not null default now()
);

create table if not exists public.races (
  season int not null,
  round int not null,
  name text not null,
  circuit text,
  quali_start timestamptz,
  race_start timestamptz not null,
  pole text,
  p1 text,
  p2 text,
  p3 text,
  scored_at timestamptz,
  primary key (season, round)
);

create table if not exists public.predictions (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  season int not null,
  round int not null,
  pole text,
  p1 text not null,
  p2 text not null,
  p3 text not null,
  points int,
  updated_at timestamptz not null default now(),
  primary key (user_id, season, round),
  foreign key (season, round) references public.races (season, round),
  check (p1 <> p2 and p1 <> p3 and p2 <> p3)
);

-- ---------------------------------------------------------------------------
-- Création automatique du profil à l'inscription (le pseudo est saisi dans le formulaire).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  wanted text := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'pseudo'), ''), 'pilote'), 15);
begin
  if char_length(wanted) < 3 then wanted := wanted || '-f1'; end if;
  begin
    insert into public.profiles (id, pseudo) values (new.id, wanted);
  exception when unique_violation then
    -- pseudo déjà pris : on ajoute un petit suffixe plutôt que de bloquer l'inscription
    insert into public.profiles (id, pseudo) values (new.id, wanted || '-' || left(new.id::text, 4));
  end;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Verrouillage : la pole se ferme au début des qualifs, le podium au départ de la course.
-- L'heure utilisée est celle du serveur, impossible à tricher depuis le navigateur.
-- ---------------------------------------------------------------------------
create or replace function public.lock_predictions() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r public.races;
begin
  select * into r from public.races where season = new.season and round = new.round;
  if r is null then raise exception 'Course inconnue'; end if;
  if now() >= r.race_start then
    raise exception 'Les pronostics de cette course sont fermés';
  end if;
  if r.quali_start is not null and now() >= r.quali_start then
    if tg_op = 'INSERT' then
      new.pole := null;
    else
      new.pole := old.pole;
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists predictions_lock on public.predictions;
create trigger predictions_lock before insert or update of pole, p1, p2, p3 on public.predictions
  for each row execute function public.lock_predictions();

-- ---------------------------------------------------------------------------
-- Sécurité (Row Level Security) : chacun ne modifie que ses propres pronostics.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.races enable row level security;
alter table public.predictions enable row level security;

drop policy if exists "profils visibles" on public.profiles;
create policy "profils visibles" on public.profiles for select using (true);
drop policy if exists "modifier son pseudo" on public.profiles;
create policy "modifier son pseudo" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "courses visibles" on public.races;
create policy "courses visibles" on public.races for select using (true);

-- Ses propres pronostics tout le temps, ceux des autres une fois la course partie.
drop policy if exists "pronostics visibles" on public.predictions;
create policy "pronostics visibles" on public.predictions for select using (
  user_id = auth.uid()
  or exists (select 1 from public.races r
             where r.season = predictions.season and r.round = predictions.round and r.race_start <= now())
);
drop policy if exists "ajouter son pronostic" on public.predictions;
create policy "ajouter son pronostic" on public.predictions for insert
  with check (user_id = auth.uid());
drop policy if exists "modifier son pronostic" on public.predictions;
create policy "modifier son pronostic" on public.predictions for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Les joueurs ne touchent ni aux points ni aux courses : seules les colonnes utiles sont ouvertes.
revoke all on public.profiles, public.races, public.predictions from anon, authenticated;
grant select on public.profiles, public.races, public.predictions to anon, authenticated;
grant update (pseudo) on public.profiles to authenticated;
grant insert (season, round, pole, p1, p2, p3) on public.predictions to authenticated;
grant update (pole, p1, p2, p3) on public.predictions to authenticated;

-- ---------------------------------------------------------------------------
-- Classement général de la saison.
-- ---------------------------------------------------------------------------
create or replace view public.leaderboard with (security_invoker = true) as
select
  p.id,
  p.pseudo,
  coalesce(sum(pr.points), 0)::int as points,
  count(pr.points)::int as races,
  count(*) filter (where pr.p1 = r.p1)::int as winners
from public.profiles p
join public.predictions pr on pr.user_id = p.id
join public.races r on r.season = pr.season and r.round = pr.round
where pr.season = (select max(season) from public.races)
group by p.id, p.pseudo;

grant select on public.leaderboard to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Suppression de son compte (droit à l'effacement, RGPD).
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Non connecté'; end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- Lecture des données officielles (API Jolpica, la même que le site).
-- ---------------------------------------------------------------------------
create or replace function public.jolpica(path text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  res extensions.http_response;
begin
  perform extensions.http_set_curlopt('CURLOPT_TIMEOUT_MS', '20000');
  res := extensions.http_get('https://api.jolpi.ca/ergast/f1/' || path);
  if res.status <> 200 then return null; end if;
  return res.content::jsonb -> 'MRData';
exception when others then
  return null;
end $$;

-- Calendrier de la saison : dates des qualifs et des courses.
create or replace function public.sync_races() returns int
language plpgsql security definer set search_path = public as $$
declare
  data jsonb := public.jolpica('current.json?limit=100');
  race jsonb;
  n int := 0;
begin
  if data is null then return 0; end if;
  for race in select * from jsonb_array_elements(data -> 'RaceTable' -> 'Races') loop
    insert into public.races (season, round, name, circuit, quali_start, race_start)
    values (
      (race ->> 'season')::int,
      (race ->> 'round')::int,
      race ->> 'raceName',
      race -> 'Circuit' ->> 'circuitName',
      case when race -> 'Qualifying' ? 'date' then
        ((race -> 'Qualifying' ->> 'date') || ' ' || coalesce(race -> 'Qualifying' ->> 'time', '00:00:00Z'))::timestamptz end,
      ((race ->> 'date') || ' ' || coalesce(race ->> 'time', '00:00:00Z'))::timestamptz
    )
    on conflict (season, round) do update set
      name = excluded.name, circuit = excluded.circuit,
      quali_start = excluded.quali_start, race_start = excluded.race_start;
    n := n + 1;
  end loop;
  return n;
end $$;

-- Points : pour chaque course finie et pas encore comptée, lit le podium et la pole puis attribue les points.
create or replace function public.score_races() returns int
language plpgsql security definer set search_path = public as $$
declare
  r public.races;
  res jsonb;
  quali jsonb;
  real_pole text;
  n int := 0;
begin
  for r in
    select * from public.races
    where scored_at is null
      and race_start < now() - interval '3 hours'
      and race_start > now() - interval '10 days'
    order by race_start
  loop
    res := public.jolpica(r.season || '/' || r.round || '/results.json?limit=3');
    res := res -> 'RaceTable' -> 'Races' -> 0 -> 'Results';
    if res is null or jsonb_array_length(res) < 3 then continue; end if;

    quali := public.jolpica(r.season || '/' || r.round || '/qualifying.json?limit=1');
    real_pole := quali -> 'RaceTable' -> 'Races' -> 0 -> 'QualifyingResults' -> 0 -> 'Driver' ->> 'driverId';

    update public.races set
      pole = real_pole,
      p1 = res -> 0 -> 'Driver' ->> 'driverId',
      p2 = res -> 1 -> 'Driver' ->> 'driverId',
      p3 = res -> 2 -> 'Driver' ->> 'driverId',
      scored_at = now()
    where season = r.season and round = r.round
    returning * into r;

    update public.predictions pr set
      points = public.points_for(pr.pole, pr.p1, pr.p2, pr.p3, r.pole, r.p1, r.p2, r.p3)
    where pr.season = r.season and pr.round = r.round;
    n := n + 1;
  end loop;
  return n;
end $$;

-- Ces fonctions ne sont lancées que par le serveur, jamais depuis le site.
revoke all on function public.jolpica(text), public.sync_races(), public.score_races() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Tâche automatique : toutes les heures, met à jour le calendrier et compte les points.
-- ---------------------------------------------------------------------------
select cron.schedule('le-dernier-virage', '7 * * * *', $$select public.sync_races(); select public.score_races();$$);

-- Premier remplissage du calendrier tout de suite.
select public.sync_races() as courses_importees;
