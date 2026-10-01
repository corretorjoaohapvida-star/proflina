(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const strip = document.querySelector('.product-strip');
  const controls = document.querySelector('.carousel-controls');
  if (strip && controls) {
    controls.hidden = false;
    controls.addEventListener('click', (event) => {
      const control = event.target.closest('[data-scroll]');
      if (!control) return;
      strip.scrollBy({ left: Number(control.dataset.scroll) * Math.max(180, strip.clientWidth * 0.7), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    });
  }

  const galleryButton = document.querySelector('#expand-gallery');
  const gallery = document.querySelector('#galeria-modelos');
  const extras = [...document.querySelectorAll('.more-model')];
  if (galleryButton && gallery) {
    extras.forEach((item) => { item.hidden = true; });
    galleryButton.hidden = false;
    galleryButton.addEventListener('click', () => {
      const expand = galleryButton.getAttribute('aria-expanded') !== 'true';
      galleryButton.setAttribute('aria-expanded', String(expand));
      galleryButton.textContent = expand ? 'Mostrar menos modelos −' : 'Ver mais fofurinhas +';
      extras.forEach((item) => { item.hidden = !expand; });
      if (expand) extras[0].querySelector('button').focus({ preventScroll: true });
      else gallery.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    });
  }

  const dialog = document.querySelector('.image-dialog');
  let lastPhotoButton;
  if (dialog && typeof dialog.showModal === 'function') {
    document.addEventListener('click', (event) => {
      const photo = event.target.closest('[data-zoom]');
      if (!photo) return;
      lastPhotoButton = photo;
      const expanded = dialog.querySelector('img');
      expanded.src = photo.dataset.zoom;
      expanded.alt = photo.dataset.caption;
      dialog.querySelector('#image-caption').textContent = photo.dataset.caption;
      dialog.showModal();
      document.body.classList.add('photo-open');
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('photo-open');
      if (lastPhotoButton) lastPhotoButton.focus({ preventScroll: true });
    });
  }

  const mobileBuy = document.querySelector('.mobile-buy');
  if ('IntersectionObserver' in window && mobileBuy) {
    let passedHero = false;
    const visiblePurchaseBlocks = new Set();
    const update = () => { mobileBuy.hidden = !passedHero || visiblePurchaseBlocks.size > 0; };
    new IntersectionObserver(([entry]) => {
      passedHero = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      update();
    }).observe(document.querySelector('.hero'));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visiblePurchaseBlocks.add(entry.target.id);
        else visiblePurchaseBlocks.delete(entry.target.id);
      }
      update();
    }, { rootMargin: '0px 0px 80px 0px' });
    observer.observe(document.querySelector('#ofertas'));
    observer.observe(document.querySelector('#quero-meu-pack'));
  }

  // Keep seasonal wording tied to the advertised date, without resetting a countdown.
  if (Date.now() >= Date.parse('2026-10-16T00:00:00-03:00')) {
    document.querySelector('[data-seasonal]').textContent = '🌸 Um pack cheio de carinho para presentear professores.';
    document.querySelector('#timing-title').textContent = 'Seu próximo mimo pode começar por aqui 🌸';
    document.querySelector('[data-seasonal-copy]').textContent = 'Escolha os modelos, prepare sua amostra e combine as encomendas conforme sua capacidade de produção. Cada detalhe merece o seu carinho.';
  }
})();
