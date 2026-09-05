// DELETE /api/orders/clear - remove every order (end of session)

export async function onRequestDelete({ env }) {
  await env.DB.prepare('DELETE FROM orders').run();
  return Response.json({ ok: true });
}
