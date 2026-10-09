import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { bibtexLoader, AREA_SLUGS } from "./lib/bibtex";
import { z } from "zod";

/*
  Content collections for the lab site (Astro 6 Content Layer API).

  Content lives in src/content/<collection>/*.md so a CMS (Sveltia/Decap) can
  layer on later with no schema change.
  Safety defaults fail closed: figures default to rightsConfirmed:false and are
  filtered out of every figure query, so a half-filled record can never leak.
*/

// People — bio lives in the markdown body (use render()).
const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/people" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      status: z.enum(["current", "alumni"]),
      group: z.enum([
        "Faculty",
        "Researchers",
        "Staff",
        "Students",
        "Affiliates",
        "Alumni",
      ]),
      role: z.string(),
      title: z.string().optional(),
      // Degrees / honours, e.g. "Dipl.-Ing. Aachen, PhD, IEEE Fellow".
      credentials: z.string().optional(),
      headshot: image().optional(),
      links: z
        .object({
          email: z.email().optional(),
          twitter: z.url().optional(),
          scholar: z.url().optional(),
          orcid: z.url().optional(),
          linkedin: z.url().optional(),
          website: z.url().optional(),
        })
        .default({}),
      order: z.number().default(0),
      featured: z.boolean().default(false),
      // Alumni / student-project details, all optional. Alumni: `status: alumni`
      // (keep the original `group`) + title "Dr", programme, year → Alumni cards.
      // MSc/MEng students: programme "MSc"/"MEng" + project, supervisors, year →
      // the MSc projects table.
      programme: z.string().optional(), //        e.g. "PhD", "MSc", "MEng"
      project: z.string().optional(), //          research project title
      supervisors: z.string().optional(), //      supervisor name(s)
      year: z.number().optional(), //             graduation year
      currentPosition: z.string().optional(), //  current role or institution
    }),
});

// Publications — read from BibTeX: every entry in every .bib file in
// src/content/publications/ is one paper (see src/lib/bibtex.ts).
const publications = defineCollection({
  loader: bibtexLoader("./src/content/publications"),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    journal: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().optional(),
    // Research areas — mirrored by labels/groups in src/lib/content.ts.
    areas: z.array(z.enum(AREA_SLUGS)).default([]),
  }),
});

// Gallery — lab-life photos.
const gallery = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/gallery" }),
  schema: ({ image }) =>
    z.object({
      image: image(), // for a video: its poster frame
      caption: z.string(),
      // Optional video, as a path under public/ (e.g. "gallery/party.mp4"); the image is its poster.
      video: z.string().optional(),
      date: z.coerce.date(),
      people: z.array(z.string()).optional(),
      featured: z.boolean().default(false),
    }),
});

// News — one short Markdown file per item in src/content/news/ (see its README).
const news = defineCollection({
  loader: glob({ pattern: ["**/*.md", "!**/README.md"], base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(["Funding", "Event", "Talk", "Award", "Visit", "People", "Media"]).default("Event"),
    link: z.string().optional(),
    linkLabel: z.string().optional(),
  }),
});

export const collections = { people, publications, gallery, news };
