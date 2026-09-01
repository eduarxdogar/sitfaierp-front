import { computed, toValue } from 'vue';
import { useQuery, useMutation } from '@tanstack/vue-query';
import { INVENTORY_KEYS } from '../constants/inventory.keys';
import { EstadoStock, type ProductoInventario, type MovimientoKardex, type CrearMovimientoRequest } from '../dto/inventory.dto';
import { httpClient } from '@/shared/services/http/client';
import { useToast } from '@/shared/composables/use-toast';

// Tipos que devuelve el backend
interface StockConsolidadoView {
  empresaId: string;
  bodegaId: string;
  productoId: string;
  cantidadTotal: number;
  ultimaActualizacion: string;
}

interface ProductoBackend {
  id?: string;
  productoId?: string;
  sku?: string;
  codigoBarras?: string;
  nombre?: string;
  descripcion?: string;
  categoriaId?: string;
  categoria?: string;
  unidadMedida?: string;
  stockMinimo?: number;
  stockSeguridad?: number;
  precioCompra?: number;
  costoUnitario?: number;
  precioVenta?: number;
  estado?: string;
  ubicacionPasillo?: string;
}

function calcularEstadoStock(stock: number, minimo: number): EstadoStock {
  if (stock <= 0) return EstadoStock.CRITICO;
  if (stock <= minimo) return EstadoStock.BAJO;
  if (stock > minimo * 3) return EstadoStock.SOBRESTOCK;
  return EstadoStock.OPTIMO;
}

export function useInventory(sucursalId: import('vue').MaybeRefOrGetter<string>, bodegaId: import('vue').MaybeRefOrGetter<string>) {
  const toast = useToast();

  const obtenerInventario = useQuery({
    queryKey: computed(() => INVENTORY_KEYS.list(`${toValue(sucursalId)}-${toValue(bodegaId)}`)),
    queryFn: async (): Promise<ProductoInventario[]> => {
      const bId = toValue(bodegaId);
      if (!bId || bId === 'BOD-01') return [];

      // 1. Traer el stock consolidado de la bodega (CQRS read model)
      const [stockList, productosList] = await Promise.all([
        httpClient<StockConsolidadoView[]>({
          url: `inventory/reports/stock-consolidado?bodegaId=${bId}`,
          method: 'GET',
        }),
        httpClient<ProductoBackend[]>({
          url: `catalog/productos`,
          method: 'GET',
        }),
      ]);

      // 2. Crear mapa de productos por ID para O(1) lookup
      const productoMap = new Map<string, ProductoBackend>();
      for (const p of productosList) {
        const id = p.id || p.productoId;
        if (id) productoMap.set(id, p);
      }

      // 3. Enriquecer: cruzar stock-view con catálogo
      return stockList.map((stock): ProductoInventario => {
        const prod = productoMap.get(stock.productoId);
        const stockMinimo = prod?.stockMinimo ?? 0;
        const costoUnitario = prod?.precioCompra ?? prod?.costoUnitario ?? 0;
        const cantidadTotal = Number(stock.cantidadTotal) || 0;

        return {
          id: stock.productoId,
          sku: prod?.sku ?? stock.productoId.slice(0, 8).toUpperCase(),
          codigoBarras: prod?.codigoBarras ?? '-',
          nombre: prod?.nombre ?? prod?.descripcion ?? `Producto ${stock.productoId.slice(0, 8)}`,
          categoria: prod?.categoriaId ?? prod?.categoria ?? 'Sin categoría',
          unidadMedida: prod?.unidadMedida ?? 'UND',
          stockActual: cantidadTotal,
          stockMinimo: stockMinimo,
          stockSeguridad: prod?.stockSeguridad ?? 0,
          costoUnitario: costoUnitario,
          precioVenta: prod?.precioVenta ?? 0,
          valorizado: cantidadTotal * costoUnitario,
          estado: calcularEstadoStock(cantidadTotal, stockMinimo),
          ubicacionPasillo: prod?.ubicacionPasillo ?? '-',
          ultimaActualizacion: stock.ultimaActualizacion ?? new Date().toISOString(),
        };
      });
    },
    enabled: computed(() => !!toValue(bodegaId) && toValue(bodegaId) !== 'BOD-01'),
  });

  const registrarMovimientoMutation = useMutation({
    mutationFn: async (payload: CrearMovimientoRequest) => {
      return await httpClient<any, CrearMovimientoRequest>({
        url: `bodegas/${toValue(bodegaId)}/movimientos`,
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
          url: `inventory/bodegas/${toValue(bodegaId)}/productos/${toValue(productoId)}/kardex`,
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
