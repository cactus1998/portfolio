<!-- components/SectionHeader.vue -->
<!-- 各區塊共用標題：英文小標 + 標題 + 說明 -->
<template>
  <div class="text-center mb-12 lg:mb-16">
    <p class="text-xs font-semibold tracking-[0.3em] uppercase text-indigo-600 mb-3">{{ eyebrow }}</p>
    <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{{ title }}</h2>
    <p v-if="subtitle" class="mt-4 text-base lg:text-lg text-gray-500">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
}>()
</script>
