// next/image loader: photos are pre-rendered to static WebP files at a few
// widths by scripts/optimize-images.mjs, so no image server is needed.
const WIDTHS = [480, 828, 1200, 1920];   // keep in step with the script and next.config.ts

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith('/images/') || !/\.(jpe?g|png)$/i.test(src)) return src;   // logo.svg etc. pass through
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  const slug = src.slice('/images/'.length).replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `/images/opt/${slug}-${w}.webp`;
}
