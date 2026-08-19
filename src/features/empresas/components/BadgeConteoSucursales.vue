<script setup lang="ts">
import { useSucursales } from '../composables/useSucursales';

const props = defineProps<{ empresaId: string }>();
const { obtenerSucursales } = useSucursales(() => props.empresaId);
const { data: sucursales, isLoading } = obtenerSucursales;
</script>

<template>
  <span v-if="isLoading" class="text-xs text-slate-400 animate-pulse">...</span>
  <span v-else-if="sucursales" class="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
    {{ sucursales.length }}
  </span>
  <span v-else class="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
    0
  </span>
</template>
