// "First Gallop" certificate, drawn in the browser on a <canvas> (A4 landscape at 150 dpi).
// Nothing is uploaded: the image is made on the visitor's phone and saved or shared from there.

export const CERT_W = 1754;
export const CERT_H = 1240;

const GOLD = "hsl(43, 50%, 45%)";
const GOLD_LIGHT = "hsl(43, 55%, 58%)";
const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const DISPLAY = '"Akira Expanded", "Creato Display", sans-serif';
const BODY = '"Creato Display", system-ui, sans-serif';

export type CertificateInput = {
  name: string;
  date: Date | null;
  horse: string;
  coach: string;
  code: string;
  /** Arabic visitors get the English certificate (the canvas layout is left-to-right Latin type). */
  lang: "id" | "en" | "ms" | "ar";
};

const TEXT = {
  ms: {
    kicker: "SIJIL",
    title: "FIRST GALLOP",
    presented: "Dengan bangganya dianugerahkan kepada",
    body: "atas pengalaman menunggang kuda di gurun Madinah bersama Gallop Madinah",
    date: "TARIKH",
    horse: "KUDA",
    coach: "JURULATIH",
  },
  id: {
    kicker: "SERTIFIKAT",
    title: "FIRST GALLOP",
    presented: "Dengan bangga diberikan kepada",
    body: "atas pengalaman berkuda di padang pasir Madinah bersama Gallop Madinah",
    date: "TANGGAL",
    horse: "KUDA",
    coach: "COACH",
  },
  en: {
    kicker: "CERTIFICATE",
    title: "FIRST GALLOP",
    presented: "Proudly presented to",
    body: "for riding the desert of Madinah with Gallop Madinah",
    date: "DATE",
    horse: "HORSE",
    coach: "COACH",
  },
};

/** Largest font size (from `start` down to `min`) at which `measure(size)` fits in `maxWidth`. */
export function fitFontSize(measure: (size: number) => number, maxWidth: number, start: number, min: number) {
  let size = start;
  while (size > min && measure(size) > maxWidth) size -= 2;
  return Math.max(size, min);
}

/** "sertifikat-first-gallop-aisyah-rahman.png" */
export function certificateFileName(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `sertifikat-first-gallop${slug ? `-${slug}` : ""}.png`;
}

const DATE_LOCALES = { id: "id-ID", en: "en-GB", ms: "ms-MY" } as const;
const formatDate = (d: Date | null, lang: keyof typeof DATE_LOCALES) =>
  d ? d.toLocaleDateString(DATE_LOCALES[lang], { day: "numeric", month: "long", year: "numeric" }) : "-";

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Make sure the brand fonts are ready, otherwise the canvas silently falls back to a system font. */
async function loadFonts() {
  if (!("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load(`400 80px "Akira Expanded"`),
      document.fonts.load(`700 40px "Creato Display"`),
      document.fonts.load(`500 40px "Creato Display"`),
    ]);
  } catch {
    /* draw with fallback fonts */
  }
}

function spaced(ctx: CanvasRenderingContext2D, px: number) {
  // letterSpacing is not in every browser yet; it is purely cosmetic.
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${px}px`;
}

export async function drawCertificate(canvas: HTMLCanvasElement, input: CertificateInput, logoSrc: string) {
  await loadFonts();
  const logo = await loadImage(logoSrc);
  canvas.width = CERT_W;
  canvas.height = CERT_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const lang = input.lang === "ar" ? "en" : input.lang;
  const t = TEXT[lang];
  const cx = CERT_W / 2;

  // Background: near-black with a soft warm glow in the middle.
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, CERT_W, CERT_H);
  const glow = ctx.createRadialGradient(cx, CERT_H * 0.45, 50, cx, CERT_H * 0.45, CERT_W * 0.6);
  glow.addColorStop(0, "rgba(173,140,57,0.16)");
  glow.addColorStop(1, "rgba(173,140,57,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  // Double gold frame.
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  ctx.strokeRect(54, 54, CERT_W - 108, CERT_H - 108);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(78, 78, CERT_W - 156, CERT_H - 156);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Logo
  if (logo) {
    const h = 96;
    const w = (logo.width / logo.height) * h;
    ctx.drawImage(logo, cx - w / 2, 140, w, h);
  }

  // Kicker + title
  ctx.fillStyle = MUTED;
  ctx.font = `700 30px ${BODY}`;
  spaced(ctx, 14);
  ctx.fillText(t.kicker, cx, 330);
  ctx.fillStyle = GOLD_LIGHT;
  ctx.font = `400 96px ${DISPLAY}`;
  spaced(ctx, 6);
  ctx.fillText(t.title, cx, 445);

  // Presented to
  spaced(ctx, 0);
  ctx.fillStyle = MUTED;
  ctx.font = `500 34px ${BODY}`;
  ctx.fillText(t.presented, cx, 548);

  // Name: as large as fits on one line
  const name = input.name.trim().toUpperCase() || "—";
  spaced(ctx, 2);
  const size = fitFontSize(
    (s) => {
      ctx.font = `400 ${s}px ${DISPLAY}`;
      return ctx.measureText(name).width;
    },
    CERT_W - 360,
    110,
    44,
  );
  ctx.font = `400 ${size}px ${DISPLAY}`;
  ctx.fillStyle = INK;
  ctx.fillText(name, cx, 680);

  // Gold rule under the name
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 300, 720);
  ctx.lineTo(cx + 300, 720);
  ctx.stroke();

  // Body line
  spaced(ctx, 0);
  ctx.fillStyle = MUTED;
  ctx.font = `500 32px ${BODY}`;
  ctx.fillText(t.body, cx, 790);

  // Details: date | horse | coach
  const cols = [
    [t.date, formatDate(input.date, lang)],
    [t.horse, input.horse || "-"],
    [t.coach, input.coach || "-"],
  ];
  const colW = 440;
  const startX = cx - colW;
  cols.forEach(([label, value], i) => {
    const x = startX + i * colW;
    ctx.fillStyle = GOLD;
    ctx.font = `700 24px ${BODY}`;
    spaced(ctx, 8);
    ctx.fillText(label, x, 915);
    spaced(ctx, 0);
    ctx.fillStyle = INK;
    const vSize = fitFontSize(
      (s) => {
        ctx.font = `700 ${s}px ${BODY}`;
        return ctx.measureText(value).width;
      },
      colW - 40,
      40,
      22,
    );
    ctx.font = `700 ${vSize}px ${BODY}`;
    ctx.fillText(value, x, 970);
  });

  // Footer
  ctx.fillStyle = MUTED;
  ctx.font = `500 24px ${BODY}`;
  spaced(ctx, 4);
  ctx.fillText(`GALLOPMADINAH.ID${input.code ? `  ·  ${input.code}` : ""}`, cx, CERT_H - 120);
  spaced(ctx, 0);
}

export function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
