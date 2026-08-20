<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '../../shared/composables/use-toast';
import { useRoute } from 'vue-router';
import { useBodegas } from './composables/useBodegas';
import ModalNuevaBodega from './components/ModalNuevaBodega.vue';
import TablaBodegas from './components/TablaBodegas.vue';
import type { CrearBodegaRequest } from './dto/bodegas.dto';

const isModalOpen = ref(false);
const toast = useToast();
const route = useRoute();

const selectedSucursalId = ref<string>((route.query.sucursalId as string) || '00000000-0000-0000-0000-000000000000');
const selectedEmpresaId = ref<string>((route.query.empresaId as string) || '00000000-0000-0000-0000-000000000000');
const { crearBodegaMutation, obtenerBodegas } = useBodegas(selectedSucursalId, selectedEmpresaId);
const { isError, error: fetchError } = obtenerBodegas;
const { isPending: isCreating } = crearBodegaMutation;

// Por ahora usaremos un sucursalId hardcodeado o el endpoint fallarÃ¡ si es requerido por FSD
// Idealmente se recibe de un filtro o un route param
 

const crearBodega = async (payload: Omit<CrearBodegaRequest, 'sucursalId'>) => {
  try {
    await crearBodegaMutation.mutateAsync({ sucursalId: selectedSucursalId.value, ...payload });
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
    <div v-if="isError && (fetchError as any)?.status === 404" class="p-8 text-center bg-amber-50 border border-amber-200 rounded-lg">
      <span class="material-symbols-outlined text-amber-500 text-4xl mb-2">construction</span>
      <h3 class="text-amber-800 font-bold">Aviso: Endpoint GET /bodegas no implementado en backend</h3>
      <p class="text-amber-600 text-sm mt-1">El backend an no tiene expuesto este recurso, por lo que devuelve un error 404 (Not Found).</p>
    </div>
    <TablaBodegas v-else :sucursal-id="selectedSucursalId" />
  </div>
</template>












