import { useSimpleQueryHook } from '@/shared/hooks/tanstack/use-simple-query.hook';
import { useSimpleMutationHook } from '@/shared/hooks/tanstack/use-simple-mutation.hook';
import { PRODUCTOS_ENDPOINTS, PRODUCTOS_KEYS } from '../constants/productos.keys';
import type { ProductoResponse, CrearProductoRequest } from '../dto/productos.dto';
import { useQueryClient } from '@tanstack/vue-query';

export function useProductos() {
  const queryClient = useQueryClient();

  const obtenerProductos = useSimpleQueryHook<ProductoResponse[], undefined>(
    () => PRODUCTOS_ENDPOINTS.base,
    () => [...PRODUCTOS_KEYS.all]
  );

  const crearProductoMutation = useSimpleMutationHook<ProductoResponse, CrearProductoRequest>(
    PRODUCTOS_ENDPOINTS.base,
    "POST",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...PRODUCTOS_KEYS.all] });
      },
    }
  );

  return { obtenerProductos, crearProductoMutation };
}