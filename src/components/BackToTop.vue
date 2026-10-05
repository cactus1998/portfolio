<!-- components/BackToTop.vue -->
<template>
  <a
    href="#top"
    aria-label="回到頂部"
    :tabindex="visible ? undefined : -1"
    :class="[
      'fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gray-900 text-white shadow-lg',
      'flex items-center justify-center hover:bg-indigo-700 transition-all duration-300',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    ]"
  >
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  </a>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 捲動超過一個畫面高度後才顯示
const visible = ref(false)

const update = () => {
  visible.value = window.scrollY > window.innerHeight
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
})
</script>
