export default function MilkSelector({ milks, selected, onSelect }) {
  return (
    <div className="animate-fade-up">
      <div className="flex items-baseline justify-between">
        <h2 className="field-label text-[12px] mb-3">Milk</h2>
        <span className="mb-3 text-xs text-stone-400">only if you'd like</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
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
              {/* Square illustration — scales with the card, capped on desktop */}
              <span className="flex aspect-square w-3/5 min-w-0 items-center justify-center">
                <span
                  className="block w-full max-w-[132px]"
                  dangerouslySetInnerHTML={{ __html: milk.svg }}
                />
              </span>

              {/* Name */}
              <span className="tile-name">{milk.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
