/* ============================================================
   THE SOCIAL SNOW — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Navbar scroll state ---- */
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".scroll-progress");
  const toTop = document.querySelector(".to-top");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 20);
    if (toTop) toTop.classList.toggle("show", y > 600);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Back to top ---- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.getAttribute("data-count"));
          const suffix = el.getAttribute("data-suffix") || "";
          const dur = 1600;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Year in footer ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Calendly booking popup ----
     👉 Replace CALENDLY_URL below with your real Calendly link after you
        create the account (e.g. "https://calendly.com/thesocialsnow/discovery-call").
        This is the ONLY place you need to change it. */
  var CALENDLY_URL = "https://calendly.com/contactthesocialsnow/meeting";
  document.querySelectorAll(".js-book-call").forEach(function (el) {
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      } else {
        // Calendly script not ready — open the booking page in a new tab as a fallback
        window.open(CALENDLY_URL, "_blank", "noopener");
      }
    });
  });

  /* ---- Contact / quote form (demo handler -> mailto) ---- */
  document.querySelectorAll("form[data-mailto]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const data = new FormData(form);
      const get = function (k) { return (data.get(k) || "").toString().trim(); };
      const to = form.getAttribute("data-mailto");
      const subject = encodeURIComponent(
        (form.getAttribute("data-subject") || "New enquiry") +
        (get("service") ? " — " + get("service") : "")
      );
      const lines = [];
      if (get("name")) lines.push("Name: " + get("name"));
      if (get("business")) lines.push("Business: " + get("business"));
      if (get("email")) lines.push("Email: " + get("email"));
      if (get("phone")) lines.push("Phone: " + get("phone"));
      if (get("service")) lines.push("Service interested in: " + get("service"));
      if (get("message")) lines.push("\nMessage:\n" + get("message"));
      const body = encodeURIComponent(lines.join("\n"));

      const note = form.querySelector(".form-success");
      if (note) {
        note.classList.add("show");
        note.textContent = "Thanks " + (get("name") || "there") + "! Opening your email app to send the message…";
      }
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      form.reset();
    });
  });
})();
