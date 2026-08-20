import { useSimpleQueryHook } from '@/shared/hooks/tanstack/use-simple-query.hook';
import { httpClient } from '@/shared/services/http/client';
import { BODEGAS_ENDPOINTS, BODEGAS_KEYS } from '../constants/bodegas.keys';
import type { BodegaResponse, CrearBodegaRequest } from '../dto/bodegas.dto';
import type { MaybeRefOrGetter } from 'vue';
import { toValue, computed } from 'vue';
import { useQueryClient, useMutation } from '@tanstack/vue-query';

export function useBodegas(sucursalId?: MaybeRefOrGetter<string | null>, empresaId?: MaybeRefOrGetter<string | null>) {
  const queryClient = useQueryClient();

  const obtenerBodegas = useSimpleQueryHook<BodegaResponse[], undefined>(
    () => { const id = sucursalId ? toValue(sucursalId) : null; return id ? BODEGAS_ENDPOINTS.bySucursal(id) : BODEGAS_ENDPOINTS.base; },
    () => {
      const id = sucursalId ? toValue(sucursalId) : null;
      return id ? [...BODEGAS_KEYS.bySucursal(id)] : [...BODEGAS_KEYS.all];
    },
    undefined,
    {
      enabled: computed(() => sucursalId === undefined || !!toValue(sucursalId)) as any,
    }
  );

  const crearBodegaMutation = useMutation<BodegaResponse, Error, CrearBodegaRequest>({
    mutationKey: ['crear_bodega'],
    mutationFn: (body: CrearBodegaRequest) => {
      const eId = empresaId ? toValue(empresaId) : null;
      return httpClient<BodegaResponse, CrearBodegaRequest>({
        url: BODEGAS_ENDPOINTS.base,
        method: 'POST',
        body,
        headers: eId ? { 'X-Empresa-Id': eId } : undefined,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...BODEGAS_KEYS.bySucursal(variables.sucursalId)] });
      queryClient.invalidateQueries({ queryKey: [...BODEGAS_KEYS.all] });
    },
  });

  return { obtenerBodegas, crearBodegaMutation };
}



