<!-- components/SkillSection.vue -->
<template>
  <section id="skills" class="min-h-screen py-20 lg:py-28 px-6 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <SectionHeader eyebrow="Skills" title="技術能力" subtitle="工作與專案中實際使用的技術" />

      <!-- 技能卡區 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(block, index) in skillBlocks"
          :key="block.id"
          class="skill-card opacity-0"
          :data-index="index"
          ref="cardRefs"
        >
          <div class="h-full bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 lg:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="ICON_PATHS[block.icon]" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">{{ block.title }}</h3>
            </div>

            <dl class="space-y-4">
              <div v-for="group in block.skills" :key="group.label">
                <dt class="text-xs font-medium text-gray-500 mb-2">{{ group.label }}</dt>
                <dd class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in group.tags"
                    :key="tag"
                    class="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
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
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { skillBlocks } from '../data/skills'
import { prefersReducedMotion } from '../utils/motion'
import SectionHeader from './SectionHeader.vue'
import type { SkillIcon } from '../types'

// Heroicons outline 路徑
const ICON_PATHS: Record<SkillIcon, string> = {
  code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  server: 'M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z',
  tools: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z',
  spark: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z'
}

const cardRefs = ref<HTMLElement[]>([])
let observer: IntersectionObserver | null = null

// 依卡片位置決定從哪個方向飛入
const directions = [
  { x: -80, y: -80 },
  { x: 80, y: -80 },
  { x: 80, y: 80 },
  { x: -80, y: 80 }
]

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
        const dir = directions[Number(card.dataset.index) % directions.length]
        observer?.unobserve(card)
        gsap.fromTo(
          card,
          { opacity: 0, x: dir.x, y: dir.y },
          { opacity: 1, x: 0, y: 0, duration: 1.1, ease: 'power3.out' }
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
