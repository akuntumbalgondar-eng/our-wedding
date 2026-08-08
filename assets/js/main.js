/* =========================================================================
   WEDDING INVITATION — MAIN SCRIPT
   Reads everything from WEDDING_CONFIG (assets/js/config.js).
   No values are hardcoded here — edit config.js, not this file.
   ========================================================================= */
(function () {
  "use strict";

  const cfg = WEDDING_CONFIG;

  /* ---------------------------------------------------------------------
     Guest name from URL, e.g. index.html?to=Ade%20Fitriyani
     --------------------------------------------------------------------- */
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to") ? decodeURIComponent(params.get("to")) : "Guest";

  /* ---------------------------------------------------------------------
     Populate static content from config
     --------------------------------------------------------------------- */
  function text(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }
  function attr(id, name, value) {
    const el = document.getElementById(id);
    if (el && value) el.setAttribute(name, value);
  }

  text("guest-name", guestName);
  text("cover-names", `${cfg.groom.shortName} & ${cfg.bride.shortName}`);
  text("monogram", `${cfg.groom.shortName.charAt(0)}${cfg.bride.shortName.charAt(0)}`);

  text("hero-eyebrow", cfg.cover.eyebrow);
  text("hero-groom", cfg.groom.shortName);
  text("hero-bride", cfg.bride.shortName);
  text("hero-date", `${cfg.wedding.displayDate} · ${cfg.wedding.displayTime}`);
  if (cfg.cover.heroPhoto) {
    const hp = document.getElementById("hero-photo");
    if (hp) hp.style.backgroundImage = `url('${cfg.cover.heroPhoto}')`;
  }

  text("groom-name", cfg.groom.fullName);
  text("groom-parents", `${cfg.groom.fatherName} & ${cfg.groom.motherName}`);
  text("bride-name", cfg.bride.fullName);
  text("bride-parents", `${cfg.bride.fatherName} & ${cfg.bride.motherName}`);
  attr("groom-photo", "src", cfg.groom.photo);
  attr("bride-photo", "src", cfg.bride.photo);

  text("venue-name", cfg.venue.name);
  text("venue-address", cfg.venue.address);

  text("gift-account", `${cfg.gift.bankName} — ${cfg.gift.accountNumber}`);
  text("gift-holder", cfg.gift.accountHolder);
  text("gift-address", cfg.gift.deliveryAddress);

  text("closing-message", cfg.closing.message);
  text("closing-names", `${cfg.groom.shortName} & ${cfg.bride.shortName}`);

  if (cfg.music.src) {
    const audio = document.getElementById("bg-music");
    if (audio) audio.src = cfg.music.src;
  }

  /* ---------------------------------------------------------------------
     Event details list
     --------------------------------------------------------------------- */
  (function renderEvents() {
    const wrap = document.getElementById("events-list");
    if (!wrap || !Array.isArray(cfg.events)) return;
    wrap.innerHTML = cfg.events
      .map(
        (ev) => `
      <div class="event-card">
        <h3>${ev.name}</h3>
        <div class="meta"><strong>${ev.date}</strong>${ev.time}</div>
        <div class="meta" style="margin-top:0.75em;"><strong>${ev.venueName}</strong>${ev.venueAddress}</div>
      </div>`
      )
      .join("");
  })();

  /* ---------------------------------------------------------------------
     Google Maps: embed + clickable link
     --------------------------------------------------------------------- */
  (function setupMaps() {
    const embed = document.getElementById("map-embed");
    const link = document.getElementById("maps-link");
    let mapsUrl;

    if (cfg.venue.mapsShareUrl) {
      mapsUrl = cfg.venue.mapsShareUrl;
      if (embed) embed.src = `https://www.google.com/maps?q=${encodeURIComponent(cfg.venue.address)}&output=embed`;
    } else {
      const lat = cfg.venue.latitude;
      const lng = cfg.venue.longitude;
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      if (embed) embed.src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
    }
    if (link) link.href = mapsUrl;
  })();

  /* ---------------------------------------------------------------------
     Save the Date -> Google Calendar link
     --------------------------------------------------------------------- */
  (function setupCalendarLink() {
    const link = document.getElementById("calendar-link");
    if (!link) return;

    function toGCalFormat(isoString) {
      const d = new Date(isoString);
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }

    const start = toGCalFormat(cfg.wedding.isoDateTime);
    const end = toGCalFormat(cfg.wedding.endIsoDateTime || cfg.wedding.isoDateTime);
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", cfg.calendar.title);
    url.searchParams.set("dates", `${start}/${end}`);
    url.searchParams.set("details", cfg.calendar.description);
    url.searchParams.set("location", cfg.venue.address);

    link.href = url.toString();
  })();

  /* ---------------------------------------------------------------------
     Countdown timer
     --------------------------------------------------------------------- */
  (function countdown() {
    const target = new Date(cfg.wedding.isoDateTime).getTime();
    const els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      mins: document.getElementById("cd-mins"),
      secs: document.getElementById("cd-secs"),
    };
    if (!els.days) return;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      const now = Date.now();
      let diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 1000 * 60 * 60 * 24;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 1000 * 60 * 60;
      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * 1000 * 60;
      const secs = Math.floor(diff / 1000);

      els.days.textContent = pad(days);
      els.hours.textContent = pad(hours);
      els.mins.textContent = pad(mins);
      els.secs.textContent = pad(secs);
    }

    tick();
    setInterval(tick, 1000);
  })();

  /* ---------------------------------------------------------------------
     Envelope cover
     --------------------------------------------------------------------- */
  (function envelope() {
    const cover = document.getElementById("cover");
    const env = document.getElementById("envelope");
    const btn = document.getElementById("open-btn");
    if (!cover || !btn) return;

    btn.addEventListener("click", function () {
      env.classList.add("open");
      setTimeout(() => {
        cover.classList.add("opened");
        document.body.classList.remove("locked");
        // Try to start music once the user has interacted with the page
        const audio = document.getElementById("bg-music");
        const musicBtn = document.getElementById("music-toggle");
        if (audio && audio.src) {
          audio.play().then(() => {
            if (musicBtn) musicBtn.classList.add("playing");
          }).catch(() => {
            /* Autoplay blocked — user can tap the floating button */
          });
        }
      }, 600);
    });
  })();

  /* ---------------------------------------------------------------------
     Fade-up reveal on scroll
     --------------------------------------------------------------------- */
  (function revealOnScroll() {
    const items = document.querySelectorAll(".fade-up");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
  })();

  /* ---------------------------------------------------------------------
     Music toggle button
     --------------------------------------------------------------------- */
  (function music() {
    const btn = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-music");
    if (!btn || !audio) return;

    btn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().then(() => btn.classList.add("playing")).catch(() => {});
      } else {
        audio.pause();
        btn.classList.remove("playing");
      }
    });
  })();

  /* ---------------------------------------------------------------------
     RSVP attendance toggle
     --------------------------------------------------------------------- */
  (function attendanceToggle() {
    const buttons = document.querySelectorAll(".attend-btn");
    const hiddenInput = document.getElementById("rsvp-attendance");
    const guestWrap = document.getElementById("guest-count-wrap");

    buttons.forEach((btn) => {
      btn.addEventListener("click", function () {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        hiddenInput.value = btn.dataset.value;

        if (btn.dataset.value === "Not Attending") {
          guestWrap.classList.add("hidden");
        } else {
          guestWrap.classList.remove("hidden");
        }
      });
    });
  })();

  /* ---------------------------------------------------------------------
     RSVP submit -> Google Apps Script (Google Sheets)
     --------------------------------------------------------------------- */
  (function rsvpSubmit() {
    const form = document.getElementById("rsvp-form");
    const status = document.getElementById("rsvp-status");
    const submitBtn = document.getElementById("rsvp-submit");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const attendance = document.getElementById("rsvp-attendance").value;
      if (!attendance) {
        status.textContent = "Please select whether you're attending.";
        status.className = "form-status error";
        return;
      }

      if (!cfg.appsScriptUrl || cfg.appsScriptUrl === "XXX") {
        status.textContent = "RSVP is not connected yet — see README.md Step 2.";
        status.className = "form-status error";
        return;
      }

      const payload = {
        name: document.getElementById("rsvp-name").value.trim(),
        attendance: attendance,
        guests: attendance === "Attending" ? document.getElementById("rsvp-guests").value : "0",
        message: document.getElementById("rsvp-message").value.trim(),
      };

      submitBtn.disabled = true;
      status.textContent = "Sending...";
      status.className = "form-status";

      try {
        const res = await fetch(cfg.appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight on Apps Script
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (data && data.status === "success") {
          status.textContent = "Thank you! Your RSVP has been received.";
          status.className = "form-status success";
          form.reset();
          document.querySelectorAll(".attend-btn").forEach((b) => b.classList.remove("active"));
          document.getElementById("guest-count-wrap").classList.remove("hidden");
          fetchWishes(); // refresh immediately so the new wish shows up
        } else {
          throw new Error((data && data.message) || "Unknown error");
        }
      } catch (err) {
        status.textContent = "Something went wrong. Please try again in a moment.";
        status.className = "form-status error";
      } finally {
        submitBtn.disabled = false;
      }
    });
  })();

  /* ---------------------------------------------------------------------
     Wishes list -> polls Google Apps Script (reads from Google Sheets)
     --------------------------------------------------------------------- */
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  async function fetchWishes() {
    const list = document.getElementById("wishes-list");
    if (!list) return;
    if (!cfg.appsScriptUrl || cfg.appsScriptUrl === "XXX") return;

    try {
      const res = await fetch(`${cfg.appsScriptUrl}?action=wishes&t=${Date.now()}`);
      const data = await res.json();
      if (!data || !Array.isArray(data.wishes)) return;

      if (data.wishes.length === 0) {
        list.innerHTML = `<p class="wishes-empty">Be the first to send your wishes above 💌</p>`;
        return;
      }

      list.innerHTML = data.wishes
        .slice()
        .reverse()
        .map(
          (w) => `
        <div class="wish-card">
          <div class="wish-header">
            <span class="wish-name">${escapeHtml(w.name)}</span>
            <span class="wish-attend">${escapeHtml(w.attendance)}</span>
          </div>
          <p class="wish-msg">${escapeHtml(w.message)}</p>
        </div>`
        )
        .join("");
    } catch (err) {
      /* Silently ignore transient network errors on poll */
    }
  }

  fetchWishes();
  setInterval(fetchWishes, cfg.wishesPollIntervalMs || 15000);

  /* ---------------------------------------------------------------------
     Copy bank account number
     --------------------------------------------------------------------- */
  (function copyAccount() {
    const btn = document.getElementById("copy-account-btn");
    if (!btn) return;
    btn.addEventListener("click", async function () {
      const value = cfg.gift.accountNumber;
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = original), 1800);
    });
  })();
})();
