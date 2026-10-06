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
        (item) => `<details class="faq-item">
          <summary>${item.q}</summary>
          <p>${item.a}</p>
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
  initRise();
  initParallax();
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

function initRise() {
  const nodes = document.querySelectorAll(".rise");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-in"));
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
    { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
  );
  nodes.forEach((el) => io.observe(el));
}

boot().catch((err) => {
  console.error(err);
});
