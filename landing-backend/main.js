const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function initLucide() {
  if (!window.lucide) return;
  window.lucide.createIcons();
}

function initRevealOnScroll() {
  const els = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
  );

  els.forEach((el) => io.observe(el));
}

function initYear() {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function initHeaderInteractions() {
  const header = $('[data-header]');
  if (!header) return;

  const update = () => {
    const scrolled = window.scrollY > 8;
    header.dataset.scrolled = scrolled ? 'true' : 'false';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMobileNav() {
  const toggle = $('[data-nav-toggle]');
  if (!toggle) return;

  // drawer placeholder (optional). If not present in DOM, keep simple.
  // We'll create it on the fly for robustness.
  let drawer = document.querySelector('.navDrawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'navDrawer';
    drawer.innerHTML = `
      <div class="navDrawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="navDrawer__top">
          <strong style="letter-spacing:.2px">Backend</strong>
          <button class="btn" style="padding:.55rem .8rem" data-nav-close aria-label="Fechar menu">
            <i data-lucide="x" style="width:18px;height:18px" aria-hidden="true"></i>
            Fechar
          </button>
        </div>
        <div class="navDrawer__links">
          <a href="#projetos" data-nav-item>Projetos</a>
          <a href="#contato" data-nav-item>Contato</a>
          <a href="#contato" data-nav-item style="border-color: rgba(34,211,238,.35); background: rgba(34,211,238,.08);">Falar comigo</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  const closeBtn = drawer.querySelector('[data-nav-close]');

  const setOpen = (open) => {
    drawer.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) closeBtn?.focus();
  };

  toggle.addEventListener('click', () => {
    const open = !drawer.classList.contains('is-open');
    setOpen(open);
    initLucide();
  });

  closeBtn?.addEventListener('click', () => setOpen(false));
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) setOpen(false);
  });

  $$('[data-nav-item]', drawer).forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

function enhanceHoverAccessibility() {
  // Support keyboard focus glow for interactive elements
  const cards = $$('.techCard, .projectCard, .socialLink, .githubBtn, .stackItem, .nav__link');
  cards.forEach((el) => {
    el.addEventListener('focus', () => el.classList.add('is-focused'));
    el.addEventListener('blur', () => el.classList.remove('is-focused'));
  });
}

(function main() {
  initLucide();
  initRevealOnScroll();
  initYear();
  initHeaderInteractions();
  initMobileNav();
  enhanceHoverAccessibility();
})();

