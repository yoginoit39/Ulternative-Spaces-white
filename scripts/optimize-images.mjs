// Pre-renders every photo in public/images to small WebP files at a few
// widths (public/images/opt) plus a tiny blurred placeholder each
// (src/lib/blur.json). src/lib/imageLoader.ts points next/image at them, so
// the site serves right-sized images from plain static files on any host.
//
// Runs before `dev` and `build`; only new or changed photos are re-rendered.
import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'public/images');
const OUT = path.join(SRC, 'opt');
const BLUR = path.join(root, 'src/lib/blur.json');
export const WIDTHS = [480, 828, 1200, 1920];   // keep in step with imageLoader.ts and next.config.ts
const slug = (file) => file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let sharp;
try { sharp = (await import('sharp')).default; }
catch {
  // No sharp on this machine: fine as long as the files are already there.
  if (existsSync(OUT) && existsSync(BLUR)) { console.log('images: sharp not installed, using existing files'); process.exit(0); }
  console.error('images: sharp is required to render public/images/opt (npm i -D sharp)'); process.exit(1);
}

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const blur = {};
let made = 0;

for (const file of files) {
  const input = path.join(SRC, file);
  const changed = (await stat(input)).mtimeMs;
  for (const w of WIDTHS) {
    const output = path.join(OUT, `${slug(file)}-${w}.webp`);
    if (existsSync(output) && (await stat(output)).mtimeMs >= changed) continue;
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(output);
    made++;
  }
  const tiny = await sharp(input).rotate().resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
  blur[`/images/${file}`] = `data:image/webp;base64,${tiny.toString('base64')}`;
}

await writeFile(BLUR, JSON.stringify(blur, null, 0) + '\n');
console.log(`images: ${files.length} photos, ${made} files rendered`);
