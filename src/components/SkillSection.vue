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
          class="text-5xl font-bold text-gray-900 mb-4 tracking-tight"
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skillBlocks } from '../data/skills'

gsap.registerPlugin(ScrollTrigger)

const skillsGrid = ref(null)
const cardRefs = ref([])

onMounted(async () => {
  await nextTick()

  const directions = [
    { x: -80, y: -80 }, // 左上
    { x: 80, y: -80 },  // 右上
    { x: 80, y: 80 },   // 右下
    { x: -80, y: 80 }   // 左下
  ]

  const exitDirections = [
    { x: -80, y: 80 },  // 左下
    { x: -80, y: -80 }, // 左上
    { x: 80, y: -80 },  // 右上
    { x: 80, y: 80 }    // 右下
  ]

  cardRefs.value.forEach((card, i) => {
    const enterDir = directions[i % directions.length]
    const exitDir = exitDirections[i % exitDirections.length]
    
    // 追蹤卡片目前狀態
    let state = 'hidden' // hidden, visible
    let tween = null

    const playEnter = () => {
      if (state === 'visible') return
      
      gsap.killTweensOf(card)
      state = 'visible'
      
      gsap.fromTo(
        card,
        { opacity: 0, x: enterDir.x, y: enterDir.y },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.3,
          ease: 'power3.out'
        }
      )
    }

    const playExit = () => {
      if (state === 'hidden') return
      
      gsap.killTweensOf(card)
      state = 'hidden'
      
      gsap.to(card, {
        opacity: 0,
        x: exitDir.x * 0.5,
        y: exitDir.y * 0.5,
        duration: 0.5,
        ease: 'power2.in'
      })
    }

    gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top+=100 bottom',
        end: 'bottom-=100 top',
        toggleActions: 'none none none none',
        onEnter: playEnter,
        onLeave: playExit,
        onEnterBack: playEnter,
        onLeaveBack: playExit
      }
    })
  })
})
onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
.skill-card {
  opacity: 0;
}
</style>
