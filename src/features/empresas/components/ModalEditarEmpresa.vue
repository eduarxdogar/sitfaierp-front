<script setup lang="ts">
import { watch } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { crearEmpresaSchema } from '../schema/empresas.schema';
import type { EmpresaResponse, CrearEmpresaRequest } from '../dto/empresas.dto';

const props = defineProps<{
  empresa: EmpresaResponse | null;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'actualizar', payload: CrearEmpresaRequest): void;
}>();

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: toTypedSchema(crearEmpresaSchema),
});

const [ruc, rucProps] = defineField('ruc');
const [razonSocial, razonSocialProps] = defineField('razonSocial');

watch(() => props.empresa, (newVal) => {
  if (newVal) {
    setValues({
      ruc: newVal.ruc,
      razonSocial: newVal.nombre,
    });
  }
}, { immediate: true });

const onSubmit = handleSubmit((values) => {
  emit('actualizar', { ruc: values.ruc, razonSocial: values.razonSocial });
});
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-600 text-[20px]">edit</span>
          Editar Empresa
        </h3>
        <button type="button" @click="emit('close')" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="onSubmit" class="p-5 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div>
          <label for="rucEdit" class="block text-sm font-semibold text-slate-700 mb-1">RUC / NIT</label>
          <input 
            id="rucEdit"
            v-model="ruc"
            v-bind="rucProps"
            type="text" 
            placeholder="Ej. 10401234568" 
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
          <p v-if="errors.ruc" class="text-red-500 text-xs mt-1">{{ errors.ruc }}</p>
        </div>
        <div>
          <label for="razonSocialEdit" class="block text-sm font-semibold text-slate-700 mb-1">Razón Social</label>
          <input 
            id="razonSocialEdit"
            v-model="razonSocial"
            v-bind="razonSocialProps"
            type="text" 
            placeholder="Ej. SITFAI Technologies C.A." 
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
          <p v-if="errors.razonSocial" class="text-red-500 text-xs mt-1">{{ errors.razonSocial }}</p>
        </div>
        
        <!-- TODO: Campos inertes para futura implementación del backend -->
        <div class="opacity-60 grayscale cursor-not-allowed border-t border-dashed border-slate-200 pt-4 mt-4 space-y-4">
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">Campos en Desarrollo (Próximamente)</p>
          
          <div>
            <label class="block text-sm font-semibold text-slate-500 mb-1">Sector Comercial</label>
            <input disabled type="text" placeholder="Ej. Tecnología" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-md text-sm" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-500 mb-1">Teléfono</label>
              <input disabled type="text" placeholder="+00 00000000" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-md text-sm" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-500 mb-1">Email</label>
              <input disabled type="email" placeholder="contacto@empresa.com" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-md text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-500 mb-1">Dirección Fiscal</label>
            <textarea disabled rows="2" placeholder="Dirección principal..." class="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-md text-sm"></textarea>
          </div>
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

