import { getCollection, type CollectionEntry } from "astro:content";

export type Person = CollectionEntry<"people">;
export type Publication = CollectionEntry<"publications">;

// Tag vocabulary (must match the `areas` enum in content.config.ts). A paper may
// carry several — a research topic, an application, and a publication type.
export type AreaSlug =
  | "soft-robotics"
  | "tactile-sensing"
  | "autonomy"
  | "medical"
  | "assistive"
  | "field"
  | "review"
  | "letter";

export const AREA_LABELS: Record<AreaSlug, string> = {
  "soft-robotics": "Soft robotics",
  "tactile-sensing": "Tactile sensing",
  autonomy: "Learning & autonomy",
  medical: "Medical & surgical",
  assistive: "Assistive & rehabilitation",
  field: "Underwater & nuclear",
  review: "Review",
  letter: "Letter / commentary",
};

// Research-page sections, grouped (topics vs. applications), with blurbs.
export const RESEARCH_GROUPS: { title: string; areas: { slug: AreaSlug; blurb: string }[] }[] = [
  {
    title: "Research topics",
    areas: [
      { slug: "soft-robotics", blurb: "Eversion (vine) robots, fabric and silicone actuators, and soft grippers that bend, grow and squeeze." },
      { slug: "tactile-sensing", blurb: "Sensing skins and force sensors that tell a robot where, and how hard, it is being touched." },
      { slug: "autonomy", blurb: "Learning and modelling so that robots can grasp, manipulate and navigate with less human guidance." },
    ],
  },
  {
    title: "Applications",
    areas: [
      { slug: "medical", blurb: "Tissue palpation, colonoscopy and robot-assisted minimally invasive surgery." },
      { slug: "assistive", blurb: "Soft wearable gloves and exoskeletons that support grip and hand rehabilitation." },
      { slug: "field", blurb: "Soft robots for underwater exploration and for inspecting nuclear pipework." },
    ],
  },
];

// Publications filter chips, grouped (slugs reference AREA_LABELS).
export const FILTER_GROUPS: { title: string; slugs: AreaSlug[] }[] = [
  { title: "Topic", slugs: ["soft-robotics", "tactile-sensing", "autonomy"] },
  { title: "Application", slugs: ["medical", "assistive", "field"] },
  { title: "Type", slugs: ["review"] },
];

/** Research-page groups → each area with its most-recent pubs (capped) + total count. */
export async function getResearchGroups(limit = 4) {
  const pubs = await getPublications();
  return RESEARCH_GROUPS.map((g) => ({
    title: g.title,
    areas: g.areas
      .map((a) => {
        const all = pubs.filter((p) => p.data.areas.includes(a.slug));
        return { slug: a.slug, label: AREA_LABELS[a.slug], blurb: a.blurb, pubs: all.slice(0, limit), total: all.length };
      })
      .filter((a) => a.total > 0),
  })).filter((g) => g.areas.length > 0);
}

/** Count of publications per area slug (for filter-chip labels). */
export async function getAreaCounts() {
  const pubs = await getPublications();
  const counts: Partial<Record<AreaSlug, number>> = {};
  for (const p of pubs) for (const a of p.data.areas as AreaSlug[]) counts[a] = (counts[a] || 0) + 1;
  return counts;
}

// Display order of groups within the People page.
export const GROUP_ORDER = [
  "Faculty",
  "Researchers",
  "Staff",
  "Students",
  "Affiliates",
  "Alumni",
] as const;

const byOrder = (a: Person, b: Person) => a.data.order - b.data.order;

/** People grouped and ordered: current groups first, then Alumni. */
export async function getGroupedPeople() {
  const people = await getCollection("people");
  return GROUP_ORDER.map((group) => ({
    group,
    people: people.filter((p) => p.data.group === group).sort(byOrder),
  })).filter((g) => g.people.length > 0);
}

/** Publications newest-first. */
export async function getPublications() {
  const pubs = await getCollection("publications");
  return pubs.sort(
    (a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title),
  );
}

// --- author <-> person matching (best-effort, for profile pages) -----------

const normAlpha = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z]/g, "");

export interface PersonKey {
  initial: string;
  last: string;
}

export function personKey(name: string): PersonKey {
  const base = name.split(",")[0].trim(); // drop trailing credentials
  const toks = base.split(/\s+/);
  return {
    initial: (normAlpha(toks[0])[0] || ""),
    last: normAlpha(toks[toks.length - 1] || ""),
  };
}

/** Does a CV-style author string ("Miller GN", "Ortega-Marquez J") name this person? */
export function authorIsPerson(author: string, pk: PersonKey): boolean {
  if (!pk.last) return false;
  const m = author.trim().match(/^(.*?)\s+([A-Za-z]{1,4})$/);
  const wholeLast = normAlpha(m ? m[1] : author);
  const initials = m ? m[2].toLowerCase() : "";
  const lastOk = wholeLast.includes(pk.last);
  const initialOk = !pk.initial || !initials || initials[0] === pk.initial;
  return lastOk && initialOk;
}

/** Publications authored by a person, newest-first (best-effort name match). */
export function publicationsForPerson(person: Person, pubs: Publication[]) {
  const pk = personKey(person.data.name);
  return pubs.filter((p) => p.data.authors.some((a) => authorIsPerson(a, pk)));
}

// Everyone profiled is treated as a "mentee" for the publication badges EXCEPT
// the people listed here (typically the PI and senior faculty/collaborators).
// Use each person's slug = their markdown filename without ".md".
// ⚙️  CUSTOMIZE: list your PI (and any senior faculty) here.
export const NON_MENTEE_SLUGS = new Set(["k-althoefer"]);

/** Build an `isMentee(authorString)` predicate from the people collection. */
export function menteeMatcher(people: Person[]) {
  const dir = people.map((p) => ({ slug: p.id, key: personKey(p.data.name) }));
  return (author: string) => {
    const d = dir.find((x) => authorIsPerson(author, x.key));
    return !!d && !NON_MENTEE_SLUGS.has(d.slug);
  };
}



/** News items, newest first. */
export async function getNews() {
  const items = await getCollection("news", (n) => !n.data.draft);
  return items.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const fmtNewsDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
