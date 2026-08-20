import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from "vue-router";
import { useAuthStore } from "@features/auth/store/auth.store.ts";
import keycloak from "@shared/services/auth/keycloak.client.ts";
import { markSessionExpired } from "@shared/services/token.service.ts";

const publicRoutes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@features/auth/login-page.vue"),
  },
];

const protectedRoutes = [
  {
    path: "/dashboard",
    component: () => import("@features/dashboard/layout/DashboardLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@features/dashboard/dashboard-page.vue"),
        meta: { key: "dashboard" },
      },
      {
        path: "/empresas",
        name: "empresas",
        component: () => import("@features/empresas/empresas-page.vue"),
        meta: { key: "empresas" },
      },
      {
        path: "/bodegas",
        name: "bodegas",
        component: () => import("@features/bodegas/bodegas-page.vue"),
        meta: { key: "bodegas" },
      },
      {
        path: "/unauthorized",
        name: "unauthorized",
        component: () =>
          import("@shared/components/pages/unauthorized-page.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () =>
          import("@shared/components/pages/not-found-page.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...protectedRoutes],
});

const CHUNK_RELOAD_STORAGE_KEY = "chunk-load-reload-attempted";
const CHUNK_LOAD_ERROR_PATTERNS = [
  "Failed to fetch dynamically imported module",
  "Importing a module script failed",
  "error loading dynamically imported module",
];

const isChunkLoadError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return CHUNK_LOAD_ERROR_PATTERNS.some((pattern) =>
    message.includes(pattern),
  );
};

router.onError((error, to) => {
  if (!isChunkLoadError(error)) return;

  const reloadKey = `${CHUNK_RELOAD_STORAGE_KEY}:${to.fullPath}`;
  if (sessionStorage.getItem(reloadKey)) return;

  sessionStorage.setItem(reloadKey, "true");
  window.location.assign(to.fullPath);
});

interface RoutePermissionByParam {
  param: string;
  values: Record<string, string>;
}

interface PermissionRouteMeta {
  permission?: string;
  permissionByParam?: RoutePermissionByParam;
}

const getRouteParamValue = (
  to: RouteLocationNormalized,
  paramName: string,
) => {
  const value = to.params[paramName];
  return Array.isArray(value) ? value[0] : value;
};

const getRoutePermission = (to: RouteLocationNormalized) => {
  const meta = to.meta as PermissionRouteMeta;

  if (meta.permissionByParam) {
    const paramValue = getRouteParamValue(to, meta.permissionByParam.param);
    const permission = paramValue
      ? meta.permissionByParam.values[paramValue]
      : undefined;

    if (permission) return permission;
  }

  return meta.permission;
};

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const routePermission = getRoutePermission(to);
  const requiresAuth =
    to.matched.some((record) => record.meta?.requiresAuth) ||
    Boolean(routePermission);

  // 1. Sincronizar auth desde Keycloak
  authStore.initFromKeycloak();

  if (!requiresAuth) {
    return true;
  }

  if (!keycloak.authenticated) {
    await keycloak.login({
      redirectUri: window.location.origin + to.fullPath,
    });
    return false;
  }

  try {
    await keycloak.updateToken(30);
  } catch {
    markSessionExpired();
    await keycloak.login({
      redirectUri: window.location.origin + to.fullPath,
    });
    return false;
  }

  if (to.path.startsWith('/dashboard')) {
    return true;
  }

  return true;
});

router.afterEach((to, from) => {
  sessionStorage.removeItem(`${CHUNK_RELOAD_STORAGE_KEY}:${to.fullPath}`);
  console.log(` Navigation: ${from.path || "initial"}  ${to.path}`);
});

export default router;
