<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useBodegas } from '../composables/useBodegas';

const props = defineProps<{ sucursalId: string }>();
const route = useRoute();
const { obtenerBodegas } = useBodegas(() => props.sucursalId);
const { data: bodegas, isLoading, isError } = obtenerBodegas;
</script>

<template>
  <div class="bg-white border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
    <!-- Loading State -->
    <div v-if="isLoading" class="p-10 flex flex-col items-center justify-center text-slate-400">
      <span class="material-symbols-outlined animate-spin text-[32px] text-blue-500 mb-2">sync</span>
      <p class="text-sm font-medium">Cargando bodegas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="p-10 flex flex-col items-center justify-center text-red-500">
      <span class="material-symbols-outlined text-[32px] mb-2">error</span>
      <p class="text-sm font-medium">Error al cargar las bodegas.</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-[12px]">
        <thead>
          <tr class="bg-surface-50 border-b border-border text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <th class="py-2 px-3 w-28 font-mono">ID</th>
            <th class="py-2 px-3">CÓDIGO</th>
            <th class="py-2 px-3">NOMBRE</th>
            <th class="py-2 px-3 w-24 text-center">ESTADO</th>
            <th class="py-2 px-3 w-24 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <template v-for="bodega in bodegas" :key="bodega.id">
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="py-2 px-3 font-mono text-[11px] text-blue-600 font-bold">{{ bodega.id }}</td>
              <td class="py-2 px-3 font-mono text-slate-600">{{ bodega.codigo }}</td>
              <td class="py-2 px-3 font-semibold text-slate-800">{{ bodega.nombre }}</td>
              <td class="py-2 px-3 text-center">
                <span :class="['ACTIVO', 'ACTIVA'].includes(bodega.activa ? 'ACTIVO' : 'INACTIVO'.toUpperCase()) ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold' : 'text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-[10px] font-bold'">
                  {{ ['ACTIVO', 'ACTIVA'].includes(bodega.activa ? 'ACTIVO' : 'INACTIVO'.toUpperCase()) ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-2 px-3 text-center">
                <button @click.prevent="$router.push(`/empresas/${route.params.empresaId}/sucursales/${props.sucursalId}/bodegas/${bodega.id}/inventario`)" class="text-slate-400 hover:text-blue-600 p-1 cursor-pointer mr-1" title="Ver Inventario">
                  <span class="material-symbols-outlined text-[18px]">inventory_2</span>
                </button>
              </td>
            </tr>
          </template>
          
          <tr v-if="!bodegas || bodegas.length === 0">
            <td colspan="5" class="py-10 text-center text-slate-400">
              <span class="material-symbols-outlined text-[32px] block mb-2 opacity-50">warehouse</span>
              No hay bodegas registradas.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


