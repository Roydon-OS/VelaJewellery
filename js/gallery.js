// gallery.js
// - Fetches /data/gallery.json
// - Builds sections for necklaces, rings, bracelets, earrings
// - Matches site navbar mobile menu behavior

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle (same behavior as other pages)
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.querySelector(".nav-links");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
    });
  }

  const root = document.getElementById("gallery-root");
  const loadingEl = document.getElementById("gallery-loading");
  const errorEl = document.getElementById("gallery-error");

  // path to JSON file (place this file at /data/gallery.json)
  const JSON_PATH = "/data/gallery.json";

  fetch(JSON_PATH, { cache: "no-cache" })
    .then((resp) => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      return resp.json();
    })
    .then((data) => {
      loadingEl?.remove();
      renderGallery(data, root);
    })
    .catch((err) => {
      console.error("Gallery load error:", err);
      if (loadingEl) loadingEl.remove();
      errorEl.hidden = false;
      errorEl.textContent =
        "Unable to load gallery data. Make sure /data/gallery.json exists and is valid JSON.";
    });
});

/**
 * Render gallery sections from the JSON structure.
 * Expected JSON shape:
 * {
 *   "necklaces": [{ "name":"", "price":123, "image":"/images/gallery/necklaces/x.jpg" }, ...],
 *   "rings": [...],
 *   "bracelets": [...],
 *   "earrings": [...]
 * }
 */
function renderGallery(data, container) {
  const order = ["necklaces", "rings", "bracelets", "earrings"];
  order.forEach((sectionKey) => {
    const items = data[sectionKey] || [];
    const sectionEl = document.createElement("section");
    sectionEl.className = "gallery-section";

    const heading = document.createElement("h2");
    heading.textContent = capitalize(sectionKey);
    sectionEl.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "gallery-grid";

    if (items.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No items yet.";
      emptyMsg.style.color = "var(--muted)";
      sectionEl.appendChild(emptyMsg);
    } else {
      items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "gallery-item";

        // image (use lazy loading)
        const img = document.createElement("img");
        img.className = "thumb";
        // if image path is relative, make it safe - user JSON should use absolute-from-root paths (e.g. /images/...)
        img.src = item.image;
        img.alt = item.name || "Véla piece";
        img.loading = "lazy";

        const info = document.createElement("div");
        info.className = "info";

        const name = document.createElement("div");
        name.className = "name";
        name.textContent = item.name || "Unnamed";

        const price = document.createElement("div");
        price.className = "price";
        // show currency properly
        price.textContent = item.price !== undefined ? `R ${item.price}` : "";

        info.appendChild(name);
        info.appendChild(price);

        card.appendChild(img);
        card.appendChild(info);
        grid.appendChild(card);
      });

      sectionEl.appendChild(grid);
    }

    container.appendChild(sectionEl);
  });
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
