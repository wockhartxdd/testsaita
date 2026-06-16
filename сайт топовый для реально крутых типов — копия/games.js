// ═══════════════════════════════════════════════════
// COSMOS GAMES — 4 полностью рабочих игры
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ═══════════════════════════════════════════════════
window.tetrisState = {
  running: false,
  currentPiece: null,
  board: [],
  score: 0,
  level: 1,
  lines: 0,
  COLS: 10,
  ROWS: 20,
  BLOCK_SIZE: 20,
  nextPiece: null,
  dropInterval: 800,
  dropCounter: 0,
  lastTime: 0,
  animationId: null,
  pieces: [
    { shape: [[1,1,1,1]], color: '#00ffff', glow: '#00ffff', name: 'I' },
    { shape: [[1,1],[1,1]], color: '#ffff00', glow: '#ffff00', name: 'O' },
    { shape: [[0,1,0],[1,1,1]], color: '#ff00ff', glow: '#ff00ff', name: 'T' },
    { shape: [[0,1,1],[1,1,0]], color: '#00ff88', glow: '#00ff88', name: 'S' },
    { shape: [[1,1,0],[0,1,1]], color: '#ff0088', glow: '#ff0088', name: 'Z' },
    { shape: [[1,0,0],[1,1,1]], color: '#0088ff', glow: '#0088ff', name: 'J' },
    { shape: [[0,0,1],[1,1,1]], color: '#ff8800', glow: '#ff8800', name: 'L' }
  ]
};

window.snakeState = {
  running: false,
  canvas: null,
  ctx: null,
  snake: [],
  food: null,
  direction: 'right',
  nextDirection: 'right',
  score: 0,
  best: 0,
  speed: 150,
  lastTime: 0,
  animationId: null,
  cellSize: 18,
  cols: 16,
  rows: 16,
  particles: []
};

window.game2048State = {
  board: [],
  size: 4,
  score: 0,
  planets: ['🌑', '🌕', '🌍', '🪐', '🌟', '⭐', '🌌', '☀️', '💫', '✨', '🌞']
};

window.clickerState = {
  energy: 0,
  perClick: 1,
  autoPerSecond: 0,
  clickCost: 10,
  autoCost: 50,
  interval: null,
  emojis: ['🌍', '🌑', '♃', '♄', '♅', '♆', '☀️', '⭐', '🌌', '🪐'],
  emojiIndex: 0
};

// ═══════════════════════════════════════════════════
// 1. ТЕТРИС (ИСПРАВЛЕН - блоки не улетают)
// ═══════════════════════════════════════════════════
function tetrisCollide(piece, offsetX, offsetY) {
  const state = window.tetrisState;
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        if (newX < 0 || newX >= state.COLS || newY >= state.ROWS) return true;
        if (newY >= 0 && state.board[newY][newX]) return true;
      }
    }
  }
  return false;
}

function tetrisMergePiece() {
  const state = window.tetrisState;
  const piece = state.currentPiece;
  if (!piece) return;
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.y + y;
        if (boardY >= 0 && boardY < state.ROWS) {
          state.board[boardY][piece.x + x] = { color: piece.color, glow: piece.glow };
        }
      }
    }
  }
}

function tetrisRotatePiece() {
  const state = window.tetrisState;
  const piece = state.currentPiece;
  if (!piece) return;
  const rotated = piece.shape[0].map((_, i) => 
    piece.shape.map(row => row[i]).reverse()
  );
  const oldShape = piece.shape;
  piece.shape = rotated;
  if (tetrisCollide(piece, 0, 0)) piece.shape = oldShape;
}

function tetrisDrop() {
  const state = window.tetrisState;
  if (!state.currentPiece || !state.running) return;
  state.currentPiece.y++;
  if (tetrisCollide(state.currentPiece, 0, 0)) {
    state.currentPiece.y--;
    tetrisMergePiece();
    tetrisClearLines();
    state.currentPiece = state.nextPiece;
    state.nextPiece = tetrisGetRandomPiece();
    if (tetrisCollide(state.currentPiece, 0, 0)) {
      tetrisGameOver();
    }
  }
  state.dropCounter = 0;
}

function tetrisClearLines() {
  const state = window.tetrisState;
  let cleared = 0;
  for (let y = state.ROWS - 1; y >= 0; y--) {
    if (state.board[y].every(cell => cell !== null)) {
      state.board.splice(y, 1);
      state.board.unshift(Array(state.COLS).fill(null));
      cleared++;
      y++;
    }
  }
  if (cleared > 0) {
    const points = [0, 100, 300, 500, 800][cleared] * state.level;
    state.score += points;
    state.lines += cleared;
    state.level = Math.floor(state.lines / 10) + 1;
    state.dropInterval = Math.max(100, 800 - (state.level - 1) * 50);
    
    const scoreEl = document.getElementById('tetrisScore');
    const levelEl = document.getElementById('tetrisLevel');
    const linesEl = document.getElementById('tetrisLines');
    if (scoreEl) scoreEl.textContent = state.score;
    if (levelEl) levelEl.textContent = state.level;
    if (linesEl) linesEl.textContent = state.lines;
  }
}

function tetrisGetRandomPiece() {
  const state = window.tetrisState;
  const piece = state.pieces[Math.floor(Math.random() * state.pieces.length)];
  return {
    shape: piece.shape.map(row => [...row]),
    color: piece.color,
    glow: piece.glow,
    name: piece.name,
    x: Math.floor(state.COLS / 2) - Math.floor(piece.shape[0].length / 2),
    y: 0
  };
}

function tetrisDrawBlock(ctx, x, y, color, glow, size) {
  ctx.shadowBlur = 12;
  ctx.shadowColor = glow;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  
  ctx.shadowBlur = 0;
  const innerGrad = ctx.createRadialGradient(
    x + size/2, y + size/2, 0,
    x + size/2, y + size/2, size/2
  );
  innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
  innerGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
  innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  ctx.fillStyle = innerGrad;
  ctx.fillRect(x, y, size, size);
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
}

function tetrisDrawStarfield(ctx, width, height) {
  for (let i = 0; i < 40; i++) {
    const x = ((i * 73) + i * 17) % width;
    const y = (i * 47 + i * 13) % height;
    const twinkle = Math.sin(Date.now() * 0.003 + i) * 0.5 + 0.5;
    const size = (i % 3) === 0 ? 2 : 1;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.5})`;
    ctx.fillRect(x, y, size, size);
  }
}

function tetrisDrawNebula(ctx, width, height) {
  ctx.globalAlpha = 0.12;
  const g1 = ctx.createRadialGradient(width * 0.3, height * 0.3, 0, width * 0.3, height * 0.3, 150);
  g1.addColorStop(0, '#ff00ff');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, width, height);
  
  const g2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 0, width * 0.8, height * 0.7, 120);
  g2.addColorStop(0, '#00aaff');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(width * 0.5, height * 0.5, width * 0.5, height * 0.5);
  ctx.globalAlpha = 1;
}

function tetrisDrawBoard(ctx, canvas) {
  const state = window.tetrisState;
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#050818');
  bgGrad.addColorStop(1, '#000208');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  tetrisDrawNebula(ctx, canvas.width, canvas.height);
  tetrisDrawStarfield(ctx, canvas.width, canvas.height);
  
  ctx.strokeStyle = 'rgba(100, 150, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= state.COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * state.BLOCK_SIZE, 0);
    ctx.lineTo(x * state.BLOCK_SIZE, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= state.ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * state.BLOCK_SIZE);
    ctx.lineTo(canvas.width, y * state.BLOCK_SIZE);
    ctx.stroke();
  }
  
  for (let y = 0; y < state.ROWS; y++) {
    for (let x = 0; x < state.COLS; x++) {
      if (state.board[y][x]) {
        tetrisDrawBlock(ctx, x * state.BLOCK_SIZE, y * state.BLOCK_SIZE, 
                       state.board[y][x].color, state.board[y][x].glow, state.BLOCK_SIZE);
      }
    }
  }
}

function tetrisDrawPiece(ctx, canvas, piece) {
  const state = window.tetrisState;
  if (!piece) return;
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const drawX = (piece.x + x) * state.BLOCK_SIZE;
        const drawY = (piece.y + y) * state.BLOCK_SIZE;
        tetrisDrawBlock(ctx, drawX, drawY, piece.color, piece.glow, state.BLOCK_SIZE);
      }
    }
  }
}

function tetrisDrawNext(ctx, canvas, piece) {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#050818');
  bgGrad.addColorStop(1, '#000208');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  tetrisDrawStarfield(ctx, canvas.width, canvas.height);
  
  if (!piece) return;
  const size = 18;
  const offsetX = (canvas.width - piece.shape[0].length * size) / 2;
  const offsetY = (canvas.height - piece.shape.length * size) / 2;
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        tetrisDrawBlock(ctx, offsetX + x * size, offsetY + y * size, 
                       piece.color, piece.glow, size);
      }
    }
  }
}

function tetrisGameOver() {
  const state = window.tetrisState;
  state.running = false;
  if (state.animationId) cancelAnimationFrame(state.animationId);
  
  const canvas = document.getElementById('tetrisCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
  }
  
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#E5AC52';
  ctx.fillStyle = '#E5AC52';
  ctx.font = 'bold 26px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
  
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#A9A6B8';
  ctx.font = '13px Orbitron, monospace';
  ctx.fillText('Счёт: ' + state.score, canvas.width / 2, canvas.height / 2 + 10);
  ctx.fillText('Линии: ' + state.lines, canvas.width / 2, canvas.height / 2 + 30);
  
  const btn = document.getElementById('btnTetris');
  if (btn) btn.textContent = 'СНОВА';
}

function tetrisUpdate(time) {
  const state = window.tetrisState;
  if (!state.running) return;
  
  const deltaTime = time - state.lastTime;
  state.lastTime = time;
  state.dropCounter += deltaTime;
  
  if (state.dropCounter > state.dropInterval) {
    tetrisDrop();
  }
  
  const canvas = document.getElementById('tetrisCanvas');
  const nextCanvas = document.getElementById('tetrisNextCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    tetrisDrawBoard(ctx, canvas);
    tetrisDrawPiece(ctx, canvas, state.currentPiece);
  }
  if (nextCanvas) {
    const nextCtx = nextCanvas.getContext('2d');
    tetrisDrawNext(nextCtx, nextCanvas, state.nextPiece);
  }
  
  state.animationId = requestAnimationFrame(tetrisUpdate);
}

function startTetris() {
  const state = window.tetrisState;
  state.board = Array.from({ length: state.ROWS }, () => Array(state.COLS).fill(null));
  state.score = 0;
  state.level = 1;
  state.lines = 0;
  state.dropInterval = 800;
  state.dropCounter = 0;
  state.running = true;
  
  state.currentPiece = tetrisGetRandomPiece();
  state.nextPiece = tetrisGetRandomPiece();
  
  const scoreEl = document.getElementById('tetrisScore');
  const levelEl = document.getElementById('tetrisLevel');
  const linesEl = document.getElementById('tetrisLines');
  if (scoreEl) scoreEl.textContent = '0';
  if (levelEl) levelEl.textContent = '1';
  if (linesEl) linesEl.textContent = '0';
  
  const btn = document.getElementById('btnTetris');
  if (btn) btn.textContent = 'СТОП';
  
  state.lastTime = performance.now();
  state.animationId = requestAnimationFrame(tetrisUpdate);
}

function stopTetris() {
  const state = window.tetrisState;
  state.running = false;
  if (state.animationId) cancelAnimationFrame(state.animationId);
  
  const btn = document.getElementById('btnTetris');
  if (btn) btn.textContent = 'СТАРТ';
  
  // Отрисовка финального состояния
  const canvas = document.getElementById('tetrisCanvas');
  const nextCanvas = document.getElementById('tetrisNextCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    tetrisDrawBoard(ctx, canvas);
    tetrisDrawPiece(ctx, canvas, state.currentPiece);
  }
  if (nextCanvas) {
    const nextCtx = nextCanvas.getContext('2d');
    tetrisDrawNext(nextCtx, nextCanvas, state.nextPiece);
  }
}

function initTetris() {
  const btn = document.getElementById('btnTetris');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    if (window.tetrisState.running) stopTetris();
    else startTetris();
  });
  
  // Начальная отрисовка
  const state = window.tetrisState;
  state.board = Array.from({ length: state.ROWS }, () => Array(state.COLS).fill(null));
  state.nextPiece = tetrisGetRandomPiece();
  
  const canvas = document.getElementById('tetrisCanvas');
  const nextCanvas = document.getElementById('tetrisNextCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    tetrisDrawBoard(ctx, canvas);
  }
  if (nextCanvas) {
    const nextCtx = nextCanvas.getContext('2d');
    tetrisDrawNext(nextCtx, nextCanvas, state.nextPiece);
  }
}

// ═══════════════════════════════════════════════════
// 2. ЗМЕЙКА (ИСПРАВЛЕНА - кнопка СТАРТ работает)
// ═══════════════════════════════════════════════════
function snakeReset() {
  const state = window.snakeState;
  const cx = Math.floor(state.cols / 2);
  const cy = Math.floor(state.rows / 2);
  state.snake = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy }
  ];
  state.direction = 'right';
  state.nextDirection = 'right';
  state.score = 0;
  state.speed = 150;
  state.particles = [];
  
  const scoreEl = document.getElementById('snakeScore');
  if (scoreEl) scoreEl.textContent = '0';
  
  snakeSpawnFood();
}

function snakeSpawnFood() {
  const state = window.snakeState;
  let valid = false;
  let attempts = 0;
  while (!valid && attempts < 100) {
    state.food = {
      x: Math.floor(Math.random() * state.cols),
      y: Math.floor(Math.random() * state.rows),
      type: Math.random() < 0.15 ? 'star' : 'planet'
    };
    valid = !state.snake.some(s => s.x === state.food.x && s.y === state.food.y);
    attempts++;
  }
}

function snakeAddParticle(x, y, color) {
  window.snakeState.particles.push({
    x: x, y: y,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    life: 1,
    color: color
  });
}

function snakeDrawIdle() {
  const state = window.snakeState;
  if (!state.ctx) return;
  const ctx = state.ctx;
  const size = state.cellSize;
  
  const bgGrad = ctx.createRadialGradient(
    state.canvas.width / 2, state.canvas.height / 2, 0,
    state.canvas.width / 2, state.canvas.height / 2, 250
  );
  bgGrad.addColorStop(0, '#0a1a3a');
  bgGrad.addColorStop(1, '#000208');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  
  ctx.globalAlpha = 0.15;
  const g1 = ctx.createRadialGradient(50, 60, 0, 50, 60, 80);
  g1.addColorStop(0, '#ff00ff');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, 160, 160);
  
  const g2 = ctx.createRadialGradient(230, 220, 0, 230, 220, 100);
  g2.addColorStop(0, '#00aaff');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(150, 150, 160, 160);
  ctx.globalAlpha = 1;
  
  for (let i = 0; i < 40; i++) {
    const x = (i * 37) % state.canvas.width;
    const y = (i * 71) % state.canvas.height;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})`;
    ctx.fillRect(x, y, 1, 1);
  }
  
  ctx.shadowBlur = 25;
  ctx.shadowColor = '#00ffff';
  ctx.fillStyle = '#00ffff';
  ctx.font = 'bold 16px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('НАЖМИ СТАРТ', state.canvas.width / 2, state.canvas.height / 2 - 10);
  
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#88BBEE';
  ctx.font = '11px Orbitron, monospace';
  ctx.fillText('WASD или стрелки', state.canvas.width / 2, state.canvas.height / 2 + 15);
  ctx.shadowBlur = 0;
}

function snakeDraw() {
  const state = window.snakeState;
  if (!state.ctx) return;
  const ctx = state.ctx;
  const size = state.cellSize;
  
  const bgGrad = ctx.createRadialGradient(
    state.canvas.width / 2, state.canvas.height / 2, 0,
    state.canvas.width / 2, state.canvas.height / 2, 250
  );
  bgGrad.addColorStop(0, '#0a1a3a');
  bgGrad.addColorStop(1, '#000208');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  
  ctx.globalAlpha = 0.15;
  const g1 = ctx.createRadialGradient(50, 60, 0, 50, 60, 80);
  g1.addColorStop(0, '#ff00ff');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, 160, 160);
  const g2 = ctx.createRadialGradient(230, 220, 0, 230, 220, 100);
  g2.addColorStop(0, '#00aaff');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(150, 150, 160, 160);
  ctx.globalAlpha = 1;
  
  for (let i = 0; i < 40; i++) {
    const x = (i * 37) % state.canvas.width;
    const y = (i * 71) % state.canvas.height;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})`;
    ctx.fillRect(x, y, 1, 1);
  }
  
  ctx.strokeStyle = 'rgba(100, 150, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= state.cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * size, 0);
    ctx.lineTo(x * size, state.canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= state.rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * size);
    ctx.lineTo(state.canvas.width, y * size);
    ctx.stroke();
  }
  
  state.particles.forEach(p => {
    const rgb = p.color.match(/\d+/g);
    if (rgb) {
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${p.life})`;
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
  });
  
  if (state.food) {
    const fx = state.food.x * size + size / 2;
    const fy = state.food.y * size + size / 2;
    const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 1;
    
    if (state.food.type === 'star') {
      ctx.shadowBlur = 20 * pulse;
      ctx.shadowColor = '#FFD700';
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = (i % 2 === 0 ? size / 2 : size / 4) * pulse;
        const x = fx + Math.cos(angle) * r;
        const y = fy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.shadowBlur = 15 * pulse;
      ctx.shadowColor = '#88BBEE';
      const grad = ctx.createRadialGradient(fx - 2, fy - 2, 0, fx, fy, size / 2 * pulse);
      grad.addColorStop(0, '#aaccff');
      grad.addColorStop(0.5, '#4A7BAA');
      grad.addColorStop(1, '#1A3A5A');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(fx, fy, (size / 2 - 2) * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  
  state.snake.forEach((seg, i) => {
    const x = seg.x * size;
    const y = seg.y * size;
    const isHead = i === 0;
    
    if (isHead) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#00ffff';
      const grad = ctx.createRadialGradient(
        x + size/2, y + size/2, 0,
        x + size/2, y + size/2, size
      );
      grad.addColorStop(0, '#00ffff');
      grad.addColorStop(0.6, '#0099cc');
      grad.addColorStop(1, '#003355');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      ctx.shadowBlur = 0;
      
      const eyeDirX = state.direction === 'left' ? -1 : 
                      state.direction === 'right' ? 1 : 0;
      const eyeDirY = state.direction === 'up' ? -1 : 
                      state.direction === 'down' ? 1 : 0;
      
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + size * 0.35 + eyeDirX * 2, y + size * 0.35 + eyeDirY * 2, 2.5, 0, Math.PI * 2);
      ctx.arc(x + size * 0.65 + eyeDirX * 2, y + size * 0.35 + eyeDirY * 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const alpha = Math.max(0.3, 1 - (i / state.snake.length) * 0.7);
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(79, 195, 247, ${alpha})`;
      ctx.fillStyle = `rgba(79, 195, 247, ${alpha})`;
      ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(150, 230, 255, ${alpha * 0.5})`;
      ctx.fillRect(x + 2, y + 2, size - 4, 2);
    }
  });
}

function snakeUpdate(time) {
  const state = window.snakeState;
  if (!state.running) return;
  
  if (time - state.lastTime < state.speed) {
    state.animationId = requestAnimationFrame(snakeUpdate);
    return;
  }
  state.lastTime = time;
  
  state.direction = state.nextDirection;
  
  const head = { ...state.snake[0] };
  
  if (state.direction === 'up') head.y--;
  else if (state.direction === 'down') head.y++;
  else if (state.direction === 'left') head.x--;
  else if (state.direction === 'right') head.x++;
  
  if (head.x < 0 || head.x >= state.cols || head.y < 0 || head.y >= state.rows) {
    snakeGameOver();
    return;
  }
  
  if (state.snake.some(s => s.x === head.x && s.y === head.y)) {
    snakeGameOver();
    return;
  }
  
  state.snake.unshift(head);
  
  if (head.x === state.food.x && head.y === state.food.y) {
    const points = state.food.type === 'star' ? 5 : 1;
    state.score += points;
    
    const scoreEl = document.getElementById('snakeScore');
    if (scoreEl) scoreEl.textContent = state.score;
    
    const fx = state.food.x * state.cellSize + state.cellSize / 2;
    const fy = state.food.y * state.cellSize + state.cellSize / 2;
    const particleColor = state.food.type === 'star' ? '255, 215, 0' : '136, 187, 238';
    for (let i = 0; i < 10; i++) {
      snakeAddParticle(fx, fy, particleColor);
    }
    
    snakeSpawnFood();
    
    if (state.score > state.best) {
      state.best = state.score;
      const bestEl = document.getElementById('snakeBest');
      if (bestEl) bestEl.textContent = state.best;
      localStorage.setItem('snakeBest', state.best);
    }
    
    state.speed = Math.max(70, 150 - Math.floor(state.score / 5) * 10);
  } else {
    state.snake.pop();
  }
  
  state.particles = state.particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    return p.life > 0;
  });
  
  snakeDraw();
  state.animationId = requestAnimationFrame(snakeUpdate);
}

function snakeGameOver() {
  const state = window.snakeState;
  state.running = false;
  if (state.animationId) cancelAnimationFrame(state.animationId);
  
  if (!state.ctx) return;
  const ctx = state.ctx;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})`;
    ctx.fillRect(Math.random() * state.canvas.width, Math.random() * state.canvas.height, 1, 1);
  }
  
  ctx.shadowBlur = 25;
  ctx.shadowColor = '#ff0055';
  ctx.fillStyle = '#ff0055';
  ctx.font = 'bold 20px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', state.canvas.width / 2, state.canvas.height / 2 - 15);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#88BBEE';
  ctx.font = '12px Orbitron, monospace';
  ctx.fillText('Счёт: ' + state.score, state.canvas.width / 2, state.canvas.height / 2 + 10);
  
  if (state.score === state.best && state.score > 0) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFD700';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('🏆 НОВЫЙ РЕКОРД! 🏆', state.canvas.width / 2, state.canvas.height / 2 + 35);
    ctx.shadowBlur = 0;
  }
  
  const btn = document.getElementById('btnSnake');
  if (btn) btn.textContent = 'СНОВА';
}

function startSnake() {
  const state = window.snakeState;
  snakeReset();
  state.running = true;
  
  const btn = document.getElementById('btnSnake');
  if (btn) btn.textContent = 'СТОП';
  
  state.lastTime = performance.now();
  state.animationId = requestAnimationFrame(snakeUpdate);
}

function stopSnake() {
  const state = window.snakeState;
  state.running = false;
  if (state.animationId) cancelAnimationFrame(state.animationId);
  
  const btn = document.getElementById('btnSnake');
  if (btn) btn.textContent = 'СТАРТ';
  
  snakeDrawIdle();
}

function initSnake() {
  const canvas = document.getElementById('snakeCanvas');
  if (!canvas) return;
  
  const state = window.snakeState;
  state.canvas = canvas;
  state.ctx = canvas.getContext('2d');
  state.best = parseInt(localStorage.getItem('snakeBest') || '0');
  
  const bestEl = document.getElementById('snakeBest');
  if (bestEl) bestEl.textContent = state.best;
  
  // Начальная отрисовка
  snakeReset();
  snakeDrawIdle();
  
  const btn = document.getElementById('btnSnake');
  if (btn) {
    btn.addEventListener('click', () => {
      if (state.running) stopSnake();
      else startSnake();
    });
  }
  
  // Свайп
  let touchStartX = 0;
  let touchStartY = 0;
  
  canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  canvas.addEventListener('touchend', (e) => {
    if (!state.running) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && state.direction !== 'left') state.nextDirection = 'right';
      else if (dx < -20 && state.direction !== 'right') state.nextDirection = 'left';
    } else {
      if (dy > 20 && state.direction !== 'up') state.nextDirection = 'down';
      else if (dy < -20 && state.direction !== 'down') state.nextDirection = 'up';
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════
// 3. КЛИКЕР (ИСПРАВЛЕН - планета нажимается)
// ═══════════════════════════════════════════════════
function clickerSpawnParticles(x, y, amount) {
  const state = window.clickerState;
  const target = document.getElementById('clickerTarget');
  if (!target) return;
  
  for (let i = 0; i < 3; i++) {
    const particle = document.createElement('div');
    particle.textContent = '+' + amount;
    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      color: #00ffff;
      font-weight: bold;
      font-family: 'Orbitron', monospace;
      pointer-events: none;
      transition: all 0.8s ease-out;
      z-index: 10;
      text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
    `;
    target.parentElement.appendChild(particle);
    
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${Math.random() * 60 - 30}px, -80px)`;
      particle.style.opacity = '0';
    });
    
    setTimeout(() => particle.remove(), 800);
  }
}

function clickerUpdate() {
  const state = window.clickerState;
  const energyEl = document.getElementById('clickerEnergy');
  const perClickEl = document.getElementById('clickerPerClick');
  const autoEl = document.getElementById('clickerAuto');
  
  if (energyEl) energyEl.textContent = Math.floor(state.energy);
  if (perClickEl) perClickEl.textContent = state.perClick;
  if (autoEl) autoEl.textContent = state.autoPerSecond + '/сек';
}

function initClicker() {
  const target = document.getElementById('clickerTarget');
  if (!target) {
    console.error('clickerTarget not found!');
    return;
  }
  
  const state = window.clickerState;
  
  // КЛИК по планете
  target.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const amount = state.perClick;
    state.energy += amount;
    
    const parentRect = target.parentElement.getBoundingClientRect();
    clickerSpawnParticles(
      e.clientX - parentRect.left,
      e.clientY - parentRect.top,
      amount
    );
    
    target.style.transform = 'scale(0.85)';
    setTimeout(() => target.style.transform = 'scale(1)', 100);
    
    state.emojiIndex = (state.emojiIndex + 1) % state.emojis.length;
    target.textContent = state.emojis[state.emojiIndex];
    
    clickerUpdate();
  });
  
  // Улучшения
  document.querySelectorAll('.clicker-upgrade').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const type = btn.dataset.upgrade;
      
      if (type === 'click') {
        if (state.energy >= state.clickCost) {
          state.energy -= state.clickCost;
          state.perClick++;
          state.clickCost = Math.floor(state.clickCost * 1.5);
          const costEl = btn.querySelector('.upgrade-cost');
          if (costEl) costEl.textContent = '⚡ ' + state.clickCost;
        }
      } else if (type === 'auto') {
        if (state.energy >= state.autoCost) {
          state.energy -= state.autoCost;
          state.autoPerSecond++;
          state.autoCost = Math.floor(state.autoCost * 2);
          const costEl = btn.querySelector('.upgrade-cost');
          if (costEl) costEl.textContent = '⚡ ' + state.autoCost;
          
          if (!state.interval) {
            state.interval = setInterval(() => {
              state.energy += state.autoPerSecond;
              clickerUpdate();
            }, 1000);
          }
        }
      }
      clickerUpdate();
    });
  });
  
  clickerUpdate();
}

// ═══════════════════════════════════════════════════
// 4. КОСМОС 2048
// ═══════════════════════════════════════════════════
window.game2048State = {
  board: [],
  size: 4,
  score: 0,
  started: false,  // НОВОЕ: игра не начата
  planets: ['🌑', '🌕', '🌍', '🪐', '🌟', '⭐', '🌌', '☀️', '💫', '✨', '🌞']
};

function g2048CreateBoard() {
  return Array.from({ length: window.game2048State.size }, () => 
    Array(window.game2048State.size).fill(0)
  );
}

function g2048AddRandomTile() {
  const state = window.game2048State;
  const empty = [];
  for (let y = 0; y < state.size; y++) {
    for (let x = 0; x < state.size; x++) {
      if (state.board[y][x] === 0) empty.push({ x, y });
    }
  }
  if (empty.length > 0) {
    const tile = empty[Math.floor(Math.random() * empty.length)];
    state.board[tile.y][tile.x] = Math.random() < 0.9 ? 1 : 2;
  }
}

function g2048Render() {
  const state = window.game2048State;
  const boardEl = document.getElementById('game2048Board');
  const scoreEl = document.getElementById('game2048Score');
  
  if (!boardEl) return;
  
  boardEl.innerHTML = '';
  for (let y = 0; y < state.size; y++) {
    for (let x = 0; x < state.size; x++) {
      const cell = document.createElement('div');
      cell.className = 'game-2048-cell';
      const value = state.board[y][x];
      
      if (value > 0) {
        const planetIdx = Math.min(value - 1, state.planets.length - 1);
        cell.textContent = state.planets[planetIdx];
        cell.classList.add(`level-${Math.min(value, 8)}`);
      }
      
      boardEl.appendChild(cell);
    }
  }
  
  if (scoreEl) scoreEl.textContent = state.score;
}

function g2048RenderIdle() {
  const boardEl = document.getElementById('game2048Board');
  if (!boardEl) return;
  
  boardEl.innerHTML = '';
  for (let y = 0; y < window.game2048State.size; y++) {
    for (let x = 0; x < window.game2048State.size; x++) {
      const cell = document.createElement('div');
      cell.className = 'game-2048-cell';
      cell.textContent = '';
      boardEl.appendChild(cell);
    }
  }
  
  // Надпись "Нажми СТАРТ"
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #00ffff;
    font-family: 'Orbitron', monospace;
    font-size: 1.2rem;
    text-shadow: 0 0 20px #00ffff;
    pointer-events: none;
    text-align: center;
  `;
  overlay.textContent = 'НАЖМИ СТАРТ';
  
  const container = boardEl.parentElement;
  if (container) {
    container.style.position = 'relative';
    if (!container.querySelector('.start-overlay')) {
      overlay.classList.add('start-overlay');
      container.appendChild(overlay);
    }
  }
}

function g2048Rotate(board) {
  const state = window.game2048State;
  const newBoard = g2048CreateBoard();
  for (let y = 0; y < state.size; y++) {
    for (let x = 0; x < state.size; x++) {
      newBoard[x][state.size - 1 - y] = board[y][x];
    }
  }
  return newBoard;
}

function g2048MoveLeft(board) {
  const state = window.game2048State;
  let changed = false;
  for (let y = 0; y < state.size; y++) {
    let row = board[y].filter(v => v !== 0);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        state.score += row[i];
        row.splice(i + 1, 1);
        changed = true;
      }
    }
    while (row.length < state.size) row.push(0);
    for (let x = 0; x < state.size; x++) {
      if (board[y][x] !== row[x]) changed = true;
      board[y][x] = row[x];
    }
  }
  return changed;
}

function g2048Move(direction) {
  const state = window.game2048State;
  
  if (!state.started) return; // Не работает пока не нажата СТАРТ
  
  const workBoard = state.board.map(row => [...row]);
  let moved = false;
  
  if (direction === 'right') {
    const reversed = workBoard.map(row => row.reverse());
    if (g2048MoveLeft(reversed)) {
      state.board = reversed.map(row => row.reverse());
      moved = true;
    }
  } else if (direction === 'left') {
    if (g2048MoveLeft(workBoard)) {
      state.board = workBoard;
      moved = true;
    }
  } else if (direction === 'up') {
    const rotated = g2048Rotate(g2048Rotate(g2048Rotate(workBoard)));
    if (g2048MoveLeft(rotated)) {
      state.board = g2048Rotate(rotated);
      moved = true;
    }
  } else if (direction === 'down') {
    const rotated = g2048Rotate(workBoard);
    if (g2048MoveLeft(rotated)) {
      state.board = g2048Rotate(g2048Rotate(g2048Rotate(rotated)));
      moved = true;
    }
  }
  
  if (moved) {
    g2048AddRandomTile();
    g2048Render();
  }
}

function g2048Reset() {
  const state = window.game2048State;
  state.board = g2048CreateBoard();
  state.score = 0;
  state.started = true;
  g2048AddRandomTile();
  g2048AddRandomTile();
  g2048Render();
  
  // Убираем надпись "Нажми СТАРТ"
  const overlay = document.querySelector('.start-overlay');
  if (overlay) overlay.style.display = 'none';
  
  const btn = document.getElementById('btn2048Start');
  if (btn) btn.textContent = 'СБРОС';
}

function g2048ResetToIdle() {
  const state = window.game2048State;
  state.board = g2048CreateBoard();
  state.score = 0;
  state.started = false;
  g2048RenderIdle();
  
  const overlay = document.querySelector('.start-overlay');
  if (overlay) overlay.style.display = 'block';
  
  const btn = document.getElementById('btn2048Start');
  if (btn) btn.textContent = 'СТАРТ';
}

function init2048() {
  const boardEl = document.getElementById('game2048Board');
  const btn = document.getElementById('btn2048Start');
  
  if (!boardEl) {
    console.error('game2048Board not found!');
    return;
  }
  
  // Показываем пустую доску с надписью
  g2048RenderIdle();
  
  // Обработчик кнопки СТАРТ/СБРОС
  if (btn) {
    btn.addEventListener('click', () => {
      const state = window.game2048State;
      if (!state.started) {
        g2048Reset();
      } else {
        g2048Reset();
      }
    });
  }
  
  // Свайп-управление
  let touchStartX = 0;
  let touchStartY = 0;
  
  boardEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  boardEl.addEventListener('touchend', (e) => {
    if (!window.game2048State.started) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      g2048Move(dx > 0 ? 'right' : 'left');
    } else {
      g2048Move(dy > 0 ? 'down' : 'up');
    }
  }, { passive: true });
}


// ═══════════════════════════════════════════════════
// ЕДИНЫЙ ОБРАБОТЧИК КЛАВИАТУРЫ (WASD + стрелки)
// ═══════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  
  // === ТЕТРИС ===
  if (window.tetrisState.running && window.tetrisState.currentPiece) {
    if (key === 'arrowleft' || key === 'a') {
      e.preventDefault();
      window.tetrisState.currentPiece.x--;
      if (tetrisCollide(window.tetrisState.currentPiece, 0, 0)) {
        window.tetrisState.currentPiece.x++;
      }
    } else if (key === 'arrowright' || key === 'd') {
      e.preventDefault();
      window.tetrisState.currentPiece.x++;
      if (tetrisCollide(window.tetrisState.currentPiece, 0, 0)) {
        window.tetrisState.currentPiece.x--;
      }
    } else if (key === 'arrowdown' || key === 's') {
      e.preventDefault();
      tetrisDrop();
    } else if (key === 'arrowup' || key === 'w') {
      e.preventDefault();
      tetrisRotatePiece();
    } else if (key === ' ') {
      e.preventDefault();
      if (window.tetrisState.currentPiece) {
        while (!tetrisCollide(window.tetrisState.currentPiece, 0, 1)) {
          window.tetrisState.currentPiece.y++;
        }
        tetrisDrop();
      }
    }
  }
  
  // === ЗМЕЙКА ===
  if (window.snakeState.running) {
    if ((key === 'arrowup' || key === 'w') && window.snakeState.direction !== 'down') {
      e.preventDefault();
      window.snakeState.nextDirection = 'up';
    } else if ((key === 'arrowdown' || key === 's') && window.snakeState.direction !== 'up') {
      e.preventDefault();
      window.snakeState.nextDirection = 'down';
    } else if ((key === 'arrowleft' || key === 'a') && window.snakeState.direction !== 'right') {
      e.preventDefault();
      window.snakeState.nextDirection = 'left';
    } else if ((key === 'arrowright' || key === 'd') && window.snakeState.direction !== 'left') {
      e.preventDefault();
      window.snakeState.nextDirection = 'right';
    }
  }
  
  // === 2048 (всегда работает) ===
  if (document.getElementById('game2048Board')) {
    if (key === 'arrowleft' || key === 'a') {
      e.preventDefault();
      g2048Move('left');
    } else if (key === 'arrowright' || key === 'd') {
      e.preventDefault();
      g2048Move('right');
    } else if (key === 'arrowup' || key === 'w') {
      e.preventDefault();
      g2048Move('up');
    } else if (key === 'arrowdown' || key === 's') {
      e.preventDefault();
      g2048Move('down');
    }
  }
});

// ═══════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== Initializing games ===');
  
  if (document.getElementById('tetrisCanvas')) {
    initTetris();
    console.log('✓ Tetris initialized');
  }
  
  if (document.getElementById('snakeCanvas')) {
    initSnake();
    console.log('✓ Snake initialized');
  }
  
  if (document.getElementById('clickerTarget')) {
    initClicker();
    console.log('✓ Clicker initialized');
  }
  
  if (document.getElementById('game2048Board')) {
    init2048();
    console.log('✓ 2048 initialized');
  }
});
