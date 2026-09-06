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
      className={`rounded-3xl bg-white p-4 ring-1 ring-stone-900/5 shadow-[0_1px_3px_rgba(28,25,23,0.06)] transition-all duration-300 ${
        done ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Artwork */}
        <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-stone-50 ring-1 ring-stone-900/5">
          {drink && (
            <div className="w-[52px]" dangerouslySetInnerHTML={{ __html: drink.svg }} />
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[16px] font-bold leading-tight text-stone-900">
              {order.name}
            </h3>
            {typeof index === 'number' && (
              <span className="flex-shrink-0 text-[10.5px] font-bold text-stone-300">#{index}</span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[13px] font-medium text-stone-600">
            {drink?.name}
            {milk && <span className="text-stone-400"> · {milk.name}</span>}
            {drink?.hasSugar !== false && (
              <span className="text-stone-400"> · {sugarLabel(order.sugars || 0)}</span>
            )}
          </p>
          {order.notes && (
            <p className="mt-0.5 truncate text-[12px] italic text-stone-400">“{order.notes}”</p>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col items-end gap-1.5 self-start">
          <span className={PILL[order.status]}>{order.status}</span>
          <span className="text-[11px] tabular-nums text-stone-300">{formatTime(order.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        {order.status === 'pending' && (
          <button
            type="button"
            onClick={() => onStatusChange(order.id, 'making')}
            className="flex-1 rounded-2xl bg-stone-900 py-3 text-[14px] font-semibold text-white transition-all hover:bg-stone-800 active:scale-[0.99]"
          >
            Start making
          </button>
        )}
        {order.status === 'making' && (
          <button
            type="button"
            onClick={() => onStatusChange(order.id, 'done')}
            className="flex-1 rounded-2xl bg-emerald-600 py-3 text-[14px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.6)] transition-all hover:bg-emerald-700 active:scale-[0.99]"
          >
            Mark done
          </button>
        )}
        {done && (
          <p className="flex-1 text-center text-[12.5px] font-medium text-emerald-700">Collected ✓</p>
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
            className="grid h-9 w-9 place-items-center rounded-xl text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14L4 9l5-5" />
              <path d="M4 9h10a6 6 0 016 6v0" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
