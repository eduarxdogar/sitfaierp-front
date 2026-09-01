// ─────────────────────────────────────────────────────────────────────────────
// IAM DTOs — interfaces que espeja el contrato del backend
// ─────────────────────────────────────────────────────────────────────────────

export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO' | 'INVITADO';

export interface UsuarioResponse {
  id: string;
  username: string;
  email: string;
  nombreCompleto: string;
  telefono?: string;
  rol: string;            // nombre del rol
  rolId: string;
  estado: EstadoUsuario;
  empresa: string;
  empresa_id: string;
  sucursal?: string;
  avatarInitials: string;
  ultimoAcceso?: string;
  fechaCreacion: string;
}

export interface RolResponse {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  usuariosCount: number;
  esSistema: boolean;
  permisos?: PermisoModulo[];
  fechaActualizacion: string;
}

export interface CrearUsuarioRequest {
  nombreCompleto: string;
  username: string;
  email: string;
  rolId: string;
  empresa: string;
  empresa_id: string;
  sucursal?: string;
  estado: EstadoUsuario;
  enviarInvitacion?: boolean;
}

export interface CambiarEstadoRequest {
  estado: EstadoUsuario;
}

export interface PermisoModulo {
  modulo: string;
  acciones: string[];
}

export interface CrearRolRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  permisos: PermisoModulo[];
}
