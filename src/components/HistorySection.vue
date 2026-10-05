<template>
  <section
    ref="sectionRef"
    id="history"
    class="min-h-screen py-20 lg:py-28 px-6 sm:px-8 lg:px-12 bg-white"
  >
    <div class="max-w-7xl mx-auto w-full">
      <SectionHeader eyebrow="Experience" title="工作歷程" subtitle="前端開發經驗與技術" />
      <div class="-mt-6 lg:-mt-10 mb-12 text-center">
        <button
          type="button"
          class="toggle-all text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          @click="toggleAll"
        >
          {{ allExpanded ? '全部收起' : '全部展開' }}
        </button>
      </div>

      <!-- 時間軸容器 -->
      <div class="relative">
        <!-- 動態時間軸背景 -->
        <div ref="timelineRef" class="absolute top-8 left-[15px] lg:left-1/2 w-0.5 h-full bg-gray-200 transform lg:-translate-x-1/2">
          <div
            class="timeline-progress absolute left-0 w-full bg-indigo-500 transition-all duration-300 ease-out"
            :style="{ height: `${scrollProgress * 100}%` }"
          ></div>
        </div>

        <!-- 工作項目 -->
        <div class="space-y-12">
          <div v-for="(job, index) in jobs" :key="job.company" class="relative">
            <!-- 時間點：時間軸進度經過後亮起 -->
            <div
              :class="[
                'absolute left-[9px] lg:left-1/2 w-3.5 h-3.5 rounded-full border-2 transform lg:-translate-x-1/2 mt-8 transition-colors duration-300',
                scrollProgress > index / jobs.length ? 'bg-indigo-500 border-indigo-500 ring-4 ring-indigo-100' : 'bg-white border-gray-300'
              ]"
            ></div>

            <!-- 卡片 -->
            <div
              :ref="(el) => (cardWrapperRefs[index] = el as HTMLElement | null)"
              :class="[
                'lg:w-1/2 ml-10 lg:ml-0',
                index % 2 === 0 ? 'lg:pr-12' : 'lg:ml-auto lg:pl-12'
              ]"
            >
              <div class="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div class="p-6 lg:p-8">
                  <!-- 標題區 -->
                  <div class="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1">
                    <h3 class="text-lg lg:text-xl font-semibold text-gray-900">
                      {{ job.title }}
                    </h3>
                    <p class="text-sm font-medium text-gray-500 tabular-nums whitespace-nowrap">
                      {{ job.duration }}<span class="text-gray-400"> · {{ job.period }}</span>
                    </p>
                  </div>

                  <!-- 公司資訊 -->
                  <p class="mt-1 text-base font-medium text-indigo-700">{{ job.company }}</p>

                  <!-- 技能標籤 -->
                  <div class="flex flex-wrap gap-1.5 mt-5">
                    <span
                      v-for="tag in job.highlights"
                      :key="tag"
                      class="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <!-- 職責描述 -->
                  <div class="mt-5">
                    <!-- 展開 / 收合按鈕 -->
                    <button
                      type="button"
                      class="job-toggle inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      :aria-expanded="expanded.has(index)"
                      @click="toggleDetails(index)"
                    >
                      <span>{{ expanded.has(index) ? '收起內容' : '展開更多' }}</span>
                      <svg
                        class="w-4 h-4 transition-transform duration-300"
                        :class="{ 'rotate-180': expanded.has(index) }"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <!-- 展開內容 -->
                    <el-collapse-transition>
                      <div
                        v-if="expanded.has(index)"
                        class="mt-4 space-y-2.5 border-t border-gray-100 pt-4"
                      >
                        <div
                          v-for="(desc, idx) in job.description"
                          :key="idx"
                          class="flex gap-3 text-gray-600 text-sm leading-relaxed"
                        >
                          <span class="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" aria-hidden="true"></span>
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

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElCollapseTransition } from 'element-plus'
import 'element-plus/es/components/collapse-transition/style/css'
import { jobs } from '../data/jobs'
import SectionHeader from './SectionHeader.vue'

const scrollProgress = ref(0)
const sectionRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const cardWrapperRefs: (HTMLElement | null)[] = []

// 展開中的工作項目 index，最新一筆預設展開
const expanded = ref(new Set<number>([0]))

const allExpanded = computed(() => expanded.value.size === jobs.length)

const toggleAll = () => {
  expanded.value = allExpanded.value ? new Set() : new Set(jobs.map((_, i) => i))
}

const toggleDetails = (index: number) => {
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
let rafId: number | null = null
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
