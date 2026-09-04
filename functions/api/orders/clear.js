// DELETE /api/orders/clear - Clear all orders
export async function onRequestDelete(context) {
  const { env } = context;
  
  try {
    await env.DB.prepare('DELETE FROM orders').run();
    
    return Response.json(
      { message: 'All orders cleared' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    return Response.json(
      { error: 'Failed to clear orders' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
