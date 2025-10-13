<!-- SiteCard.vue -->
<template>
  <div
    class="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl 
           shadow-[8px_8px_24px_rgba(209,217,230,0.6),-8px_-8px_24px_rgba(255,255,255,0.9)]
           hover:shadow-[12px_12px_32px_rgba(209,217,230,0.8),-12px_-12px_32px_rgba(255,255,255,1)]
           transition-all duration-700 ease-out overflow-hidden
           hover:-translate-y-2 hover:scale-[1.03]
           border border-white/50 hover:border-purple-200/70
           h-full flex flex-col"
  >
    <!-- 背景裝飾 -->
    <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    <!-- 圖片區域 - 固定高度 -->
    <div class="relative overflow-hidden rounded-2xl mx-6 mt-6 mb-5 bg-white shadow-inner flex-shrink-0">
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <img
        :src="image"
        :alt="title"
        class="w-full h-56 object-contain p-4 transition-all duration-700 
               transform group-hover:rotate-3"
      />
    </div>

    <!-- 內容區域 - 使用 flex 布局 -->
    <div class="px-6 pb-6 relative z-10 flex-grow flex flex-col">
      <!-- 標題 - 固定行數 -->
      <h2 class="text-2xl font-bold text-gray-800 mb-3 tracking-tight 
                 group-hover:text-purple-700 transition-colors duration-300
                 flex-shrink-0 line-clamp-2">
        {{ title }}
      </h2>
      
      <!-- 描述 - 固定行數 -->
      <p class="text-gray-600 mb-5 leading-relaxed flex-shrink-0 line-clamp-3">
        {{ description }}
      </p>

      <!-- 技術標籤 - 固定高度容器，內容可滾動 -->
      <div class="mb-6 flex-shrink-0 h-26 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
        <div class="flex flex-wrap gap-2">
          <template v-if="techStack && techStack.length > 0">
            <span
              v-for="(tech, index) in techStack"
              :key="tech"
              class="px-3 py-1.5 text-xs font-medium rounded-full
                     bg-gradient-to-r from-purple-100 to-indigo-100
                     text-purple-800 border border-purple-200/50
                     hover:from-purple-200 hover:to-indigo-200
                     transition-all duration-300 cursor-default
                     shadow-sm hover:shadow-md
                     inline-block flex-shrink-0"
              :style="{ transitionDelay: `${index * 50}ms` }"
            >
              {{ tech }}
            </span>
          </template>
          <p v-else class="text-gray-400 text-sm italic">無相關技術資訊</p>
        </div>
      </div>

      <!-- 按鈕 - 推到底部 -->
      <a
        :href="link"
        target="_blank"
        class="mt-auto inline-flex items-center justify-center w-full px-6 py-3 
               bg-gray-800 text-white font-medium rounded-full
               hover:bg-indigo-800 hover:text-white active:scale-95
               transition-all duration-300 shadow-lg
               flex-shrink-0"
      >
        前往專案
      </a>
    </div>

    <!-- 卡片邊緣光暈 -->
    <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 
                transition-opacity duration-500 pointer-events-none
                bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5"></div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  image: String,
  link: String,
  techStack: Array 
})
</script>

<style scoped>
/* 確保動畫流暢 */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 自定義滾動條樣式 */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thumb-purple-200::-webkit-scrollbar-thumb {
  background-color: rgb(233 213 255);
  border-radius: 9999px;
}

.scrollbar-track-transparent::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 行數限制 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>