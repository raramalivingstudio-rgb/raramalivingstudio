(function () {
  'use strict';

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Header scroll effect ----------
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  const closeMenu = () => {
    if (!navToggle || !siteNav) return;
    navToggle.classList.remove('open');
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      siteNav.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });
    siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  // ---------- Hero Swiper ----------
  if (window.Swiper && document.querySelector('.hero-swiper')) {
    new window.Swiper('.hero-swiper', {
      loop: true,
      speed: 900,
      autoplay: { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.hero-pagination', clickable: true },
      effect: 'fade',
      fadeEffect: { crossFade: true }
    });
  }

  // ---------- Scroll reveal ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ---------- Reviews: fetch, render (XSS-safe), init Swiper ----------
  const wrapper = document.getElementById('reviewsWrapper');

  const renderStars = (rating) => {
    const max = 5;
    const filled = Math.max(0, Math.min(max, Number(rating) || 0));
    return '★'.repeat(filled) + '☆'.repeat(max - filled);
  };

  const initialOf = (name) => {
    const trimmed = String(name || '').trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : '·';
  };

  const avatarColorFromId = (id) => {
    const colors = ['#C46A3F', '#5C6B4F', '#6B5239', '#3B2A1E'];
    const n = Number(id);
    if (!Number.isFinite(n) || n < 1) return colors[0];
    return colors[(n - 1) % colors.length];
  };

  // Build a review card using DOM APIs. No innerHTML is used for any
  // value that originated from /api/reviews, so any review text is
  // always rendered as text — never parsed as HTML.
  const buildCard = (review) => {
    const color = review.avatarColor || avatarColorFromId(review.id);
    const initial = initialOf(review.name) || '·';

    const slide = document.createElement('div');
    slide.className = 'swiper-slide';

    const card = document.createElement('article');
    card.className = 'review-card';

    const stars = document.createElement('div');
    stars.className = 'review-stars';
    stars.setAttribute('aria-label', `${Number(review.rating) || 0} out of 5 stars`);
    stars.textContent = renderStars(review.rating);

    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = `"${review.text || ''}"`;

    const author = document.createElement('div');
    author.className = 'review-author';

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 80 80');
    svg.setAttribute('aria-hidden', 'true');
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', '40');
    circle.setAttribute('cy', '40');
    circle.setAttribute('r', '40');
    circle.setAttribute('fill', color);
    const initialText = document.createElementNS(svgNS, 'text');
    initialText.setAttribute('x', '40');
    initialText.setAttribute('y', '52');
    initialText.setAttribute('text-anchor', 'middle');
    initialText.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
    initialText.setAttribute('font-size', '32');
    initialText.setAttribute('font-weight', '600');
    initialText.setAttribute('fill', '#F7F1E8');
    initialText.textContent = initial;
    svg.appendChild(circle);
    svg.appendChild(initialText);

    const meta = document.createElement('div');
    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.textContent = review.name || '';
    const roleEl = document.createElement('span');
    roleEl.className = 'role';
    roleEl.textContent = review.role || 'Our Customer';
    meta.appendChild(nameEl);
    meta.appendChild(roleEl);

    author.appendChild(svg);
    author.appendChild(meta);

    card.appendChild(stars);
    card.appendChild(text);
    card.appendChild(author);
    slide.appendChild(card);
    return slide;
  };

  // Hard-coded fallback — no interpolated data, safe to inject as HTML.
  const FALLBACK_HTML = `
    <div class="swiper-slide">
      <article class="review-card">
        <div class="review-stars">☆☆☆☆☆</div>
        <p class="review-text">"Reviews are coming soon. Check back shortly."</p>
        <div class="review-author">
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="40" fill="#C46A3F"/>
            <text x="40" y="52" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="32" font-weight="600" fill="#F7F1E8">.</text>
          </svg>
          <div><span class="name">Rarama Living Studio</span><span class="role">Studio</span></div>
        </div>
      </article>
    </div>`;

  const buildFallback = () => {
    const tpl = document.createElement('template');
    tpl.innerHTML = FALLBACK_HTML.trim();
    return tpl.content.firstElementChild;
  };

  const initReviewsSwiper = () => {
    if (!window.Swiper || !document.querySelector('.reviews-swiper')) return;
    const el = document.querySelector('.reviews-swiper');
    if (el.swiper) return; // already initialized
    new window.Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      speed: 700,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.reviews-pagination', clickable: true },
      breakpoints: {
        640:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  };

  // Initialize every room swiper (Deluxe + Junior Suite carousels)
  const initRoomSwipers = () => {
    if (!window.Swiper) return;
    document.querySelectorAll('.room-swiper').forEach((el) => {
      if (el.swiper) return;
      new window.Swiper(el, {
        loop: true,
        speed: 500,
        autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
        navigation: {
          nextEl: el.querySelector('.swiper-button-next'),
          prevEl: el.querySelector('.swiper-button-prev')
        }
      });
    });
  };

  if (wrapper) {
    fetch('/api/reviews')
      .then(r => r.ok ? r.json() : { reviews: [] })
      .then(data => {
        const reviews = Array.isArray(data.reviews) ? data.reviews : [];
        wrapper.replaceChildren();
        if (reviews.length) {
          const frag = document.createDocumentFragment();
          reviews.forEach(r => frag.appendChild(buildCard(r)));
          wrapper.appendChild(frag);
        } else {
          wrapper.appendChild(buildFallback());
        }
        initReviewsSwiper();
      })
      .catch(() => {
        wrapper.replaceChildren(buildFallback());
        initReviewsSwiper();
      });
  }

  // Initialize room image carousels
  initRoomSwipers();

  // Initialize Our Story gallery slider (14 slides, multi-slide layout)
  const initGallerySwiper = () => {
    const el = document.querySelector('.gallery-slider');
    console.log('[gallery] init called. Swiper:', !!window.Swiper, '| element:', !!el, '| slides:', el ? el.querySelectorAll('.swiper-slide').length : 0);
    if (!window.Swiper || !el) {
      console.warn('[gallery] Aborting init: Swiper=', !!window.Swiper, 'el=', !!el);
      return;
    }
    if (el.swiper) {
      console.log('[gallery] Already initialized');
      return;
    }
    try {
      const swiper = new window.Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        speed: 600,
        autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
        navigation: {
          nextEl: el.querySelector('.swiper-button-next'),
          prevEl: el.querySelector('.swiper-button-prev')
        },
        breakpoints: {
          640:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
      console.log('[gallery] Swiper initialized OK, slides count:', swiper.slides.length);
    } catch (err) {
      console.error('[gallery] Swiper init failed:', err);
    }
  };

  // Try immediately, then with small delay as fallback for late-loading layout
  initGallerySwiper();
  setTimeout(initGallerySwiper, 200);
  setTimeout(initGallerySwiper, 600);
})();
