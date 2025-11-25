// Mobile menu toggle
const mobileBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.querySelector(".nav-links");
mobileBtn.addEventListener("click", () => {
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});

// Scroll animation for sections
const animateElements = document.querySelectorAll(".animate-on-scroll");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  },
  { threshold: 0.2 }
);
animateElements.forEach((el) => observer.observe(el));
