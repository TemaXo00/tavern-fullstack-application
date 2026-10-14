<script setup lang="ts">
import { useAuthStore } from '@org/api-client';

const auth = useAuthStore();
</script>

<template>
  <p>Welcome to Auth Login Page!</p>
  {{ auth.isAuthenticated }}
</template>

<style scoped></style>
