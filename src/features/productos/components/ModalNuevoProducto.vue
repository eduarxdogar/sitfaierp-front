<script setup lang="ts">

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { crearProductoSchema, type CrearProductoForm } from '../schema/productos.schema';
import { useProductos } from '../composables/useProductos';

const emit = defineEmits(['close']);
const { crearProductoMutation } = useProductos();

const { handleSubmit, errors, defineField } = useForm<CrearProductoForm>({
  validationSchema: toTypedSchema(crearProductoSchema),
  initialValues: {
    precioCompra: 0,
    precioVenta: 0,
  }
});

const [sku, skuProps] = defineField('sku');
const [nombre, nombreProps] = defineField('nombre');
const [precioCompra, precioCompraProps] = defineField('precioCompra');
const [precioVenta, precioVentaProps] = defineField('precioVenta');
const [categoriaId, categoriaIdProps] = defineField('categoriaId');

const onSubmit = handleSubmit(async (values) => {
  await crearProductoMutation.mutateAsync(values);
  emit('close');
});
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Nuevo Producto</h3>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">&times;</button>
      </div>

      <form @submit="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">SKU</label>
          <input v-model="sku" v-bind="skuProps" type="text" class="w-full border rounded p-2" />
          <p v-if="errors.sku" class="text-red-500 text-xs mt-1">{{ errors.sku }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Nombre</label>
          <input v-model="nombre" v-bind="nombreProps" type="text" class="w-full border rounded p-2" />
          <p v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Categoría</label>
          <input v-model="categoriaId" v-bind="categoriaIdProps" type="text" class="w-full border rounded p-2" placeholder="ID de Categoría" />
          <p v-if="errors.categoriaId" class="text-red-500 text-xs mt-1">{{ errors.categoriaId }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Precio Compra</label>
            <input v-model.number="precioCompra" v-bind="precioCompraProps" type="number" class="w-full border rounded p-2" />
            <p v-if="errors.precioCompra" class="text-red-500 text-xs mt-1">{{ errors.precioCompra }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Precio Venta</label>
            <input v-model.number="precioVenta" v-bind="precioVentaProps" type="number" class="w-full border rounded p-2" />
            <p v-if="errors.precioVenta" class="text-red-500 text-xs mt-1">{{ errors.precioVenta }}</p>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button type="button" @click="emit('close')" class="mr-2 px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
          <button type="submit" :disabled="crearProductoMutation.isPending.value" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
            <span v-if="crearProductoMutation.isPending.value" class="mr-2">...</span>
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>