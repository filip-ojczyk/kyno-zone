// AOS Init
AOS.init();




document.addEventListener("DOMContentLoaded", function () {
  // Hamburger menu
  const hamburger = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector(".nav-menu-wrapper");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const closeBtn = document.querySelector(".close-mobile-menu");

  function toggleMenu() {
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    hamburger.classList.toggle("w--open");
  }

  if (hamburger) hamburger.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", toggleMenu);
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }
});



//zmiana zdjęć w galerii + progress bary (auto-play jak w Instagram Stories)
//obsługuje dowolną liczbę galerii (.slider-wrapper) na jednej stronie
document.addEventListener("DOMContentLoaded", () => {
  const SLIDE_DURATION = 7000;

  document.querySelectorAll(".slider-wrapper").forEach((wrapper) => {
    const slider = wrapper.querySelector(".slider");
    const slides = wrapper.querySelectorAll(".slide");
    if (!slider || !slides.length) return;

    const prevBtn = wrapper.querySelector(".slider-arrow.left");
    const nextBtn = wrapper.querySelector(".slider-arrow.right");
    const progressBtns = wrapper.querySelectorAll(".slider-progress");

    // szerokość slidera i slajdów liczona dynamicznie, żeby każda galeria mogła mieć inną liczbę zdjęć
    slider.style.width = `${slides.length * 100}%`;
    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${100 / slides.length}%`;
    });

    let currentIndex = 0;
    let autoplayTimer = null;

    function setFill(i) {
      const fill = progressBtns[i].querySelector(".slider-progress-fill");
      fill.style.transition = "none";
      if (i < currentIndex) {
        fill.style.width = "100%";
      } else if (i > currentIndex) {
        fill.style.width = "0%";
      } else {
        fill.style.width = "0%";
        void fill.offsetWidth; // wymuś reflow przed startem animacji
        fill.style.transition = `width ${SLIDE_DURATION}ms linear`;
        fill.style.width = "100%";
      }
    }

    function showSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      slides.forEach((slide, i) => {
        slide.setAttribute("aria-hidden", i !== index);
      });

      slider.style.transform = `translateX(-${(index * 100) / slides.length}%)`;

      progressBtns.forEach((btn, i) => {
        btn.setAttribute("aria-selected", i === index);
        setFill(i);
      });

      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(() => showSlide(currentIndex + 1), SLIDE_DURATION);
    }

    if (prevBtn) prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));

    progressBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => showSlide(i));
    });

    showSlide(0);
  });
});



//FAQ rozwijanie/zwijanie
const accordionItems = document.querySelectorAll(".accordion-item-wrapper");

accordionItems.forEach((item) => {
  const heading = item.querySelector(".accordion-heading");
  const body = item.querySelector(".accordion-body");
  const icon = item.querySelector(".card-arrow .icon-font-rounded");

  heading.addEventListener("click", () => {
    const isOpen = body.style.height && body.style.height !== "0px";

    // Zamknij wszystkie elementy
    accordionItems.forEach((el) => {
      const elBody = el.querySelector(".accordion-body");
      const elIcon = el.querySelector(".card-arrow .icon-font-rounded");

      if (elBody !== body) {
        elBody.style.height = "0";
        elIcon.style.transform = "rotate(0deg)";
      }
    });

    if (!isOpen) {
      // Otwieranie - ustaw wysokość na scrollHeight (pełna wysokość)
      body.style.display = "block"; // żeby można było mierzyć scrollHeight
      const fullHeight = body.scrollHeight + "px";
      body.style.height = "0"; // reset na 0, żeby animacja działała

      // animacja wysokości (trigger)
      setTimeout(() => {
        body.style.height = fullHeight;
      }, 10);

      icon.style.transform = "rotate(-180deg)";

      // Po animacji ustawiamy height na auto, by treść mogła się dostosowywać do zmiany zawartości
      body.addEventListener("transitionend", function handler() {
        body.style.height = "auto";
        body.removeEventListener("transitionend", handler);
      });
    } else {
      // Zamknięcie - ustaw wysokość na aktualną, potem na 0
      body.style.height = body.scrollHeight + "px"; // aktualna wysokość
      setTimeout(() => {
        body.style.height = "0";
      }, 10);

      icon.style.transform = "rotate(0deg)";

      // Po animacji schowaj element
      body.addEventListener("transitionend", function handler() {
        body.style.display = "none";
        body.removeEventListener("transitionend", handler);
      });
    }
  });
});



//strzałka "scrolluj niżej" pod biegnącą Astrą (about.html) - znika, gdy kolejna sekcja jest widoczna
document.addEventListener("DOMContentLoaded", () => {
  const scrollHint = document.getElementById("scroll-hint");
  const nextSection = document.getElementById("about-photos-section");
  if (!scrollHint || !nextSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        scrollHint.classList.toggle("is-hidden", entry.isIntersecting);
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(nextSection);
});



