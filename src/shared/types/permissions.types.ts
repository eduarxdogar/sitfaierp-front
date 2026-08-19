/**
 * Tipos del sistema de permisos granulares del backend.
 *
 * El backend devuelve BackendModule[] que representa los módulos accesibles
 * para el usuario logueado. Cada módulo tiene permisos CRUD por sub-ruta.
 */

export interface PermissionActions {
  canRead: boolean;
  canView?: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canInactive: boolean;
  canActive: boolean;
}

export interface BackActions {
  key: string;
  name: string;
}

export interface BackendPermissionItem {
  name?: string;
  key: string;
  route: string;
  actions?: BackActions[];
  permissions: PermissionActions;
}

export interface BackendModule {
  name: string;
  route: string;
  permissions: BackendPermissionItem[];
}

export interface NormalizedModule {
  name: string;
  route: string;
  actions?: Record<string, BackActions[]>;
  permissions: Record<string, PermissionActions>;
}

export interface UserRole {
  id: string;
  name: string;
}

/** Mapa indexado por ruta de módulo para acceso O(1) */
export type NormalizedPermissions = Record<string, NormalizedModule>;

export type NormalizedActions = Record<string, BackActions[]>;
