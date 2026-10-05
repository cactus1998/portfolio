<!-- components/NavBar.vue -->
<template>
  <header
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled || menuOpen ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    ]"
  >
    <nav class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
      <a href="#top" class="text-lg font-bold text-gray-900 hover:text-indigo-700 transition-colors" @click="menuOpen = false">
        {{ profile.name }}<span class="ml-1 text-indigo-600">{{ profile.englishName }}</span>
      </a>

      <!-- 桌機版選單 -->
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="item in NAV_ITEMS" :key="item.id">
          <a
            :href="`#${item.id}`"
            :aria-current="activeId === item.id ? 'true' : undefined"
            :class="[
              'text-sm font-medium transition-colors',
              activeId === item.id ? 'text-indigo-700' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ item.label }}
          </a>
        </li>
        <li>
          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="block text-gray-700 hover:text-black transition-colors"
          >
            <GithubIcon class="w-5 h-5" />
          </a>
        </li>
      </ul>

      <!-- 手機版選單按鈕 -->
      <button
        type="button"
        class="md:hidden p-2 -mr-2 text-gray-800"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        :aria-label="menuOpen ? '關閉選單' : '開啟選單'"
        @click="menuOpen = !menuOpen"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path v-if="menuOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>

    <!-- 手機版選單 -->
    <ul v-show="menuOpen" id="mobile-menu" class="md:hidden px-6 pb-4 space-y-1">
      <li v-for="item in NAV_ITEMS" :key="item.id">
        <a
          :href="`#${item.id}`"
          :class="[
            'block py-2 font-medium',
            activeId === item.id ? 'text-indigo-700' : 'text-gray-700'
          ]"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </a>
      </li>
      <li>
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 py-2 font-medium text-gray-700"
        >
          <GithubIcon class="w-5 h-5" />
          GitHub
        </a>
      </li>
    </ul>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GithubIcon from './GithubIcon.vue'
import { profile } from '../data/profile'

const NAV_ITEMS = [
  { id: 'projects', label: '作品' },
  { id: 'history', label: '經歷' },
  { id: 'skills', label: '技能' },
  { id: 'contact', label: '聯絡' }
]

// 捲動超過這個距離後，導覽列加上背景
const SCROLLED_OFFSET = 40

const scrolled = ref(false)
const menuOpen = ref(false)
const activeId = ref('')

const updateScrolled = () => {
  scrolled.value = window.scrollY > SCROLLED_OFFSET
}

let observer = null

onMounted(() => {
  updateScrolled()
  window.addEventListener('scroll', updateScrolled, { passive: true })

  // 以畫面中央那條線判斷目前所在區塊
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeId.value = entry.target.id
        else if (activeId.value === entry.target.id) activeId.value = ''
      })
    },
    { rootMargin: '-50% 0px -50% 0px' }
  )
  NAV_ITEMS.forEach(({ id }) => {
    const section = document.getElementById(id)
    if (section) observer.observe(section)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrolled)
  observer?.disconnect()
})
</script>
