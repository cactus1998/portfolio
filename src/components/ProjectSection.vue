<!-- ProjectSection.vue -->
<template>
  <section id="projects" class="min-h-screen py-20 px-6 bg-[#f0f0f3]">
    <div class="max-w-7xl mx-auto">
      <h2
        class="text-4xl font-bold text-center text-gray-800 mb-4 tracking-tight
               drop-shadow-[2px_2px_4px_#ffffff]">
        精選作品
      </h2>
      <p class="text-center text-gray-500 mb-16 text-lg">
        探索我的創作旅程
      </p>

      <!-- 卡片排列 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <SiteCard
          v-for="(site, index) in sites"
          :key="index"
          :title="site.title"
          :description="site.description"
          :image="site.image"
          :link="site.link"
          :techStack="site.techStack"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import SiteCard from './SiteCard.vue'
import { sites } from '../data/sites'
</script>

<style scoped>
section {
  /* 平面與陰影融合感 */
  box-shadow: inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff;
}
</style>
