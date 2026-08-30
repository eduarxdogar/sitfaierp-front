<script setup lang="ts">
import { useProductos } from '../composables/useProductos';

const { obtenerProductos } = useProductos();
const { data: productos, isLoading, isError } = obtenerProductos;
</script>

<template>
  <div class="card">
    <div v-if="isLoading" class="p-8 text-center text-gray-500">
      Cargando productos...
    </div>
    <div v-else-if="isError" class="p-8 text-center text-red-500">
      Error al cargar productos
    </div>
    <div v-else-if="!productos?.length" class="p-8 text-center text-gray-500">
      No hay productos registrados
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-6 py-3">SKU</th>
            <th class="px-6 py-3">Nombre</th>
            <th class="px-6 py-3">Unidad</th>
            <th class="px-6 py-3">Precio Venta</th>
            <th class="px-6 py-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.productoId" class="border-b">
            <td class="px-6 py-4">{{ producto.sku }}</td>
            <td class="px-6 py-4">{{ producto.nombre }}</td>
            <td class="px-6 py-4">{{ producto.unidadMedida || '-' }}</td>
            <td class="px-6 py-4">{{ producto.precioVenta }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded text-xs" :class="producto.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ producto.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>