import type {
  BackActions,
  BackendModule,
  NormalizedPermissions,
  PermissionActions,
} from "@shared/types/permissions.types.ts";

/**
 * Normaliza la respuesta del backend (BackendModule[]) a un mapa indexado por ruta.
 * Esto permite acceso O(1) al verificar permisos en el Navigation Guard y componentes.
 *
 * Estructura de entrada (backend):
 *   [ { name, route: "/module", permissions: [{ route: "/module/sub", permissions: {...} }] } ]
 *
 * Estructura de salida (normalizada):
 *   { "/module": { name, route, permissions: { "/module/sub": { canRead, canCreate, ... } } } }
 */
export function normalizePermissions(
  modules: BackendModule[],
): NormalizedPermissions {
  return modules.reduce<NormalizedPermissions>((acc, module) => {
    acc[module.route] = {
      name: module.name,
      route: module.route,

      actions: module.permissions.reduce<Record<string, BackActions[]>>(
        (permAcc, permission) => {
          permAcc[permission.route] = permission.actions ?? [];
          return permAcc;
        },
        {},
      ),

      permissions: module.permissions.reduce<Record<string, PermissionActions>>(
        (permAcc, permission) => {
          permAcc[permission.route] = permission.permissions;
          return permAcc;
        },
        {},
      ),
    };

    return acc;
  }, {});
}

export function getModuleByRoute(
  permissions: NormalizedPermissions,
  route: string,
) {
  return Object.values(permissions).find((module) =>
    route.startsWith(module.route),
  );
}

export function getPermissionsByRoute(
  permissions: NormalizedPermissions,
  route: string,
): PermissionActions | undefined {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;

  const module = Object.values(permissions).find((m) =>
    normalizedRoute.startsWith(m.route),
  );

  if (!module) return undefined;

  if (module.permissions[normalizedRoute]) {
    return module.permissions[normalizedRoute];
  }

  const matchedRoute = Object.keys(module.permissions).find((permRoute) =>
    normalizedRoute.startsWith(permRoute),
  );

  if (matchedRoute) {
    return module.permissions[matchedRoute];
  }

  return undefined;
}

export function getActionsByRoute(
  permissions: NormalizedPermissions,
  route: string,
): BackActions[] | undefined {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;

  const module = Object.values(permissions).find((m) =>
    normalizedRoute.startsWith(m.route),
  );

  if (!module || !module.actions) {
    return undefined;
  }

  if (module.actions[normalizedRoute]) {
    return module.actions[normalizedRoute];
  }

  const matchedRoute = Object.keys(module.actions).find((actionRoute) =>
    normalizedRoute.startsWith(actionRoute),
  );

  if (matchedRoute) {
    return module.actions[matchedRoute];
  }

  return undefined;
}

export function canAccess(
  permissions: NormalizedPermissions,
  route: string,
  action: keyof PermissionActions,
): boolean {
  const perms = getPermissionsByRoute(permissions, route);

  if (!perms) return false;

  return !!perms[action];
}
