/* TEMP DIAGNOSTIC — per-frame load probe on every page. Remove after diagnosing the twitch. */
(function () {
  var t0 = performance.now();
  var page = location.pathname.split("/").pop() || "index.html";
  var navEntry = performance.getEntriesByType("navigation")[0];
  var log = ["DIAG " + page, "nav: " + (navEntry ? navEntry.type : "?")];
  var box = document.createElement("div");
  box.style.cssText =
    "position:fixed;top:8px;right:8px;z-index:99999;background:rgba(0,0,0,.88);color:#5f5;font:11px/1.35 ui-monospace,monospace;padding:8px 10px;max-width:52ch;max-height:90vh;overflow:auto;border:1px solid #5f5;white-space:pre-wrap;border-radius:6px;pointer-events:none;";
  function dt() { return String(Math.round(performance.now() - t0)).padStart(4, " ") + "ms"; }
  function render() { box.textContent = log.join("\n"); }
  function add(m) { log.push(m); render(); }
  function start() { document.body.appendChild(box); render(); }
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);

  // Per-frame sampler: log ONLY when a dimension changes frame-to-frame.
  var last = null;
  function frameSample(tag) {
    var de = document.documentElement;
    var vv = window.visualViewport;
    var cur = {
      winW: window.innerWidth,
      clientW: de.clientWidth,
      scrollH: de.scrollHeight,
      vvW: vv ? Math.round(vv.width) : 0,
      scale: vv ? Number(vv.scale.toFixed(3)) : 1,
      dpr: window.devicePixelRatio
    };
    var changed = !last || Object.keys(cur).some(function (k) { return cur[k] !== last[k]; });
    if (changed) {
      add(dt() + " " + (tag || "frame") +
        " w" + cur.winW + " cw" + cur.clientW + " h" + cur.scrollH +
        " vv" + cur.vvW + " x" + cur.scale + " dpr" + cur.dpr);
      last = cur;
    }
  }
  var stopAt = t0 + 1600;
  function loop() {
    frameSample();
    if (performance.now() < stopAt) requestAnimationFrame(loop);
    else add("— done —");
  }
  frameSample("init");
  requestAnimationFrame(loop);

  var cls = 0;
  try {
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        if (!e.hadRecentInput) { cls += e.value; add(dt() + " ▶SHIFT +" + e.value.toFixed(4) + " (" + cls.toFixed(4) + ")"); }
      });
    }).observe({ type: "layout-shift", buffered: true });
  } catch (err) { add("(no shift API)"); }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { add(dt() + " ✔FONTS"); });
  }
  document.addEventListener("visibilitychange", function () { add(dt() + " vis:" + document.visibilityState); });
  window.addEventListener("pageshow", function (e) { add(dt() + " pageshow persisted=" + e.persisted); });
})();

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });
}

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const archieTriggers = document.querySelectorAll("[data-archie-quote]");
const defaultArchieImage = "assets/images/archie-trademark.jpeg";

function ensureArchieModal() {
  let modal = document.querySelector("#archie-modal");
  if (modal) {
    return modal;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="archie-modal" id="archie-modal" hidden>
        <div class="archie-modal-backdrop" data-archie-close></div>
        <div
          class="archie-modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archie-modal-title"
        >
          <button class="archie-modal-close" type="button" aria-label="Close Archie quote" data-archie-close>
            Close
          </button>
          <figure class="archie-modal-card">
            <img id="archie-modal-image" src="${defaultArchieImage}" alt="Archie the yellow lab with a muddy nose">
            <figcaption>
              <p class="eyebrow">Trademark Archie</p>
              <h2 id="archie-modal-title">Archie says</h2>
              <p id="archie-modal-quote"></p>
            </figcaption>
          </figure>
        </div>
      </div>
    `,
  );

  return document.querySelector("#archie-modal");
}

function openArchieModal(trigger) {
  const modal = ensureArchieModal();
  const quote = trigger.getAttribute("data-archie-quote") || "Keep the dirt work honest and the snack schedule on time.";
  const image = trigger.getAttribute("data-archie-image") || defaultArchieImage;
  const title = trigger.getAttribute("data-archie-title") || "Archie says";
  const imageAlt = trigger.getAttribute("data-archie-alt") || "Archie the yellow lab with a muddy nose";

  const modalImage = modal.querySelector("#archie-modal-image");
  const modalTitle = modal.querySelector("#archie-modal-title");
  const modalQuote = modal.querySelector("#archie-modal-quote");
  const closeButton = modal.querySelector(".archie-modal-close");

  modalImage.src = image;
  modalImage.alt = imageAlt;
  modalTitle.textContent = title;
  modalQuote.textContent = `"${quote}"`;

  modal.hidden = false;
  document.body.classList.add("modal-open");
  closeButton.focus();
}

function closeArchieModal() {
  const modal = document.querySelector("#archie-modal");
  if (!modal) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

if (archieTriggers.length > 0) {
  archieTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openArchieModal(trigger));
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("data-archie-close")) {
      closeArchieModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeArchieModal();
    }
  });
}

const projectGallery = document.querySelector("#project-gallery");
const projectArchive = document.querySelector("#project-archive");
const archiveGroups = document.querySelector("#archive-groups");

// Show the newest few projects up top; everything older drops into the archive,
// grouped by month/year, so the page doesn't turn into an endless scroll.
const ACTIVE_PROJECT_COUNT = 4;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatProjectMonth(date) {
  if (typeof date !== "string") {
    return "Older projects";
  }

  const [year, month] = date.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) {
    return "Older projects";
  }

  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function createProjectPhoto(photo, projectTitle) {
  const src = photo.src;
  const label = photo.label || "Project photo";
  const alt = photo.alt || `${label} photo for ${projectTitle}`;

  if (!src) {
    return null;
  }

  const figure = document.createElement("figure");
  figure.className = `project-photo${photo.variant ? ` ${photo.variant}` : ""}`;

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";

  const caption = document.createElement("figcaption");
  caption.textContent = label;

  figure.append(img, caption);
  return figure;
}

function getProjectPhotos(project) {
  if (Array.isArray(project.photos) && project.photos.length > 0) {
    return project.photos;
  }

  return [
    {
      label: "Before",
      src: project.before,
      alt: project.beforeAlt,
      variant: project.beforeVariant,
    },
    {
      label: "After",
      src: project.after,
      alt: project.afterAlt,
      variant: project.afterVariant,
    },
  ];
}

function renderProject(project) {
  const article = document.createElement("article");
  article.className = "project";

  const photos = document.createElement("div");
  photos.className = "before-after";
  photos.append(
    ...getProjectPhotos(project)
      .map((photo) => createProjectPhoto(photo, project.title))
      .filter(Boolean),
  );

  const content = document.createElement("div");
  content.innerHTML = `
    <p class="eyebrow">${project.category}</p>
    <h2>${project.title}</h2>
    <p>${project.description}</p>
  `;

  if (project.location || project.equipment) {
    const meta = document.createElement("dl");
    meta.className = "project-meta";

    if (project.location) {
      meta.innerHTML += `<div><dt>Area</dt><dd>${project.location}</dd></div>`;
    }

    if (project.equipment) {
      meta.innerHTML += `<div><dt>Equipment</dt><dd>${project.equipment}</dd></div>`;
    }

    content.append(meta);
  }

  article.append(photos, content);
  return article;
}

if (projectGallery && Array.isArray(window.LYD_PROJECTS)) {
  const sorted = window.LYD_PROJECTS
    .slice()
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  const active = sorted.slice(0, ACTIVE_PROJECT_COUNT);
  const archived = sorted.slice(ACTIVE_PROJECT_COUNT);

  projectGallery.innerHTML = "";
  active.forEach((project) => projectGallery.append(renderProject(project)));

  if (archived.length > 0 && projectArchive && archiveGroups) {
    const groups = [];
    let currentGroup = null;

    archived.forEach((project) => {
      const label = formatProjectMonth(project.date);
      if (!currentGroup || currentGroup.label !== label) {
        currentGroup = { label, projects: [] };
        groups.push(currentGroup);
      }
      currentGroup.projects.push(project);
    });

    archiveGroups.innerHTML = "";
    groups.forEach((group) => {
      const details = document.createElement("details");
      details.className = "archive-group";

      const summary = document.createElement("summary");
      const count = group.projects.length;
      summary.textContent = `${group.label} · ${count} project${count === 1 ? "" : "s"}`;

      const list = document.createElement("div");
      list.className = "gallery-list";
      group.projects.forEach((project) => list.append(renderProject(project)));

      details.append(summary, list);
      archiveGroups.append(details);
    });

    projectArchive.hidden = false;
  }
}
