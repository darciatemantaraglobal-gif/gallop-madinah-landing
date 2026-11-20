import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchMember, parseDay, resolveMember, videoFrom } from "@/lib/member";

const DRIVE_ID = "1AbCdEfGhIjKlMnOpQrStUvWxYz012345";

afterEach(() => vi.restoreAllMocks());

describe("videoFrom", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["https://youtube.com/shorts/dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    [`https://drive.google.com/file/d/${DRIVE_ID}/view`, `https://drive.google.com/file/d/${DRIVE_ID}/preview`],
  ])("embeds %s", (url, embed) => {
    expect(videoFrom(url)?.embed).toBe(embed);
  });

  it("links other https videos without embedding, and drops unsafe links", () => {
    expect(videoFrom("https://vimeo.com/123")).toEqual({ embed: null, link: "https://vimeo.com/123" });
    expect(videoFrom("javascript:alert(1)")).toBeNull();
    expect(videoFrom("")).toBeNull();
  });
});

describe("parseDay", () => {
  it("reads yyyy-mm-dd as a local date", () => {
    const d = parseDay("2026-12-20")!;
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 11, 20]);
    expect(parseDay("20/12/2026")).toBeNull();
  });
});

describe("resolveMember", () => {
  it("turns Drive ids into image links and keeps only a Drive folder link", () => {
    const m = resolveMember({
      kode: "abc123",
      namaGrup: "Rombongan Lintas",
      tanggal: "2026-12-20",
      kuda: "Zahra",
      coach: "Fahd",
      peserta: ["Aisyah", " ", "Budi"],
      foto: [DRIVE_ID, "http://insecure/x.jpg"],
      videoUrl: "",
      driveFolder: "https://evil.example/drive",
    })!;
    expect(m.code).toBe("ABC123");
    expect(m.riders).toEqual(["Aisyah", "Budi"]);
    expect(m.photos).toEqual([
      {
        thumb: `https://drive.google.com/thumbnail?id=${DRIVE_ID}&sz=w800`,
        full: `https://drive.google.com/thumbnail?id=${DRIVE_ID}&sz=w2000`,
      },
    ]);
    expect(m.driveFolder).toBe("");
    expect(m.video).toBeNull();
  });
});

describe("fetchMember", () => {
  const respond = (body: unknown) =>
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => body } as Response);

  it("rejects malformed codes without calling the Sheet", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    expect(await fetchMember("<x>", "https://example.test")).toEqual({ status: "not_found" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("reports when the Sheet is not connected", async () => {
    expect(await fetchMember("ABC123", "")).toEqual({ status: "unavailable" });
  });

  it("maps found / not found / network errors", async () => {
    respond({ found: true, data: { kode: "ABC123", namaGrup: "Grup" } });
    expect((await fetchMember("ABC123", "https://example.test")).status).toBe("found");
    respond({ found: false });
    expect(await fetchMember("ABC123", "https://example.test")).toEqual({ status: "not_found" });
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    expect(await fetchMember("ABC123", "https://example.test")).toEqual({ status: "unavailable" });
  });
});
