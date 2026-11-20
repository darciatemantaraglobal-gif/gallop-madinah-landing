import { z } from "zod";
import { driveFileId, imageUrl } from "@/lib/drive";
import { SHEET_API_URL } from "@/lib/sheetApi";
import demo1 from "@/assets/gallery-13.jpg";
import demo2 from "@/assets/gallery-21.jpg";
import demo3 from "@/assets/gallery-22.jpg";
import demo4 from "@/assets/gallery-8.jpg";
import demo5 from "@/assets/gallery-14.jpg";
import demo6 from "@/assets/gallery-7.jpg";

// A rider group's private page (/member/KODE): photos, video, Drive folder, certificate.

export const MEMBER_CODE_RE = /^[A-Z0-9-]{3,20}$/;
/** Shown to the owner as an example; never stored in the Sheet. */
export const DEMO_CODE = "DEMO";

const rawMemberSchema = z.object({
  kode: z.string(),
  namaGrup: z.string().default(""),
  tanggal: z.string().default(""),
  kuda: z.string().default(""),
  coach: z.string().default(""),
  peserta: z.array(z.string()).default([]),
  foto: z.array(z.string()).default([]),
  videoUrl: z.string().default(""),
  driveFolder: z.string().default(""),
});

export type Photo = { thumb: string; full: string };
export type Video = { embed: string | null; link: string };
export type Member = {
  code: string;
  groupName: string;
  date: Date | null;
  horse: string;
  coach: string;
  riders: string[];
  photos: Photo[];
  video: Video | null;
  driveFolder: string;
  isDemo?: boolean;
};

export type MemberResult = { status: "found"; member: Member } | { status: "not_found" } | { status: "unavailable" };

const https = (s: string) => (/^https:\/\/\S+$/i.test(s.trim()) ? s.trim() : "");

/** "2026-12-20" → local Date, anything else → null. */
export function parseDay(s: string): Date | null {
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** YouTube and Google Drive videos can be embedded; other https links are only linked. */
export function videoFrom(url: string): Video | null {
  const link = https(url);
  if (!link) return null;
  const yt = link.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) return { embed: `https://www.youtube-nocookie.com/embed/${yt[1]}`, link };
  if (/drive\.google\.com/i.test(link)) {
    const id = driveFileId(link);
    if (id) return { embed: `https://drive.google.com/file/d/${id}/preview`, link };
  }
  return { embed: null, link };
}

/** Raw Sheet row → Member, with every link checked. */
export function resolveMember(raw: unknown): Member | null {
  const r = rawMemberSchema.safeParse(raw);
  if (!r.success) return null;
  const m = r.data;
  const photos = m.foto
    .map((f) => ({ thumb: imageUrl(f, 800), full: imageUrl(f, 2000) }))
    .filter((p) => p.thumb)
    .slice(0, 30);
  return {
    code: m.kode.toUpperCase(),
    groupName: m.namaGrup.trim(),
    date: parseDay(m.tanggal),
    horse: m.kuda.trim(),
    coach: m.coach.trim(),
    riders: m.peserta.map((p) => p.trim()).filter(Boolean).slice(0, 60),
    photos,
    video: videoFrom(m.videoUrl),
    driveFolder: /drive\.google\.com/i.test(m.driveFolder) ? https(m.driveFolder) : "",
  };
}

export async function fetchMember(code: string, url = SHEET_API_URL): Promise<MemberResult> {
  if (!MEMBER_CODE_RE.test(code)) return { status: "not_found" };
  if (!url) return { status: "unavailable" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${url}?action=member&kode=${encodeURIComponent(code)}`, { signal: controller.signal });
    if (!res.ok) return { status: "unavailable" };
    const body = (await res.json()) as { found?: boolean; data?: unknown };
    if (!body?.found) return { status: "not_found" };
    const member = resolveMember(body.data);
    return member ? { status: "found", member } : { status: "not_found" };
  } catch {
    return { status: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}

const local = (src: string): Photo => ({ thumb: src, full: src });

export const DEMO_MEMBER: Member = {
  code: DEMO_CODE,
  groupName: "Rombongan Contoh",
  date: new Date(2026, 10, 25),
  horse: "Zahra",
  coach: "Coach Fahd",
  riders: ["Aisyah", "Budi", "Fatimah", "Umar"],
  photos: [demo1, demo2, demo3, demo4, demo5, demo6].map(local),
  video: null,
  driveFolder: "",
  isDemo: true,
};
