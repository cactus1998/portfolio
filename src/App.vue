<template>
  <div class="min-h-screen bg-white no-scrollbar">
    <HeroSection />
    <ProjectSection />
    <SkillSection />
    <FooterSection />
  </div>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue'
import ProjectSection from './components/ProjectSection.vue'
import SkillSection from './components/SkillSection.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<style scoped>
.no-scrollbar {
  overflow-x: hidden;
}
</style>
