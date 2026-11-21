import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FolderOpen,
  Instagram,
  Loader2,
  PlayCircle,
  Share2,
  User,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HorseIcon from "@/components/icons/HorseIcon";
import CertificateMaker from "@/components/member/CertificateMaker";
import logo from "@/assets/logo-landscape.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_CODE, DEMO_MEMBER, fetchMember, MEMBER_CODE_RE, type Member } from "@/lib/member";
import { longDate } from "@/lib/booking";
import { usePageMeta } from "@/lib/usePageMeta";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/whatsapp";

const INSTAGRAM = "https://www.instagram.com/gallopmadinah";

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-28 md:pt-36 pb-20 md:pb-28">{children}</main>
    <Footer />
  </div>
);

/** Full-screen photo viewer with swipe-free prev/next buttons and arrow keys. */
const Lightbox = ({ photos, index, onClose, onMove }: { photos: Member["photos"]; index: number; onClose: () => void; onMove: (i: number) => void }) => {
  const { t } = useLanguage();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onMove((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, photos.length, onClose, onMove]);

  return (
    // Photo viewers keep left = previous / right = next in every language.
    <div dir="ltr" className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center" role="dialog" aria-modal="true">
      <button type="button" onClick={onClose} aria-label={t("member.close")} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white">
        <X className="w-7 h-7" />
      </button>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => onMove((index - 1 + photos.length) % photos.length)}
            aria-label={t("member.prev")}
            className="absolute left-2 md:left-6 p-3 text-white/80 hover:text-white"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={() => onMove((index + 1) % photos.length)}
            aria-label={t("member.next")}
            className="absolute right-2 md:right-6 p-3 text-white/80 hover:text-white"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}
      <img src={photos[index].full} alt="" referrerPolicy="no-referrer" className="max-w-[92vw] max-h-[82vh] object-contain" />
      <p className="absolute bottom-5 inset-x-0 text-center text-white/70 font-body text-sm">
        {index + 1} / {photos.length}
      </p>
    </div>
  );
};

const MemberView = ({ member }: { member: Member }) => {
  const { t, lang } = useLanguage();
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const pageUrl = `${window.location.origin}/member/${member.code}`;

  useEffect(() => {
    QRCode.toDataURL(pageUrl, { margin: 1, width: 520, color: { dark: "#111111", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [pageUrl]);

  useEffect(() => {
    track("member_view", { demo: Boolean(member.isDemo) });
  }, [member.isDemo]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const shareText = t("member.share.text").replace("{group}", member.groupName || "Gallop Madinah");
  const share = async () => {
    track("member_share");
    if (navigator.share) {
      try {
        await navigator.share({ title: "Gallop Madinah", text: shareText, url: pageUrl });
        return;
      } catch {
        return; // cancelled
      }
    }
    copy();
  };

  const closeLightbox = useCallback(() => setOpen(null), []);

  return (
    <div className="container mx-auto px-5 md:px-8 max-w-5xl space-y-5 md:space-y-6">
      {member.isDemo && (
        <p className="border border-gold/40 bg-gold/10 text-gold font-body text-sm px-4 py-3 text-center">{t("member.demo")}</p>
      )}

      {/* Header */}
      <div className="text-center">
        <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3">{t("member.subtitle")}</p>
        <h1 className="font-display text-2xl md:text-4xl text-foreground mb-4">{member.groupName || member.code}</h1>
        <div className="flex flex-wrap justify-center gap-2">
          {member.date && (
            <span className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-xs md:text-sm text-foreground/85">
              <CalendarDays className="w-4 h-4 text-gold" strokeWidth={1.5} /> {longDate(member.date, lang)}
            </span>
          )}
          {member.horse && (
            <span className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-xs md:text-sm text-foreground/85">
              <HorseIcon className="w-4 h-4 text-gold" /> {member.horse}
            </span>
          )}
          {member.coach && (
            <span className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-xs md:text-sm text-foreground/85">
              <User className="w-4 h-4 text-gold" strokeWidth={1.5} /> {member.coach}
            </span>
          )}
        </div>
      </div>

      {/* The member card */}
      <section className="relative overflow-hidden border border-gold/50 bg-gradient-to-br from-[#1b1a16] via-card to-[#0d0d0d] p-5 md:p-8">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row gap-6 sm:items-center">
          <div className="flex-1 min-w-0">
            <img src={logo} alt="Gallop Madinah" className="h-8 md:h-9 w-auto mb-5" />
            <p className="text-gold font-body text-[11px] tracking-[0.3em] uppercase mb-1">{t("member.card")}</p>
            <p className="font-display text-xl md:text-2xl text-foreground leading-tight mb-4 break-words">
              {member.groupName || "Gallop Madinah"}
            </p>
            <div className="flex gap-6 font-body">
              <div>
                <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">{t("member.code")}</p>
                <p className="text-foreground font-bold tracking-[0.12em]">{member.code}</p>
              </div>
              {member.riders.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">{t("member.riders")}</p>
                  <p className="text-foreground font-bold">{member.riders.length}</p>
                </div>
              )}
            </div>
          </div>
          {qr && (
            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <img src={qr} alt={t("member.qr")} className="w-28 h-28 md:w-36 md:h-36 bg-white p-1.5" />
              <a
                href={qr}
                download={`gallop-member-${member.code}.png`}
                onClick={() => track("member_qr_download")}
                className="inline-flex items-center gap-1.5 text-gold font-body text-xs hover:text-gold-highlight"
              >
                <Download className="w-3.5 h-3.5" /> {t("member.qr.download")}
              </a>
            </div>
          )}
        </div>
        <div className="relative flex flex-col sm:flex-row gap-2 mt-6">
          <button
            type="button"
            onClick={share}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground px-4 py-3 font-body font-bold text-xs tracking-[0.15em] uppercase hover:bg-gold-highlight"
          >
            <Share2 className="w-4 h-4" /> {t("member.share")}
          </button>
          <button
            type="button"
            onClick={copy}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gold/60 text-gold px-4 py-3 font-body text-xs tracking-[0.15em] uppercase hover:bg-gold/10"
          >
            <Copy className="w-4 h-4" /> {copied ? t("member.copied") : t("member.copy")}
          </button>
        </div>
      </section>

      {/* Photos */}
      {member.photos.length > 0 && (
        <section>
          <h2 className="font-display text-lg md:text-xl text-foreground mb-3">{t("member.photos")}</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2">
            {member.photos.map((p, i) => (
              <li key={p.thumb}>
                <button type="button" onClick={() => setOpen(i)} className="block w-full aspect-square overflow-hidden bg-card">
                  <img
                    src={p.thumb}
                    alt={`${t("member.photo")} ${i + 1}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Video */}
      {member.video && (
        <section>
          <h2 className="font-display text-lg md:text-xl text-foreground mb-3">{t("member.video")}</h2>
          {member.video.embed ? (
            <div className="relative w-full aspect-video bg-card border border-border">
              <iframe
                src={member.video.embed}
                title={t("member.video")}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <a
              href={member.video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold/60 text-gold px-6 py-3 font-body text-xs tracking-[0.15em] uppercase hover:bg-gold/10"
            >
              <PlayCircle className="w-4 h-4" /> {t("member.video.open")}
            </a>
          )}
        </section>
      )}

      {/* All files */}
      {member.driveFolder && (
        <a
          href={member.driveFolder}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("member_drive_open")}
          className="flex items-center gap-4 border border-border bg-card p-5 hover:border-gold/50 transition-colors"
        >
          <FolderOpen className="w-8 h-8 text-gold flex-shrink-0" strokeWidth={1.25} />
          <span className="flex-1">
            <span className="block font-body font-bold text-base text-foreground">{t("member.drive")}</span>
            <span className="block text-muted-foreground font-body text-sm">{t("member.drive.desc")}</span>
          </span>
          <ChevronRight className="w-5 h-5 text-gold" />
        </a>
      )}

      <CertificateMaker member={member} />

      {/* Instagram */}
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 border border-border bg-card p-5 hover:border-gold/50 transition-colors"
      >
        <Instagram className="w-7 h-7 text-gold flex-shrink-0" strokeWidth={1.5} />
        <span className="flex-1 font-body text-sm text-foreground/90">{t("member.instagram")}</span>
        <ChevronRight className="w-5 h-5 text-gold" />
      </a>

      {open !== null && <Lightbox photos={member.photos} index={open} onClose={closeLightbox} onMove={setOpen} />}
    </div>
  );
};

// /member/:kode — a rider group's private page. Data comes from the database via get_member().
const MemberPage = () => {
  const { t } = useLanguage();
  const code = (useParams().kode ?? "").toUpperCase();
  const isDemo = code === DEMO_CODE;
  usePageMeta(`${t("member.subtitle")} · Gallop Madinah`, { noindex: true });

  const { data, isLoading } = useQuery({
    queryKey: ["member", code],
    queryFn: () => fetchMember(code),
    enabled: !isDemo && MEMBER_CODE_RE.test(code),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (isDemo)
    return (
      <Shell>
        <MemberView member={DEMO_MEMBER} />
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
        <MemberView member={data.member} />
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
          {unavailable ? t("member.unavailable.desc") : t("member.notfound.desc").replace("{code}", code || "-")}
        </p>
        <a
          href={waLink(t("member.help.wa").replace("{code}", code || "-"))}
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

export default MemberPage;
