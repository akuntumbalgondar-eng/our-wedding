/* =========================================================================
   WEDDING CONFIG
   -------------------------------------------------------------------------
   This is the ONLY file you should need to edit to personalize the site.
   Replace every "XXX" below with your real details, save, and refresh.
   Do not remove any keys — leave a field as "" (empty string) if unused.
   ========================================================================= */

const WEDDING_CONFIG = {
  // ---- Couple -------------------------------------------------------------
  groom: {
    fullName: "SURYA PRANOWO",
    shortName: "SURYA", // shown in the countdown / hero
    fatherName: "Alm. NJOO TJOAN AN",
    motherName: "Alm. THEN CHUI KIM",
    instagram: "suryapranowo", // optional, e.g. "@groomhandle" — leave "" to hide
    photo: "assets/img/groom.jpg",
  },
  bride: {
    fullName: "DHELFINA ATHALIA",
    shortName: "FINA",
    fatherName: "Alm. OENTOENG IMA SANTOSO",
    motherName: "NG SULAN",
    instagram: "dhelfinaa", // optional, e.g. "@bridehandle" — leave "" to hide
    photo: "assets/img/bride.jpg",
  },

  // ---- Hero / cover ---------------------------------------------------
  cover: {
    heroPhoto: "assets/img/cover.jpg", // full-bleed cover photo
    eyebrow: "The Wedding Celebration Of",
  },

  // ---- Date & time ------------------------------------------------------
  // Use ISO 8601 with timezone offset, e.g. Jakarta (WIB) is +07:00
  wedding: {
    isoDateTime: "2026-11-01T18:00:00+07:00", // used by the countdown
    displayDate: "Sunday, 01 November 2026", // shown as text
    displayTime: "18:00 PM – 20:00 PM WIB",
    endIsoDateTime: "2026-11-01T20:00:00+07:00", // for the calendar event end
  },

  // ---- Events (add/remove objects as needed) ------------------------------
  events: [
    {
      name: "Pemberkatan",
      date: "Sunday, 01 November 2026",
      time: "13:00 – 15:00 WIB",
      venueName: "Vihara Theravada Buddha Sasana",
      venueAddress:
        "Jln. Kelapa Nias X Blok PE2 No. 17, Kelapa Gading Permai, Pegangsaan Dua, RT.8/RW.18, Pegangsaan Dua, Kec. Klp. Gading, Jkt Utara, Daerah Khusus Ibukota Jakarta 14250",
    },
    {
      name: "Resepsi",
      date: "Sunday, 01 November 2026",
      time: "18:00 – 20:00 WIB",
      venueName: "HARRIS Suites Puri Mansion",
      venueAddress:
        "Puri Mansion Estate, Jl. Puri Lkr. Luar, RT.13/RW.2, Duri Kosambi, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11610",
    },
  ],

  // ---- Venue / map --------------------------------------------------------
  venue: {
    name: "HARRIS Suites Puri Mansion",
    address:
      "Puri Mansion Estate, Jl. Puri Lkr. Luar, RT.13/RW.2, Duri Kosambi, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11610",
    // Easiest way to get these: open Google Maps, right-click the pin, click
    // the coordinates at the top of the menu to copy them.
    latitude: -6.1513521,
    longitude: 106.809,
    // Optional: paste a Google Maps share link instead of lat/lng if easier.
    mapsShareUrl: "https://share.google/uEVlBcDnGwcS7acJH",
  },

  // ---- Dress code ---------------------------------------------------------
  // "colors" is the palette you'd like guests to draw from — shown as
  // tappable swatches with the color name underneath. Add/remove/reorder
  // freely; each just needs a "name" and a hex "value".
  dresscode: {
    intro:
      "Our Resepsi will be held at a Vihara. In respect for the space, we kindly ask guests to dress modestly and draw from the palette below.",
    colors: [
      { name: "Navy", value: "#14294a" },
      { name: "Champagne Gold", value: "#c8a35f" },
      { name: "Ivory", value: "#f7f2e7" },
      { name: "Sage", value: "#8a9a7e" },
      { name: "Dusty Rose", value: "#c9a3a0" },
    ],

    // Shown as a green "Do" checklist.
    dos: [
      "Cover shoulders and knees - sleeves or a light shawl work well",
      "Choose soft, muted tones from the palette above",
      "Wear shoes that are easy to slip on and off",
      "Bring a light scarf in case a covering is needed inside the hall",
    ],

    // Shown as a red "Don't" checklist.
    donts: [
      "Please avoid all-black outfits",
      "No sleeveless tops, short skirts/shorts, or plunging necklines",
      "Avoid loud prints, neon colors, or costume-like accessories",
      "Avoid strong perfume or cologne inside the temple hall",
      "Please keep phones on silent once inside the Vihara",
    ],
  },

  // ---- Calendar event description -----------------------------------------
  calendar: {
    title: "The Wedding of SURYA & FINA",
    description: "Please join us as we celebrate our wedding day.",
  },

  // ---- RSVP / Wishes backend -----------------------------------------------
  // Paste the Web App URL you get after deploying apps-script/Code.gs
  // (see README.md, Step 2). It looks like:
  // https://script.google.com/macros/s/XXXXXXXXXXXX/exec
  appsScriptUrl:
    "https://script.google.com/macros/s/AKfycbxGnPtNxrpBBo9ZZydxnqettttUurvzT3EegBwcaPh4dMWCf_marR7dxFhuoByp-cSJSw/exec",

  // How often (ms) the wishes list checks for new messages
  wishesPollIntervalMs: 15000,

  // ---- Gift section ---------------------------------------------------
  gift: {
    bankName: "SURYA PRANOWO",
    accountNumber: "888888",
    accountHolder: "SURYA PRANOWO",
    deliveryAddress: "JAKARTA",
  },

  // ---- Music ------------------------------------------------------------
  music: {
    src: "assets/audio/song.mp3",
  },

  // ---- Closing note ------------------------------------------------------
  closing: {
    message: "We can't wait to celebrate this special day with you.",
  },
};
