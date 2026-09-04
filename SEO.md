# SEO Reference

What is in place, where it lives, and what still needs a human. Last updated
2026-09-03.

## Files

| File | Purpose |
| --- | --- |
| `robots.txt` | Opens the whole site to search crawlers and names the sitemap. Also allows the major AI assistant crawlers by name (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot, CCBot, and friends) so the business can be cited in AI answers. |
| `sitemap.xml` | All six public pages with `lastmod`, plus image entries for the home and gallery pages. Update `lastmod` when a page's content really changes. |
| `llms.txt` | A plain-text summary of the business written for AI assistants: services, phone numbers, page map, and a note that Diggin (land work) and Truckin (trucking) are different operations. |
| `404.html` | Custom not-found page. Cloudflare Pages serves it automatically. Carries `noindex, follow` so it never gets indexed but still passes link equity. |
| `_headers` | Security headers plus cache lifetimes. Assets cache long, HTML revalidates, crawler files stay fresh. |

## In every page head

- `<title>` and `<meta name="description">`, unique per page.
- `<link rel="canonical">` on the apex hostname, always `https://yellowdog.lol`.
- Open Graph and Twitter card tags, so a shared link renders the sunset rig card.
- `<meta name="robots" content="index, follow, max-image-preview:large, ...">`
  — `max-image-preview:large` is what lets Google show a big image thumbnail.
- `<meta name="theme-color">`.
- A JSON-LD `@graph` block (see below).

## Structured data

Everything hangs off one business entity, `https://yellowdog.lol/#business`,
declared in full on the home page and referenced by `@id` everywhere else. That
is what tells Google the pages describe one business rather than six unrelated
ones.

| Page | Nodes |
| --- | --- |
| `index.html` | `LocalBusiness` + `GeneralContractor` (phones, logo, services as `makesOffer`), `WebSite`, `WebPage`, `BreadcrumbList` |
| `services.html` | `CollectionPage`, `ItemList` of 11 `Service` nodes, `BreadcrumbList` |
| `gallery.html` | `CollectionPage`, `ImageGallery`, one `CreativeWork` per project with its photos as `ImageObject`, `BreadcrumbList` — **generated**, see below |
| `about.html` | `AboutPage`, `BreadcrumbList` |
| `equipment.html` | `WebPage`, `BreadcrumbList` |
| `big-yellow-dog-truckin.html` | `WebPage`, `Organization` for BYD under the shared YellowDog.lol parent, `BreadcrumbList` |

Validate changes at https://search.google.com/test/rich-results.

### The gallery is generated

`gallery.html` builds its project markup client-side from
`assets/js/projects.js`, so a crawler that does not run JavaScript sees an empty
page — and most AI crawlers do not run it. `scripts/generate-gallery-seo.mjs`
reads `projects.js` and writes two things into `gallery.html`:

1. the JSON-LD graph, with every project's title, description, category,
   location, equipment, and photo alt text; and
2. a `<noscript>` fallback containing the same projects as plain markup.

`scripts/build-dist.sh` runs it before every build, so adding a project to
`projects.js` is still the only step required. It is idempotent — run it by hand
any time with `node scripts/generate-gallery-seo.mjs`.

## Performance

Core Web Vitals are a ranking input, and this is a photo-heavy site.

- Every `<img>` carries `width`/`height` (no layout shift), `decoding="async"`,
  and `loading="lazy"` unless it is above the fold. Only the home page hero
  carries `fetchpriority="high"` — it is the LCP element.
- The base `img` CSS rule sets `height: auto`, which is what keeps the new
  `width`/`height` attributes from squashing a scaled-down image.
- Photos are capped at 1600px on the long edge and re-encoded: q72 for hero and
  share images, q58 for gallery shots. That took the shipped payload from about
  75 MB to about 35 MB with no visible quality loss.
- The camo texture is a 124 KB JPEG. It used to be a 2.8 MB PNG.

**If you add photos**, run them through the same treatment before committing:

```sh
sips -Z 1600 -s format jpeg -s formatOptions 58 photo.jpeg --out photo.jpeg
```

Only pass `-Z` when the image is actually larger than 1600px — `sips` will
happily upscale a smaller one and make the file bigger.

## Still needs a human

1. **Create a Google Business Profile.** There is none today. For a local
   service business this outranks everything else on this page: it is what puts
   the business in the map pack and in "excavating near me". Once it exists,
   add its URL to `sameAs` in the home page JSON-LD.
2. **Add the service area.** The site never names a town, county, or state —
   only "local and surrounding rural communities in the region". Someone
   searching "brush clearing <town>" has nothing to match. Add the real towns
   and counties to `about.html`, and add `areaServed` and `address` to the
   `LocalBusiness` node in `index.html` and the service area line in `llms.txt`.
3. **Confirm the www redirect.** `https://www.yellowdog.lol/*` must 301 to
   `https://yellowdog.lol/*` with the query string preserved, via a Cloudflare
   Single Redirect. The canonicals and sitemap use the apex only.
4. Search Console follow-ups are tracked in [`SEARCH-CONSOLE.md`](./SEARCH-CONSOLE.md).
