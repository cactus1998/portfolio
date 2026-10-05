<!-- ProjectSection.vue -->
<template>
  <section id="projects" class="min-h-screen py-20 lg:py-28 px-6 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <SectionHeader eyebrow="Projects" title="精選作品" subtitle="個人專案與課程練習作品" />

      <!-- 卡片排列 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <SiteCard
          v-for="site in sites"
          :key="site.link"
          :title="site.title"
          :description="site.description"
          :image="site.image"
          :link="site.link"
          :repo="site.repo"
          :techStack="site.techStack"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SiteCard from './SiteCard.vue'
import SectionHeader from './SectionHeader.vue'
import { sites } from '../data/sites'
</script>
