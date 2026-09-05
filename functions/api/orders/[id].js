// GET   /api/orders/:id - fetch one order (used by the guest tracking screen)
// PATCH /api/orders/:id - update an order's status

const STATUSES = new Set(['pending', 'making', 'done']);

export async function onRequestGet({ env, params }) {
  const { results } = await env.DB.prepare('SELECT * FROM orders WHERE id = ?')
    .bind(params.id)
    .all();

  if (results.length === 0) {
    return Response.json({ error: 'Order not found.' }, { status: 404 });
  }
  return Response.json(results[0]);
}

export async function onRequestPatch({ env, request, params }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!STATUSES.has(body.status)) {
    return Response.json(
      { error: 'Invalid status. Use pending, making or done.' },
      { status: 400 }
    );
  }

  const result = await env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?')
    .bind(body.status, params.id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: 'Order not found.' }, { status: 404 });
  }

  const { results } = await env.DB.prepare('SELECT * FROM orders WHERE id = ?')
    .bind(params.id)
    .all();

  return Response.json(results[0]);
}
