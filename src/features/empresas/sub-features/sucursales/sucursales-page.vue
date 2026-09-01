<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from '@/shared/composables/use-toast';
import { useSucursales } from './useSucursales';
import ModalNuevaSucursal from './ModalNuevaSucursal.vue';
import TablaSucursales from './TablaSucursales.vue';
import type { CrearSucursalRequest } from './sucursales.dto';

const route = useRoute();
const toast = useToast();
const empresaId = computed(() => route.params.empresaId as string);

const isModalSucursalOpen = ref(false);

const { crearSucursalMutation } = useSucursales(empresaId);
const { isPending: isCreatingSucursal } = crearSucursalMutation;

const crearSucursal = async (payload: CrearSucursalRequest) => {
  if (!empresaId.value) return;
  try {
    await crearSucursalMutation.mutateAsync(payload);
    toast.success('Sucursal creada exitosamente.');
    isModalSucursalOpen.value = false;
  } catch (error: any) {
    console.error("Detalle del error:", error);
    toast.error(error.response?.data?.message || 'Error al crear la sucursal.');
  }
};
</script>

<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
    
    <!-- Modal -->
    <ModalNuevaSucursal
      v-if="isModalSucursalOpen"
      :is-loading="isCreatingSucursal"
      @close="isModalSucursalOpen = false"
      @submit="crearSucursal"
    />

    <!-- Header & Breadcrumbs -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <nav class="flex items-center space-x-2 text-xs text-slate-500 mb-2 font-medium">
          <router-link to="/empresas" class="hover:text-blue-600 transition-colors flex items-center">
            <span class="material-symbols-outlined text-[15px] mr-1 text-slate-400">home</span>
            Empresas
          </router-link>
          <span class="text-slate-300">/</span>
          <span class="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center">
            <span class="material-symbols-outlined text-[14px] mr-1 text-blue-600">domain</span>
            Sucursales de Empresa {{ empresaId }}
          </span>
        </nav>
        <h2 class="text-[20px] font-extrabold text-[#0b1c30] tracking-tight">Directorio de Sucursales</h2>
        <p class="text-[12px] text-slate-500 font-medium mt-0.5">Gestión de sedes físicas para la empresa seleccionada.</p>
      </div>
      <button 
        type="button"
        @click="isModalSucursalOpen = true"
        class="bg-[#004ac6] text-white px-3 py-1.5 rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      >
        <span class="material-symbols-outlined text-[16px]">add_business</span>
        Registrar Sucursal
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-border rounded-lg shadow-sm overflow-hidden p-4">
      <TablaSucursales :empresa-id="empresaId" />
    </div>
  </div>
</template>
