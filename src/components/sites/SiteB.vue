<template>
  <SiteCard>
    <img src="https://via.placeholder.com/300x150" alt="Site B" class="w-full" />
    <div class="p-4">
      <h2 class="text-lg font-semibold mb-2">網站 B</h2>
      <p class="text-gray-600 mb-4">這是網站 B 的簡介</p>
      <a
        href="https://example.com"
        target="_blank"
        class="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        前往
      </a>
    </div>
  </SiteCard>
</template>

<script setup>
import SiteCard from '../SiteCard.vue'
</script>
