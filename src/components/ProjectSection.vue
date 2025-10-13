<template>
  <section id="projects" class="min-h-screen py-20 px-6 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-bold text-center text-gray-900 mb-4 tracking-tight">
        精選作品
      </h2>
      <p class="text-center text-gray-600 mb-16 text-lg">
        探索我的創作旅程
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
  </section>
</template>

<script setup>
import SiteCard from './SiteCard.vue'
import { sites } from '../data/sites'
</script>

<style scoped>
</style>