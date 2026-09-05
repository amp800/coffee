export default function MilkSelector({ milks, selected, onSelect }) {
  return (
    <div className="animate-fade-up">
      <div className="flex items-baseline justify-between">
        <h2 className="field-label mb-3">Milk</h2>
        <span className="mb-3 text-xs text-stone-400">only if you'd like</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {milks.map((milk) => {
          const isSelected = selected === milk.id;
          return (
            <button
              key={milk.id}
              type="button"
              onClick={() => onSelect(milk.id)}
              aria-pressed={isSelected}
              className={isSelected ? 'milk-btn-selected' : 'milk-btn'}
            >
              <span
                className={`absolute top-2 right-2 grid place-items-center rounded-full transition-all duration-150 ${
                  isSelected
                    ? 'bg-emerald-500 text-white scale-100 opacity-100'
                    : 'scale-50 opacity-0'
                }`}
                style={{ width: 18, height: 18 }}
              >
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>

              <span className="flex w-full min-h-0 flex-1 items-center justify-center pt-1">
                <span
                  className="transition-transform duration-150"
                  style={{ width: '88%', maxWidth: 92 }}
                  dangerouslySetInnerHTML={{ __html: milk.svg }}
                />
              </span>

              <span className="w-full pb-0.5 text-center text-[13px] font-semibold leading-tight text-stone-800">
                {milk.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
