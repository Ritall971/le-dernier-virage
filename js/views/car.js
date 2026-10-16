// Illustration de profil d'une Formule 1, peinte aux couleurs d'une livrée.
let uid = 0;

export function carSvg({ primary, secondary, accent }, label = '') {
  const g = `gloss${++uid}`;
  return `<svg class="car" viewBox="0 0 600 170" role="img" aria-label="${label}">
    <defs>
      <linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".35"/>
        <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".35"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="156" rx="270" ry="8" fill="#000" opacity=".55"/>
    <!-- plancher -->
    <path d="M60 128 L540 124 L540 132 L60 136 Z" fill="#0d0d0d"/>
    <!-- aileron arrière -->
    <path d="M548 92 L556 30 L566 30 L562 104 Z" fill="#111"/>
    <path d="M520 28 L590 26 L592 40 L522 42 Z" fill="${accent}"/>
    <path d="M524 46 L586 44 L587 52 L525 54 Z" fill="${secondary}"/>
    <path d="M582 22 L596 22 L596 104 L582 104 Z" fill="${primary}"/>
    <!-- carrosserie -->
    <path d="M30 116 L70 108 L150 100 L205 90 L240 78 L262 72 L300 70 L330 62 L372 52 L402 50 L434 58 L458 76 L476 92 L524 96 L548 106 L548 120 L150 126 L60 124 Z" fill="${primary}"/>
    <!-- prise d'air et aileron de requin -->
    <path d="M300 70 L316 44 L346 40 L372 52 L340 60 Z" fill="${secondary}"/>
    <path d="M372 52 L470 82 L476 92 L440 84 L402 62 Z" fill="${secondary}" opacity=".9"/>
    <!-- bande latérale -->
    <path d="M200 104 L430 92 L470 100 L214 114 Z" fill="${secondary}"/>
    <path d="M226 112 L460 102 L476 106 L238 118 Z" fill="${accent}"/>
    <path d="M30 116 L70 108 L150 100 L205 90 L240 78 L262 72 L300 70 L330 62 L372 52 L402 50 L434 58 L458 76 L476 92 L524 96 L548 106 L548 120 L150 126 L60 124 Z" fill="url(#${g})"/>
    <!-- aileron avant -->
    <path d="M6 122 L92 118 L96 128 L4 132 Z" fill="${accent}"/>
    <path d="M2 108 L14 108 L16 134 L2 134 Z" fill="${primary}"/>
    <!-- halo et pilote -->
    <circle cx="282" cy="66" r="10" fill="${accent}"/>
    <path d="M258 74 Q282 46 318 66" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/>
    <!-- roues -->
    <g class="car__wheel"><circle cx="110" cy="122" r="34" fill="#0a0a0a"/><circle cx="110" cy="122" r="31" fill="none" stroke="${accent}" stroke-width="2" opacity=".6"/><circle cx="110" cy="122" r="15" fill="#2a2a2a"/><circle cx="110" cy="122" r="5" fill="#777"/></g>
    <g class="car__wheel"><circle cx="478" cy="120" r="37" fill="#0a0a0a"/><circle cx="478" cy="120" r="34" fill="none" stroke="${accent}" stroke-width="2" opacity=".6"/><circle cx="478" cy="120" r="16" fill="#2a2a2a"/><circle cx="478" cy="120" r="5" fill="#777"/></g>
  </svg>`;
}
