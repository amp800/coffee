import { useState, useEffect } from 'react';
import { coffees, milkTypes } from '../data/coffees';

export default function OrderStatus({ order }) {
  const [currentOrder, setCurrentOrder] = useState(order);

  const coffee = coffees.find(c => c.id === currentOrder.coffee_type);
  const milk = milkTypes.find(m => m.id === currentOrder.milk_type);

  // Poll for order updates
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const orders = await response.json();
          const updated = orders.find(o => o.id === currentOrder.id);
          if (updated) {
            setCurrentOrder(updated);
          }
        }
      } catch (error) {
        console.error('Failed to poll order status:', error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [currentOrder.id]);

  const statusConfig = {
    pending: {
      label: 'In the queue',
      color: 'bg-amber-500',
      icon: '⏳',
      message: 'Your order is waiting'
    },
    making: {
      label: 'Being made',
      color: 'bg-blue-500',
      icon: '👨‍🍳',
      message: 'Your coffee is on its way!'
    },
    done: {
      label: 'Ready!',
      color: 'bg-emerald-500',
      icon: '✅',
      message: 'Come and get it!'
    }
  };

  const status = statusConfig[currentOrder.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-4xl mb-3">{status.icon}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {status.label}
          </h1>
          <p className="text-gray-500 text-sm">
            {status.message}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        {/* Order Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start gap-4">
            {/* Coffee illustration */}
            <div 
              className="w-16 h-16 flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: coffee?.svg || '' }}
            />
            
            {/* Order details */}
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-lg mb-1">
                {coffee?.name}
              </h2>
              <p className="text-gray-600 text-sm">
                {milk && <span>{milk.name} milk</span>}
                {milk && currentOrder.sugars > 0 && <span> · </span>}
                {currentOrder.sugars > 0 && (
                  <span>{currentOrder.sugars} sugar{currentOrder.sugars > 1 ? 's' : ''}</span>
                )}
                {!milk && currentOrder.sugars === 0 && <span>Black</span>}
              </p>
              {currentOrder.notes && (
                <p className="text-gray-400 text-sm italic mt-1">
                  "{currentOrder.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Status progress bar */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex gap-1">
              <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                currentOrder.status === 'pending' || currentOrder.status === 'making' || currentOrder.status === 'done'
                  ? 'bg-emerald-500' : 'bg-gray-100'
              }`} />
              <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                currentOrder.status === 'making' || currentOrder.status === 'done'
                  ? 'bg-emerald-500' : 'bg-gray-100'
              }`} />
              <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                currentOrder.status === 'done'
                  ? 'bg-emerald-500' : 'bg-gray-100'
              }`} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400">Ordered</span>
              <span className="text-xs text-gray-400">Making</span>
              <span className="text-xs text-gray-400">Ready</span>
            </div>
          </div>
        </div>

        {/* Order for */}
        <div className="text-center text-sm text-gray-400">
          Order for <span className="font-medium text-gray-600">{currentOrder.name}</span>
        </div>
      </div>
    </div>
  );
}
