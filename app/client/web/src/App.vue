<script setup lang="ts">
import { useAuthStore } from '@org/api-client';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

const auth = useAuthStore();

onMounted(async () => {
  await auth.init();
});
</script>

<template>
  {{ auth }}
  <h1>Welcome to TAVERN WEB APPLICATION</h1>
  <RouterView />
</template>

<style scoped></style>
