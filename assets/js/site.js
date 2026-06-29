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

function createProjectPhoto(photo, projectTitle) {
  const src = photo.src;
  const label = photo.label || "Project photo";
  const alt = photo.alt || `${label} photo for ${projectTitle}`;

  if (!src) {
    const placeholder = document.createElement("div");
    placeholder.className = `media-placeholder ${label.toLowerCase().includes("after") ? "after" : ""}`;
    placeholder.innerHTML = `<span>${label} photo</span>`;
    return placeholder;
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

if (projectGallery && Array.isArray(window.LYD_PROJECTS)) {
  if (window.LYD_PROJECTS.length === 0) {
    projectGallery.innerHTML = '<p class="empty-gallery">Project photos are coming soon.</p>';
  } else {
    window.LYD_PROJECTS.forEach((project) => {
      const article = document.createElement("article");
      article.className = "project";

      const photos = document.createElement("div");
      photos.className = "before-after";
      photos.append(
        ...getProjectPhotos(project).map((photo) => createProjectPhoto(photo, project.title)),
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
      projectGallery.append(article);
    });
  }
}
