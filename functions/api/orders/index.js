// GET /api/orders  - list every order, oldest first (barista works top-down)
// POST /api/orders - create an order

const COFFEE_TYPES = new Set([
  'espresso',
  'macchiato',
  'piccolo',
  'long-black',
  'flat-white',
  'cafe-latte',
  'cappuccino',
]);

const MILK_TYPES = new Set(['full-cream', 'skim', 'oat']);
const MILK_REQUIRED_FOR = new Set(['macchiato', 'piccolo', 'flat-white', 'cafe-latte', 'cappuccino']);
const MAX_NAME = 30;
const MAX_NOTES = 120;

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM orders ORDER BY created_at ASC, rowid ASC'
  ).all();
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
  const coffeeType = body.coffee_type;
  const milkType = body.milk_type ?? null;
  const sugars = Number.isInteger(body.sugars) ? body.sugars : 0;
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

  if (!name) return Response.json({ error: 'A name is required.' }, { status: 400 });
  if (name.length > MAX_NAME)
    return Response.json({ error: `Name must be ${MAX_NAME} characters or fewer.` }, { status: 400 });
  if (!COFFEE_TYPES.has(coffeeType))
    return Response.json({ error: 'Unknown coffee type.' }, { status: 400 });
  if (MILK_REQUIRED_FOR.has(coffeeType) && !MILK_TYPES.has(milkType))
    return Response.json({ error: 'A milk choice is required for this coffee.' }, { status: 400 });
  if (milkType && !MILK_TYPES.has(milkType))
    return Response.json({ error: 'Unknown milk type.' }, { status: 400 });
  if (sugars < 0 || sugars > 5)
    return Response.json({ error: 'Sugars must be between 0 and 5.' }, { status: 400 });
  if (notes.length > MAX_NOTES)
    return Response.json({ error: 'Notes are too long.' }, { status: 400 });

  const id = crypto.randomUUID();

  await env.DB.prepare(
    'INSERT INTO orders (id, name, coffee_type, milk_type, sugars, notes) VALUES (?, ?, ?, ?, ?, ?)'
  )
    .bind(id, name, coffeeType, milkType, sugars, notes || null)
    .run();

  const { results } = await env.DB.prepare('SELECT * FROM orders WHERE id = ?')
    .bind(id)
    .all();

  return Response.json(results[0], { status: 201 });
}
