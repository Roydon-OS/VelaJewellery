document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      const expanded = mobileBtn.getAttribute("aria-expanded") === "true";
      mobileBtn.setAttribute("aria-expanded", String(!expanded));
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
    });
  }

  const root = document.getElementById("gallery-root");
  const loadingEl = document.getElementById("gallery-loading");
  const errorEl = document.getElementById("gallery-error");
  const JSON_PATH = "/gallery.json";

  fetch(JSON_PATH, { cache: "no-cache" })
    .then((resp) => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      return resp.json();
    })
    .then((data) => {
      loadingEl?.remove();
      renderGallery(data, root);
      initScrollReveal();
      initLightbox();
      // scroll to hash if present
      if (window.location.hash) {
        const t = document.querySelector(window.location.hash);
        if (t) t.scrollIntoView({ behavior: "smooth" });
      }
    })
    .catch((err) => {
      console.error("Gallery load error:", err);
      loadingEl?.remove();
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent =
          "Unable to load gallery data. Make sure /gallery.json exists and is valid JSON.";
      }
    });
});

/* Render gallery using the same DOM structure as featured .card */
function renderGallery(data, container) {
  container.innerHTML = "";
  const order = ["necklaces", "rings", "bracelets", "earrings"];

  order.forEach((sectionKey) => {
    const items = Array.isArray(data[sectionKey]) ? data[sectionKey] : [];

    const sectionEl = document.createElement("section");
    sectionEl.className = "gallery-section animate-on-scroll";
    sectionEl.id = sectionKey;

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
        // anchor card (mirrors featured <a class="card">)
        const a = document.createElement("a");
        a.className = "gallery-card";
        a.href = "#";
        a.addEventListener("click", (ev) => {
          ev.preventDefault();
          openLightboxFromItem(item);
        });

        // image
        const imgWrap = document.createElement("div");
        imgWrap.className = "card-img";
        const img = document.createElement("img");
        img.src = item.image || "";
        img.alt = item.name || "Véla piece";
        img.loading = "lazy";
        imgWrap.appendChild(img);

        // info
        const info = document.createElement("div");
        info.className = "card-info";
        const title = document.createElement("h3");
        title.textContent = item.name || "Unnamed";
        const price = document.createElement("p");
        price.className = "price";
        price.textContent = item.price !== undefined ? `R${item.price}` : "";

        info.appendChild(title);
        info.appendChild(price);

        a.appendChild(imgWrap);
        a.appendChild(info);
        grid.appendChild(a);
      });
    }

    sectionEl.appendChild(grid);
    container.appendChild(sectionEl);
  });
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

/* IntersectionObserver reveal */
function initScrollReveal() {
  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(".animate-on-scroll")
    .forEach((el) => obs.observe(el));
}

/* Lightbox */
function initLightbox() {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImage");
  const lbName = document.getElementById("lightboxName");
  const lbPrice = document.getElementById("lightboxPrice");
  const lbClose = document.getElementById("lightboxClose");

  if (!lb) return;

  window.openLightboxFromItem = function (item) {
    lbImg.src = item.image || "";
    lbImg.alt = item.name || "Véla piece";
    lbName.textContent = item.name || "";
    lbPrice.textContent = item.price !== undefined ? `R${item.price}` : "";
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  };

  function close() {
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.src = "";
    lbName.textContent = "";
    lbPrice.textContent = "";
  }

  lbClose.addEventListener("click", close);
  lb.addEventListener("click", (ev) => {
    if (ev.target === lb) close();
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && lb.getAttribute("aria-hidden") === "false")
      close();
  });
}
