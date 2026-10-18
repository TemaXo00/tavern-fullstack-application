<script setup lang="ts">
import { useAuthStore } from '@org/api-client'

const store = useAuthStore()
</script>

<template>
  <p>Welcome to Main Home Page!</p>
  <p>{{ store.isAuthenticated }}</p>
  <RouterLink to="/admin">
    В админ панель
  </RouterLink>
</template>

<style scoped></style>
