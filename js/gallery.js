// document.addEventListener("DOMContentLoaded", () => {
//   // Mobile nav toggle (same as other pages)
//   const mobileBtn = document.getElementById("mobileMenuBtn");
//   const navLinks = document.querySelector(".nav-links");
//   if (mobileBtn && navLinks) {
//     mobileBtn.addEventListener("click", () => {
//       navLinks.style.display =
//         navLinks.style.display === "flex" ? "none" : "flex";
//     });
//   }

//   const root = document.getElementById("gallery-root");
//   const loadingEl = document.getElementById("gallery-loading");
//   const errorEl = document.getElementById("gallery-error");

//   // JSON file in root folder
//   const JSON_PATH = "/gallery.json";

//   fetch(JSON_PATH, { cache: "no-cache" })
//     .then((resp) => {
//       if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
//       return resp.json();
//     })
//     .then((data) => {
//       loadingEl?.remove();
//       renderGallery(data, root);
//     })
//     .catch((err) => {
//       console.error("Gallery load error:", err);
//       if (loadingEl) loadingEl.remove();
//       errorEl.hidden = false;
//       errorEl.textContent =
//         "Unable to load gallery data. Make sure /gallery.json exists and is valid JSON.";
//     });
// });

// function renderGallery(data, container) {
//   const order = ["necklaces", "rings", "bracelets", "earrings"];
//   order.forEach((sectionKey) => {
//     const items = data[sectionKey] || [];
//     const sectionEl = document.createElement("section");
//     sectionEl.className = "gallery-section";

//     const heading = document.createElement("h2");
//     heading.textContent = capitalize(sectionKey);
//     sectionEl.appendChild(heading);

//     if (items.length === 0) {
//       const emptyMsg = document.createElement("p");
//       emptyMsg.textContent = "No items yet.";
//       emptyMsg.style.color = "var(--muted)";
//       sectionEl.appendChild(emptyMsg);
//     } else {
//       const grid = document.createElement("div");
//       grid.className = "gallery-grid";

//       items.forEach((item) => {
//         const card = document.createElement("div");
//         card.className = "gallery-item";

//         const img = document.createElement("img");
//         img.className = "thumb";
//         img.src = item.image;
//         img.alt = item.name || "Véla piece";
//         img.loading = "lazy";

//         const info = document.createElement("div");
//         info.className = "info";

//         const name = document.createElement("div");
//         name.className = "name";
//         name.textContent = item.name || "Unnamed";

//         const price = document.createElement("div");
//         price.className = "price";
//         price.textContent = item.price !== undefined ? `R ${item.price}` : "";

//         info.appendChild(name);
//         info.appendChild(price);
//         card.appendChild(img);
//         card.appendChild(info);
//         grid.appendChild(card);
//       });

//       sectionEl.appendChild(grid);
//     }

//     container.appendChild(sectionEl);
//   });
// }

// function capitalize(str) {
//   if (!str) return "";
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }
document.addEventListener("DOMContentLoaded", () => {
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

  const JSON_PATH = "/gallery.json";

  fetch(JSON_PATH, { cache: "no-cache" })
    .then((resp) => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      return resp.json();
    })
    .then((data) => {
      loadingEl?.remove();
      renderGallery(data, root);

      // Scroll to hash if present after sections are rendered
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    })
    .catch((err) => {
      console.error("Gallery load error:", err);
      if (loadingEl) loadingEl.remove();
      errorEl.hidden = false;
      errorEl.textContent =
        "Unable to load gallery data. Make sure /gallery.json exists and is valid JSON.";
    });
});

function renderGallery(data, container) {
  const order = ["necklaces", "rings", "bracelets", "earrings"];
  order.forEach((sectionKey) => {
    const items = data[sectionKey] || [];
    const sectionEl = document.createElement("section");
    sectionEl.className = "gallery-section";
    sectionEl.id = sectionKey; // <-- set id so we can scroll to it

    const heading = document.createElement("h2");
    heading.textContent = capitalize(sectionKey);
    sectionEl.appendChild(heading);

    if (items.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No items yet.";
      emptyMsg.style.color = "var(--muted)";
      sectionEl.appendChild(emptyMsg);
    } else {
      const grid = document.createElement("div");
      grid.className = "gallery-grid";

      items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "gallery-item";

        const img = document.createElement("img");
        img.className = "thumb";
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
