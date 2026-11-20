/**
 * Gallop Madinah — Google Sheet API (Apps Script Web App).
 *
 * Deploy: Extensions → Apps Script → paste this file → Deploy → New deployment →
 *   type "Web app", Execute as "Me", Who has access "Anyone".
 * Put the /exec URL in Vercel as VITE_SHEET_API_URL.
 *
 * GET  ?action=config            → prices (+ later faq, partners, testimonials, schedule)
 * GET  ?action=member&kode=ABC   → one member group (never the whole tab)
 * GET  ?action=agen&kode=TRAVELX → one travel agent (never the whole tab)
 * POST {action:"booking"|"registrasi", ...} as text/plain JSON → appends a row
 *
 * The website validates everything it receives and falls back to its built-in data,
 * so a typo here hides the bad row instead of breaking the site.
 */

var CACHE_SECONDS = 300; // config changes show up on the site within ~5 minutes

function doGet(e) {
  var action = (e.parameter.action || "").toLowerCase();
  try {
    if (action === "config") return json_(getConfigCached_());
    if (action === "member") return json_(findByCode_("Member", e.parameter.kode, memberFromRow_));
    if (action === "agen") return json_(findByCode_("Agen", e.parameter.kode, agentFromRow_)); // portal /partner/KODE
    return json_({ error: "unknown action" });
  } catch (err) {
    return json_({ error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === "booking") return json_(appendBooking_(body));
    if (body.action === "registrasi") return json_(appendRegistrasi_(body));
    return json_({ error: "unknown action" });
  } catch (err) {
    return json_({ error: String(err) });
  }
}

// ---------- config ----------

function getConfigCached_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get("config");
  if (hit) return JSON.parse(hit);
  var config = buildConfig_();
  cache.put("config", JSON.stringify(config), CACHE_SECONDS);
  return config;
}

/** Run from the editor after editing the Sheet to publish changes immediately. */
function clearCache() {
  CacheService.getScriptCache().remove("config");
}

function buildConfig_() {
  return {
    prices: {
      packages: rows_("Harga").map(function (r) {
        return {
          id: str_(r.id),
          name: str_(r.nama),
          short: str_(r.nama_pendek) || str_(r.nama),
          price: num_(r.harga),
          minPeople: num_(r.min_orang) || 1,
          features: list_(r.fitur),
          featured: yes_(r.unggulan),
          tiered: yes_(r.harga_grup),
        };
      }),
      groupTiers: rows_("HargaGrup").map(function (r) {
        return {
          from: num_(r.dari),
          to: blank_(r.sampai) ? null : num_(r.sampai),
          price: blank_(r.harga) ? null : num_(r.harga),
        };
      }),
      addons: rows_("Addon").map(function (r) {
        return { id: str_(r.id), name: str_(r.nama), price: num_(r.harga) };
      }),
    },
    testimonials: optionalRows_("Testimoni")
      .filter(function (r) { return yes_(r.tampil); })
      .map(function (r) {
        return { name: str_(r.nama), origin: str_(r.asal), rating: num_(r.bintang), text: str_(r.isi) };
      }),
    reviews: {
      mapsUrl: setting_("google_maps_url"),
      writeReviewUrl: setting_("google_review_url"),
    },
    faq: optionalRows_("FAQ")
      .sort(byOrder_)
      .map(function (r) {
        return {
          q: { id: str_(r.tanya_id), en: str_(r.tanya_en), ms: str_(r.tanya_ms), ar: str_(r.tanya_ar) },
          a: { id: str_(r.jawab_id), en: str_(r.jawab_en), ms: str_(r.jawab_ms), ar: str_(r.jawab_ar) },
        };
      }),
    partners: optionalRows_("Partner")
      .sort(byOrder_)
      .map(function (r) {
        return { name: str_(r.nama), logo: str_(r.logo_url), size: str_(r.ukuran).toLowerCase() || "normal" };
      }),
    booking: {
      times: optionalRows_("Jadwal")
        .filter(function (r) { return blank_(r.aktif) || yes_(r.aktif); })
        .map(function (r) { return timeStr_(r.jam); })
        .filter(String),
      maxDaysAhead: num_(setting_("hari_booking_maks")) || 90,
    },
    safety: {
      rules: optionalRows_("Aturan")
        .sort(byOrder_)
        .map(function (r) {
          return { id: str_(r.aturan_id), en: str_(r.aturan_en), ms: str_(r.aturan_ms), ar: str_(r.aturan_ar) };
        }),
      minAge: blank_(setting_("usia_min")) ? null : num_(setting_("usia_min")),
      maxWeight: blank_(setting_("berat_maks")) ? null : num_(setting_("berat_maks")),
    },
  };
}

function byOrder_(a, b) {
  return (num_(a.urutan) || 999) - (num_(b.urutan) || 999);
}

/** Sheets turns "07:00" into a date/time value; give it back as "07:00". */
function timeStr_(v) {
  return v instanceof Date ? Utilities.formatDate(v, Session.getScriptTimeZone(), "HH:mm") : str_(v);
}

/** Like rows_, but an absent tab means "nothing yet" instead of an error. */
function optionalRows_(name) {
  return SpreadsheetApp.getActive().getSheetByName(name) ? rows_(name) : [];
}

/** Value from the key/value tab "Pengaturan" (columns: kunci, nilai). */
function setting_(key) {
  var match = optionalRows_("Pengaturan").filter(function (r) {
    return str_(r.kunci).toLowerCase() === key;
  })[0];
  return match ? str_(match.nilai) : "";
}

// ---------- member / agent lookup ----------

function findByCode_(sheetName, code, mapRow) {
  code = str_(code).toUpperCase();
  if (!code) return { found: false };
  var match = rows_(sheetName).filter(function (r) {
    return str_(r.kode).toUpperCase() === code;
  })[0];
  return match ? { found: true, data: mapRow(match) } : { found: false };
}

function memberFromRow_(r) {
  return {
    kode: str_(r.kode).toUpperCase(),
    namaGrup: str_(r.nama_grup),
    tanggal: dateStr_(r.tanggal),
    kuda: str_(r.kuda),
    coach: str_(r.coach),
    peserta: list_(r.peserta),
    foto: list_(r.foto),
    videoUrl: str_(r.video_url),
    driveFolder: str_(r.drive_folder),
  };
}

function agentFromRow_(r) {
  return {
    kode: str_(r.kode).toUpperCase(),
    namaTravel: str_(r.nama_travel),
    hargaOpenTrip: num_(r.harga_agen_open_trip),
    hargaPremium: num_(r.harga_agen_premium),
    kontak: str_(r.kontak),
  };
}

// ---------- writes ----------

// Columns of the "Booking" tab:
// waktu | kode | paket | tanggal | jam | jumlah | addon | total | nama | wa | hotel | catatan | kode_agen | status
function appendBooking_(b) {
  var addons = Array.isArray(b.addon) ? b.addon.map(str_) : list_(b.addon);
  sheet_("Booking").appendRow([
    new Date(), safe_(b.kode), safe_(b.paket), safe_(b.tanggal), safe_(b.jam), num_(b.jumlah),
    safe_(addons.join(", ")), blank_(b.total) ? "" : num_(b.total), safe_(b.nama), safe_(b.wa),
    safe_(b.hotel), safe_(b.catatan), safe_(b.kodeAgen), "baru",
  ]);
  return { ok: true };
}

// Columns of the "Registrasi" tab:
// waktu | kode_booking | nama | usia | berat | pengalaman | setuju
function appendRegistrasi_(b) {
  var s = sheet_("Registrasi");
  (b.peserta || []).slice(0, 30).forEach(function (p) {
    s.appendRow([
      new Date(), safe_(b.kodeBooking), safe_(p.nama), num_(p.usia), num_(p.berat), safe_(p.pengalaman), b.setuju ? "ya" : "tidak",
    ]);
  });
  return { ok: true };
}

/**
 * Text typed by visitors goes into the Sheet as plain text: a leading = + - @ would otherwise
 * make Sheets treat it as a formula. Also capped in length.
 */
function safe_(v) {
  var s = str_(v).slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// ---------- helpers ----------

function sheet_(name) {
  var s = SpreadsheetApp.getActive().getSheetByName(name);
  if (!s) throw new Error("Tab '" + name + "' tidak ditemukan");
  return s;
}

/** Rows of a tab as objects keyed by the (lower-cased) header row. Empty rows are skipped. */
function rows_(name) {
  var values = sheet_(name).getDataRange().getValues();
  var header = values.shift().map(function (h) {
    return String(h).trim().toLowerCase();
  });
  return values
    .filter(function (row) {
      return row.some(function (c) { return String(c).trim() !== ""; });
    })
    .map(function (row) {
      var o = {};
      header.forEach(function (h, i) { o[h] = row[i]; });
      return o;
    });
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function str_(v) { return v === null || v === undefined ? "" : String(v).trim(); }
function blank_(v) { return str_(v) === ""; }
// "1.250", "1,250", "1250 SAR" → 1250. Anything unreadable becomes NaN and is rejected by the site.
function num_(v) { return typeof v === "number" ? v : Number(str_(v).replace(/[^0-9]/g, "") || NaN); }
function yes_(v) { return /^(ya|yes|y|true|1)$/i.test(str_(v)); }
function list_(v) { return str_(v).split(",").map(function (x) { return x.trim(); }).filter(String); }
function dateStr_(v) {
  return v instanceof Date ? Utilities.formatDate(v, "Asia/Riyadh", "yyyy-MM-dd") : str_(v);
}
