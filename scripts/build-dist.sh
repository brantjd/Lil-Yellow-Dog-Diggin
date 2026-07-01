#!/usr/bin/env sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DIST_DIR="$ROOT_DIR/dist"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

copy_file() {
  rel_path=$1
  mkdir -p "$DIST_DIR/$(dirname "$rel_path")"
  cp "$ROOT_DIR/$rel_path" "$DIST_DIR/$rel_path"
}

while IFS= read -r rel_path; do
  [ -n "$rel_path" ] || continue
  copy_file "$rel_path"
done <<'FILES'
_headers
about.html
big-yellow-dog-truckin.html
equipment.html
gallery.html
index.html
services.html
assets/css/styles.css
assets/js/projects.js
assets/js/site.js
assets/images/apple-touch-icon.png
assets/images/archie-trademark.jpeg
assets/images/favicon.ico
assets/images/favicon_512.png
assets/images/gallery_03_dog-on-track.jpg
assets/images/gallery_05_dog-front-blade.jpg
assets/images/hero_01_field-machine.jpg
assets/images/hero_02_loading-hay.jpg
assets/images/logo_lil-yellow-dog-diggin_no-contact.png
assets/images/military-camo.png
assets/images/social_02_dog-front.jpg
assets/images/projects/bridge-after-finished.jpeg
assets/images/projects/bridge-after-leveled.jpeg
assets/images/projects/bridge-before-old-culvert.jpeg
assets/images/projects/bridge-during-moving.jpeg
assets/images/projects/bridge-during-placed.jpeg
assets/images/projects/bridge-during-setting.jpeg
assets/images/projects/bridge-prebuilt-span.jpeg
assets/images/projects/field-road-after-crowned.jpeg
assets/images/projects/field-road-after-finished.jpeg
assets/images/projects/field-road-after-grading.jpeg
assets/images/projects/field-road-before-overgrown.jpeg
assets/images/projects/field-road-before-spring.jpeg
assets/images/projects/field-road-before-washout.jpeg
assets/images/projects/field-road-during-drainpipe.jpeg
assets/images/projects/pond-edge-after-bank.jpeg
assets/images/projects/pond-edge-after-overview.jpeg
assets/images/projects/pond-edge-after-path.jpeg
assets/images/projects/pond-edge-before.jpeg
assets/images/truckin/byd-cab-window.jpeg
assets/images/truckin/byd-flag-front.jpeg
assets/images/truckin/byd-logo-detail.jpeg
assets/images/truckin/byd-mountain-pass.jpeg
assets/images/truckin/byd-rig-side.jpeg
assets/images/truckin/byd-semi-overview.jpeg
FILES

printf 'Built deployable site in %s\n' "$DIST_DIR"
