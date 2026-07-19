
// Nav hamburger toggle — expands pill to 400px
const navPill = document.querySelector('.nav-pill');
const hamburger = document.querySelector('.nav-hamburger');
let navOpen = false;

const navItems = document.querySelectorAll('.nav-menu-item');

gsap.set(navPill, { height: 64, borderRadius: 16 });
gsap.set(navItems, { opacity: 0, y: 24 });

hamburger.addEventListener('click', () => {
  navOpen = !navOpen;
  hamburger.classList.toggle('open', navOpen);

  if (navOpen) {
    gsap.to(navPill, { height: 640, borderRadius: 16, duration: 0.6, ease: 'power3.inOut' });
    gsap.to(navItems, {
      opacity: 1, y: 0,
      duration: 0.45,
      ease: 'power2.out',
      stagger: 0.1,
      delay: 0.3
    });
  } else {
    gsap.to(navItems, { opacity: 0, y: 16, duration: 0.2, ease: 'power2.in', stagger: 0.05 });
    gsap.to(navPill, { height: 64, borderRadius: 16, duration: 0.5, ease: 'power3.inOut', delay: 0.15 });
  }
});

// Image reveal: clip-path left→right + slow zoom, triggered on scroll
gsap.registerPlugin(ScrollTrigger);

// Disclaimer fade-up on scroll
const disclaimer = document.querySelector('.disclaimer-block');
gsap.set(disclaimer, { opacity: 0, y: 30 });
gsap.to(disclaimer, {
  opacity: 1, y: 0,
  duration: 0.9,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: disclaimer,
    start: 'top 85%',
    toggleActions: 'play none none none'
  }
});

// Stat ticker: fade in + start scrolling on scroll into view
const statBlock = document.querySelector('.stat-block');
const statTicker = document.querySelector('.stat-ticker');
gsap.set(statBlock, { opacity: 0 });

ScrollTrigger.create({
  trigger: statBlock,
  start: 'top 85%',
  once: true,
  onEnter: () => {
    gsap.to(statBlock, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    statTicker.style.animationPlayState = 'running';
  }
});

document.querySelectorAll('.panel').forEach(panel => {
  if (!panel.querySelector('img, video')) return;

  gsap.set(panel, { clipPath: 'inset(0 100% 0 0)' });

  gsap.to(panel, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.2,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: panel,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });
});

// Build grid cells
function buildGrid() {
  const overlay = document.querySelector('.grid-overlay');
  overlay.innerHTML = '';
  const rowH = window.innerHeight * 0.45;
  // Use body content height before overlay cells are added
  const pageH = document.body.scrollHeight;
  const rows = Math.min(Math.ceil(pageH / rowH), 60);
  const frag = document.createDocumentFragment();
  for (let i = 0; i < rows * 5; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    frag.appendChild(cell);
  }
  overlay.appendChild(frag);
}

window.addEventListener('load', buildGrid);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildGrid, 200);
});

// Lightbox on panel click
document.querySelectorAll('.panel').forEach(panel => {
  panel.addEventListener('click', () => {
    const img = panel.querySelector('img');
    if (!img) return;
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.querySelector('.lb-close').addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightbox').addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});


// Section 3 video — fade in on scroll
const s3video = document.querySelector('.section3-video');
gsap.set(s3video, { opacity: 0 });
gsap.to(s3video, {
  opacity: 1,
  duration: 1.8,
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: s3video,
    start: 'top 90%',
    toggleActions: 'play none none none'
  }
});

// Hero video slow playback
const heroVideo = document.querySelector('.hero-video');
heroVideo.playbackRate = 1;

// Subtle parallax on scroll — preserves per-element base transforms, works on img and video
const panelMedia = document.querySelectorAll('.panel img, .panel video');
panelMedia.forEach(el => {
  el.dataset.baseTransform = el.style.transform || '';
});
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  panelMedia.forEach(el => {
    const offset = (scrollY - el.closest('.panel').offsetTop) * 0.08;
    const base = el.dataset.baseTransform;
    el.style.transform = base ? `${base} translateY(${offset}px)` : `translateY(${offset}px)`;
  });
}, { passive: true });
