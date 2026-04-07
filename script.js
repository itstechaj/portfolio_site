/* ═══════════════════════════════════════════════════════════════════
   ABHIJIT KUMAR — PORTFOLIO ENGINE
   Starfield · Parallax · 3D Tilt · Carousel · Lightbox · Reveals
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. STARFIELD ──────────────────────────────────────────── */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let cW, cH;

  function resizeCanvas() {
    cW = canvas.width = window.innerWidth;
    cH = canvas.height = window.innerHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * cW,
        y: Math.random() * cH,
        r: Math.random() * 1.4 + 0.3,
        o: Math.random() * 0.6 + 0.15,
        speed: Math.random() * 0.3 + 0.05,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, cW, cH);
    const scrollY = window.scrollY * 0.03;

    stars.forEach((s) => {
      s.flicker += s.flickerSpeed;
      const opacity = s.o + Math.sin(s.flicker) * 0.15;
      const y = (s.y - scrollY * s.speed + cH) % cH;

      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 215, 255, ${Math.max(0, opacity)})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  createStars(Math.min(280, Math.floor((cW * cH) / 6000)));
  drawStars();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      createStars(Math.min(280, Math.floor((cW * cH) / 6000)));
    }, 200);
  });

  /* ── 2. NAVBAR ──────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = navLinks.querySelectorAll('a');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navAnchors.forEach((a) => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollPos = window.scrollY + 150;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navAnchors.forEach((a) => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  /* ── 3. SCROLL REVEAL ──────────────────────────────────────── */
  const reveals = document.querySelectorAll('.rv');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('shown');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  /* ── 4. 3D TILT EFFECT ─────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    card.style.boxShadow = `
      ${rotateY * 1.5}px ${-rotateX * 1.5}px 30px rgba(168,85,247,0.12),
      0 12px 40px rgba(0,0,0,0.35)
    `;
  }

  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = '';
    card.style.boxShadow = '';
  }

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
  });

  /* ── 5. CAROUSEL TOUCH/SWIPE ────────────────────────────────── */
  const carouselWrap = document.querySelector('.carousel-wrap');
  const carousel = document.getElementById('carousel');

  if (carouselWrap && carousel) {
    let touchStartX = 0;
    let touchDelta = 0;
    let isDragging = false;

    carouselWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      isDragging = true;
      carousel.style.animationPlayState = 'paused';
    }, { passive: true });

    carouselWrap.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      touchDelta = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    carouselWrap.addEventListener('touchend', () => {
      isDragging = false;
      if (Math.abs(touchDelta) > 50) {
        const currentTransform = getComputedStyle(carousel).transform;
        const matrix = new DOMMatrix(currentTransform);
        const currentX = matrix.m41;
        carousel.style.animation = 'none';
        carousel.style.transform = `translateX(${currentX + touchDelta * 2}px)`;

        setTimeout(() => {
          carousel.style.animation = '';
          carousel.style.animationPlayState = '';
        }, 300);
      } else {
        carousel.style.animationPlayState = '';
      }
      touchDelta = 0;
    });
  }

  /* ── 6. LIGHTBOX ────────────────────────────────────────────── */
  const projectData = [
    {
      title: 'Upto 100% SuperCoins Cashback',
      subtitle: 'Loyalty Platform · SuperCoin Earn-as-Offer',
      image: 'assets/images/Earn_as_offer.png',
      problem:
        'Flipkart\'s SuperCoin ecosystem lacked the ability to create targeted, offer-driven coin earning experiences. Existing "callout" offers couldn\'t be targeted to specific user cohorts (VIP, Plus, Non-Plus), limiting business teams from crafting precision acquisition and engagement campaigns. Two separate sources of truth (PnP and LockIn) created data inconsistency and operational friction.',
      solution:
        'Designed and shipped a completely new offer type within the PnP promotions framework — enabling percentage-based and fixed coin earn offers with full cohort targeting (membership tier, user segments via AM segments). Unified the offer creation pipeline through Grumbles, powering end-to-end visibility from search callouts → product page widget → cart integration → coin ledger tracking. Built guardrails for minimum coin display thresholds differentiated by user tier.',
      impact:
        'Unlocked coin earning as a first-class promotional lever across Flipkart, Grocery, and Hyperlocal — reaching 100M+ eligible users. Enabled business teams to deploy targeted campaigns (sale + non-sale periods), directly driving adoption of slow-moving selection and partner category deals. Eliminated dual source-of-truth tech debt.',
      tech: ['Java', 'PnP', 'Grumbles', 'AM Segments', 'Astra Cache', 'LockIn', 'Search', 'Product Page'],
    },
    {
      title: 'CnC Booster Multiplier Offer',
      subtitle: 'Commerce Engine · Click & Collect 2.0',
      image: 'assets/images/cnc_nep.png',
      problem:
        'The original CnC (Click & Collect) system used a fixed coin-to-INR conversion ratio, making it impossible to run promotional multiplier offers (e.g., 2× or 3× coin value). The rigid architecture couldn\'t support variable multipliers per offer, preventing the business from creating differentiated coin-burn promotions that could drive higher conversion and perceived value.',
      solution:
        'Redesigned the CnC allocation engine to support multi-multiplier coin optimization. Built a priority-based allocation algorithm that sorts offers by multiplier (descending), distributes user\'s coin balance optimally across multiple offers per listing, and calculates the updatedItemPrice dynamically. Migrated the getCoinForListings computation from a network-dependent service call to a lightweight library — eliminating 15K–20K QPS of redundant network hops. Maintained backward compatibility with multiplier=1 default.',
      impact:
        'Enabled the business to launch booster coin promotions with variable multipliers — directly increasing perceived value and conversion rates. Reduced latency across the entire search & discovery funnel by eliminating service-level coin computation. The library migration alone saved ~20K QPS in cross-service traffic, improving system throughput and reducing infrastructure cost.',
      tech: ['Java', 'CnC Service', 'CnC Library', 'Mandark', 'Coin Manager', 'Optimization Algorithms', 'RS'],
    },
    {
      title: 'Flipkart × Uber Partnership',
      subtitle: 'Strategic Integration · Cross-Platform Linking',
      image: 'assets/images/fk_uber.png',
      problem:
        'Flipkart wanted to expand the SuperCoin value network beyond e-commerce by partnering with Uber — allowing users to earn SuperCoins on Uber rides. This required solving complex cross-platform identity linking (Flipkart ↔ Uber), secure OAuth/SSO authorization flows, coin credit via IP-whitelisted APIs, and real-time user segmentation — all without sharing PII between platforms.',
      solution:
        'Architected the complete integration pipeline: EMM (External Membership Manager) orchestrates linking, calling UserService for persistent FK_IDENTIFIER token generation. VendorHub handles all Uber API communication through a forward-squat proxy. CoinManager supports IP subnet whitelisting (Spring IpAddressMatcher) for Uber\'s coin credit calls. Built real-time AM segment integration via Turbo/Falcon to power merch banner targeting for linked vs. unlinked users within 45-second SLA. Deprecated the Tesseract gateway layer, simplifying MAPI → EMM direct communication.',
      impact:
        'Launched a first-of-its-kind B2B loyalty partnership linking Flipkart\'s 100M+ user base with Uber\'s ride-hailing platform. Users can now earn SuperCoins on every Uber ride, expanding the coin ecosystem beyond e-commerce. Real-time segmentation enables dynamic banner targeting, driving linking conversion. Architecture supports future extensions to other partners.',
      tech: ['EMM', 'VendorHub', 'UserService', 'CoinManager', 'OAuth', 'AM Segments', 'Turbo/Falcon', 'MAPI'],
    },
  ];

  const lightbox = document.getElementById('lightbox');
  const lbClose = document.getElementById('lbClose');

  function openLightbox(index) {
    const data = projectData[index];
    if (!data) return;

    document.getElementById('lbImg').src = data.image;
    document.getElementById('lbImg').alt = data.title;
    document.getElementById('lbTitle').textContent = data.title;
    document.getElementById('lbSub').textContent = data.subtitle;
    document.getElementById('lbProblem').textContent = data.problem;
    document.getElementById('lbSolution').textContent = data.solution;
    document.getElementById('lbImpact').textContent = data.impact;

    const techWrap = document.getElementById('lbTech');
    techWrap.innerHTML = data.tech.map((t) => `<span>${t}</span>`).join('');

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.p-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.project, 10);
      openLightbox(idx);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── 7. COPY TO CLIPBOARD ──────────────────────────────────── */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  document.querySelectorAll('.ct-copy').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = btn.dataset.copy;
      navigator.clipboard
        .writeText(value)
        .then(() => {
          btn.classList.add('copied');
          btn.textContent = '✓';
          showToast(`Copied: ${value}`);
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = '📋';
          }, 2000);
        })
        .catch(() => {
          // Fallback for non-HTTPS
          const ta = document.createElement('textarea');
          ta.value = value;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.classList.add('copied');
          btn.textContent = '✓';
          showToast(`Copied: ${value}`);
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = '📋';
          }, 2000);
        });
    });
  });

  /* ── 8. PARALLAX NEBULAS ───────────────────────────────────── */
  const nebulas = document.querySelectorAll('.neb');

  window.addEventListener(
    'scroll',
    () => {
      const sy = window.scrollY;
      nebulas.forEach((n, i) => {
        const speed = [0.04, 0.03, 0.025][i] || 0.03;
        n.style.transform = `translateY(${sy * speed}px)`;
      });
    },
    { passive: true }
  );

  /* ── 9. SMOOTH ANCHOR SCROLL ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ── 10. HERO PARALLAX ON MOUSE ────────────────────────────── */
  const heroSection = document.querySelector('.hero');
  const heroInner = document.querySelector('.hero-inner');

  if (heroSection && heroInner) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroInner.style.transform = `translate(${x * 8}px, ${y * 8}px)`;

      nebulas.forEach((n, i) => {
        const factor = [15, 12, 10][i] || 12;
        const currentTranslateY =
          parseFloat(n.style.transform?.match(/translateY\(([^)]+)\)/)?.[1]) || 0;
        n.style.transform = `translate(${x * factor}px, ${currentTranslateY}px)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      heroInner.style.transform = '';
    });
  }

  /* ── 11. PRELOADER FADE ────────────────────────────────────── */
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Set initial body opacity
  document.body.style.transition = 'opacity 0.6s ease';
  document.body.style.opacity = '0';
  // Trigger on next frame to ensure transition works
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
})();
