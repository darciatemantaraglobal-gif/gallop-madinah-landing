import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Minimal Supabase stand-in: list rows, record deletes.
let rows: Record<string, unknown>[] = [];
const deletes: unknown[][] = [];

const builder = () => {
  const q = {
    select: () => q,
    order: () => q,
    limit: () => q,
    eq: () => q,
    then: (ok: (v: unknown) => unknown, bad?: (e: unknown) => unknown) => Promise.resolve({ data: rows, error: null }).then(ok, bad),
    delete: () => ({
      in: (_k: string, ids: unknown[]) => {
        deletes.push(ids);
        rows = rows.filter((r) => !ids.includes(r.id));
        return Promise.resolve({ error: null });
      },
    }),
  };
  return q;
};

vi.mock("@/lib/supabase", () => ({
  supabase: { from: () => builder() },
  MEDIA_BUCKET: "media",
  withTimeout: <T,>(p: T) => p,
  backendConnected: () => true,
}));
vi.mock("@/lib/siteData", () => ({ useSiteData: () => ({ safety: { minAge: 7, maxWeight: 100 } }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }));

import RegistrationsSection from "@/pages/admin/RegistrationsSection";

const renderSection = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <RegistrationsSection filter="" onFilter={() => {}} />
    </QueryClientProvider>,
  );

beforeEach(() => {
  deletes.length = 0;
  rows = [
    { id: 1, booking_code: "GM-AAAAA", name: "Budi", age: 20, weight: 70, experience: "none" },
    { id: 2, booking_code: "GM-AAAAA", name: "Siti", age: 18, weight: 55, experience: "some" },
    { id: 3, booking_code: "GM-BBBBB", name: "Ali", age: 30, weight: 80, experience: "regular" },
  ];
});

describe("RegistrationsSection delete", () => {
  it("deletes one rider after confirming", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderSection();
    fireEvent.click(await screen.findByRole("button", { name: "Hapus Budi" }));
    await waitFor(() => expect(deletes).toEqual([[1]]));
    await waitFor(() => expect(screen.queryByText("Budi")).not.toBeInTheDocument());
    expect(screen.getByText("Siti")).toBeInTheDocument();
  });

  it("deletes only the riders of that booking with Hapus semua", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderSection();
    await screen.findByText("Budi");
    fireEvent.click(screen.getAllByRole("button", { name: /hapus semua/i })[0]);
    await waitFor(() => expect(deletes).toEqual([[1, 2]]));
    await waitFor(() => expect(screen.queryByText("Siti")).not.toBeInTheDocument());
    expect(screen.getByText("Ali")).toBeInTheDocument();
  });

  it("does nothing when the admin cancels", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderSection();
    fireEvent.click(await screen.findByRole("button", { name: "Hapus Budi" }));
    expect(deletes).toEqual([]);
    expect(screen.getByText("Budi")).toBeInTheDocument();
  });
});
