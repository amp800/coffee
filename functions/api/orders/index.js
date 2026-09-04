// GET /api/orders - List all orders
export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM orders ORDER BY created_at DESC'
    ).all();
    
    return Response.json(results, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const body = await request.json();
    const { name, coffee_type, milk_type, sugars, notes } = body;
    
    // Validation
    if (!name || !coffee_type) {
      return Response.json(
        { error: 'Name and coffee type are required' },
        { status: 400 }
      );
    }
    
    // Generate UUID
    const id = crypto.randomUUID();
    
    // Insert order
    await env.DB.prepare(
      'INSERT INTO orders (id, name, coffee_type, milk_type, sugars, notes) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, name, coffee_type, milk_type || null, sugars || 0, notes || null)
      .run();
    
    // Fetch the created order
    const { results } = await env.DB.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).bind(id).all();
    
    return Response.json(results[0], {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
