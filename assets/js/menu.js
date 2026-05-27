// ハンバーガーメニュー
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  menuOverlay.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// navスクロール
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// スクロールフェードイン
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 70);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.fade, .menu-section-en, .menu-section-ja').forEach(el => obs.observe(el));

// menu-item スタガー（グリッド単位で）
const itemObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const items = e.target.querySelectorAll('.menu-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('in'), i * 30);
      });
      itemObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.menu-grid').forEach(grid => itemObs.observe(grid));

// カテゴリーナビのアクティブ
const sections = document.querySelectorAll('.menu-section[id]');
const navLinks = document.querySelectorAll('.menu-nav-link');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.menu-nav-link[href="#${e.target.id}"]`);
      if (active) {
        active.classList.add('active');
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObs.observe(s));
