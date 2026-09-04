export default function CoffeeCard({ coffee, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${
        isSelected ? 'card-selected' : 'card-interactive'
      } flex flex-col items-center text-center p-4 min-h-[160px]`}
    >
      {/* Coffee Illustration */}
      <div 
        className="w-20 h-20 mb-3 flex-shrink-0"
        dangerouslySetInnerHTML={{ __html: coffee.svg }}
      />
      
      {/* Coffee Name */}
      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
        {coffee.name}
      </h3>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
      )}
    </button>
  );
}
