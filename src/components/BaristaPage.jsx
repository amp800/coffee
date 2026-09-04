import { useState, useEffect, useRef } from 'react';
import { coffees, milkTypes } from '../data/coffees';
import OrderCard from './OrderCard';

export default function BaristaPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const pollingRef = useRef(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const clearAllOrders = async () => {
    try {
      const response = await fetch('/api/orders/clear', {
        method: 'DELETE'
      });

      if (response.ok) {
        setOrders([]);
        setShowClearConfirm(false);
      }
    } catch (error) {
      console.error('Failed to clear orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    pollingRef.current = setInterval(fetchOrders, 3000);
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const makingOrders = orders.filter(o => o.status === 'making');
  const doneOrders = orders.filter(o => o.status === 'done');

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-5 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Orders
              {orders.length > 0 && (
                <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {orders.length}
                </span>
              )}
            </h1>
          </div>
          
          {orders.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"/>
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">☕</div>
            <p className="text-gray-500 text-sm">
              Waiting for orders...
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Share <span className="font-medium">coffee.lan</span> with your guests
            </p>
          </div>
        ) : (
          <>
            {pendingOrders.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">
                  Pending ({pendingOrders.length})
                </h2>
                <div className="space-y-2">
                  {pendingOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={updateStatus}
                    />
                  ))}
                </div>
              </section>
            )}

            {makingOrders.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
                  Making ({makingOrders.length})
                </h2>
                <div className="space-y-2">
                  {makingOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={updateStatus}
                    />
                  ))}
                </div>
              </section>
            )}

            {doneOrders.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">
                  Done ({doneOrders.length})
                </h2>
                <div className="space-y-2 opacity-50">
                  {doneOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={updateStatus}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Clear all orders?
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              This will remove all {orders.length} orders.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={clearAllOrders}
                className="flex-1 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
