// GET  /api/orders           - list orders, oldest first (makers work top-down)
//      ?category=coffee|tea  - only that category (barista vs tea lady)
// POST /api/orders           - create an order

const CATEGORIES = new Set(['coffee', 'tea']);

const COFFEE_TYPES = new Set([
  'espresso',
  'macchiato',
  'piccolo',
  'long-black',
  'flat-white',
  'cafe-latte',
  'cappuccino',
]);

const TEA_TYPES = new Set(['black', 'peppermint', 'lemongrass-ginger', 'green-lemon']);

const MILK_TYPES = new Set(['full-cream', 'skim', 'oat']);
// Milk-based coffees require a milk choice; black tea takes milk optionally.
const MILK_REQUIRED_FOR = new Set(['macchiato', 'piccolo', 'flat-white', 'cafe-latte', 'cappuccino']);
const MILK_OPTIONAL_FOR = new Set(['black']);
const SUGAR_ALLOWED_TEAS = new Set(['black']);

const MAX_NAME = 30;
const MAX_NOTES = 120;

function milkAllowed(drinkType, category) {
  if (category === 'coffee') return MILK_REQUIRED_FOR.has(drinkType);
  return MILK_OPTIONAL_FOR.has(drinkType);
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  let sql = 'SELECT * FROM orders';
  const args = [];
  if (CATEGORIES.has(category)) {
    sql += ' WHERE category = ?';
    args.push(category);
  }
  sql += ' ORDER BY created_at ASC, rowid ASC';

  const { results } = await env.DB.prepare(sql)
    .bind(...args)
    .all();
  return Response.json(results);
}

export async function onRequestPost({ env, request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const category = body.category === 'tea' ? 'tea' : 'coffee';
  const drinkType = body.coffee_type;
  const milkType = body.milk_type ?? null;
  const sugars = Number.isInteger(body.sugars) ? body.sugars : 0;
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

  if (!name) return Response.json({ error: 'A name is required.' }, { status: 400 });
  if (name.length > MAX_NAME)
    return Response.json({ error: `Name must be ${MAX_NAME} characters or fewer.` }, { status: 400 });

  const types = category === 'coffee' ? COFFEE_TYPES : TEA_TYPES;
  if (!types.has(drinkType))
    return Response.json({ error: 'Unknown drink type.' }, { status: 400 });

  const allowed = milkAllowed(drinkType, category);
  if (milkType && !MILK_TYPES.has(milkType))
    return Response.json({ error: 'Unknown milk type.' }, { status: 400 });
  if (milkType && !allowed)
    return Response.json({ error: 'Milk is not available for this drink.' }, { status: 400 });
  if (allowed && !MILK_OPTIONAL_FOR.has(drinkType) && !milkType)
    return Response.json({ error: 'A milk choice is required for this drink.' }, { status: 400 });

  if (sugars < 0 || sugars > 5)
    return Response.json({ error: 'Sugars must be between 0 and 5.' }, { status: 400 });
  if (category === 'tea' && !SUGAR_ALLOWED_TEAS.has(drinkType) && sugars > 0)
    return Response.json({ error: 'Sugar is not available for this tea.' }, { status: 400 });

  if (notes.length > MAX_NOTES)
    return Response.json({ error: 'Notes are too long.' }, { status: 400 });

  const id = crypto.randomUUID();

  await env.DB.prepare(
    'INSERT INTO orders (id, name, category, coffee_type, milk_type, sugars, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, name, category, drinkType, milkType, sugars, notes || null)
    .run();

  const { results } = await env.DB.prepare('SELECT * FROM orders WHERE id = ?')
    .bind(id)
    .all();

  return Response.json(results[0], { status: 201 });
}