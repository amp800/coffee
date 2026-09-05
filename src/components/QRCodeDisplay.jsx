import { useState, useEffect } from 'react';
import { generateQRDataUrl, getPageUrl } from '../utils/qrcode';

function QRImage({ url, size = 200 }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    let alive = true;
    generateQRDataUrl(url, size).then((result) => {
      if (alive) setDataUrl(result);
    });
    return () => {
      alive = false;
    };
  }, [url, size]);

  return (
    <div
      className="grid place-items-center rounded-xl bg-white ring-1 ring-stone-900/5"
      style={{ width: size + 16, height: size + 16 }}
    >
      {dataUrl ? (
        <img src={dataUrl} alt={`QR code for ${url}`} width={size} height={size} style={{ borderRadius: 6 }} />
      ) : (
        <div className="animate-pulse rounded-lg bg-stone-100" style={{ width: size, height: size }} />
      )}
    </div>
  );
}

/**
 * Share card shown to the barista: scannable QR codes pointing guests to the
 * order page (primary) and the waiter mode (secondary).
 */
export default function QRCodeDisplay() {
  const [orderUrl, setOrderUrl] = useState('/');
  const [waiterUrl, setWaiterUrl] = useState('/waiter');

  useEffect(() => {
    setOrderUrl(getPageUrl('/'));
    setWaiterUrl(getPageUrl('/waiter'));
  }, []);

  const showHost = orderUrl.startsWith('http');

  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-900/5 shadow-[0_1px_3px_rgba(28,25,23,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-stone-900">Point guests here</h3>
          <p className="mt-0.5 text-[13px] text-stone-500">
            Print it, or hold it up for someone to scan.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
          Orders
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <QRImage url={orderUrl} size={190} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-stone-700">Guest order page</p>
          {showHost && (
            <p className="mt-0.5 break-all text-xs text-stone-400">{orderUrl}</p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            Guests scan this to order their own coffee - no app needed, just the camera.
          </p>
        </div>
      </div>

      <details className="group mt-4">
        <summary className="cursor-pointer list-none text-[13px] font-semibold text-stone-500 transition-colors hover:text-emerald-600">
          <span className="inline-flex items-center gap-1.5">
            Waiter mode QR
            <svg
              className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </summary>
        <div className="mt-3 flex items-center gap-4 rounded-2xl bg-stone-50 p-3">
          <QRImage url={waiterUrl} size={108} />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-stone-700">Order-taking mode</p>
            {showHost && (
              <p className="mt-0.5 break-all text-[11px] text-stone-400">{waiterUrl}</p>
            )}
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              For the person walking around collecting orders.
            </p>
          </div>
        </div>
      </details>
    </section>
  );
}
