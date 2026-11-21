import { describe, expect, it } from "vitest";
import { driveFileId, imageUrl } from "@/lib/drive";

const ID = "1AbCdEfGhIjKlMnOpQrStUvWxYz012345";

describe("driveFileId", () => {
  it.each([
    `https://drive.google.com/file/d/${ID}/view?usp=sharing`,
    `https://drive.google.com/open?id=${ID}`,
    `https://drive.google.com/uc?export=view&id=${ID}`,
    ID,
  ])("finds the id in %s", (input) => {
    expect(driveFileId(input)).toBe(ID);
  });

  it("returns null for other links", () => {
    expect(driveFileId("https://example.com/logo.png")).toBeNull();
  });
});

describe("imageUrl", () => {
  it("turns Drive links into thumbnail links", () => {
    expect(imageUrl(`https://drive.google.com/file/d/${ID}/view`, 600)).toBe(
      `https://drive.google.com/thumbnail?id=${ID}&sz=w600`,
    );
  });

  it("keeps other https links and paths on this site, drops anything else", () => {
    expect(imageUrl("https://example.com/logo.png")).toBe("https://example.com/logo.png");
    expect(imageUrl("/partners/lintas-haramain.png")).toBe("/partners/lintas-haramain.png");
    expect(imageUrl("//evil.example/logo.png")).toBe("");
    expect(imageUrl("http://example.com/logo.png")).toBe("");
    expect(imageUrl("javascript:alert(1)")).toBe("");
    expect(imageUrl("")).toBe("");
  });
});
