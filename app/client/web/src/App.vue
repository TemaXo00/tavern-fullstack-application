<script setup lang="ts">
import { useAuthStore } from '@org/stores';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

const store = useAuthStore();

onMounted(async () => {
  await store.init();
});
</script>

<template>
  {{ store }}
  <h1>Welcome to TAVERN WEB APPLICATION</h1>
  <RouterView />
</template>

<style scoped></style>
