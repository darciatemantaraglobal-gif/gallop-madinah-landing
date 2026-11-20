import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { addDays, startOfDay } from "date-fns";
import { arSA, enGB, id as idLocale, ms as msLocale } from "date-fns/locale";
import { CalendarCheck, CheckCircle2, ClipboardList, MessageCircle, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar } from "@/components/ui/calendar";
import { AddonPicker, PackagePicker, PeopleStepper, QuoteSummary, useAddonLabel } from "@/components/booking/Pickers";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteData } from "@/lib/siteData";
import { formatSar, quote } from "@/lib/pricing";
import { isPhoneLike, isoDate, longDate, makeBookingCode, readBookingParams } from "@/lib/booking";
import { sendToSheet } from "@/lib/sheetApi";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/whatsapp";

type Errors = Partial<Record<"date" | "time" | "name" | "phone" | "pkg", string>>;
type Done = { code: string; waText: string; blocked: boolean; people: number };

const field =
  "w-full bg-background border border-border focus:border-gold outline-none px-3.5 py-3 font-body text-[15px] text-foreground placeholder:text-muted-foreground/60";
const labelCls = "block text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-2";
const stepTitle = "flex items-center gap-3 font-body font-bold text-base text-foreground mb-5";

const StepNo = ({ n }: { n: number }) => (
  <span className="w-7 h-7 rounded-full border border-gold/60 text-gold text-xs flex items-center justify-center flex-shrink-0">{n}</span>
);

// Online booking: package, group, add-ons, date and time, contact details.
// Sending logs the booking to the Sheet (when connected) and opens WhatsApp with every detail.
const BookingPage = () => {
  const { t, lang } = useLanguage();
  const { prices, booking } = useSiteData();
  const { search } = useLocation();
  const addonLabel = useAddonLabel();

  // Pre-fill from the calculator / price list / partner link.
  const initial = useMemo(
    () => readBookingParams(search, prices.packages.map((p) => p.id), prices.addons.map((a) => a.id)),
    // Only on first load: later price updates must not reset what the visitor typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );
  const defaultPkg = prices.packages.find((p) => p.featured)?.id ?? prices.packages[0].id;

  const [packageId, setPackageId] = useState(initial.packageId ?? defaultPkg);
  const [people, setPeople] = useState(initial.people ?? 2);
  const [addonIds, setAddonIds] = useState<string[]>(initial.addonIds);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hotel, setHotel] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<Done | null>(null);
  const agentCode = initial.agentCode;

  useEffect(() => {
    const prev = document.title;
    document.title = `${t("booking.title1")} ${t("booking.title2")} · Gallop Madinah`;
    return () => {
      document.title = prev;
    };
  }, [t]);

  const pkg = prices.packages.find((p) => p.id === packageId) ?? prices.packages[0];
  const q = useMemo(() => quote(prices, { packageId: pkg.id, people, addonIds }), [prices, pkg.id, people, addonIds]);
  const needsHotel = pkg.features.includes("transport");

  const today = startOfDay(new Date());
  const lastDay = addDays(today, booking.maxDaysAhead);
  const timeOptions = booking.times.length
    ? booking.times.map((v) => ({ value: v, label: v }))
    : [
        { value: t("booking.time.pagi"), label: t("booking.time.pagi") },
        { value: t("booking.time.sore"), label: t("booking.time.sore") },
      ];

  const refs = {
    date: useRef<HTMLDivElement>(null),
    time: useRef<HTMLDivElement>(null),
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    pkg: useRef<HTMLDivElement>(null),
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (q.status === "below_min" || q.status === "invalid") e.pkg = t("booking.err.pkg");
    if (!date) e.date = t("booking.err.date");
    if (!time) e.time = t("booking.err.time");
    if (!name.trim()) e.name = t("booking.err.name");
    if (phone.trim() && !isPhoneLike(phone)) e.phone = t("booking.err.phone");
    return e;
  };

  const buildMessage = (code: string) => {
    const peopleText = t("price.people.n").replace("{n}", String(people));
    const addons = q.status === "ok" && q.addons.length ? q.addons.map((a) => addonLabel(a.id, a.name)).join(", ") : t("calc.noaddon");
    const total = q.status === "ok" ? `${formatSar(q.total)} SAR` : t("booking.total.request");
    const lines = [
      t("booking.wa"),
      `• ${t("booking.wa.code")}: ${code}`,
      `• ${t("booking.wa.pkg")}: ${pkg.name}`,
      `• ${t("booking.date")}: ${date ? longDate(date, lang) : "-"}`,
      `• ${t("booking.time")}: ${time}`,
      `• ${t("booking.wa.people")}: ${peopleText}`,
      `• ${t("booking.wa.addons")}: ${addons}`,
      `• ${t("booking.wa.total")}: ${total}`,
      `• ${t("booking.name")}: ${name.trim()}`,
    ];
    if (phone.trim()) lines.push(`• ${t("booking.wa.phone")}: ${phone.trim()}`);
    if (needsHotel && hotel.trim()) lines.push(`• ${t("booking.wa.hotel")}: ${hotel.trim()}`);
    if (agentCode) lines.push(`• ${t("booking.agent")}: ${agentCode}`);
    if (notes.trim()) lines.push(`• ${t("booking.notes").replace(/ \(.*\)$/, "")}: ${notes.trim()}`);
    lines.push("", t("booking.wa.end"));
    return lines.join("\n");
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    const first = (["pkg", "date", "time", "name", "phone"] as const).find((k) => e[k]);
    if (first) {
      refs[first].current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const code = makeBookingCode();
    const waText = buildMessage(code);
    // Open WhatsApp right inside the tap, before anything async, so phones don't block it.
    const win = window.open(waLink(waText), "_blank");
    if (win) win.opener = null;

    sendToSheet({
      action: "booking",
      kode: code,
      paket: pkg.name,
      tanggal: date ? isoDate(date) : "",
      jam: time,
      jumlah: people,
      addon: q.status === "ok" ? q.addons.map((a) => a.id) : addonIds,
      total: q.status === "ok" ? q.total : "",
      nama: name.trim(),
      wa: phone.trim(),
      hotel: needsHotel ? hotel.trim() : "",
      catatan: notes.trim(),
      kodeAgen: agentCode,
    });
    track("booking_submit", { paket: pkg.id, orang: people, total: q.status === "ok" ? q.total : 0, agen: agentCode || undefined });

    setDone({ code, waText, blocked: !win, people });
    window.scrollTo({ top: 0 });
  };

  const err = (k: keyof Errors) =>
    errors[k] ? <p className="text-red-400 font-body text-xs mt-2">{errors[k]}</p> : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="container mx-auto px-5 md:px-8 max-w-5xl">
          {done ? (
            /* ---------- Sent ---------- */
            <div className="max-w-xl mx-auto text-center">
              <CheckCircle2 className="w-14 h-14 text-gold mx-auto mb-5" strokeWidth={1.25} />
              <h1 className="font-display text-2xl md:text-4xl text-foreground mb-3">{t("booking.done.title")}</h1>
              <p className="text-muted-foreground font-body text-sm md:text-base mb-7">{t("booking.done.desc")}</p>

              <div className="border border-gold/40 bg-card px-5 py-4 mb-6 inline-block">
                <p className="text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-1">{t("booking.done.code")}</p>
                <p className="font-body font-bold text-2xl text-gold tracking-[0.15em]">{done.code}</p>
              </div>

              {done.blocked && <p className="text-foreground font-body text-sm mb-3">{t("booking.done.blocked")}</p>}
              <a
                href={waLink(done.waText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 font-body font-bold text-xs tracking-[0.15em] uppercase mb-10"
              >
                <MessageCircle className="w-4 h-4" /> {t("booking.done.openwa")}
              </a>

              <div className="border border-border bg-card p-5 md:p-6 text-start">
                <p className="flex items-center gap-2 font-body font-bold text-base text-foreground mb-1.5">
                  <ClipboardList className="w-5 h-5 text-gold" strokeWidth={1.5} /> {t("booking.done.reg.title")}
                </p>
                <p className="text-muted-foreground font-body text-sm mb-4">{t("booking.done.reg.desc")}</p>
                <Link
                  to={`/registrasi?booking=${encodeURIComponent(done.code)}&orang=${done.people}`}
                  className="w-full inline-flex items-center justify-center gap-2 border border-gold/60 text-gold px-6 py-3 font-body text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-primary-foreground transition-colors"
                >
                  {t("booking.done.reg.btn")}
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setDone(null)}
                className="mt-6 text-muted-foreground hover:text-gold font-body text-xs tracking-[0.15em] uppercase"
              >
                {t("booking.done.new")}
              </button>
            </div>
          ) : (
            /* ---------- Form ---------- */
            <>
              <div className="text-center mb-8 md:mb-12">
                <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">{t("booking.subtitle")}</p>
                <h1 className="font-display text-2xl md:text-4xl text-foreground">
                  {t("booking.title1")} <span className="text-gold">{t("booking.title2")}</span>
                </h1>
                <p className="text-muted-foreground font-body text-sm md:text-base mt-3 max-w-xl mx-auto">{t("booking.desc")}</p>
              </div>

              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="grid md:grid-cols-[1fr_340px] gap-4 md:gap-6 items-start"
              >
                <div className="space-y-4">
                  {/* 1. Package & group */}
                  <section className="border border-border bg-card p-5 md:p-7" ref={refs.pkg}>
                    <h2 className={stepTitle}>
                      <StepNo n={1} /> {t("booking.step1")}
                    </h2>
                    <div className="space-y-7">
                      <PackagePicker prices={prices} value={pkg.id} onChange={setPackageId} />
                      <PeopleStepper prices={prices} packageId={pkg.id} value={people} onChange={setPeople} inputId="booking-people" />
                      <AddonPicker
                        prices={prices}
                        value={addonIds}
                        onToggle={(id) => setAddonIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))}
                      />
                    </div>
                    {err("pkg")}
                  </section>

                  {/* 2. Date & time */}
                  <section className="border border-border bg-card p-5 md:p-7">
                    <h2 className={stepTitle}>
                      <StepNo n={2} /> {t("booking.step2")}
                    </h2>
                    <div ref={refs.date}>
                      <p className={labelCls}>{t("booking.date")}</p>
                      <div className="border border-border bg-background w-full max-w-[400px]">
                        <Calendar
                          className="p-3 w-full"
                          mode="single"
                          selected={date}
                          onSelect={(d) => {
                            setDate(d);
                            setErrors((e) => ({ ...e, date: undefined }));
                          }}
                          disabled={[{ before: today }, { after: lastDay }]}
                          fromMonth={today}
                          toMonth={lastDay}
                          weekStartsOn={1}
                          locale={{ id: idLocale, en: enGB, ms: msLocale, ar: arSA }[lang]}
                          dir={lang === "ar" ? "rtl" : "ltr"}
                          classNames={{
                            // Stretch the month grid to the card width so the days are easy to tap on phones.
                            months: "w-full",
                            month: "space-y-4 w-full",
                            table: "w-full border-collapse",
                            head_row: "flex w-full",
                            head_cell: "flex-1 text-muted-foreground font-normal text-[0.8rem]",
                            row: "flex w-full mt-1.5",
                            cell: "flex-1 h-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                            day: "h-10 w-full p-0 font-body font-normal hover:bg-gold/10 aria-selected:opacity-100 disabled:pointer-events-none",
                            day_selected: "bg-gold text-primary-foreground hover:bg-gold hover:text-primary-foreground focus:bg-gold focus:text-primary-foreground",
                            day_today: "border border-gold/50 text-gold",
                            caption_label: "text-sm font-body font-bold capitalize",
                          }}
                        />
                      </div>
                      <p className="font-body text-sm mt-2.5 text-foreground">
                        {date ? <CalendarCheck className="inline w-4 h-4 text-gold me-1.5 -mt-0.5" /> : null}
                        {date ? longDate(date, lang) : <span className="text-muted-foreground">{t("booking.date.pick")}</span>}
                      </p>
                      {err("date")}
                    </div>

                    <div ref={refs.time} className="mt-7">
                      <p className={labelCls}>{t("booking.time")}</p>
                      <div className="flex flex-wrap gap-2">
                        {timeOptions.map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            aria-pressed={time === o.value}
                            onClick={() => {
                              setTime(o.value);
                              setErrors((e) => ({ ...e, time: undefined }));
                            }}
                            className={`min-w-[96px] border px-4 py-2.5 font-body text-sm transition-colors ${
                              time === o.value ? "border-gold bg-forest/40 text-foreground" : "border-border text-foreground/85 hover:border-gold/40"
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-muted-foreground font-note font-light text-xs mt-2">{t("booking.time.note")}</p>
                      {err("time")}
                    </div>
                  </section>

                  {/* 3. Contact */}
                  <section className="border border-border bg-card p-5 md:p-7 space-y-5">
                    <h2 className={stepTitle}>
                      <StepNo n={3} /> {t("booking.step3")}
                    </h2>
                    <div>
                      <label htmlFor="b-name" className={labelCls}>{t("booking.name")}</label>
                      <input
                        id="b-name"
                        ref={refs.name}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors((x) => ({ ...x, name: undefined }));
                        }}
                        autoComplete="name"
                        maxLength={80}
                        className={field}
                      />
                      {err("name")}
                    </div>
                    <div>
                      <label htmlFor="b-phone" className={labelCls}>{t("booking.phone")}</label>
                      <input
                        id="b-phone"
                        ref={refs.phone}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setErrors((x) => ({ ...x, phone: undefined }));
                        }}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={24}
                        placeholder="+62 / +966"
                        className={field}
                      />
                      {err("phone")}
                    </div>
                    {needsHotel && (
                      <div>
                        <label htmlFor="b-hotel" className={labelCls}>{t("booking.hotel")}</label>
                        <input id="b-hotel" value={hotel} onChange={(e) => setHotel(e.target.value)} maxLength={100} className={field} />
                      </div>
                    )}
                    <div>
                      <label htmlFor="b-notes" className={labelCls}>{t("booking.notes")}</label>
                      <textarea
                        id="b-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder={t("booking.notes.ph")}
                        className={`${field} resize-none`}
                      />
                    </div>
                  </section>
                </div>

                {/* Summary + send */}
                <aside className="md:sticky md:top-28 border border-gold/30 bg-card p-5 md:p-6" aria-live="polite">
                  <p className="text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-4">{t("booking.summary")}</p>
                  <QuoteSummary prices={prices} q={q} packageId={pkg.id} people={people} addonIds={addonIds} onSwitchPackage={setPackageId} />
                  {(date || time) && (
                    <p className="font-body text-sm text-foreground/85 mt-4">
                      {date ? longDate(date, lang) : ""}
                      {date && time ? " · " : ""}
                      {time}
                    </p>
                  )}
                  {agentCode && (
                    <p className="font-body text-xs text-muted-foreground mt-2">
                      {t("booking.agent")}: <span className="text-gold">{agentCode}</span>
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground px-5 py-3.5 font-body font-bold text-xs tracking-[0.15em] uppercase hover:bg-gold-highlight transition-colors"
                  >
                    <Send className="w-4 h-4" /> {t("booking.submit")}
                  </button>
                  <p className="text-muted-foreground font-note font-light text-xs mt-2.5 text-center">{t("booking.submit.note")}</p>
                </aside>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
