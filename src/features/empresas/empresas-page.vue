<script setup lang="ts">
import { ref } from 'vue';
import { useSimpleQueryHook } from '@/shared/hooks/tanstack/use-simple-query.hook';
import { useSimpleMutationHook } from '@/shared/hooks/tanstack/use-simple-mutation.hook';
import ModalNuevaEmpresa from './components/ModalNuevaEmpresa.vue';
import type { EmpresaResponse, CrearEmpresaRequest } from '@/shared/types/empresas.types';
import { useToast } from '@/shared/composables/use-toast';

const isModalOpen = ref(false);
const searchQuery = ref('');
const expandedRowIds = ref<string[]>([]);
const toast = useToast();

const { data: empresas, isLoading, refetch } = useSimpleQueryHook<EmpresaResponse[]>('empresas', ['empresas']);

const { mutateAsync: mutateCrearEmpresa, isPending: isCreating } = useSimpleMutationHook<EmpresaResponse, CrearEmpresaRequest>('empresas', 'POST');

const crearEmpresa = async (payload: CrearEmpresaRequest) => {
  try {
    await mutateCrearEmpresa(payload);
    toast.success('Empresa registrada exitosamente en el sistema.');
    isModalOpen.value = false;
    refetch();
  } catch (error: any) {
    console.error("Detalle del error:", error);
    if (error.message && error.message.includes('Failed to fetch')) {
        toast.error('Error de red: No se pudo conectar con el servidor (CORS o Caída).');
    } else {
        toast.error(error.response?.data?.message || 'Error de negocio al crear la empresa.');
    }
  }
};

const toggleRow = (id: string) => {
  if (expandedRowIds.value.includes(id)) {
    expandedRowIds.value = expandedRowIds.value.filter(rowId => rowId !== id);
  } else {
    expandedRowIds.value.push(id);
  }
};
</script>

<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
    
    <!-- Modal -->
    <ModalNuevaEmpresa 
      v-if="isModalOpen" 
      @close="isModalOpen = false" 
      @submit="crearEmpresa" 
    />

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-[20px] font-extrabold text-[#0b1c30] tracking-tight">Directorio de Empresas (Tenants)</h2>
        <p class="text-[12px] text-slate-500 font-medium mt-0.5">Gestión centralizada de organizaciones, filiales y sedes operativas</p>
      </div>
      <button 
        @click="isModalOpen = true"
        class="bg-[#004ac6] text-white px-3 py-1.5 rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        :disabled="isCreating"
      >
        <span v-if="isCreating" class="material-symbols-outlined text-[16px] animate-spin">sync</span>
        <span v-else class="material-symbols-outlined text-[16px]">add_business</span>
        {{ isCreating ? 'Guardando...' : 'Registrar Empresa' }}
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden flex flex-col">
      <!-- Toolbar -->
      <div class="p-3 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#F8FAFC]">
        <div class="relative w-full sm:w-80">
          <span class="material-symbols-outlined absolute left-2.5 top-1.5 text-[18px] text-slate-400">search</span>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Buscar por código, nombre o RUC/NIT..." 
            class="w-full pl-9 pr-3 py-1.5 text-[12px] border border-slate-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-10 flex flex-col items-center justify-center text-slate-400">
        <span class="material-symbols-outlined animate-spin text-[32px] text-blue-500 mb-2">sync</span>
        <p class="text-sm font-medium">Cargando empresas...</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[12px]">
          <thead>
            <tr class="bg-[#F1F5F9] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-2 px-3 w-10 text-center"></th>
              <th class="py-2 px-3 w-28 font-mono">ID</th>
              <th class="py-2 px-3">RAZÓN SOCIAL</th>
              <th class="py-2 px-3 w-32">RUC / NIT</th>
              <th class="py-2 px-3 w-24 text-center">ESTADO</th>
              <th class="py-2 px-3 w-24 text-center">SUCURSALES</th>
              <th class="py-2 px-3 w-24 text-center">ACCIONES</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="empresa in empresas" :key="empresa.id">
              <!-- Main Row -->
              <tr class="hover:bg-slate-50 transition-colors group">
                <td class="py-2 px-3 text-center">
                  <button @click="toggleRow(empresa.id)" class="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-[20px]">
                      {{ expandedRowIds.includes(empresa.id) ? 'keyboard_arrow_down' : 'chevron_right' }}
                    </span>
                  </button>
                </td>
                <td class="py-2 px-3 font-mono text-[11px] text-blue-600 font-bold">{{ empresa.id }}</td>
                <td class="py-2 px-3 font-semibold text-slate-800">{{ empresa.nombre }}</td>
                <td class="py-2 px-3 text-slate-500 font-mono">{{ empresa.ruc }}</td>
                <td class="py-2 px-3 text-center">
                  <span :class="{'bg-emerald-100 text-emerald-700': empresa.estado === 'ACTIVA' || empresa.estado === 'ACTIVO', 'bg-red-100 text-red-700': empresa.estado === 'INACTIVA' || empresa.estado === 'INACTIVO'}" class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {{ empresa.estado || 'DESCONOCIDO' }}
                  </span>
                </td>
                <td class="py-2 px-3 text-center">
                  <span class="inline-flex items-center justify-center bg-blue-50 text-blue-700 w-6 h-6 rounded-full text-[11px] font-bold border border-blue-100">
                    {{ empresa.sucursales?.length || 0 }}
                  </span>
                </td>
                <td class="py-2 px-3 text-center">
                  <button class="text-slate-400 hover:text-blue-600 p-1 cursor-pointer">
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </td>
              </tr>

              <!-- Expanded Sub-Row -->
              <tr v-if="expandedRowIds.includes(empresa.id)" class="bg-[#F8FAFC]">
                <td colspan="7" class="p-0 border-b border-[#E2E8F0]">
                  <div class="px-10 py-4 bg-gradient-to-r from-[#F8FAFC] to-white border-l-4 border-l-blue-500">
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="text-[12px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px] text-slate-400">storefront</span>
                        Sucursales / Sedes
                      </h4>
                      <button class="h-[24px] px-2 bg-white border border-slate-300 rounded text-slate-700 flex items-center gap-1 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-colors text-[11px] font-medium shadow-sm cursor-pointer">
                        <span class="material-symbols-outlined text-[14px]">add</span>
                        <span>Sucursal</span>
                      </button>
                    </div>

                    <div v-if="!empresa.sucursales || empresa.sucursales.length === 0" class="p-3 bg-white border border-slate-200 rounded text-[12px] text-slate-500">
                      Esta empresa aún no tiene sucursales registradas.
                    </div>
                    <div v-else class="border border-[#E2E8F0] bg-white rounded overflow-hidden shadow-sm">
                      <table class="w-full text-left">
                        <thead>
                          <tr class="bg-[#F1F5F9] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase">
                            <th class="py-1.5 px-3 w-28 font-mono">ID SUC.</th>
                            <th class="py-1.5 px-3">NOMBRE</th>
                            <th class="py-1.5 px-3 w-24 text-center">ESTADO</th>
                          </tr>
                        </thead>
                        <tbody class="text-[12px] text-slate-700 divide-y divide-slate-100">
                          <tr v-for="sucursal in empresa.sucursales" :key="sucursal.id" class="hover:bg-slate-50/80 transition-colors">
                            <td class="py-2 px-3 font-mono text-[11px] text-slate-400 font-medium">{{ sucursal.id }}</td>
                            <td class="py-2 px-3 font-medium text-slate-800">{{ sucursal.nombre }}</td>
                            <td class="py-2 px-3 text-center">
                              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100">
                                {{ sucursal.estado || 'N/A' }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            
            <tr v-if="!empresas || empresas.length === 0">
              <td colspan="7" class="py-10 text-center text-slate-400">
                <span class="material-symbols-outlined text-[32px] block mb-2 opacity-50">domain_disabled</span>
                No hay empresas registradas en la base de datos.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>