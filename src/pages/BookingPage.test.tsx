import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import BookingPage from "@/pages/BookingPage";

const renderAt = (url: string) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LanguageProvider>
        <MemoryRouter initialEntries={[url]}>
          <BookingPage />
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  );

/** Picks today's date on the calendar (today is always bookable). */
const pickToday = () => {
  const day = String(new Date().getDate());
  const grid = screen.getByRole("grid");
  const btn = within(grid)
    .getAllByRole("gridcell", { name: day })
    .find((b) => !b.hasAttribute("disabled") && !b.className.includes("day-outside"));
  fireEvent.click(btn!);
};

let openSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  localStorage.setItem("lang", "id");
  openSpy = vi.fn(() => ({ opener: {} }));
  vi.stubGlobal("open", openSpy);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("BookingPage", () => {
  it("does not send until date, time and name are filled in", () => {
    renderAt("/booking");
    fireEvent.click(screen.getByRole("button", { name: /kirim booking/i }));
    expect(openSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Pilih tanggal dulu.")).toBeInTheDocument();
    expect(screen.getByText("Pilih waktu.")).toBeInTheDocument();
    expect(screen.getByText("Isi nama pemesan.")).toBeInTheDocument();
  });

  it("pre-fills from the calculator link and sends every detail to WhatsApp", () => {
    renderAt("/booking?paket=premium&orang=4&addon=drone&agen=travelx");

    expect(screen.getByLabelText("Jumlah orang")).toHaveValue(4);
    pickToday();
    fireEvent.click(screen.getByRole("button", { name: "Pagi" }));
    fireEvent.change(screen.getByLabelText("Nama pemesan"), { target: { value: "Aisyah" } });
    fireEvent.change(screen.getByLabelText(/hotel/i), { target: { value: "Pullman Zamzam" } });
    fireEvent.click(screen.getByRole("button", { name: /kirim booking/i }));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = new URL(openSpy.mock.calls[0][0] as string);
    expect(url.host).toBe("wa.me");
    const text = url.searchParams.get("text")!;
    expect(text).toMatch(/Kode: GM-[A-Z0-9]{5}/);
    expect(text).toContain("Paket: Premium Experience");
    expect(text).toContain("Waktu: Pagi");
    expect(text).toContain("Jumlah: 4 orang");
    expect(text).toContain("Tambahan: Video drone");
    expect(text).toContain("Estimasi total: 4.000 SAR"); // 4 × 850 + 600
    expect(text).toContain("Nama pemesan: Aisyah");
    expect(text).toContain("Hotel: Pullman Zamzam");
    expect(text).toContain("Kode partner: TRAVELX");

    // Thank-you screen with the same code and the registration link
    const code = text.match(/GM-[A-Z0-9]{5}/)![0];
    expect(screen.getByText(code)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /isi data peserta/i })).toHaveAttribute(
      "href",
      `/registrasi?booking=${code}&orang=4`,
    );
  });

  it("will not send an Open Trip booking below its minimum group", () => {
    renderAt("/booking?paket=open_trip&orang=5");
    pickToday();
    fireEvent.click(screen.getByRole("button", { name: "Sore" }));
    fireEvent.change(screen.getByLabelText("Nama pemesan"), { target: { value: "Budi" } });
    fireEvent.click(screen.getByRole("button", { name: /kirim booking/i }));
    expect(openSpy).not.toHaveBeenCalled();
    expect(screen.getByText(/belum bisa untuk jumlah orang/i)).toBeInTheDocument();
  });
});
