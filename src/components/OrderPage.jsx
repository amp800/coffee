import { useState } from 'react';
import { coffees, milkTypes } from '../data/coffees';
import CoffeeCard from './CoffeeCard';
import MilkSelector from './MilkSelector';
import SugarCounter from './SugarCounter';
import OrderStatus from './OrderStatus';

export default function OrderPage() {
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [selectedMilk, setSelectedMilk] = useState(null);
  const [sugars, setSugars] = useState(0);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [nameError, setNameError] = useState(false);

  const selectedCoffeeData = coffees.find(c => c.id === selectedCoffee);
  const showMilkSelector = selectedCoffeeData?.hasMilk;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 500);
      return;
    }

    if (!selectedCoffee) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          coffee_type: selectedCoffee,
          milk_type: selectedMilk,
          sugars,
          notes: notes.trim() || null
        })
      });

      if (response.ok) {
        const order = await response.json();
        setSubmittedOrder(order);
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCoffeeSelect = (coffeeId) => {
    setSelectedCoffee(coffeeId);
    setSelectedMilk(null);
  };

  // Show order status if order was submitted
  if (submittedOrder) {
    return <OrderStatus order={submittedOrder} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-3xl mb-2">☕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            What'll it be?
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        {/* Coffee Type Selection */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Coffee
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {coffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                isSelected={selectedCoffee === coffee.id}
                onClick={() => handleCoffeeSelect(coffee.id)}
              />
            ))}
          </div>
        </section>

        {/* Milk Selector */}
        {showMilkSelector && (
          <section className="mb-8 animate-fade-in">
            <MilkSelector
              milks={milkTypes}
              selected={selectedMilk}
              onSelect={setSelectedMilk}
            />
          </section>
        )}

        {/* Sugar Counter */}
        <section className="mb-6">
          <SugarCounter value={sugars} onChange={setSugars} />
        </section>

        {/* Name Input */}
        <section className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name?"
            className={`input-field ${nameError ? 'animate-shake border-red-400' : ''}`}
            maxLength={30}
          />
        </section>

        {/* Notes */}
        <section className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Extra hot? No foam?"
            className="input-field resize-none h-20"
            maxLength={100}
          />
        </section>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCoffee || isSubmitting}
          className="btn-primary w-full text-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Ordering...
            </span>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );
}
