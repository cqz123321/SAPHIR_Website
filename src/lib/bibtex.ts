/*
  BibTeX loader for the publications collection.

  Every *.bib file in src/content/publications/ is read; every entry in those
  files becomes one publication. So adding a paper is just:
    • paste its BibTeX into saphir.bib, or
    • drop the .bib file you downloaded ("Cite" / "Export citation") into the folder.

  Fields used: title, author, year (or date), journal / booktitle / publisher /
  howpublished (shown as the venue), doi, url, and optionally
  keywords = {soft-robotics, medical, …} to set the research areas. Without
  keywords, areas are guessed from the title (see AUTO_TAGS).
*/
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Loader } from "astro/loaders";
import { parse } from "@retorquere/bibtex-parser";

export const AREA_SLUGS = [
  "soft-robotics",
  "tactile-sensing",
  "autonomy",
  "medical",
  "assistive",
  "field",
  "review",
  "letter",
] as const;
type Area = (typeof AREA_SLUGS)[number];

// Title keywords → research area (used only when an entry has no `keywords`).
const AUTO_TAGS: [Area, RegExp][] = [
  ["soft-robotics", /\b(soft|evert|eversion|vine|inflatable|fabric|textile|continuum|actuat|gripper|exoskeleton|glove|growing)/i],
  ["tactile-sensing", /\b(tactile|e-?skin|skin|sensor|sensing|touch|force|palpation|haptic|proprioception)/i],
  ["autonomy", /\b(learning|autonom|navigation|manipulat|grasp|planning|ai\b|control)/i],
  ["medical", /\b(surg|colonoscop|tissue|palpation|medical|clinical|endoscop|minimally invasive|biomedical)/i],
  ["assistive", /\b(assistive|rehabilit|exoskeleton|glove|wearable)/i],
  ["field", /\b(underwater|nuclear|pipe|marine|radiation|subsea)/i],
  ["review", /\b(review|state of the art|survey|perspective|challenges)/i],
];

const clean = (s: unknown) =>
  String(s ?? "")
    .replace(/ı̂/g, "î")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();

const initials = (first: string) =>
  first
    .replace(/[.\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join("");

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

export function readBibDir(dir: string, warn: (m: string) => void = console.warn) {
  if (!existsSync(dir)) return [];
  const out: { id: string; data: Record<string, unknown> }[] = [];
  const seen = new Set<string>();
  for (const file of readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".bib")).sort()) {
    const res = parse(readFileSync(join(dir, file), "utf8"), {
      english: false,
      sentenceCase: false,
      caseProtection: false,
    });
    for (const err of res.errors ?? []) warn(`[bibtex] ${file}: ${err.error ?? JSON.stringify(err)}`);
    for (const e of res.entries) {
      const f = e.fields as Record<string, any>;
      const title = clean(f.title);
      const year = parseInt(String(f.year ?? f.date ?? "").slice(0, 4), 10);
      if (!title || !year) {
        warn(`[bibtex] ${file}: skipped "${e.key}" (needs a title and a year)`);
        continue;
      }
      const authors = (f.author ?? []).map((a: any) =>
        a.name ? clean(a.name) : `${clean(a.lastName)} ${initials(clean(a.firstName ?? ""))}`.trim(),
      );
      const venue = clean(
        f.journal ?? f.journaltitle ?? f.booktitle ?? f.howpublished ?? f.publisher ??
          (f.archiveprefix || f.eprinttype ? `${f.archiveprefix ?? f.eprinttype} preprint` : ""),
      );
      const doi = clean(f.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
      const kw: string[] = (Array.isArray(f.keywords) ? f.keywords : String(f.keywords ?? "").split(/[,;]/))
        .map((k: string) => clean(k).toLowerCase())
        .filter(Boolean);
      let areas = kw.filter((k): k is Area => (AREA_SLUGS as readonly string[]).includes(k));
      if (!areas.length) areas = AUTO_TAGS.filter(([, re]) => re.test(title)).map(([a]) => a);

      let id = slugify(`${year}-${e.key}`) || `${year}-${seen.size}`;
      while (seen.has(id)) id += "-b";
      seen.add(id);
      out.push({
        id,
        data: {
          title,
          authors,
          year,
          ...(venue && { journal: venue }),
          ...(doi && { doi }),
          ...(f.url && { url: clean(f.url) }),
          areas: [...new Set(areas)],
        },
      });
    }
  }
  return out;
}

/** Astro content loader: all .bib files in `dir`, re-read when any changes in dev. */
export function bibtexLoader(dir: string): Loader {
  return {
    name: "bibtex-loader",
    load: async ({ store, parseData, logger, watcher }) => {
      const sync = async () => {
        store.clear();
        for (const e of readBibDir(dir, (m) => logger.warn(m))) {
          store.set({ id: e.id, data: await parseData(e) });
        }
      };
      await sync();
      watcher?.add(dir);
      watcher?.on("all", (_event, path) => {
        if (path.toLowerCase().endsWith(".bib")) void sync();
      });
    },
  };
}
