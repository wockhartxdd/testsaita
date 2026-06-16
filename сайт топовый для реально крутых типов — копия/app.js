// ═══════════════════════════════════════════════════
// COSMOS APP
// ═══════════════════════════════════════════════════

const SUN_IMG = 'images/sun.jpg';

function getCurrentPage() {
  const p = window.location.pathname.split('/').pop().replace('.html', '');
  return p || 'index';
}

function setActiveNav() {
  const page = getCurrentPage();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });
}

function createStars(count = 220) {
  const bg = document.getElementById('stars-bg');
  if (!bg) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() * 2.5 + 0.5;
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${2+Math.random()*4}s;animation-delay:${Math.random()*5}s;opacity:${Math.random()*.8+.1}`;
    bg.appendChild(s);
  }
}

function createShootingStars() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  for (let i = 0; i < 4; i++) {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.cssText = `top:${Math.random()*80+10}%;left:${Math.random()*80}%;animation-delay:${Math.random()*5}s;animation-duration:${3+Math.random()*3}s`;
    hero.appendChild(s);
  }
}

// ═══════════════════════════════════════════════════
// ПЛАНЕТЫ
// ═══════════════════════════════════════════════════
function renderPlanets(containerId = 'planetsGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  
  grid.innerHTML = PLANETS.map(p => `
    <div class="planet-card" data-name="${p.name}">
      <div class="card-visual">
        <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async" onerror="this.src='data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><circle cx='200' cy='200' r='180' fill='${p.color}'/></svg>`)}'">
      </div>
      <div class="planet-icon" style="background:${p.glow}33">${p.emoji}</div>
      <h3>${p.name}</h3>
      <span class="tag" style="background:${p.tagColor}33;color:${p.color}">${p.tag}</span>
      <p>${p.desc}</p>
      <div class="planet-stat"><span>Диаметр</span><strong>${p.diameter}</strong></div>
      <div class="planet-stat"><span>Сутки</span><strong>${p.dayLen}</strong></div>
      <div class="planet-stat"><span>Спутники</span><strong>${p.moons}</strong></div>
      <div class="planet-stat"><span>Гравитация</span><strong>${p.gravity} м/с²</strong></div>
      <div class="extra-info">${p.fact}</div>
    </div>
  `).join('');
  
  attachPlanetCardEvents();
}

function attachPlanetCardEvents() {
  document.querySelectorAll('.planet-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      const p = PLANETS.find(x => x.name === name);
      if (p) openPlanetModal(p);
    });
  });
}

function openPlanetModal(p) {
  const modal = document.getElementById('planetModal');
  if (!modal) return;
  const imgEl = document.getElementById('modalImage');
  imgEl.style.display = 'block';
  imgEl.src = p.img;
  imgEl.alt = p.name;
  imgEl.onerror = function() {
    this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect width="800" height="400" fill="#0a0a1a"/><circle cx="400" cy="200" r="150" fill="${p.color}"/></svg>`
    );
  };
  document.getElementById('modalTitle').textContent = `${p.emoji} ${p.name}`;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalFact').textContent = p.fact;
  document.getElementById('modalStats').innerHTML = `
    <div class="modal-stat"><span>Тип</span><strong>${p.tag}</strong></div>
    <div class="modal-stat"><span>Диаметр</span><strong>${p.diameter}</strong></div>
    <div class="modal-stat"><span>Масса</span><strong>${p.mass}</strong></div>
    <div class="modal-stat"><span>Расстояние от Солнца</span><strong>${p.distance}</strong></div>
    <div class="modal-stat"><span>Сутки</span><strong>${p.dayLen}</strong></div>
    <div class="modal-stat"><span>Год</span><strong>${p.year}</strong></div>
    <div class="modal-stat"><span>Спутники</span><strong>${p.moons}</strong></div>
    <div class="modal-stat"><span>Гравитация</span><strong>${p.gravity} м/с²</strong></div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ═══════════════════════════════════════════════════
// СОЛНЦЕ — МОДАЛКА
// ═══════════════════════════════════════════════════
function openSunModal() {
  const modal = document.getElementById('planetModal');
  if (!modal) return;
  
  const imgEl = document.getElementById('modalImage');
  imgEl.style.display = 'block';
  imgEl.src = SUN.img;
  imgEl.alt = 'Солнце';
  imgEl.onerror = function() {
    this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
        <defs>
          <radialGradient id="sunGrad">
            <stop offset="0%" stop-color="#fff8e1"/>
            <stop offset="30%" stop-color="#FFD740"/>
            <stop offset="70%" stop-color="#FF6D00"/>
            <stop offset="100%" stop-color="#BF360C"/>
          </radialGradient>
        </defs>
        <rect width="800" height="400" fill="#0a0a1a"/>
        <circle cx="400" cy="200" r="170" fill="url(#sunGrad)"/>
      </svg>`
    );
  };
  
  document.getElementById('modalTitle').textContent = `${SUN.emoji} ${SUN.name}`;
  document.getElementById('modalDesc').textContent = SUN.desc;
  document.getElementById('modalFact').textContent = SUN.fact;
  document.getElementById('modalStats').innerHTML = `
    <div class="modal-stat"><span>Тип звезды</span><strong>${SUN.type}</strong></div>
    <div class="modal-stat"><span>Диаметр</span><strong>${SUN.diameter}</strong></div>
    <div class="modal-stat"><span>Масса</span><strong>${SUN.mass}</strong></div>
    <div class="modal-stat"><span>Температура поверхности</span><strong>5 500°C</strong></div>
    <div class="modal-stat"><span>Температура ядра</span><strong>15 000 000°C</strong></div>
    <div class="modal-stat"><span>Возраст</span><strong>${SUN.age}</strong></div>
    <div class="modal-stat"><span>Состав</span><strong>${SUN.composition}</strong></div>
    <div class="modal-stat"><span>Тип реакции</span><strong>${SUN.core}</strong></div>
    <div class="modal-stat"><span>Свет до Земли</span><strong>8 мин 20 сек</strong></div>
    <div class="modal-stat"><span>Гравитация</span><strong>274 м/с²</strong></div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function scrollToMap() {
  const mapSection = document.getElementById('map-section');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════════════════
// СПУТНИКИ — карточки
// ═══════════════════════════════════════════════════
function renderSatellites(containerId = 'satGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = SATELLITES.map(s => `
    <div class="sat-card">
      <div class="sat-visual">
        <img src="${s.img}" alt="${s.name}" loading="lazy" onerror="this.style.display='none'">
      </div>
      <h3>${s.emoji} ${s.name}</h3>
      <span class="sat-owner">${s.owner}</span>
      <p>${s.desc}</p>
      <div class="sat-stat"><span>Орбита</span><strong>${s.orbit}</strong></div>
      <div class="sat-stat"><span>Период</span><strong>${s.period}</strong></div>
      <div class="sat-stat"><span>Запущен</span><strong>${s.launched}</strong></div>
      <div class="sat-stat"><span>Скорость</span><strong>${s.speed}</strong></div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════
// ЧЁРНЫЕ ДЫРЫ
// ═══════════════════════════════════════════════════
function renderBlackHoles(containerId = 'bhGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = BLACKHOLES.map(b => `
    <div class="bh-card" data-title="${b.title}">
      <div class="bh-icon">${b.emoji}</div>
      <h3>${b.title}</h3>
      <p>${b.text}</p>
      <span class="bh-hint">Кликните для подробностей</span>
    </div>
  `).join('');
  
  document.querySelectorAll('.bh-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.dataset.title;
      const b = BLACKHOLES.find(x => x.title === title);
      if (b) openBHModal(b);
    });
  });
}

function openBHModal(b) {
  const modal = document.getElementById('bhModal');
  if (!modal) return;
  const img = document.getElementById('bhModalImage');
  img.style.display = 'block';
  img.src = b.img;
  img.alt = b.title;
  img.onerror = function() {
    this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect width="800" height="400" fill="#0a0a1a"/><text x="50%" y="50%" text-anchor="middle" font-size="180" dominant-baseline="middle">${b.emoji}</text></svg>`
    );
  };
  document.getElementById('bhModalTitle').textContent = `${b.emoji} ${b.title}`;
  document.getElementById('bhModalShort').textContent = b.text;
  document.getElementById('bhModalDetails').textContent = b.details;
  document.getElementById('bhModalStats').innerHTML = (b.stats || []).map(s => 
    `<div class="modal-stat"><span>${s.label}</span><strong>${s.value}</strong></div>`
  ).join('');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ═══════════════════════════════════════════════════
// ФАКТЫ
// ═══════════════════════════════════════════════════
function renderFacts(containerId = 'factsGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = FACTS.map(f => `
    <div class="fact-card" data-num="${f.n}">
      <div class="fact-num">${f.n}</div>
      <h4>${f.emoji} ${f.title}</h4>
      <p>${f.text}</p>
    </div>
  `).join('');
  
  document.querySelectorAll('.fact-card').forEach(card => {
    card.addEventListener('click', () => {
      const num = card.dataset.num;
      const f = FACTS.find(x => x.n === num);
      if (f) openFactModal(f);
    });
  });
}

function openFactModal(f) {
  const modal = document.getElementById('bhModal');
  if (!modal) return;
  const img = document.getElementById('bhModalImage');
  img.style.display = 'block';
  img.src = f.img || '';
  img.alt = f.title;
  img.onerror = function() { this.style.display = 'none'; };
  document.getElementById('bhModalTitle').textContent = `${f.emoji} ${f.title}`;
  document.getElementById('bhModalShort').textContent = f.text;
  document.getElementById('bhModalDetails').textContent = f.details;
  document.getElementById('bhModalStats').innerHTML = (f.stats || []).map(s => 
    `<div class="modal-stat"><span>${s.label}</span><strong>${s.value}</strong></div>`
  ).join('');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ═══════════════════════════════════════════════════
// ГАЛАКТИКИ
// ═══════════════════════════════════════════════════
let currentGalaxies = [...GALAXIES];
let currentFilter = 'all';
let currentSearch = '';

function renderGalaxies(containerId = 'galaxiesGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  
  const filtered = currentGalaxies.filter(g => {
    const matchType = currentFilter === 'all' || g.typeKey === currentFilter;
    const matchSearch = !currentSearch || 
      g.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      g.desc.toLowerCase().includes(currentSearch.toLowerCase());
    return matchType && matchSearch;
  });
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="no-galaxies">Ничего не найдено.</div>';
    return;
  }
  
  const totalEl = document.getElementById('statTotal');
  if (totalEl) totalEl.textContent = filtered.length;
  
  grid.innerHTML = filtered.map(g => `
    <div class="galaxy-card" data-name="${g.name}" style="--card-color: ${g.color}; --card-glow: ${g.glow}33">
      <div class="galaxy-card-visual"><span class="galaxy-emoji">${g.emoji}</span></div>
      <h3>${g.name}</h3>
      <span class="galaxy-type" style="background:${g.glow}33; color:${g.color}; border:1px solid ${g.glow}">${g.type}</span>
      <p>${g.desc}</p>
      <div class="galaxy-card-stats">
        <div class="galaxy-stat-row"><span class="label">Расстояние</span><span class="value">${g.distance}</span></div>
        <div class="galaxy-stat-row"><span class="label">Диаметр</span><span class="value">${g.diameter}</span></div>
        <div class="galaxy-stat-row"><span class="label">Звёзды</span><span class="value">${g.stars}</span></div>
        <div class="galaxy-stat-row"><span class="label">Масса</span><span class="value">${g.mass}</span></div>
      </div>
      <span class="galaxy-hint">Клик</span>
    </div>
  `).join('');
  
  document.querySelectorAll('.galaxy-card').forEach(card => {
    card.addEventListener('click', () => {
      const g = GALAXIES.find(x => x.name === card.dataset.name);
      if (g) openGalaxyModal(g);
    });
  });
}

function openGalaxyModal(g) {
  const modal = document.getElementById('galaxyModal');
  if (!modal) return;
  const imgEl = document.getElementById('galaxyModalImage');
  imgEl.style.display = 'block';
  imgEl.src = g.img;
  imgEl.alt = g.name;
  imgEl.onerror = function() {
    this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect width="800" height="400" fill="#0a0a1a"/><circle cx="400" cy="200" r="150" fill="${g.color}"/><text x="50%" y="200" text-anchor="middle" font-size="180" dominant-baseline="middle">${g.emoji}</text></svg>`
    );
  };
  document.getElementById('galaxyModalTitle').textContent = `${g.emoji} ${g.name}`;
  document.getElementById('galaxyModalShort').textContent = g.desc;
  document.getElementById('galaxyModalDetails').textContent = g.details;
  document.getElementById('galaxyModalStats').innerHTML = `
    <div class="modal-stat"><span>Тип</span><strong>${g.type}</strong></div>
    <div class="modal-stat"><span>Расстояние</span><strong>${g.distance}</strong></div>
    <div class="modal-stat"><span>Диаметр</span><strong>${g.diameter}</strong></div>
    <div class="modal-stat"><span>Масса</span><strong>${g.mass}</strong></div>
    <div class="modal-stat"><span>Звёзды</span><strong>${g.stars}</strong></div>
    <div class="modal-stat"><span>Возраст</span><strong>${g.age}</strong></div>
  ` + (g.facts || []).map((f, i) => 
    `<div class="modal-stat" style="grid-column:1/-1"><span>Факт ${i+1}</span><strong style="font-family:'Rajdhani',sans-serif;font-size:.85rem;text-transform:none">${f}</strong></div>`
  ).join('');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initGalaxyFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderGalaxies();
    });
  });
  
  const searchInput = document.getElementById('galaxiesSearch');
  const searchBtn = document.getElementById('galaxiesSearchBtn');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      currentSearch = e.target.value;
      renderGalaxies();
    });
  }
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      currentSearch = searchInput.value;
      renderGalaxies();
    });
  }
}

// ═══════════════════════════════════════════════════
// СРАВНЕНИЕ РАЗМЕРОВ
// ═══════════════════════════════════════════════════
let sizeCompPositions = [];
let sizeCompHovered = null;
let sizeCompLog = true;
let sizeCompFilter = 'all';
let sizeCompScale = 1;
let sizeCompOffsetX = 0;

function initSizeComparison() {
  const canvas = document.getElementById('sizeCompCanvas');
  const canvasWrap = document.querySelector('.size-comp-canvas-wrap');
  if (!canvas) return;
  
  if (canvasWrap && !canvasWrap.querySelector('.size-comp-hint')) {
    const hint = document.createElement('div');
    hint.className = 'size-comp-hint';
    hint.textContent = 'Наведите на объект • Перетаскивайте для навигации';
    canvasWrap.appendChild(hint);
    
    const zoomInfo = document.createElement('div');
    zoomInfo.className = 'size-comp-zoom-info';
    zoomInfo.id = 'sizeCompZoomInfo';
    zoomInfo.textContent = '1.0×';
    canvasWrap.appendChild(zoomInfo);
  }
  
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 1040;
  const H = canvas.height = 380;
  
  function getObjects() {
    return SIZE_COMPARISON.filter(o => {
      if (sizeCompFilter === 'planet') return o.type === 'Планета' || o.type === 'Спутник' || o.type === 'Карликовая';
      if (sizeCompFilter === 'star') return o.type === 'Звезда';
      return true;
    });
  }
  
  function calcRadius(diameter) {
    let r;
    if (sizeCompLog) {
      r = Math.log10(diameter) * 7.5;
    } else {
      r = Math.sqrt(diameter) * 0.05;
    }
    return Math.max(4, r * sizeCompScale);
  }
  
  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 400);
    bgGrad.addColorStop(0, '#262A38');
    bgGrad.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 137) - sizeCompOffsetX * 0.1) % W;
      const sy = (i * 251) % H;
      const finalX = sx < 0 ? sx + W : sx;
      ctx.fillRect(finalX, sy, 1, 1);
    }
    
    const objects = getObjects();
    const objSizes = objects.map(o => ({
      obj: o,
      r: calcRadius(o.diameter)
    }));
    
    const maxR = Math.max(...objSizes.map(s => s.r));
    let totalWidth = 60;
    objSizes.forEach((s, idx) => {
      const space = idx === 0 ? 0 : 50;
      totalWidth += s.r * 2 + space;
    });
    
    const availableWidth = W * 0.65;
    let autoScale = 1;
    if (totalWidth > availableWidth && sizeCompScale === 1) {
      autoScale = availableWidth / totalWidth;
    }
    
    const effectiveScale = sizeCompScale * autoScale;
    
    let x = 40 + sizeCompOffsetX;
    const y = H / 2 - 20;
    
    sizeCompPositions = [];
    
    objSizes.forEach((s, idx) => {
      const effectiveR = Math.max(4, s.r * autoScale);
      const cx = x + effectiveR;
      
      sizeCompPositions.push({
        obj: s.obj,
        x: cx,
        y: y,
        r: effectiveR,
        idx: idx
      });
      
      if (s.obj.type === 'Звезда') {
        ctx.save();
        ctx.shadowBlur = 40;
        ctx.shadowColor = s.obj.glow;
      }
      
      const grad = ctx.createRadialGradient(
        cx - effectiveR * 0.35, y - effectiveR * 0.35, 0,
        cx, y, effectiveR
      );
      grad.addColorStop(0, '#fff');
      grad.addColorStop(0.4, s.obj.color);
      grad.addColorStop(1, s.obj.glow || s.obj.color);
      
      ctx.beginPath();
      ctx.arc(cx, y, effectiveR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(cx, y, effectiveR, 0, Math.PI * 2);
      ctx.strokeStyle = sizeCompHovered === idx ? '#FFD740' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = sizeCompHovered === idx ? 2 : 1;
      ctx.stroke();
      
      if (s.obj.type === 'Звезда') {
        ctx.restore();
      }
      
      if (sizeCompHovered === idx) {
        ctx.strokeStyle = '#FFD740';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(cx, y, effectiveR + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      ctx.fillStyle = sizeCompHovered === idx ? '#FFD740' : '#F1EDE4';
      ctx.font = `${sizeCompHovered === idx ? 'bold ' : ''}11px Orbitron, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(s.obj.name, cx, y + effectiveR + 18);
      
      if (effectiveR > 8) {
        ctx.fillStyle = '#A9A6B8';
        ctx.font = '9px Rajdhani, sans-serif';
        ctx.fillText(s.obj.diameter.toLocaleString('ru') + ' км', cx, y + effectiveR + 31);
      }
      
      x += effectiveR * 2 + 50;
    });
    
    ctx.fillStyle = '#E5AC52';
    ctx.font = 'bold 13px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('📊 ' + (sizeCompLog ? 'Логарифмический' : 'Линейный') + ' масштаб', 15, 25);
    
    ctx.fillStyle = '#A9A6B8';
    ctx.font = '11px Rajdhani, sans-serif';
    const filterText = sizeCompFilter === 'all' ? 'Все объекты' : 
                       sizeCompFilter === 'planet' ? 'Планеты и спутники' : 'Только звёзды';
    ctx.textAlign = 'right';
    ctx.fillText('Показано: ' + filterText + ' • ' + objects.length + ' шт', W - 15, 25);
    
    const zoomInfo = document.getElementById('sizeCompZoomInfo');
    if (zoomInfo) zoomInfo.textContent = sizeCompScale.toFixed(1) + '×';
  }
  
  draw();
  
  const scaleRange = document.getElementById('sizeCompScale');
  const scaleVal = document.getElementById('sizeCompScaleVal');
  if (scaleRange) {
    scaleRange.addEventListener('input', e => {
      sizeCompScale = parseFloat(e.target.value);
      sizeCompOffsetX = 0;
      if (scaleVal) scaleVal.textContent = sizeCompScale.toFixed(1) + '×';
      draw();
    });
  }
  
  const modeSelect = document.getElementById('sizeCompMode');
  if (modeSelect) {
    modeSelect.addEventListener('change', e => {
      sizeCompLog = e.target.value === 'log';
      sizeCompOffsetX = 0;
      draw();
    });
  }
  
  const filterSelect = document.getElementById('sizeCompFilter');
  if (filterSelect) {
    filterSelect.addEventListener('change', e => {
      sizeCompFilter = e.target.value;
      sizeCompOffsetX = 0;
      draw();
    });
  }
  
  let isDragging = false;
  let startX = 0;
  let startOffset = 0;
  let mouseMoved = false;
  
  canvas.addEventListener('mousedown', e => {
    isDragging = sizeCompScale > 1;
    startX = e.clientX;
    startOffset = sizeCompOffsetX;
    mouseMoved = false;
    if (isDragging) canvas.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', e => {
    if (isDragging && sizeCompScale > 1) {
      const dx = e.clientX - startX;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      sizeCompOffsetX = startOffset + dx * scaleX;
      mouseMoved = true;
      draw();
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = sizeCompHovered !== null ? 'pointer' : (sizeCompScale > 1 ? 'grab' : 'default');
    }
  });
  
  canvas.addEventListener('mousemove', e => {
    if (isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    
    let foundIdx = null;
    sizeCompPositions.forEach((p, i) => {
      const dx = mx - p.x;
      const dy = my - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < p.r + 8) foundIdx = i;
    });
    
    if (foundIdx !== sizeCompHovered) {
      sizeCompHovered = foundIdx;
      canvas.style.cursor = foundIdx !== null ? 'pointer' : (sizeCompScale > 1 ? 'grab' : 'default');
      draw();
      updateSizeCompInfoPanel(sizeCompHovered !== null ? sizeCompPositions[sizeCompHovered].obj : null);
    }
  });
  
  let touchStartX = 0;
  let touchStartOffset = 0;
  let isTouchDragging = false;
  
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      if (sizeCompScale > 1) {
        isTouchDragging = true;
        touchStartX = e.touches[0].clientX;
        touchStartOffset = sizeCompOffsetX;
        mouseMoved = false;
      }
    }
  }, { passive: true });
  
  canvas.addEventListener('touchmove', e => {
    if (isTouchDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchStartX;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      sizeCompOffsetX = touchStartOffset + dx * scaleX;
      mouseMoved = true;
      draw();
    }
  }, { passive: true });
  
  canvas.addEventListener('touchend', e => {
    if (!mouseMoved && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const mx = (touch.clientX - rect.left) * scaleX;
      const my = (touch.clientY - rect.top) * scaleY;
      
      let foundIdx = null;
      sizeCompPositions.forEach((p, i) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        if (Math.sqrt(dx * dx + dy * dy) < p.r + 8) foundIdx = i;
      });
      
      if (foundIdx !== null) {
        handleSizeCompClick(foundIdx);
      }
    }
    isTouchDragging = false;
  });
  
  canvas.addEventListener('mouseleave', () => {
    if (isDragging) return;
    sizeCompHovered = null;
    canvas.style.cursor = sizeCompScale > 1 ? 'grab' : 'default';
    draw();
    updateSizeCompInfoPanel(null);
  });
  
  canvas.addEventListener('click', e => {
    if (mouseMoved) {
      mouseMoved = false;
      return;
    }
    if (sizeCompHovered !== null) {
      handleSizeCompClick(sizeCompHovered);
    }
  });
  
  function handleSizeCompClick(idx) {
    const obj = sizeCompPositions[idx].obj;
    const planet = PLANETS.find(x => x.name === obj.name);
    if (planet) {
      openPlanetModal(planet);
      return;
    }
    if (obj.name === 'Луна') {
      openObjectModal('Луна');
      return;
    }
    if (obj.name === 'Солнце') {
      openSunModal();
      return;
    }
    if (obj.name === 'Плутон') {
      openObjectModal('Плутон');
      return;
    }
  }
  
  function updateSizeCompInfoPanel(obj) {
    const infoEl = document.getElementById('sizeCompInfo');
    if (!infoEl) return;
    
    if (!obj) {
      infoEl.innerHTML = `
        <div class="info-panel-placeholder">
          <div class="info-panel-icon">👆</div>
          <div class="info-panel-text">Наведите на объект</div>
          <div class="info-panel-hint">Информация появится здесь</div>
        </div>
      `;
      infoEl.classList.remove('has-content');
      return;
    }
    
    const planet = PLANETS.find(x => x.name === obj.name);
    const earthRatio = (obj.diameter / 12742).toFixed(2);
    
    let emoji = '';
    if (planet) emoji = planet.emoji;
    else if (obj.name === 'Луна') emoji = '🌙';
    else if (obj.name === 'Солнце') emoji = '☀️';
    else if (obj.name === 'Плутон') emoji = '♇';
    
    let extraInfo = '';
    if (planet) {
      extraInfo = `<div class="info-panel-desc">${planet.desc}</div>`;
    } else if (obj.name === 'Луна') {
      extraInfo = `<div class="info-panel-desc">Единственный естественный спутник Земли. Удаляется на 3.8 см в год.</div>`;
    } else if (obj.name === 'Солнце') {
      extraInfo = `<div class="info-panel-desc">Жёлтый карлик. Занимает 99.86% массы Солнечной системы.</div>`;
    } else if (obj.name === 'Плутон') {
      extraInfo = `<div class="info-panel-desc">Карликовая планета пояса Койпера. Бывшая 9-я планета.</div>`;
    }
    
    infoEl.innerHTML = `
      <div class="info-panel-header">
        <div class="info-panel-emoji">${emoji}</div>
        <div class="info-panel-title-block">
          <div class="info-panel-name">${obj.name}</div>
          <div class="info-panel-type">${obj.type}</div>
        </div>
      </div>
      ${extraInfo}
      <div class="info-panel-stats">
        <div class="info-panel-stat">
          <span class="info-stat-label">Диаметр</span>
          <span class="info-stat-value">${obj.diameter.toLocaleString('ru')} км</span>
        </div>
        <div class="info-panel-stat">
          <span class="info-stat-label">От Земли</span>
          <span class="info-stat-value">${earthRatio}×</span>
        </div>
        ${planet ? `
          <div class="info-panel-stat">
            <span class="info-stat-label">Тип</span>
            <span class="info-stat-value">${planet.tag}</span>
          </div>
          <div class="info-panel-stat">
            <span class="info-stat-label">Гравитация</span>
            <span class="info-stat-value">${planet.gravity} м/с²</span>
          </div>
        ` : ''}
      </div>
      <div class="info-panel-action">Клик — открыть карточку →</div>
    `;
    infoEl.classList.add('has-content');
  }
  
  updateSizeCompInfoPanel(null);
}

function openObjectModal(name) {
  const modal = document.getElementById('planetModal');
  if (!modal) return;
  
  const info = {
    'Луна': {
      desc: 'Единственный естественный спутник Земли.',
      fact: 'Луна удаляется от Земли на 3.8 см каждый год.',
      stats: [
        { label: 'Тип', value: 'Естественный спутник' },
        { label: 'Диаметр', value: '3 475 км' },
        { label: 'Масса', value: '7.35 × 10²² кг' },
        { label: 'Расстояние', value: '384 400 км' }
      ]
    },
    'Плутон': {
      desc: 'Карликовая планета, крупнейший объект пояса Койпера.',
      fact: 'На Плутоне есть ледяные горы до 3.5 км и подлёдный океан.',
      stats: [
        { label: 'Тип', value: 'Карликовая планета' },
        { label: 'Диаметр', value: '2 376 км' },
        { label: 'Масса', value: '1.31 × 10²² кг' },
        { label: 'Расстояние', value: '5.9 млрд км' }
      ]
    }
  };
  
  const data = info[name];
  if (!data) return;
  
  const obj = SIZE_COMPARISON.find(o => o.name === name);
  
  const imgEl = document.getElementById('modalImage');
  imgEl.style.display = 'block';
  imgEl.src = obj ? obj.img : '';
  imgEl.onerror = function() { 
    this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
        <defs>
          <radialGradient id="plutoGrad" cx="35%" cy="35%">
            <stop offset="0%" stop-color="#D4A574"/>
            <stop offset="40%" stop-color="#A89C8E"/>
            <stop offset="100%" stop-color="#5C4F3F"/>
          </radialGradient>
        </defs>
        <rect width="800" height="400" fill="#0a0a1a"/>
        <circle cx="400" cy="200" r="140" fill="url(#plutoGrad)"/>
        <ellipse cx="350" cy="220" rx="45" ry="28" fill="#E5C896" opacity="0.55"/>
        <text x="50%" y="380" text-anchor="middle" font-size="22" fill="#A9A6B8" font-family="sans-serif">PLUTO</text>
      </svg>`
    ); 
  };
  
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalDesc').textContent = data.desc;
  document.getElementById('modalFact').textContent = data.fact;
  document.getElementById('modalStats').innerHTML = data.stats.map(s => 
    `<div class="modal-stat"><span>${s.label}</span><strong>${s.value}</strong></div>`
  ).join('');
  
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ═══════════════════════════════════════════════════
// ВКЛАДКИ
// ═══════════════════════════════════════════════════
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      const container = btn.closest('.tabs-container') || document;
      
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      container.querySelectorAll('.tab-content').forEach(c => {
        c.classList.toggle('active', c.dataset.tab === targetTab);
      });
      
      if (targetTab === 'size-comparison') {
        setTimeout(initSizeComparison, 100);
      }
    });
  });
}

// ═══════════════════════════════════════════════════
// СЛУЧАЙНЫЙ ФАКТ
// ═══════════════════════════════════════════════════
let factsShownSet = new Set();

function initRandomFact() {
  const btn = document.getElementById('navFactBtn');
  if (!btn) return;
  btn.addEventListener('click', () => showRandomFact());
}

function showRandomFact() {
  let idx;
  if (factsShownSet.size >= RANDOM_FACTS.length) factsShownSet.clear();
  let attempts = 0;
  do {
    idx = Math.floor(Math.random() * RANDOM_FACTS.length);
    attempts++;
  } while (factsShownSet.has(idx) && attempts < 50);
  
  factsShownSet.add(idx);
  openRandomFactModal(RANDOM_FACTS[idx], factsShownSet.size, RANDOM_FACTS.length);
}

function openRandomFactModal(fact, count, total) {
  let modal = document.getElementById('randomFactModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'randomFactModal';
    modal.className = 'modal align-top';
    modal.innerHTML = `
      <div class="random-fact-modal-content">
        <button class="modal-close" type="button">×</button>
        <div class="random-fact-label">✨ СЛУЧАЙНЫЙ ФАКТ О КОСМОСЕ</div>
        <div class="random-fact-text" id="randomFactText"></div>
        <div class="random-fact-actions">
          <button class="random-fact-btn primary" id="nextFactBtn" type="button">🎲 ЕЩЁ ФАКТ</button>
          <button class="random-fact-btn secondary" id="shareFactBtn" type="button">📋 СКОПИРОВАТЬ</button>
        </div>
        <div class="random-fact-counter" id="randomFactCounter"></div>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('nextFactBtn').addEventListener('click', e => {
      e.stopPropagation();
      showRandomFact();
    });
    
    document.getElementById('shareFactBtn').addEventListener('click', e => {
      e.stopPropagation();
      const text = document.getElementById('randomFactText').textContent;
      const btn = e.currentTarget;
      const orig = btn.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = '✓ СКОПИРОВАНО';
          setTimeout(() => btn.textContent = orig, 1500);
        }).catch(() => {});
      }
    });
    
    modal.querySelector('.modal-close').addEventListener('click', e => {
      e.stopPropagation();
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
  
  const textEl = document.getElementById('randomFactText');
  const counterEl = document.getElementById('randomFactCounter');
  
  textEl.style.animation = 'none';
  void textEl.offsetWidth;
  
  setTimeout(() => {
    textEl.textContent = fact.text;
    textEl.style.animation = 'fadeIn 0.4s';
    counterEl.textContent = `Просмотрено фактов: ${count} / ${total}`;
  }, 50);
  
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ═══════════════════════════════════════════════════
// СОЛНЕЧНАЯ СИСТЕМА (адаптивная)
// ═══════════════════════════════════════════════════
function initSolarSystem() {
  const canvas = document.getElementById('solarCanvas');
  const container = document.getElementById('solar-canvas-wrap');
  if (!canvas || !container) return;
  const ctx = canvas.getContext('2d');
  
  let W, H, cx, cy;
  let orbitScale = 1;
  let planetScale = 1;
  let speed = 1, paused = false;
  const angles = PLANETS.map(() => Math.random() * Math.PI * 2);
  let selected = null;
  let positions = [];
  
  function calculateSize() {
    const containerWidth = container.clientWidth;
    const containerHeight = Math.min(window.innerHeight * 0.7, 750);
    
    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 600;
    const isDesktop = window.innerWidth > 1024;
    const isWideScreen = window.innerWidth >= 1920;
    
    let availableWidth, aspectRatio;
    
    if (isMobile) {
      availableWidth = Math.min(containerWidth - 20, 500);
      aspectRatio = 1.2;
      planetScale = 0.7;
    } else if (isTablet) {
      availableWidth = Math.min(containerWidth - 30, 800);
      aspectRatio = 1.3;
      planetScale = 0.85;
    } else if (isDesktop) {
      availableWidth = Math.min(containerWidth - 40, 1200);
      aspectRatio = 1.4;
      planetScale = 1;
    } else if (isWideScreen) {
      availableWidth = Math.min(containerWidth - 40, 1600);
      aspectRatio = 1.4;
      planetScale = 1.1;
    }
    
    W = availableWidth;
    H = Math.min(W * aspectRatio, containerHeight);
    
    canvas.width = W;
    canvas.height = H;
    
    cx = W / 2;
    cy = H / 2;
    
    const maxOrbit = Math.max(...PLANETS.map(p => p.dist));
    const maxAllowedDist = (Math.min(W, H) / 2) - 40;
    orbitScale = maxAllowedDist / maxOrbit;
  }
  
  calculateSize();
  
  function drawSun() {
    const sunSize = 22 * planetScale;
    ctx.save();
    ctx.shadowBlur = 60;
    ctx.shadowColor = '#FFD740';
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunSize * 1.3);
    grad.addColorStop(0, '#fff8e1');
    grad.addColorStop(0.3, '#FFD740');
    grad.addColorStop(0.7, '#FF6D00');
    grad.addColorStop(1, 'rgba(255,109,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, sunSize, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
  
  function drawOrbit(distance) {
    const r = distance * orbitScale;
    const ry = r * 0.42;
    
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, ry, 0, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(79,195,247,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  function drawPlanet(p, angle, idx) {
    const r = p.dist * orbitScale;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r * 0.42;
    const planetRadius = Math.max(2, p.radius * planetScale);
    
    if (p.hasRing) {
      ctx.save();
      const ringRX = planetRadius * 2.2;
      const ringRY = planetRadius * 0.6;
      ctx.beginPath();
      ctx.ellipse(x, y, ringRX, ringRY, -0.2, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(255,241,118,0.6)';
      ctx.lineWidth = Math.max(1, planetRadius * 0.15);
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.save();
    if (idx === selected) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = p.glow;
    }
    
    const gr = ctx.createRadialGradient(
      x - planetRadius*0.3, y - planetRadius*0.3, 0,
      x, y, planetRadius
    );
    gr.addColorStop(0, '#fff');
    gr.addColorStop(0.4, p.color);
    gr.addColorStop(1, p.glow || p.color);
    
    ctx.beginPath();
    ctx.arc(x, y, planetRadius, 0, Math.PI*2);
    ctx.fillStyle = gr;
    ctx.fill();
    
    if (idx === selected) {
      ctx.strokeStyle = p.glow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, planetRadius + 4, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();
    
    return {x, y};
  }
  
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, W, H);
    
    PLANETS.forEach(p => drawOrbit(p.dist));
    drawSun();
    
    positions = [];
    PLANETS.forEach((p, i) => {
      if (!paused) angles[i] += p.speed * 0.0003 * speed;
      positions.push(drawPlanet(p, angles[i], i));
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
  
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    
    const sunRadius = 22 * planetScale;
    const dxSun = mx - cx, dySun = my - cy;
    if (Math.sqrt(dxSun*dxSun + dySun*dySun) < sunRadius + 10) {
      const info = document.getElementById('planetInfo');
      if (info) {
        info.innerHTML = `
          <h3>${SUN.emoji} ${SUN.name}</h3>
          <p style="margin-bottom:.6rem">${SUN.desc}</p>
          <p style="color:var(--accent-sand);font-size:.9rem;margin-bottom:.4rem"><strong>Факт:</strong> ${SUN.fact}</p>
          <p style="color:var(--text-dim);font-size:.88rem"><strong>Масса:</strong> ${SUN.mass}</p>
          <p style="color:var(--text-dim);font-size:.88rem"><strong>Температура:</strong> ${SUN.temp}</p>
          <p style="color:var(--text-dim);font-size:.88rem"><strong>Возраст:</strong> ${SUN.age}</p>
        `;
      }
      return;
    }
    
    let hit = null;
    positions.forEach((pos, i) => {
      const planetR = Math.max(3, PLANETS[i].radius * planetScale);
      const dx = mx - pos.x, dy = my - pos.y;
      if (Math.sqrt(dx*dx + dy*dy) < planetR + 6) hit = i;
    });
    selected = hit;
    if (hit !== null) {
      const p = PLANETS[hit];
      const info = document.getElementById('planetInfo');
      if (info) {
        info.innerHTML = `
          <h3>${p.emoji} ${p.name}</h3>
          <p style="margin-bottom:.6rem">${p.desc}</p>
          <p style="color:var(--accent-sand);font-size:.9rem"><strong>Факт:</strong> ${p.fact}</p>
        `;
      }
    }
  });
  
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    
    const sunRadius = 22 * planetScale;
    const dxSun = mx - cx, dySun = my - cy;
    if (Math.sqrt(dxSun*dxSun + dySun*dySun) < sunRadius + 10) {
      canvas.style.cursor = 'pointer';
      return;
    }
    
    let overPlanet = false;
    positions.forEach((pos, i) => {
      const planetR = Math.max(3, PLANETS[i].radius * planetScale);
      const dx = mx - pos.x, dy = my - pos.y;
      if (Math.sqrt(dx*dx + dy*dy) < planetR + 6) overPlanet = true;
    });
    canvas.style.cursor = overPlanet ? 'pointer' : 'default';
  });
  
  const speedRange = document.getElementById('speedRange');
  if (speedRange) {
    speedRange.addEventListener('input', e => {
      speed = parseFloat(e.target.value);
      const v = document.getElementById('speedVal');
      if (v) v.textContent = speed.toFixed(1) + '×';
    });
  }
  
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.textContent = paused ? '▶ СТАРТ' : '❚❚ ПАУЗА';
    });
  }
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      calculateSize();
    }, 250);
  });
}

// ═══════════════════════════════════════════════════
// ТРЕКЕР СПУТНИКОВ — на подобие солнечной системы
// ═══════════════════════════════════════════════════
function initSatTracker() {
  const canvas = document.getElementById('satCanvas');
  const container = document.getElementById('sat-canvas-wrap');
  if (!canvas || !container) return;
  const ctx = canvas.getContext('2d');
  
  let W, H, cx, cy;
  let orbitScale = 1;
  let satScale = 1;
  let speed = 1, paused = false;
  const angles = SATELLITES.map(() => Math.random() * Math.PI * 2);
  let selected = null;
  let positions = [];
  
  function calculateSize() {
    const containerWidth = container.clientWidth;
    const containerHeight = Math.min(window.innerHeight * 0.65, 650);
    
    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 600;
    const isDesktop = window.innerWidth > 1024;
    const isWideScreen = window.innerWidth >= 1920;
    
    let availableWidth, aspectRatio;
    
    if (isMobile) {
      availableWidth = Math.min(containerWidth - 20, 500);
      aspectRatio = 1.0;
      satScale = 0.7;
    } else if (isTablet) {
      availableWidth = Math.min(containerWidth - 30, 700);
      aspectRatio = 1.0;
      satScale = 0.85;
    } else if (isDesktop) {
      availableWidth = Math.min(containerWidth - 40, 900);
      aspectRatio = 1.0;
      satScale = 1;
    } else if (isWideScreen) {
      availableWidth = Math.min(containerWidth - 40, 1200);
      aspectRatio = 1.0;
      satScale = 1.1;
    }
    
    W = availableWidth;
    H = Math.min(W * aspectRatio, containerHeight);
    
    canvas.width = W;
    canvas.height = H;
    
    cx = W / 2;
    cy = H / 2;
    
    const maxOrbit = Math.max(...SATELLITES.map(s => s.orbitRadius));
    const maxAllowedDist = (Math.min(W, H) / 2) - 60;
    orbitScale = maxAllowedDist / maxOrbit;
  }
  
  calculateSize();
  
  const stars = [];
  for (let i = 0; i < 250; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.3,
      phase: Math.random() * Math.PI * 2
    });
  }
  
  function drawStars() {
    stars.forEach(star => {
      const twinkle = Math.sin(Date.now() * 0.001 + star.phase) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      ctx.fillRect(star.x * W, star.y * H, star.size, star.size);
    });
  }
  
  function drawEarth() {
    const earthSize = 35 * satScale;
    
    ctx.save();
    const atmoGrad = ctx.createRadialGradient(cx, cy, earthSize * 0.95, cx, cy, earthSize * 1.5);
    atmoGrad.addColorStop(0, 'rgba(110, 160, 220, 0.5)');
    atmoGrad.addColorStop(0.5, 'rgba(110, 160, 220, 0.15)');
    atmoGrad.addColorStop(1, 'rgba(110, 160, 220, 0)');
    ctx.fillStyle = atmoGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, earthSize * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = 'rgba(110, 127, 163, 0.6)';
    
    const grad = ctx.createRadialGradient(
      cx - earthSize * 0.35, cy - earthSize * 0.35, 0,
      cx, cy, earthSize
    );
    grad.addColorStop(0, '#B8D4F0');
    grad.addColorStop(0.4, '#6E9FD0');
    grad.addColorStop(0.8, '#2A5A8C');
    grad.addColorStop(1, '#0A2A4A');
    
    ctx.beginPath();
    ctx.arc(cx, cy, earthSize, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = 'rgba(70, 130, 70, 0.7)';
    
    ctx.beginPath();
    ctx.ellipse(cx + earthSize * 0.2, cy - earthSize * 0.3, earthSize * 0.35, earthSize * 0.25, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(cx + earthSize * 0.1, cy + earthSize * 0.15, earthSize * 0.2, earthSize * 0.35, 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(cx - earthSize * 0.4, cy - earthSize * 0.1, earthSize * 0.25, earthSize * 0.4, -0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(cx + earthSize * 0.5, cy + earthSize * 0.4, earthSize * 0.15, earthSize * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx - earthSize * 0.2, cy + earthSize * 0.3, earthSize * 0.4, earthSize * 0.1, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + earthSize * 0.3, cy - earthSize * 0.5, earthSize * 0.35, earthSize * 0.08, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(cx - earthSize * 0.35, cy - earthSize * 0.35, earthSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  function drawOrbit(radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(110, 127, 163, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  function drawSatellite(s, angle, idx) {
    const r = s.orbitRadius * orbitScale;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const satSize = Math.max(5, s.satSize * 1.6 * satScale);
    
    if (idx === selected) {
      ctx.save();
      ctx.strokeStyle = 'rgba(79, 195, 247, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    
    ctx.save();
    if (idx === selected) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#4FC3F7';
    }
    
    let color1 = '#fff', color2 = '#4FC3F7', color3 = '#1976D2';
    
    if (s.emoji === '🌙') {
      color2 = '#C9C9C9';
      color3 = '#6A6A6A';
    } else if (s.emoji === '🚀') {
      color2 = '#FFAA66';
      color3 = '#CC5500';
    } else if (s.emoji === '🔭' || s.emoji === '🌌') {
      color2 = '#E5AC52';
      color3 = '#A37520';
    } else if (s.emoji === '📡') {
      color2 = '#90CAF9';
      color3 = '#1976D2';
    } else if (s.emoji === '🌐') {
      color2 = '#7AB8E5';
      color3 = '#4A88B8';
    } else if (s.emoji === '🧊') {
      color2 = '#B8E0FF';
      color3 = '#7AB0E0';
    }
    
    const gr = ctx.createRadialGradient(
      x - satSize * 0.35, y - satSize * 0.35, 0,
      x, y, satSize
    );
    gr.addColorStop(0, color1);
    gr.addColorStop(0.4, color2);
    gr.addColorStop(1, color3);
    
    ctx.beginPath();
    ctx.arc(x, y, satSize, 0, Math.PI * 2);
    ctx.fillStyle = gr;
    ctx.fill();
    
    if (idx === selected) {
      ctx.strokeStyle = '#4FC3F7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, satSize + 4, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, satSize, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    
    if (idx === selected) {
      ctx.fillStyle = '#4FC3F7';
      ctx.font = `bold ${Math.max(11, 12 * satScale)}px Orbitron, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(s.name, x, y - satSize - 12);
    }
    
    return {x, y, size: satSize};
  }
  
  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) / 1.5);
    bgGrad.addColorStop(0, 'rgba(38, 42, 56, 0.4)');
    bgGrad.addColorStop(1, 'rgba(10, 10, 26, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    
    drawStars();
    
    SATELLITES.forEach(s => drawOrbit(s.orbitRadius * orbitScale));
    
    drawEarth();
    
    positions = [];
    SATELLITES.forEach((s, i) => {
      if (!paused) angles[i] += s.orbitSpeed * speed * 0.8;
      positions.push(drawSatellite(s, angles[i], i));
    });
    
    ctx.fillStyle = '#6E7FA3';
    ctx.font = `bold ${Math.max(11, 13 * satScale)}px Orbitron, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText('🌍 ЗЕМЛЯ', 15, 25);
    
    ctx.fillStyle = '#A9A6B8';
    ctx.font = `${Math.max(9, 10 * satScale)}px Orbitron, monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(`${SATELLITES.length} спутников • Клик для информации`, W - 15, 25);
    
    requestAnimationFrame(draw);
  }
  
  draw();
  
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    
    const earthSize = 35 * satScale;
    const dxE = mx - cx, dyE = my - cy;
    if (Math.sqrt(dxE*dxE + dyE*dyE) < earthSize + 8) {
      selected = null;
      const info = document.getElementById('satInfoPanel');
      if (info) {
        info.innerHTML = `
          <h3>🌍 Земля</h3>
          <p>Наша планета — третья от Солнца. Единственное известное место во Вселенной, где существует жизнь. Имеет один естественный спутник — Луну.</p>
          <p style="color:var(--accent-sand);font-size:.9rem;margin-top:.4rem"><strong>Факт:</strong> 71% поверхности покрыто водой. Среднее расстояние от Солнца — 149.6 млн км.</p>
        `;
      }
      return;
    }
    
    let hit = null;
    positions.forEach((pos, i) => {
      const dx = mx - pos.x, dy = my - pos.y;
      if (Math.sqrt(dx*dx + dy*dy) < pos.size + 6) hit = i;
    });
    
    selected = hit;
    if (hit !== null) {
      const s = SATELLITES[hit];
      const info = document.getElementById('satInfoPanel');
      if (info) {
        info.innerHTML = `
          <h3>${s.emoji} ${s.name}</h3>
          <p style="color:var(--text-dim);font-size:.85rem;margin-bottom:.6rem">${s.fullName}</p>
          <p style="margin-bottom:.6rem">${s.desc}</p>
          <div class="modal-stat"><span>Владелец</span><strong>${s.owner}</strong></div>
          <div class="modal-stat"><span>Орбита</span><strong>${s.orbit}</strong></div>
          <div class="modal-stat"><span>Период</span><strong>${s.period}</strong></div>
          <div class="modal-stat"><span>Запущен</span><strong>${s.launched}</strong></div>
          <div class="modal-stat"><span>Скорость</span><strong>${s.speed}</strong></div>
        `;
      }
    } else {
      selected = null;
    }
  });
  
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    
    const earthSize = 35 * satScale;
    const dxE = mx - cx, dyE = my - cy;
    if (Math.sqrt(dxE*dxE + dyE*dyE) < earthSize + 8) {
      canvas.style.cursor = 'pointer';
      return;
    }
    
    let over = false;
    positions.forEach(pos => {
      const dx = mx - pos.x, dy = my - pos.y;
      if (Math.sqrt(dx*dx + dy*dy) < pos.size + 6) over = true;
    });
    canvas.style.cursor = over ? 'pointer' : 'default';
  });
  
  canvas.addEventListener('mouseleave', () => {
    canvas.style.cursor = 'default';
  });
  
  const speedRange = document.getElementById('satSpeedRange');
  if (speedRange) {
    speedRange.addEventListener('input', e => {
      speed = parseFloat(e.target.value);
      const v = document.getElementById('satSpeedVal');
      if (v) v.textContent = speed.toFixed(1) + '×';
    });
  }
  
  const pauseBtn = document.getElementById('satPauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.textContent = paused ? '▶ СТАРТ' : '❚❚ ПАУЗА';
    });
  }
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      calculateSize();
    }, 250);
  });
}

// ═══════════════════════════════════════════════════
// КАРТА СОЛНЕЧНОЙ СИСТЕМЫ
// ═══════════════════════════════════════════════════
let mapScale = 1.5;
let mapOffsetX = 0;
let mapPositions = [];
let mapHovered = null;
let mapDragging = false;
let mapDragStart = 0;
let mapOffsetStart = 0;
let mapMouseMoved = false;
let mapImages = {};

function initMap() {
  const canvas = document.getElementById('mapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const W = canvas.width = 1400;
  const H = canvas.height = 350;

  const auDist = [0.39, 0.72, 1, 1.52, 5.2, 9.58, 19.2, 30.05];
  const maxAU = 31;
  const PAD = 100;
  const mapW = W - PAD * 2;
  
  function auToX(au) {
    return PAD + Math.log(au / 0.3) / Math.log(maxAU / 0.3) * mapW;
  }
  
  const sunX = PAD - 30;
  
  function draw() {
    ctx.clearRect(0, 0, W, 350);
    
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 350);
    bgGrad.addColorStop(0, '#050818');
    bgGrad.addColorStop(0.5, '#0a1025');
    bgGrad.addColorStop(1, '#020410');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, 350);
    
    for (let i = 0; i < 200; i++) {
      const x = ((i * 73) - mapOffsetX * 0.05) % W;
      const y = (i * 47 + i * 13) % 350;
      const finalX = x < 0 ? x + W : x;
      const twinkle = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
      const size = (i % 4 === 0) ? 2 : 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + twinkle * 0.5})`;
      ctx.fillRect(finalX, y, size, size);
    }
    
    ctx.globalAlpha = 0.08;
    const nebulaGrad = ctx.createRadialGradient(W * 0.7, 175, 0, W * 0.7, 175, 200);
    nebulaGrad.addColorStop(0, '#6600ff');
    nebulaGrad.addColorStop(0.5, '#aa00ff');
    nebulaGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(W * 0.5, 0, W * 0.5, 350);
    ctx.globalAlpha = 1;
    
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, 175);
    ctx.lineTo(W - PAD + 10, 175);
    ctx.stroke();
    
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, 175);
    ctx.lineTo(W - PAD + 10, 175);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.save();
    ctx.shadowBlur = 50;
    ctx.shadowColor = '#FFD740';
    
    const sunGrad = ctx.createRadialGradient(sunX, 175, 0, sunX, 175, 60);
    sunGrad.addColorStop(0, '#fff');
    sunGrad.addColorStop(0.3, '#FFD740');
    sunGrad.addColorStop(0.7, '#FF8C00');
    sunGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, 175, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#FF6D00';
    const coronaGrad = ctx.createRadialGradient(sunX, 175, 0, sunX, 175, 25);
    coronaGrad.addColorStop(0, '#fff8e1');
    coronaGrad.addColorStop(1, '#FFD740');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(sunX, 175, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.fillStyle = '#FFD740';
    ctx.font = 'bold 14px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Солнце', sunX, 130);
    ctx.font = '10px Orbitron, monospace';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
    ctx.fillText('ЗВЕЗДА', sunX, 145);
    
    mapPositions = [{name: 'sun', x: sunX, y: 175, r: 40}];
    
    PLANETS.forEach((p, i) => {
      const baseX = auToX(auDist[i]);
      const x = baseX * mapScale + mapOffsetX;
      const r = Math.max(8, p.radius * 1.2 * Math.sqrt(mapScale));
      
      ctx.save();
      ctx.shadowBlur = 25;
      ctx.shadowColor = p.color;
      
      const grad = ctx.createRadialGradient(
        x - r * 0.3, 175 - r * 0.3, 0,
        x, 175, r
      );
      grad.addColorStop(0, '#fff');
      grad.addColorStop(0.4, p.color);
      grad.addColorStop(1, p.glow || p.color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, 175, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      if (mapHovered === p.name) {
        ctx.strokeStyle = '#FFD740';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(x, 175, r + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.save();
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#FFD740';
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, 175, r + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, 175, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.fillStyle = mapHovered === p.name ? '#FFD740' : p.color;
      ctx.font = `${mapHovered === p.name ? 'bold ' : ''}12px Orbitron, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(p.name, x, 175 - r - 25);
      
      ctx.font = '10px Orbitron, monospace';
      ctx.fillStyle = mapHovered === p.name ? '#FFD740' : 'rgba(144, 164, 174, 0.8)';
      ctx.fillText(auDist[i] + ' а.е.', x, 175 + r + 16);
      
      if (mapHovered === p.name) {
        ctx.font = '9px Orbitron, monospace';
        ctx.fillStyle = 'rgba(229, 172, 82, 0.9)';
        ctx.fillText('⌀ ' + p.diameter, x, 175 + r + 28);
      }
      
      mapPositions.push({
        name: p.name, 
        x: x, 
        y: 175, 
        r: r + 6, 
        planet: p
      });
    });
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, 320);
    ctx.lineTo(PAD + 200, 320);
    ctx.stroke();
    
    for (let i = 0; i <= 4; i++) {
      const tickX = PAD + i * 50;
      ctx.beginPath();
      ctx.moveTo(tickX, 315);
      ctx.lineTo(tickX, 325);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '9px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.fillText((i * 5) + ' а.е.', tickX, 340);
    }
    
    ctx.fillStyle = 'rgba(144, 164, 174, 0.6)';
    ctx.font = '11px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('📏 Логарифмический масштаб расстояний (а.е. = 150 млн км)', PAD, 310);
    
    ctx.fillStyle = '#FFD740';
    ctx.font = 'bold 12px Orbitron, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('🔍 ' + mapScale.toFixed(1) + '×', W - 20, 25);
    
    if (mapScale > 1) {
      ctx.fillStyle = '#A9A6B8';
      ctx.font = '10px Orbitron, monospace';
      ctx.fillText('↔ Перетаскивайте для навигации', W - 20, 42);
    }
    
    ctx.fillStyle = 'rgba(229, 172, 82, 0.5)';
    ctx.font = '10px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('🖱️ Кликните на объект', 20, 25);
  }
  
  draw();
  
  canvas.addEventListener('mousedown', e => {
    if (mapScale <= 1) return;
    mapDragging = true;
    mapDragStart = e.clientX;
    mapOffsetStart = mapOffsetX;
    mapMouseMoved = false;
    canvas.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', e => {
    if (mapDragging && mapScale > 1) {
      const dx = e.clientX - mapDragStart;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      mapOffsetX = mapOffsetStart + dx * scaleX;
      mapMouseMoved = true;
      draw();
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (mapDragging) {
      mapDragging = false;
      canvas.style.cursor = mapHovered !== null ? 'pointer' : (mapScale > 1 ? 'grab' : 'default');
    }
  });
  
  canvas.addEventListener('mousemove', e => {
    if (mapDragging) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = 350 / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    
    let found = null;
    mapPositions.forEach(pos => {
      const dx = mx - pos.x, dy = my - pos.y;
      if (Math.sqrt(dx*dx + dy*dy) < pos.r) found = pos.name;
    });
    
    if (found !== mapHovered) {
      mapHovered = found;
      canvas.style.cursor = found !== null ? 'pointer' : (mapScale > 1 ? 'grab' : 'default');
      draw();
    }
  });
  
  canvas.addEventListener('mouseleave', () => {
    if (mapDragging) return;
    mapHovered = null;
    canvas.style.cursor = mapScale > 1 ? 'grab' : 'default';
    draw();
  });
  
  canvas.addEventListener('click', e => {
    if (mapMouseMoved) {
      mapMouseMoved = false;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = 350 / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    
    let hit = null;
    mapPositions.forEach(pos => {
      const dx = mx - pos.x, dy = my - pos.y;
      if (Math.sqrt(dx*dx + dy*dy) < pos.r) hit = pos;
    });
    
    if (hit) {
      const panel = document.getElementById('mapInfoPanel');
      if (hit.name === 'sun') {
        if (panel) {
          panel.innerHTML = `
            <h3>${SUN.emoji} ${SUN.name}</h3>
            <p>${SUN.desc}</p>
            <p style="color:var(--accent-sand);font-size:.9rem;margin-top:.4rem"><strong>Факт:</strong> ${SUN.fact}</p>
            <div class="modal-stat"><span>Масса</span><strong>${SUN.mass}</strong></div>
            <div class="modal-stat"><span>Диаметр</span><strong>${SUN.diameter}</strong></div>
            <div class="modal-stat"><span>Температура</span><strong>${SUN.temp}</strong></div>
            <div class="modal-stat"><span>Тип</span><strong>${SUN.type}</strong></div>
            <div class="modal-stat"><span>Возраст</span><strong>${SUN.age}</strong></div>
          `;
        }
      } else {
        const p = hit.planet;
        if (panel) {
          panel.innerHTML = `
            <h3>${p.emoji} ${p.name}</h3>
            <p>${p.desc}</p>
            <p style="color:var(--accent-sand);font-size:.9rem;margin-top:.4rem"><strong>Факт:</strong> ${p.fact}</p>
            <div class="modal-stat"><span>Тип</span><strong>${p.tag}</strong></div>
            <div class="modal-stat"><span>Диаметр</span><strong>${p.diameter}</strong></div>
            <div class="modal-stat"><span>Расстояние от Солнца</span><strong>${p.distance}</strong></div>
            <div class="modal-stat"><span>Сутки</span><strong>${p.dayLen}</strong></div>
            <div class="modal-stat"><span>Год</span><strong>${p.year}</strong></div>
            <div class="modal-stat"><span>Спутники</span><strong>${p.moons}</strong></div>
          `;
        }
      }
    }
  });
  
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = mapScale * delta;
    mapScale = Math.max(0.5, Math.min(4, newScale));
    if (mapScale <= 1) mapOffsetX = 0;
    canvas.style.cursor = mapScale > 1 ? (mapHovered !== null ? 'pointer' : 'grab') : 'default';
    draw();
  }, { passive: false });
  
  let touchStartX = 0;
  let touchStartOffset = 0;
  let initialPinchDist = 0;
  let initialPinchScale = 1;
  let isTouchDragging = false;
  
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartOffset = mapOffsetX;
      isTouchDragging = mapScale > 1;
      mapMouseMoved = false;
    } else if (e.touches.length === 2) {
      isTouchDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDist = Math.sqrt(dx*dx + dy*dy);
      initialPinchScale = mapScale;
    }
  }, { passive: true });
  
  canvas.addEventListener('touchmove', e => {
    if (e.touches.length === 1 && isTouchDragging) {
      const dx = e.touches[0].clientX - touchStartX;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      mapOffsetX = touchStartOffset + dx * scaleX;
      mapMouseMoved = true;
      draw();
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const scale = (dist / initialPinchDist) * initialPinchScale;
      mapScale = Math.max(0.5, Math.min(4, scale));
      if (mapScale <= 1) mapOffsetX = 0;
      draw();
    }
  }, { passive: true });
  
  canvas.addEventListener('touchend', e => {
    if (!mapMouseMoved && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = 350 / rect.height;
      const mx = (touch.clientX - rect.left) * scaleX;
      const my = (touch.clientY - rect.top) * scaleY;
      
      let hit = null;
      mapPositions.forEach(pos => {
        const dx = mx - pos.x, dy = my - pos.y;
        if (Math.sqrt(dx*dx + dy*dy) < pos.r) hit = pos;
      });
      
      if (hit) {
        const event = new MouseEvent('click', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(event);
      }
    }
    isTouchDragging = false;
  });
}

// ═══════════════════════════════════════════════════
// КВИЗ
// ═══════════════════════════════════════════════════
function initQuiz() {
  const qEl = document.getElementById('quizQ');
  if (!qEl) return;
  const scoreEl = document.getElementById('quizScore');
  const optsEl = document.getElementById('quizOpts');
  const fbEl = document.getElementById('quizFb');
  const nextBtn = document.getElementById('btnNext');
  let cur = 0, score = 0, answered = false;
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);

  function show() {
    if (cur >= shuffled.length) {
      qEl.textContent = 'Квиз завершён!';
      optsEl.innerHTML = '';
      fbEl.textContent = `Итог: ${score} из ${shuffled.length}`;
      fbEl.className = 'quiz-feedback ok';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }
    answered = false;
    const q = shuffled[cur];
    qEl.textContent = (cur+1) + '. ' + q.q;
    fbEl.textContent = '';
    fbEl.className = 'quiz-feedback';
    if (nextBtn) nextBtn.style.display = 'none';
    if (scoreEl) scoreEl.textContent = `Очки: ${score} / ${cur}`;
    optsEl.innerHTML = '';
    q.opts.forEach((o, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = o;
      btn.addEventListener('click', () => handleAnswer(i, q.a, btn));
      optsEl.appendChild(btn);
    });
  }

  function handleAnswer(i, correctIdx, btn) {
    if (answered) return;
    answered = true;
    const buttons = optsEl.querySelectorAll('.quiz-opt');
    buttons.forEach(b => b.disabled = true);
    if (i === correctIdx) {
      btn.classList.add('correct');
      fbEl.textContent = '✓ Правильно!';
      fbEl.className = 'quiz-feedback ok';
      score++;
    } else {
      btn.classList.add('wrong');
      buttons[correctIdx].classList.add('correct');
      fbEl.textContent = '✗ Неверно.';
      fbEl.className = 'quiz-feedback fail';
    }
    if (scoreEl) scoreEl.textContent = `Очки: ${score} / ${cur+1}`;
    if (nextBtn) nextBtn.style.display = 'inline-block';
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { cur++; show(); });
  show();
}

// ═══════════════════════════════════════════════════
// DODGE
// ═══════════════════════════════════════════════════
function initDodge() {
  const canvas = document.getElementById('dodgeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 288, H = 220;
  let running = false, score = 0, lives = 3;
  let ship = {x: W/2, y: H-30};
  let asteroids = [], frame = 0, animId = null, scoreInt = 0;
  const scoreEl = document.getElementById('dodgeScore');
  const livesEl = document.getElementById('dodgeLives');
  const btn = document.getElementById('btnDodge');

  function reset() {
    score = 0; scoreInt = 0; lives = 3;
    asteroids = []; frame = 0;
    ship = {x: W/2, y: H-30};
    updateHUD();
  }
  function updateHUD() {
    if (scoreEl) scoreEl.textContent = scoreInt;
    if (livesEl) livesEl.textContent = '❤'.repeat(Math.max(0, lives));
  }
  function loop() {
    if (!running) return;
    frame++;
    ctx.fillStyle = 'rgba(3,0,15,0.85)';
    ctx.fillRect(0, 0, W, H);
    if (frame % 35 === 0) {
      asteroids.push({x: Math.random()*W, y: -10, r: 5+Math.random()*10, speed: 1+Math.random()*2+frame/300});
    }
    score += 0.05;
    const newInt = Math.floor(score);
    if (newInt !== scoreInt) { scoreInt = newInt; if (scoreEl) scoreEl.textContent = scoreInt; }
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      a.y += a.speed;
      ctx.fillStyle = '#EF5350';
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI*2);
      ctx.fill();
      const dx = a.x - ship.x, dy = a.y - ship.y;
      if (Math.sqrt(dx*dx+dy*dy) < a.r + 10) {
        asteroids.splice(i, 1); lives--; updateHUD();
        if (lives <= 0) { endGame(); return; }
      } else if (a.y > H + 20) asteroids.splice(i, 1);
    }
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.fillStyle = '#4FC3F7';
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(10, 8); ctx.lineTo(-10, 8); ctx.closePath();
    ctx.fill();
    ctx.restore();
    animId = requestAnimationFrame(loop);
  }
  function endGame() {
    running = false; cancelAnimationFrame(animId);
    ctx.fillStyle = 'rgba(3,0,15,0.85)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = 'bold 18px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#EF5350';
    ctx.fillText('GAME OVER', W/2, H/2 - 10);
    ctx.fillStyle = '#4FC3F7';
    ctx.fillText('Счёт: ' + scoreInt, W/2, H/2 + 14);
    if (btn) btn.textContent = 'СНОВА';
  }
  function drawIdle() {
    ctx.fillStyle = 'rgba(3,0,15,1)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = '12px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4FC3F7';
    ctx.fillText('Нажми СТАРТ', W/2, H/2 - 6);
  }
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    ship.x = (e.clientX - r.left) * (W/r.width);
  });
  if (btn) {
    btn.addEventListener('click', () => {
      if (running) { running = false; cancelAnimationFrame(animId); btn.textContent = 'СТАРТ'; drawIdle(); }
      else { reset(); running = true; btn.textContent = 'СТОП'; loop(); }
    });
  }
  drawIdle();
}

// ═══════════════════════════════════════════════════
// ПАМЯТЬ
// ═══════════════════════════════════════════════════
function initMemory() {
  const grid = document.getElementById('memGrid');
  if (!grid) return;
  const movesEl = document.getElementById('memMoves');
  const pairsEl = document.getElementById('memPairs');
  const btn = document.getElementById('btnMem');
  const emojis = ['🌍', '🌙', '☄', '🚀', '⭐', '🌌', '☀', '🪐'];
  let cards = [], flipped = [], matched = 0, moves = 0, lock = false;

  function initCards() {
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5).map((e, i) => ({emoji: e, isFlipped: false, isMatched: false}));
    matched = 0; moves = 0; flipped = [];
    if (movesEl) movesEl.textContent = '0';
    if (pairsEl) pairsEl.textContent = '0';
    render();
  }
  function render() {
    grid.innerHTML = '';
    cards.forEach((c, i) => {
      const el = document.createElement('div');
      el.className = 'mem-card' + (c.isFlipped || c.isMatched ? ' flipped' : '') + (c.isMatched ? ' matched' : '');
      el.innerHTML = `<span class="face">${c.emoji}</span><span class="back">✦</span>`;
      el.addEventListener('click', () => flip(i));
      grid.appendChild(el);
    });
  }
  function flip(i) {
    if (lock || cards[i].isMatched || cards[i].isFlipped) return;
    cards[i].isFlipped = true;
    flipped.push(i);
    render();
    if (flipped.length === 2) {
      moves++;
      if (movesEl) movesEl.textContent = moves;
      lock = true;
      setTimeout(() => {
        const [a, b] = flipped;
        if (cards[a].emoji === cards[b].emoji) {
          cards[a].isMatched = cards[b].isMatched = true;
          matched++;
          if (pairsEl) pairsEl.textContent = matched;
        } else {
          cards[a].isFlipped = cards[b].isFlipped = false;
        }
        flipped = []; lock = false; render();
      }, 700);
    }
  }
  if (btn) btn.addEventListener('click', initCards);
  initCards();
}

// ═══════════════════════════════════════════════════
// КАЛЬКУЛЯТОР
// ═══════════════════════════════════════════════════
function initCalculator() {
  const input = document.getElementById('weightInput');
  if (!input) return;
  const resultsEl = document.getElementById('calcResults');
  function calculate() {
    const w = parseFloat(input.value);
    if (!resultsEl) return;
    if (isNaN(w) || w <= 0) {
      resultsEl.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:1rem">Введите ваш вес</p>';
      return;
    }
    resultsEl.innerHTML = `
      <div class="calc-sun calc-row">
        <span class="calc-emoji">${SUN.emoji}</span>
        <span class="calc-name">${SUN.name}</span>
        <span class="calc-weight">${(w * 27.96).toFixed(1)} кг</span>
      </div>
    ` + PLANETS.map(p => `
      <div class="calc-row">
        <span class="calc-emoji">${p.emoji}</span>
        <span class="calc-name">${p.name}</span>
        <span class="calc-weight">${(w * p.gravity / 9.81).toFixed(1)} кг</span>
      </div>
    `).join('');
  }
  input.addEventListener('input', calculate);
  calculate();
}

// ═══════════════════════════════════════════════════
// СИМУЛЯТОР АККРЕЦИИ
// ═══════════════════════════════════════════════════
function initBHSimulator() {
  const canvas = document.getElementById('bhCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 600;
  const H = canvas.height = 400;
  const cx = W/2, cy = H/2;
  const BH_RADIUS = 30;
  const SPAWN_RADIUS = 180;
  const PARTICLE_COUNT = 200;
  const G = 0.8;

  let speed = 1, paused = false, frameCount = 0;

  function spawnParticle(p) {
    const angle = Math.random() * Math.PI * 2;
    const dist = SPAWN_RADIUS + Math.random() * 50;
    const orbitSpeed = Math.sqrt(G * BH_RADIUS) * 0.5;
    p.x = cx + Math.cos(angle) * dist;
    p.y = cy + Math.sin(angle) * dist;
    p.vx = -Math.sin(angle) * orbitSpeed;
    p.vy = Math.cos(angle) * orbitSpeed;
    p.life = 1;
    p.prevX = p.x;
    p.prevY = p.y;
  }

  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = {};
    spawnParticle(p);
    particles.push(p);
  }

  function draw() {
    if (!paused) frameCount++;
    ctx.fillStyle = 'rgba(10, 5, 20, 0.25)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect((i * 137) % W, (i * 251) % H, 1, 1);
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(frameCount * 0.002 * (paused ? 1 : speed));
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, 60 + i * 25, 20 + i * 8, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, ${150 + i * 20}, ${50 + i * 30}, ${0.5 - i * 0.1})`;
      ctx.lineWidth = 6;
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy, BH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    if (!paused) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = cx - p.x, dy = cy - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const safeDist = Math.max(dist, 10);
        const force = (G * BH_RADIUS * 200) / (safeDist * safeDist);
        p.vx += (dx / dist) * force * speed;
        p.vy += (dy / dist) * force * speed;
        p.vx *= 0.995; p.vy *= 0.995;
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        p.life -= 0.002 * speed;
        if (dist < BH_RADIUS || dist > SPAWN_RADIUS + 100 || p.life <= 0) {
          spawnParticle(p);
          continue;
        }
        if (p.prevX !== undefined) {
          ctx.beginPath();
          ctx.moveTo(p.prevX, p.prevY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(255, ${200 - dist/3}, ${100 - dist/4}, ${p.life * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(255, ${220 - dist/4}, ${150 - dist/3}, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 + (1 - dist/200), 0, Math.PI * 2);
        ctx.fill();
        p.prevX = p.x; p.prevY = p.y;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  const speedRange = document.getElementById('bhSpeedRange');
  if (speedRange) {
    speedRange.addEventListener('input', e => {
      speed = parseFloat(e.target.value);
      const v = document.getElementById('bhSpeedVal');
      if (v) v.textContent = speed.toFixed(1) + '×';
    });
  }
  const pauseBtn = document.getElementById('bhPauseBtn');
  if (pauseBtn) pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? '▶ СТАРТ' : '❚❚ ПАУЗА';
  });
  const resetBtn = document.getElementById('bhResetBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    particles.forEach(spawnParticle);
  });
}

// ═══════════════════════════════════════════════════
// АККОРДЕОН ЧЁРНЫХ ДЫР
// ═══════════════════════════════════════════════════
function initBHAccordion() {
  const acc = document.getElementById('bhAccordion');
  if (!acc) return;
  acc.innerHTML = BH_TYPES.map(t => `
    <div class="bh-acc-item">
      <div class="bh-acc-head"><span>${t.title}</span><span class="arrow">▼</span></div>
      <div class="bh-acc-body">${t.body}</div>
    </div>
  `).join('');
  acc.querySelectorAll('.bh-acc-head').forEach(head => {
    head.addEventListener('click', () => head.parentElement.classList.toggle('open'));
  });
}

// ═══════════════════════════════════════════════════
// СКРОЛЛ НАВЕРХ
// ═══════════════════════════════════════════════════
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
  });
  btn.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
}

// ═══════════════════════════════════════════════════
// БУРГЕР-МЕНЮ
// ═══════════════════════════════════════════════════
function initBurgerMenu() {
  const burger = document.getElementById('burgerMenu');
  const navLinks = document.getElementById('navLinks');
  
  if (!burger || !navLinks) {
    return;
  }
  
  const newBurger = burger.cloneNode(true);
  burger.parentNode.replaceChild(newBurger, burger);
  const freshBurger = document.getElementById('burgerMenu');
  
  freshBurger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 900) {
        freshBurger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  document.addEventListener('click', function(e) {
    if (!freshBurger.contains(e.target) && 
        !navLinks.contains(e.target) && 
        window.innerWidth <= 900 &&
        navLinks.classList.contains('active')) {
      freshBurger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      freshBurger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
      freshBurger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ═══════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  createShootingStars();
  setActiveNav();
  initBurgerMenu();
  initSolarSystem();
  initMap();
  initSatTracker();
  initQuiz();
  initDodge();
  initMemory();
  initCalculator();
  initBHSimulator();
  initBHAccordion();
  initScrollTop();
  initRandomFact();
  initTabs();
  initGalaxyFilters();
  renderPlanets();
  renderSatellites();
  renderBlackHoles();
  renderFacts();
  renderGalaxies();
  
  const sunModalBtn = document.getElementById('sunModalBtn');
  if (sunModalBtn) {
    sunModalBtn.addEventListener('click', openSunModal);
  }
  
  const scrollToMapBtn = document.getElementById('scrollToMapBtn');
  if (scrollToMapBtn) {
    scrollToMapBtn.addEventListener('click', scrollToMap);
  }
  
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      closeAllModals();
    });
  });
  
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeAllModals();
    });
  });
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });
});
