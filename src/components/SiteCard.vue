<template>
  <div
    class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden group transform hover:scale-120"
  >
    <!-- 圖片 -->
    <div class="overflow-hidden">
      <img
        :src="image"
        :alt="title"
        class="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
      />
    </div>

    <!-- 內容 -->
    <div class="p-6 text-center">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h2>
      <p class="text-gray-500 mb-4">{{ description }}</p>
      <a
        :href="link"
        target="_blank"
        class="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300"
      >
        前往
      </a>
    </div>
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

</style>
