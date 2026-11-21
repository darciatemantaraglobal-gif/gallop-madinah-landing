import { Star, Quote, ExternalLink, PenLine } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteData } from "@/lib/siteData";
import { track } from "@/lib/analytics";
import type { Testimonial } from "@/data/siteData";

/** Fewer than this and the section stays hidden: an almost-empty review wall hurts more than it helps. */
export const MIN_TESTIMONIALS = 3;

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" role="img" aria-label={`${rating}/5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-gold fill-gold" : "text-muted-foreground/30"}`} strokeWidth={1.5} />
    ))}
  </div>
);

export const TestimonialList = ({
  testimonials,
  mapsUrl,
  writeReviewUrl,
}: {
  testimonials: Testimonial[];
  mapsUrl: string;
  writeReviewUrl: string;
}) => {
  const { t } = useLanguage();
  if (testimonials.length < MIN_TESTIMONIALS) return null;

  return (
    <section id="testimoni" className="py-16 md:py-24 bg-card border-t border-border scroll-mt-16">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">{t("testi.subtitle")}</p>
          <h2 className="font-display text-2xl md:text-4xl text-foreground">
            {t("testi.title1")} <span className="text-gold">{t("testi.title2")}</span>
          </h2>
        </div>

        {/* Phones: swipe sideways. Desktop: grid. */}
        <ul className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {testimonials.map((r, i) => (
            <li
              key={`${r.name}-${i}`}
              className="snap-start flex-shrink-0 w-[82%] sm:w-[48%] md:w-auto bg-background border border-border p-5 md:p-7 flex flex-col"
            >
              <Quote className="w-6 h-6 text-gold/50 mb-3" strokeWidth={1.5} />
              <blockquote className="font-body text-sm md:text-[15px] leading-relaxed text-foreground/90 mb-5 flex-1">{r.text}</blockquote>
              <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
                <div className="min-w-0">
                  <p className="font-body font-bold text-sm text-foreground truncate">{r.name}</p>
                  {r.origin && <p className="text-muted-foreground font-body text-xs truncate">{r.origin}</p>}
                </div>
                <Stars rating={r.rating} />
              </div>
            </li>
          ))}
        </ul>
        {testimonials.length > 1 && (
          <p className="md:hidden text-center text-muted-foreground font-body text-xs mt-3">{t("testi.swipe")}</p>
        )}

        {(mapsUrl || writeReviewUrl) && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 mt-8 md:mt-10">
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("reviews_open")}
                className="inline-flex items-center justify-center gap-2 border border-gold/60 text-gold px-6 py-3 font-body text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-primary-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> {t("testi.google")}
              </a>
            )}
            {writeReviewUrl && (
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("review_write")}
                className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-gold px-6 py-3 font-body text-xs tracking-[0.15em] uppercase transition-colors"
              >
                <PenLine className="w-4 h-4" /> {t("testi.write")}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

// Real customer reviews from the database (Testimoni tab in /admin). Hidden until there are enough.
const TestimonialSection = () => {
  const { testimonials, reviews } = useSiteData();
  return <TestimonialList testimonials={testimonials} mapsUrl={reviews.mapsUrl} writeReviewUrl={reviews.writeReviewUrl} />;
};

export default TestimonialSection;
