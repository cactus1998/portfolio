<!-- App.vue -->
<template>
  <div class="min-h-screen bg-white">
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
</style>