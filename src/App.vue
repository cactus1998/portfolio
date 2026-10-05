<template>
  <div class="min-h-screen bg-white no-scrollbar">
    <NavBar />
    <FirstSection />
    <ProjectSection />
    <HistorySection />
    <SkillSection />
    <FooterSection />
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import BackToTop from "./components/BackToTop.vue";
import FirstSection from "./components/FirstSection.vue";
import ProjectSection from "./components/ProjectSection.vue";
import HistorySection from "./components/HistorySection.vue";
import SkillSection from "./components/SkillSection.vue";
import FooterSection from "./components/FooterSection.vue";
</script>

<style scoped>
.no-scrollbar {
  overflow-x: hidden;
}
</style>
