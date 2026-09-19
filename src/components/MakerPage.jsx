import { useState, useEffect, useRef, useCallback } from 'react';
import OrderCard from './OrderCard';
import QRCodeDisplay from './QRCodeDisplay';

/**
 * Shared "maker" dashboard. The Barista (coffee) and Tea Lady (tea) pages are
 * both this component with a different category filter and theme.
 */
export default function MakerPage({
  category,
  title,
  icon,
  accentPill = 'bg-emerald-500',
  accentSpinner = 'border-t-emerald-600',
  makingTitle = 'On the machine',
  emptyArt,
  emptyTitle,
  emptyBody,
}) {
  const [orders, setOrders] = useState(null); // null = still loading
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?category=${category}`);
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      setOrders(data); // server returns oldest first
      setError(null);
    } catch {
      setError("Can't reach the order list right now - retrying…");
    }
  }, [category]);

  const updateStatus = useCallback(
    async (orderId, newStatus) => {
      // Optimistic update for an instant feel.
      setOrders((prev) =>
        prev ? prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)) : prev
      );
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) {
          fetchOrders(); // roll back to truth
        }
      } catch {
        fetchOrders();
      }
    },
    [fetchOrders]
  );

  const clearAll = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/clear?category=${category}`, { method: 'DELETE' });
      if (res.ok) setOrders([]);
    } catch {
      /* keep current list */
    }
    setShowClearConfirm(false);
  }, [category]);

  useEffect(() => {
    fetchOrders();
    timerRef.current = setInterval(fetchOrders, 2500);
    return () => clearInterval(timerRef.current);
  }, [fetchOrders]);

  const pending = (orders ?? []).filter((o) => o.status === 'pending');
  const making = (orders ?? []).filter((o) => o.status === 'making');
  const done = (orders ?? []).filter((o) => o.status === 'done');
  const activeCount = pending.length + making.length;
  const host = typeof window !== 'undefined' ? window.location.origin : '';
  const empty = orders !== null && orders.length === 0;

  // Session sequence number (1, 2, 3…) shared across the groups, oldest first.
  const seqById = new Map();
  (orders ?? []).forEach((order, i) => seqById.set(order.id, i + 1));

  const renderGroup = (title, dot, items, opts = {}) => {
    if (items.length === 0 && !opts.showWhenEmpty) return null;
    return (
      <section className="mt-6 first:mt-5">
        <div className="mb-2.5 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-stone-400">
            {title}
          </h2>
          <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[12px] font-bold tabular-nums text-stone-500 ring-1 ring-stone-900/5">
            {items.length}
          </span>
        </div>
        <div className="space-y-2.5">
          {items.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              index={seqById.get(order.id)}
              onStatusChange={updateStatus}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="page">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-stone-900/5 bg-[#f6f3ee]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-stone-900 text-[17px]">
              {icon}
            </div>
            <div>
              <h1 className="text-[18px] font-extrabold tracking-tight text-stone-900">{title}</h1>
              <p className="text-[12px] font-medium text-stone-400">
                {orders === null
                  ? 'Connecting…'
                  : activeCount === 0 && empty
                    ? 'No orders yet'
                    : `${activeCount} in the queue`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <span className={`animate-pulse-ring rounded-full px-3 py-1 text-[12px] font-bold text-white ${accentPill}`}>
                {activeCount}
              </span>
            )}
            {!empty && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                disabled={orders === null}
                className="btn-ghost text-[13px] font-semibold text-red-500 hover:bg-red-50"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5">
        {error && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700 ring-1 ring-red-100">
            <span>{error}</span>
            <button type="button" onClick={fetchOrders} className="font-bold underline-offset-2 hover:underline">
              Retry
            </button>
          </div>
        )}

        {orders === null ? (
          <div className="grid place-items-center py-28">
            <div className={`h-7 w-7 animate-spin rounded-full border-[3px] border-stone-200 ${accentSpinner}`} />
          </div>
        ) : empty ? (
          /* Empty state: show the share card big and clear */
          <div className="py-8">
            <div className="rounded-3xl border-2 border-dashed border-stone-200 px-5 py-9 text-center">
              <div className="mx-auto w-28 opacity-90">
                <div dangerouslySetInnerHTML={{ __html: emptyArt }} />
              </div>
              <h2 className="mt-4 text-[20px] font-extrabold tracking-tight text-stone-800">
                {emptyTitle}
              </h2>
              <p className="mx-auto mt-1 max-w-[300px] text-[14px] leading-relaxed text-stone-500">
                {emptyBody}
              </p>
              <p className="mx-auto mt-4 w-fit rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-stone-600 ring-1 ring-stone-900/10">
                {host}
              </p>
            </div>

            <div className="mt-4">
              <QRCodeDisplay />
            </div>
          </div>
        ) : (
          <>
            {renderGroup('Up next', 'bg-amber-400', pending, { showWhenEmpty: making.length === 0 && done.length === 0 })}
            {renderGroup(makingTitle, 'bg-sky-400', making)}
            {renderGroup('Done', 'bg-emerald-400', done, { showWhenEmpty: false })}

            {/* Share card while orders are flowing */}
            <div className="mt-7">
              <QRCodeDisplay />
            </div>
          </>
        )}
      </main>

      {/* Clear-all confirm */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-stone-900/45 p-5 sm:items-center">
          <div className="w-full max-w-sm animate-pop rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-500">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
              </svg>
            </div>
          <h3 className="mt-4 text-center text-[19px] font-extrabold text-stone-900">
              Clear all {(orders ?? []).length} orders?
            </h3>
            <p className="mt-1 text-center text-[14px] leading-relaxed text-stone-500">
              Every order disappears from this list. Handy at the end of the session -
              there's no undo.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button type="button" onClick={() => setShowClearConfirm(false)} className="flex-1 rounded-2xl bg-stone-100 py-3 text-[14px] font-semibold text-stone-700 transition-colors hover:bg-stone-200">
                Keep them
              </button>
              <button type="button" onClick={clearAll} className="flex-1 rounded-2xl bg-red-500 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-red-600">
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}