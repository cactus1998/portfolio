<template>
  <div
    class="min-h-screen p-6 bg-gradient-to-br"
  >
    <h1 class="text-4xl font-bold text-center text-gray-900 mb-12 tracking-tight">
      我的網站集
    </h1>

    <!-- 卡片區域寬度改成 1600px -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
      <SiteCard
        v-for="(site, index) in sites"
        :key="index"
        :title="site.title"
        :description="site.description"
        :image="site.image"
        :link="site.link"
      />
    </div>
  </div>
</template>

<script setup>
import SiteCard from './components/SiteCard.vue'
import { sites } from './data/sites'
</script>
