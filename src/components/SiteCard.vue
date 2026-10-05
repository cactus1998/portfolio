<!-- SiteCard.vue -->
<template>
  <article
    class="group h-full flex flex-col bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden
           hover:shadow-xl hover:-translate-y-1 transition duration-300"
  >
    <!-- 圖片區域 -->
    <div class="aspect-[16/10] bg-gray-50 border-b border-gray-100 overflow-hidden">
      <img
        :src="image"
        :alt="title"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <!-- 內容區域 -->
    <div class="p-6 flex-1 flex flex-col">
      <h2 class="text-xl font-semibold text-gray-900 tracking-tight line-clamp-2">
        {{ title }}
      </h2>
      <p class="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
        {{ description }}
      </p>

      <!-- 技術標籤 -->
      <div class="mt-4 flex flex-wrap gap-1.5">
        <template v-if="techStack.length > 0">
          <span
            v-for="tech in techStack"
            :key="tech"
            class="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
          >
            {{ tech }}
          </span>
        </template>
        <p v-else class="text-gray-400 text-sm italic">無相關技術資訊</p>
      </div>

      <!-- 按鈕 - 推到底部 -->
      <div class="mt-auto pt-6 flex gap-3">
        <a
          :href="link"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                 bg-gray-900 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          前往專案
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8" />
          </svg>
        </a>
        <a
          v-if="repo"
          :href="repo"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${title} 原始碼（GitHub）`"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          <GithubIcon class="w-4 h-4" />
          <span>原始碼</span>
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import GithubIcon from './GithubIcon.vue'
import type { Site } from '../types'

defineProps<Site>()
</script>
