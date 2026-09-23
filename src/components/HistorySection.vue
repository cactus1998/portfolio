<template>
  <section
    ref="sectionRef"
    id="history"
    class="min-h-screen py-12 lg:py-24 px-6 sm:px-8 lg:px-12 bg-[#f0f0f3]"
  >
          <div class="max-w-7xl mx-auto w-full">
      <!-- 標題 -->
      <div class="mb-12 lg:mb-20 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold bg-black bg-clip-text text-transparent mb-4">
          工作歷程
        </h2>
        <p class="text-gray-600 mt-4 lg:mt-6 text-base lg:text-lg">前端開發經驗與技術</p>
      </div>

      <!-- 時間軸容器 -->
      <div class="relative">
        <!-- 動態時間軸背景 -->
        <div ref="timelineRef" class="absolute top-8 left-[15px] lg:left-1/2 w-1.5 h-full bg-gradient-to-b from-purple-200 via-indigo-200 to-purple-200 transform lg:-translate-x-1/2">
          <div
            class="absolute left-0 w-full bg-gradient-to-b from-purple-500 to-indigo-500 transition-all duration-300 ease-out"
            :style="{ height: `${scrollProgress * 100}%` }"
          ></div>
        </div>

        <!-- 工作項目 -->
        <div class="space-y-16">
          <div v-for="(job, index) in jobs" :key="job.company" class="relative">
            <!-- 時間點 -->
            <div
              class="absolute left-2 lg:left-1/2 w-5 h-5 bg-white border-4 rounded-full transform lg:-translate-x-2.5 mt-3 transition-all duration-300"
              :style="{
                borderColor: index === 0 ? 'rgb(147, 51, 234)' : 'rgb(79, 70, 229)',
                boxShadow: scrollProgress > index / jobs.length
                  ? `0 0 20px ${index === 0 ? 'rgba(147, 51, 234, 0.5)' : 'rgba(79, 70, 229, 0.5)'}`
                  : 'none'
              }"
            ></div>

            <!-- 卡片 -->
            <div
              :ref="el => (cardWrapperRefs[index] = el)"
              :class="[
                'lg:w-1/2 ml-10 lg:ml-0',
                index % 2 === 0 ? 'lg:pr-12' : 'lg:ml-auto lg:pl-12'
              ]"
            >
              <div
                class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-100 group"
                :style="{
                  transform: `translateY(${Math.max(0, (index - scrollProgress * jobs.length) * 20)}px)`,
                  opacity: Math.max(0.5, 1 - Math.abs(index - scrollProgress * jobs.length) * 0.2)
                }"
              >
                <!-- 頂部漸層線 -->
                <div class="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

                <div class="p-8">
                  <!-- 標題區 -->
                  <div class="flex justify-between items-start gap-2 lg:gap-4 mb-3">
                    <h3 class="text-lg lg:text-2xl font-bold text-gray-900 flex-1 group-hover:text-purple-600 transition-colors">
                      {{ job.title }}
                    </h3>
                    <span
                      class="font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500
                            px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm lg:px-4 lg:py-2 lg:text-base
                            rounded-full whitespace-nowrap shadow-sm"
                    >
                      {{ job.duration }}
                    </span>
                  </div>

                  <!-- 公司資訊 -->
                  <div class="mb-5 pb-4 border-b border-gray-100">
                    <p class="text-lg font-semibold text-gray-800 mb-1">{{ job.company }}</p>
                  </div>

                  <!-- 技能標籤 -->
                  <div class="flex flex-wrap gap-2 mb-6">
                    <span
                      v-for="(tag, idx) in job.highlights"
                      :key="idx"
                      class="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <!-- 職責描述 -->
                  <div class="space-y-3">
                    <!-- 展開 / 收合按鈕 -->
                    <el-button
                      type="primary"
                      plain
                      class="!bg-gradient-to-r !from-purple-600 !to-indigo-600 !text-white hover:!from-purple-600 hover:!to-indigo-600 transition-all flex items-center gap-2"
                      @click="toggleDetails(index)"
                    >
                      <span>{{ expanded.has(index) ? '收起內容' : '展開更多' }}</span>

                      <!-- 旋轉箭頭 -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 transition-transform duration-300"
                        :class="{ 'rotate-180': expanded.has(index) }"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </el-button>

                    <!-- 展開內容 -->
                    <el-collapse-transition>
                      <div
                        v-if="expanded.has(index)"
                        class="mt-4 space-y-3 border-t border-gray-100 pt-4"
                      >
                        <div
                          v-for="(desc, idx) in job.description"
                          :key="idx"
                          class="flex gap-3 text-gray-700 text-sm leading-relaxed"
                        >
                          <span class="text-purple-500 font-bold mt-1 flex-shrink-0">▸</span>
                          <p>{{ desc }}</p>
                        </div>
                      </div>
                    </el-collapse-transition>
                  </div>
                </div>
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
import { ElButton, ElCollapseTransition } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/collapse-transition/style/css'
import { jobs } from '../data/jobs'

const scrollProgress = ref(0)
const sectionRef = ref(null)
const timelineRef = ref(null)
const cardWrapperRefs = []

// 展開中的工作項目 index
const expanded = ref(new Set())

const toggleDetails = (index) => {
  if (expanded.value.has(index)) {
    expanded.value.delete(index)
  } else {
    expanded.value.add(index)
  }
}

const updateProgress = () => {
  const element = sectionRef.value
  const timeline = timelineRef.value
  const lastCard = cardWrapperRefs[jobs.length - 1]
  if (!element || !timeline || !lastCard) return

  const elementRect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight

  let progress = 0

  if (elementRect.bottom < 0) {
    // 元素完全滾出視口上方
    progress = 1
  } else if (elementRect.top > windowHeight) {
    // 元素還沒進入視口
    progress = 0
  } else {
    // 從時間軸頂部到最後一張卡片底部的距離
    const contentStart = timeline.getBoundingClientRect().top
    const contentEnd = lastCard.getBoundingClientRect().bottom
    const contentHeight = contentEnd - contentStart - 200

    // 當時間軸進入螢幕，進度開始增長
    // 當最後一個卡片到達螢幕下方時，進度完成
    const scrollOffset = windowHeight - contentStart
    progress = scrollOffset / (contentHeight + windowHeight)
    progress = Math.max(0, Math.min(1, progress))
  }

  scrollProgress.value = progress
}

// 用 requestAnimationFrame 節流，每幀最多計算一次
let rafId = null
const handleScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    updateProgress()
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>
