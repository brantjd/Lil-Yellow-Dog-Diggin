# Google Search Console Handoff

Last updated: 2026-08-27

## Current Status

- The `yellowdog.lol` Search Console property is set up.
- `https://yellowdog.lol/sitemap.xml` is live and returns HTTP 200.
- The sitemap has been submitted in Search Console.
- Google's daily manual indexing-request quota was reached before the fourth
  URL could be submitted.

Manual indexing requests completed on 2026-08-27:

1. `https://yellowdog.lol/`
2. `https://yellowdog.lol/services.html`
3. `https://yellowdog.lol/about.html`

## Resume Tomorrow

In Search Console, select the `yellowdog.lol` property. Paste each remaining
URL into the URL Inspection field, wait for inspection, and click **Request
indexing**. Submit them in this order:

1. `https://yellowdog.lol/gallery.html`
2. `https://yellowdog.lol/equipment.html`
3. `https://yellowdog.lol/big-yellow-dog-truckin.html`

If Google says the daily quota is still exhausted, stop and try again the next
day. Do not repeatedly resubmit URLs that Search Console already accepted.

## Follow-up Checks

After the remaining requests are accepted:

1. Confirm **Indexing → Sitemaps** reports `sitemap.xml` as **Success**.
2. Inspect the homepage and confirm the Google-selected canonical is
   `https://yellowdog.lol/`.
3. Review **Page indexing**, **HTTPS**, **Manual actions**, and **Security
   issues** for unexpected errors.
4. Confirm Cloudflare permanently redirects
   `https://www.yellowdog.lol/*` to the same path on
   `https://yellowdog.lol/*` with a 301 response and preserves query strings.
5. Check again after approximately one week before treating a submitted page as
   an indexing problem.

## Important Distinction

Submitting a sitemap or requesting indexing asks Google to crawl a URL; it does
not guarantee that Google will index it or rank it in search results.
