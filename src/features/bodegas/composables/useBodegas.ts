import { useSimpleQueryHook } from '@/shared/hooks/tanstack/use-simple-query.hook';
import { useSimpleMutationHook } from '@/shared/hooks/tanstack/use-simple-mutation.hook';
import { BODEGAS_ENDPOINTS, BODEGAS_KEYS } from '../constants/bodegas.keys';
import type { BodegaResponse, CrearBodegaRequest } from '../dto/bodegas.dto';
import type { MaybeRefOrGetter } from 'vue';
import { toValue, computed } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

export function useBodegas(sucursalId?: MaybeRefOrGetter<string | null>) {
  const queryClient = useQueryClient();

  const obtenerBodegas = useSimpleQueryHook<BodegaResponse[]>(
    () => {
      const id = sucursalId ? toValue(sucursalId) : null;
      return id ? BODEGAS_ENDPOINTS.bySucursal(id) : BODEGAS_ENDPOINTS.base;
    },
    () => {
      const id = sucursalId ? toValue(sucursalId) : null;
      return id ? [...BODEGAS_KEYS.bySucursal(id)] : [...BODEGAS_KEYS.all];
    },
    undefined,
    {
      enabled: computed(() => sucursalId === undefined || !!toValue(sucursalId)) as any,
    }
  );

  const crearBodegaMutation = useSimpleMutationHook<BodegaResponse, { sucursalId: string; data: CrearBodegaRequest }>(
    (vars) => BODEGAS_ENDPOINTS.bySucursal(vars.sucursalId),
    'POST',
    {
      mutationKey: ['crear_bodega'],
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: [...BODEGAS_KEYS.bySucursal(variables.sucursalId)] });
        queryClient.invalidateQueries({ queryKey: [...BODEGAS_KEYS.all] });
      },
    }
  );

  return { obtenerBodegas, crearBodegaMutation };
}
