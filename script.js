document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.site-nav a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll('.viewer-slide'));
  const thumbs = Array.from(gallery.querySelectorAll('.thumb'));
  const prevButtons = Array.from(document.querySelectorAll('.prev'));
  const nextButtons = Array.from(document.querySelectorAll('.next'));
  const expandButton = gallery.querySelector('.viewer-expand');
  const currentLabel = gallery.querySelector('.viewer-current');
  const totalLabel = gallery.querySelector('.viewer-total');

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = lightbox?.querySelector('.lightbox-image');
  const lightboxCurrent = lightbox?.querySelector('.lightbox-current');
  const lightboxTotal = lightbox?.querySelector('.lightbox-total');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  let currentIndex = 0;
  let autoplay = null;
  let touchStartX = 0;
  let touchEndX = 0;

  if (totalLabel) totalLabel.textContent = String(slides.length);
  if (lightboxTotal) lightboxTotal.textContent = String(slides.length);

  function updateSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentIndex);
    });

    if (currentLabel) currentLabel.textContent = String(currentIndex + 1);

    const activeImage = slides[currentIndex]?.querySelector('img');
    if (lightboxImage && activeImage) {
      lightboxImage.src = activeImage.src;
      lightboxImage.alt = activeImage.alt;
    }
    if (lightboxCurrent) {
      lightboxCurrent.textContent = String(currentIndex + 1);
    }

    const activeThumb = thumbs[currentIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }

  function nextSlide() {
    updateSlide(currentIndex + 1);
  }

  function prevSlide() {
    updateSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplay = window.setInterval(nextSlide, 4000);
  }

  function stopAutoplay() {
    if (autoplay) {
      window.clearInterval(autoplay);
      autoplay = null;
    }
  }

  function openLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', function () {
      updateSlide(index);
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener('click', function () {
      prevSlide();
    });
  });

  nextButtons.forEach((button) => {
    button.addEventListener('click', function () {
      nextSlide();
    });
  });

  if (expandButton) {
    expandButton.addEventListener('click', openLightbox);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  gallery.addEventListener('mouseenter', stopAutoplay);
  gallery.addEventListener('mouseleave', startAutoplay);
  gallery.addEventListener('focusin', stopAutoplay);
  gallery.addEventListener('focusout', startAutoplay);

  gallery.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  gallery.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  if (lightbox) {
    lightbox.addEventListener('touchstart', function (event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (event) {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < 40) return;

    if (swipeDistance < 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  document.addEventListener('keydown', function (event) {
    if (!gallery) return;

    if (event.key === 'ArrowRight') {
      nextSlide();
    }

    if (event.key === 'ArrowLeft') {
      prevSlide();
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key.toLowerCase() === 'f') {
      openLightbox();
    }
  });

  updateSlide(0);
  startAutoplay();
});
