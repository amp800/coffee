// PATCH /api/orders/:id - Update order status
export async function onRequestPatch(context) {
  const { env, request, params } = context;
  const { id } = params;
  
  try {
    const body = await request.json();
    const { status } = body;
    
    // Validate status
    if (!['pending', 'making', 'done'].includes(status)) {
      return Response.json(
        { error: 'Invalid status. Must be: pending, making, or done' },
        { status: 400 }
      );
    }
    
    // Update order
    const { success } = await env.DB.prepare(
      'UPDATE orders SET status = ? WHERE id = ?'
    ).bind(status, id).run();
    
    if (!success) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Fetch updated order
    const { results } = await env.DB.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).bind(id).all();
    
    if (results.length === 0) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return Response.json(results[0], {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
