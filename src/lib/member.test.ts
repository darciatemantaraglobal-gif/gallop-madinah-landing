import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchMember, parseDay, resolveMember, videoFrom } from "@/lib/member";

const DRIVE_ID = "1AbCdEfGhIjKlMnOpQrStUvWxYz012345";

/** Stand-in for supabase.rpc() returning `result`. */
const rpcClient = (result: { data: unknown; error: unknown } | Error) =>
  ({
    rpc: () => (result instanceof Error ? Promise.reject(result) : Promise.resolve(result)),
  }) as unknown as SupabaseClient;

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
  it("checks every link in a database row", () => {
    const m = resolveMember({
      code: "gm-7k2qx",
      group_name: "Rombongan Lintas",
      ride_date: "2026-12-20",
      horse: "Zahra",
      coach: "Fahd",
      riders: ["Aisyah", " ", "Budi"],
      photos: [DRIVE_ID, "https://xyz.supabase.co/storage/v1/object/public/media/members/a.jpg", "http://insecure/x.jpg"],
      video_url: null,
      drive_folder: "https://evil.example/drive",
    })!;
    expect(m.code).toBe("GM-7K2QX");
    expect(m.riders).toEqual(["Aisyah", "Budi"]);
    expect(m.photos.map((p) => p.thumb)).toEqual([
      `https://drive.google.com/thumbnail?id=${DRIVE_ID}&sz=w800`,
      "https://xyz.supabase.co/storage/v1/object/public/media/members/a.jpg",
    ]);
    expect(m.driveFolder).toBe("");
    expect(m.video).toBeNull();
    expect(m.date?.getDate()).toBe(20);
  });

  it("copes with null columns", () => {
    const m = resolveMember({ code: "GM-ABCDE", group_name: null, ride_date: null, riders: null, photos: null })!;
    expect(m).toMatchObject({ groupName: "", date: null, riders: [], photos: [] });
  });
});

describe("fetchMember", () => {
  it("rejects malformed codes and reports a missing database", async () => {
    expect(await fetchMember("<x>", rpcClient({ data: null, error: null }))).toEqual({ status: "not_found" });
    expect(await fetchMember("ABC123", null)).toEqual({ status: "unavailable" });
  });

  it("maps found / not found / errors", async () => {
    expect((await fetchMember("ABC123", rpcClient({ data: { code: "ABC123" }, error: null }))).status).toBe("found");
    expect(await fetchMember("ABC123", rpcClient({ data: null, error: null }))).toEqual({ status: "not_found" });
    expect(await fetchMember("ABC123", rpcClient({ data: null, error: { message: "x" } }))).toEqual({ status: "unavailable" });
    expect(await fetchMember("ABC123", rpcClient(new Error("offline")))).toEqual({ status: "unavailable" });
  });
});
