<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{ empresaId: string }>();
const emit = defineEmits(['agregar-sucursal', 'modificar-estado', 'eliminar']);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const close = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', close));
onUnmounted(() => document.removeEventListener('click', close));
</script>

<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <button 
      type="button"
      @click.stop="toggleDropdown"
      class="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
    >
      <span class="material-symbols-outlined text-[20px]">more_vert</span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div class="py-1">
          <button
            type="button"
            @click="isOpen = false; emit('agregar-sucursal')"
            class="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px] mr-2 text-blue-600">add_box</span>
            Agregar Sucursal
          </button>
          <button
            type="button"
            @click="isOpen = false; emit('modificar-estado')"
            class="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px] mr-2 text-amber-600">edit_note</span>
            Modificar Estado
          </button>
          <button
            type="button"
            @click="isOpen = false; emit('eliminar')"
            class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px] mr-2 text-red-500">delete</span>
            Eliminar Registro
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
