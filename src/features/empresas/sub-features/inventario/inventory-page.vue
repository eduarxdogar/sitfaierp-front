<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useInventory } from './composables/useInventory';
import InventoryStats from './components/InventoryStats.vue';
import InventoryToolbar from './components/InventoryToolbar.vue';
import KardexTable from './components/KardexTable.vue';
import ModalMovimiento from './components/ModalMovimiento.vue';
import type { ProductoInventario } from './dto/inventory.dto';

const route = useRoute();
const empresaId = computed(() => route.params.empresaId as string || 'EMP-01');
const sucursalId = computed(() => route.params.sucursalId as string || 'SUC-01');
const bodegaId = computed(() => route.params.bodegaId as string || 'BOD-01');

const { obtenerInventario, registrarMovimientoMutation, obtenerKardex } = useInventory(sucursalId, bodegaId);
const { data: productos, isPending, refetch } = obtenerInventario;

// Filters
const searchQuery = ref('');
const categoriaSeleccionada = ref('ALL');
const estadoSeleccionado = ref('ALL');

const filteredProductos = computed(() => {
  if (!productos.value) return [];
  let result: ProductoInventario[] = productos.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((p: ProductoInventario) => 
      p.sku.toLowerCase().includes(q) || 
      p.nombre.toLowerCase().includes(q) ||
      p.codigoBarras.includes(q)
    );
  }

  if (categoriaSeleccionada.value !== 'ALL') {
    result = result.filter((p: ProductoInventario) => p.categoria === categoriaSeleccionada.value);
  }

  if (estadoSeleccionado.value !== 'ALL') {
    result = result.filter((p: ProductoInventario) => p.estado === estadoSeleccionado.value);
  }

  return result;
});

const totalValorizadoFiltrado = computed(() => {
  return filteredProductos.value.reduce((sum: number, p: ProductoInventario) => sum + p.valorizado, 0);
});

// Modal Movimiento
const isModalMovimientoOpen = ref(false);
const initialProductIdForModal = ref<string | undefined>(undefined);

const openModalMovimiento = (productoId?: string) => {
  initialProductIdForModal.value = productoId;
  isModalMovimientoOpen.value = true;
};

const handleMovimientoSubmit = async (payload: any) => {
  await registrarMovimientoMutation.mutateAsync(payload);
  isModalMovimientoOpen.value = false;
};

// Drawer Kardex
const isKardexOpen = ref(false);
const selectedProductoKardex = ref<ProductoInventario | null>(null);

const { data: kardexList } = obtenerKardex(computed(() => selectedProductoKardex.value?.id || ''));

const openKardex = (producto: ProductoInventario) => {
  selectedProductoKardex.value = producto;
  isKardexOpen.value = true;
};
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
    
    <!-- Breadcrumb Navigation & Top Action Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <nav class="flex items-center space-x-2 text-xs text-surface-500 mb-1.5 font-medium" aria-label="Ruta de navegación">
          <router-link to="/empresas" class="hover:text-primary-600 cursor-pointer flex items-center transition-colors">
            <span class="material-symbols-outlined text-[15px] mr-1 text-surface-400">home</span>
            Empresas
          </router-link>
          <span class="text-surface-300">/</span>
          <router-link :to="`/empresas/${empresaId}/sucursales`" class="hover:text-primary-600 cursor-pointer flex items-center transition-colors">
            <span class="material-symbols-outlined text-[15px] mr-1 text-surface-400">domain</span>
            Empresa {{ empresaId }}
          </router-link>
          <span class="text-surface-300">/</span>
          <router-link :to="`/empresas/${empresaId}/sucursales/${sucursalId}/bodegas`" class="hover:text-primary-600 cursor-pointer flex items-center transition-colors">
            <span class="material-symbols-outlined text-[15px] mr-1 text-surface-400">store</span>
            Sucursal {{ sucursalId }}
          </router-link>
          <span class="text-surface-300">/</span>
          <span class="text-primary-700 font-semibold bg-primary-50 px-2 py-0.5 rounded border border-primary-100 flex items-center">
            <span class="material-symbols-outlined text-[14px] mr-1 text-primary-600">warehouse</span>
            Bodega {{ bodegaId }}
          </span>
        </nav>

        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-bold text-surface-900 tracking-tight">
            Control de Inventario - Bodega Principal
          </h1>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-green-100 text-green-800 border border-green-200">
            <span class="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5 animate-pulse"></span>
            Sede Operativa {{ bodegaId }}
          </span>
        </div>
        <p class="text-xs text-surface-500 mt-0.5">
          Existencias fÃ­sicas valorizadas en tiempo real, trazabilidad por SKU y registro de movimientos de almacén.
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <button
          type="button"
          class="px-3.5 py-2 text-xs font-semibold text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors shadow-xs flex items-center cursor-pointer">
          <span class="material-symbols-outlined text-[18px] mr-1.5 text-emerald-600">download</span>
          Exportar Inventario
        </button>

        <button
          type="button"
          @click="openModalMovimiento()"
          class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded shadow flex items-center font-semibold text-xs transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[18px] mr-1.5">swap_horiz</span>
          + Registrar Movimiento
        </button>
      </div>
    </div>

    <template v-if="isPending">
      <div class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    </template>
    <template v-else-if="productos">
      <!-- Tarjetas de Resumen -->
      <InventoryStats :productos="productos" />

      <!-- Barra de Filtros y Herramientas y Tabla -->
      <div class="bg-white rounded-xl border border-surface-200 shadow-xs overflow-hidden">
        
        <InventoryToolbar
          v-model:searchQuery="searchQuery"
          v-model:categoriaSeleccionada="categoriaSeleccionada"
          v-model:estadoSeleccionado="estadoSeleccionado"
          @refresh="refetch"
        />

        <KardexTable 
          :productos="filteredProductos"
          @view-kardex="openKardex"
          @quick-move="p => openModalMovimiento(p.id)"
        />

        <!-- Footer de Tabla -->
        <div class="px-4 py-3 bg-surface-50 border-t border-surface-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-surface-500 gap-2">
          <div>
            Mostrando <span class="font-bold text-surface-800">{{ filteredProductos.length }}</span> de <span class="font-bold text-surface-800">{{ productos.length }}</span> productos registrados en Bodega Principal
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-surface-600">Suma Valorizado: <strong class="text-surface-900">{{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValorizadoFiltrado) }}</strong></span>
            <div class="inline-flex space-x-1">
              <button class="px-2.5 py-1 border border-surface-200 bg-white rounded text-surface-400 cursor-not-allowed">Anterior</button>
              <button class="px-2.5 py-1 border border-primary-500 bg-primary-50 font-bold text-primary-700 rounded">1</button>
              <button class="px-2.5 py-1 border border-surface-200 bg-white rounded text-surface-600 hover:bg-surface-100">Siguiente</button>
            </div>
          </div>
        </div>

      </div>
    </template>
    
    <!-- Modal Movimiento -->
    <ModalMovimiento
      v-if="isModalMovimientoOpen"
      :productos="productos || []"
      :initial-product-id="initialProductIdForModal"
      @close="isModalMovimientoOpen = false"
      @submit="handleMovimientoSubmit"
    />

    <!-- Drawer / Modal Kardex (Simple mockup to show interaction) -->
    <div v-if="isKardexOpen && selectedProductoKardex" class="fixed inset-0 z-50 overflow-y-auto bg-surface-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl border border-surface-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div class="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div class="flex items-center space-x-3">
            <div class="h-9 w-9 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <span class="material-symbols-outlined text-[20px]">history</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-surface-900">
                Historial Kardex - {{ selectedProductoKardex.nombre }}
              </h3>
              <p class="text-xs text-surface-500 font-mono">
                SKU: {{ selectedProductoKardex.sku }} | Bodega {{ bodegaId }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="isKardexOpen = false"
            class="text-surface-400 hover:text-surface-600 rounded-lg p-1.5 hover:bg-surface-200 transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto rounded-lg border border-surface-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-surface-100 text-surface-700 font-bold border-b border-surface-200 uppercase">
                <tr>
                  <th class="px-3 py-2">Fecha</th>
                  <th class="px-3 py-2">Operación</th>
                  <th class="px-3 py-2">Motivo / Doc</th>
                  <th class="px-3 py-2 text-right">Cantidad</th>
                  <th class="px-3 py-2 text-right">Saldo</th>
                  <th class="px-3 py-2">Responsable</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-200">
                <tr v-for="mov in kardexList" :key="mov.id" class="hover:bg-surface-50">
                  <td class="px-3 py-2 text-surface-600 font-mono">{{ new Date(mov.fecha).toLocaleString() }}</td>
                  <td class="px-3 py-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="mov.tipo === 'INGRESO' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'">
                      {{ mov.tipo }}
                    </span>
                  </td>
                  <td class="px-3 py-2">
                    <div class="font-medium text-surface-900">{{ mov.motivo }}</div>
                    <div class="text-[10px] text-surface-400 font-mono">{{ mov.documentoReferencia }}</div>
                  </td>
                  <td class="px-3 py-2 text-right font-bold"
                    :class="mov.tipo === 'INGRESO' ? 'text-emerald-700' : 'text-red-700'">
                    {{ mov.tipo === 'INGRESO' ? '+' : '-' }}{{ mov.cantidad }}
                  </td>
                  <td class="px-3 py-2 text-right font-semibold text-surface-900">{{ mov.stockNuevo }}</td>
                  <td class="px-3 py-2 text-surface-500 text-[11px]">{{ mov.responsable }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="px-6 py-3 border-t border-surface-200 bg-surface-50 flex items-center justify-end">
          <button
            type="button"
            @click="isKardexOpen = false"
            class="px-4 py-1.5 text-xs font-semibold text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-100">
            Cerrar Kardex
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
