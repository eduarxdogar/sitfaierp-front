import { useSimpleQueryHook } from '@/shared/hooks/tanstack/use-simple-query.hook';
import { useSimpleMutationHook } from '@/shared/hooks/tanstack/use-simple-mutation.hook';
import { SUCURSALES_ENDPOINTS, SUCURSALES_KEYS } from './sucursales.keys';
import type { SucursalResponse } from '../../dto/empresas.dto';
import type { CrearSucursalRequest } from './sucursales.dto';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { EMPRESAS_KEYS } from '../../constants/empresas.keys';

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

  const crearSucursalMutation = useSimpleMutationHook<SucursalResponse, CrearSucursalRequest>(
    () => {
      const id = toValue(empresaId);
      if (!id) throw new Error("ID de empresa requerido");
      return SUCURSALES_ENDPOINTS.base(id);
    },
    'POST',
    {
      mutationKey: ['crear_sucursal'],
      onSuccess: () => {
        const id = toValue(empresaId);
        if (id) {
          queryClient.invalidateQueries({ queryKey: [...SUCURSALES_KEYS.byEmpresa(id)] });
        }
        queryClient.invalidateQueries({ queryKey: [...EMPRESAS_KEYS.all] });
      }
    }
  );
  const cambiarEstadoSucursalMutation = useSimpleMutationHook<SucursalResponse, { empresaId: string; sucursalId: string; nuevoEstado: string }>(
    (variables) => SUCURSALES_ENDPOINTS.estado(variables.empresaId, variables.sucursalId),
    'PATCH',
    {
      mutationKey: ['cambiar_estado_sucursal'],
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: [...SUCURSALES_KEYS.byEmpresa(variables.empresaId)] });
      }
    }
  );

  return { obtenerSucursales, crearSucursalMutation, cambiarEstadoSucursalMutation };
}
