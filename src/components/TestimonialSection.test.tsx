import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TestimonialList } from "@/components/TestimonialSection";

const t = (name: string, rating = 5) => ({ name, origin: "Jakarta", rating, text: `Ulasan dari ${name}` });

const renderList = (n: number, links = { mapsUrl: "", writeReviewUrl: "" }) =>
  render(
    <LanguageProvider>
      <TestimonialList testimonials={Array.from({ length: n }, (_, i) => t(`Tamu ${i + 1}`))} {...links} />
    </LanguageProvider>,
  );

describe("TestimonialList", () => {
  it("stays hidden with fewer than 3 testimonials", () => {
    const { container } = renderList(2);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows every testimonial from 3 up", () => {
    renderList(3);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Ulasan dari Tamu 2")).toBeInTheDocument();
  });

  it("shows the Google buttons only when links are set", () => {
    renderList(3);
    expect(screen.queryByRole("link")).toBeNull();
    renderList(3, { mapsUrl: "https://maps.app.goo.gl/abc", writeReviewUrl: "" });
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://maps.app.goo.gl/abc");
  });
});
