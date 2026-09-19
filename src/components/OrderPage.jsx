import { useState } from 'react';
import { coffees, teas, milkTypes, drinkById } from '../data/coffees';
import CoffeeCard from './CoffeeCard';
import MilkSelector from './MilkSelector';
import SugarCounter from './SugarCounter';
import OrderStatus from './OrderStatus';

export default function OrderPage() {
  const [name, setName] = useState('');
  const [selection, setSelection] = useState(null); // { category: 'coffee' | 'tea', id }
  const [selectedMilk, setSelectedMilk] = useState(null);
  const [sugars, setSugars] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const drink = selection ? drinkById[selection.id] : null;
  const needsMilk = Boolean(drink?.hasMilk);
  const milkOptional = drink?.milkOptional === true;
  const showSugar = drink?.hasSugar !== false;
  const canSubmit =
    name.trim().length > 0 &&
    Boolean(drink) &&
    (!needsMilk || milkOptional || Boolean(selectedMilk));

  const selectDrink = (category, id) => {
    const next = drinkById[id];
    setSelection({ category, id });
    setSelectedMilk(null);
    if (next && next.hasSugar === false) setSugars(0);
    setSubmitError(null);
  };

  const resetForm = () => {
    setName('');
    setSelection(null);
    setSelectedMilk(null);
    setSugars(0);
    setNotes('');
    setSubmitError(null);
    setSubmittedOrder(null); // leave the confirmation screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category: selection.category,
          coffee_type: selection.id,
          milk_type: needsMilk ? selectedMilk : null,
          sugars: showSugar ? sugars : 0,
          notes: notes.trim() || null,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        setSubmittedOrder(order);
      } else {
        setSubmitError("That didn't go through - please try again.");
      }
    } catch {
      setSubmitError('No connection right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- confirmation screen with live status ------------------------------
  if (submittedOrder) {
    return <OrderStatus order={submittedOrder} onPlaceAnother={resetForm} />;
  }

  return (
    <div className="page">
      <div className="mx-auto max-w-lg px-5 lg:max-w-4xl xl:max-w-5xl">
        {/* Hero */}
        <header className="pb-2 pt-8">
          <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Pates coffee &amp; tea bar
          </p>
          <h1 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight text-stone-900">
            What are you having?
          </h1>
          <p className="mt-1.5 text-[15px] text-stone-500">
            Coffee goes to the machine, tea to the tea lady.
          </p>
        </header>

        {/* Name */}
        <section className="mt-7">
          <h2 className="field-label text-[12px]">Your name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name is plenty"
            maxLength={30}
            autoComplete="name"
            className="input-field text-base font-medium"
          />
        </section>

        {/* Coffee */}
        <section className="mt-7">
          <h2 className="field-label text-[12px]">Coffee</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {coffees.map((item) => (
              <CoffeeCard
                key={item.id}
                coffee={item}
                isSelected={selection?.category === 'coffee' && selection?.id === item.id}
                onClick={() => selectDrink('coffee', item.id)}
              />
            ))}
          </div>
        </section>

        {/* Tea */}
        <section className="mt-8 border-t border-stone-900/5 pt-7">
          <h2 className="field-label text-[12px] mb-3">Tea</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {teas.map((item) => (
              <CoffeeCard
                key={item.id}
                coffee={item}
                isSelected={selection?.category === 'tea' && selection?.id === item.id}
                onClick={() => selectDrink('tea', item.id)}
              />
            ))}
          </div>
        </section>

        {/* Milk */}
        {needsMilk && (
          <section className="mt-6">
            <MilkSelector
              milks={milkTypes}
              selected={selectedMilk}
              onSelect={(id) => {
                setSelectedMilk(id);
                setSubmitError(null);
              }}
            />
            {!selectedMilk && !milkOptional && (
              <p className="mt-2.5 text-[13px] font-medium text-amber-600">
                Pick a milk for your {drink.name.toLowerCase()} to continue.
              </p>
            )}
          </section>
        )}

        {/* Sugars */}
        {showSugar && (
          <section className="mt-6">
            <SugarCounter value={sugars} onChange={setSugars} />
          </section>
        )}

        {/* Notes */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="field-label text-[12px] mb-3">Anything else?</h2>
            <span className="mb-3 text-xs text-stone-300">optional</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Extra hot · no foam · weak shot …"
            rows={2}
            maxLength={120}
            className="input-field resize-none"
          />
        </section>

        {/* Submit */}
        <div className="mt-7">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="btn-primary text-[18px] py-5"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2.5">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Placing your order…
              </span>
            ) : (
              'Place order'
            )}
          </button>

          {submitError && (
            <p className="mt-3 text-center text-[13px] font-medium text-red-600">{submitError}</p>
          )}
        </div>

        <p className="mt-6 text-center text-[13px] leading-relaxed text-stone-400">
          Your order lands with the barista or the tea lady, instantly.
        </p>
      </div>
    </div>
  );
}