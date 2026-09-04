// Coffee type definitions with flat-design layer-composition SVG illustrations
// Inspired by infographic-style coffee diagrams
export const coffees = [
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    hasMilk: true,
    svg: `<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cup -->
      <rect x="18" y="30" width="64" height="60" rx="6" fill="#E5E7EB"/>
      <!-- Espresso layer -->
      <rect x="22" y="62" width="56" height="16" fill="#78350F" rx="0"/>
      <!-- Steamed milk layer -->
      <rect x="22" y="46" width="56" height="16" fill="#FEF3C7"/>
      <!-- Thick foam layer -->
      <rect x="22" y="34" width="56" height="12" fill="#FFFBEB" rx="0"/>
      <!-- Foam bubbles -->
      <circle cx="35" cy="39" r="2" fill="white" opacity="0.7"/>
      <circle cx="50" cy="38" r="2.5" fill="white" opacity="0.8"/>
      <circle cx="64" cy="40" r="1.8" fill="white" opacity="0.6"/>
      <!-- Cup rim -->
      <rect x="16" y="28" width="68" height="4" rx="2" fill="#D1D5DB"/>
      <!-- Handle -->
      <path d="M82 40 C94 40 94 62 82 62" stroke="#D1D5DB" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- Saucer -->
      <ellipse cx="50" cy="96" rx="36" ry="6" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
      <!-- Labels -->
      <text x="90" y="40" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">foam</text>
      <text x="90" y="54" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">milk</text>
      <text x="90" y="72" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">espresso</text>
    </svg>`
  },
  {
    id: 'latte',
    name: 'Café Latte',
    hasMilk: true,
    svg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Tall cup -->
      <rect x="20" y="22" width="60" height="78" rx="6" fill="#E5E7EB"/>
      <!-- Espresso layer (small) -->
      <rect x="24" y="82" width="52" height="10" fill="#78350F"/>
      <!-- Lots of steamed milk -->
      <rect x="24" y="38" width="52" height="44" fill="#FEF3C7"/>
      <!-- Thin foam layer -->
      <rect x="24" y="28" width="52" height="10" fill="#FFFBEB"/>
      <!-- Cup rim -->
      <rect x="18" y="20" width="64" height="4" rx="2" fill="#D1D5DB"/>
      <!-- Handle -->
      <path d="M80 34 C92 34 92 62 80 62" stroke="#D1D5DB" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- Saucer -->
      <ellipse cx="50" cy="106" rx="34" ry="6" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
      <!-- Labels -->
      <text x="88" y="35" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">foam</text>
      <text x="88" y="60" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">milk</text>
      <text x="88" y="90" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">espresso</text>
    </svg>`
  },
  {
    id: 'espresso',
    name: 'Espresso',
    hasMilk: false,
    svg: `<svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Small demitasse -->
      <rect x="25" y="28" width="50" height="40" rx="5" fill="#E5E7EB"/>
      <!-- Rich espresso -->
      <rect x="29" y="36" width="42" height="26" fill="#78350F"/>
      <!-- Crema -->
      <rect x="29" y="32" width="42" height="6" fill="#D97706" rx="0"/>
      <!-- Cup rim -->
      <rect x="23" y="26" width="54" height="4" rx="2" fill="#D1D5DB"/>
      <!-- Handle -->
      <path d="M75 36 C86 36 86 54 75 54" stroke="#D1D5DB" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Saucer -->
      <ellipse cx="50" cy="74" rx="30" ry="5" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'piccolo',
    name: 'Piccolo',
    hasMilk: true,
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Small glass -->
      <rect x="30" y="22" width="40" height="58" rx="4" fill="#E5E7EB"/>
      <!-- Ristretto layer -->
      <rect x="34" y="50" width="32" height="24" fill="#78350F"/>
      <!-- Steamed milk -->
      <rect x="34" y="30" width="32" height="20" fill="#FEF3C7"/>
      <!-- Cup rim -->
      <rect x="28" y="20" width="44" height="4" rx="2" fill="#D1D5DB"/>
      <!-- Saucer -->
      <ellipse cx="50" cy="86" rx="28" ry="5" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
      <!-- Labels -->
      <text x="78" y="42" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">milk</text>
      <text x="78" y="64" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">ristretto</text>
    </svg>`
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    hasMilk: true,
    svg: `<svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Small cup -->
      <rect x="24" y="26" width="52" height="42" rx="5" fill="#E5E7EB"/>
      <!-- Espresso -->
      <rect x="28" y="34" width="44" height="28" fill="#78350F"/>
      <!-- Foam spot on top -->
      <ellipse cx="50" cy="32" rx="16" ry="6" fill="#FFFBEB"/>
      <ellipse cx="50" cy="30" rx="8" ry="3" fill="white" opacity="0.7"/>
      <!-- Cup rim -->
      <rect x="22" y="24" width="56" height="4" rx="2" fill="#D1D5DB"/>
      <!-- Handle -->
      <path d="M76 34 C86 34 86 50 76 50" stroke="#D1D5DB" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Saucer -->
      <ellipse cx="50" cy="74" rx="30" ry="5" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    hasMilk: true,
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Wide cup -->
      <rect x="14" y="28" width="72" height="52" rx="6" fill="#E5E7EB"/>
      <!-- Ristretto layer -->
      <rect x="18" y="56" width="64" height="16" fill="#78350F"/>
      <!-- Velvety steamed milk (no foam) -->
      <rect x="18" y="34" width="64" height="22" fill="#FEF3C7"/>
      <!-- Smooth milk surface -->
      <rect x="18" y="32" width="64" height="4" fill="#FDE68A" opacity="0.5"/>
      <!-- Cup rim -->
      <rect x="12" y="26" width="76" height="4" rx="2" fill="#D1D5DB"/>
      <!-- Handle -->
      <path d="M86 38 C98 38 98 58 86 58" stroke="#D1D5DB" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- Saucer -->
      <ellipse cx="50" cy="86" rx="38" ry="6" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
      <!-- Labels -->
      <text x="98" y="46" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">milk</text>
      <text x="98" y="66" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">ristretto</text>
    </svg>`
  },
  {
    id: 'long-black',
    name: 'Long Black',
    hasMilk: false,
    svg: `<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Tall glass -->
      <rect x="22" y="18" width="56" height="72" rx="5" fill="#E5E7EB"/>
      <!-- Hot water -->
      <rect x="26" y="28" width="48" height="56" fill="#DBEAFE" opacity="0.5"/>
      <!-- Espresso on top -->
      <rect x="26" y="24" width="48" height="12" fill="#78350F"/>
      <!-- Crema swirl -->
      <path d="M30 30 Q40 36 50 30 Q60 24 70 30" stroke="#D97706" stroke-width="2" fill="none" opacity="0.5"/>
      <!-- Glass rim -->
      <rect x="20" y="16" width="60" height="4" rx="2" fill="#D1D5DB"/>
      <!-- Saucer -->
      <ellipse cx="50" cy="96" rx="32" ry="5" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
      <!-- Labels -->
      <text x="84" y="34" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">espresso</text>
      <text x="84" y="60" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">water</text>
    </svg>`
  }
];

export const milkTypes = [
  { id: 'full-cream', name: 'Full Cream' },
  { id: 'skim', name: 'Skim' },
  { id: 'oat', name: 'Oat' }
];
