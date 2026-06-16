// ═══════════════════════════════════════════════════
// 3D ПЛАНЕТЫ — Three.js (без Красного Пятна, с зеленью на Земле)
// ═══════════════════════════════════════════════════

let scene, camera, renderer, controls;
let currentPlanet = null;
let planetGroup = null;
let rotationEnabled = true;
let atmosphereEnabled = false;
let ringsEnabled = true;
let moonsEnabled = true;
let autoRotateEnabled = false;
let zoomLevel = 8;
let animationId = null;

// Массив 3D-объектов планет с настройками
const PLANETS_3D = [
  {
    name: 'Солнце', type: 'Звезда', diameter: '1 392 000 км',
    mass: '1.989 × 10³⁰ кг', distance: '—',
    desc: 'Жёлтый карлик класса G2V в центре нашей Солнечной системы.',
    color: 0xFFD740, emissive: 0xFF8C00, emissiveIntensity: 1.8,
    radius: 4.0, hasRings: false, hasMoons: false, hasAtmosphere: false,
    texture: 'images/sun.jpg', roughness: 1.0, metalness: 0.0,
    segments: 96
  },
  {
    name: 'Меркурий', type: 'Планета', diameter: '4 879 км',
    mass: '3.3 × 10²³ кг', distance: '57.9 млн км',
    desc: 'Ближайшая к Солнцу планета. Покрыта кратерами, похожа на Луну.',
    color: 0xB8A98E, emissive: 0x000000, emissiveIntensity: 0,
    radius: 0.6, hasRings: false, hasMoons: false, hasAtmosphere: false,
    texture: 'images/mercury.png', roughness: 0.95, metalness: 0.1,
    segments: 64, hasCraters: true
  },
  {
    name: 'Венера', type: 'Планета', diameter: '12 104 км',
    mass: '4.87 × 10²⁴ кг', distance: '108.2 млн км',
    desc: 'Самая горячая планета Солнечной системы. Покрыта плотными облаками.',
    color: 0xE5AC52, emissive: 0x442200, emissiveIntensity: 0.4,
    radius: 1.2, hasRings: false, hasMoons: false, hasAtmosphere: true,
    atmosphereColor: 0xFFBB77, atmosphereOpacity: 0.25,
    texture: 'images/venus.png', roughness: 0.6, metalness: 0.0,
    segments: 96, cloudLayer: true
  },
  {
    name: 'Земля', type: 'Планета', diameter: '12 742 км',
    mass: '5.97 × 10²⁴ кг', distance: '149.6 млн км',
    desc: 'Наш дом. Единственная известная планета с жизнью. 71% поверхности покрыто водой.',
    color: 0x6E7FA3, emissive: 0x112244, emissiveIntensity: 0.25,
    radius: 1.3, hasRings: false, hasMoons: true, hasAtmosphere: true,
    atmosphereColor: 0x88BBEE, atmosphereOpacity: 0.3,
    texture: 'images/earth.png', roughness: 0.5, metalness: 0.0,
    segments: 96, cloudLayer: true, hasVegetation: true, moonCount: 1
  },
  {
    name: 'Луна', type: 'Спутник', diameter: '3 475 км',
    mass: '7.35 × 10²² кг', distance: '384 400 км от Земли',
    desc: 'Единственный естественный спутник Земли.',
    color: 0xC9C9C9, emissive: 0x222222, emissiveIntensity: 0.1,
    radius: 0.4, hasRings: false, hasMoons: false, hasAtmosphere: false,
    texture: 'images/satellites/moon.png', roughness: 0.92, metalness: 0.0,
    segments: 64, hasCraters: true
  },
  {
    name: 'Марс', type: 'Планета', diameter: '6 779 км',
    mass: '6.42 × 10²³ кг', distance: '227.9 млн км',
    desc: 'Красная планета. Имеет самый высокий вулкан в Солнечной системе.',
    color: 0xC97B5A, emissive: 0x441100, emissiveIntensity: 0.2,
    radius: 0.75, hasRings: false, hasMoons: true, hasAtmosphere: true,
    atmosphereColor: 0xDD8866, atmosphereOpacity: 0.15,
    texture: 'images/mars.png', roughness: 0.85, metalness: 0.0,
    segments: 64, moonCount: 2
  },
  {
    name: 'Юпитер', type: 'Газовый гигант', diameter: '139 820 км',
    mass: '1.90 × 10²⁷ кг', distance: '778.5 млн км',
    desc: 'Крупнейшая планета Солнечной системы. Газовый гигант с множеством спутников.',
    color: 0xDEC18C, emissive: 0x110800, emissiveIntensity: 0.05,
    radius: 3.5, hasRings: true, hasMoons: true, hasAtmosphere: true,
    atmosphereColor: 0xE5C896, atmosphereOpacity: 0.15,
    texture: 'images/jupiter.png', roughness: 0.4, metalness: 0.0,
    segments: 96, ringInner: 5.0, ringOuter: 5.5, ringOpacity: 0.25, moonCount: 4
    // hasGreatRedSpot УДАЛЁН
  },
  {
    name: 'Сатурн', type: 'Газовый гигант', diameter: '116 460 км',
    mass: '5.68 × 10²⁶ кг', distance: '1.43 млрд км',
    desc: 'Знаменит своими великолепными кольцами из льда и камней.',
    color: 0xE5D4A1, emissive: 0x000000, emissiveIntensity: 0,
    radius: 3.0, hasRings: true, hasMoons: true, hasAtmosphere: true,
    atmosphereColor: 0xE5C896, atmosphereOpacity: 0.15,
    texture: 'images/saturn.png', roughness: 0.4, metalness: 0.0,
    segments: 96, ringInner: 4.0, ringOuter: 6.5, ringOpacity: 0.85, moonCount: 5
  },
  {
    name: 'Уран', type: 'Ледяной гигант', diameter: '50 724 км',
    mass: '8.68 × 10²⁵ кг', distance: '2.87 млрд км',
    desc: 'Вращается "лёжа на боку" с наклоном оси 98°.',
    color: 0x9FB8C9, emissive: 0x112233, emissiveIntensity: 0.1,
    radius: 2.0, hasRings: true, hasMoons: true, hasAtmosphere: true,
    atmosphereColor: 0xAACCDD, atmosphereOpacity: 0.25,
    texture: 'images/uranus.png', roughness: 0.45, metalness: 0.0,
    segments: 96, ringInner: 2.8, ringOuter: 3.3, ringOpacity: 0.4, moonCount: 3
  },
  {
    name: 'Нептун', type: 'Ледяной гигант', diameter: '49 244 км',
    mass: '1.02 × 10²⁶ кг', distance: '4.50 млрд км',
    desc: 'Самая далёкая планета. Самые сильные ветры в Солнечной системе.',
    color: 0x7B89B5, emissive: 0x112244, emissiveIntensity: 0.1,
    radius: 1.9, hasRings: false, hasMoons: true, hasAtmosphere: true,
    atmosphereColor: 0x7799CC, atmosphereOpacity: 0.3,
    texture: 'images/neptune.png', roughness: 0.45, metalness: 0.0,
    segments: 96, cloudLayer: true, moonCount: 2
  }
];

// ═══════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ THREE.JS
// ═══════════════════════════════════════════════════
function initThreeJS() {
  const container = document.getElementById('threeContainer');
  if (!container) return;
  
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer && container.contains(renderer.domElement)) {
    container.removeChild(renderer.domElement);
  }
  
  scene = new THREE.Scene();
  
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(0, 0, zoomLevel);
  
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1.5;
  controls.maxDistance = 30;
  
  // === ОСВЕЩЕНИЕ ===
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambientLight);
  
  const sunLight = new THREE.PointLight(0xffffff, 1.5, 100);
  sunLight.position.set(20, 10, 15);
  scene.add(sunLight);
  
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 3, 5);
  dirLight.castShadow = true;
  scene.add(dirLight);
  
  const backLight = new THREE.DirectionalLight(0x446688, 0.3);
  backLight.position.set(-5, -3, -5);
  scene.add(backLight);
  
  addStarfield();
  
  loadPlanet(0);
  
  animate();
  window.addEventListener('resize', onWindowResize);
}

// ═══════════════════════════════════════════════════
// ЗВЁЗДЫ
// ═══════════════════════════════════════════════════
function addStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 3000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    
    const starType = Math.random();
    if (starType < 0.7) {
      colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
    } else if (starType < 0.85) {
      colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1;
    } else if (starType < 0.95) {
      colors[i * 3] = 1; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.8;
    } else {
      colors[i * 3] = 1; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 0.5;
    }
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

// ═══════════════════════════════════════════════════
// ЗАГРУЗКА ПЛАНЕТЫ
// ═══════════════════════════════════════════════════
function loadPlanet(index) {
  const data = PLANETS_3D[index];
  if (!data) return;
  
  if (planetGroup) {
    scene.remove(planetGroup);
    disposeObject(planetGroup);
    planetGroup = null;
  }
  
  currentPlanet = data;
  updatePlanetInfo(data);
  
  document.querySelectorAll('.planet3d-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  
  planetGroup = new THREE.Group();
  
  const segments = data.segments || 64;
  const geometry = new THREE.SphereGeometry(data.radius, segments, segments);
  
  if (data.hasCraters) {
    addCraterDetails(geometry, data);
  }
  
  const textureLoader = new THREE.TextureLoader();
  const materialOptions = {
    color: data.color,
    emissive: data.emissive,
    emissiveIntensity: data.emissiveIntensity,
    roughness: data.roughness,
    metalness: data.metalness
  };
  
  if (data.texture) {
    textureLoader.load(
      data.texture,
      (texture) => {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        materialOptions.map = texture;
        const material = new THREE.MeshStandardMaterial(materialOptions);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        planetGroup.add(mesh);
        finalizePlanet();
      },
      undefined,
      () => {
        const material = new THREE.MeshStandardMaterial(materialOptions);
        const mesh = new THREE.Mesh(geometry, material);
        planetGroup.add(mesh);
        finalizePlanet();
      }
    );
  } else {
    const material = new THREE.MeshStandardMaterial(materialOptions);
    const mesh = new THREE.Mesh(geometry, material);
    planetGroup.add(mesh);
    finalizePlanet();
  }
  
  function finalizePlanet() {
    // ЗЕЛЕНЬ (Земля) — добавляется ПЕРЕД облаками
    if (data.hasVegetation) {
      addVegetation(data);
    }
    
    // Облачный слой
    if (data.cloudLayer) {
      addCloudLayer(data);
    }
    
    // Атмосфера
    if (data.hasAtmosphere && atmosphereEnabled) {
      addAtmosphere(data);
    }
    
    // Кольца
    if (data.hasRings && ringsEnabled) {
      addRings(data);
    }
    
    // Спутники
    if (data.moonCount && moonsEnabled) {
      addMoons(data);
    }
    
    scene.add(planetGroup);
    
    if (data.name === 'Уран') {
      planetGroup.rotation.z = Math.PI / 2;
    }
  }
}

// ═══════════════════════════════════════════════════
// ЗЕЛЕНЬ / КОНТИНЕНТЫ (Земля)
// ═══════════════════════════════════════════════════
function addVegetation(data) {
  // Создаём текстуру зелёных континентов
  const vegCanvas = document.createElement('canvas');
  vegCanvas.width = 1024;
  vegCanvas.height = 512;
  const ctx = vegCanvas.getContext('2d');
  
  // Прозрачный фон
  ctx.clearRect(0, 0, 1024, 512);
  
  // Разные оттенки зелёного для континентов
  const greenShades = [
    '#2D5F1E', // тёмно-зелёный (леса Амазонки)
    '#3F7A2A', // зелёный
    '#4F8B36', // светло-зелёный
    '#5F9F45', // салатовый
    '#6B7F3F', // оливковый
    '#3A6B25', // хвойный
    '#558B2F', // лесной
    '#2E7D32'  // изумрудный
  ];
  
  // === Рисуем континенты ===
  // 7 крупных континентов (стилизованные)
  const continents = [
    // Евразия
    { x: 500, y: 180, w: 200, h: 100, shape: 'eurasia' },
    // Африка
    { x: 480, y: 280, w: 80, h: 120, shape: 'africa' },
    // Северная Америка
    { x: 180, y: 180, w: 130, h: 100, shape: 'namerica' },
    // Южная Америка
    { x: 230, y: 300, w: 60, h: 100, shape: 'samerica' },
    // Австралия
    { x: 720, y: 360, w: 70, h: 50, shape: 'australia' },
    // Антарктида
    { x: 100, y: 460, w: 824, h: 30, shape: 'antarctica' },
    // Гренландия
    { x: 280, y: 100, w: 50, h: 40, shape: 'greenland' }
  ];
  
  continents.forEach((continent, idx) => {
    const color = greenShades[idx % greenShades.length];
    ctx.fillStyle = color;
    
    // Рисуем континент органической формы
    ctx.beginPath();
    const cx = continent.x;
    const cy = continent.y;
    const points = 20;
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const noise = 0.7 + Math.random() * 0.6;
      const rx = continent.w / 2 * noise;
      const ry = continent.h / 2 * noise;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry * 0.8;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    // Добавляем тени и блики для объёма
    const gradient = ctx.createRadialGradient(cx - 20, cy - 20, 0, cx, cy, continent.w / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = gradient;
    ctx.fill();
  });
  
  // === ЛЕСА (маленькие тёмно-зелёные пятна) ===
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    
    // Проверяем, попадает ли в один из континентов (примерно)
    let onLand = false;
    continents.forEach(c => {
      const dx = (x - c.x) / (c.w / 2);
      const dy = (y - c.y) / (c.h / 2);
      if (dx*dx + dy*dy < 1) onLand = true;
    });
    
    if (onLand && Math.random() > 0.5) {
      const r = 2 + Math.random() * 6;
      ctx.fillStyle = `rgba(20, 80, 20, ${0.3 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // === ПУСТЫНИ (жёлтые пятна на континентах) ===
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    
    let onLand = false;
    continents.forEach(c => {
      const dx = (x - c.x) / (c.w / 2);
      const dy = (y - c.y) / (c.h / 2);
      if (dx*dx + dy*dy < 1) onLand = true;
    });
    
    if (onLand) {
      const r = 5 + Math.random() * 15;
      const desertGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
      desertGrad.addColorStop(0, `rgba(210, 180, 120, ${0.4 + Math.random() * 0.3})`);
      desertGrad.addColorStop(1, 'rgba(210, 180, 120, 0)');
      ctx.fillStyle = desertGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  const vegetationTexture = new THREE.CanvasTexture(vegCanvas);
  vegetationTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  
  // Создаём сферу для растительности чуть выше поверхности
  const vegGeometry = new THREE.SphereGeometry(data.radius * 1.005, 64, 64);
  const vegMaterial = new THREE.MeshStandardMaterial({
    map: vegetationTexture,
    transparent: true,
    opacity: 0.85,
    roughness: 0.7,
    depthWrite: false
  });
  
  const vegetation = new THREE.Mesh(vegGeometry, vegMaterial);
  vegetation.userData.isVegetation = true;
  planetGroup.add(vegetation);
}

// ═══════════════════════════════════════════════════
// ДЕТАЛИ ПОВЕРХНОСТИ — КРАТЕРЫ
// ═══════════════════════════════════════════════════
function addCraterDetails(geometry, data) {
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const variation = (Math.random() - 0.5) * 0.015 * data.radius;
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const length = Math.sqrt(x*x + y*y + z*z);
    const factor = (length + variation) / length;
    positions.setXYZ(i, x * factor, y * factor, z * factor);
  }
  geometry.computeVertexNormals();
}

// ═══════════════════════════════════════════════════
// ОБЛАЧНЫЙ СЛОЙ
// ═══════════════════════════════════════════════════
function addCloudLayer(data) {
  const cloudGeometry = new THREE.SphereGeometry(data.radius * 1.03, 64, 64);
  
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 512;
  cloudCanvas.height = 256;
  const ctx = cloudCanvas.getContext('2d');
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0)';
  ctx.fillRect(0, 0, 512, 256);
  
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 10 + Math.random() * 40;
    const opacity = 0.3 + Math.random() * 0.4;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  
  const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
  const cloudMaterial = new THREE.MeshStandardMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.6,
    depthWrite: false
  });
  
  const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  clouds.userData.isCloud = true;
  planetGroup.add(clouds);
}

// ═══════════════════════════════════════════════════
// АТМОСФЕРА
// ═══════════════════════════════════════════════════
function addAtmosphere(data) {
  const atmosphereGeometry = new THREE.SphereGeometry(data.radius * 1.18, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 glowColor;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(glowColor, intensity * 0.6);
      }
    `,
    uniforms: {
      glowColor: { value: new THREE.Color(data.atmosphereColor || 0x88AACC) }
    },
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  planetGroup.add(atmosphere);
}

// ═══════════════════════════════════════════════════
// КОЛЬЦА
// ═══════════════════════════════════════════════════
function addRings(data) {
  const innerRadius = data.ringInner || data.radius * 1.4;
  const outerRadius = data.ringOuter || data.radius * 2.0;
  const ringOpacity = data.ringOpacity || 0.85;
  
  const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
  
  const ringCanvas = document.createElement('canvas');
  ringCanvas.width = 1024;
  ringCanvas.height = 1;
  const ctx = ringCanvas.getContext('2d');
  
  if (data.name === 'Юпитер') {
    const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
    gradient.addColorStop(0, 'rgba(180, 160, 130, 0.0)');
    gradient.addColorStop(0.3, 'rgba(200, 180, 150, 0.15)');
    gradient.addColorStop(0.5, 'rgba(220, 200, 170, 0.25)');
    gradient.addColorStop(0.7, 'rgba(200, 180, 150, 0.15)');
    gradient.addColorStop(1, 'rgba(180, 160, 130, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1);
  } else if (data.name === 'Сатурн') {
    const segments = [
      { stop: 0.0, opacity: 0.0 },
      { stop: 0.03, opacity: 0.7 },
      { stop: 0.11, opacity: 0.0 },
      { stop: 0.13, opacity: 0.8 },
      { stop: 0.25, opacity: 0.7 },
      { stop: 0.38, opacity: 0.4 },
      { stop: 0.42, opacity: 0.85 },
      { stop: 0.57, opacity: 0.7 },
      { stop: 0.70, opacity: 0.5 },
      { stop: 0.78, opacity: 0.6 },
      { stop: 0.93, opacity: 0.4 },
      { stop: 1.0, opacity: 0.0 }
    ];
    
    for (let i = 0; i < segments.length - 1; i++) {
      const x1 = segments[i].stop * 1024;
      const x2 = segments[i+1].stop * 1024;
      const gradient = ctx.createLinearGradient(x1, 0, x2, 0);
      gradient.addColorStop(0, `rgba(200, 180, 140, ${segments[i].opacity})`);
      gradient.addColorStop(1, `rgba(200, 180, 140, ${segments[i+1].opacity})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x1, 0, x2 - x1, 1);
    }
  } else if (data.name === 'Уран') {
    const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
    gradient.addColorStop(0, 'rgba(120, 140, 160, 0.0)');
    gradient.addColorStop(0.4, 'rgba(150, 170, 190, 0.3)');
    gradient.addColorStop(0.6, 'rgba(150, 170, 190, 0.3)');
    gradient.addColorStop(1, 'rgba(120, 140, 160, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1);
  }
  
  const ringTexture = new THREE.CanvasTexture(ringCanvas);
  ringTexture.wrapS = THREE.RepeatWrapping;
  
  const ringMaterial = new THREE.MeshBasicMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: ringOpacity,
    depthWrite: false
  });
  
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2 - 0.05;
  ring.receiveShadow = true;
  planetGroup.add(ring);
  
  if (data.name === 'Уран') {
    ring.rotation.x = Math.PI / 2;
  }
}

// ═══════════════════════════════════════════════════
// СПУТНИКИ
// ═══════════════════════════════════════════════════
function addMoons(data) {
  const count = data.moonCount || 1;
  const baseOrbit = data.radius * 2.8;
  
  for (let i = 0; i < count; i++) {
    const moonSize = data.radius * 0.15 + Math.random() * data.radius * 0.1;
    const moonGeometry = new THREE.SphereGeometry(moonSize, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xBBBBBB,
      roughness: 0.85,
      metalness: 0.05
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    
    const orbitRadius = baseOrbit + i * data.radius * 1.0;
    const orbitAngle = (i / count) * Math.PI * 2;
    const orbitSpeed = 0.3 + Math.random() * 0.4;
    
    moon.userData = {
      orbitRadius: orbitRadius,
      orbitSpeed: orbitSpeed,
      orbitAngle: orbitAngle,
      yOffset: (Math.random() - 0.5) * 0.3,
      isMoon: true
    };
    
    planetGroup.add(moon);
  }
}

// ═══════════════════════════════════════════════════
// ОЧИСТКА ПАМЯТИ
// ═══════════════════════════════════════════════════
function disposeObject(obj) {
  obj.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

// ═══════════════════════════════════════════════════
// ОБНОВЛЕНИЕ ИНФОРМАЦИИ
// ═══════════════════════════════════════════════════
function updatePlanetInfo(data) {
  document.getElementById('p3dName').textContent = data.name;
  document.getElementById('p3dType').textContent = data.type;
  document.getElementById('p3dDiameter').textContent = data.diameter;
  document.getElementById('p3dMass').textContent = data.mass;
  document.getElementById('p3dDistance').textContent = data.distance;
  document.getElementById('p3dDesc').textContent = data.desc;
}

// ═══════════════════════════════════════════════════
// АНИМАЦИЯ
// ═══════════════════════════════════════════════════
function animate() {
  animationId = requestAnimationFrame(animate);
  
  if (planetGroup && rotationEnabled) {
    let planetMesh = null;
    let cloudMesh = null;
    
    planetGroup.children.forEach(child => {
      if (child.userData && child.userData.orbitRadius) {
        // Спутник
        child.userData.orbitAngle += child.userData.orbitSpeed * 0.008;
        child.position.x = Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius;
        child.position.z = Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius;
        child.position.y = child.userData.yOffset;
      } else if (child.userData && child.userData.isCloud) {
        // Облака вращаются быстрее
        child.rotation.y += 0.007;
      } else if (child.userData && child.userData.isVegetation) {
        // Зелень вращается вместе с планетой
        child.rotation.y += 0.005;
      } else if (child.type === 'Mesh') {
        if (child.geometry.type === 'SphereGeometry') {
          if (!planetMesh) {
            planetMesh = child;
          } else if (child.material.transparent && !cloudMesh) {
            cloudMesh = child;
          }
        }
      }
    });
    
    if (planetMesh) {
      planetMesh.rotation.y += 0.005;
    }
  }
  
  if (autoRotateEnabled) {
    const time = Date.now() * 0.0003;
    camera.position.x = Math.cos(time) * zoomLevel;
    camera.position.z = Math.sin(time) * zoomLevel;
    camera.position.y = Math.sin(time * 0.5) * 1.5;
    camera.lookAt(0, 0, 0);
  }
  
  controls.update();
  renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════
// ОБРАБОТЧИКИ
// ═══════════════════════════════════════════════════
function initPlanet3DControls() {
  const list = document.getElementById('planet3dList');
  if (list) {
    list.innerHTML = PLANETS_3D.map((p, i) => {
      const colorHex = '#' + p.color.toString(16).padStart(6, '0');
      return `
        <div class="planet3d-item" data-index="${i}">
          <div class="planet3d-item-icon" style="background: radial-gradient(circle at 30% 30%, ${colorHex} 0%, ${colorHex}88 40%, transparent 70%);"></div>
          <div class="planet3d-item-name">${p.name}</div>
        </div>
      `;
    }).join('');
    
    list.querySelectorAll('.planet3d-item').forEach((item, i) => {
      item.addEventListener('click', () => loadPlanet(i));
    });
  }
  
  document.getElementById('toggleRotation')?.addEventListener('click', function() {
    rotationEnabled = !rotationEnabled;
    this.querySelector('.ctrl-icon').textContent = rotationEnabled ? '⏸' : '▶';
    this.querySelector('.ctrl-text').textContent = rotationEnabled ? 'Пауза' : 'Старт';
  });
  
  document.getElementById('toggleAtmosphere')?.addEventListener('click', function() {
    atmosphereEnabled = !atmosphereEnabled;
    this.querySelector('.ctrl-icon').textContent = atmosphereEnabled ? '💨' : '🚫';
    this.querySelector('.ctrl-text').textContent = atmosphereEnabled ? 'Вкл' : 'Выкл';
    if (currentPlanet) loadPlanet(PLANETS_3D.indexOf(currentPlanet));
  });
  
  document.getElementById('toggleRings')?.addEventListener('click', function() {
    ringsEnabled = !ringsEnabled;
    this.querySelector('.ctrl-icon').textContent = ringsEnabled ? '💍' : '🚫';
    this.querySelector('.ctrl-text').textContent = ringsEnabled ? 'Вкл' : 'Выкл';
    if (currentPlanet) loadPlanet(PLANETS_3D.indexOf(currentPlanet));
  });
  
  document.getElementById('toggleMoons')?.addEventListener('click', function() {
    moonsEnabled = !moonsEnabled;
    this.querySelector('.ctrl-icon').textContent = moonsEnabled ? '🌙' : '🚫';
    this.querySelector('.ctrl-text').textContent = moonsEnabled ? 'Вкл' : 'Выкл';
    if (currentPlanet) loadPlanet(PLANETS_3D.indexOf(currentPlanet));
  });
  
  document.getElementById('toggleAutoRotate')?.addEventListener('click', function() {
    autoRotateEnabled = !autoRotateEnabled;
    this.querySelector('.ctrl-icon').textContent = autoRotateEnabled ? '🔄' : '⏹';
    this.querySelector('.ctrl-text').textContent = autoRotateEnabled ? 'Вкл' : 'Выкл';
    controls.enabled = !autoRotateEnabled;
  });
  
  const zoomInput = document.getElementById('planetZoom');
  const zoomVal = document.getElementById('zoomVal');
  if (zoomInput) {
    zoomInput.min = '3';
    zoomInput.max = '20';
    zoomInput.value = '8';
    zoomInput.step = '0.5';
    zoomInput.addEventListener('input', e => {
      zoomLevel = parseFloat(e.target.value);
      zoomVal.textContent = zoomLevel.toFixed(1) + '×';
      camera.position.setLength(zoomLevel);
      camera.lookAt(0, 0, 0);
    });
  }
}

// ═══════════════════════════════════════════════════
// RESIZE
// ═══════════════════════════════════════════════════
function onWindowResize() {
  const container = document.getElementById('threeContainer');
  if (!container || !camera || !renderer) return;
  
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// ═══════════════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('threeContainer')) {
    initPlanet3DControls();
    setTimeout(initThreeJS, 100);
  }
});
