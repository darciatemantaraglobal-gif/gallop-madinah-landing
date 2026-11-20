import { useEffect, useRef, useState } from "react";
import { Award, Download, Loader2, Share2 } from "lucide-react";
import logo from "@/assets/logo-landscape.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { canvasToBlob, certificateFileName, drawCertificate } from "@/lib/certificate";
import { track } from "@/lib/analytics";
import type { Member } from "@/lib/member";

// Pick a rider (or type a name), preview the certificate, then save or share it.
const CertificateMaker = ({ member }: { member: Member }) => {
  const { t, lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState(member.riders[0] ?? "");
  const [custom, setCustom] = useState(member.riders.length === 0);
  const [busy, setBusy] = useState(true);
  const [canShareFiles, setCanShareFiles] = useState(false);

  // Redraw whenever the name or language changes (a short pause while typing).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setBusy(true);
    const id = window.setTimeout(async () => {
      await drawCertificate(
        canvas,
        { name, date: member.date, horse: member.horse, coach: member.coach, code: member.isDemo ? "" : member.code, lang },
        logo,
      );
      setBusy(false);
    }, 200);
    return () => window.clearTimeout(id);
  }, [name, lang, member]);

  useEffect(() => {
    try {
      const probe = new File([new Blob(["x"])], "x.png", { type: "image/png" });
      setCanShareFiles(Boolean(navigator.canShare?.({ files: [probe] })));
    } catch {
      setCanShareFiles(false);
    }
  }, []);

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await canvasToBlob(canvas);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = certificateFileName(name);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    track("certificate_download");
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await canvasToBlob(canvas);
    if (!blob) return;
    const file = new File([blob], certificateFileName(name), { type: "image/png" });
    try {
      await navigator.share({ files: [file], title: "First Gallop", text: t("cert.share.text") });
      track("certificate_share");
    } catch {
      /* cancelled */
    }
  };

  const chip = (on: boolean) =>
    `border px-3.5 py-2 font-body text-sm transition-colors ${on ? "border-gold bg-forest/40 text-foreground" : "border-border text-foreground/80 hover:border-gold/40"}`;

  return (
    <section className="border border-gold/30 bg-card p-5 md:p-8">
      <div className="flex items-center gap-2.5 mb-1.5">
        <Award className="w-5 h-5 text-gold" strokeWidth={1.5} />
        <h2 className="font-display text-lg md:text-xl text-foreground">{t("cert.title")}</h2>
      </div>
      <p className="text-muted-foreground font-body text-sm mb-5">{t("cert.desc")}</p>

      <p className="text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-2.5">{t("cert.pick")}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {member.riders.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={!custom && name === r}
            onClick={() => {
              setCustom(false);
              setName(r);
            }}
            className={chip(!custom && name === r)}
          >
            {r}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={custom}
          onClick={() => {
            setCustom(true);
            setName("");
          }}
          className={chip(custom)}
        >
          {t("cert.other")}
        </button>
      </div>
      {custom && (
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 50))}
          placeholder={t("cert.name.ph")}
          aria-label={t("cert.name.ph")}
          autoFocus
          className="w-full max-w-sm bg-background border border-border focus:border-gold outline-none px-3.5 py-3 font-body text-[15px] text-foreground mb-3"
        />
      )}

      <div className="relative border border-border mt-2 mb-4">
        <canvas ref={canvasRef} className="block w-full h-auto" aria-label={t("cert.title")} />
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40">
            <Loader2 className="w-6 h-6 text-gold animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={download}
          disabled={busy || !name.trim()}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground px-5 py-3.5 font-body font-bold text-xs tracking-[0.15em] uppercase hover:bg-gold-highlight disabled:opacity-50 transition-colors"
        >
          <Download className="w-4 h-4" /> {t("cert.download")}
        </button>
        {canShareFiles && (
          <button
            type="button"
            onClick={share}
            disabled={busy || !name.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gold/60 text-gold px-5 py-3.5 font-body text-xs tracking-[0.15em] uppercase hover:bg-gold/10 disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" /> {t("cert.share")}
          </button>
        )}
      </div>
    </section>
  );
};

export default CertificateMaker;
