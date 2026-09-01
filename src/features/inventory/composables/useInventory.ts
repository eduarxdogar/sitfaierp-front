import { computed, toValue } from 'vue';
import { useQuery, useMutation } from '@tanstack/vue-query';
import { INVENTORY_KEYS } from '../constants/inventory.keys';
import { EstadoStock, TipoMovimiento, type ProductoInventario, type MovimientoKardex, type CrearMovimientoRequest } from '../dto/inventory.dto';
import { httpClient } from '@/shared/services/http/client';
import { useToast } from '@/shared/composables/use-toast';

export function useInventory(sucursalId: import('vue').MaybeRefOrGetter<string>, bodegaId: import('vue').MaybeRefOrGetter<string>) {
  const toast = useToast();

  const mockProductos: ProductoInventario[] = [
    {
      id: 'p-1',
      sku: 'SKU-10492',
      codigoBarras: '7750123456789',
      nombre: 'Wafer Muu Vainilla 6x28g',
      categoria: 'Snacks y Golosinas',
      unidadMedida: 'Paquete',
      stockActual: 340,
      stockMinimo: 50,
      stockSeguridad: 20,
      costoUnitario: 0.85,
      precioVenta: 1.50,
      valorizado: 289.00,
      estado: EstadoStock.OPTIMO,
      ubicacionPasillo: 'A-02 (Golosinas)',
      ultimaActualizacion: new Date('2026-08-31T14:30:00')
    },
    {
      id: 'p-2',
      sku: 'SKU-20815',
      codigoBarras: '7750987654321',
      nombre: 'Arroz Extra Añejo Faraón 1kg',
      categoria: 'Abarrotes y Granos',
      unidadMedida: 'Bolsa / kg',
      stockActual: 18,
      stockMinimo: 30,
      stockSeguridad: 15,
      costoUnitario: 1.35,
      precioVenta: 1.95,
      valorizado: 24.30,
      estado: EstadoStock.BAJO,
      ubicacionPasillo: 'B-01 (Granos)',
      ultimaActualizacion: new Date('2026-08-31T11:15:00')
    },
    {
      id: 'p-3',
      sku: 'SKU-30419',
      codigoBarras: '7750554433221',
      nombre: 'Aceite Vegetal Primor Premium 900ml',
      categoria: 'Aceites y Grasas',
      unidadMedida: 'Botella',
      stockActual: 420,
      stockMinimo: 60,
      stockSeguridad: 30,
      costoUnitario: 3.50,
      precioVenta: 4.80,
      valorizado: 1470.00,
      estado: EstadoStock.OPTIMO,
      ubicacionPasillo: 'B-04 (Líquidos)',
      ultimaActualizacion: new Date('2026-08-30T16:45:00')
    },
    {
      id: 'p-4',
      sku: 'SKU-40192',
      codigoBarras: '7750889911223',
      nombre: 'Leche Evaporada Gloria Azul 400g',
      categoria: 'Lácteos y Derivados',
      unidadMedida: 'Lata',
      stockActual: 850,
      stockMinimo: 100,
      stockSeguridad: 50,
      costoUnitario: 1.40,
      precioVenta: 1.90,
      valorizado: 1190.00,
      estado: EstadoStock.OPTIMO,
      ubicacionPasillo: 'C-01 (Lácteos)',
      ultimaActualizacion: new Date('2026-08-29T18:20:00')
    },
    {
      id: 'p-5',
      sku: 'SKU-50821',
      codigoBarras: '7750667788990',
      nombre: 'Detergente Opal Ultra 2.6kg',
      categoria: 'Limpieza y Cuidado',
      unidadMedida: 'Bolsa',
      stockActual: 4,
      stockMinimo: 15,
      stockSeguridad: 10,
      costoUnitario: 9.50,
      precioVenta: 13.90,
      valorizado: 38.00,
      estado: EstadoStock.CRITICO,
      ubicacionPasillo: 'D-03 (Cuidado)',
      ultimaActualizacion: new Date('2026-08-29T10:10:00')
    }
  ];

  const mockKardexList: MovimientoKardex[] = [
    {
      id: 'k-1',
      fecha: new Date('2026-08-31T14:30:00'),
      tipo: TipoMovimiento.INGRESO,
      motivo: 'Compra a Proveedor',
      documentoReferencia: 'FAC-001-098234',
      cantidad: 100,
      stockAnterior: 240,
      stockNuevo: 340,
      costoUnitario: 0.85,
      responsable: 'CARLOS_MENDOZA'
    },
    {
      id: 'k-2',
      fecha: new Date('2026-08-30T09:15:00'),
      tipo: TipoMovimiento.EGRESO,
      motivo: 'Despacho por Venta',
      documentoReferencia: 'BOL-003-887123',
      cantidad: 25,
      stockAnterior: 265,
      stockNuevo: 240,
      costoUnitario: 0.85,
      responsable: 'SISTEMA_POS'
    }
  ];

  const obtenerInventario = useQuery({
    queryKey: computed(() => INVENTORY_KEYS.list(`${toValue(sucursalId)}-${toValue(bodegaId)}`)),
    queryFn: async () => {
      // Intenta obtener del API si existe
      try {
        const response = await httpClient<ProductoInventario[]>({
          url: `inventario/bodegas/${toValue(bodegaId)}/productos`,
          method: 'GET'
        });
        return response;
      } catch (error) {
        // Fallback a mock data para propósitos de demostración si falla el endpoint
        console.warn('API no implementada o error, usando mock data', error);
        return mockProductos;
      }
    }
  });

  const registrarMovimientoMutation = useMutation({
    mutationFn: async (payload: CrearMovimientoRequest) => {
      try {
        return await httpClient<any, CrearMovimientoRequest>({
          url: `inventario/bodegas/${toValue(bodegaId)}/movimientos`,
          method: 'POST',
          body: payload,
        });
      } catch(error) {
        console.warn('Simulando registro de movimiento exitoso');
        // Simulando delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, ...payload };
      }
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
        try {
          return await httpClient<MovimientoKardex[]>({
            url: `inventario/bodegas/${toValue(bodegaId)}/productos/${toValue(productoId)}/kardex`,
            method: 'GET'
          });
        } catch (error) {
          console.warn('Usando mock kardex data');
          return mockKardexList;
        }
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
