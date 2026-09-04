import { coffees, milkTypes } from '../data/coffees';

export default function OrderCard({ order, onStatusChange }) {
  const coffee = coffees.find(c => c.id === order.coffee_type);
  const milk = milkTypes.find(m => m.id === order.milk_type);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr + 'Z');
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-3 transition-all ${
      order.status === 'done' ? 'opacity-50' : ''
    }`}>
      <div className="flex items-center gap-3">
        {/* Coffee illustration (small) */}
        <div 
          className="w-10 h-10 flex-shrink-0"
          dangerouslySetInnerHTML={{ __html: coffee?.svg || '' }}
        />
        
        {/* Order details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 text-sm truncate">
              {order.name}
            </span>
            <span className={`status-${order.status}`}>
              {order.status}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 truncate">
            {coffee?.name}
            {milk && <span> · {milk.name}</span>}
            {order.sugars > 0 && <span> · {order.sugars}×</span>}
          </p>
          
          {order.notes && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {order.notes}
            </p>
          )}
        </div>

        {/* Time */}
        <span className="text-xs text-gray-400 flex-shrink-0">
          {formatTime(order.created_at)}
        </span>
      </div>

      {/* Status buttons */}
      {order.status !== 'done' && (
        <div className="mt-2 pt-2 border-t border-gray-50 flex gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusChange(order.id, 'making')}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium
                         bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Start making
            </button>
          )}
          {order.status === 'making' && (
            <button
              onClick={() => onStatusChange(order.id, 'done')}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium
                         bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              Done ✓
            </button>
          )}
        </div>
      )}
    </div>
  );
}
