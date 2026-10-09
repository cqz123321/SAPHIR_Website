// Download any figure listed in src/data/figures.ts whose image file is missing
// from src/assets/figures/. Runs automatically before `npm run dev` and
// `npm run build`; never fails the build — a figure that can't be fetched is
// simply not shown until its image exists.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/assets/figures");
const src = readFileSync(join(ROOT, "src/data/figures.ts"), "utf8");
const pairs = [...src.matchAll(/image:\s*"([^"]+)",\s*\n\s*source:\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]);

mkdirSync(OUT, { recursive: true });
let got = 0, failed = 0;
for (const [file, url] of pairs) {
  const dest = join(OUT, file);
  if (existsSync(dest)) continue;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36",
        Accept: "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(30000),
    });
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.startsWith("image/")) throw new Error(`${res.status} ${type}`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    got++;
    console.log(`[figures] downloaded ${file}`);
  } catch (e) {
    failed++;
    console.warn(`[figures] could not download ${file} (${e.message}) — it will be skipped`);
  }
}
if (got || failed) console.log(`[figures] ${got} downloaded, ${failed} skipped`);
