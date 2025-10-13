<!-- components/SkillSection.vue -->
<template>
  <section id="skills" class="min-h-screen py-20 px-6 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-bold text-center text-gray-900 mb-4 tracking-tight">
        技術能力
      </h2>
      <p class="text-center text-gray-600 mb-16 text-lg">
        持續精進的技術棧
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(skill, index) in skills"
          :key="index"
          class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div class="text-4xl mb-3">{{ skill.icon }}</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ skill.name }}</h3>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-black h-2 rounded-full transition-all duration-500"
              :style="{ width: skill.level }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { skills } from '../data/skills'
</script>

<style scoped>
</style>