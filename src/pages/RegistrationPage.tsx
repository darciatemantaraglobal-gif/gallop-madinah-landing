import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, Check, CheckCircle2, Loader2, MessageCircle, Plus, ShieldCheck, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteData } from "@/lib/siteData";
import { pick } from "@/data/siteData";
import { BOOKING_CODE_RE } from "@/lib/booking";
import {
  MAX_RIDERS,
  emptyRider,
  riderErrors,
  riderWarnings,
  ridersValid,
  type Experience,
  type Rider,
} from "@/lib/registration";
import { saveRegistrations } from "@/lib/backend";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/whatsapp";

const field =
  "w-full bg-background border focus:border-gold outline-none px-3.5 py-3 font-body text-[15px] text-foreground placeholder:text-muted-foreground/60";
const labelCls = "block text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-2";
const EXPERIENCES: Experience[] = ["none", "some", "regular"];

// Rider registration: one card per rider (name, age, weight, experience) plus the safety
// rules to agree to. Saved to the database when connected, otherwise sent on WhatsApp.
const RegistrationPage = () => {
  const { t, lang } = useLanguage();
  const { safety } = useSiteData();
  const { search } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const initialCode = (params.get("booking") ?? "").toUpperCase();
  const initialCount = Math.min(MAX_RIDERS, Math.max(1, Number(params.get("orang")) || 1));

  const [code, setCode] = useState(BOOKING_CODE_RE.test(initialCode) ? initialCode : "");
  const [riders, setRiders] = useState<Rider[]>(() => Array.from({ length: initialCount }, emptyRider));
  const [agree, setAgree] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [done, setDone] = useState<{ waText: string; viaWhatsApp: boolean } | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = `${t("reg.title1")} ${t("reg.title2")} · Gallop Madinah`;
    return () => {
      document.title = prev;
    };
  }, [t]);

  const update = (i: number, patch: Partial<Rider>) => setRiders((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const expLabel = (e: Experience | "") => (e ? t(`reg.exp.${e}`) : "");

  const buildMessage = () => {
    const head = `${t("reg.wa")}${code ? ` ${t("reg.wa.for")} ${code}` : ""}:`;
    const lines = riders.map(
      (r, i) => `${i + 1}. ${r.name.trim()}, ${r.age.trim()} ${t("reg.wa.yo")}, ${r.weight.trim()} kg, ${expLabel(r.experience)}`,
    );
    return [head, ...lines, "", t("reg.wa.agree")].join("\n");
  };

  const submit = async () => {
    setShowErrors(true);
    if (!ridersValid(riders) || !agree || sending) {
      document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const waText = buildMessage();
    setSending(true);
    const saved = await saveRegistrations(
      riders.map((r) => ({
        // Only a well-formed booking code is stored (the database rejects anything else).
        booking_code: BOOKING_CODE_RE.test(code) ? code : "",
        name: r.name.trim(),
        age: Number(r.age),
        weight: Number(r.weight),
        experience: r.experience as Experience,
        agreed: true as const,
      })),
    );
    setSending(false);
    track("registrasi_submit", { peserta: riders.length, saved });
    // If it couldn't be saved (no database, or offline), the thank-you screen offers WhatsApp instead.
    setDone({ waText, viaWhatsApp: !saved });
    window.scrollTo({ top: 0 });
  };

  if (done)
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 md:pt-36 pb-20 md:pb-28">
          <div className="container mx-auto px-5 md:px-8 max-w-xl text-center">
            <CheckCircle2 className="w-14 h-14 text-gold mx-auto mb-5" strokeWidth={1.25} />
            <h1 className="font-display text-2xl md:text-4xl text-foreground mb-3">
              {done.viaWhatsApp ? t("reg.done.wa.title") : t("reg.done.title")}
            </h1>
            {!done.viaWhatsApp && <p className="text-muted-foreground font-body text-sm md:text-base mb-7">{t("reg.done.desc")}</p>}
            {done.viaWhatsApp && (
              <>
                <p className="text-foreground font-body text-sm mb-3">{t("reg.done.wa")}</p>
                <a
                  href={waLink(done.waText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 font-body font-bold text-xs tracking-[0.15em] uppercase mb-8"
                >
                  <MessageCircle className="w-4 h-4" /> {t("booking.done.openwa")}
                </a>
              </>
            )}
            <div>
              <Link to="/" className="text-muted-foreground hover:text-gold font-body text-xs tracking-[0.15em] uppercase">
                {t("reg.back")}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="container mx-auto px-5 md:px-8 max-w-3xl">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">{t("reg.subtitle")}</p>
            <h1 className="font-display text-2xl md:text-4xl text-foreground">
              {t("reg.title1")} <span className="text-gold">{t("reg.title2")}</span>
            </h1>
            <p className="text-muted-foreground font-body text-sm md:text-base mt-3 max-w-xl mx-auto">{t("reg.desc")}</p>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="space-y-4"
          >
            <div className="border border-border bg-card p-5 md:p-6">
              <label htmlFor="r-code" className={labelCls}>{t("reg.code")}</label>
              <input
                id="r-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 12))}
                placeholder="GM-XXXXX"
                autoComplete="off"
                className={`${field} border-border tracking-[0.1em] max-w-[220px]`}
              />
            </div>

            {riders.map((r, i) => {
              const errs = showErrors ? riderErrors(r) : {};
              const warn = riderWarnings(r, safety);
              const bad = (k: keyof Rider) => (errs[k] ? "border-red-400/70" : "border-border");
              return (
                <fieldset
                  key={i}
                  data-invalid={Object.keys(errs).length > 0}
                  className="border border-border bg-card p-5 md:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <legend className="font-body font-bold text-base text-foreground">{t("reg.rider").replace("{n}", String(i + 1))}</legend>
                    {riders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setRiders((rs) => rs.filter((_, j) => j !== i))}
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-red-400 font-body text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> {t("reg.remove")}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="col-span-2">
                      <label htmlFor={`r-name-${i}`} className={labelCls}>{t("reg.name")}</label>
                      <input
                        id={`r-name-${i}`}
                        value={r.name}
                        onChange={(e) => update(i, { name: e.target.value })}
                        maxLength={80}
                        autoComplete="off"
                        className={`${field} ${bad("name")}`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`r-age-${i}`} className={labelCls}>{t("reg.age")}</label>
                      <input
                        id={`r-age-${i}`}
                        value={r.age}
                        onChange={(e) => update(i, { age: e.target.value.replace(/\D/g, "").slice(0, 2) })}
                        inputMode="numeric"
                        className={`${field} ${bad("age")}`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`r-weight-${i}`} className={labelCls}>{t("reg.weight")}</label>
                      <input
                        id={`r-weight-${i}`}
                        value={r.weight}
                        onChange={(e) => update(i, { weight: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                        inputMode="numeric"
                        className={`${field} ${bad("weight")}`}
                      />
                    </div>
                  </div>

                  <p className={`${labelCls} mt-4`}>{t("reg.exp")}</p>
                  <div className={`grid grid-cols-3 gap-2 ${errs.experience ? "outline outline-1 outline-red-400/70" : ""}`}>
                    {EXPERIENCES.map((e) => (
                      <button
                        key={e}
                        type="button"
                        aria-pressed={r.experience === e}
                        onClick={() => update(i, { experience: e })}
                        className={`border px-2 py-2.5 font-body text-xs md:text-sm leading-tight transition-colors ${
                          r.experience === e ? "border-gold bg-forest/40 text-foreground" : "border-border text-foreground/80 hover:border-gold/40"
                        }`}
                      >
                        {t(`reg.exp.${e}`)}
                      </button>
                    ))}
                  </div>

                  {(warn.young || warn.heavy) && (
                    <div className="mt-4 space-y-1.5">
                      {warn.young && (
                        <p className="flex gap-2 text-gold font-body text-xs">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          {t("reg.warn.age").replace("{n}", String(safety.minAge))}
                        </p>
                      )}
                      {warn.heavy && (
                        <p className="flex gap-2 text-gold font-body text-xs">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          {t("reg.warn.weight").replace("{n}", String(safety.maxWeight))}
                        </p>
                      )}
                    </div>
                  )}
                </fieldset>
              );
            })}

            {riders.length < MAX_RIDERS && (
              <button
                type="button"
                onClick={() => setRiders((rs) => [...rs, emptyRider()])}
                className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-gold/50 text-gold px-5 py-3.5 font-body text-xs tracking-[0.15em] uppercase hover:bg-gold/10"
              >
                <Plus className="w-4 h-4" /> {t("reg.add")}
              </button>
            )}

            {/* Safety rules */}
            <div className="border border-gold/30 bg-card p-5 md:p-6" data-invalid={showErrors && !agree}>
              <p className="flex items-center gap-2 font-body font-bold text-base text-foreground mb-4">
                <ShieldCheck className="w-5 h-5 text-gold" strokeWidth={1.5} /> {t("reg.rules")}
              </p>
              <ol className="space-y-2.5 mb-5">
                {safety.rules.map((rule, i) => (
                  <li key={i} className="flex gap-3 font-body text-sm text-foreground/85 leading-relaxed">
                    <span className="text-gold font-bold w-5 flex-shrink-0">{i + 1}.</span>
                    {pick(rule, lang)}
                  </li>
                ))}
              </ol>
              <button
                type="button"
                role="checkbox"
                aria-checked={agree}
                onClick={() => setAgree((a) => !a)}
                className="flex items-start gap-3 text-left"
              >
                <span
                  className={`mt-0.5 w-5 h-5 border flex items-center justify-center flex-shrink-0 ${
                    agree ? "bg-gold border-gold" : showErrors ? "border-red-400" : "border-muted-foreground/60"
                  }`}
                >
                  {agree && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
                </span>
                <span className="font-body text-sm text-foreground">{t("reg.agree")}</span>
              </button>
              {showErrors && !agree && <p className="text-red-400 font-body text-xs mt-2">{t("reg.err.agree")}</p>}
            </div>

            {showErrors && !ridersValid(riders) && <p className="text-red-400 font-body text-sm text-center">{t("reg.err.fields")}</p>}

            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground px-5 py-4 font-body font-bold text-xs tracking-[0.15em] uppercase hover:bg-gold-highlight disabled:opacity-60 transition-colors"
            >
              {sending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("reg.submit")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegistrationPage;
