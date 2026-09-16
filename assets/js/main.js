/* ==========================================================================
   Portfolio — Mohamed Biagui — main.js
   JavaScript vanilla, aucune dépendance. Chargé en `defer` : le DOM est prêt.

   Comportements :
    1. Typewriter du terminal (hero)
    2. Barre de progression du scroll
    3. Smooth scroll des ancres (offset = hauteur navbar)
    4. Scrollspy : lien de menu actif selon la section visible
    5. Reveal on scroll (fade-in + translateY)
    6. Barres de progression (compétences + langues)
    7. Compteurs de la barre de stats (0 -> valeur, garde le suffixe "+")
    8. Bouton retour en haut
    9. Ombre de la navbar après scroll
   10. Menu burger mobile
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Utilitaires ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Respecte la préférence système "réduire les animations"
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hauteur de la navbar lue depuis la variable CSS --nav-h (change en mobile)
  const navHeight = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
    return parseInt(raw, 10) || 72;
  };

  // Fonction de fermeture du menu mobile (définie dans initBurger, utilisée par le smooth scroll)
  let closeMenu = () => {};

  /* ======================================================================
     1. Typewriter du terminal
     Écrit chaque ligne caractère par caractère (35 ms), pause de 350 ms
     entre les lignes, une seule passe, le curseur continue de clignoter.
     Sans JS (ou avec "réduire les animations"), le contenu statique du HTML reste affiché.
     ====================================================================== */
  function initTerminal() {
    const body = $('#terminal-body');
    if (!body || reduceMotion) return;

    const CHAR_DELAY = 35;   // ms par caractère
    const LINE_PAUSE = 350;  // ms entre deux lignes

    // type : 'cmd' = commande précédée de "$", 'out' = sortie, 'ok' = sortie précédée de "[OK]"
    const LINES = [
      { type: 'cmd', text: 'whoami' },
      { type: 'out', text: 'mohamed.biagui — réseaux · sécurité · devsecops' },
      { type: 'cmd', text: 'cat focus.txt' },
      { type: 'out', text: 'Blue Team (SOC/IDS) + DevOps & Cloud' },
      { type: 'cmd', text: 'status --disponibilite' },
      { type: 'ok',  text: 'disponible pour une nouvelle mission' },
    ];

    // On vide le contenu statique et on garde un curseur toujours en fin de bloc
    body.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'terminal__cursor';
    cursor.setAttribute('aria-hidden', 'true');
    body.appendChild(cursor);

    const append = (className, text = '') => {
      const span = document.createElement('span');
      span.className = className;
      span.textContent = text;
      body.insertBefore(span, cursor);
      return span;
    };
    const appendText = (text) => body.insertBefore(document.createTextNode(text), cursor);

    const typeInto = async (span, text) => {
      for (const ch of text) {
        span.textContent += ch;
        await sleep(CHAR_DELAY);
      }
    };

    (async () => {
      for (let i = 0; i < LINES.length; i++) {
        const line = LINES[i];

        if (line.type === 'cmd') {
          append('terminal__prompt', '$');
          appendText(' ');
          await typeInto(append('terminal__cmd'), line.text);
        } else if (line.type === 'ok') {
          append('terminal__ok', '[OK]');
          appendText(' ');
          await typeInto(append('terminal__out'), line.text);
        } else {
          await typeInto(append('terminal__out'), line.text);
        }

        if (i < LINES.length - 1) {
          appendText('\n');
          await sleep(LINE_PAUSE);
        }
      }
    })();
  }

  /* ======================================================================
     2. Barre de progression du scroll (largeur = % de défilement)
     ====================================================================== */
  function initProgressBar() {
    const bar = $('#progress');
    if (!bar) return;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct + '%';
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ======================================================================
     3. Smooth scroll des ancres internes, avec décalage de la navbar
     ====================================================================== */
  function scrollToElement(el) {
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight();
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        if (!hash || hash.length < 2) return;
        const target = document.getElementById(hash.slice(1));
        if (!target) return;

        event.preventDefault();
        closeMenu();
        scrollToElement(target);
        history.pushState(null, '', hash);
      });
    });

    // Arrivée directe avec un #hash dans l'URL : corriger le décalage de la navbar
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) setTimeout(() => scrollToElement(target), 50);
    }
  }

  /* ======================================================================
     4. Scrollspy (IntersectionObserver)
     On observe une "ligne" de 1 px située juste sous la navbar : la section
     qui la traverse est la section active. La dernière section (contact)
     étant courte, on la force quand on atteint le bas de page.
     ====================================================================== */
  function initScrollspy() {
    const links = $$('.nav__link');
    const sections = links
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean);
    if (!sections.length) return;

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    let observer = null;
    const build = () => {
      if (observer) observer.disconnect();
      const top = navHeight() + 1;
      const bottom = Math.max(0, window.innerHeight - top - 1);
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: 0 });
      sections.forEach((section) => observer.observe(section));
    };

    build();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    });

    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    window.addEventListener('scroll', () => {
      if (atBottom()) setActive(sections[sections.length - 1].id);
    }, { passive: true });
  }

  /* ======================================================================
     5. Reveal on scroll (une seule fois par élément)
     ====================================================================== */
  function initReveal() {
    const elements = $$('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el) => observer.observe(el));
  }

  /* ======================================================================
     6. Barres de progression : remplissage à l'entrée dans le viewport
     ====================================================================== */
  function initProgressBars() {
    const bars = $$('.bar');
    if (!bars.length) return;

    const fill = (bar) => {
      const span = $('.bar__fill[data-progress]', bar);
      if (span) span.style.width = span.dataset.progress + '%';
    };

    if (!('IntersectionObserver' in window)) { bars.forEach(fill); return; }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        fill(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    bars.forEach((bar) => observer.observe(bar));
  }

  /* ======================================================================
     7. Compteurs de la barre de stats (0 -> valeur, easing, suffixe conservé)
     ====================================================================== */
  function initCounters() {
    const numbers = $$('.stat__num[data-count]');
    if (!numbers.length || reduceMotion || !('IntersectionObserver' in window)) return;

    const DURATION = 1400;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / DURATION, 1);
        el.textContent = Math.round(easeOut(progress) * target) + suffix;
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    numbers.forEach((el) => observer.observe(el));
  }

  /* ======================================================================
     8. Bouton retour en haut (visible après 400 px de scroll)
     ====================================================================== */
  function initBackToTop() {
    const button = $('#to-top');
    if (!button) return;

    const toggle = () => button.classList.toggle('is-visible', window.scrollY > 400);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ======================================================================
     9. Navbar : ombre renforcée une fois la page défilée
     ====================================================================== */
  function initNavbarShadow() {
    const navbar = $('#navbar');
    if (!navbar) return;

    const toggle = () => navbar.classList.toggle('is-scrolled', window.scrollY > 10);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  /* ======================================================================
     10. Menu burger mobile (ouverture / fermeture, Échap, retour desktop)
     ====================================================================== */
  function initBurger() {
    const burger = $('#burger');
    const nav = $('#nav');
    if (!burger || !nav) return;

    const open = () => {
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fermer le menu');
    };
    const close = () => {
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    };
    closeMenu = close;

    burger.addEventListener('click', () => {
      nav.classList.contains('is-open') ? close() : open();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        burger.focus();
      }
    });

    // Si on repasse en desktop avec le menu ouvert, on le referme
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onChange = (event) => { if (event.matches) close(); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else desktop.addListener(onChange); // anciens Safari
  }

  /* ---------- Initialisation ---------- */
  initBurger();
  initSmoothScroll();
  initScrollspy();
  initProgressBar();
  initNavbarShadow();
  initBackToTop();
  initReveal();
  initProgressBars();
  initCounters();
  initTerminal();
})();
