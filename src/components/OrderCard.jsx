import { drinkById, milkById, sugarLabel } from '../data/coffees';

const PILL = {
  pending: 'pill-pending',
  making: 'pill-making',
  done: 'pill-done',
};

export default function OrderCard({ order, onStatusChange, index }) {
  const drink = drinkById[order.coffee_type];
  const milk = order.milk_type ? milkById[order.milk_type] : null;
  const done = order.status === 'done';

  const formatTime = (dateStr) => {
    try {
      return new Date(`${dateStr}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <article
      className={`rounded-3xl bg-white ring-1 ring-stone-900/5 shadow-[0_1px_3px_rgba(28,25,23,0.06)] transition-all duration-300 ${
        done ? 'opacity-60' : ''
      }`}
    >
      {/* Top: customer info + status */}
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        {/* Left: customer info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="min-w-0 truncate text-[26px] font-bold leading-tight text-stone-900">
              {order.name}
            </h3>
            {typeof index === 'number' && (
              <span className="flex-shrink-0 text-[16px] font-bold text-stone-400">#{index}</span>
            )}
          </div>
          {milk && <p className="mt-0.5 text-[18px] font-medium text-stone-500">{milk.name}</p>}
          {drink?.hasSugar !== false && (
            <p className="text-[18px] font-medium text-stone-500">{sugarLabel(order.sugars || 0)}</p>
          )}
          {order.notes && (
            <p className="mt-1 text-[17px] italic leading-snug text-stone-500">“{order.notes}”</p>
          )}
        </div>

        {/* Right: status + time */}
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <span className={`${PILL[order.status]} text-[14px]`}>{order.status}</span>
          <span className="text-[14px] tabular-nums text-stone-400">
            {formatTime(order.created_at)}
          </span>
        </div>
      </div>

      {/* Middle: drink tile with its name inside — same style as the ordering page */}
      <div className="flex justify-center px-4 pb-3">
        <div className="flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-2xl bg-stone-50 p-2 ring-1 ring-stone-900/5">
          {drink && (
            <div className="w-[92px]" dangerouslySetInnerHTML={{ __html: drink.svg }} />
          )}
          {drink && (
            <span className="w-full truncate text-center text-[15px] font-semibold leading-tight text-stone-800">
              {drink.name}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-stone-900/5 p-4">
        {order.status === 'pending' && (
          <button
            type="button"
            onClick={() => onStatusChange(order.id, 'making')}
            className="flex-1 rounded-2xl bg-stone-900 py-4 text-[19px] font-semibold text-white transition-all hover:bg-stone-800 active:scale-[0.99]"
          >
            Start making
          </button>
        )}
        {order.status === 'making' && (
          <button
            type="button"
            onClick={() => onStatusChange(order.id, 'done')}
            className="flex-1 rounded-2xl bg-emerald-600 py-4 text-[19px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.6)] transition-all hover:bg-emerald-700 active:scale-[0.99]"
          >
            Mark done
          </button>
        )}
        {done && (
          <p className="flex-1 text-center text-[17px] font-medium text-emerald-700">Collected ✓</p>
        )}

        {/* Step back (mishaps happen) */}
        {order.status !== 'pending' && (
          <button
            type="button"
            aria-label="Step back"
            onClick={() =>
              onStatusChange(
                order.id,
                order.status === 'done' ? 'making' : 'pending'
              )
            }
            className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14L4 9l5-5" />
              <path d="M4 9h10a6 6 0 016 6v0" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
