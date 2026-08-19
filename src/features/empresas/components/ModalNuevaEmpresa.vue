<script setup lang="ts">
import { ref } from 'vue';
import type { CrearEmpresaRequest } from '@/shared/types/empresas.types';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: CrearEmpresaRequest): void;
}>();

const ruc = ref('');
const razonSocial = ref('');

const onSubmit = () => {
  if (!ruc.value || !razonSocial.value) return;
  emit('submit', { ruc: ruc.value, razonSocial: razonSocial.value });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-600 text-[20px]">add_business</span>
          Nueva Empresa
        </h3>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="onSubmit" class="p-5 space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">RUC / NIT</label>
          <input 
            v-model="ruc" 
            type="text" 
            placeholder="Ej. J-40123456-8" 
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Razón Social</label>
          <input 
            v-model="razonSocial" 
            type="text" 
            placeholder="Ej. SITFAI Technologies C.A." 
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            required
          />
        </div>
        
        <!-- Actions -->
        <div class="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
          <button 
            type="button" 
            @click="emit('close')" 
            class="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-blue-600 rounded-md text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">save</span>
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>