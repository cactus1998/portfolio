<!-- SiteCard.vue -->
<template>
  <div
    class="bg-[#f0f0f3] rounded-2xl shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff]
           transition-all duration-500 hover:shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff]
           transform hover:-translate-y-1 hover:scale-[1.02] p-6 text-center"
  >
    <!-- 圖片 -->
    <div class="overflow-hidden mb-4 rounded-xl">
      <img
        :src="image"
        :alt="title"
        class="w-full h-52 object-contain transition-transform duration-500 transform group-hover:scale-105"
      />
    </div>

    <!-- 內容 -->
    <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h2>
    <p class="text-gray-500 mb-5">{{ description }}</p>

    <a
      :href="link"
      target="_blank"
      class="px-6 py-2 border-2 border-gray-300 text-black rounded-full hover:bg-black hover:text-white transition duration-300"
    >
      前往
    </a>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  image: String,
  link: String
})
</script>

<style scoped>
/* 可加上輕微亮度動畫 */
</style>
