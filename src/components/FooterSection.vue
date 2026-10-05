<template>
  <footer
    id="contact"
    ref="footerRef"
    class="relative overflow-hidden bg-[#070b14] text-white"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 背景光暈，讓深色底不會太單調 -->
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(99,102,241,0.18),transparent_60%)]"
    ></div>

    <!-- Three.js Canvas 背景 -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <!-- 文字可讀性遮罩：桌機由左往右淡出，手機整片壓暗 -->
    <div
      class="pointer-events-none absolute inset-0 bg-[#070b14]/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#070b14] lg:via-[#070b14]/60 lg:to-transparent"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-[600px] flex flex-col">
      <div class="flex-1 flex items-center py-24">
        <div class="max-w-xl">
          <p class="text-xs font-semibold tracking-[0.3em] uppercase text-indigo-300 mb-4">Contact</p>
          <h2 class="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
            有合作機會？<br />歡迎與我聯繫
          </h2>
          <p class="mt-6 text-base sm:text-lg text-gray-400 leading-relaxed">
            感謝瀏覽。<br class="hidden sm:block" />如果你正在尋找前端工程師，或對作品有任何想法，都歡迎來信。
          </p>

          <div class="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              :href="`mailto:${EMAIL}`"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-medium hover:bg-indigo-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
              </svg>
              {{ EMAIL }}
            </a>
            <a
              :href="profile.github"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
            >
              <GithubIcon class="w-5 h-5" />
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-white/10 pt-6 pb-20 sm:pb-6 flex flex-col sm:flex-row gap-2 justify-between text-sm text-gray-500">
        <p>© {{ copyrightYears }} Designed & Developed by Kent.</p>
        <p>Built with Vue 3・TypeScript・Three.js</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { whenAppLoaded } from '../utils/appLoaded';
import { prefersReducedMotion } from '../utils/motion';
import { profile } from '../data/profile';
import GithubIcon from './GithubIcon.vue';
import type * as ThreeModule from 'three';

type Vec3 = [number, number, number];

interface Body {
  mesh: ThreeModule.Mesh;
  position: ThreeModule.Vector3;
  velocity: ThreeModule.Vector3;
  mass: number;
  color: ThreeModule.Color;
  trailPositions: Float32Array;
  trailColors: Float32Array;
  trailCount: number;
  /** 上次更新軌跡漸層時的點數，點數沒變就不用重算 */
  coloredCount: number;
}

const EMAIL = profile.email;
const START_YEAR = 2025;
const currentYear = new Date().getFullYear();
const copyrightYears = currentYear > START_YEAR ? `${START_YEAR}-${currentYear}` : `${START_YEAR}`;

// === Vue 響應式變數 ===
const canvasRef = ref<HTMLCanvasElement | null>(null); // Canvas DOM 元素引用
const footerRef = ref<HTMLElement | null>(null); // Footer DOM 元素引用

// === Three.js 核心物件 ===
// three.js 體積大，改為動態載入，不影響首屏
let THREE: typeof ThreeModule;                         // 動態載入的 three 模組
let scene: ThreeModule.Scene | undefined;              // 場景：所有 3D 物件的容器
let camera: ThreeModule.PerspectiveCamera | undefined; // 相機：定義觀察視角
let renderer: ThreeModule.WebGLRenderer | undefined;   // 渲染器：將場景渲染到 Canvas 上
let starField: ThreeModule.Group | undefined;          // 星空，緩慢自轉製造景深
let animationId: number | null = null;                 // 動畫循環 ID，用於取消動畫

// === 三體系統數據 ===
let bodies: Body[] = [];             // 存儲三個天體的資訊（位置、速度、網格等）
let trails: ThreeModule.Line[] = []; // 存儲三個天體的軌跡線條

// === 三體初始參數 ===
// 配色取自網站主色：靛藍、紫、青
const bodyParams: { position: Vec3; velocity: Vec3; color: number; mass: number }[] = [
  {
    position: [5, 0, 0],   // 初始位置 (x, y, z)
    velocity: [0, 0.1, 1], // 初始速度向量
    color: 0x818cf8,       // 顏色：靛藍
    mass: 30               // 質量：用於引力計算
  },
  {
    position: [-5, 0, 0],
    velocity: [0, 0.5, -2],
    color: 0xc084fc,       // 顏色：紫
    mass: 3
  },
  {
    position: [0, 5, 0],
    velocity: [-2, 0, 0],
    color: 0x67e8f9,       // 顏色：青
    mass: 2
  }
];

// === 物理模擬參數 ===
const G = 1;               // 引力常數：控制引力強度（值越大引力越強）
const dt = 0.048;          // 每一步模擬的時間步長
const STEP_MS = 1000 / 60; // 固定每 1/60 秒模擬一步，高更新率螢幕也不會變快
const MAX_FRAME_MS = 100;  // 單幀最大補償時間，避免切回分頁時一次模擬太多步
const BOUNDARY = 17;       // 邊界範圍：天體活動的最大半徑
const DAMPING = 0.5;       // 邊界反彈阻尼：能量損失係數（<1 表示反彈時損失能量）
const TRAIL_LENGTH = 400;  // 軌跡最多保留的點數

// === 畫面參數 ===
const CAMERA_RADIUS = 26;    // 相機繞行半徑
const CAMERA_HEIGHT = 12;    // 相機高度
const PARALLAX = 3;          // 滑鼠視差的最大位移
const DESKTOP_WIDTH = 1024;  // 桌機寬度以上，天體系統往右移，讓出左側給文字
const DESKTOP_SHIFT = 0.22;  // 往右移動的比例（畫面寬度）

// === 重複使用的暫存向量，避免每幀建立新物件 ===
let tempDiff: ThreeModule.Vector3;
let tempVec: ThreeModule.Vector3;
let forces: ThreeModule.Vector3[] = [];

// === 狀態 ===
let initPromise: Promise<void> | null = null;
let isVisible = false;
let lastTime = 0;
let accumulator = 0;
let visibilityObserver: IntersectionObserver | null = null;
let idleId: number | null = null;
let unmounted = false;

// 滑鼠位置（-1 ~ 1），相機會緩慢跟隨，產生視差
const mouse = { x: 0, y: 0 };
const parallax = { x: 0, y: 0 };

// === Vue 生命週期 ===
onMounted(() => {
  // Footer 接近畫面時才初始化並執行動畫，離開畫面就暫停
  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        ensureInit().then(start);
      } else {
        stop();
      }
    },
    { rootMargin: '200px 0px' }
  );
  if (footerRef.value) visibilityObserver.observe(footerRef.value);

  // 頁面載入完成後，利用瀏覽器閒置時間預先載入 three.js
  whenAppLoaded().then(() => {
    if (unmounted) return;
    const idle: (cb: () => void) => number =
      window.requestIdleCallback || ((cb) => window.setTimeout(cb, 1));
    idleId = idle(() => ensureInit());
  });

  window.addEventListener('resize', handleResize); // 監聽視窗大小變化
});

onUnmounted(() => {
  // 清理資源，防止記憶體洩漏
  unmounted = true;
  window.removeEventListener('resize', handleResize);
  visibilityObserver?.disconnect();
  if (idleId) (window.cancelIdleCallback || window.clearTimeout)(idleId);
  stop();

  if (scene) {
    // 釋放所有幾何體、材質與貼圖
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points || obj instanceof THREE.Sprite)) return;
      obj.geometry.dispose();
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((m: ThreeModule.Material & { map?: ThreeModule.Texture | null }) => {
        m.map?.dispose();
        m.dispose();
      });
    });
  }
  if (renderer) {
    renderer.dispose(); // 釋放 WebGL 資源
  }
});

/**
 * 動態載入 three.js 並初始化場景（只執行一次）
 */
function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = import('three').then((module) => {
      if (unmounted) return;
      THREE = module;
      initThree();
    });
  }
  return initPromise;
}

/**
 * 開始動畫循環
 */
function start() {
  if (unmounted || !isVisible || !renderer || animationId) return;
  // 減少動態效果：只畫一張靜態畫面
  if (prefersReducedMotion()) {
    if (scene && camera) renderer.render(scene, camera);
    return;
  }
  lastTime = performance.now();
  animationId = requestAnimationFrame(animate);
}

/**
 * 暫停動畫循環
 */
function stop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

/**
 * 產生放射狀漸層貼圖，用於天體光暈與星星（取代多層球體，邊緣更柔和）
 */
function createGlowTexture(stops: [number, string][]): ThreeModule.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 桌機版把天體系統往右移，讓左側文字區乾淨
 */
function applyViewOffset(width: number, height: number) {
  if (!camera) return;
  if (width >= DESKTOP_WIDTH) {
    camera.setViewOffset(width, height, -width * DESKTOP_SHIFT, 0, width, height);
  } else {
    camera.clearViewOffset();
  }
}

/**
 * 初始化 Three.js 場景
 */
function initThree() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const width = canvas.offsetWidth;   // Canvas 寬度
  const height = canvas.offsetHeight; // Canvas 高度

  tempDiff = new THREE.Vector3();
  tempVec = new THREE.Vector3();

  // === 創建場景 ===
  // 背景透明，由 footer 的 CSS 漸層負責底色
  const newScene = new THREE.Scene();
  scene = newScene;

  // === 創建透視相機 ===
  // 參數：視野角度(FOV)、長寬比、近裁剪面、遠裁剪面
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, CAMERA_HEIGHT, CAMERA_RADIUS);
  camera.lookAt(0, 0, 0);
  applyViewOffset(width, height);

  // === 創建 WebGL 渲染器 ===
  renderer = new THREE.WebGLRenderer({
    canvas,           // 指定 Canvas 元素
    antialias: true,  // 啟用抗鋸齒，讓邊緣更平滑
    alpha: true       // 啟用透明背景
  });
  renderer.setSize(width, height);
  // 設定像素比率，避免高 DPI 螢幕模糊（最高 2 倍）
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 添加星空背景
  addStars(newScene);

  // === 天體共用資源 ===
  const coreGeometry = new THREE.SphereGeometry(0.32, 24, 24);
  const glowTexture = createGlowTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.2, 'rgba(255,255,255,0.55)'],
    [0.5, 'rgba(255,255,255,0.12)'],
    [1, 'rgba(255,255,255,0)']
  ]);

  // === 創建三個天體 ===
  bodyParams.forEach((params) => {
    const color = new THREE.Color(params.color);
    // 質量越大，天體看起來越大
    const scale = 0.8 + Math.cbrt(params.mass) * 0.2;

    // --- 核心：接近白色，中心最亮 ---
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: color.clone().lerp(new THREE.Color(0xffffff), 0.7)
    });
    const mesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mesh.scale.setScalar(scale);
    mesh.position.fromArray(params.position);
    newScene.add(mesh);

    // --- 光暈：內層較亮、外層大而淡，使用加法混合產生發光感 ---
    [
      { size: 3.2, opacity: 1 },
      { size: 10, opacity: 0.45 }
    ].forEach(({ size, opacity }) => {
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      glow.scale.setScalar(size);
      mesh.add(glow); // 添加為子物件，會跟隨主體移動
    });

    // --- 軌跡線 ---
    // 預先配置固定大小的 buffer，之後只更新內容與繪製範圍
    const trailPositions = new Float32Array(TRAIL_LENGTH * 3);
    // RGBA：顏色固定為天體顏色，只用 alpha 做漸層
    const trailColors = new Float32Array(TRAIL_LENGTH * 4);
    const positionAttribute = new THREE.BufferAttribute(trailPositions, 3);
    const colorAttribute = new THREE.BufferAttribute(trailColors, 4);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    colorAttribute.setUsage(THREE.DynamicDrawUsage);

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', positionAttribute);
    trailGeometry.setAttribute('color', colorAttribute);
    trailGeometry.setDrawRange(0, 0);

    // 頂點 alpha 由透明漸變到不透明，背景是 CSS 漸層，因此不用加法混合
    const trailMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    const trail = new THREE.Line(trailGeometry, trailMaterial);
    trail.frustumCulled = false; // 軌跡點持續變動，不做視錐剔除
    newScene.add(trail);

    bodies.push({
      mesh,
      position: new THREE.Vector3().fromArray(params.position),
      velocity: new THREE.Vector3().fromArray(params.velocity),
      mass: params.mass,
      color,
      trailPositions,
      trailColors,
      trailCount: 0,
      coloredCount: 0
    });

    trails.push(trail);
    forces.push(new THREE.Vector3());
  });
}

/**
 * 添加星空背景：大量細小星星加上少數明亮星星，兩層製造層次
 */
function addStars(target: ThreeModule.Scene) {
  const group = new THREE.Group();
  const starTexture = createGlowTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.4, 'rgba(255,255,255,0.4)'],
    [1, 'rgba(255,255,255,0)']
  ]);

  const layers = [
    { count: 1800, size: 0.35, opacity: 0.55 },
    { count: 160, size: 0.9, opacity: 0.9 }
  ];

  layers.forEach(({ count, size, opacity }) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // 使用球面座標均勻分佈星星
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 60 + Math.random() * 40;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // 亮度與色溫略有差異：偏藍白
      const brightness = 0.6 + Math.random() * 0.4;
      colors[i * 3] = brightness * 0.9;
      colors[i * 3 + 1] = brightness * 0.93;
      colors[i * 3 + 2] = brightness;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size,
      map: starTexture,
      sizeAttenuation: true,
      transparent: true,
      opacity,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    group.add(new THREE.Points(geometry, material));
  });

  starField = group;
  target.add(group);
}

/**
 * 計算三體之間的引力
 * 結果寫入 forces 陣列（每個天體受到的總引力向量）
 */
function calculateGravity() {
  forces.forEach((force) => force.set(0, 0, 0));

  // 計算每對天體之間的引力（避免重複計算）
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      tempDiff.subVectors(bodies[j].position, bodies[i].position);
      const distance = tempDiff.length();

      // 避免除以零或距離過近導致的數值爆炸
      if (distance > 0.1) {
        // 牛頓萬有引力定律：F = G * m1 * m2 / r²
        const forceMagnitude = (G * bodies[i].mass * bodies[j].mass) / (distance * distance);
        const force = tempDiff.normalize().multiplyScalar(forceMagnitude);

        // 根據牛頓第三定律：作用力與反作用力
        forces[i].add(force);
        forces[j].sub(force);
      }
    }
  }
}

/**
 * 模擬一步：更新天體位置並記錄軌跡點
 */
function stepBodies() {
  calculateGravity();

  bodies.forEach((body, index) => {
    // 牛頓第二定律：a = F / m，v = v + a * dt
    const acceleration = forces[index].divideScalar(body.mass);
    body.velocity.addScaledVector(acceleration, dt);

    // 位置更新：s = s + v * dt
    body.position.addScaledVector(body.velocity, dt);

    // === 邊界檢測和反彈 ===
    (['x', 'y', 'z'] as const).forEach((axis) => {
      if (Math.abs(body.position[axis]) > BOUNDARY) {
        body.position[axis] = Math.sign(body.position[axis]) * BOUNDARY;
        body.velocity[axis] *= -DAMPING;
      }
    });

    // === 添加向心力（讓天體傾向於回到中心）===
    const distanceFromCenter = body.position.length();
    if (distanceFromCenter > BOUNDARY * 0.7) {
      tempVec.copy(body.position).normalize().multiplyScalar(-0.5);
      body.velocity.addScaledVector(tempVec, dt);
    }

    // === 記錄軌跡點 ===
    const buffer = body.trailPositions;
    if (body.trailCount < TRAIL_LENGTH) {
      body.trailCount++;
    } else {
      // 已滿：整段往前移一個點，移除最舊的點
      buffer.copyWithin(0, 3);
    }
    body.position.toArray(buffer, (body.trailCount - 1) * 3);
  });
}

/**
 * 依目前點數重算軌跡漸層：最舊的點透明，越接近天體越不透明
 */
function updateTrailColors(body: Body) {
  const count = body.trailCount;
  const colors = body.trailColors;
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / count;
    colors[i * 4] = body.color.r;
    colors[i * 4 + 1] = body.color.g;
    colors[i * 4 + 2] = body.color.b;
    colors[i * 4 + 3] = t * t;
  }
  body.coloredCount = count;
}

/**
 * 同步網格位置與軌跡線到 GPU
 */
function syncBodies() {
  bodies.forEach((body, index) => {
    body.mesh.position.copy(body.position);

    const geometry = trails[index].geometry;
    geometry.attributes.position.needsUpdate = true;
    if (body.coloredCount !== body.trailCount) {
      updateTrailColors(body);
      geometry.attributes.color.needsUpdate = true;
    }
    geometry.setDrawRange(0, body.trailCount);
  });
}

/**
 * 動畫循環
 */
function animate(now: number) {
  if (!renderer || !scene || !camera) return;
  animationId = requestAnimationFrame(animate);

  // 依實際經過時間，以固定步長推進物理模擬
  accumulator += Math.min(now - lastTime, MAX_FRAME_MS);
  lastTime = now;
  while (accumulator >= STEP_MS) {
    stepBodies();
    accumulator -= STEP_MS;
  }
  syncBodies();

  // === 相機緩慢繞行，並跟隨滑鼠產生視差 ===
  const time = Date.now() * 0.00005;
  parallax.x += (mouse.x * PARALLAX - parallax.x) * 0.04;
  parallax.y += (mouse.y * PARALLAX - parallax.y) * 0.04;
  camera.position.set(
    Math.sin(time) * CAMERA_RADIUS + parallax.x,
    CAMERA_HEIGHT + parallax.y,
    Math.cos(time) * CAMERA_RADIUS
  );
  camera.lookAt(0, 0, 0);

  if (starField) starField.rotation.y = time * 0.3;

  renderer.render(scene, camera);
}

/**
 * 滑鼠移動：換算成 -1 ~ 1 的座標
 */
function handleMouseMove(e: MouseEvent) {
  const footer = footerRef.value;
  if (!footer) return;
  const rect = footer.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
}

function handleMouseLeave() {
  mouse.x = 0;
  mouse.y = 0;
}

/**
 * 處理視窗大小變化
 */
function handleResize() {
  const canvas = canvasRef.value;
  if (!canvas || !camera || !renderer) return; // 確保所有物件都已初始化

  const parent = canvas.parentElement;
  if (!parent) return;
  const width = parent.clientWidth;
  const height = parent.clientHeight;

  // 更新相機長寬比與投影矩陣
  camera.aspect = width / height;
  applyViewOffset(width, height);
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
</script>

<style scoped>
canvas {
  pointer-events: none; /* 禁用 Canvas 的滑鼠事件，讓下層元素可以被點擊 */
}
</style>
