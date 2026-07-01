/**
* Virupakshappa Janadri — Portfolio scripts
* Navigation, accessible mobile menu, scroll-spy, reveal-on-scroll, back-to-top, hero type effect.
*/
(function () {
  "use strict";

  const select = (el, all = false) =>
    all ? [...document.querySelectorAll(el)] : document.querySelector(el);

  const on = (type, el, listener, all = false) => {
    const elements = select(el, all);
    if (!elements) return;
    if (all) elements.forEach((e) => e.addEventListener(type, listener));
    else elements.addEventListener(type, listener);
  };

  const body = document.body;
  const header = select("#header");
  const navToggle = select(".mobile-nav-toggle");
  const backdrop = select(".nav-backdrop");

  /**
   * Accessible mobile navigation
   */
  const setMenu = (open) => {
    body.classList.toggle("mobile-nav-active", open);
    if (backdrop) backdrop.hidden = !open;
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      const icon = navToggle.querySelector("i");
      if (icon) icon.className = open ? "bi bi-x" : "bi bi-list";
    }
  };

  if (navToggle) on("click", ".mobile-nav-toggle", () => setMenu(!body.classList.contains("mobile-nav-active")));
  if (backdrop) on("click", ".nav-backdrop", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("mobile-nav-active")) setMenu(false);
  });

  /**
   * Smooth scroll for in-page links; closes the mobile menu first
   */
  const scrollTo = (hash) => {
    const target = select(hash);
    if (!target) return;
    window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  };

  on(
    "click",
    ".scrollto",
    function (e) {
      const hash = this.hash;
      if (!hash || !select(hash)) return;
      e.preventDefault();
      if (body.classList.contains("mobile-nav-active")) setMenu(false);
      scrollTo(hash);
    },
    true
  );

  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) scrollTo(window.location.hash);
  });

  /**
   * Navbar scroll-spy
   */
  const navLinks = select("#navbar .scrollto", true);
  const scrollSpy = () => {
    const position = window.scrollY + 220;
    navLinks.forEach((link) => {
      if (!link.hash) return;
      const section = select(link.hash);
      if (!section) return;
      const active = position >= section.offsetTop && position < section.offsetTop + section.offsetHeight;
      link.classList.toggle("active", active);
    });
  };
  window.addEventListener("load", scrollSpy);
  document.addEventListener("scroll", scrollSpy, { passive: true });

  /**
   * Back-to-top button
   */
  const backToTop = select(".back-to-top");
  if (backToTop) {
    const toggleBackToTop = () => backToTop.classList.toggle("active", window.scrollY > 120);
    window.addEventListener("load", toggleBackToTop);
    document.addEventListener("scroll", toggleBackToTop, { passive: true });
  }

  /**
   * Reveal-on-scroll via IntersectionObserver.
   * Elements are visible by default (CSS only hides them when .js is set),
   * so content never gets stuck hidden if JS or the observer is unavailable.
   */
  const revealEls = select(".reveal", true);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
    // Safety net: reveal everything once fully loaded, in case observer misses.
    window.addEventListener("load", () => {
      setTimeout(() => revealEls.forEach((el) => el.classList.add("is-visible")), 1200);
    });
  }

  /**
   * Hero type effect
   */
  const typed = select(".typed");
  if (typed && typeof Typed !== "undefined") {
    new Typed(".typed", {
      strings: typed.getAttribute("data-typed-items").split(","),
      loop: true,
      typeSpeed: 90,
      backSpeed: 45,
      backDelay: 2000,
    });
  }

  /**
   * Footer year
   */
  const yearEl = select(".year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
