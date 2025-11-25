// Mobile menu toggle
const mobileBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.querySelector(".nav-links");

mobileBtn.addEventListener("click", () => {
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});

// Scroll-triggered animations
function scrollAnimateSections() {
  const sections = document.querySelectorAll(".animate-on-scroll");
  const windowHeight = window.innerHeight;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < windowHeight * 0.85) {
      section.classList.add("animate");
    }
  });
}

window.addEventListener("scroll", scrollAnimateSections);
window.addEventListener("load", scrollAnimateSections);

// HERO GALLERY: mixed images version with gold overlay text
async function initHeroGalleryMixed() {
  const container = document.getElementById("heroGallery");
  if (!container) return;

  try {
    const res = await fetch("/gallery.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load gallery.json");
    const data = await res.json();

    // Flatten all arrays into one
    let allImages = [];
    Object.values(data).forEach((catArray) => {
      if (Array.isArray(catArray)) {
        allImages = allImages.concat(catArray);
      }
    });

    // Shuffle images
    allImages.sort(() => Math.random() - 0.5);

    const stripNames = ["one", "two", "three", "four"];
    const gallery = document.createElement("div");
    gallery.className = "gallery";

    // Split images evenly across 4 strips
    const strips = [[], [], [], []];
    allImages.forEach((img, idx) => {
      strips[idx % 4].push(img);
    });

    strips.forEach((stripItems, idx) => {
      const wrapper = document.createElement("div");
      wrapper.className = "gallery__strip__wrapper";

      const strip = document.createElement("div");
      strip.className = `gallery__strip ${stripNames[idx]}`;

      stripItems.forEach((item) => {
        const photo = document.createElement("div");
        photo.className = "photo";

        const imgWrap = document.createElement("div");
        imgWrap.className = "photo__image";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name || "";
        img.loading = "lazy";

        imgWrap.appendChild(img);

        const name = document.createElement("div");
        // name.className = "photo__name";
        // name.textContent = item.name || "";

        strip.appendChild(photo);
        photo.appendChild(imgWrap);
        photo.appendChild(name);
      });

      wrapper.appendChild(strip);
      gallery.appendChild(wrapper);
    });

    container.appendChild(gallery);
  } catch (err) {
    console.error("Could not initialize hero gallery:", err);
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initHeroGalleryMixed();
});
