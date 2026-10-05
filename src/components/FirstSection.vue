<!-- components/FirstSection.vue -->
<template>
  <section
    id="top"
    class="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden p-4"
  >
    <!-- 背景：極光色塊 + 格線 + 粒子網路 -->
    <HeroBackground />

    <!-- 內容 -->
    <div class="max-w-4xl text-center px-6 relative z-10">
      <div class="mb-8">
        <div
          ref="avatarRef"
          class="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-6 opacity-0 scale-0 rounded-full overflow-hidden ring-4 ring-white shadow-xl shadow-indigo-900/10"
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

      <p
        ref="roleRef"
        class="inline-flex flex-wrap justify-center gap-x-2 text-sm sm:text-base font-medium text-indigo-700 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-2xl sm:rounded-full mb-6 opacity-0"
      >
        <span>{{ profile.role }}</span>
        <span aria-hidden="true" class="text-indigo-300">|</span>
        <span>{{ profile.experience }}</span>
        <!-- 手機版技術焦點換到第二行 -->
        <span aria-hidden="true" class="hidden sm:inline text-indigo-300">|</span>
        <span class="w-full sm:w-auto">{{ profile.focus }}</span>
      </p>

      <p class="description text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
        <span class="sr-only">{{ DESC_TEXT }}</span>
        <span ref="descRef" aria-hidden="true"></span>
      </p>

      <div
        ref="buttonsRef"
        class="opacity-0"
      >
        <!-- 主要行動按鈕：同尺寸、主次分明 -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#projects"
            class="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gray-900 text-white font-medium shadow-lg shadow-indigo-900/10 hover:bg-indigo-700 transition-colors duration-300"
          >
            查看作品
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </a>
          <a
            href="#skills"
            class="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white/70 backdrop-blur-sm border border-gray-300 text-gray-800 font-medium hover:border-gray-900 hover:text-gray-900 transition-colors duration-300"
          >
            技能介紹
          </a>
        </div>

        <!-- 次要連結：社群與聯絡方式 -->
        <div class="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors"
          >
            <GithubIcon class="w-4 h-4" />
            GitHub
          </a>
          <span class="w-px h-4 bg-gray-300" aria-hidden="true"></span>
          <a
            :href="`mailto:${profile.email}`"
            class="inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
            </svg>
            Email
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import me from "../assets/me.webp";
import { whenAppLoaded } from "../utils/appLoaded";
import { prefersReducedMotion } from "../utils/motion";
import { profile } from "../data/profile";
import GithubIcon from "./GithubIcon.vue";
import HeroBackground from "./HeroBackground.vue";

// 註冊 GSAP TextPlugin
gsap.registerPlugin(TextPlugin);

// 打字動畫文字（同時提供給螢幕閱讀器）
const TITLE_TEXT = "Hello, 我是 ";
const TITLE_NAME = profile.name;
const DESC_TEXT =
  "熱愛創造優雅的網頁體驗，專注於前端開發與使用者介面設計。\n用程式碼實現創意，讓每個專案都充滿生命力。";

// GSAP 文字動畫 refs
const titleTextRef = ref<HTMLElement | null>(null);
const titleSpanRef = ref<HTMLElement | null>(null);
const descRef = ref<HTMLElement | null>(null);
const buttonsRef = ref<HTMLElement | null>(null);
const roleRef = ref<HTMLElement | null>(null);
const avatarRef = ref<HTMLElement | null>(null);

let textTimeline: gsap.core.Timeline | null = null;
let textDelayId: ReturnType<typeof setTimeout> | undefined;
let unmounted = false;

// ========== GSAP 文字動畫 ==========
const initTextAnimation = () => {
  // 創建時間軸，讓動畫依序執行
  textTimeline = gsap.timeline({
    defaults: { ease: "power2.out" },
  });

  // 0. 頭像圓形：從小到大彈出
  textTimeline
    .to(avatarRef.value, {
      duration: 0.6,
      opacity: 1,
      scale: 1,
      ease: "back.out(1.7)",
    })

    // 1. 標題第一部分：「Hello, 我是 」
    .to(
      titleTextRef.value,
      {
        duration: 0.6,
        text: TITLE_TEXT,
        ease: "none",
      },
      "-=0.3"
    ) // 在頭像動畫快結束時開始

    // 2. 標題第二部分（漸變文字）：「邦晉」
    .to(
      titleSpanRef.value,
      {
        duration: 0.3,
        text: TITLE_NAME,
        ease: "none",
      },
      "-=0.3"
    )

    // 3. 職稱標籤淡入
    .to(roleRef.value, { duration: 0.4, opacity: 1 }, "-=0.1")

    // 4. 描述段落（分兩行）
    .to(
      descRef.value,
      {
        duration: 1.2,
        text: DESC_TEXT,
        ease: "none",
      },
      "<"
    )

    // 5. 按鈕與描述同時淡入，不必等打字結束
    .to(
      buttonsRef.value,
      {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "back.out(1.7)",
      },
      "<"
    );
};

// 減少動態效果：直接顯示完整內容，不播放動畫
const showStatic = () => {
  if (titleTextRef.value) titleTextRef.value.textContent = TITLE_TEXT;
  if (titleSpanRef.value) titleSpanRef.value.textContent = TITLE_NAME;
  if (descRef.value) descRef.value.textContent = DESC_TEXT;
  for (const el of [avatarRef.value, roleRef.value, buttonsRef.value]) {
    if (!el) continue;
    el.style.opacity = "1";
    el.style.transform = "none";
  }
};

// ========== Vue 生命週期 ==========
onMounted(() => {
  if (prefersReducedMotion()) {
    showStatic();
    return;
  }

  // 等 Loading 畫面結束（頁面可見）後再開始文字動畫，
  // 延遲一點點讓背景先出現
  whenAppLoaded().then(() => {
    if (unmounted) return;
    textDelayId = setTimeout(initTextAnimation, 300);
  });
});

onUnmounted(() => {
  unmounted = true;
  clearTimeout(textDelayId);

  // 清理 GSAP 動畫
  textTimeline?.kill();
});
</script>

<style scoped>
/* 保持描述文字的換行 */
.description {
  white-space: pre-line;
}
</style>