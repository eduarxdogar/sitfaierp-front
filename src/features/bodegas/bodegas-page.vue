<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '../../shared/composables/use-toast';
import { useRoute } from 'vue-router';
import { useBodegas } from './composables/useBodegas';
import ModalNuevaBodega from './components/ModalNuevaBodega.vue';
import type { CrearBodegaRequest } from './dto/bodegas.dto';

const searchQuery = ref('');
const isModalOpen = ref(false);
const toast = useToast();
const route = useRoute();

const selectedSucursalId = ref<string>((route.query.sucursalId as string) || '00000000-0000-0000-0000-000000000000');
const { obtenerBodegas, crearBodegaMutation } = useBodegas(selectedSucursalId);
const { data: bodegas, isLoading, isError } = obtenerBodegas;
const { isPending: isCreating } = crearBodegaMutation;

// Por ahora usaremos un sucursalId hardcodeado o el endpoint fallarÃ¡ si es requerido por FSD
// Idealmente se recibe de un filtro o un route param
 

const crearBodega = async (payload: CrearBodegaRequest) => {
  try {
    await crearBodegaMutation.mutateAsync({ sucursalId: selectedSucursalId.value, data: payload });
    toast.success('Bodega creada exitosamente.');
    isModalOpen.value = false;
  } catch (error: any) {
    console.error("Detalle del error:", error);
    toast.error(error.response?.data?.message || 'Error de negocio al crear la bodega.');
  }
};
</script>

<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
    <ModalNuevaBodega 
      v-if="isModalOpen" 
      :is-loading="isCreating"
      @close="isModalOpen = false" 
      @submit="crearBodega" 
    />

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-[20px] font-extrabold text-[#0b1c30] tracking-tight">Directorio de Bodegas</h2>
        <p class="text-[12px] text-slate-500 font-medium mt-0.5">GestiÃ³n y control de inventarios, almacenes y centros de distribuciÃ³n</p>
      </div>
      <button 
        type="button"
        @click="isModalOpen = true"
        class="bg-[#004ac6] text-white px-3 py-1.5 rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      >
        <span class="material-symbols-outlined text-[16px]">add_box</span>
        Registrar Bodega
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
      <!-- Toolbar -->
      <div class="p-3 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-3 bg-surface">
        <div class="relative w-full sm:w-80">
          <label for="searchQuery" class="sr-only">Buscar</label>
          <span class="material-symbols-outlined absolute left-2.5 top-1.5 text-[18px] text-slate-400 pointer-events-none">search</span>
          <input 
            id="searchQuery"
            type="text" 
            v-model="searchQuery"
            placeholder="Buscar por cÃ³digo o nombre..." 
            class="w-full pl-9 pr-3 py-1.5 text-[12px] border border-slate-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

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
              <th class="py-2 px-3">CÃ“DIGO</th>
              <th class="py-2 px-3">NOMBRE</th>
              <th class="py-2 px-3">TIPO</th>
              <th class="py-2 px-3 w-24 text-center">ESTADO</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="bodega in bodegas" :key="bodega.id">
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-2 px-3 font-mono text-[11px] text-blue-600 font-bold">{{ bodega.id }}</td>
                <td class="py-2 px-3 font-mono text-slate-600">{{ bodega.codigo }}</td>
                <td class="py-2 px-3 font-semibold text-slate-800">{{ bodega.nombre }}</td>
                <td class="py-2 px-3 text-slate-600">{{ bodega.tipo }}</td>
                <td class="py-2 px-3 text-center">
                  <span :class="['ACTIVO', 'ACTIVA'].includes(bodega.estado?.toUpperCase()) ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold' : 'text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-[10px] font-bold'">
                    {{ ['ACTIVO', 'ACTIVA'].includes(bodega.estado?.toUpperCase()) ? 'Activo' : 'Inactivo' }}
                  </span>
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
  </div>
</template>


