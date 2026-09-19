import { useState, useEffect, useRef, useCallback } from 'react';
import { coffees, teas, milkTypes, drinkById, milkById, sugarLabel } from '../data/coffees';
import CoffeeCard from './CoffeeCard';
import MilkSelector from './MilkSelector';
import SugarCounter from './SugarCounter';

const RESET_AFTER_MS = 3000;

export default function WaiterPage() {
  const [name, setName] = useState('');
  const [selection, setSelection] = useState(null); // { category: 'coffee' | 'tea', id }
  const [selectedMilk, setSelectedMilk] = useState(null);
  const [sugars, setSugars] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [placed, setPlaced] = useState(null); // the order that was just placed
  const [secondsLeft, setSecondsLeft] = useState(0);

  const nameRef = useRef(null);

  const drink = selection ? drinkById[selection.id] : null;
  const needsMilk = Boolean(drink?.hasMilk);
  const milkOptional = drink?.milkOptional === true;
  const showSugar = drink?.hasSugar !== false;
  const canSubmit =
    name.trim().length > 0 &&
    Boolean(drink) &&
    (!needsMilk || milkOptional || Boolean(selectedMilk));

  const focusName = useCallback(() => {
    // Small delay lets the success screen unmount first.
    setTimeout(() => nameRef.current?.focus(), 60);
  }, []);

  const resetForm = useCallback(() => {
    setName('');
    setSelection(null);
    setSelectedMilk(null);
    setSugars(0);
    setNotes('');
    setSubmitError(null);
    window.scrollTo({ top: 0 });
    focusName();
  }, [focusName]);

  const selectDrink = (category, id) => {
    const next = drinkById[id];
    setSelection({ category, id });
    setSelectedMilk(null);
    if (next && next.hasSugar === false) setSugars(0);
    setSubmitError(null);
  };

  // Auto reset after a successful order.
  useEffect(() => {
    if (!placed) return;
    setSecondsLeft(3);

    const started = Date.now();
    const timer = setInterval(() => {
      const remaining = Math.ceil((RESET_AFTER_MS - (Date.now() - started)) / 1000);
      if (remaining <= 0) {
        clearInterval(timer);
        setPlaced(null);
        resetForm();
      } else {
        setSecondsLeft(remaining);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [placed, resetForm]);

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
        setPlaced(order);
      } else {
        setSubmitError("That didn't go through - try again.");
      }
    } catch {
      setSubmitError('No connection right now. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- success screen -------------------------------------------------------
  if (placed) {
    const placedDrink = drinkById[placed.coffee_type];
    const placedMilk = placed.milk_type ? milkById[placed.milk_type] : null;
    return (
      <div className="page grid place-items-center">
        <div className="mx-auto w-full max-w-md px-5 text-center animate-pop">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_16px_40px_-12px_rgba(5,150,105,0.6)] animate-pulse-ring">
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mt-5 text-[26px] font-extrabold tracking-tight text-stone-900">
            {placed.name.split(' ')[0]}'s order is in
          </h1>

          <div className="mx-auto mt-5 max-w-[260px] rounded-3xl bg-white px-5 py-4 ring-1 ring-stone-900/5 shadow-[0_1px_3px_rgba(28,25,23,0.06)]">
            {placedDrink && (
              <div className="mx-auto w-24" dangerouslySetInnerHTML={{ __html: placedDrink.svg }} />
            )}
            <p className="mt-1 text-[15px] font-bold text-stone-900">
              {placedDrink?.name}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
              {placedMilk && <span className="chip">{placedMilk.name}</span>}
              {placedDrink?.hasSugar !== false && (
                <span className="chip">{sugarLabel(placed.sugars || 0)}</span>
              )}
            </div>
            {placed.notes && (
              <p className="mt-2 text-[12px] italic text-stone-500">“{placed.notes}”</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setPlaced(null);
              resetForm();
            }}
            className="btn-primary mt-7 flex items-center justify-center gap-2"
          >
            <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" />
            </svg>
            Next order
          </button>
          <p className="mt-3 text-[12.5px] font-medium text-stone-400">
            or automatically continues in {secondsLeft}…
          </p>
        </div>
      </div>
    );
  }

  // ---- order form ------------------------------------------------------------
  return (
    <div className="page">
      <div className="mx-auto max-w-lg px-5 lg:max-w-4xl xl:max-w-5xl">
        {/* Header */}
        <header className="pb-2 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Waiter mode
              </p>
              <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight text-stone-900">
                Take an order
              </h1>
            </div>
          </div>
        </header>

        {/* Name - first, this is the whole point */}
        <section className="mt-6">
          <h2 className="field-label text-[12px]">Who is it for?</h2>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Guest name"
            maxLength={30}
            autoFocus
            className="input-field py-4 text-lg font-semibold"
          />
        </section>

        {/* Coffee */}
        <section className="mt-6">
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
        <section className="mt-7 border-t border-stone-900/5 pt-6">
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
          <section className="mt-6 animate-fade-up">
            <MilkSelector
              milks={milkTypes}
              selected={selectedMilk}
              onSelect={(id) => {
                setSelectedMilk(id);
                setSubmitError(null);
              }}
            />
          </section>
        )}

        {/* Sugars + notes in a row-friendly pair */}
        {showSugar && (
          <section className="mt-6">
            <SugarCounter value={sugars} onChange={setSugars} />
          </section>
        )}

        <section className="mt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="field-label text-[12px] mb-3">Notes</h2>
            <span className="mb-3 text-xs text-stone-300">optional</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Extra hot · no foam · decaf …"
            rows={2}
            maxLength={120}
            className="input-field resize-none"
          />
        </section>

        {/* Submit */}
        <div className="mt-8">
          <button type="button" onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="btn-primary">
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2.5">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Sending…
              </span>
            ) : name.trim() && !drink ? (
              'Pick a drink'
            ) : (
              `Log ${name.trim().split(' ')[0] || 'this'} order`
            )}
          </button>

          {submitError && (
            <p className="mt-3 text-center text-[13px] font-medium text-red-600">{submitError}</p>
          )}
        </div>

        <p className="mt-5 text-center text-[13px] text-stone-400">
          It resets automatically after each order, ready for the next person.
        </p>
      </div>
    </div>
  );
}