export default function MilkSelector({ milks, selected, onSelect }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Milk type
      </h2>
      <div className="flex gap-3 justify-center">
        {milks.map((milk) => (
          <button
            key={milk.id}
            onClick={() => onSelect(milk.id)}
            className={`${
              selected === milk.id ? 'milk-pill-selected' : 'milk-pill'
            }`}
          >
            {milk.name}
          </button>
        ))}
      </div>
    </div>
  );
}
