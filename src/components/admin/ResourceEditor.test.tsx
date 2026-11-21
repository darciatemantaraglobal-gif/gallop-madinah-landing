import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// A tiny stand-in for the Supabase client that records what the editor asks for.
const calls: { op: string; table: string; payload?: unknown; eq?: [string, unknown] }[] = [];
let rows: Record<string, unknown>[] = [];
let nextError: { code: string; message: string } | null = null;

const builder = (table: string) => {
  const done = () => Promise.resolve({ data: rows, error: null });
  const write = (op: string, payload?: unknown) => {
    const result = () => {
      const error = nextError;
      nextError = null;
      return Promise.resolve({ data: null, error });
    };
    const entry = { op, table, payload } as (typeof calls)[number];
    calls.push(entry);
    return {
      eq: (k: string, v: unknown) => {
        entry.eq = [k, v];
        return result();
      },
      then: (ok: (v: unknown) => unknown, bad?: (e: unknown) => unknown) => result().then(ok, bad),
    };
  };
  const q = {
    select: () => q,
    order: () => q,
    limit: () => done(),
    insert: (p: unknown) => write("insert", p),
    update: (p: unknown) => write("update", p),
    delete: () => write("delete"),
  };
  return q;
};

vi.mock("@/lib/supabase", () => ({
  supabase: { from: (t: string) => builder(t) },
  MEDIA_BUCKET: "media",
  withTimeout: <T,>(p: T) => p,
  backendConnected: () => true,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }));

import ResourceEditor from "@/components/admin/ResourceEditor";
import { packagesConfig } from "@/pages/admin/resources";

const renderEditor = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ResourceEditor config={packagesConfig} />
    </QueryClientProvider>,
  );

beforeEach(() => {
  calls.length = 0;
  nextError = null;
  rows = [
    { id: "open_trip", name: "Open Trip", short_name: "Open Trip", price: 350, min_people: 20, features: ["horse"], featured: false, tiered: false, sort: 1 },
  ];
  window.scrollTo = vi.fn();
});

describe("ResourceEditor (packages)", () => {
  it("lists rows with their summary", async () => {
    renderEditor();
    expect(await screen.findByText("Open Trip")).toBeInTheDocument();
    expect(screen.getByText(/350 SAR \/ orang · min. 20 orang/)).toBeInTheDocument();
  });

  it("creates a row with converted values", async () => {
    renderEditor();
    await screen.findByText("Open Trip");
    fireEvent.click(screen.getByRole("button", { name: /tambah paket/i }));
    fireEvent.change(screen.getByLabelText(/^ID/), { target: { value: "vip" } });
    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: "VIP Ride" } });
    fireEvent.change(screen.getByLabelText(/nama pendek/i), { target: { value: "VIP" } });
    fireEvent.change(screen.getByLabelText(/harga per orang/i), { target: { value: "2.000" } });
    fireEvent.click(screen.getByRole("button", { name: /simpan/i }));

    await waitFor(() => expect(calls.find((c) => c.op === "insert")).toBeTruthy());
    expect(calls.find((c) => c.op === "insert")).toMatchObject({
      table: "packages",
      payload: { id: "vip", name: "VIP Ride", short_name: "VIP", price: 2000, min_people: 1, features: ["horse", "coach", "rest"] },
    });
  });

  it("blocks saving when a field is invalid", async () => {
    renderEditor();
    await screen.findByText("Open Trip");
    fireEvent.click(screen.getByRole("button", { name: /tambah paket/i }));
    fireEvent.change(screen.getByLabelText(/^ID/), { target: { value: "Bukan ID" } });
    fireEvent.click(screen.getByRole("button", { name: /simpan/i }));
    expect(await screen.findByText(/huruf kecil\/angka\/garis bawah/)).toBeInTheDocument();
    expect(calls.some((c) => c.op === "insert")).toBe(false);
  });

  it("updates an existing row by its key without touching the key", async () => {
    renderEditor();
    await screen.findByText("Open Trip");
    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    expect(screen.getByLabelText(/^ID/)).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/harga per orang/i), { target: { value: "400" } });
    fireEvent.click(screen.getByRole("button", { name: /simpan/i }));

    await waitFor(() => expect(calls.find((c) => c.op === "update")).toBeTruthy());
    const upd = calls.find((c) => c.op === "update")!;
    expect(upd.eq).toEqual(["id", "open_trip"]);
    expect(upd.payload).toMatchObject({ price: 400 });
    expect(upd.payload).not.toHaveProperty("id");
  });

  it("shows a friendly message when the database refuses", async () => {
    const { toast } = await import("sonner");
    renderEditor();
    await screen.findByText("Open Trip");
    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    nextError = { code: "42501", message: "new row violates row-level security policy" };
    fireEvent.click(screen.getByRole("button", { name: /simpan/i }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Akun ini tidak punya izin admin untuk perubahan ini."));
  });
});
