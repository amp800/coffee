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
        className={`absolute top-2.5 right-2.5 grid h-5 w-5 place-items-center rounded-full transition-all duration-150 ${
          isSelected
            ? 'bg-emerald-500 text-white scale-100 opacity-100'
            : 'scale-50 opacity-0'
        }`}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>

      {/* Illustration */}
      <span className="flex w-full items-end justify-center pt-1">
        <span className="w-[104px] max-w-full" dangerouslySetInnerHTML={{ __html: coffee.svg }} />
      </span>

      {/* Name */}
      <span className="w-full text-center text-[15px] font-semibold leading-tight text-stone-800">
        {coffee.name}
      </span>
    </button>
  );
}
