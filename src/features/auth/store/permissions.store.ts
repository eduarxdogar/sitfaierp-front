import { defineStore } from "pinia";
import type {
  NormalizedActions,
  NormalizedPermissions,
  PermissionActions,
} from "@shared/types/permissions.types.ts";
import {
  getActionsByRoute,
  getPermissionsByRoute,
} from "@shared/adapter/permissions.adapter.ts";

type PermissionAction = keyof PermissionActions;

/**
 * Store de permisos — contiene el mapa de acceso CRUD por ruta del backend.
 *
 * Los permisos se cargan en login-page.vue tras el login exitoso
 * y se persisten en localStorage para sobrevivir recargas.
 *
 * Se limpian al hacer logout.
 */
export const usePermissionsStore = defineStore("permissions", {
  state: () => ({
    permissions: {} as NormalizedPermissions,
    actions: {} as NormalizedActions,
  }),

  getters: {
    getPermission: (state) => (key: string) => state.permissions[key],

    getActionsByRoute: (state) => (route: string) => {
      return getActionsByRoute(state.permissions, route);
    },

    /** Verifica si existe una acción específica para una ruta */
    hasAction:
      (state) =>
      (route: string, actionKey: string): boolean => {
        const actions = getActionsByRoute(state.permissions, route);
        return actions?.some((action) => action.key === actionKey) ?? false;
      },

    /** Verifica si el usuario puede acceder (canRead) a una ruta */
    canAccess:
      (state) =>
      (route: string): boolean => {
        const perms = getPermissionsByRoute(state.permissions, route);
        return !!perms?.canRead;
      },

    /** Verifica si el usuario puede realizar una acción CRUD sobre una ruta */
    canPerform:
      (state) =>
      (route: string, action: PermissionAction): boolean => {
        const perms = getPermissionsByRoute(state.permissions, route);
        return !!perms?.[action];
      },

    hasPermission:
      (state) =>
      (key: string): boolean =>
        key in state.permissions,
  },

  actions: {
    setPermissions(permissions: NormalizedPermissions) {
      this.permissions = permissions;
    },

    clearPermissions() {
      this.permissions = {};
    },
  },

  persist: {
    key: "permissions",
    storage: localStorage,
  },
});
