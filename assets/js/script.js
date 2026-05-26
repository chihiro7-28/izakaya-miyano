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

    // ヒーロースライドショー
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 4000);

    // スクロールでオーバーレイが濃くなる & ナビにshadow付与
    const overlay = document.getElementById('heroOverlay');
    const navEl = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (overlay) {
        const heroH = document.querySelector('.hero')?.offsetHeight || 600;
        const opacity = Math.min(scrollY / heroH * 0.8, 0.75);
        overlay.style.background = `rgba(44,31,14,${opacity})`;
      }
      if (navEl) navEl.classList.toggle('scrolled', scrollY > 40);
    }, { passive: true });

    // カテゴリータブ切り替え
    function switchCat(idx, el) {
      document.querySelectorAll('.menu-cat-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.menu-cat-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.menu-cat-panel')[idx].classList.add('active');
      el.classList.add('active');
    }

    // スライダー状態管理
    const sliderState = [0,0,0,0,0,0];

    function slideMove(id, dir) {
      const slider = document.getElementById('slider-' + id);
      const total = slider.children.length;
      sliderState[id] = (sliderState[id] + dir + total) % total;
      updateSlider(id);
    }

    function slideTo(id, idx) {
      sliderState[id] = idx;
      updateSlider(id);
    }

    function updateSlider(id) {
      const slider = document.getElementById('slider-' + id);
      slider.style.transform = 'translateX(-' + (sliderState[id] * 100) + '%)';
      document.querySelectorAll('#dots-' + id + ' .dot').forEach((d, i) => {
        d.classList.toggle('active', i === sliderState[id]);
      });
    }

    // アコーディオン
    function toggleAccordion(btn) {
      const body = btn.nextElementSibling;
      btn.classList.toggle('open');
      body.classList.toggle('open');
    }

    // 店内スライダー
    let interiorIdx = 0;
    const interiorSlider = document.getElementById('interiorSlider');
    const interiorDots = document.querySelectorAll('.interior-dot');

    function interiorMove(dir) {
      const total = interiorSlider.children.length;
      interiorIdx = (interiorIdx + dir + total) % total;
      updateInterior();
    }

    function interiorTo(idx) {
      interiorIdx = idx;
      updateInterior();
    }

    function updateInterior() {
      interiorSlider.style.transform = `translateX(-${interiorIdx * 100}%)`;
      interiorDots.forEach((d, i) => d.classList.toggle('active', i === interiorIdx));
    }

    // スクロールフェードイン
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade, .section-label, .section-title, .divider').forEach(el => obs.observe(el));

    const obsBlur = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), i * 100);
          obsBlur.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-blur').forEach(el => obsBlur.observe(el));

    // ライトボックス（スライダーごとに独立）
    let lbImages = [];
    let lbCaptions = [];
    let lbIdx = 0;

    function buildLightboxImages() {
      // メニュースライダーごとに独立して登録
      document.querySelectorAll('.menu-slider').forEach(slider => {
        const imgs = [...slider.querySelectorAll('.menu-slide img')];
        const srcs = imgs.map(img => img.src);
        const caps = imgs.map(img =>
          img.closest('.menu-slide')?.querySelector('.menu-slide-label')?.textContent?.trim() || ''
        );
        imgs.forEach((img, i) => {
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', () => openLightbox(srcs, caps, i));
        });
      });

      // 店内スライダーは全体でひとまとめ
      const intImgs = [...document.querySelectorAll('.interior-slide img')];
      const intSrcs = intImgs.map(img => img.src);
      const intCaps = intImgs.map(img =>
        img.closest('.interior-slide')?.querySelector('.interior-slide-name')?.textContent?.trim() || ''
      );
      intImgs.forEach((img, i) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openLightbox(intSrcs, intCaps, i));
      });
    }

    function openLightbox(images, captions, idx) {
      lbImages = images;
      lbCaptions = captions;
      lbIdx = idx;
      const dotsEl = document.getElementById('lightboxDots');
      dotsEl.innerHTML = lbImages.map((_, i) => `<span class="lightbox-dot" onclick="lbGoTo(${i})"></span>`).join('');
      updateLightbox();
      document.getElementById('lightbox').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('open');
      document.body.style.overflow = '';
    }

    function lbGoTo(idx) {
      lbIdx = (idx + lbImages.length) % lbImages.length;
      updateLightbox();
    }

    function updateLightbox() {
      const img = document.getElementById('lightboxImg');
      img.style.opacity = 0;
      setTimeout(() => {
        img.src = lbImages[lbIdx];
        img.style.opacity = 1;
      }, 150);
      document.getElementById('lightboxCaption').textContent = lbCaptions[lbIdx];
      document.querySelectorAll('.lightbox-dot').forEach((d, i) => d.classList.toggle('active', i === lbIdx));
    }

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => lbGoTo(lbIdx - 1));
    document.getElementById('lightboxNext').addEventListener('click', () => lbGoTo(lbIdx + 1));
    document.getElementById('lightbox').addEventListener('click', e => {
      if (e.target === document.getElementById('lightbox')) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!document.getElementById('lightbox').classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbGoTo(lbIdx - 1);
      if (e.key === 'ArrowRight') lbGoTo(lbIdx + 1);
    });

    window.addEventListener('load', buildLightboxImages);
