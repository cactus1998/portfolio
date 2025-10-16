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
        <div class="absolute top-8 left-[15px] lg:left-1/2 w-1.5 h-full bg-gradient-to-b from-purple-200 via-indigo-200 to-purple-200 transform lg:-translate-x-1/2">
          <div
            class="absolute left-0 w-full bg-gradient-to-b from-purple-500 to-indigo-500 transition-all duration-300 ease-out"
            :style="{ height: `${scrollProgress * 100}%` }"
          ></div>
        </div>

        <!-- 工作項目 -->
        <div class="space-y-16">
          <div v-for="(job, index) in jobs" :key="index" class="relative">
            <!-- 時間點 -->
            <div
              class="absolute left-2 lg:left-1/2 w-5 h-5 bg-white border-4 rounded-full transform lg:-translate-x-2.5 mt-3 transition-all duration-300"
              :style="{
                borderColor: index === 0 ? 'rgb(147, 51, 234)' : 'rgb(79, 70, 229)',
                boxShadow: scrollProgress > index * 0.33
                  ? `0 0 20px ${index === 0 ? 'rgba(147, 51, 234, 0.5)' : 'rgba(79, 70, 229, 0.5)'}`
                  : 'none'
              }"
            ></div>

            <!-- 卡片 -->
            <div
              :class="[
                'lg:w-1/2 ml-10 lg:ml-0',
                index % 2 === 0 ? 'lg:pr-12' : 'lg:ml-auto lg:pl-12'
              ]"
            >
              <div
                class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-100 group"
                :style="{
                  transform: `translateY(${Math.max(0, (index - scrollProgress * 3) * 20)}px)`,
                  opacity: Math.max(0.5, 1 - Math.abs(index - scrollProgress * 3) * 0.2)
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
                      @click="job.showDetails = !job.showDetails"
                    >
                      <span>{{ job.showDetails ? '收起內容' : '展開更多' }}</span>

                      <!-- 旋轉箭頭 -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 transition-transform duration-300"
                        :class="{ 'rotate-180': job.showDetails }"
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
                        v-if="job.showDetails"
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

const scrollProgress = ref(0)
const sectionRef = ref(null)

const jobs = ref([
  {
    title: '前端工程師',
    company: '億集創見應用科技股份有限公司',
    duration: '2024/6~2025/6',
    period: '1年1個月',
    highlights: ['Vue 3', 'Canvas', 'WebSocket', 'FullCalendar', 'ECharts', 'Math.js'],
    description: [
      '與後端工程師、UI 設計師及PM合作，主要負責前端開發，技術棧以 Vue 3 為主',
      '致伸科技 CRM 系統：使用 Canvas 製作電子簽名、整合簽名板、集成 NFC 讀卡機搭配 WebSocket',
      '利用 FullCalendar 和 Draggable 實現拖曳式行事曆排班功能',
      '建築效能評估系統：處理複雜計算公式、使用 math.js、導入 ECharts 數據圖表',
      'CSP 設置防止 XSS 等攻擊，通過 Jenkins CI/CD 和 SonarSource 弱掃測試'
    ],
    showDetails: false
  },
  {
    title: '前端工程師',
    company: '日陞空間資訊股份有限公司',
    duration: '2022/9~2024/3',
    period: '1年7個月',
    highlights: ['Vue 2/3', 'Pinia', 'Leaflet', 'GSAP', 'ASP.NET', 'ECharts'],
    description: [
      '與後端工程師、UI設計師、PM協同合作，技術棧涵蓋 Vue2、Vue3 及 ASP.NET',
      '主導專案從 Vue 2 升級至 Vue 3，狀態管理從 Vuex 遷移至 Pinia',
      '道路巡檢網站：導入 ECharts 數據圖表、錯誤修復與功能維護',
      '軌跡編輯系統：整合 Leaflet 地圖庫，實現查詢、編輯、互動等功能',
      '公共設施管線系統：使用 GSAP 實現動態效果、原生 JavaScript 表單拖曳功能',
      'ASP.NET 後端開發：C# API 開發、MSSQL 資料庫串接、IIS 部署'
    ],
    showDetails: false
  },
  {
    title: 'UI/UX 與前端工程敏捷開發培訓',
    company: '勞動職訓課',
    duration: '2022/3~2022/6',
    period: '3個月',
    highlights: ['UI/UX 設計', 'HTML5+CSS3', 'JavaScript', 'Bootstrap', 'Sass/Scss', 'RWD', 'Git'],
    description: [
      'User Interface 介面設計與布局基礎訓練',
      '完成 Prototype 互動雛型實作及 HTML5+CSS3、JavaScript 框架開發',
      'Sass/Scss 預處理器與 RWD 響應式網頁切板組合實作',
      '原生 JavaScript 互動程式訓練及 Git 版本控制實務應用',
      'AI/Photoshop 介面設計軟體應用'
    ],
    showDetails: false
  }
])

const handleScroll = () => {
  if (sectionRef.value) {
    const element = sectionRef.value
    const elementRect = element.getBoundingClientRect()
    const elementHeight = element.offsetHeight
    const windowHeight = window.innerHeight

    // 獲取元素內部所有工作卡片
    const cards = element.querySelectorAll('.relative > div')
    
    let progress = 0
    
    if (elementRect.bottom < 0) {
      // 元素完全滾出視口上方
      progress = 1
    } else if (elementRect.top > windowHeight) {
      // 元素還沒進入視口
      progress = 0
    } else {
      // 計算第一張卡片到最後一張卡片的距離
      if (cards.length > 0) {
        const firstCard = cards[0]
        const lastCard = cards[cards.length - 1]
        
        const firstCardRect = firstCard.getBoundingClientRect()
        const lastCardRect = lastCard.getBoundingClientRect()
        
        // 從第一個卡片頂部到最後一個卡片底部的距離
        const contentStart = firstCardRect.top
        const contentEnd = lastCardRect.bottom
        const contentHeight = contentEnd - contentStart - 200
        
        // 當第一個卡片進入螢幕，進度開始增長
        // 當最後一個卡片到達螢幕下方時，進度完成
        const scrollOffset = windowHeight - contentStart
        progress = scrollOffset / (contentHeight + windowHeight)
        progress = Math.max(0, Math.min(1, progress))
      }
    }

    scrollProgress.value = progress
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>