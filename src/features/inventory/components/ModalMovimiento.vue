<script setup lang="ts">
import { computed } from 'vue';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import type { ProductoInventario } from '../dto/inventory.dto';
import { TipoMovimiento } from '../dto/inventory.dto';

const props = defineProps<{
  productos: ProductoInventario[];
  initialProductId?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: any): void;
}>();

// Esquema Zod
const schema = toTypedSchema(z.object({
  tipoMov: z.nativeEnum(TipoMovimiento),
  productoId: z.string().min(1, 'Debe seleccionar un producto'),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  motivo: z.string().min(1, 'Debe seleccionar un motivo'),
  documentoReferencia: z.string().optional()
}));

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    tipoMov: TipoMovimiento.INGRESO,
    productoId: props.initialProductId || '',
    cantidad: 0,
    motivo: '',
    documentoReferencia: ''
  }
});

const { value: tipoMov } = useField<TipoMovimiento>('tipoMov');
const { value: productoId, errorMessage: errorProducto } = useField<string>('productoId');
const { value: cantidad, errorMessage: errorCantidad } = useField<number>('cantidad');
const { value: motivo, errorMessage: errorMotivo } = useField<string>('motivo');
const { value: documentoReferencia } = useField<string>('documentoReferencia');

const selectedProduct = computed(() => {
  return props.productos.find(p => p.id === productoId.value);
});

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    tipo: values.tipoMov,
    productoId: values.productoId,
    cantidad: values.cantidad,
    motivo: values.motivo,
    documentoReferencia: values.documentoReferencia,
    responsable: 'SUPER_ADMIN' // Harcoded per design
  });
});
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-surface-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl border border-surface-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Header Modal -->
      <div class="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50">
        <div class="flex items-center space-x-3">
          <div class="h-9 w-9 rounded-lg flex items-center justify-center text-white"
            :class="tipoMov === TipoMovimiento.INGRESO ? 'bg-emerald-600' : 'bg-red-600'">
            <span class="material-symbols-outlined text-[20px]">
              {{ tipoMov === TipoMovimiento.INGRESO ? 'add_shopping_cart' : 'remove_shopping_cart' }}
            </span>
          </div>
          <div>
            <h3 class="text-base font-bold text-surface-900">
              Registrar Movimiento de Kardex
            </h3>
            <p class="text-xs text-surface-500">
              Bodega: <strong class="text-surface-700">Bodega Principal (BOD-01)</strong>
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="text-surface-400 hover:text-surface-600 rounded-lg p-1.5 hover:bg-surface-200 transition-colors">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Formulario de Movimiento -->
      <form @submit="onSubmit" class="p-6 space-y-4">
        
        <!-- Selector de Tipo de Movimiento -->
        <div>
          <span class="block text-xs font-semibold text-surface-700 mb-2">
            Tipo de OperaciÃ³n <span class="text-red-500">*</span>
          </span>
          <div class="grid grid-cols-2 gap-3">
            
            <!-- OpciÃ³n Ingreso (Verde) -->
            <label
              for="radio-ingreso"
              class="flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all"
              :class="{
                'border-emerald-600 bg-emerald-50': tipoMov === TipoMovimiento.INGRESO,
                'border-surface-200': tipoMov !== TipoMovimiento.INGRESO
              }">
              <input
                id="radio-ingreso"
                type="radio"
                name="tipoMov"
                :value="TipoMovimiento.INGRESO"
                v-model="tipoMov"
                class="text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
              <div>
                <div class="text-xs font-bold" :class="tipoMov === TipoMovimiento.INGRESO ? 'text-emerald-900' : 'text-surface-700'">
                  + INGRESO DE STOCK
                </div>
                <span class="text-[11px] text-surface-500">Compra, recepciÃ³n o ajuste (+)</span>
              </div>
            </label>

            <!-- OpciÃ³n Egreso (Rojo) -->
            <label
              for="radio-egreso"
              class="flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all"
              :class="{
                'border-red-600 bg-red-50': tipoMov === TipoMovimiento.EGRESO,
                'border-surface-200': tipoMov !== TipoMovimiento.EGRESO
              }">
              <input
                id="radio-egreso"
                type="radio"
                name="tipoMov"
                :value="TipoMovimiento.EGRESO"
                v-model="tipoMov"
                class="text-red-600 focus:ring-red-500 h-4 w-4" />
              <div>
                <div class="text-xs font-bold" :class="tipoMov === TipoMovimiento.EGRESO ? 'text-red-900' : 'text-surface-700'">
                  - SALIDA / EGRESO
                </div>
                <span class="text-[11px] text-surface-500">Merma, despacho o ajuste (-)</span>
              </div>
            </label>

          </div>
        </div>

        <!-- Selector de Producto (Buscador) -->
        <div>
          <label for="mov-producto-select" class="block text-xs font-semibold text-surface-700 mb-1">
            Producto / SKU <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-surface-400">inventory_2</span>
            <select
              id="mov-producto-select"
              v-model="productoId"
              class="w-full pl-9 pr-8 py-2 text-xs border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer text-surface-900 font-medium"
              :class="errorProducto ? 'border-red-500' : 'border-surface-300'">
              <option value="" disabled>Seleccione un producto del inventario...</option>
              <option v-for="prod in productos" :key="prod.id" :value="prod.id">
                {{ prod.sku }} - {{ prod.nombre }} (Stock actual: {{ prod.stockActual }} {{ prod.unidadMedida }})
              </option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-surface-400 pointer-events-none">expand_more</span>
          </div>
          <span v-if="errorProducto" class="text-red-500 text-xs mt-1">{{ errorProducto }}</span>
        </div>

        <!-- Grid: Cantidad y Motivo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Cantidad -->
          <div>
            <label for="mov-cantidad-input" class="block text-xs font-semibold text-surface-700 mb-1">
              Cantidad a mover <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="mov-cantidad-input"
                type="number"
                min="1"
                v-model="cantidad"
                placeholder="Ej. 50"
                class="w-full px-3 py-2 text-sm font-bold border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                :class="errorCantidad ? 'border-red-500' : 'border-surface-300'" />
              <span class="absolute right-3 top-2.5 text-xs text-surface-400 font-semibold">
                {{ selectedProduct?.unidadMedida || 'und' }}
              </span>
            </div>
            <span v-if="errorCantidad" class="text-red-500 text-xs mt-1">{{ errorCantidad }}</span>
          </div>

          <!-- Motivo -->
          <div>
            <label for="mov-motivo-select" class="block text-xs font-semibold text-surface-700 mb-1">
              Motivo de la OperaciÃ³n <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                id="mov-motivo-select"
                v-model="motivo"
                class="w-full px-3 pr-8 py-2 text-xs border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer text-surface-800"
                :class="errorMotivo ? 'border-red-500' : 'border-surface-300'">
                <option value="" disabled>Seleccione motivo</option>
                <template v-if="tipoMov === TipoMovimiento.INGRESO">
                  <option value="Compra a Proveedor">Compra a Proveedor (Factura)</option>
                  <option value="DevoluciÃ³n de Cliente">DevoluciÃ³n de Cliente</option>
                  <option value="Transferencia entre Bodegas">Transferencia desde otra Bodega</option>
                  <option value="Ajuste de Inventario (+)">Ajuste / Sobrante de Inventario</option>
                </template>
                <template v-else>
                  <option value="Despacho por Venta">Despacho por Venta / POS</option>
                  <option value="Merma por Vencimiento">Merma o Producto Vencido</option>
                  <option value="AverÃ­a o DaÃ±o FÃ­sico">AverÃ­a o DaÃ±o de Empaque</option>
                  <option value="Transferencia de Salida">Transferencia a otra Sucursal</option>
                  <option value="Consumo Interno">Consumo Interno / Muestras</option>
                </template>
              </select>
              <span class="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-surface-400 pointer-events-none">expand_more</span>
            </div>
            <span v-if="errorMotivo" class="text-red-500 text-xs mt-1">{{ errorMotivo }}</span>
          </div>

        </div>

        <!-- Referencia y Observaciones -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="mov-doc-ref" class="block text-xs font-semibold text-surface-700 mb-1">
              Doc. de Referencia (GuÃ­a / Factura)
            </label>
            <input
              id="mov-doc-ref"
              type="text"
              v-model="documentoReferencia"
              placeholder="Ej. GR-001-002931"
              class="w-full px-3 py-2 text-xs border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div>
            <label for="mov-responsable" class="block text-xs font-semibold text-surface-700 mb-1">
              Responsable
            </label>
            <input
              id="mov-responsable"
              type="text"
              readonly
              value="SUPER_ADMIN (Carlos Mendoza)"
              class="w-full px-3 py-2 text-xs border border-surface-200 rounded-lg bg-surface-100 text-surface-600 cursor-not-allowed" />
          </div>
        </div>

        <!-- Preview del Impacto en Stock -->
        <div v-if="selectedProduct" class="p-3 rounded-lg border border-surface-200 bg-surface-50 text-xs space-y-1 mt-4">
          <div class="font-semibold text-surface-800 flex items-center justify-between">
            <span>SimulaciÃ³n de Impacto en Kardex:</span>
            <span class="text-primary-700">{{ selectedProduct.sku }}</span>
          </div>
          <div class="flex items-center justify-between text-surface-600 pt-1">
            <span>Stock Actual en Bodega:</span>
            <strong class="text-surface-900">{{ selectedProduct.stockActual }} {{ selectedProduct.unidadMedida }}</strong>
          </div>
          <div class="flex items-center justify-between font-semibold"
            :class="tipoMov === TipoMovimiento.INGRESO ? 'text-emerald-700' : 'text-red-700'">
            <span>Nuevo Stock Resultante:</span>
            <span class="text-sm">
              {{ tipoMov === TipoMovimiento.INGRESO ? (selectedProduct.stockActual + (cantidad || 0)) : (selectedProduct.stockActual - (cantidad || 0)) }} {{ selectedProduct.unidadMedida }}
            </span>
          </div>
        </div>
        
        <!-- Footer Modal -->
        <div class="px-6 py-4 border-t border-surface-200 bg-surface-50 flex items-center justify-end space-x-3 -mx-6 -mb-6 mt-6">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-xs font-medium text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-100 transition-colors">
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-5 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            :class="tipoMov === TipoMovimiento.INGRESO ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'">
            <span class="material-symbols-outlined text-[18px] mr-1.5">check_circle</span>
            Confirmar {{ tipoMov === TipoMovimiento.INGRESO ? 'Ingreso' : 'Egreso' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
