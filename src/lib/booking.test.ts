import { describe, expect, it } from "vitest";
import { BOOKING_CODE_RE, isPhoneLike, isoDate, makeBookingCode, readBookingParams } from "@/lib/booking";

describe("makeBookingCode", () => {
  it("makes a GM- code without ambiguous characters", () => {
    for (let i = 0; i < 200; i++) {
      const code = makeBookingCode();
      expect(code).toMatch(BOOKING_CODE_RE);
      expect(code.slice(3)).not.toMatch(/[01OIL]/);
    }
  });

  it("is deterministic for a given random source", () => {
    expect(makeBookingCode(() => new Uint8Array([0, 1, 2, 3, 4]))).toBe("GM-ABCDE");
  });
});

describe("isoDate", () => {
  it("uses the local calendar day", () => {
    expect(isoDate(new Date(2026, 11, 5, 23, 30))).toBe("2026-12-05");
  });
});

describe("isPhoneLike", () => {
  it.each(["+62 811-888-0818", "0811 888 0818", "+966 55 123 4567"])("accepts %s", (s) => {
    expect(isPhoneLike(s)).toBe(true);
  });
  it.each(["123", "nomor saya", "08-11"])("rejects %s", (s) => {
    expect(isPhoneLike(s)).toBe(false);
  });
});

describe("readBookingParams", () => {
  const pk = ["open_trip", "premium"];
  const ad = ["gmc", "drone"];

  it("reads a calculator link", () => {
    expect(readBookingParams("?paket=premium&orang=7&addon=drone,gmc", pk, ad)).toEqual({
      packageId: "premium",
      people: 7,
      addonIds: ["drone", "gmc"],
      agentCode: "",
    });
  });

  it("ignores unknown or unsafe values", () => {
    expect(readBookingParams("?paket=vip&orang=-3&addon=helicopter&agen=<script>", pk, ad)).toEqual({
      packageId: null,
      people: null,
      addonIds: [],
      agentCode: "",
    });
  });

  it("upper-cases a valid travel-partner code", () => {
    expect(readBookingParams("?agen=travelx", pk, ad).agentCode).toBe("TRAVELX");
  });
});
