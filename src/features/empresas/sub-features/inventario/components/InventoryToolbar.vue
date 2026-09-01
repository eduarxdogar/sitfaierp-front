<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  searchQuery: string;
  categoriaSeleccionada: string;
  estadoSeleccionado: string;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:categoriaSeleccionada', value: string): void;
  (e: 'update:estadoSeleccionado', value: string): void;
  (e: 'refresh'): void;
}>();

const localSearch = ref(props.searchQuery);

const executeSearch = () => {
  emit('update:searchQuery', localSearch.value);
};

const updateCategoria = (event: Event) => {
  emit('update:categoriaSeleccionada', (event.target as HTMLSelectElement).value);
};

const updateEstado = (event: Event) => {
  emit('update:estadoSeleccionado', (event.target as HTMLSelectElement).value);
};
</script>

<template>
  <div class="p-4 bg-surface-50/40 border-b border-surface-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
    <!-- Búsqueda por SKU o Nombre -->
    <div class="flex-1 max-w-md relative">
      <label for="inv-search-input" class="sr-only">Buscar por SKU o descripción</label>
      <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-surface-400">search</span>
      <input
        id="inv-search-input"
        type="text"
        v-model="localSearch"
        @keyup.enter="executeSearch"
        autofocus
        placeholder="Buscar por SKU, cÃ³digo de barras o descripción..."
        class="w-full pl-9 pr-8 py-2 text-xs border border-surface-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder-surface-400 text-surface-900" 
      />
      <button
        v-if="localSearch"
        type="button"
        @click="localSearch = ''; executeSearch()"
        class="absolute right-2.5 top-2 text-surface-400 hover:text-surface-600">
        <span class="material-symbols-outlined text-[18px]">clear</span>
      </button>
    </div>

    <!-- Filtros desplegables -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Categoría -->
      <div class="relative">
        <label for="inv-cat-select" class="sr-only">Filtrar por categorÃ­a</label>
        <select
          id="inv-cat-select"
          :value="categoriaSeleccionada"
          @change="updateCategoria"
          class="pl-3 pr-8 py-2 text-xs border border-surface-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer text-surface-700 font-medium">
          <option value="ALL">Todas las Categorías</option>
          <option value="Snacks y Golosinas">Snacks y Golosinas</option>
          <option value="Abarrotes y Granos">Abarrotes y Granos</option>
          <option value="Aceites y Grasas">Aceites y Grasas</option>
          <option value="Lácteos y Derivados">Lácteos y Derivados</option>
          <option value="Limpieza y Cuidado">Limpieza y Cuidado</option>
          <option value="Bebidas y Líquidos">Bebidas y Líquidos</option>
        </select>
        <span class="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-surface-400 pointer-events-none">expand_more</span>
      </div>

      <!-- Filtro Estado Stock -->
      <div class="relative">
        <label for="inv-estado-select" class="sr-only">Filtrar por estado</label>
        <select
          id="inv-estado-select"
          :value="estadoSeleccionado"
          @change="updateEstado"
          class="pl-3 pr-8 py-2 text-xs border border-surface-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer text-surface-700 font-medium">
          <option value="ALL">Todos los Estados</option>
          <option value="Óptimo">Óptimo</option>
          <option value="Bajo Stock">Bajo Stock</option>
          <option value="Crítico">Crítico</option>
        </select>
        <span class="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-surface-400 pointer-events-none">expand_more</span>
      </div>

      <!-- BotÃ³n de Actualizar / Refrescar -->
      <button
        id="btn-sync-inventario"
        type="button"
        @click="$emit('refresh')"
        class="p-2 text-surface-500 hover:text-primary-600 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
        title="Refrescar existencias">
        <span class="material-symbols-outlined text-[18px]">sync</span>
      </button>
    </div>
  </div>
</template>
