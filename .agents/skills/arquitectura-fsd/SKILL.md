---
name: arquitectura-fsd
description: >
  Guía completa de la arquitectura Feature-Sliced Design (FSD) simplificada
  usada en el proyecto sitfai-front. Describe convenciones de carpetas,
  patrones de autenticación con Keycloak, gestión de estado con Pinia,
  cliente HTTP y Navigation Guards.
---

# Arquitectura sitfai-front — FSD Simplificado

## Stack

| Tecnología                    | Versión   | Rol                              |
|-------------------------------|-----------|----------------------------------|
| Vue 3                         | ^3.5      | Framework UI                     |
| Vue Router                    | ^5.0      | Enrutamiento SPA                 |
| Pinia + persistedstate        | ^3.0      | Estado global + persistencia     |
| TanStack Vue Query            | ^5.100    | Server state / caché HTTP        |
| keycloak-js                   | ^26.2     | Autenticación OIDC/OAuth2        |
| Vite                          | ^7.3      | Bundler                          |
| TypeScript                    | ~5.9      | Tipado estático                  |
| Zod + Vee-Validate            | ^3/^4     | Validación de formularios        |
| Tailwind CSS v4               | ^4.2      | Estilos utility-first            |

---

## Estructura de Carpetas

```
src/
├── main.ts                          ← Bootstrap: Keycloak antes de createApp()
├── App.vue                          ← Root: RouterView + DevTools
├── env.d.ts                         ← Tipos de variables de entorno
├── style.css                        ← Estilos globales + @import tailwindcss
│
├── features/                        ← CAPA FEATURES (dominios de negocio)
│   ├── auth/                        ← Feature de autenticación
│   │   ├── login-page.vue           ← Callback SSO post-Keycloak
│   │   ├── dto/login.dto.ts         ← Tipos de respuesta del backend
│   │   ├── store/
│   │   │   ├── auth.store.ts        ← Store Pinia de sesión
│   │   │   └── permissions.store.ts ← Store Pinia de permisos CRUD
│   │   ├── services/                ← Servicios específicos de auth
│   │   └── components/              ← Componentes privados de auth
│   │
│   └── dashboard/                   ← Feature de dashboard
│       ├── layouts/dashboard-layout.vue
│       └── pages/dashboard-page.vue
│
├── shared/                          ← CAPA SHARED (infraestructura transversal)
│   ├── services/
│   │   ├── auth/
│   │   │   ├── keycloak.client.ts   ← Singleton de instancia Keycloak
│   │   │   └── session-keys.ts      ← Claves de sessionStorage
│   │   ├── http/
│   │   │   ├── client.ts            ← HTTP client con token injection
│   │   │   ├── build-url.ts         ← Constructor de URLs CQRS
│   │   │   └── types.ts             ← Tipos HttpRequestConfig, ApiResponse, etc.
│   │   └── token.service.ts         ← getAccessToken(), clearAuthSession()
│   │
│   ├── adapter/
│   │   └── permissions.adapter.ts   ← Normaliza BackendModule[] → NormalizedPermissions
│   ├── types/
│   │   └── permissions.types.ts     ← Interfaces de permisos
│   ├── hooks/
│   │   ├── use-permissions.ts       ← Composable usePermissions() para componentes
│   │   └── tanstack/
│   │       ├── use-simple-query.hook.ts    ← Wrapper GET con caché
│   │       └── use-simple-mutation.hook.ts ← Wrapper POST/PUT/DELETE
│   ├── composables/                 ← Composables genéricos (use-toast, etc.)
│   ├── components/pages/            ← Páginas genéricas (unauthorized, not-found)
│   └── utils/ schema/ types/ ui/   ← Utilidades varias
│
└── router/
    └── index.ts                     ← Router + Navigation Guards
```

---

## Reglas de Dependencia (FSD)

```
features/  →  puede importar de shared/
shared/    →  NO puede importar de features/  (regla estricta)
router/    →  puede importar de features/ y shared/
main.ts    →  puede importar de todo
```

> EXCEPCIÓN DOCUMENTADA: `token.service.ts` importa de `features/auth/store/` para
> poder limpiar los stores durante el logout. Esto es una decisión pragmática consciente.

---

## Patrón de nueva Feature

Al crear una nueva feature, seguir esta estructura:

```
features/<nombre>/
├── routes.ts                    ← Exportar routeRecord para el router
├── <nombre>-page.vue            ← Página principal (si es simple)
├── layout/                      ← Layout propio (opcional)
├── components/                  ← Componentes privados de la feature
├── composables/                 ← Composables específicos del dominio
├── constants/                   ← Constantes (route-keys, enums, etc.)
├── dto/                         ← Tipos de respuesta del backend
├── services/                    ← Llamadas HTTP propias
├── store/                       ← Pinia stores del dominio
├── types/                       ← Tipos TypeScript internos
└── sub-features/                ← Sub-dominios complejos (opcional)
    └── index.ts                 ← Re-exports como lazy imports
```

### Registrar la feature en el router

```ts
// features/<nombre>/routes.ts
import type { RouteRecordRaw } from "vue-router";

export const miFeatureRoutes: RouteRecordRaw = {
  path: "/mi-feature",
  component: () => import("./layout/mi-feature-layout.vue"),
  children: [
    {
      path: "",
      name: "mi-feature-page",
      component: () => import("./mi-feature-page.vue"),
      meta: {
        permission: "/mi-feature",    // Permiso requerido para acceder
        key: "mi-feature",
      },
    },
  ],
};

// router/index.ts — agregar en protectedRoutes.children:
import { miFeatureRoutes } from "@features/mi-feature/routes";
// ... children: [ ..., miFeatureRoutes ]
```

---

## Autenticación Keycloak

### Inicialización
Keycloak se inicializa en `main.ts` ANTES de `createApp()`.
La app Vue NUNCA se monta si el usuario no está autenticado.

```ts
// main.ts
const authenticated = await keycloak.init({
  onLoad: shouldForceLogin ? "check-sso" : "login-required",
  pkceMethod: "S256",        // PKCE con SHA-256
  checkLoginIframe: false,
  redirectUri: currentRedirectUri,
});

if (!authenticated) {
  await keycloak.login({ redirectUri: currentRedirectUri });
  return;
}

const app = createApp(App); // Solo se ejecuta si autenticado
```

### Renovación del token
El token se renueva **on-demand** en dos puntos:

1. **HTTP Client**: `getAccessToken()` llama `keycloak.updateToken(30)` antes de cada fetch
2. **Navigation Guard**: `keycloak.updateToken(30)` en `router.beforeEach`

No hay timer periódico; el umbral de 30 segundos significa "refrescar si expira en menos de 30 seg".

### Logout
```ts
// En auth.store.ts
async logout() {
  await notifyBackendLogout();       // Notifica al backend
  this.clearAuth();                   // Limpia el store
  sessionStorage.setItem("force_login", "true"); // Evita SSO silencioso
  await keycloak.logout({ redirectUri: window.location.origin });
}
```

---

## HTTP Client

```ts
// Petición GET con caché (TanStack Query)
const { data, isLoading } = useSimpleQueryHook<User[]>(
  "users/list",                       // → query/users/list
  ["users", filters],                 // queryKey
  computed(() => ({ page: 1 })),      // params (reactivos)
);

// Petición POST/mutation
const { mutate, isPending } = useSimpleMutationHook<Response, Body>("users/create");
mutate(body, { onSuccess: (data) => { ... } });
```

El `httpClient` interno:
- Llama `getAccessToken()` → `keycloak.updateToken(30)` → inyecta `Authorization: token`
- En error 401: marca sesión expirada, espera 2s y llama `clearAuthSession()`
- Extrae `json.data` del envelope `ApiResponse<T>` automáticamente

---

## Navigation Guards

```ts
// Proteger una ruta con permiso del backend:
meta: { permission: "/modulo/sub-ruta" }

// Permiso dinámico por parámetro de ruta:
meta: {
  permissionByParam: {
    param: "tipo",            // nombre del :param
    values: {
      "reporte": "/modulo/reportes",
      "agenda": "/modulo/agenda",
    }
  }
}

// Ruta que no requiere verificación de permisos:
meta: { skipPermission: true }

// Ruta pública (sin auth):
meta: { requiresAuth: false }
```

---

## Variables de Entorno

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=sitfai
VITE_KEYCLOAK_CLIENT_ID=sitfai-front
VITE_API_URL=http://localhost:3000
VITE_WORL_WITH_LOCAL_SERVER=true
VITE_ENABLE_DEVTOOLS=true
```
