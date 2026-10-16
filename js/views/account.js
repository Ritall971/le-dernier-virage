// Mon compte : inscription, connexion, pseudo, historique des pronostics, suppression du compte.
import { sb, currentUser, authError, returnUrl } from '../auth.js';
import { esc, raceName } from '../fmt.js';
import { pageHead, sectionHead, empty } from '../ui.js';
import { driverList } from './pronos.js';

export const title = () => 'Mon compte';

let state = null;
const rerender = () => window.dispatchEvent(new HashChangeEvent('hashchange'));

export async function render() {
  const user = await currentUser();
  state = { user };
  if (!user) return authForms();

  const client = await sb();
  const [profile, preds, board, drivers] = await Promise.all([
    client.from('profiles').select('pseudo').eq('id', user.id).maybeSingle(),
    client.from('predictions').select('*, races(name, race_start, pole, p1, p2, p3, scored_at)')
      .eq('user_id', user.id).order('round', { ascending: false }),
    client.from('leaderboard').select('id, points, winners').order('points', { ascending: false }).order('winners', { ascending: false }),
    driverList(),
  ]);
  const pseudo = profile.data?.pseudo || '';
  const rows = board.data || [];
  const meIdx = rows.findIndex((r) => r.id === user.id);
  const me = rows[meIdx];
  const rank = me ? rows.findIndex((r) => r.points === me.points && r.winners === me.winners) + 1 : null;
  const name = Object.fromEntries(drivers.map((d) => [d.id, d.short]));
  const n = (id) => (id ? esc(name[id] || id) : '–');
  state.pseudo = pseudo;

  const list = preds.data || [];
  return `${pageHead(pseudo || 'Mon compte', user.email)}
    <div class="wrap section">
      <div class="stats">
        <div class="stat" style="--c:var(--red)"><b>${me?.points ?? 0}</b><span>Points</span></div>
        <div class="stat"><b>${rank ? `${rank}<small>/${rows.length}</small>` : '–'}</b><span>Classement</span></div>
        <div class="stat"><b>${list.length}</b><span>Pronos</span></div>
        <div class="stat"><b>${me?.winners ?? 0}</b><span>Vainqueurs trouvés</span></div>
      </div>
      <a class="btn" href="#/pronos" style="justify-self:start">Faire mon prono</a>
    </div>
    <div class="wrap section">
      ${sectionHead('Mes pronostics')}
      ${list.length ? `<div class="table-wrap"><table class="data">
        <thead><tr><th>Course</th><th>Pole</th><th>Podium</th><th>Résultat</th><th class="num">Points</th></tr></thead>
        <tbody>${list.map((p) => {
          const r = p.races || {};
          return `<tr>
            <td>${esc(raceName(r.name || `Manche ${p.round}`))}</td>
            <td>${n(p.pole)}</td>
            <td>${n(p.p1)} · ${n(p.p2)} · ${n(p.p3)}</td>
            <td>${r.scored_at ? `${n(r.pole)} | ${n(r.p1)} · ${n(r.p2)} · ${n(r.p3)}` : '<span class="muted">à venir</span>'}</td>
            <td class="num"><b>${p.points ?? '–'}</b></td>
          </tr>`;
        }).join('')}</tbody></table></div>` : empty('Tu n\'as pas encore fait de prono.')}
    </div>
    <div class="wrap section">
      ${sectionHead('Réglages')}
      <form class="auth-form" id="pseudo-form">
        <label class="field"><span>Pseudo</span><input name="pseudo" value="${esc(pseudo)}" minlength="3" maxlength="20" required autocomplete="nickname"></label>
        <button class="btn" type="submit">Changer de pseudo</button>
        <p class="form-msg" role="status" aria-live="polite"></p>
      </form>
      <form class="auth-form" id="password-form">
        <label class="field"><span>Nouveau mot de passe</span><input name="password" type="password" minlength="6" required autocomplete="new-password"></label>
        <button class="btn" type="submit">Changer de mot de passe</button>
        <p class="form-msg" role="status" aria-live="polite"></p>
      </form>
      <div class="account-actions">
        <button class="btn btn--ghost" id="logout">Se déconnecter</button>
        <button class="btn btn--danger" id="delete">Supprimer mon compte</button>
      </div>
      <p class="fine">Supprimer ton compte efface ton e-mail, ton pseudo et tous tes pronostics, définitivement. <a href="#/confidentialite">Confidentialité</a></p>
    </div>`;
}

function authForms() {
  return `${pageHead('Mon compte', 'Un compte sert à faire tes pronostics et à apparaître au classement des joueurs.')}
    <div class="wrap section auth-grid">
      <form class="auth-form" id="login-form">
        <h2>Connexion</h2>
        <label class="field"><span>E-mail</span><input name="email" type="email" required autocomplete="email"></label>
        <label class="field"><span>Mot de passe</span><input name="password" type="password" required autocomplete="current-password"></label>
        <button class="btn" type="submit">Se connecter</button>
        <button class="link-btn" type="button" id="forgot">Mot de passe oublié ?</button>
        <p class="form-msg" role="status" aria-live="polite"></p>
      </form>
      <form class="auth-form" id="signup-form">
        <h2>Créer un compte</h2>
        <label class="field"><span>Pseudo (visible par tous)</span><input name="pseudo" minlength="3" maxlength="20" required autocomplete="nickname"></label>
        <label class="field"><span>E-mail</span><input name="email" type="email" required autocomplete="email"></label>
        <label class="field"><span>Mot de passe (6 caractères minimum)</span><input name="password" type="password" minlength="6" required autocomplete="new-password"></label>
        <label class="check"><input type="checkbox" name="ok" required><span>J'ai lu la page <a href="#/confidentialite">Confidentialité</a>.</span></label>
        <button class="btn" type="submit">Créer mon compte</button>
        <p class="form-msg" role="status" aria-live="polite"></p>
      </form>
    </div>`;
}

// Branche un formulaire : désactive le bouton pendant l'envoi et affiche le message de retour.
function wire(form, action) {
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = form.querySelector('.form-msg');
    const btn = form.querySelector('button[type=submit]');
    msg.className = 'form-msg';
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true;
    msg.textContent = 'Un instant…';
    try {
      const ok = await action(Object.fromEntries(new FormData(form)));
      msg.textContent = ok || '';
      msg.classList.add('ok');
    } catch (err) {
      msg.textContent = authError(err);
      msg.classList.add('err');
    } finally {
      btn.disabled = false;
    }
  });
}

export function mount(el) {
  const ready = sb();

  wire(el.querySelector('#login-form'), async ({ email, password }) => {
    const { error } = await (await ready).auth.signInWithPassword({ email, password });
    if (error) throw error;
    rerender();
  });

  wire(el.querySelector('#signup-form'), async ({ pseudo, email, password }) => {
    const client = await ready;
    pseudo = pseudo.trim();
    const taken = await client.from('profiles').select('id').eq('pseudo', pseudo).maybeSingle();
    if (taken.data) throw new Error('Ce pseudo est déjà pris.');
    const { data, error } = await client.auth.signUp({ email, password, options: { data: { pseudo }, emailRedirectTo: returnUrl() } });
    if (error) throw error;
    if (data.session) { rerender(); return ''; }
    return 'Compte créé. Ouvre le lien reçu par e-mail pour l\'activer, puis connecte-toi.';
  });

  el.querySelector('#forgot')?.addEventListener('click', async () => {
    const form = el.querySelector('#login-form');
    const msg = form.querySelector('.form-msg');
    const email = form.elements.email.value.trim();
    msg.className = 'form-msg';
    if (!email) { msg.textContent = 'Écris ton e-mail ci-dessus, puis clique à nouveau.'; msg.classList.add('err'); return; }
    const { error } = await (await ready).auth.resetPasswordForEmail(email, { redirectTo: returnUrl() });
    msg.textContent = error ? authError(error) : 'Si un compte existe, un lien de connexion vient d\'être envoyé. Change ensuite ton mot de passe dans Mon compte.';
    msg.classList.add(error ? 'err' : 'ok');
  });

  wire(el.querySelector('#pseudo-form'), async ({ pseudo }) => {
    const { error } = await (await ready).from('profiles').update({ pseudo: pseudo.trim() }).eq('id', state.user.id);
    if (error) throw error;
    el.querySelector('.page-head h1').textContent = pseudo.trim();
    return 'Pseudo changé.';
  });

  wire(el.querySelector('#password-form'), async ({ password }) => {
    const { error } = await (await ready).auth.updateUser({ password });
    if (error) throw error;
    el.querySelector('#password-form').reset();
    return 'Mot de passe changé.';
  });

  el.querySelector('#logout')?.addEventListener('click', async () => {
    await (await ready).auth.signOut();
    rerender();
  });

  el.querySelector('#delete')?.addEventListener('click', async () => {
    if (!confirm('Supprimer définitivement ton compte et tous tes pronostics ?')) return;
    const client = await ready;
    const { error } = await client.rpc('delete_my_account');
    if (error) { alert(authError(error)); return; }
    await client.auth.signOut({ scope: 'local' });
    rerender();
  });
}
