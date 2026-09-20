// Coffee & tea definitions with illustrations from src/data/illustrations.js
// (coffees sliced from the free-license magnific.com vector set; piccolo, teas
// and milk icons are original art in the same style — see illustrations.js).
import { coffeeArt, teaArt, milkArt } from './illustrations';

// ------------------------------------------------------------------ drinks ---
// All cups share a baseline so the grid reads evenly.

const coffeeSvg = (id) => coffeeArt[id];
const teaSvg = (id) => teaArt[id];

export const coffees = [
  { id: 'espresso', name: 'Espresso', hasMilk: false, svg: coffeeSvg('espresso') },
  { id: 'macchiato', name: 'Macchiato', hasMilk: true, svg: coffeeSvg('macchiato') },
  { id: 'piccolo', name: 'Piccolo', hasMilk: true, svg: coffeeSvg('piccolo') },
  { id: 'long-black', name: 'Long Black', hasMilk: false, svg: coffeeSvg('long-black') },
  { id: 'flat-white', name: 'Flat White', hasMilk: true, svg: coffeeSvg('flat-white') },
  { id: 'cafe-latte', name: 'Café Latte', hasMilk: true, svg: coffeeSvg('cafe-latte') },
  { id: 'cappuccino', name: 'Cappuccino', hasMilk: true, svg: coffeeSvg('cappuccino') },
];

export const coffeeById = Object.fromEntries(coffees.map((c) => [c.id, c]));

// ------------------------------------------------------------ milk icons ----
export const milkTypes = [
  { id: 'full-cream', name: 'Full Cream', svg: milkArt['full-cream'] },
  { id: 'skim', name: 'Skim', svg: milkArt['skim'] },
  { id: 'oat', name: 'Oat', svg: milkArt['oat'] },
];

export const milkById = Object.fromEntries(milkTypes.map((m) => [m.id, m]));

// ------------------------------------------------------------------ teas ----
// Glass-mug teas in the americano glass style (illustrations.js).

export const teas = [
  {
    id: 'black',
    name: 'Black Tea',
    hasMilk: true,
    milkOptional: true, // milk is a choice, not a requirement
    hasSugar: true,
    svg: teaSvg('black'),
  },
  { id: 'peppermint', name: 'Peppermint', hasMilk: false, hasSugar: false, svg: teaSvg('peppermint') },
  { id: 'lemongrass-ginger', name: 'Lemongrass & Ginger', hasMilk: false, hasSugar: false, svg: teaSvg('lemongrass-ginger') },
  { id: 'green-lemon', name: 'Green Tea & Lemon', hasMilk: false, hasSugar: false, svg: teaSvg('green-lemon') },
];

export const teaById = Object.fromEntries(teas.map((t) => [t.id, t]));

// Combined lookup so a single id resolves either a coffee or a tea.
export const drinkById = { ...coffeeById, ...teaById };

// Shared formatting helpers used by the pages.
export const sugarLabel = (n) =>
  n === 0 ? 'no sugar' : n === 1 ? '1 sugar' : `${n} sugars`;

export const statusLabel = {
  pending: 'Pending',
  making: 'Making',
  done: 'Done',
};
