export function qs(sel, root = document) {
  return root.querySelector(sel);
}

export function qsa(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

export async function loadContent() {
  const res = await fetch("data/content.json");
  if (!res.ok) throw new Error("Gagal memuat konten");
  return res.json();
}

export function formatDate(iso, locale = "id-ID") {
  const d = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function waLink(phone, text = "") {
  const base = `https://wa.me/${phone}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
