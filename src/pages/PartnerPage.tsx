import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import { Check, Copy, Download, Handshake, ImageDown, Link2, Loader2, MessageCircle, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HorseIcon from "@/components/icons/HorseIcon";
import poster from "@/assets/poster-gallop.jpg";
import promo1 from "@/assets/gallery-13.jpg";
import promo2 from "@/assets/gallery-21.jpg";
import promo3 from "@/assets/gallery-22.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteData } from "@/lib/siteData";
import { formatSar } from "@/lib/pricing";
import { AGENT_CODE_RE } from "@/lib/booking";
import { agentBookingUrl, DEMO_AGENT, DEMO_AGENT_CODE, fetchAgent, type Agent } from "@/lib/agent";
import { usePageMeta } from "@/lib/usePageMeta";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/whatsapp";

const PROMO = [
  { src: poster, file: "gallop-madinah-poster.jpg" },
  { src: promo1, file: "gallop-madinah-1.jpg" },
  { src: promo2, file: "gallop-madinah-2.jpg" },
  { src: promo3, file: "gallop-madinah-3.jpg" },
];

const card = "border border-border bg-card p-5 md:p-7";
const h2 = "flex items-center gap-2.5 font-display text-lg md:text-xl text-foreground mb-4";

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-28 md:pt-36 pb-20 md:pb-28">{children}</main>
    <Footer />
  </div>
);

const useCopy = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked */
    }
  };
  return { copied, copy };
};

const PartnerView = ({ agent }: { agent: Agent }) => {
  const { t } = useLanguage();
  const { prices } = useSiteData();
  const { copied, copy } = useCopy();
  const [qr, setQr] = useState("");
  const bookingUrl = agentBookingUrl(window.location.origin, agent.code);
  const promoText = t("partner.promo.text").replace("{link}", bookingUrl);

  useEffect(() => {
    QRCode.toDataURL(bookingUrl, { margin: 1, width: 520, color: { dark: "#111111", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [bookingUrl]);

  useEffect(() => {
    track("partner_view", { agen: agent.code, demo: Boolean(agent.isDemo) });
  }, [agent.code, agent.isDemo]);

  const openTrip = prices.packages.find((p) => !p.tiered);
  const premium = prices.packages.find((p) => p.tiered);
  const premiumFrom = Math.min(...prices.groupTiers.flatMap((g) => (g.price ? [g.price] : [])));
  const rows = [
    openTrip && {
      name: openTrip.name,
      note: openTrip.minPeople > 1 ? t("price.min").replace("{n}", String(openTrip.minPeople)) : "",
      publicPrice: formatSar(openTrip.price),
      agentPrice: agent.priceOpenTrip,
    },
    premium && {
      name: premium.name,
      note: "",
      publicPrice: `${t("calc.from")} ${formatSar(premiumFrom)}`,
      agentPrice: agent.pricePremium,
    },
  ].filter(Boolean) as { name: string; note: string; publicPrice: string; agentPrice: number | null }[];

  const copyBtn = (key: string, text: string, label: string) => (
    <button
      type="button"
      onClick={() => {
        copy(key, text);
        track("partner_copy", { agen: agent.code, what: key });
      }}
      className="flex-1 inline-flex items-center justify-center gap-2 border border-gold/60 text-gold px-4 py-3 font-body text-xs tracking-[0.15em] uppercase hover:bg-gold/10"
    >
      {copied === key ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied === key ? t("member.copied") : label}
    </button>
  );

  return (
    <div className="container mx-auto px-5 md:px-8 max-w-4xl space-y-5 md:space-y-6">
      {agent.isDemo && (
        <p className="border border-gold/40 bg-gold/10 text-gold font-body text-sm px-4 py-3 text-center">{t("partner.demo")}</p>
      )}

      <div className="text-center">
        <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3">{t("partner.subtitle")}</p>
        <h1 className="font-display text-2xl md:text-4xl text-foreground mb-3">{agent.name}</h1>
        <p className="text-muted-foreground font-body text-sm md:text-base max-w-xl mx-auto">{t("partner.desc")}</p>
      </div>

      {/* Personal booking link */}
      <section className={`${card} border-gold/40`}>
        <h2 className={h2}>
          <Link2 className="w-5 h-5 text-gold" strokeWidth={1.5} /> {t("partner.link.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-muted-foreground mb-2">{t("partner.link.desc")}</p>
            <p dir="ltr" className="font-body text-sm md:text-base text-foreground bg-background border border-border px-3.5 py-3 break-all">
              {bookingUrl}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-2">
              {t("booking.agent")}: <span className="text-gold font-bold tracking-[0.1em]">{agent.code}</span>
            </p>
          </div>
          {qr && (
            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <img src={qr} alt={t("partner.qr")} className="w-28 h-28 md:w-32 md:h-32 bg-white p-1.5" />
              <a href={qr} download={`gallop-booking-${agent.code}.png`} className="inline-flex items-center gap-1.5 text-gold font-body text-xs hover:text-gold-highlight">
                <Download className="w-3.5 h-3.5" /> {t("member.qr.download")}
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          {copyBtn("link", bookingUrl, t("member.copy"))}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(promoText)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("partner_share", { agen: agent.code })}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground px-4 py-3 font-body font-bold text-xs tracking-[0.15em] uppercase hover:bg-gold-highlight"
          >
            <Share2 className="w-4 h-4" /> {t("partner.share.wa")}
          </a>
        </div>
      </section>

      {/* Agent prices */}
      <section className={card}>
        <h2 className={h2}>
          <Handshake className="w-5 h-5 text-gold" strokeWidth={1.5} /> {t("partner.prices.title")}
        </h2>
        <div className="border border-border">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2.5 border-b border-border bg-background/60 font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
            <span>{t("calc.package")}</span>
            <span className="text-end">{t("partner.prices.public")}</span>
            <span className="text-end text-gold">{t("partner.prices.agent")}</span>
          </div>
          {rows.map((r) => (
            <div key={r.name} className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center px-4 py-3.5 border-b last:border-b-0 border-border font-body">
              <span className="min-w-0">
                <span className="block text-sm text-foreground">{r.name}</span>
                {r.note && <span className="block text-xs text-muted-foreground">{r.note}</span>}
              </span>
              <span className="text-end text-sm text-muted-foreground whitespace-nowrap">{r.publicPrice}</span>
              <span className="text-end text-base font-bold text-gold whitespace-nowrap">
                {r.agentPrice ? formatSar(r.agentPrice) : t("partner.prices.ask")}
              </span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground font-note font-light text-xs mt-3">{t("partner.prices.note")}</p>
      </section>

      {/* Ready-made message */}
      <section className={card}>
        <h2 className={h2}>
          <MessageCircle className="w-5 h-5 text-gold" strokeWidth={1.5} /> {t("partner.promo.title")}
        </h2>
        <p className="font-body text-sm text-muted-foreground mb-3">{t("partner.promo.desc")}</p>
        <pre className="whitespace-pre-wrap font-body text-sm text-foreground/90 bg-background border border-border p-4 mb-3">{promoText}</pre>
        <div className="flex">{copyBtn("promo", promoText, t("partner.promo.copy"))}</div>
      </section>

      {/* Promo images */}
      <section className={card}>
        <h2 className={h2}>
          <ImageDown className="w-5 h-5 text-gold" strokeWidth={1.5} /> {t("partner.media.title")}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROMO.map((m) => (
            <li key={m.file}>
              <a
                href={m.src}
                download={m.file}
                onClick={() => track("partner_media_download", { agen: agent.code, file: m.file })}
                className="group block relative aspect-[4/5] overflow-hidden bg-background"
              >
                <img src={m.src} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/70 text-white font-body text-[11px] py-1.5">
                  <Download className="w-3.5 h-3.5" /> {t("partner.media.download")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className={card}>
        <h2 className={h2}>{t("partner.how.title")}</h2>
        <ol className="space-y-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="flex gap-3 font-body text-sm text-foreground/90">
              <span className="w-6 h-6 rounded-full border border-gold/60 text-gold text-xs flex items-center justify-center flex-shrink-0">{n}</span>
              {t(`partner.how.${n}`)}
            </li>
          ))}
        </ol>
        <a
          href={waLink(t("partner.contact.wa").replace("{name}", agent.name).replace("{code}", agent.code))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-gold font-body text-sm hover:text-gold-highlight"
        >
          <MessageCircle className="w-4 h-4" /> {t("partner.contact")}
        </a>
      </section>
    </div>
  );
};

// /partner/:kode — travel agent portal. Data comes from the Sheet ("Agen" tab).
const PartnerPage = () => {
  const { t } = useLanguage();
  const code = (useParams().kode ?? "").toUpperCase();
  const isDemo = code === DEMO_AGENT_CODE;
  usePageMeta(`${t("partner.subtitle")} · Gallop Madinah`, { noindex: true });

  const { data, isLoading } = useQuery({
    queryKey: ["agent", code],
    queryFn: () => fetchAgent(code),
    enabled: !isDemo && AGENT_CODE_RE.test(code),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (isDemo)
    return (
      <Shell>
        <PartnerView agent={DEMO_AGENT} />
      </Shell>
    );

  if (isLoading)
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground font-body text-sm">
          <Loader2 className="w-7 h-7 text-gold animate-spin" />
          {t("member.loading")}
        </div>
      </Shell>
    );

  if (data?.status === "found")
    return (
      <Shell>
        <PartnerView agent={data.agent} />
      </Shell>
    );

  const unavailable = data?.status === "unavailable";
  return (
    <Shell>
      <div className="container mx-auto px-5 max-w-md text-center py-10">
        <HorseIcon className="w-12 h-12 text-gold mx-auto mb-5" />
        <h1 className="font-display text-xl md:text-2xl text-foreground mb-3">
          {unavailable ? t("member.unavailable.title") : t("member.notfound.title")}
        </h1>
        <p className="text-muted-foreground font-body text-sm mb-7">
          {unavailable ? t("member.unavailable.desc") : t("partner.notfound.desc").replace("{code}", code || "-")}
        </p>
        <a
          href={waLink(t("partner.contact.wa").replace("{name}", "-").replace("{code}", code || "-"))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground px-8 py-3.5 font-body font-bold text-xs tracking-[0.15em] uppercase"
        >
          {t("member.help")}
        </a>
        <div className="mt-6">
          <Link to="/" className="text-muted-foreground hover:text-gold font-body text-xs tracking-[0.15em] uppercase">
            {t("reg.back")}
          </Link>
        </div>
      </div>
    </Shell>
  );
};

export default PartnerPage;
