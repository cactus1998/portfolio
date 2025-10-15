<template>
  <div class="min-h-screen bg-white no-scrollbar">
    <FirstSection />
    <ProjectSection />
    <SkillSection />
    <FooterSection />
  </div>
</template>

<script setup>
import FirstSection from "./components/FirstSection.vue";
import ProjectSection from "./components/ProjectSection.vue";
import SkillSection from "./components/SkillSection.vue";
import FooterSection from "./components/FooterSection.vue";
</script>

<style scoped>
.no-scrollbar {
  overflow-x: hidden;
}
</style>
