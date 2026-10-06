import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src =
  process.argv[2] ??
  "C:/Users/Fiqi/.cursor/projects/c-laravel-app-Project-taxwise-workspace-taxwise-landing/assets/c__Users_Fiqi_AppData_Roaming_Cursor_User_workspaceStorage_f491f9cd18ec7b985fedf31d23c0dc97_images_kemekumham-72674948-6395-4de7-b2cf-dcac557b184f.webp";
const out = join(root, "assets", "kemenkumham.png");
const targetHeight = 96;

const { data, info } = await sharp(src)
  .resize({ height: targetHeight, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const isNearWhite = r > 235 && g > 235 && b > 235;
  const isLightGrayFringe = min > 190 && max - min < 35;
  if (isNearWhite || isLightGrayFringe) {
    data[i + 3] = 0;
  }
}

const w = info.width;
const h = info.height;
const rx = Math.round(Math.min(w, h) * 0.2);
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${rx}" ry="${rx}" fill="white"/></svg>`
);

await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .png()
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toFile(out);

console.log(`Wrote ${out} (${w}x${h}, rx=${rx})`);
