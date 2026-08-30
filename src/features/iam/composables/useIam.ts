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
} from '../dto/iam.dto';

// ─── Roles quemados temporales (Keycloak los provee, endpoint pendiente) ─────
export const ROLES_HARDCODED: RolResponse[] = [
  {
    id: '1',
    codigo: 'SUPER_ADMIN',
    nombre: 'Super Administrador',
    descripcion: 'Acceso total al sistema ERP',
    usuariosCount: 0,
    esSistema: true,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: '2',
    codigo: 'GERENTE_OPERACIONES',
    nombre: 'Gerente de Operaciones',
    descripcion: 'Gestión operativa de empresas y bodegas',
    usuariosCount: 0,
    esSistema: false,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: '3',
    codigo: 'ANALISTA_FACTURACION',
    nombre: 'Analista de Facturación',
    descripcion: 'Acceso al módulo de facturación electrónica',
    usuariosCount: 0,
    esSistema: false,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: '4',
    codigo: 'CAJERO_POS',
    nombre: 'Cajero / Operador POS',
    descripcion: 'Operación de puntos de venta',
    usuariosCount: 0,
    esSistema: false,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: '5',
    codigo: 'BODEGA_OPERATOR',
    nombre: 'Operador de Bodega',
    descripcion: 'Gestión de inventario y almacenes',
    usuariosCount: 0,
    esSistema: false,
    fechaActualizacion: new Date().toISOString(),
  },
];

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
    // mutations
    crearUsuario,
    cambiarEstadoUsuario,
    actualizarUsuario,
    eliminarUsuario,
  };
}
