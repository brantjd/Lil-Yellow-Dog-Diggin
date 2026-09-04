# Google Search Console Handoff

Last updated: 2026-09-03

## Current Status

- The `yellowdog.lol` Search Console property is set up.
- `https://yellowdog.lol/sitemap.xml` is live and returns HTTP 200.
- The sitemap has been submitted in Search Console.

Manual indexing requests completed on 2026-08-27:

1. `https://yellowdog.lol/`
2. `https://yellowdog.lol/services.html`
3. `https://yellowdog.lol/about.html`

Google's daily manual indexing-request quota was reached before the fourth URL
could be submitted, so three URLs are still outstanding.

## Do This First: Google Business Profile

There is no Google Business Profile for this business yet. For a local service
business this matters more than anything else in this document — it is what
puts the business in the Google Maps pack and in "excavating near me" style
searches, which is where most of these customers actually look.

1. Create the profile at https://business.google.com.
2. Choose a primary category such as **Excavating Contractor**, and secondary
   categories for land clearing, landscaper, and demolition contractor.
3. Set it up as a **service-area business** (no storefront address shown) and
   list the same seven counties the site does: Clay, Richland, Effingham,
   Jasper, Crawford, Coles, and Fayette. The service area in the profile and
   the service area on the site should match exactly.
4. Use the exact same business name and phone number as the site:
   Lil Yellow Dog Diggin', (618) 731-1082. Inconsistent name/phone details
   across the web are the classic reason local rankings stall.
5. Add photos — the gallery already has good before-and-after material.
6. Complete the postcard or phone verification when Google prompts.
7. Once it is live, add the profile URL to the `sameAs` array on the
   `LocalBusiness` node in `index.html`, so the site and the profile are
   explicitly linked.

## Resume the Indexing Requests

In Search Console, select the `yellowdog.lol` property. Paste each remaining
URL into the URL Inspection field, wait for inspection, and click **Request
indexing**. Submit them in this order:

1. `https://yellowdog.lol/gallery.html`
2. `https://yellowdog.lol/equipment.html`
3. `https://yellowdog.lol/big-yellow-dog-truckin.html`

If Google says the daily quota is still exhausted, stop and try again the next
day. Do not repeatedly resubmit URLs that Search Console already accepted.

## After the Next Deploy

The site now ships structured data, a custom 404, and an `llms.txt`. Once those
are live:

1. Resubmit `https://yellowdog.lol/sitemap.xml` so Google re-reads the new
   `lastmod` dates.
2. Run the home, services, and gallery pages through the
   [Rich Results Test](https://search.google.com/test/rich-results) and confirm
   the `LocalBusiness`, `Service`, and `ImageGallery` items are detected with no
   errors.
3. Check **Indexing → Pages** and confirm `404.html` is not being indexed. It
   carries `noindex`, so it should appear only under "Excluded by noindex tag".
4. Watch **Core Web Vitals** over the following month. The image payload dropped
   from roughly 75 MB to 35 MB, so LCP on the gallery and truckin pages should
   improve noticeably on mobile.

## Follow-up Checks

1. Confirm **Indexing → Sitemaps** reports `sitemap.xml` as **Success**.
2. Inspect the homepage and confirm the Google-selected canonical is
   `https://yellowdog.lol/`.
3. Review **Page indexing**, **HTTPS**, **Manual actions**, and **Security
   issues** for unexpected errors.
4. Confirm Cloudflare permanently redirects `https://www.yellowdog.lol/*` to the
   same path on `https://yellowdog.lol/*` with a 301 response and preserves
   query strings.
5. Check again after approximately one week before treating a submitted page as
   an indexing problem.

## Important Distinction

Submitting a sitemap or requesting indexing asks Google to crawl a URL; it does
not guarantee that Google will index it or rank it in search results.
