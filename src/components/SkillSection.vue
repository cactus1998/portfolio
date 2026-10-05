<!-- components/SkillSection.vue -->
<template>
  <section id="skills" class="relative overflow-hidden min-h-screen py-20 lg:py-28 px-6 bg-slate-50">
    <!-- 背景裝飾：點狀網格 + 柔和色塊 -->
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-60"
      aria-hidden="true"
    ></div>
    <div class="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-200/50 blur-3xl" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -bottom-40 -right-24 w-[30rem] h-[30rem] rounded-full bg-violet-200/40 blur-3xl" aria-hidden="true"></div>

    <div class="relative max-w-7xl mx-auto">
      <SectionHeader eyebrow="Skills" title="技術能力" subtitle="工作與專案中實際使用的技術" />

      <!-- 主力技術 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div
          v-for="core in coreSkills"
          :key="core.name"
          class="group flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300"
        >
          <div
            class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center"
            :style="{ backgroundColor: `#${core.hex}1f` }"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" :fill="`#${core.hex}`" aria-hidden="true">
              <path :d="core.path" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ core.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ core.note }}</p>
          </div>
        </div>
      </div>

      <!-- 技能卡區（Bento 排版：寬窄交錯） -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          v-for="(block, index) in skillBlocks"
          :key="block.id"
          :class="['skill-card opacity-0', LAYOUT[index] ?? '']"
          :data-index="index"
          ref="cardRefs"
        >
          <div class="relative h-full overflow-hidden bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 lg:p-8">
            <!-- 頂部強調色線條 -->
            <div :class="['absolute inset-x-0 top-0 h-1 bg-gradient-to-r', ACCENTS[block.accent].bar]" aria-hidden="true"></div>
            <!-- 角落大圖示裝飾 -->
            <svg
              :class="['pointer-events-none absolute -right-6 -bottom-6 w-40 h-40', ACCENTS[block.accent].watermark]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" :d="ICON_PATHS[block.icon]" />
            </svg>

            <div class="relative">
              <div class="flex items-start gap-4 mb-6">
                <div :class="['w-11 h-11 shrink-0 rounded-xl flex items-center justify-center', ACCENTS[block.accent].icon]">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="ICON_PATHS[block.icon]" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ block.title }}</h3>
                  <p class="mt-1 text-sm text-gray-500">{{ block.summary }}</p>
                </div>
              </div>

              <dl :class="['grid gap-5', GROUP_COLUMNS[index] ?? '']">
                <div v-for="group in block.skills" :key="group.label">
                  <dt class="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2.5">
                    <span :class="['w-1.5 h-1.5 rounded-full', ACCENTS[block.accent].dot]" aria-hidden="true"></span>
                    {{ group.label }}
                  </dt>
                  <dd class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in group.tags"
                      :key="tag"
                      :class="[
                        'px-2.5 py-1 text-xs font-medium rounded-md border border-gray-200 bg-gray-50 text-gray-700 transition-colors duration-200',
                        ACCENTS[block.accent].tag
                      ]"
                    >
                      {{ tag }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { skillBlocks, coreSkills } from '../data/skills'
import { prefersReducedMotion } from '../utils/motion'
import SectionHeader from './SectionHeader.vue'
import type { SkillAccent, SkillIcon } from '../types'

// Bento 排版：第一列 前端（寬）+ 後端（窄），第二列 工具（寬）+ 其他（窄）
const LAYOUT = ['lg:col-span-2', '', 'lg:col-span-2', '']
// 寬卡片內的分組改為兩欄
const GROUP_COLUMNS = ['', '', 'sm:grid-cols-2', '']

// 各強調色的完整 class（寫成完整字串，Tailwind 才掃描得到）
const ACCENTS: Record<SkillAccent, { bar: string; icon: string; dot: string; tag: string; watermark: string }> = {
  indigo: {
    bar: 'from-indigo-500 to-sky-400',
    icon: 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100',
    dot: 'bg-indigo-500',
    tag: 'hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700',
    watermark: 'text-indigo-50'
  },
  emerald: {
    bar: 'from-emerald-500 to-teal-400',
    icon: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
    dot: 'bg-emerald-500',
    tag: 'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700',
    watermark: 'text-emerald-50'
  },
  violet: {
    bar: 'from-violet-500 to-fuchsia-400',
    icon: 'bg-violet-50 text-violet-600 ring-1 ring-violet-100',
    dot: 'bg-violet-500',
    tag: 'hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700',
    watermark: 'text-violet-50'
  },
  amber: {
    bar: 'from-amber-500 to-orange-400',
    icon: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100',
    dot: 'bg-amber-500',
    tag: 'hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700',
    watermark: 'text-amber-50'
  }
}

// Heroicons outline 路徑
const ICON_PATHS: Record<SkillIcon, string> = {
  code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  server: 'M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z',
  tools: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z',
  spark: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z'
}

const cardRefs = ref<HTMLElement[]>([])
let observer: IntersectionObserver | null = null

// 進場動畫：輕微上移淡入，依卡片順序錯開
const ENTER_OFFSET_Y = 24
const STAGGER = 0.08

onMounted(() => {
  if (prefersReducedMotion()) {
    cardRefs.value.forEach((card) => card && gsap.set(card, { opacity: 1 }))
    return
  }

  // 每張卡片只在第一次進入畫面時播放進場動畫，之後保持顯示
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const card = entry.target as HTMLElement
        // v-for 的 ref 陣列不保證順序，改用 data-index 取得卡片位置
        const index = Number(card.dataset.index)
        observer?.unobserve(card)
        gsap.fromTo(
          card,
          { opacity: 0, y: ENTER_OFFSET_Y },
          { opacity: 1, y: 0, duration: 0.7, delay: index * STAGGER, ease: 'power2.out' }
        )
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  )

  cardRefs.value.forEach((card) => {
    if (card) observer?.observe(card)
  })
})

onUnmounted(() => {
  observer?.disconnect()
  cardRefs.value.forEach((card) => gsap.killTweensOf(card))
})
</script>
