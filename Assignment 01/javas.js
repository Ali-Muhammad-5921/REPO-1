let currentSlide = 0;
const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide').length;
const slidesToShow = 4; // Number of images to show at once

function moveSlide(direction) {
  const slideWidth = document.querySelector('.slide').offsetWidth;
  const maxSlideIndex = totalSlides - slidesToShow; // Prevents moving past the last set of slides

  currentSlide += direction * slidesToShow; // Move 4 slides at once

  // Ensure currentSlide doesn't go below 0 or above the maxSlideIndex
  if (currentSlide < 0) {
    currentSlide = 0; // Stop at the beginning
  } else if (currentSlide > maxSlideIndex) {
    currentSlide = maxSlideIndex; // Stop at the last set of slides
  }

  slides.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  console.log("Current slide index:", currentSlide);
}

