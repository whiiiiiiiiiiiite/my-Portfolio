// ============================================================
// 專案收藏室 Portfolio — Interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initActiveNav();
  initTypingRoles();
  initScrollReveal();
  initCounters();
  initFilterTabs();
  initLightbox();
  initBackToTop();
});

/* ---------------- Mobile nav toggle ---------------- */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* ---------------- Highlight current nav link ---------------- */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-links a[data-nav]');
  const current = document.body.getAttribute('data-page');
  links.forEach(a => {
    if (a.getAttribute('data-nav') === current) a.classList.add('active');
  });
}

/* ---------------- Rotating role typing effect ---------------- */
function initTypingRoles() {
  const el = document.querySelector('.type-target');
  if (!el) return;
  const roles = JSON.parse(el.getAttribute('data-roles') || '[]');
  if (!roles.length) return;
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const word = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 55 : 95);
  }
  tick();
}

/* ---------------- Scroll reveal ---------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

/* ---------------- Animated counters ---------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1200;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(target * eased);
        el.textContent = val + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => io.observe(el));
}

/* ---------------- Project filter tabs ---------------- */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cats = (card.getAttribute('data-cat') || '').split(',');
        const show = filter === 'all' || cats.includes(filter);
        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.97)';
          setTimeout(() => { card.style.display = 'none'; }, 220);
        }
      });
    });
  });

  cards.forEach(card => {
    card.style.transition = 'opacity .25s ease, transform .25s ease';
  });
}

/* ---------------- Lightbox gallery ---------------- */
function initLightbox() {
  const figures = document.querySelectorAll('.gallery figure img');
  if (!figures.length) return;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="關閉">✕</button>
    <button class="lightbox-prev" aria-label="上一張">‹</button>
    <img src="" alt="">
    <button class="lightbox-next" aria-label="下一張">›</button>
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(lb);

  const imgEl = lb.querySelector('img');
  const captionEl = lb.querySelector('.lightbox-caption');
  const items = Array.from(figures);
  let idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    const src = items[idx].getAttribute('src');
    const caption = items[idx].getAttribute('alt') || '';
    imgEl.setAttribute('src', src);
    imgEl.setAttribute('alt', caption);
    captionEl.textContent = caption;
  }

  items.forEach((img, i) => {
    img.addEventListener('click', () => {
      show(i);
      lb.classList.add('open');
    });
  });

  lb.querySelector('.lightbox-close').addEventListener('click', () => lb.classList.remove('open'));
  lb.querySelector('.lightbox-prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lightbox-next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('open'); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}

/* ---------------- Back to top button ---------------- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '回到頂部');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) btn.classList.add('show');
    else btn.classList.remove('show');
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
