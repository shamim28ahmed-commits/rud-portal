const popup = document.querySelector("#rudAdmissionPopup");
const closePopup = document.querySelector("#rudPopupClose");

function hideAdmissionPopup() {
  if (popup) popup.classList.add("is-hidden");
}

if (closePopup) {
  closePopup.addEventListener("click", hideAdmissionPopup);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideAdmissionPopup();
});

const campusSlides = Array.from(document.querySelectorAll(".rud-campus-slide"));
const campusPrevious = document.querySelector(".rud-campus-prev");
const campusNext = document.querySelector(".rud-campus-next");

if (campusSlides.length) {
  let campusActive = 0;
  let campusTimer;

  function showCampusSlide(index) {
    campusActive = (index + campusSlides.length) % campusSlides.length;
    campusSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === campusActive);
    });
  }

  function startCampusSlider() {
    clearInterval(campusTimer);
    campusTimer = setInterval(() => showCampusSlide(campusActive + 1), 3500);
  }

  campusPrevious?.addEventListener("click", () => {
    showCampusSlide(campusActive - 1);
    startCampusSlider();
  });

  campusNext?.addEventListener("click", () => {
    showCampusSlide(campusActive + 1);
    startCampusSlider();
  });

  showCampusSlide(0);
  startCampusSlider();
}

const programTrack = document.querySelector(".rud-program-track");
const programSlider = document.querySelector(".rud-program-slider");
const programCards = Array.from(document.querySelectorAll(".rud-program-card"));
const programPrevious = document.querySelector(".rud-program-prev");
const programNext = document.querySelector(".rud-program-next");
const programDots = Array.from(document.querySelectorAll(".rud-program-controls span"));

if (programTrack && programCards.length) {
  let programPage = 0;

  function programCardsPerPage() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function maxProgramPage() {
    return Math.max(0, Math.ceil(programCards.length / programCardsPerPage()) - 1);
  }

  function showProgramPage(page) {
    const maximumPage = maxProgramPage();
    programPage = (page + maximumPage + 1) % (maximumPage + 1);
    const pageWidth = (programSlider?.clientWidth || 0) + 12;
    programTrack.style.transform = `translateX(-${programPage * pageWidth}px)`;
    programDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === programPage);
      dot.hidden = index > maximumPage;
    });
  }

  programPrevious?.addEventListener("click", () => showProgramPage(programPage - 1));
  programNext?.addEventListener("click", () => showProgramPage(programPage + 1));
  programDots.forEach((dot, index) => {
    dot.addEventListener("click", () => showProgramPage(index));
  });

  showProgramPage(0);
  window.addEventListener("resize", () => showProgramPage(programPage));
}
