import { computed, toValue } from 'vue';
import { useQuery, useMutation } from '@tanstack/vue-query';
import { INVENTORY_KEYS } from '../constants/inventory.keys';
import { EstadoStock, type ProductoInventario, type MovimientoKardex, type CrearMovimientoRequest } from '../dto/inventory.dto';
import { httpClient } from '@/shared/services/http/client';
import { useToast } from '@/shared/composables/use-toast';

export function useInventory(sucursalId: import('vue').MaybeRefOrGetter<string>, bodegaId: import('vue').MaybeRefOrGetter<string>) {
  const toast = useToast();

  const obtenerInventario = useQuery({
    queryKey: computed(() => INVENTORY_KEYS.list(`${toValue(sucursalId)}-${toValue(bodegaId)}`)),
    queryFn: async () => {
      // Apuntamos al catálogo de productos o ruta de existencias
      const response = await httpClient<any[]>({
        url: `catalog/productos`,
        method: 'GET'
      });

      // Mapeamos la respuesta del backend a las columnas de la tabla
      return response.map((item: any) => ({
        id: item.productoId || item.id || crypto.randomUUID(),
        sku: item.sku || '-',
        codigoBarras: item.codigoBarras || '-',
        nombre: item.nombre || item.descripcion || '-', // Descripción
        categoria: item.categoriaId || item.categoria || 'Sin categoría', // Categoría
        unidadMedida: item.unidadMedida || '-', // Unidad de Medida
        stockActual: item.stockActual || item.stock || 0, // Stock Actual
        stockMinimo: item.stockMinimo || 0,
        stockSeguridad: item.stockSeguridad || 0,
        costoUnitario: item.precioCompra || item.costoUnitario || 0,
        precioVenta: item.precioVenta || 0,
        valorizado: item.valorizado || ((item.stockActual || item.stock || 0) * (item.precioCompra || item.costoUnitario || 0)), // Valorizado
        estado: item.estado === 'ACTIVO' ? EstadoStock.OPTIMO : (item.estadoStock || EstadoStock.OPTIMO),
        ubicacionPasillo: item.ubicacionPasillo || '-',
        ultimaActualizacion: item.actualizadoEn || item.ultimaActualizacion || new Date()
      })) as ProductoInventario[];
    }
  });

  const registrarMovimientoMutation = useMutation({
    mutationFn: async (payload: CrearMovimientoRequest) => {
      return await httpClient<any, CrearMovimientoRequest>({
        url: `inventario/bodegas/${toValue(bodegaId)}/movimientos`,
        method: 'POST',
        body: payload,
      });
    },
    onSuccess: () => {
      toast.success('Movimiento registrado correctamente');
      obtenerInventario.refetch();
    }
  });

  const obtenerKardex = (productoId: import('vue').MaybeRefOrGetter<string>) => {
    return useQuery({
      queryKey: computed(() => INVENTORY_KEYS.kardex(toValue(productoId))),
      queryFn: async () => {
        return await httpClient<MovimientoKardex[]>({
          url: `inventario/bodegas/${toValue(bodegaId)}/productos/${toValue(productoId)}/kardex`,
          method: 'GET'
        });
      },
      enabled: computed(() => !!toValue(productoId))
    });
  };

  return {
    obtenerInventario,
    registrarMovimientoMutation,
    obtenerKardex
  };
}
