import { useState, useEffect } from 'react';
import { drinkById, milkById, sugarLabel } from '../data/coffees';

const STEPS = ['pending', 'making', 'done'];

const STEP_COPY = {
  pending: {
    title: 'Order received',
    note: "It's in the queue - grab a seat, we'll call you over.",
    dot: 'bg-amber-400',
  },
  making: {
    title: 'Being made',
    note: "It's being made right now - won't be long.",
    dot: 'bg-sky-400',
  },
  done: {
    title: 'Ready to collect',
    note: 'Come and grab it - enjoy!',
    dot: 'bg-emerald-500',
  },
};

export default function OrderStatus({ order, onPlaceAnother }) {
  const [liveOrder, setLiveOrder] = useState(order);

  // Follow the order while the page is open.
  useEffect(() => {
    let alive = true;
    let timer;

    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const updated = await res.json();
          if (alive) {
            setLiveOrder(updated);
            if (updated.status === 'done') clearInterval(timer);
          }
        }
      } catch {
        /* offline - keep showing the last known state */
      }
    };

    timer = setInterval(poll, 2500);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [order.id]);

  const drink = drinkById[liveOrder.coffee_type];
  const milk = liveOrder.milk_type ? milkById[liveOrder.milk_type] : null;
  const stepIndex = Math.max(0, STEPS.indexOf(liveOrder.status));

  return (
    <div className="page animate-fade-up">
      <div className="mx-auto max-w-md px-5 pt-10">
        {/* Big illustration */}
        <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.95), rgba(255,255,255,0))',
            }}
          />
          {drink && (
            <div className="relative w-40 animate-float-soft" dangerouslySetInnerHTML={{ __html: drink.svg }} />
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
            Order in
          </p>
          <h1 className="mt-1.5 text-[26px] font-extrabold tracking-tight text-stone-900">
            Thanks, {liveOrder.name.split(' ')[0]}!
          </h1>

          {/* Summary chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {drink && <span className="chip">{drink.name}</span>}
            {milk && <span className="chip">{milk.name} milk</span>}
            {drink?.hasSugar !== false && (
              <span className="chip">{sugarLabel(liveOrder.sugars || 0)}</span>
            )}
          </div>
          {liveOrder.notes && (
            <p className="mt-2.5 text-[13px] italic text-stone-500">“{liveOrder.notes}”</p>
          )}
        </div>

        {/* Live progress */}
        <div className="mt-7 rounded-3xl bg-white p-5 ring-1 ring-stone-900/5 shadow-[0_1px_3px_rgba(28,25,23,0.06)]">
          <div className="relative flex items-start">
            {/* connector line */}
            <div className="absolute left-[18px] right-[18px] top-[10px] h-0.5 -translate-y-1/2 bg-stone-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {STEPS.map((step, i) => {
              const copy = STEP_COPY[step];
              const reached = i <= stepIndex;
              return (
                <div key={step} className="relative z-10 flex flex-1 flex-col items-center text-center">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full ring-4 ring-white transition-colors duration-300 ${
                      i < stepIndex
                        ? 'bg-emerald-500'
                        : i === stepIndex
                          ? `${copy.dot} ${i === 2 ? '' : 'animate-pulse-ring'}`
                          : 'bg-stone-200'
                    }`}
                  >
                    {i < stepIndex && (
                      <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`mt-2 text-[10.5px] font-bold uppercase tracking-wide ${
                      reached ? 'text-stone-800' : 'text-stone-300'
                    }`}
                  >
                    {copy.title}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-center text-[13px] font-medium text-stone-500">
            {STEP_COPY[liveOrder.status].note}
          </p>
          <p className="mt-1 text-center text-[11px] text-stone-300">
            This page updates on its own.
          </p>
        </div>

        {/* Next action */}
        <button type="button" onClick={onPlaceAnother} className="btn-ghost mx-auto mt-6 flex items-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Order another drink
        </button>
      </div>
    </div>
  );
}
