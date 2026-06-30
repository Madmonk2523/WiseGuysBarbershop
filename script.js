"use strict";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const pageSections = [...document.querySelectorAll("main section[id]")];
const yearElement = document.querySelector("#current-year");

const setMenuState = (isOpen) => {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.querySelector(".sr-only").textContent = isOpen
    ? "Close navigation menu"
    : "Open navigation menu";
  primaryNav.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenuState(isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

document.addEventListener("click", (event) => {
  if (
    primaryNav.classList.contains("open") &&
    !primaryNav.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    setMenuState(false);
  }
});

window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("scrolled", window.scrollY > 20);

    let currentSection = pageSections[0];
    pageSections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 180) {
        currentSection = section;
      }
    });

    if (currentSection) {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentSection.id}`;
        link.classList.toggle("active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    setMenuState(false);
  }
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const reviewTrack = document.querySelector(".review-track");
const reviewCards = [...document.querySelectorAll(".review-card")];
const previousButton = document.querySelector(".review-prev");
const nextButton = document.querySelector(".review-next");
const currentReviewLabel = document.querySelector(".review-current");
const reviewProgress = document.querySelector(".review-progress span");
let activeReviewIndex = 0;

const showReview = (index) => {
  activeReviewIndex = (index + reviewCards.length) % reviewCards.length;
  reviewTrack.style.transform = `translateX(-${activeReviewIndex * 100}%)`;
  currentReviewLabel.textContent = String(activeReviewIndex + 1).padStart(2, "0");
  reviewProgress.style.width = `${((activeReviewIndex + 1) / reviewCards.length) * 100}%`;
};

previousButton.addEventListener("click", () => showReview(activeReviewIndex - 1));
nextButton.addEventListener("click", () => showReview(activeReviewIndex + 1));

let touchStartX = 0;

reviewTrack.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].clientX;
  },
  { passive: true }
);

reviewTrack.addEventListener(
  "touchend",
  (event) => {
    const distance = touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(distance) > 55) {
      showReview(activeReviewIndex + (distance > 0 ? 1 : -1));
    }
  },
  { passive: true }
);

yearElement.textContent = new Date().getFullYear();
