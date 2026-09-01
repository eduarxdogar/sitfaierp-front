<script setup lang="ts">
import type { ProductoInventario } from '../dto/inventory.dto';
import { EstadoStock } from '../dto/inventory.dto';

const props = defineProps<{
  productos: ProductoInventario[];
}>();

const emit = defineEmits<{
  (e: 'view-kardex', producto: ProductoInventario): void;
  (e: 'quick-move', producto: ProductoInventario): void;
}>();

const getStockColor = (item: ProductoInventario) => {
  if (item.stockActual <= item.stockMinimo) return 'text-red-600';
  if (item.stockActual <= item.stockSeguridad) return 'text-amber-600';
  return 'text-surface-900';
};

const getEstadoClasses = (estado: EstadoStock) => {
  switch (estado) {
    case EstadoStock.OPTIMO:
      return 'bg-green-100 text-green-800 border border-green-200';
    case EstadoStock.BAJO:
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case EstadoStock.CRITICO:
      return 'bg-red-100 text-red-800 border border-red-200';
    case EstadoStock.SOBRESTOCK:
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    default:
      return 'bg-surface-100 text-surface-800 border border-surface-200';
  }
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-xs text-surface-700">
      <thead class="bg-surface-100/80 text-surface-600 font-semibold border-b border-surface-200 uppercase tracking-wider text-[11px]">
        <tr>
          <th scope="col" class="px-4 py-3">SKU / CÓDIGO</th>
          <th scope="col" class="px-4 py-3">PRODUCTO / DESCRIPCIÓN</th>
          <th scope="col" class="px-4 py-3">CATEGORÍA</th>
          <th scope="col" class="px-3 py-3 text-center">U.M.</th>
          <th scope="col" class="px-4 py-3 text-right">STOCK ACTUAL</th>
          <th scope="col" class="px-4 py-3 text-right">VALORIZADO (COSTO)</th>
          <th scope="col" class="px-4 py-3 text-center">ESTADO</th>
          <th scope="col" class="px-4 py-3 text-right">ACCIONES</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-surface-200 bg-white">
        <template v-if="productos.length > 0">
          <tr v-for="item in productos" :key="item.id" class="hover:bg-surface-50/80 transition-colors group">
            
            <!-- SKU & Código de Barras -->
            <td class="px-4 py-3 font-mono">
              <button
                type="button"
                @click="emit('view-kardex', item)"
                class="font-bold text-surface-900 group-hover:text-primary-600 transition-colors text-left hover:underline">
                {{ item.sku }}
              </button>
              <div class="text-[10px] text-surface-400 font-sans flex items-center mt-0.5">
                <span class="material-icons text-[11px] mr-1 text-surface-400">qr_code</span>
                {{ item.codigoBarras }}
              </div>
            </td>

            <!-- Producto -->
            <td class="px-4 py-3">
              <div class="font-medium text-surface-900 leading-snug">{{ item.nombre }}</div>
              <div class="text-[11px] text-surface-400 flex items-center mt-0.5">
                <span class="material-icons text-[12px] mr-1 text-surface-400">place</span>
                Pasillo: <span class="font-medium text-surface-600 ml-1">{{ item.ubicacionPasillo }}</span>
              </div>
            </td>

            <!-- Categoría -->
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface-100 text-surface-700 border border-surface-200">
                {{ item.categoria }}
              </span>
            </td>

            <!-- Unidad de Medida -->
            <td class="px-3 py-3 text-center">
              <span class="px-1.5 py-0.5 bg-surface-100 rounded text-[10px] font-mono text-surface-600 uppercase font-semibold">
                {{ item.unidadMedida }}
              </span>
            </td>

            <!-- Stock Actual -->
            <td class="px-4 py-3 text-right">
              <div class="font-bold text-sm" :class="getStockColor(item)">
                {{ new Intl.NumberFormat('en-US').format(item.stockActual) }}
              </div>
              <div class="text-[10px] text-surface-400">
                Mín: {{ item.stockMinimo }} | Seg: {{ item.stockSeguridad }}
              </div>
            </td>

            <!-- Valorizado -->
            <td class="px-4 py-3 text-right">
              <div class="font-semibold text-surface-900">
                {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.valorizado) }}
              </div>
              <div class="text-[10px] text-surface-400">
                Unit: {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.costoUnitario) }}
              </div>
            </td>

            <!-- Estado Badge -->
            <td class="px-4 py-3 text-center">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                :class="getEstadoClasses(item.estado)">
                <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                  :class="item.estado === EstadoStock.OPTIMO ? 'bg-green-600' : item.estado === EstadoStock.BAJO ? 'bg-amber-600' : 'bg-red-600'"></span>
                {{ item.estado }}
              </span>
            </td>

            <!-- Acciones -->
            <td class="px-4 py-3 text-right">
              <div class="inline-flex items-center space-x-1">
                <button
                  type="button"
                  @click="emit('view-kardex', item)"
                  class="p-1.5 rounded-md text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  title="Ver Historial Kardex">
                  <span class="material-icons text-[18px]">history</span>
                </button>
                <button
                  type="button"
                  @click="emit('quick-move', item)"
                  class="p-1.5 rounded-md text-surface-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Movimiento rápido (+/-)">
                  <span class="material-icons text-[18px]">add_circle_outline</span>
                </button>
              </div>
            </td>

          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="8" class="px-4 py-12 text-center text-surface-500">
              <div class="flex flex-col items-center justify-center">
                <span class="material-icons text-surface-300 text-4xl mb-2">search_off</span>
                <p class="font-medium text-surface-700">No se encontraron productos en esta bodega</p>
                <p class="text-xs text-surface-400 mt-1">Pruebe ajustando los términos de búsqueda o filtros de categoría.</p>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
