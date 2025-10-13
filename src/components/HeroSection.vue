<!-- components/HeroSection.vue -->
<template>
  <section class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-4xl text-center px-6">
      <div class="mb-8">
        <div class="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-6"></div>
      </div>
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
        Hello, 我是 <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">開發者</span>
      </h1>
      <p class="text-xl text-gray-600 mb-8 leading-relaxed">
        熱愛創造優雅的網頁體驗，專注於前端開發與使用者介面設計。
        <br />
        用程式碼實現創意，讓每個專案都充滿生命力。
      </p>
      <div class="flex gap-4 justify-center">
        <a href="#projects" class="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
          查看作品
        </a>
        <a href="#skills" class="px-8 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition duration-300">
          技能介紹
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
</style>