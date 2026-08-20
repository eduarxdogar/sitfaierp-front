<script setup lang="ts">
import { useSucursales } from '../composables/useSucursales';
import { useToast } from '@/shared/composables/use-toast';
import { useRouter } from 'vue-router';

const props = defineProps<{ empresaId: string }>();
// Pasamos el prop como un getter para mantener la reactividad en FSD
const { obtenerSucursales, cambiarEstadoSucursalMutation } = useSucursales(() => props.empresaId);
const { data: sucursales, isLoading, isError } = obtenerSucursales;
const toast = useToast();
const router = useRouter();

const cambiarEstado = async (sucursal: any) => {
  const isActivo = ['ACTIVO', 'ACTIVA'].includes(sucursal.estado?.toUpperCase());
  const nuevoEstado = isActivo ? 'INACTIVO' : 'ACTIVO';
  try {
    await cambiarEstadoSucursalMutation.mutateAsync({
      empresaId: props.empresaId,
      sucursalId: sucursal.id,
      nuevoEstado
    });
    toast.success(`Estado cambiado a ${nuevoEstado}`);
  } catch (error: any) {
    console.error("Detalle del error:", error);
    toast.error(error.response?.data?.message || 'Error al cambiar estado.');
  }
};
</script>

<template>
  <div class="p-4 bg-surface-50 border border-border rounded-md mt-2">
    <div v-if="isLoading" class="text-sm text-slate-500 flex items-center gap-2">
      <span class="material-symbols-outlined animate-spin text-[18px]">sync</span>
      Cargando sucursales...
    </div>
    <div v-else-if="isError" class="text-sm text-red-500 flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">error</span>
      Error al cargar las sucursales.
    </div>
    <div v-else-if="!sucursales || sucursales.length === 0" class="text-sm text-slate-500 italic">
      Esta empresa no tiene sucursales registradas.
    </div>
    <div v-else class="border border-border bg-white rounded overflow-hidden shadow-sm">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-surface-50 border-b border-border text-[10px] font-bold text-slate-500 uppercase">
            <th class="py-1.5 px-3 w-28 font-mono">ID SUC.</th>
            <th class="py-1.5 px-3">CODIGO</th>
            <th class="py-1.5 px-3">NOMBRE</th>
            <th class="py-1.5 px-3 w-24 text-center">ESTADO</th>
            <th class="py-1.5 px-3 w-24 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="text-[12px] text-slate-700 divide-y divide-slate-100">
          <tr v-for="sucursal in sucursales" :key="sucursal.id" class="hover:bg-slate-50/80 transition-colors">
            <td class="py-2 px-3 font-mono text-[11px] text-slate-400 font-medium">{{ sucursal.id }}</td>
            <td class="py-2 px-3 font-mono text-[11px] text-slate-600 font-medium">{{ sucursal.codigo }}</td>
            <td class="py-2 px-3 font-medium text-slate-800">{{ sucursal.nombre }}</td>
            <td class="py-2 px-3 text-center">
              <span :class="['ACTIVO', 'ACTIVA'].includes(sucursal.estado?.toUpperCase()) ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold' : 'text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-[10px] font-bold'">
                {{ ['ACTIVO', 'ACTIVA'].includes(sucursal.estado?.toUpperCase()) ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="py-2 px-3 text-center">
              <button
                type="button"
                @click="router.push({ path: '/bodegas', query: { sucursalId: sucursal.id, empresaId: props.empresaId, nombre: sucursal.nombre } })"
                class="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Gestionar Bodegas"
              >
                <span class="material-symbols-outlined text-[18px]">inventory_2</span>
              </button>
              <button 
                type="button" 
                @click="cambiarEstado(sucursal)"
                class="text-slate-400 hover:text-blue-600 p-1 cursor-pointer transition-colors"
                title="Cambiar Estado"
              >
                <span class="material-symbols-outlined text-[18px]">toggle_on</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>




