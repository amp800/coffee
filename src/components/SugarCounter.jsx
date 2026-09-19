import { useState, useEffect } from 'react';
import { sugarLabel } from '../data/coffees';

const MAX_SUGARS = 5;

export default function SugarCounter({ value, onChange }) {
  const [tick, setTick] = useState(0);

  // Restart the little pop animation whenever the value changes.
  useEffect(() => {
    setTick((t) => t + 1);
  }, [value]);

  const decrease = () => {
    if (value > 0) onChange(value - 1);
  };

  const increase = () => {
    if (value < MAX_SUGARS) onChange(value + 1);
  };

  return (
    <div className="animate-fade-up">
      <h2 className="field-label text-[12px]">Sugars</h2>
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-900/5 shadow-[0_1px_3px_rgba(28,25,23,0.05)]">
        <button
          type="button"
          onClick={decrease}
          disabled={value === 0}
          aria-label="Fewer sugars"
          className="sugar-btn text-xl"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14" />
          </svg>
        </button>

        <div key={tick} className="animate-pop flex flex-col items-center py-0.5" style={{ minWidth: 96 }}>
          <span className="text-[34px] font-bold leading-none tracking-tight text-stone-900">
            {value}
          </span>
          <span className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-stone-400">
            {sugarLabel(value)}
          </span>
        </div>

        <button
          type="button"
          onClick={increase}
          disabled={value === MAX_SUGARS}
          aria-label="More sugars"
          className="sugar-btn"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
