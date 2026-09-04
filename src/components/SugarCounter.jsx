import { useState, useEffect } from 'react';

export default function SugarCounter({ value, onChange }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 200);
    return () => clearTimeout(timer);
  }, [value]);

  const decrease = () => {
    if (value > 0) onChange(value - 1);
  };

  const increase = () => {
    if (value < 5) onChange(value + 1);
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Sugars
      </h2>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={decrease}
          disabled={value === 0}
          className="sugar-btn disabled:opacity-30 disabled:cursor-not-allowed"
        >
          −
        </button>
        
        <div className="flex flex-col items-center">
          <span 
            className={`text-4xl font-bold text-gray-900 transition-transform duration-200 ${
              animating ? 'scale-110' : 'scale-100'
            }`}
          >
            {value}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {value === 0 ? 'no sugar' : value === 1 ? 'sugar' : 'sugars'}
          </span>
        </div>
        
        <button
          onClick={increase}
          disabled={value === 5}
          className="sugar-btn disabled:opacity-30 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}
