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
  const guestName = params.get("to")
    ? decodeURIComponent(params.get("to"))
    : "Guest";

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
  text(
    "monogram",
    `${cfg.groom.shortName.charAt(0)} & ${cfg.bride.shortName.charAt(0)}`,
  );

  text("intro-eyebrow", cfg.cover.eyebrow);
  text("intro-names", `${cfg.groom.shortName} & ${cfg.bride.shortName}`);

  text("hero-groom", cfg.groom.shortName);
  text("hero-bride", cfg.bride.shortName);
  text("hero-date", `${cfg.wedding.displayDate} · ${cfg.wedding.displayTime}`);
  if (cfg.cover.heroPhoto) {
    const hp = document.getElementById("hero-photo");
    if (hp) hp.style.backgroundImage = `url('${cfg.cover.heroPhoto}')`;
    const ip = document.getElementById("intro-photo");
    if (ip) {
      ip.style.backgroundImage = `url('${cfg.cover.heroPhoto}')`;
      ip.style.display = "block";
    }
    const cp = document.getElementById("cover-photo");
    if (cp) cp.style.backgroundImage = `url('${cfg.cover.heroPhoto}')`;
    const tp = document.getElementById("transition-photo");
    if (tp) tp.style.backgroundImage = `url('${cfg.cover.heroPhoto}')`;
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
     Intro sequence — two short beats ("The Wedding Of" -> the couple's
     names) play once on load, then the overlay fades away to reveal
     the cover underneath. Pure setTimeout choreography toggling
     ".is-active" (fade handled by the CSS transition in style.css);
     skipped entirely for reduced-motion, which jumps straight to the
     cover.
     --------------------------------------------------------------------- */
  (function introSequence() {
    const intro = document.getElementById("intro-sequence");
    const step1 = document.getElementById("intro-step1");
    const step2 = document.getElementById("intro-step2");
    if (!intro) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      intro.style.display = "none";
      return;
    }

    const HOLD = 2800; // how long each beat stays fully visible, in ms
    const FADE = 1200; // matches .intro-step / #intro-sequence transition-duration

    let t = 60; // small delay so the very first fade-in isn't an abrupt flash
    setTimeout(() => step1 && step1.classList.add("is-active"), t);
    t += HOLD;
    setTimeout(() => step1 && step1.classList.remove("is-active"), t);
    t += FADE * 0.4; // let step1 clear most of the way before step2 arrives
    setTimeout(() => step2 && step2.classList.add("is-active"), t);
    t += HOLD;
    setTimeout(() => step2 && step2.classList.remove("is-active"), t);
    t += FADE * 0.6;
    setTimeout(() => {
      intro.classList.add("done");
      setTimeout(() => {
        intro.style.display = "none";
      }, FADE);
    }, t);
  })();

  /* ---------------------------------------------------------------------
     Event details list
     --------------------------------------------------------------------- */
  (function renderEvents() {
    const wrap = document.getElementById("events-list");
    if (!wrap || !Array.isArray(cfg.events)) return;
    wrap.innerHTML = cfg.events
      .map(
        (ev, i) => `
      <div class="event-card ornate-frame reveal" data-reveal="up" style="--reveal-delay:${i * 150}ms">
        <h3>${ev.name}</h3>
        <div class="meta"><strong>${ev.date}</strong>${ev.time}</div>
        <div class="meta" style="margin-top:0.75em;"><strong>${ev.venueName}</strong>${ev.venueAddress}</div>
      </div>`,
      )
      .join("");
  })();

  /* ---------------------------------------------------------------------
     Dress code: palette swatches + do/don't lists
     --------------------------------------------------------------------- */
  (function renderDresscode() {
    const dc = cfg.dresscode;
    if (!dc) return;

    text("dresscode-intro", dc.intro);

    // const strip = document.getElementById("palette-strip");
    // if (strip && Array.isArray(dc.colors)) {
    //   strip.innerHTML = dc.colors
    //     .map(
    //       (c) => `
    //     <div class="palette-swatch">
    //       <span class="chip" style="background:${c.value};"></span>
    //       <span class="chip-name">${c.name}</span>
    //     </div>`,
    //     )
    //     .join("");
    // }
    const strip = document.getElementById("palette-strip");

    if (strip && Array.isArray(dc.colors)) {
      strip.innerHTML = dc.colors
        .map(
          (c) => `
        <div class="palette-swatch reveal" data-reveal="scale">
          <span
            class="fabric-chip"
            style="background:${c.value};"
            aria-hidden="true"
          ></span>
          <span class="chip-name">${c.name}</span>
        </div>
      `,
        )
        .join("");
    }

    const dosList = document.getElementById("dresscode-dos");
    if (dosList && Array.isArray(dc.dos)) {
      dosList.innerHTML = dc.dos
        .map((item) => `<li class="reveal" data-reveal="left">${item}</li>`)
        .join("");
    }

    const dontsList = document.getElementById("dresscode-donts");
    if (dontsList && Array.isArray(dc.donts)) {
      dontsList.innerHTML = dc.donts
        .map((item) => `<li class="reveal" data-reveal="left">${item}</li>`)
        .join("");
    }
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
      if (embed)
        embed.src = `https://www.google.com/maps?q=${encodeURIComponent(cfg.venue.address)}&output=embed`;
    } else {
      const lat = cfg.venue.latitude;
      const lng = cfg.venue.longitude;
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      if (embed)
        embed.src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
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
    const end = toGCalFormat(
      cfg.wedding.endIsoDateTime || cfg.wedding.isoDateTime,
    );
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
     Open Invitation — cover fades away behind a brief full-page photo
     + shimmer transition, which then clears to reveal the hero.
     --------------------------------------------------------------------- */
  (function openInvitation() {
    const cover = document.getElementById("cover");
    const btn = document.getElementById("open-btn");
    const transition = document.getElementById("page-transition");
    if (!cover || !btn) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const SHIMMER_HOLD = reducedMotion ? 0 : 1050; // how long the shimmer overlay plays before revealing the hero
    const SHIMMER_FADE = reducedMotion ? 0 : 500; // matches #page-transition's own opacity transition

    btn.addEventListener("click", function () {
      cover.classList.add("opened");
      if (transition) transition.classList.add("active");

      setTimeout(() => {
        if (transition) transition.classList.add("fade-out");
        document.body.classList.remove("locked");

        // Replay the hero's reveal animation right as the transition
        // clears, instead of it already sitting "visible" underneath.
        const heroReveals = document.querySelectorAll(
          "#hero .reveal, #hero.fade-up, #hero .fade-up",
        );
        heroReveals.forEach((el) => {
          el.classList.remove("is-visible", "is-exit");
        });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            heroReveals.forEach((el) => el.classList.add("is-visible"));
          });
        });

        // Try to start music once the user has interacted with the page
        const audio = document.getElementById("bg-music");
        const musicBtn = document.getElementById("music-toggle");
        if (audio && audio.src) {
          audio
            .play()
            .then(() => {
              if (musicBtn) musicBtn.classList.add("playing");
            })
            .catch(() => {
              /* Autoplay blocked — user can tap the floating button */
            });
        }

        setTimeout(() => {
          if (transition) transition.classList.remove("active", "fade-out");
        }, SHIMMER_FADE);
      }, SHIMMER_HOLD);
    });
  })();

  /* ---------------------------------------------------------------------
     Full-page "book" paging
     - JS drives the actual page turn (wheel + touch), so one scroll
       notch / one swipe reliably moves exactly one page on every
       device — CSS scroll-snap alone can't guarantee that once a page
       has its own scrollable content, so it's kept only as a native
       fallback here, not the primary mechanism.
     - If the current page is taller than the screen, a gesture first
       scrolls *within* that page; only once it's scrolled all the way
       to its edge does the next gesture turn the page. That's the
       safety net for any content that doesn't fully fit a very short
       screen — nothing becomes unreachable.
     - Each page's fade/slide-in elements are explicitly replayed the
       moment it becomes current, instead of relying on the scroll
       position crossing a threshold naturally (which, with a fast
       page-snap, was happening almost instantly and made the
       animation barely visible).
     --------------------------------------------------------------------- */
  (function pageScroll() {
    const scroller = document.getElementById("page-scroll");
    if (!scroller) return;

    const pages = Array.from(scroller.children).filter(
      (el) => el.tagName === "HEADER" || el.tagName === "SECTION",
    );
    if (!pages.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let activeIndex = 0;
    let isAnimating = false;
    let lockTimer = null;

    function isTyping() {
      const a = document.activeElement;
      if (!a) return false;
      const tag = a.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        a.isContentEditable
      );
    }

    // Replay a page's own entrance elements right as it becomes current,
    // so the fade/slide-in always plays fresh on arrival.
    function replayReveals(page) {
      if (reducedMotion) return;
      const items = page.querySelectorAll(".reveal, .fade-up");
      if (!items.length) return;
      items.forEach((el) => el.classList.remove("is-visible", "is-exit"));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          items.forEach((el) => el.classList.add("is-visible"));
        });
      });
    }

    function setActive(idx) {
      if (idx === activeIndex && pages[idx].classList.contains("is-current"))
        return;
      activeIndex = idx;
      pages.forEach((p, i) => p.classList.toggle("is-current", i === idx));
      replayReveals(pages[idx]);
    }

    function goTo(idx) {
      idx = Math.max(0, Math.min(pages.length - 1, idx));
      if (idx === activeIndex) return;
      isAnimating = true;
      pages[idx].scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(idx);
      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        isAnimating = false;
      }, 850);
    }

    // True once the active page has no more room to scroll internally
    // in the given direction — meaning a gesture should turn the page.
    function pageExhausted(goingDown) {
      const page = pages[activeIndex];
      const overflow = page.scrollHeight - page.clientHeight;
      // Small/rounding overflow (a few px from layout math on real
      // phones) shouldn't force an extra swipe just to "finish"
      // scrolling content that already visually fits — only pages
      // with genuinely more content than the screen (long RSVP form,
      // wishes list, etc.) get the scroll-internally-first treatment.
      if (overflow <= 48) return true;
      /* const atTop = page.scrollTop <= 4;
       const atBottom =
         page.scrollTop + page.clientHeight >= page.scrollHeight - 4;
      GEMINI */

        const atTop = page.scrollTop <= 15;
        const atBottom =
          page.scrollTop + page.clientHeight >= page.scrollHeight - 15;
      return goingDown ? atBottom : atTop;
    }

    // Keep activeIndex correct regardless of how the scroll happened
    // (initial load, resize, browser back/forward, etc.)
    if ("IntersectionObserver" in window) {
      const pageIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const idx = pages.indexOf(entry.target);
              if (idx !== -1) setActive(idx);
            }
          });
        },
        { root: scroller, threshold: [0.5] },
      );
      pages.forEach((p) => pageIO.observe(p));
    } else {
      pages.forEach((p) => p.classList.add("is-current"));
    }

    /* Wheel — one notch/gesture moves exactly one page */
    scroller.addEventListener(
      "wheel",
      (e) => {
        if (e.target.closest(".wishes-list")) return; // its own list scrolls freely
        const goingDown = e.deltaY > 0;
        if (!pageExhausted(goingDown)) return; // let the page scroll internally first

        e.preventDefault();
        if (document.body.classList.contains("locked")) return;
        if (isAnimating || Math.abs(e.deltaY) < 4) return;
        goTo(activeIndex + (goingDown ? 1 : -1));
      },
      { passive: false },
    );

    /* Touch swipe — one swipe moves exactly one page */
    let touchStartY = null;
    let touchLastY = null;

    scroller.addEventListener(
      "touchstart",
      (e) => {
        if (e.target.closest(".wishes-list, textarea, input, select")) {
          touchStartY = null;
          return;
        }
        touchStartY = touchLastY = e.touches[0].clientY;
      },
      { passive: true },
    );

    scroller.addEventListener(
      "touchmove",
      (e) => {
        if (touchStartY === null) return;
        const y = e.touches[0].clientY;
        const goingDown = y < touchLastY; // finger moving up reveals content below
        touchLastY = y;
        if (!pageExhausted(goingDown)) return; // let the page scroll internally first
        e.preventDefault(); // no more room inside the page — this gesture pages instead
      },
      { passive: false },
    );

    scroller.addEventListener(
      "touchend",
      (e) => {
        if (touchStartY === null) return;
        const delta = touchStartY - e.changedTouches[0].clientY;
        touchStartY = null;
        if (document.body.classList.contains("locked")) return;
        if (isAnimating || Math.abs(delta) < 40) return;

        const goingDown = delta > 0;
        if (!pageExhausted(goingDown)) return; // was an internal scroll, not a page turn
        goTo(activeIndex + (goingDown ? 1 : -1));
      },
      { passive: true },
    );

    /* Keyboard */
    window.addEventListener("keydown", (e) => {
      if (isTyping()) return;
      if (document.body.classList.contains("locked")) return;

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          goTo(activeIndex + 1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goTo(activeIndex - 1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(pages.length - 1);
          break;
      }
    });
  })();

  /* ---------------------------------------------------------------------
     Scroll reveal — smooth enter AND exit transitions.
     Every ".fade-up" / ".reveal" element fades+lifts in as it enters the
     viewport, and gently dims+lifts out again once it's scrolled past
     above the fold — replaying cleanly if the user scrolls back up.
     Reduced-motion users get everything shown instantly (see CSS).
     --------------------------------------------------------------------- */
  const revealIO = (function scrollReveal() {
    const selector = ".fade-up, .reveal";
    const items = document.querySelectorAll(selector);

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return null;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            el.classList.remove("is-exit");
          } else if (
            entry.boundingClientRect.bottom < 0 &&
            el.classList.contains("is-visible")
          ) {
            // Fully scrolled past above the viewport (not just partially
            // out) — only then apply the soft exit, so text never dims
            // while any part of it is still on screen.
            el.classList.add("is-exit");
          }
        });
      },
      { threshold: [0, 0.12, 0.88, 1], rootMargin: "0px 0px 0px 0px" },
    );

    items.forEach((el) => io.observe(el));
    return io;
  })();

  // Lets dynamically-rendered nodes (new wish cards, etc.) join the
  // same reveal system after they're inserted into the DOM.
  window.observeReveal = function (el) {
    if (revealIO && el) revealIO.observe(el);
  };

  /* ---------------------------------------------------------------------
     Subtle hero parallax — the cover photo drifts a touch slower than
     the page as you scroll past it, for a bit of depth on mobile.
     --------------------------------------------------------------------- */
  (function heroParallax() {
    const hero = document.getElementById("hero");
    const photo = document.getElementById("hero-photo");
    // Hero now lives inside #page-scroll, which is the element that
    // actually scrolls (the document/window no longer does), so the
    // scroll listener has to sit on that container instead of window.
    const scrollSource = document.getElementById("page-scroll") || window;
    if (!hero || !photo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    function update() {
      const rect = hero.getBoundingClientRect();
      const raw = rect.top * -0.15;
      const offset = Math.max(-60, Math.min(60, raw));
      photo.style.transform = `translateY(${offset}px) scale(1.08)`;
      ticking = false;
    }
    scrollSource.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true },
    );
    update();
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
        audio
          .play()
          .then(() => btn.classList.add("playing"))
          .catch(() => {});
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
        status.textContent =
          "RSVP is not connected yet — see README.md Step 2.";
        status.className = "form-status error";
        return;
      }

      const payload = {
        name: document.getElementById("rsvp-name").value.trim(),
        attendance: attendance,
        guests:
          attendance === "Attending"
            ? document.getElementById("rsvp-guests").value
            : "0",
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
          document
            .querySelectorAll(".attend-btn")
            .forEach((b) => b.classList.remove("active"));
          document
            .getElementById("guest-count-wrap")
            .classList.remove("hidden");
          fetchWishes(); // refresh immediately so the new wish shows up
        } else {
          throw new Error((data && data.message) || "Unknown error");
        }
      } catch (err) {
        status.textContent =
          "Something went wrong. Please try again in a moment.";
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
      const res = await fetch(
        `${cfg.appsScriptUrl}?action=wishes&t=${Date.now()}`,
      );
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
        </div>`,
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
