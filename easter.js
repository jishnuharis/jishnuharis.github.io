(function () {
  // ── Glow ───────────────────────────────────────────────────────────────
  const glow = document.createElement('div');
  glow.className = 'glow';
  document.body.appendChild(glow);

  // ── Entity data ─────────────────────────────────────────────────────────
  const entities = [
    { emoji: '🐱', says: 'you found me' },
    { emoji: '👾', says: 'hello from the void' },
    { emoji: '🐸', says: 'why are you here' },
    { emoji: '🤖', says: 'beep boop' },
    { emoji: '👻', says: 'boo.' },
    { emoji: '🦊', says: 'took you long enough' },
    { emoji: '🐙', says: 'eight arms, zero bugs' },
    { emoji: '🦉', says: 'still watching' },
    { emoji: '🐧', says: 'i run on linux' },
    { emoji: '🦎', says: 'cold blooded coder' },
  ];

  // ── Create entity element ───────────────────────────────────────────────
  const entity = document.createElement('div');
  entity.className = 'entity-wrap';
  entity.innerHTML = '<div class="entity-body"></div><div class="entity-bubble"></div>';

  // append to main if it exists, else body
  const root = document.querySelector('main') || document.body;
  root.appendChild(entity);

  const entityBody = entity.querySelector('.entity-body');
  const entityBubble = entity.querySelector('.entity-bubble');

  // ── All elements to avoid across every page ─────────────────────────────
  const AVOID = [
    'h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'input', 'nav',
    '.card', '.shell', '.info-card', '.terminal', '.terminal-bar',
    '.chrome-bar', '.tg-header', '.tg-input', '.chat-body',
    '.topbar', '.back', '.repo-link', '.eyebrow', '.sub',
    '.hero', '.hero-eyebrow', '.hero-sub', '.hero-desc', '.hero-cta',
    '.section-label', '.projects-grid', '.about-inner', '.skills-list',
    '.contact-inner', '.contact-links', '.game-shell', '.controls-bar',
    '.storage-bar-wrap', '.info-grid', '.legend', '.stat-row',
    '.feature-list', '.node-row', '.arch-wrap', '.anon-badge',
    '.progress-wrap', '.folder-list', '.file-bubble', '.overlay',
    'footer', '.page-footer',
  ].join(', ');

  function getBlockedRects() {
    return [...document.querySelectorAll(AVOID)].map(el => {
      const r = el.getBoundingClientRect();
      return {
        top:    r.top    + window.scrollY - 24,
        bottom: r.bottom + window.scrollY + 24,
        left:   r.left   - 24,
        right:  r.right  + 24,
      };
    });
  }

  function overlaps(x, y, rects) {
    return rects.some(b => x > b.left && x < b.right && y > b.top && y < b.bottom);
  }

  function placeEntity() {
    const current = entities[Math.floor(Math.random() * entities.length)];
    entityBody.textContent = current.emoji;
    entityBubble.textContent = current.says;

    const rects = getBlockedRects();
    let x, y, attempts = 0;
    do {
      x = 80 + Math.random() * (window.innerWidth - 160);
      y = 100 + Math.random() * (document.body.scrollHeight - 200);
      attempts++;
    } while (overlaps(x, y, rects) && attempts < 60);

    entity.style.left = x + 'px';
    entity.style.top  = y + 'px';
    entity._x = x;
    entity._y = y;

    // hide mask until cursor moves near
    const hidden = 'radial-gradient(circle 160px at 9999px 9999px, black 0%, transparent 100%)';
    entity.style.webkitMaskImage = hidden;
    entity.style.maskImage = hidden;
  }

  // ── Shared mask + distance update ───────────────────────────────────────
  function updateEntity(cx, cy) {
    const rect = entity.getBoundingClientRect();
    const mx = cx - rect.left;
    const my = cy - rect.top;
    const mask = `radial-gradient(circle 160px at ${mx}px ${my}px, black 0%, transparent 100%)`;
    entity.style.webkitMaskImage = mask;
    entity.style.maskImage = mask;

    const dx = cx - entity._x;
    const dy = (cy + window.scrollY) - entity._y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 160 && !entity._found) {
      entity._found = true;
      setTimeout(() => {
        placeEntity();
        entity._found = false;
      }, 4000);
    }
  }

  // ── Mousemove ────────────────────────────────────────────────────────────
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', e => {
    lastX = e.clientX;
    lastY = e.clientY;

    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';

    updateEntity(e.clientX, e.clientY);
  });

  // ── Scroll — update mask without mousemove ───────────────────────────────
  window.addEventListener('scroll', () => {
    updateEntity(lastX, lastY);
  }, { passive: true });

  // ── Place on load ────────────────────────────────────────────────────────
  window.addEventListener('load', placeEntity);

})();