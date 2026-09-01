// ─────────────────────────────────────────────────────────────────────────────
// useIam — Motor de datos del módulo IAM
//
// NOTA sobre roles: Keycloak es la fuente de verdad para los roles. El backend
// Spring Boot aún no expone GET /iam/roles. Se usa un array quemado temporal
// hasta que el endpoint esté disponible.
// ─────────────────────────────────────────────────────────────────────────────
import { useSimpleQueryHook } from '@/shared/hooks/tanstack/use-simple-query.hook';
import { useSimpleMutationHook } from '@/shared/hooks/tanstack/use-simple-mutation.hook';
import { useQueryClient } from '@tanstack/vue-query';
import { IAM_KEYS, IAM_ENDPOINTS } from '../constants/iam.keys';
import type {
  UsuarioResponse,
  RolResponse,
  CrearUsuarioRequest,
  CambiarEstadoRequest,
  CrearRolRequest,
} from '../dto/iam.dto';

export function useIam() {
  const queryClient = useQueryClient();

  // ── Queries ────────────────────────────────────────────────────────────────

  /**
   * GET http://localhost:8000/api/v1/iam/usuarios
   * Lista todos los usuarios corporativos del sistema.
   */
  const obtenerUsuarios = useSimpleQueryHook<UsuarioResponse[]>(
    IAM_ENDPOINTS.usuarios,
    [...IAM_KEYS.all],
  );

  /**
   * GET http://localhost:8000/api/v1/iam/roles
   * Lista todos los roles del sistema.
   */
  const obtenerRoles = useSimpleQueryHook<RolResponse[]>(
    IAM_ENDPOINTS.roles,
    [...IAM_KEYS.roles],
  );

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * POST http://localhost:8000/api/v1/iam/usuarios
   * Crea un nuevo usuario corporativo.
   */
  const crearUsuario = useSimpleMutationHook<UsuarioResponse, CrearUsuarioRequest>(
    IAM_ENDPOINTS.usuarios,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...IAM_KEYS.all] });
      },
    },
  );

  /**
   * POST http://localhost:8000/api/v1/iam/roles
   * Crea un nuevo rol.
   */
  const crearRol = useSimpleMutationHook<RolResponse, CrearRolRequest>(
    IAM_ENDPOINTS.roles,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...IAM_KEYS.roles] });
      },
    },
  );

  /**
   * PATCH http://localhost:8000/api/v1/iam/usuarios/{id}/estado
   * Alterna el estado del usuario (ACTIVO ↔ INACTIVO).
   */
  const cambiarEstadoUsuario = useSimpleMutationHook<
    UsuarioResponse,
    { id: string; data: CambiarEstadoRequest }
  >(
    (vars) => IAM_ENDPOINTS.estado(vars.id),
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...IAM_KEYS.all] });
      },
    },
  );

  /**
   * PUT http://localhost:8000/api/v1/iam/usuarios/{id}
   * Actualiza los datos de un usuario existente.
   */
  const actualizarUsuario = useSimpleMutationHook<
    UsuarioResponse,
    { id: string; data: CrearUsuarioRequest }
  >(
    (vars) => IAM_ENDPOINTS.detalle(vars.id),
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...IAM_KEYS.all] });
      },
    },
  );

  /**
   * DELETE http://localhost:8000/api/v1/iam/usuarios/{id}
   * Elimina un usuario del sistema.
   */
  const eliminarUsuario = useSimpleMutationHook<void, string>(
    (id) => IAM_ENDPOINTS.detalle(id),
    'DELETE',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...IAM_KEYS.all] });
      },
    },
  );

  return {
    // queries
    obtenerUsuarios,
    obtenerRoles,
    // mutations
    crearUsuario,
    crearRol,
    cambiarEstadoUsuario,
    actualizarUsuario,
    eliminarUsuario,
  };
}
