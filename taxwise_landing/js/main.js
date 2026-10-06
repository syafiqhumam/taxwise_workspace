import { loadContent, waLink, qs } from "./utils.js";
import { renderArticles } from "./articles.js";
import { initForm } from "./form.js";

function setText(sel, text) {
  const el = qs(sel);
  if (el && text != null) el.textContent = text;
}

function setHref(sel, href) {
  const el = qs(sel);
  if (el && href) el.setAttribute("href", href);
}

function renderFromContent(c) {
  document.title = c.site.title;
  setText("[data-bind='name']", c.site.name);
  setText("[data-bind='hero-headline']", c.hero.headline);
  setText("[data-bind='hero-sub']", c.hero.subheadline);
  setText("[data-bind='hero-primary']", c.hero.primaryCta);
  setText("[data-bind='hero-wa']", c.hero.secondaryCta);

  const wa = waLink(
    c.site.whatsapp,
    "Halo TaxWise Consulting, saya ingin tanya seputar layanan konsultan pajak."
  );
  document.querySelectorAll("[data-wa]").forEach((el) => el.setAttribute("href", wa));
  setHref("[data-bind='instagram']", c.site.instagram);
  setText("[data-bind='instagram-handle']", c.site.instagramHandle);
  setHref("[data-bind='email']", "mailto:" + c.site.email);
  setText("[data-bind='email-display']", c.site.email);
  setHref("[data-bind='maps']", c.site.mapsUrl);
  setText("[data-bind='maps']", c.site.mapsLabel);
  setText("[data-bind='address']", c.site.address);
  setText("[data-bind='wa-display']", c.site.whatsappDisplay);
  setText("[data-bind='footer-blurb']", c.footer.blurb);
  setText("[data-bind='layanan-title']", c.services.title);
  setText("[data-bind='layanan-partner']", c.services.partner);
  setText("[data-bind='layanan-list-title']", c.services.listTitle);
  setText("[data-bind='layanan-close']", c.services.close);
  setText("[data-bind='proses-title']", c.process.title);
  setText("[data-bind='audience-title']", c.audiences.title);
  setText("[data-bind='sharing-title']", c.articles.title);
  setText("[data-bind='sharing-intro']", c.articles.intro);
  setText("[data-bind='why-title']", c.why.title);
  setText("[data-bind='faq-title']", c.faq.title);
  setText("[data-bind='faq-intro']", c.faq.intro);
  setText("[data-bind='form-title']", c.form.title);
  setText("[data-bind='form-intro']", c.form.intro);
  setText("[data-bind='submit']", c.form.submitLabel);

  const nav = qs("#site-nav");
  if (nav) {
    nav.innerHTML = c.nav
      .map((item) => `<a href="${item.href}">${item.label}</a>`)
      .join("");
  }

  const pillars = qs("#pillars");
  if (pillars) {
    pillars.innerHTML = c.services.items
      .map(
        (s, i) => `<article class="offer-card" style="--d:${i * 110}ms">
          <span class="offer-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path class="offer-tick" d="M5 12.5 10 17.5 19 7.5" />
            </svg>
          </span>
          <h3>${s.title}</h3>
        </article>`
      )
      .join("");
  }

  const audiences = qs("#audience-cards");
  if (audiences) {
    audiences.innerHTML = c.audiences.items
      .map(
        (s) => `<article class="card audience-card reveal">
          <img class="audience-illust" src="${s.image}" alt="" width="120" height="96" loading="lazy" decoding="async" />
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </article>`
      )
      .join("");
  }

  const why = qs("#why-points");
  if (why) {
    const arcs = [
      "M12,34 Q150,16 288,32",
      "M12,22 Q150,42 288,24",
      "M8,36 Q150,14 292,34",
      "M8,20 Q150,44 292,22",
    ];
    const parallaxSpeeds = [-0.68, -0.82, -0.96, -1.12];
    why.innerHTML = c.why.points
      .map((s, i) => {
        const id = `why-arc-${i}`;
        const size = s.title.length > 26 ? 10 : s.title.length > 18 ? 12 : 15;
        const drift = parallaxSpeeds[i] ?? -0.9;
        return `<article class="why-doodle">
          <p class="why-caption">${s.text}</p>
          <div class="why-doodle-layer" data-parallax="${drift}">
            <svg viewBox="0 0 300 52" role="img" aria-label="${s.title}">
              <path id="${id}" d="${arcs[i % arcs.length]}" fill="none" />
              <text font-size="${size}" text-anchor="middle">
                <textPath href="#${id}" startOffset="50%">${s.title}</textPath>
              </text>
            </svg>
          </div>
        </article>`;
      })
      .join("");
  }

  const faq = qs("#faq-list");
  if (faq) {
    faq.innerHTML = c.faq.items
      .map(
        (item) => `<details class="faq-item reveal">
          <summary>${item.q}</summary>
          <div class="faq-body"><p>${item.a}</p></div>
        </details>`
      )
      .join("");
  }

  const need = qs("#need");
  if (need) {
    need.innerHTML = c.form.fields.need.options
      .map((o) => `<option value="${o.value}">${o.label}</option>`)
      .join("");
  }

  const teamImg = qs("#team-photo");
  if (teamImg) {
    if (c.why.photoSrc) teamImg.src = c.why.photoSrc;
    teamImg.alt = c.why.photoAlt;
  }
  setText("#team-caption", c.why.photoCaption);
}

async function boot() {
  const content = await loadContent();
  window.__TAXWISE_CONTENT__ = content;
  renderFromContent(content);
  renderArticles(content);
  initForm(content);
  initReveal();
  initParallax();
  initLaptop();
  initScrollChrome();
  initSpotlight();
}

function initParallax() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const roots = [document.querySelector(".hero"), document.querySelector("#kenapa")].filter(Boolean);
  if (!roots.length) return;

  let frame = 0;

  const update = () => {
    frame = 0;
    roots.forEach((root) => {
      const rect = root.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const distance = Math.max(0, -rect.top);
      const heroBoost = root.classList.contains("hero") ? 3.25 : 1;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const kenapaMobile = root.id === "kenapa" && isMobile;
      root.querySelectorAll("[data-parallax]").forEach((el) => {
        if (kenapaMobile) {
          el.style.transform = "";
          return;
        }
        if (
          isMobile &&
          (el.classList.contains("hero-person-back-wrap") || el.classList.contains("hero-person-front"))
        ) {
          el.style.transform = "";
          return;
        }
        const speed = Number(el.dataset.parallax) || 0;
        const offset = distance * speed * heroBoost;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    });
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  update();
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const REVEAL_SELECTOR = ".reveal, .rise, .reveal-play";

function initReveal() {
  const groups = ["#audience-cards", "#article-grid", "#faq-list"];
  const stagger = () =>
    groups.forEach((sel) => {
      document.querySelectorAll(`${sel} > .reveal`).forEach((el, i) => el.style.setProperty("--i", i % 6));
    });
  stagger();

  if (prefersReduced() || !("IntersectionObserver" in window)) {
    const showAll = () => document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add("is-in"));
    showAll();
    new MutationObserver(showAll).observe(qs("#konten"), { childList: true, subtree: true });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
  );
  const watch = () =>
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      if (!el.classList.contains("is-in")) io.observe(el);
    });
  watch();

  new MutationObserver(() => {
    stagger();
    watch();
  }).observe(qs("#konten"), { childList: true, subtree: true });
}

function initScrollChrome() {
  const header = qs(".site-header");
  const bar = qs(".scroll-progress");
  let frame = 0;

  const update = () => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? clamp01(window.scrollY / max) : 0;
    if (bar) bar.style.setProperty("--scroll", ratio.toFixed(4));
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  update();

  const links = [...document.querySelectorAll("#site-nav a[href^='#']")];
  if (!links.length || !("IntersectionObserver" in window)) return;
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const visible = new Map();

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let best = null;
      let bestRatio = 0;
      sections.forEach((s) => {
        const r = visible.get(s.id) || 0;
        if (r > bestRatio) {
          best = s.id;
          bestRatio = r;
        }
      });
      links.forEach((a) => {
        const on = a === byId.get(best);
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] }
  );
  sections.forEach((s) => spy.observe(s));
}

function initLaptop() {
  const stage = qs("#coretax");
  if (!stage) return;
  const counters = [...stage.querySelectorAll("[data-count]")];
  const setCount = (ratio) =>
    counters.forEach((el) => {
      el.textContent = Math.round(Number(el.dataset.count) * ratio).toLocaleString("id-ID");
    });

  if (prefersReduced()) {
    stage.classList.add("is-open");
    setCount(1);
    return;
  }

  const desktop = window.matchMedia("(min-width: 768px)");
  const sticky = qs(".laptop-sticky", stage);
  let frame = 0;

  const update = () => {
    frame = 0;
    if (!desktop.matches) return;
    const rect = stage.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const range = stage.offsetHeight - sticky.offsetHeight;
    const progress = range > 0 ? clamp01((top - rect.top) / range) : 1;
    const open = easeOut(clamp01(progress / 0.45));
    const p = clamp01((progress - 0.45) / 0.45);
    stage.style.setProperty("--open", open.toFixed(4));
    stage.style.setProperty("--p", p.toFixed(4));
    setCount(easeOut(clamp01((p - 0.26) / 0.34)));
  };
  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  let counted = false;
  const countUp = () => {
    if (counted) return;
    counted = true;
    const start = performance.now() + 1300;
    const tick = (now) => {
      const t = clamp01((now - start) / 1400);
      setCount(easeOut(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            if (desktop.matches || !entries.some((e) => e.isIntersecting)) return;
            stage.classList.add("is-open");
            countUp();
            io.disconnect();
          },
          { threshold: 0.35 }
        )
      : null;

  const onMode = () => {
    if (desktop.matches) {
      stage.classList.remove("is-open");
      requestUpdate();
    } else {
      stage.style.removeProperty("--open");
      stage.style.removeProperty("--p");
      if (io) io.observe(stage);
      else {
        stage.classList.add("is-open");
        setCount(1);
      }
    }
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  if (typeof desktop.addEventListener === "function") desktop.addEventListener("change", onMode);
  onMode();
}

function initSpotlight() {
  const fine = window.matchMedia("(min-width: 768px) and (hover: hover)");
  if (!fine.matches || prefersReduced()) return;
  const SELECTOR = ".card, .offer-card, .faq-item";

  document.addEventListener(
    "pointermove",
    (e) => {
      const card = e.target.closest?.(SELECTOR);
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      if (card.classList.contains("audience-card")) {
        const rx = ((y / r.height) - 0.5) * -6;
        const ry = ((x / r.width) - 0.5) * 8;
        card.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
      }
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerout",
    (e) => {
      const card = e.target.closest?.(".audience-card");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    },
    { passive: true }
  );
}

boot().catch((err) => {
  console.error(err);
});
