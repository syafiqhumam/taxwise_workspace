import { loadContent, initNav, waLink, qs } from "./utils.js";
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
  setText("[data-bind='hero-eyebrow']", c.hero.eyebrow);
  setText("[data-bind='hero-headline']", c.hero.headline);
  setText("[data-bind='hero-sub']", c.hero.subheadline);
  setText("[data-bind='hero-primary']", c.hero.primaryCta);
  setText("[data-bind='hero-secondary']", c.hero.secondaryCta);
  setHref("[data-bind='hero-secondary']", c.hero.secondaryHref);
  setText("[data-bind='header-cta']", c.cta.primary);

  const wa = waLink(
    c.site.whatsapp,
    "Halo TaxWise Consulting, saya ingin tanya seputar layanan konsultan pajak."
  );
  document.querySelectorAll("[data-wa]").forEach((el) => el.setAttribute("href", wa));
  setHref("[data-bind='mailto']", `mailto:${c.site.email}`);
  setText("[data-bind='mailto']", c.form.emailCta);
  document.querySelectorAll("[data-bind='instagram']").forEach((el) => {
    el.setAttribute("href", c.site.instagram);
    el.textContent = c.site.instagramHandle;
  });
  setHref("[data-bind='maps']", c.site.mapsUrl);
  setText("[data-bind='maps']", c.site.mapsLabel);
  setText("[data-bind='address']", c.site.address);
  setText("[data-bind='wa-display']", c.site.whatsappDisplay);
  setText("[data-bind='footer-blurb']", c.footer.blurb);
  setText("[data-bind='layanan-title']", c.services.title);
  setText("[data-bind='layanan-intro']", c.services.intro);
  setText("[data-bind='layanan-cta']", c.services.afterCta);
  setText("[data-bind='audience-title']", c.audiences.title);
  setText("[data-bind='audience-intro']", c.audiences.intro);
  setText("[data-bind='sharing-title']", c.articles.title);
  setText("[data-bind='sharing-intro']", c.articles.intro);
  setText("[data-bind='sharing-ig-prefix']", c.articles.instagramCtaPrefix);
  setText("[data-bind='why-title']", c.why.title);
  setText("[data-bind='why-intro']", c.why.intro);
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
        (s, i) => `<article class="card reveal">
          <div class="pillar-index">0${i + 1}</div>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </article>`
      )
      .join("");
  }

  const audiences = qs("#audience-cards");
  if (audiences) {
    audiences.innerHTML = c.audiences.items
      .map(
        (s) => `<article class="card reveal">
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </article>`
      )
      .join("");
  }

  const why = qs("#why-points");
  if (why) {
    why.innerHTML = c.why.points
      .map(
        (s) => `<article class="card reveal">
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </article>`
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
    teamImg.alt = c.why.photoAlt;
  }
  setText("#team-caption", c.why.photoCaption);
}

async function boot() {
  initNav();
  const content = await loadContent();
  window.__TAXWISE_CONTENT__ = content;
  renderFromContent(content);
  renderArticles(content);
  initForm(content);
}

boot().catch((err) => {
  console.error(err);
});
