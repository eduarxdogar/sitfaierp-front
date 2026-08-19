<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import ToastProvider from '@/shared/components/ui/ToastProvider.vue';

const isDev = import.meta.env.VITE_ENABLE_DEVTOOLS;
</script>

<template>
  <RouterView />
  <ToastProvider />
  <VueQueryDevtools v-if="isDev" />
</template>