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

const projectGallery = document.querySelector("#project-gallery");

function createProjectPhoto(project, type) {
  const src = project[type];
  const label = type === "before" ? "Before" : "After";
  const alt = project[`${type}Alt`] || `${label} photo for ${project.title}`;

  if (!src) {
    const placeholder = document.createElement("div");
    placeholder.className = `media-placeholder ${type === "after" ? "after" : ""}`;
    placeholder.innerHTML = `<span>${label} photo</span>`;
    return placeholder;
  }

  const figure = document.createElement("figure");
  figure.className = "project-photo";

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";

  const caption = document.createElement("figcaption");
  caption.textContent = label;

  figure.append(img, caption);
  return figure;
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
      photos.append(createProjectPhoto(project, "before"), createProjectPhoto(project, "after"));

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
