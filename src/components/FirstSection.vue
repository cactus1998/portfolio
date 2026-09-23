<!-- components/FirstSection.vue -->
<template>
  <section
    class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-50 to-blue-300 relative overflow-hidden p-4"
  >
    <!-- Canvas 雪花背景 -->
    <canvas ref="snowCanvas" class="absolute inset-0 w-full h-full"></canvas>

    <!-- 內容 -->
    <div class="max-w-4xl text-center px-6 relative z-10">
      <div class="mb-8">
        <div
          ref="avatarRef"
          class="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-6 opacity-0 scale-0 rounded-full overflow-hidden"
        >
          <img
            :src="me"
            alt="個人照片"
            @contextmenu.prevent
            draggable="false"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <h1
        class="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
      >
        <!-- 完整文字給螢幕閱讀器與搜尋引擎，畫面上的打字效果標記為 aria-hidden -->
        <span class="sr-only">{{ TITLE_TEXT }}{{ TITLE_NAME }}</span>
        <span ref="titleTextRef" aria-hidden="true"></span
        ><span
          ref="titleSpanRef"
          aria-hidden="true"
          class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
        ></span>
      </h1>

      <p class="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
        <span class="sr-only">{{ DESC_TEXT }}</span>
        <span ref="descRef" aria-hidden="true"></span>
      </p>

      <div
        ref="buttonsRef"
        class="flex flex-col sm:flex-row gap-4 justify-center opacity-0"
      >
        <a
          href="#projects"
          class="w-full sm:w-auto px-8 py-3 border-2 bg-black text-white rounded-full hover:bg-transparent hover:text-black hover:border-black hover:border-2 transition duration-300"
        >
          查看作品
        </a>
        <a
          href="#skills"
          class="w-full sm:w-auto px-8 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition duration-300"
        >
          技能介紹
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import me from "../assets/me.webp";
import { whenAppLoaded } from "../utils/appLoaded";

// 註冊 GSAP TextPlugin
gsap.registerPlugin(TextPlugin);

// 打字動畫文字（同時提供給螢幕閱讀器）
const TITLE_TEXT = "Hello, 我是 ";
const TITLE_NAME = "邦晉";
const DESC_TEXT =
  "熱愛創造優雅的網頁體驗，專注於前端開發與使用者介面設計。\n用程式碼實現創意，讓每個專案都充滿生命力。";

// Canvas 相關 refs
const snowCanvas = ref(null);
let ctx = null;
let snowflakes = [];
let animationId = null;
let mouseX = -9999;
let mouseY = -9999;
let resizeObserver = null;
let visibilityObserver = null;
let section = null;
let targetSnowflakeCount = 120;
let currentSnowflakeCount = 0;
let snowflakeSpawnRate = 1;

// Canvas 邏輯尺寸（CSS px）與像素比
let width = 0;
let height = 0;
let dpr = 1;

// GSAP 文字動畫 refs
const titleTextRef = ref(null);
const titleSpanRef = ref(null);
const descRef = ref(null);
const buttonsRef = ref(null);
const avatarRef = ref(null);

let textTimeline = null;
let textDelayId = null;
let unmounted = false;

// ========== 雪花圖片快取 ==========
// shadowBlur 每幀逐顆計算很吃效能，改為預先畫好帶光暈的雪花，之後直接 drawImage
const SHADOW_BLUR = 10;
const SPRITE_PADDING = 16;
const spriteCache = new Map();

const getSprite = (radius, opacity) => {
  const key = `${radius}-${opacity}-${dpr}`;
  let sprite = spriteCache.get(key);
  if (sprite) return sprite;

  const half = radius + SPRITE_PADDING;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = Math.ceil(half * 2 * dpr);
  const spriteCtx = canvas.getContext("2d");
  spriteCtx.scale(dpr, dpr);
  spriteCtx.beginPath();
  spriteCtx.arc(half, half, radius, 0, Math.PI * 2);
  spriteCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  // shadowBlur 不受 transform 影響，需自行乘上像素比
  spriteCtx.shadowBlur = SHADOW_BLUR * dpr;
  spriteCtx.shadowColor = "rgba(255, 255, 255, 0.8)";
  spriteCtx.fill();

  sprite = { canvas, half };
  spriteCache.set(key, sprite);
  return sprite;
};

// ========== 雪花類別 ==========
class Snowflake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * -100;
    // 半徑與透明度量化，讓預先畫好的雪花圖片可以重複使用
    this.radius = Math.round((Math.random() * 4 + 2) * 2) / 2;
    this.speed = Math.random() * 1 + 0.5;
    this.wind = Math.random() * 0.5 - 0.25;
    this.opacity = Math.round((Math.random() * 0.6 + 0.4) * 20) / 20;
  }

  update() {
    this.y += this.speed;
    this.x += this.wind;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 120 && distance > 0) {
      const force = (120 - distance) / 120;
      this.x += dx * force * 0.03;
      this.y += dy * force * 0.03;
    }

    if (this.y > height + 10) {
      this.reset();
    }

    if (this.x > width + 10) {
      this.x = -10;
    } else if (this.x < -10) {
      this.x = width + 10;
    }
  }

  draw(ctx) {
    const { canvas, half } = getSprite(this.radius, this.opacity);
    ctx.drawImage(canvas, this.x - half, this.y - half, half * 2, half * 2);
  }
}

// ========== 滑鼠互動 ==========
const handleMouseMove = (e) => {
  const rect = section.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
};

const handleMouseLeave = () => {
  mouseX = -9999;
  mouseY = -9999;
};

// ========== 動畫循環 ==========
const animate = () => {
  ctx.clearRect(0, 0, width, height);

  if (currentSnowflakeCount < targetSnowflakeCount) {
    const toAdd = Math.min(
      snowflakeSpawnRate,
      targetSnowflakeCount - currentSnowflakeCount
    );

    for (let i = 0; i < toAdd; i++) {
      snowflakes.push(new Snowflake());
      currentSnowflakeCount++;
    }
  }

  snowflakes.forEach((snowflake) => {
    snowflake.update();
    snowflake.draw(ctx);
  });

  animationId = requestAnimationFrame(animate);
};

const startSnow = () => {
  if (!animationId) animationId = requestAnimationFrame(animate);
};

const stopSnow = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

// ========== 初始化雪花系統 ==========
const initSnow = () => {
  const canvas = snowCanvas.value;
  if (!canvas) return;

  ctx = canvas.getContext("2d");

  const resize = () => {
    const newDpr = Math.min(window.devicePixelRatio || 1, 2);
    if (newDpr !== dpr) spriteCache.clear();
    dpr = newDpr;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    // 依像素比放大實際解析度，高 DPI 螢幕才不會模糊
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  snowflakes = [];
  currentSnowflakeCount = 0;

  section = canvas.parentElement;
  section.addEventListener("mousemove", handleMouseMove);
  section.addEventListener("mouseleave", handleMouseLeave);

  // 首頁區塊不在畫面上時暫停動畫，節省效能
  visibilityObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) startSnow();
    else stopSnow();
  });
  visibilityObserver.observe(section);

  startSnow();
};

// ========== GSAP 文字動畫 ==========
const initTextAnimation = () => {
  // 創建時間軸，讓動畫依序執行
  textTimeline = gsap.timeline({
    defaults: { ease: "power2.out" },
  });

  // 0. 頭像圓形：從小到大彈出
  textTimeline
    .to(avatarRef.value, {
      duration: 0.8,
      opacity: 1,
      scale: 1,
      ease: "back.out(1.7)",
    })

    // 1. 標題第一部分：「Hello, 我是 」
    .to(
      titleTextRef.value,
      {
        duration: 1,
        text: TITLE_TEXT,
        ease: "none",
      },
      "-=0.3"
    ) // 在頭像動畫快結束時開始

    // 2. 標題第二部分（漸變文字）：「邦晉」
    .to(
      titleSpanRef.value,
      {
        duration: 0.5,
        text: TITLE_NAME,
        ease: "none",
      },
      "-=0.3"
    )

    // 3. 描述段落（分兩行）
    .to(
      descRef.value,
      {
        duration: 2,
        text: DESC_TEXT,
        ease: "none",
      },
      "-=0.3"
    )

    // 4. 按鈕淡入
    .to(
      buttonsRef.value,
      {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    );
};

// ========== Vue 生命週期 ==========
onMounted(() => {
  initSnow();

  // 等 Loading 畫面結束（頁面可見）後再開始文字動畫，
  // 延遲一點點讓雪花先出現
  whenAppLoaded().then(() => {
    if (unmounted) return;
    textDelayId = setTimeout(initTextAnimation, 300);
  });
});

onUnmounted(() => {
  unmounted = true;
  stopSnow();
  clearTimeout(textDelayId);

  resizeObserver?.disconnect();
  visibilityObserver?.disconnect();

  if (section) {
    section.removeEventListener("mousemove", handleMouseMove);
    section.removeEventListener("mouseleave", handleMouseLeave);
  }

  // 清理 GSAP 動畫
  textTimeline?.kill();
  spriteCache.clear();
});
</script>

<style scoped>
/* 保持描述文字的換行 */
p {
  white-space: pre-line;
}
</style>