import QRCode from 'qrcode';

/**
 * Generate a scannable QR code as a PNG data URL.
 * Runs fully in the browser - no external service, no API key.
 *
 * @param {string} text - the URL (or text) to encode
 * @param {number} size - pixel size of the output image
 * @returns {Promise<string|null>} data URL, or null if generation failed
 */
export async function generateQRDataUrl(text, size = 320) {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: size,
      color: { dark: '#1c1917', light: '#ffffff' },
    });
  } catch (error) {
    console.error('QR generation failed:', error);
    return null;
  }
}

/**
 * Absolute URL for a route on the current origin.
 * Works on coffee.lan, a pages.dev URL, or a custom domain.
 */
export function getPageUrl(path) {
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}
