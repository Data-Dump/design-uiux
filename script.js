/**
 * Slide Deck Controller
 * Handles keyboard, mouse-wheel, touch, and nav-dot navigation.
 */
(function () {
  'use strict';

  const deck      = document.getElementById('deck');
  const slides    = deck.querySelectorAll('.slide');
  const navDots   = document.getElementById('navDots');
  const navLabel  = document.getElementById('navLabel');
  const total     = slides.length;
  let current     = 0;
  let animating   = false;
  const LOCK_MS   = 700;

  /* ---------- Build nav dots ---------- */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    navDots.appendChild(dot);
  });

  function updateLabel() {
    const c = String(current + 1).padStart(2, '0');
    const t = String(total).padStart(2, '0');
    navLabel.textContent = c + ' / ' + t;
  }
  updateLabel();

  /* ---------- Go to slide ---------- */
  function goTo(index) {
    if (animating || index === current || index < 0 || index >= total) return;
    animating = true;

    /* Remove active from current */
    slides[current].classList.remove('active');
    navDots.children[current].classList.remove('active');

    /* Activate target */
    current = index;
    slides[current].classList.remove('active');  // reset animations
    void slides[current].offsetWidth;            // reflow trick
    slides[current].classList.add('active');
    navDots.children[current].classList.add('active');

    updateLabel();

    setTimeout(() => { animating = false; }, LOCK_MS);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ---------- Keyboard ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prev();
    }
  });

  /* ---------- Mouse wheel ---------- */
  let wheelAccum = 0;
  const WHEEL_THRESHOLD = 60;

  document.addEventListener('wheel', (e) => {
    e.preventDefault();
    wheelAccum += e.deltaY;
    if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
      if (wheelAccum > 0) next();
      else prev();
      wheelAccum = 0;
    }
  }, { passive: false });

  /* ---------- Touch swipe ---------- */
  let touchStartY = 0;
  let touchStartX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 50) {
      dy > 0 ? next() : prev();
    } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx > 0 ? next() : prev();
    }
  }, { passive: true });

})();
