# Publications

Every `.bib` file in this folder is read by the website, and every entry in it
becomes one paper on the Publications page (and on each author's profile).

## Adding a paper

1. On the paper's page, click **Cite** / **Export citation** and choose **BibTeX**.
2. Either paste the entry into `saphir.bib`, or save the downloaded `.bib` file
   into this folder (any file name ending in `.bib`).

That's it. Title, authors, year, venue and DOI are taken from the BibTeX.

## Research areas (optional)

Add a `keywords` field to choose the areas a paper is filed under:

```bibtex
keywords = {soft-robotics, medical}
```

Available: `soft-robotics`, `tactile-sensing`, `autonomy`, `medical`,
`assistive`, `field`, `review`. Without `keywords`, the areas are guessed from
words in the title.

## Removing a paper

Delete its entry (or its `.bib` file).
