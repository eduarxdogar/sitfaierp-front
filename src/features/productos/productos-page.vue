<script setup lang="ts">
import { ref } from 'vue';
import TablaProductos from './components/TablaProductos.vue';
import ModalNuevoProducto from './components/ModalNuevoProducto.vue';

const showModal = ref(false);
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Catálogo de Productos</h1>
      <button @click="showModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Nuevo Producto
      </button>
    </div>

    <TablaProductos />

    <ModalNuevoProducto v-if="showModal" @close="showModal = false" />
  </div>
</template>