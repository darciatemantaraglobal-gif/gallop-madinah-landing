// Google Drive share links → a direct image URL that works in <img>.
// The file must be shared as "Anyone with the link".

const ID_PATTERNS = [
  /drive\.google\.com\/file\/d\/([\w-]{10,})/i, // .../file/d/ID/view
  /drive\.google\.com\/(?:open|uc|thumbnail)\?(?:.*&)?id=([\w-]{10,})/i, // ...?id=ID
  /lh\d\.googleusercontent\.com\/d\/([\w-]{10,})/i,
];

/** The Drive file id in a share link, a bare id, or null. */
export function driveFileId(input: string): string | null {
  const s = input.trim();
  for (const re of ID_PATTERNS) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return /^[\w-]{20,}$/.test(s) ? s : null;
}

/**
 * For Drive links/ids: a thumbnail URL of the given width. Other https links are returned as-is.
 * Anything else (not https, empty) becomes "".
 */
export function imageUrl(input: string, width = 1200): string {
  const id = driveFileId(input);
  if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
  return /^https:\/\/\S+$/i.test(input.trim()) ? input.trim() : "";
}
