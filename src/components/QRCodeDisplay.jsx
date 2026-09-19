import { useState, useEffect } from 'react';
import { generateQRDataUrl } from '../utils/qrcode';

const ORDER_PAGE_URL = 'https://forcoff.pages.dev/';

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

export default function QRCodeDisplay() {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    generateQRDataUrl(ORDER_PAGE_URL, 190).then((result) => {
      setDataUrl(result);
    });
  }, []);

  return (
    <section className="p-5">
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
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="QR code for the order page"
            width={190}
            height={190}
            style={{ borderRadius: 6 }}
          />
        ) : (
          <div className="animate-pulse rounded-lg bg-stone-200/60" style={{ width: 190, height: 190 }} />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-stone-700">Guest order page</p>
          <p className="mt-0.5 break-all text-xs text-stone-400">{ORDER_PAGE_URL}</p>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            Guests scan this to order their own coffee - no app needed, just the camera.
          </p>
        </div>
      </div>
    </section>
  );
}
