// DELETE /api/orders/clear          - remove every order (end of session)
//        ?category=coffee|tea       - only that maker's orders

export async function onRequestDelete({ env, request }) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  if (category === 'coffee' || category === 'tea') {
    await env.DB.prepare('DELETE FROM orders WHERE category = ?').bind(category).run();
  } else {
    await env.DB.prepare('DELETE FROM orders').run();
  }
  return Response.json({ ok: true });
}