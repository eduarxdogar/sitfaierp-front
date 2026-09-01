<script setup lang="ts">
import { computed } from 'vue';
import type { ProductoInventario } from '../dto/inventory.dto';

const props = defineProps<{
  productos: ProductoInventario[];
}>();

const totalSkus = computed(() => props.productos.length);
const categoriasActivas = computed(() => new Set(props.productos.map(p => p.categoria)).size);
const unidadesFisicas = computed(() => props.productos.reduce((sum, p) => sum + p.stockActual, 0));
const valorizadoTotal = computed(() => props.productos.reduce((sum, p) => sum + p.valorizado, 0));
const precioVentaTotal = computed(() => props.productos.reduce((sum, p) => sum + (p.precioVenta * p.stockActual), 0));
const alertasStock = computed(() => props.productos.filter(p => p.estado === 'Bajo Stock' || p.estado === 'CrÃ­tico').length);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- KPI 1: Total SKUs -->
    <div class="bg-white p-4 rounded-xl border border-surface-200 shadow-xs flex items-center justify-between hover:border-surface-300 transition-all">
      <div>
        <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">Total SKUs</span>
        <div class="text-2xl font-bold text-surface-900 mt-1">{{ totalSkus }} <span class="text-sm font-normal text-surface-500">Productos</span></div>
        <div class="flex items-center text-[11px] text-surface-400 mt-0.5">
          <span class="material-symbols-outlined text-[14px] text-primary-600 mr-1">category</span>
          {{ categoriasActivas }} categorÃ­as activas
        </div>
      </div>
      <div class="h-11 w-11 rounded-lg bg-surface-100 text-surface-700 flex items-center justify-center">
        <span class="material-symbols-outlined text-[24px]">inventory_2</span>
      </div>
    </div>

    <!-- KPI 2: Unidades FÃ­sicas -->
    <div class="bg-white p-4 rounded-xl border border-surface-200 shadow-xs flex items-center justify-between hover:border-surface-300 transition-all">
      <div>
        <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">Unidades FÃ­sicas</span>
        <div class="text-2xl font-bold text-surface-900 mt-1">{{ new Intl.NumberFormat('en-US').format(unidadesFisicas) }} <span class="text-sm font-normal text-surface-500">und</span></div>
        <div class="flex items-center text-[11px] text-green-700 font-medium mt-0.5">
          <span class="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
          Capacidad calculada
        </div>
      </div>
      <div class="h-11 w-11 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center border border-primary-100">
        <span class="material-symbols-outlined text-[24px]">layers</span>
      </div>
    </div>

    <!-- KPI 3: Valorizado Total -->
    <div class="bg-white p-4 rounded-xl border border-surface-200 shadow-xs flex items-center justify-between hover:border-surface-300 transition-all">
      <div>
        <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">Valorizado Total (Costo)</span>
        <div class="text-2xl font-bold text-surface-900 mt-1">{{ formatCurrency(valorizadoTotal) }}</div>
        <div class="flex items-center text-[11px] text-surface-400 mt-0.5">
          <span class="material-symbols-outlined text-[14px] text-surface-400 mr-1">payments</span>
          Precio Venta: {{ formatCurrency(precioVentaTotal) }}
        </div>
      </div>
      <div class="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
        <span class="material-symbols-outlined text-[24px]">attach_money</span>
      </div>
    </div>

    <!-- KPI 4: Alertas de Stock -->
    <div class="bg-white p-4 rounded-xl border border-red-200 shadow-xs flex items-center justify-between hover:border-red-300 transition-all">
      <div>
        <span class="text-xs font-semibold text-red-700 uppercase tracking-wider">Alertas de Stock</span>
        <div class="text-2xl font-bold text-red-600 mt-1">{{ alertasStock }} <span class="text-sm font-normal text-red-600">items</span></div>
        <div class="flex items-center text-[11px] text-red-600 font-medium mt-0.5">
          <span class="material-symbols-outlined text-[14px] mr-0.5">warning</span>
          Bajo punto de reorden
        </div>
      </div>
      <div class="h-11 w-11 rounded-lg bg-red-100 text-red-700 flex items-center justify-center border border-red-200">
        <span class="material-symbols-outlined text-[24px]">crisis_alert</span>
      </div>
    </div>
  </div>
</template>
