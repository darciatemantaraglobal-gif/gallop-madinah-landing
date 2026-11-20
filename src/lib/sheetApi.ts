// The Apps Script web app that fronts the Google Sheet (see /apps-script).
export const SHEET_API_URL = (import.meta.env.VITE_SHEET_API_URL as string | undefined)?.trim() || "";

export const sheetConnected = () => SHEET_API_URL !== "";

/**
 * Fire-and-forget write to the Sheet (a booking or a registration).
 *
 * Sent as text/plain so the browser does not do a CORS preflight (Apps Script cannot answer one),
 * and with no-cors + keepalive so it still goes out when the page then opens WhatsApp.
 * The response cannot be read in this mode, so this only reports whether the request was sent.
 */
export function sendToSheet(payload: Record<string, unknown>): boolean {
  if (!sheetConnected()) return false;
  try {
    fetch(SHEET_API_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* offline: WhatsApp still carries the booking */
    });
    return true;
  } catch {
    return false;
  }
}
