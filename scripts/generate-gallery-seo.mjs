#!/usr/bin/env node
//
// Regenerates the gallery page's JSON-LD from assets/js/projects.js.
//
// The gallery markup is built client-side from projects.js, so a crawler that
// does not run JavaScript sees an empty page — and most AI crawlers do not run
// it. This lifts the project titles, descriptions, and photo alt text into
// structured data that ships in the HTML itself.
//
// Derived at build time on purpose: add a project to projects.js and it shows
// up here automatically, the same way build-dist.sh derives the asset list.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://yellowdog.lol";
const GALLERY_URL = `${SITE}/gallery.html`;

// projects.js assigns to `window`; give it one and evaluate it.
const source = readFileSync(join(ROOT, "assets/js/projects.js"), "utf8");
const sandbox = { window: {} };
new Function("window", source)(sandbox.window);
const projects = sandbox.window.LYD_PROJECTS;

if (!Array.isArray(projects) || projects.length === 0) {
  console.error("generate-gallery-seo: no projects found in assets/js/projects.js");
  process.exit(1);
}

const photosOf = (p) =>
  Array.isArray(p.photos) && p.photos.length
    ? p.photos
    : [
        { label: "Before", src: p.before, alt: p.beforeAlt },
        { label: "After", src: p.after, alt: p.afterAlt },
      ];

const imageNodes = [];
const projectNodes = projects.map((p, i) => {
  const images = photosOf(p)
    .filter((ph) => ph.src)
    .map((ph) => {
      const url = `${SITE}/${ph.src}`;
      imageNodes.push(url);
      return {
        "@type": "ImageObject",
        contentUrl: url,
        url,
        caption: ph.alt || `${ph.label} photo for ${p.title}`,
        description: ph.alt || `${ph.label} photo for ${p.title}`,
        representativeOfPage: i === 0 && ph.label?.toLowerCase().startsWith("after"),
        creditText: "Lil Yellow Dog Diggin'",
        creator: { "@id": `${SITE}/#business` },
        copyrightNotice: "© YellowDog.lol",
        acquireLicensePage: `${SITE}/about.html#contact`,
      };
    });

  return {
    "@type": "CreativeWork",
    "@id": `${GALLERY_URL}#project-${i + 1}`,
    name: p.title,
    headline: p.title,
    description: p.description,
    genre: p.category,
    ...(p.date ? { dateCreated: p.date } : {}),
    ...(p.location ? { contentLocation: { "@type": "Place", name: p.location } } : {}),
    ...(p.equipment ? { about: p.equipment } : {}),
    creator: { "@id": `${SITE}/#business` },
    isPartOf: { "@id": `${GALLERY_URL}#gallery` },
    ...(images.length ? { image: images } : {}),
  };
});

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${GALLERY_URL}#webpage`,
      url: GALLERY_URL,
      name: "Work Gallery | Lil Yellow Dog Diggin",
      description:
        "Before and after land management project gallery for Lil Yellow Dog Diggin.",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#business` },
      inLanguage: "en-US",
    },
    {
      "@type": "ImageGallery",
      "@id": `${GALLERY_URL}#gallery`,
      name: "Lil Yellow Dog Diggin work gallery",
      description:
        "Before-and-after photographs from completed land management, excavation, and property cleanup projects.",
      isPartOf: { "@id": `${GALLERY_URL}#webpage` },
      numberOfItems: projectNodes.length,
      hasPart: projectNodes.map((n) => ({ "@id": n["@id"] })),
    },
    ...projectNodes,
    {
      "@type": "BreadcrumbList",
      "@id": `${GALLERY_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Work Gallery", item: GALLERY_URL },
      ],
    },
  ],
};

// Drop the `representativeOfPage: false` noise before serialising.
const json = JSON.stringify(
  graph,
  (k, v) => (k === "representativeOfPage" && v !== true ? undefined : v),
  2,
);
const indented = json
  .split("\n")
  .map((line) => (line ? "    " + line : line))
  .join("\n");
const block = `    <script type="application/ld+json">\n${indented}\n    </script>\n`;

const galleryPath = join(ROOT, "gallery.html");
let html = readFileSync(galleryPath, "utf8");
const existing = /[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n/;
if (!existing.test(html)) {
  console.error("generate-gallery-seo: no JSON-LD block found in gallery.html");
  process.exit(1);
}
html = html.replace(existing, block);

// --- noscript fallback -----------------------------------------------------
// #project-gallery is filled in by site.js. Without JS it is an empty box, so
// give crawlers and no-JS visitors the same projects as readable markup.
const esc = (t) =>
  String(t ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const noscriptBody = projects
  .map((p) => {
    const photos = photosOf(p).filter((ph) => ph.src);
    const figures = photos
      .map(
        (ph) =>
          `            <figure class="project-photo${ph.variant ? ` ${esc(ph.variant)}` : ""}">` +
          `<img src="${esc(ph.src)}" alt="${esc(ph.alt || `${ph.label} photo for ${p.title}`)}" loading="lazy" decoding="async">` +
          `<figcaption>${esc(ph.label || "Project photo")}</figcaption></figure>`,
      )
      .join("\n");
    const meta = [p.location, p.equipment].filter(Boolean).map(esc).join(" &middot; ");
    return (
      `          <article class="project">\n` +
      `            <p class="eyebrow">${esc(p.category)}</p>\n` +
      `            <h2>${esc(p.title)}</h2>\n` +
      `            <p>${esc(p.description)}</p>\n` +
      (meta ? `            <p class="project-meta">${meta}</p>\n` : "") +
      figures +
      `\n          </article>`
    );
  })
  .join("\n");

const noscript =
  `        <noscript>\n` +
  `          <!-- Generated by scripts/generate-gallery-seo.mjs. Do not edit by hand. -->\n` +
  noscriptBody +
  `\n        </noscript>\n      `;

const galleryOpen =
  /(<section class="section gallery-list" id="project-gallery" aria-live="polite">)[\s\S]*?(<\/section>)/;
if (!galleryOpen.test(html)) {
  console.error("generate-gallery-seo: #project-gallery section not found");
  process.exit(1);
}
html = html.replace(galleryOpen, `$1\n${noscript}$2`);
writeFileSync(galleryPath, html);

console.log(
  `generate-gallery-seo: ${projectNodes.length} projects, ${imageNodes.length} images -> gallery.html`,
);
