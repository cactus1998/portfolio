<template>
  <footer class="relative bg-gray-900 h-[650px] text-white overflow-hidden">
    <!-- Three.js Canvas 背景 -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <!-- Footer 內容（置中且重疊於背景上） -->
    <div
      class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
    >
      <div class="max-w-4xl w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 class="text-2xl font-bold mb-4">關於我</h3>
            <p class="text-gray-300">
              感謝瀏覽，如有任何合作機會，歡迎來信詢問！
            </p>
          </div>
          <div>
            <h3 class="text-2xl font-bold mb-4">聯絡方式</h3>
            <ul class="space-y-2 text-gray-300">
              <li>
                  s770880qq@gmail.com
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-6 text-gray-400">
          <p>© 2025 Designed & Developed by ME.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

// === Vue 響應式變數 ===
const canvasRef = ref(null); // Canvas DOM 元素引用

// === Three.js 核心物件 ===
let scene;        // 場景：所有 3D 物件的容器
let camera;       // 相機：定義觀察視角
let renderer;     // 渲染器：將場景渲染到 Canvas 上
let animationId;  // 動畫循環 ID，用於取消動畫

// === 三體系統數據 ===
let bodies = [];  // 存儲三個天體的資訊（位置、速度、網格等）
let trails = [];  // 存儲三個天體的軌跡線條

// === 三體初始參數 ===
const bodyParams = [
  { 
    position: new THREE.Vector3(5, 0, 0),  // 初始位置 (x, y, z)
    velocity: new THREE.Vector3(0, 0.1, 1), // 初始速度向量
    color: 0x00ffff,                        // 顏色：青色 (十六進制)
    mass: 30                               // 質量：用於引力計算
  },
  { 
    position: new THREE.Vector3(-5, 0, 0), 
    velocity: new THREE.Vector3(0, 0.5, -2),
    color: 0xff6b6b,                        // 顏色：紅色
    mass: 3
  },
  { 
    position: new THREE.Vector3(0, 5, 0), 
    velocity: new THREE.Vector3(-2, 0, 0),
    color: 0xffd93d,                        // 顏色：黃色
    mass: 2
  }
];

// === 物理模擬參數 ===
const G = 1;           // 引力常數：控制引力強度（值越大引力越強）
const dt = 0.048;        // 時間步長：約 60fps (1/60 秒)
const BOUNDARY = 17;     // 邊界範圍：天體活動的最大半徑
const DAMPING = 0.5;    // 邊界反彈阻尼：能量損失係數（<1 表示反彈時損失能量）

// === Vue 生命週期 ===
onMounted(() => {
  initThree();  // 初始化 Three.js
  animate();    // 開始動畫循環
  window.addEventListener('resize', handleResize); // 監聽視窗大小變化
});

onUnmounted(() => {
  // 清理資源，防止記憶體洩漏
  window.removeEventListener('resize', handleResize);
  if (animationId) {
    cancelAnimationFrame(animationId); // 取消動畫循環
  }
  if (renderer) {
    renderer.dispose(); // 釋放 WebGL 資源
  }
});

/**
 * 初始化 Three.js 場景
 */
function initThree() {
  const canvas = canvasRef.value;
  const width = canvas.offsetWidth;   // Canvas 寬度
  const height = canvas.offsetHeight; // Canvas 高度

  // === 創建場景 ===
  scene = new THREE.Scene();
  // background: 場景背景色（深黑色）
  scene.background = new THREE.Color(0x0a0a0a);

  // === 創建透視相機 ===
  // 參數：視野角度(FOV)、長寬比、近裁剪面、遠裁剪面
  camera = new THREE.PerspectiveCamera(
    75,              // FOV：視野角度，越大看到的範圍越廣
    width / height,  // aspect：長寬比，通常是 canvas 的寬高比
    0.1,             // near：近裁剪面，小於此距離的物體不會被渲染
    1000             // far：遠裁剪面，大於此距離的物體不會被渲染
  );
  // 設定相機位置 (x, y, z)
  camera.position.set(0, 15, 25);
  // 讓相機看向場景中心
  camera.lookAt(0, 0, 0);

  // === 創建 WebGL 渲染器 ===
  renderer = new THREE.WebGLRenderer({ 
    canvas,           // 指定 Canvas 元素
    antialias: true,  // 啟用抗鋸齒，讓邊緣更平滑
    alpha: true       // 啟用透明背景
  });
  // 設定渲染器大小
  renderer.setSize(width, height);
  // 設定像素比率，避免高 DPI 螢幕模糊（最高 2 倍）
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 添加星空背景
  addStars();

  // === 創建三個天體 ===
  bodyParams.forEach((params, index) => {
    // --- 主體球體 ---
    // SphereGeometry(半徑, 水平分段數, 垂直分段數)
    // 分段數越高，球體越圓滑，但性能消耗越大
    const geometry = new THREE.SphereGeometry(0.6, 18, 18);
    
    // MeshBasicMaterial：基礎材質，不受光照影響
    const material = new THREE.MeshBasicMaterial({ 
      color: params.color  // 設定顏色
    });
    
    // 創建網格物件（Geometry + Material）
    const mesh = new THREE.Mesh(geometry, material);
    
    // 設定初始位置
    mesh.position.copy(params.position);
    // 將網格添加到場景中
    scene.add(mesh);

    // --- 第一層光暈（較亮、較小）---
    const glow1Geometry = new THREE.SphereGeometry(1.0, 32, 32);
    const glow1Material = new THREE.MeshBasicMaterial({
      color: params.color,
      transparent: true,            // 啟用透明度
      opacity: 0.5,                // 不透明度 (0-1)
      blending: THREE.AdditiveBlending, // 加法混合：顏色相加，產生發光效果
      depthWrite: false             // 禁用深度寫入，避免遮擋其他透明物體
    });
    const glow1 = new THREE.Mesh(glow1Geometry, glow1Material);
    glow1.renderOrder = 1; // 渲染順序：數字越小越先渲染
    mesh.add(glow1);       // 添加為子物件，會跟隨主體移動

    // --- 第二層光暈（較淡、較大）---
    const glow2Geometry = new THREE.SphereGeometry(1.6, 32, 32);
    const glow2Material = new THREE.MeshBasicMaterial({
      color: params.color,
      transparent: true,
      opacity: 0.2,                // 更淡的不透明度
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glow2 = new THREE.Mesh(glow2Geometry, glow2Material);
    glow2.renderOrder = 1;
    mesh.add(glow2);

    // --- 第三層光暈（最淡、最大，模擬星體輻射）---
    const glow3Geometry = new THREE.SphereGeometry(2.4, 32, 32);
    const glow3Material = new THREE.MeshBasicMaterial({
      color: params.color,
      transparent: true,
      opacity: 0.06,                // 最淡的不透明度
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glow3 = new THREE.Mesh(glow3Geometry, glow3Material);
    glow3.renderOrder = 1;
    mesh.add(glow3);

    // --- 創建軌跡線 ---
    // BufferGeometry：高效能幾何體，用於自定義形狀
    const trailGeometry = new THREE.BufferGeometry();
    
    // LineBasicMaterial：線條材質
    const trailMaterial = new THREE.LineBasicMaterial({
      color: params.color,
      transparent: true,
      opacity: 0.5,
      depthWrite: false, // 禁用深度寫入，避免被光暈遮擋
      depthTest: true    // 啟用深度測試，仍然會被實體物件遮擋
    });
    
    // Line：線條物件
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    trail.renderOrder = 999; // 設定最高渲染優先級，確保軌跡最後繪製
    scene.add(trail);

    // 將天體資訊存入陣列
    bodies.push({
      mesh,                               // 網格物件
      position: params.position.clone(),  // 當前位置（克隆以避免引用）
      velocity: params.velocity.clone(),  // 當前速度
      mass: params.mass,                  // 質量
      trailPositions: []                  // 軌跡點陣列
    });

    trails.push(trail); // 存儲軌跡線
  });

  // === 添加環境光 ===
  // AmbientLight：均勻照亮場景中的所有物體
  const ambientLight = new THREE.AmbientLight(0x404040); // 暗灰色環境光
  scene.add(ambientLight);
}

/**
 * 添加星空背景
 */
function addStars() {
  // BufferGeometry：用於創建點雲
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 3000; // 星星數量
  
  // Float32Array：高效能的浮點數陣列
  const positions = new Float32Array(starCount * 3); // 每個點 3 個座標 (x, y, z)
  const sizes = new Float32Array(starCount);         // 每個點的大小
  const colors = new Float32Array(starCount * 3);    // 每個點的顏色 (r, g, b)

  // 使用球面座標均勻分佈星星
  for (let i = 0; i < starCount; i++) {
    // theta：水平角度 (0 到 2π)
    const theta = Math.random() * Math.PI * 2;
    // phi：垂直角度 (0 到 π)，使用 acos 實現均勻分佈
    const phi = Math.acos(Math.random() * 2 - 1);
    // radius：距離中心的半徑 (50-90)
    const radius = 50 + Math.random() * 40;

    // 球面座標轉換為笛卡爾座標
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
    positions[i * 3 + 2] = radius * Math.cos(phi);                   // z

    // 大小：固定較小的範圍 (0.05-0.15)，避免星星過大
    sizes[i] = 0.05 + Math.random() * 0.1;

    // 顏色：模擬星星的色溫變化（藍白到橙白）
    const colorTemp = 0.85 + Math.random() * 0.15;
    colors[i * 3] = colorTemp;       // R
    colors[i * 3 + 1] = colorTemp * 0.95; // G (稍微降低綠色)
    colors[i * 3 + 2] = 1.0;         // B (藍色保持最高)
  }

  // 設定幾何體屬性
  // BufferAttribute：將數據綁定到幾何體
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // 3 個值一組
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));         // 1 個值一組
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));       // 3 個值一組

  // PointsMaterial：點材質
  const starMaterial = new THREE.PointsMaterial({
    size: 0.1,              // 基礎大小
    sizeAttenuation: true,  // 啟用距離衰減：遠的星星看起來更小
    transparent: true,      // 啟用透明度
    opacity: 0.9,           // 不透明度
    vertexColors: true,     // 使用頂點顏色（每個點有自己的顏色）
    blending: THREE.AdditiveBlending // 加法混合：產生發光效果
  });

  // Points：點雲物件
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

/**
 * 計算三體之間的引力
 * @returns {Array} 每個天體受到的總引力向量陣列
 */
function calculateGravity() {
  // 初始化力陣列，每個天體一個零向量
  const forces = bodies.map(() => new THREE.Vector3());

  // 計算每對天體之間的引力（避免重複計算）
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      // 計算兩天體之間的位置差向量
      const diff = new THREE.Vector3().subVectors(
        bodies[j].position,
        bodies[i].position
      );
      
      // 計算距離（向量長度）
      const distance = diff.length();
      
      // 避免除以零或距離過近導致的數值爆炸
      if (distance > 0.1) {
        // 牛頓萬有引力定律：F = G * m1 * m2 / r²
        const forceMagnitude = (G * bodies[i].mass * bodies[j].mass) / (distance * distance);
        
        // 單位方向向量
        const forceDirection = diff.normalize();
        
        // 力向量 = 方向 × 大小
        const force = forceDirection.multiplyScalar(forceMagnitude);

        // 根據牛頓第三定律：作用力與反作用力
        forces[i].add(force);  // 天體 i 受力指向天體 j
        forces[j].sub(force);  // 天體 j 受力指向天體 i（反方向）
      }
    }
  }

  return forces;
}

/**
 * 更新天體位置和軌跡
 */
function updateBodies() {
  const forces = calculateGravity();

  bodies.forEach((body, index) => {
    // === 更新速度 ===
    // 牛頓第二定律：F = m * a，因此 a = F / m
    const acceleration = forces[index].divideScalar(body.mass);
    // 速度更新：v = v + a * dt
    body.velocity.add(acceleration.multiplyScalar(dt));

    // === 更新位置 ===
    // 位置更新：s = s + v * dt
    body.position.add(body.velocity.clone().multiplyScalar(dt));

    // === 邊界檢測和反彈 ===
    ['x', 'y', 'z'].forEach(axis => {
      if (Math.abs(body.position[axis]) > BOUNDARY) {
        // 將位置限制在邊界內
        body.position[axis] = Math.sign(body.position[axis]) * BOUNDARY;
        // 反轉速度並添加阻尼（模擬能量損失）
        body.velocity[axis] *= -DAMPING;
      }
    });

    // === 添加向心力（讓天體傾向於回到中心）===
    const distanceFromCenter = body.position.length(); // 距離中心的距離
    if (distanceFromCenter > BOUNDARY * 0.7) { // 當距離超過邊界的 70%
      // 計算指向中心的力
      const centerForce = body.position.clone().normalize().multiplyScalar(-0.5);
      body.velocity.add(centerForce.multiplyScalar(dt));
    }

    // 同步網格位置
    body.mesh.position.copy(body.position);

    // === 更新軌跡 ===
    body.trailPositions.push(body.position.clone()); // 添加當前位置到軌跡
    if (body.trailPositions.length > 400) { // 限制軌跡長度（400 點）
      body.trailPositions.shift(); // 移除最舊的點
    }

    // === 更新軌跡線幾何體 ===
    // 將 Vector3 陣列轉換為 Float32Array
    const positions = new Float32Array(body.trailPositions.length * 3);
    body.trailPositions.forEach((pos, i) => {
      positions[i * 3] = pos.x;     // x
      positions[i * 3 + 1] = pos.y; // y
      positions[i * 3 + 2] = pos.z; // z
    });

    // 更新幾何體的 position 屬性
    trails[index].geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
  });
}

/**
 * 動畫循環
 */
function animate() {
  // 請求下一幀動畫（約 60fps）
  animationId = requestAnimationFrame(animate);

  // 更新天體物理模擬
  updateBodies();

  // === 相機緩慢旋轉 ===
  // 使用時間計算旋轉角度
  const time = Date.now() * 0.00005; // 時間係數：越小旋轉越慢
  // 相機在 XZ 平面上做圓周運動
  camera.position.x = Math.sin(time) * 25; // x = r * sin(θ)
  camera.position.z = Math.cos(time) * 25; // z = r * cos(θ)
  // 相機始終看向場景中心
  camera.lookAt(0, 0, 0);

  // 渲染場景
  renderer.render(scene, camera);
}

/**
 * 處理視窗大小變化
 */
function handleResize() {
  const canvas = canvasRef.value;
  if (!canvas || !camera || !renderer) return; // 確保所有物件都已初始化
  
  // 強制瀏覽器重新計算佈局
  const width = canvas.parentElement.clientWidth;
  const height = canvas.parentElement.clientHeight;

  // 更新相機長寬比
  camera.aspect = width / height;
  // 更新相機投影矩陣（長寬比改變後必須調用）
  camera.updateProjectionMatrix();
  
  // 更新渲染器大小
  renderer.setSize(width, height);
  // 更新像素比率（處理不同 DPI 的螢幕）
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
</script>

<style scoped>
footer {
  position: relative;
}

canvas {
  pointer-events: none; /* 禁用 Canvas 的滑鼠事件，讓下層元素可以被點擊 */
}
</style>