#!/usr/bin/env sh
#
# Builds the deployable site into dist/.
#
# The page list below is explicit, but the asset list is NOT hardcoded — it is
# derived at build time by scanning the pages, CSS, and JS for anything under
# assets/images/ or assets/fonts/. Add a photo to projects.js and it ships; no
# need to remember to update this file. (A stale hardcoded list is exactly how
# the header logos, the fonts, and two whole project galleries went missing
# from production once already.)

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DIST_DIR="$ROOT_DIR/dist"

cd "$ROOT_DIR"

# Files copied verbatim. Anything they reference comes along automatically.
PAGES="
_headers
robots.txt
sitemap.xml
llms.txt
404.html
about.html
big-yellow-dog-truckin.html
equipment.html
gallery.html
index.html
services.html
assets/css/styles.css
assets/js/projects.js
assets/js/site.js
"

# Derive the gallery's JSON-LD and no-JS fallback from assets/js/projects.js.
# Same reasoning as the asset scan below: anything hand-maintained goes stale.
if command -v node >/dev/null 2>&1; then
  node "$SCRIPT_DIR/generate-gallery-seo.mjs"
else
  printf 'build-dist: node not found; gallery.html SEO markup may be stale\n' >&2
fi

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

copy_file() {
  rel_path=$1
  if [ ! -f "$ROOT_DIR/$rel_path" ]; then
    printf 'build-dist: referenced file is missing: %s\n' "$rel_path" >&2
    exit 1
  fi
  mkdir -p "$DIST_DIR/$(dirname "$rel_path")"
  cp "$ROOT_DIR/$rel_path" "$DIST_DIR/$rel_path"
}

# Copy the pages themselves.
scan_targets=''
for rel_path in $PAGES; do
  copy_file "$rel_path"
  case "$rel_path" in
    *.html|*.css|*.js) scan_targets="$scan_targets $rel_path" ;;
  esac
done

# Derive the asset list from what those files actually reference.
#
# Two forms have to be caught. HTML and JS use root-relative paths
# ("assets/images/x.jpg"); the stylesheet sits in assets/css/ and refers to its
# own siblings ("../images/x.png"). Only scanning the first form is how the
# camo pattern -- referenced solely from styles.css -- silently never shipped.
assets=$(
  {
    # shellcheck disable=SC2086
    grep -hoE 'assets/(images|fonts)/[A-Za-z0-9_@./-]+\.(png|jpe?g|svg|ico|gif|webp|woff2?)' $scan_targets
    # shellcheck disable=SC2086
    grep -hoE '\.\./(images|fonts)/[A-Za-z0-9_@./-]+\.(png|jpe?g|svg|ico|gif|webp|woff2?)' $scan_targets \
      | sed 's|^\.\./|assets/|'
  } | sort -u
)

asset_count=0
for rel_path in $assets; do
  copy_file "$rel_path"
  asset_count=$((asset_count + 1))
done

printf 'Built deployable site in %s (%s assets)\n' "$DIST_DIR" "$asset_count"
