<script setup lang="ts">
import Sidebar from '@/shared/components/layout/Sidebar.vue';
import Topbar from '@/shared/components/layout/Topbar.vue';
</script>

<template>
  <div class="min-h-screen bg-surface">
    <Topbar />
    <Sidebar />
    <main class="ml-[260px] mt-12 w-[calc(100%-260px)] h-[calc(100vh-48px)] bg-slate-50 overflow-y-auto p-6">
      <RouterView />
    </main>
  </div>
</template>