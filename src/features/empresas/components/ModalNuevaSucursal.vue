<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { crearSucursalSchema } from '../schema/sucursales.schema';
import type { CrearSucursalRequest } from '../dto/sucursales.dto';

const props = defineProps<{
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: CrearSucursalRequest): void;
}>();

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(crearSucursalSchema),
});

const [codigo, codigoProps] = defineField('codigo');
const [nombre, nombreProps] = defineField('nombre');

const onSubmit = handleSubmit((values) => {
  emit('submit', { codigo: values.codigo, nombre: values.nombre });
});
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-border flex justify-between items-center bg-surface">
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-600 text-[20px]">storefront</span>
          Nueva Sucursal
        </h3>
        <button type="button" @click="emit('close')" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="onSubmit" class="p-5 space-y-4">
        <div>
          <label for="codigoSucursal" class="block text-sm font-semibold text-slate-700 mb-1">Código</label>
          <input 
            id="codigoSucursal"
            v-model="codigo"
            v-bind="codigoProps"
            type="text" 
            placeholder="Ej. SUC-01" 
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
          <p v-if="errors.codigo" class="text-red-500 text-xs mt-1">{{ errors.codigo }}</p>
        </div>
        <div>
          <label for="nombreSucursal" class="block text-sm font-semibold text-slate-700 mb-1">Nombre de Sucursal</label>
          <input 
            id="nombreSucursal"
            v-model="nombre"
            v-bind="nombreProps"
            type="text" 
            placeholder="Ej. Sede Principal" 
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
          <p v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</p>
        </div>

        <!-- Campos inertes pendientes de backend -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="ubicacionSucursal" class="block text-sm font-semibold text-slate-700 mb-1">Ubicación</label>
            <!-- Pendiente de backend -->
            <input 
              id="ubicacionSucursal"
              type="text" 
              placeholder="Ej. Centro" 
              disabled
              class="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-400 cursor-not-allowed text-sm"
            />
          </div>
          <div>
            <label for="telefonoSucursal" class="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
            <!-- Pendiente de backend -->
            <input 
              id="telefonoSucursal"
              type="text" 
              placeholder="Ej. 0212-5551234" 
              disabled
              class="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-400 cursor-not-allowed text-sm"
            />
          </div>
        </div>
        <div>
          <label for="direccionSucursal" class="block text-sm font-semibold text-slate-700 mb-1">Dirección</label>
          <!-- Pendiente de backend -->
          <textarea 
            id="direccionSucursal"
            placeholder="Ej. Av. Principal..." 
            disabled
            rows="2"
            class="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-400 cursor-not-allowed text-sm resize-none"
          ></textarea>
        </div>
        
        <!-- Actions -->
        <div class="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
          <button 
            type="button" 
            @click="emit('close')" 
            class="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-surface transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 rounded-md text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="material-symbols-outlined text-[18px] animate-spin">sync</span>
            <span v-else class="material-symbols-outlined text-[18px]">save</span>
            {{ isLoading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
