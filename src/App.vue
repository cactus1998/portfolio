<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-4xl font-bold text-center text-gray-900 mb-12 tracking-tight">
      我的網站集
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
