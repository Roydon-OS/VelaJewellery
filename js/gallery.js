// gallery.js - loads images.json and populates the gallery
(async function () {
  const placeholder =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrDDrc-6BUaso8th2bVUxJI8rpvTVa-Zpbg&s";
  const galleryGrid = document.getElementById("galleryGrid");
  const galleryTitle = document.getElementById("galleryTitle");
  const params = new URLSearchParams(location.search);
  const requested = params.get("cat"); // e.g., rings, necklaces, bracelets, best-selling
  const caption = document.getElementById("lbCaption");

  // Load images.json
  let images = [];
  try {
    const res = await fetch("/images.json", { cache: "no-store" });
    if (!res.ok) throw new Error("no manifest");
    images = await res.json();
  } catch (e) {
    // fallback: create one-per-category placeholder entries
    images = [
      { src: placeholder, category: "rings", alt: "Rings" },
      { src: placeholder, category: "necklaces", alt: "Necklaces" },
      { src: placeholder, category: "bracelets", alt: "Bracelets" },
      { src: placeholder, category: "best-selling", alt: "Best selling" },
    ];
  }

  // Filter by requested category if present
  let toShow = images;
  if (requested) {
    toShow = images.filter((i) => i.category === requested);
    galleryTitle.textContent = requested
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Populate grid
  if (galleryGrid) {
    if (toShow.length === 0) {
      galleryGrid.innerHTML =
        "<p>No images found for this collection. Add images to the images folder and update images.json.</p>";
    } else {
      galleryGrid.innerHTML = "";
      toShow.forEach((imgObj, idx) => {
        const img = document.createElement("img");
        img.dataset.src = imgObj.src || placeholder;
        img.alt = imgObj.alt || "";
        img.loading = "lazy";
        img.addEventListener("click", () => openLightbox(imgObj));
        // set src but ensure it won't break; the path should work on your Live Server
        img.src = imgObj.src || placeholder;
        galleryGrid.appendChild(img);
      });
    }
  }

  // Lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  function openLightbox(imgObj) {
    lbImg.src = imgObj.src || placeholder;
    caption && (caption.textContent = imgObj.alt || "");
    lb.style.display = "flex";
    lb.setAttribute("aria-hidden", "false");
  }
  lbClose &&
    lbClose.addEventListener("click", () => {
      lb.style.display = "none";
      lb.setAttribute("aria-hidden", "true");
    });
  lb &&
    lb.addEventListener("click", (e) => {
      if (e.target === lb) {
        lb.style.display = "none";
        lb.setAttribute("aria-hidden", "true");
      }
    });
})();
