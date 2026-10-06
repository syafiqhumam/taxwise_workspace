import { qs, waLink } from "./utils.js";

function buildMessage(values, site) {
  const lines = [
    "Halo TaxWise Consulting, saya ingin konsultasi gratis.",
    "",
    `Nama: ${values.name}`,
    `Nama usaha / NPWP: ${values.business || "-"}`,
    `Kebutuhan: ${values.need}`,
    "",
    "Pertanyaan:",
    values.question,
  ];
  return lines.join("\n");
}

export function initForm(content) {
  const form = qs("#konsultasi-form");
  if (!form) return;

  const fields = content.form.fields;
  const errors = content.form.errors;
  const site = content.site;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") || "").trim(),
      business: String(data.get("business") || "").trim(),
      need: String(data.get("need") || "").trim(),
      question: String(data.get("question") || "").trim(),
    };

    const invalid = {
      name: fields.name.required && values.name.length < 2,
      need: fields.need.required && !values.need,
      question: fields.question.required && values.question.length < 5,
    };

    qs("#error-name").textContent = invalid.name ? errors.name : "";
    qs("#error-need").textContent = invalid.need ? errors.need : "";
    qs("#error-question").textContent = invalid.question ? errors.question : "";

    const firstInvalid = Object.entries(invalid).find(([, v]) => v);
    if (firstInvalid) {
      qs(`[name="${firstInvalid[0]}"]`).focus();
      return;
    }

    const url = waLink(site.whatsapp, buildMessage(values, site));
    form.dataset.lastWaUrl = url;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

export { buildMessage };
