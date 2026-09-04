# Lil Yellow Dog Diggin Website

Static website shell for Cloudflare Pages.

## Pages

- `index.html`
- `services.html`
- `gallery.html`
- `equipment.html`
- `about.html`
- `big-yellow-dog-truckin.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `llms.txt`

## Cloudflare Pages

Use these settings:

- Framework preset: None
- Build command: `./scripts/build-dist.sh`
- Build output directory: `dist`

If deploying from a repository subdirectory, set the project root to this folder.

The repository includes some source-only photo upload folders that are not part of the live site. The build script creates a clean deployable `dist/` folder so Cloudflare Pages only uploads the files that are actually referenced by the site.

The canonical public hostname is `yellowdog.lol`. Configure a Cloudflare Single
Redirect so `https://www.yellowdog.lol/*` permanently redirects to
`https://yellowdog.lol/${1}` with the query string preserved. The HTML canonical
links and sitemap use only the apex hostname.

Current Google Search Console submission status and the next operator steps are
tracked in [`SEARCH-CONSOLE.md`](./SEARCH-CONSOLE.md). How the site's SEO is put
together — structured data, crawler files, and the image budget — is documented
in [`SEO.md`](./SEO.md).

## Adding Photos

Resize and compress before committing. The site never displays an image wider
than about 1000 CSS pixels, so anything over 1600px on the long edge is wasted
bytes and hurts mobile page speed:

```sh
sips -Z 1600 -s format jpeg -s formatOptions 58 photo.jpeg --out photo.jpeg
```

Pass `-Z` only when the photo is actually larger than 1600px; `sips` upscales
smaller images and makes them heavier.

## Adding Before and After Photos

1. Add the customer photos to `assets/images/projects/`.
2. Open `assets/js/projects.js`.
3. Copy one existing project object and update the text fields.
4. Set `before` and `after` to the image paths.

Example:

```js
{
  category: "Brush clearing",
  title: "Trail opened through heavy growth",
  description: "Cleared brush and saplings so the property owner could access the back acreage again.",
  before: "assets/images/projects/trail-clearing-before.jpg",
  after: "assets/images/projects/trail-clearing-after.jpg",
  beforeAlt: "Overgrown trail before brush clearing",
  afterAlt: "Cleared trail after brush removal",
  location: "Back acreage",
  equipment: "Mini excavator and mowing equipment",
}
```

Leave `before` or `after` blank to show a camo placeholder until that photo is ready.
