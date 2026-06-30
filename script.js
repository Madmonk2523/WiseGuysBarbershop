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

const galleryTrack = document.querySelector(".gallery-track");
const gallerySlides = [...document.querySelectorAll(".gallery-slide")];
const galleryPreviousButton = document.querySelector(".gallery-prev");
const galleryNextButton = document.querySelector(".gallery-next");
const currentGalleryLabel = document.querySelector(".gallery-current");
const galleryProgress = document.querySelector(".gallery-progress span");
let activeGalleryIndex = 0;
let galleryScrollFrame;

const updateGalleryStatus = (index) => {
  activeGalleryIndex = Math.max(0, Math.min(index, gallerySlides.length - 1));
  currentGalleryLabel.textContent = String(activeGalleryIndex + 1).padStart(2, "0");
  galleryProgress.style.width = `${((activeGalleryIndex + 1) / gallerySlides.length) * 100}%`;
};

const showGalleryPhoto = (index) => {
  const nextIndex = (index + gallerySlides.length) % gallerySlides.length;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  galleryTrack.scrollTo({
    left: gallerySlides[nextIndex].offsetLeft - gallerySlides[0].offsetLeft,
    behavior: reducedMotion ? "auto" : "smooth",
  });
  updateGalleryStatus(nextIndex);
};

galleryPreviousButton.addEventListener("click", () => {
  showGalleryPhoto(activeGalleryIndex - 1);
});

galleryNextButton.addEventListener("click", () => {
  showGalleryPhoto(activeGalleryIndex + 1);
});

galleryTrack.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(galleryScrollFrame);
    galleryScrollFrame = requestAnimationFrame(() => {
      const closestIndex = gallerySlides.reduce((closest, slide, index) => {
        const startOffset = gallerySlides[0].offsetLeft;
        const closestDistance = Math.abs(
          gallerySlides[closest].offsetLeft - startOffset - galleryTrack.scrollLeft
        );
        const currentDistance = Math.abs(slide.offsetLeft - startOffset - galleryTrack.scrollLeft);
        return currentDistance < closestDistance ? index : closest;
      }, 0);
      updateGalleryStatus(closestIndex);
    });
  },
  { passive: true }
);

galleryTrack.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showGalleryPhoto(activeGalleryIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});

const reviewTrack = document.querySelector(".review-track");
const reviewViewport = document.querySelector(".review-viewport");
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
  requestAnimationFrame(() => {
    reviewViewport.style.height = `${reviewCards[activeReviewIndex].offsetHeight}px`;
  });
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

window.addEventListener("resize", () => {
  reviewViewport.style.height = `${reviewCards[activeReviewIndex].offsetHeight}px`;
});

showReview(0);
yearElement.textContent = new Date().getFullYear();
