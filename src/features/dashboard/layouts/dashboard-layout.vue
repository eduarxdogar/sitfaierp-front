<script setup lang="ts">
// TODO: Agregar sidebar, header y navegación del dashboard
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-800">SITFAI</h1>
    </header>
    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>
