export default function CoffeeCard({ coffee, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={isSelected ? 'coffee-card-selected' : 'coffee-card'}
    >
      {/* Selected marker */}
      <span
        className={`absolute top-2 right-2 grid h-5 w-5 place-items-center rounded-full transition-all duration-150 ${
          isSelected
            ? 'bg-emerald-500 text-white scale-100 opacity-100'
            : 'scale-50 opacity-0'
        }`}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>

      {/* Square illustration — scales with the card, capped on desktop */}
      <span className="flex aspect-square w-3/5 min-w-0 items-center justify-center">
        <span
          className="block w-full max-w-[132px]"
          dangerouslySetInnerHTML={{ __html: coffee.svg }}
        />
      </span>

      {/* Name */}
      <span className="tile-name">{coffee.name}</span>
    </button>
  );
}
