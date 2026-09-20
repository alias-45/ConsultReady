import QRCode from 'qrcode';

/**
 * Generate an opaque, unguessable consultation session ID.
 * Example: CONSULT_SESSION_8F72A91C
 * Crucial: NEVER put clinical or patient PHI into the QR code!
 */
export function generateSessionId(): string {
  const chars = '0123456789ABCDEF';
  let randomHex = '';
  for (let i = 0; i < 8; i++) {
    randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CONSULT_SESSION_${randomHex}`;
}

/**
 * Generate a QR Data URL from the opaque session ID string.
 */
export async function generateQrDataUrl(sessionId: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(sessionId, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0F172A', // Dark Navy matching theme
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code data URL', err);
    throw err;
  }
}

/**
 * Trigger download of the generated QR code image as PNG.
 */
export function downloadQrImage(dataUrl: string, fileName: string = 'ConsultReady_Session_QR.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format remaining milliseconds into HH:MM:SS
 */
export function formatRemainingTime(remainingMs: number): {
  hours: string;
  minutes: string;
  seconds: string;
  formatted: string;
  isExpired: boolean;
} {
  if (remainingMs <= 0) {
    return {
      hours: '00',
      minutes: '00',
      seconds: '00',
      formatted: '00:00:00',
      isExpired: true
    };
  }

  const totalSecs = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const hStr = pad(hours);
  const mStr = pad(minutes);
  const sStr = pad(seconds);

  return {
    hours: hStr,
    minutes: mStr,
    seconds: sStr,
    formatted: `${hStr}:${mStr}:${sStr}`,
    isExpired: false
  };
}
