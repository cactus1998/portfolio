<!-- components/SkillSection.vue -->
<template>
  <section
    id="skills"
    class="min-h-screen py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100"
  >
    <div class="max-w-7xl mx-auto">
      <!-- 標題 -->
      <div class="text-center mb-16">
        <h2
          class="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
        >
          技術能力
        </h2>
      </div>

      <!-- 技能卡區 -->
      <div ref="skillsGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(block, index) in skillBlocks"
          :key="block.id"
          class="skill-card opacity-0"
          :data-index="index"
          ref="cardRefs"
        >
          <div
            class="bg-white rounded-xl shadow-md overflow-hidden border-l-4 hover:shadow-lg"
            :class="block.borderColor"
          >
            <div class="p-4 flex items-center gap-3" :class="block.color">
              <div class="text-3xl">
                {{ block.icon }}
              </div>
              <h3 class="text-xl font-bold" :class="block.textColor">
                {{ block.title }}
              </h3>
            </div>

            <div class="p-4 space-y-2">
              <div
                v-for="(skill, idx) in block.skills"
                :key="idx"
                class="flex flex-wrap gap-2"
              >
                <span
                  v-for="tag in skill.tags"
                  :key="tag"
                  class="text-sm px-3 py-1 rounded-full border"
                  :class="block.tagColor"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { skillBlocks } from '../data/skills'
import { prefersReducedMotion } from '../utils/motion'

const cardRefs = ref([])
let observer = null

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
        const card = entry.target
        // v-for 的 ref 陣列不保證順序，改用 data-index 取得卡片位置
        const dir = directions[Number(card.dataset.index) % directions.length]
        observer.unobserve(card)
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
    if (card) observer.observe(card)
  })
})

onUnmounted(() => {
  observer?.disconnect()
  cardRefs.value.forEach((card) => gsap.killTweensOf(card))
})
</script>
