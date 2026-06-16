# Lil Yellow Dog Diggin Website

Static website shell for Cloudflare Pages.

## Pages

- `index.html`
- `services.html`
- `gallery.html`
- `equipment.html`
- `about.html`

## Cloudflare Pages

Use these settings:

- Framework preset: None
- Build command: leave blank
- Build output directory: `/`

If deploying from a repository subdirectory, set the project root to this folder.

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
