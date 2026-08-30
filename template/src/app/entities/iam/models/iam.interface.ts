export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  BLOQUEADO = 'BLOQUEADO',
  INVITADO = 'INVITADO',
}

export enum ModuloSistema {
  DASHBOARD = 'Dashboard',
  EMPRESAS = 'Gestión de Empresas',
  IAM = 'IAM (Usuarios y Roles)',
  VENTAS_PEDIDOS = 'Ventas y Pedidos',
  INVENTARIO = 'Inventario y Almacenes',
  FACTURACION = 'Facturación Electrónica',
  POS = 'Punto de Venta (POS)',
}

export enum PermisoAccion {
  LEER = 'LEER',
  CREAR = 'CREAR',
  EDITAR = 'EDITAR',
  ELIMINAR = 'ELIMINAR',
  EXPORTAR = 'EXPORTAR',
}

export interface PermisoModulo {
  modulo: ModuloSistema;
  acciones: PermisoAccion[];
}

export interface Rol {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  permisos: PermisoModulo[];
  usuariosCount: number;
  esSistema: boolean;
  fechaActualizacion: string | Date;
}

export interface Usuario {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  rolId: string;
  rolNombre: string;
  empresa: string;
  sucursal?: string;
  estado: EstadoUsuario;
  avatarInitials: string;
  ultimoAcceso?: string | Date;
  fechaCreacion: string | Date;
}

export interface CreateUsuarioDto {
  nombreCompleto: string;
  email: string;
  telefono?: string;
  rolId: string;
  empresa: string;
  sucursal?: string;
  estado: EstadoUsuario;
  enviarInvitacion: boolean;
}

export interface CreateRolDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  permisos: PermisoModulo[];
}
