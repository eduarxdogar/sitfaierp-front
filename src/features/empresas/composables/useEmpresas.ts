import { useSimpleQueryHook } from '@/shared/hooks/tanstack/use-simple-query.hook';
import { useSimpleMutationHook } from '@/shared/hooks/tanstack/use-simple-mutation.hook';
import { EMPRESAS_ENDPOINTS, EMPRESAS_KEYS } from '../constants/empresas.keys';
import type { EmpresaResponse, CrearEmpresaRequest } from '../dto/empresas.dto';
import { useQueryClient } from '@tanstack/vue-query';

export function useEmpresas() {
  const queryClient = useQueryClient();

  const obtenerEmpresas = useSimpleQueryHook<EmpresaResponse[]>(
    EMPRESAS_ENDPOINTS.base,
    [...EMPRESAS_KEYS.all]
  );

  const crearEmpresaMutation = useSimpleMutationHook<EmpresaResponse, CrearEmpresaRequest>(
    EMPRESAS_ENDPOINTS.base,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...EMPRESAS_KEYS.all] });
      }
    }
  );

  const eliminarEmpresaMutation = useSimpleMutationHook<void, string>(
    (id: string) => EMPRESAS_ENDPOINTS.detail(id),
    'DELETE',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...EMPRESAS_KEYS.all] });
      }
    }
  );

  return {
    obtenerEmpresas,
    crearEmpresaMutation,
    eliminarEmpresaMutation,
  };
}
