import { computed } from "vue";
import { useRoute } from "vue-router";
import { usePermissionsStore } from "@features/auth/store/permissions.store.ts";
import {
  getModuleByRoute,
  canAccess,
} from "@shared/adapter/permissions.adapter.ts";

export const PermissionAction = {
  READ: "canRead",
  VIEW: "canView",
  CREATE: "canCreate",
  UPDATE: "canUpdate",
  INACTIVE: "canInactive",
  ACTIVE: "canActive",
} as const;

export type PermissionAction =
  (typeof PermissionAction)[keyof typeof PermissionAction];

/**
 * Composable para verificar permisos desde componentes Vue.
 *
 * Uso:
 *   const { can } = usePermissions();
 *   const canCreate = can(PermissionAction.CREATE);
 *   const canEdit = can(PermissionAction.UPDATE, "/module/sub-route");
 */
export function usePermissions() {
  const route = useRoute();
  const permissionStore = usePermissionsStore();

  const currentModule = computed(() => {
    return getModuleByRoute(permissionStore.permissions, route.path);
  });

  function can(action: PermissionAction, customRoute?: string): boolean {
    return canAccess(
      permissionStore.permissions,
      customRoute ?? route.path,
      action,
    );
  }

  return {
    currentModule,
    can,
  };
}
