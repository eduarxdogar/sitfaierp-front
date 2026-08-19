import { useSimpleQueryHook } from '@/shared/hooks/tanstack/use-simple-query.hook';
import { useSimpleMutationHook } from '@/shared/hooks/tanstack/use-simple-mutation.hook';
import { SUCURSALES_ENDPOINTS, SUCURSALES_KEYS } from '../constants/sucursales.keys';
import { EMPRESAS_KEYS } from '../constants/empresas.keys';
import type { SucursalResponse } from '../dto/empresas.dto';
import type { CrearSucursalRequest } from '../dto/sucursales.dto';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

export function useSucursales(empresaId: MaybeRefOrGetter<string | null>) {
  const queryClient = useQueryClient();

  const obtenerSucursales = useSimpleQueryHook<SucursalResponse[]>(
    () => {
      const id = toValue(empresaId);
      return id ? SUCURSALES_ENDPOINTS.base(id) : '';
    },
    () => [...SUCURSALES_KEYS.byEmpresa(toValue(empresaId) || '')],
    undefined,
    {
      enabled: !!toValue(empresaId)
    }
  );

  const crearSucursalMutation = useSimpleMutationHook<SucursalResponse, { empresaId: string; data: CrearSucursalRequest }>(
    (variables) => SUCURSALES_ENDPOINTS.base(variables.empresaId),
    'POST',
    {
      onSuccess: (_, variables) => {
        // Invalidar las sucursales de esa empresa y la lista global de empresas
        queryClient.invalidateQueries({ queryKey: [...SUCURSALES_KEYS.byEmpresa(variables.empresaId)] });
        queryClient.invalidateQueries({ queryKey: [...EMPRESAS_KEYS.all] });
      }
    }
  );

  return { obtenerSucursales, crearSucursalMutation };
}
