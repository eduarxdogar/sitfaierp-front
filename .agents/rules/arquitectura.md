# Reglas de Arquitectura — sitfai-front

## Reglas de dependencias entre capas

- `shared/` NUNCA importa de `features/`
- `features/` SÍ puede importar de `shared/`
- `router/` puede importar de ambas capas
- Toda nueva feature DEBE tener su archivo `routes.ts`

## Gestión de HTTP

- Todas las peticiones HTTP DEBEN pasar por `httpClient` de `shared/services/http/client.ts`
- NO usar fetch/axios directamente en componentes o stores
- Las queries GET usan `useSimpleQueryHook`; las mutaciones usan `useSimpleMutationHook`
- Los endpoints siguen patrón CQRS: `query/<endpoint>` para lectura, `command/<endpoint>` para escritura

## Autenticación

- Keycloak se inicializa UNA SOLA VEZ en `main.ts`, antes de `createApp()`
- El singleton `keycloak.client.ts` es la única fuente del token
- NO guardar el token en localStorage ni en ningún store
- El token lo lee siempre `getAccessToken()` desde la instancia de Keycloak

## Stores (Pinia)

- Un store por dominio (auth.store, permissions.store, etc.)
- Los stores de `features/auth/` son especiales: se usan en `token.service.ts`
- NO crear stores globales en `shared/` (excepción documentada requerida)

## Router

- Cada feature expone sus rutas en `features/<nombre>/routes.ts`
- El router principal las importa y las registra en `protectedRoutes`
- Las rutas protegidas usan `meta.permission` con la ruta del backend
- Las rutas públicas tienen `meta: { requiresAuth: false }` explícito

## Estilos

- Usar Tailwind CSS v4 (directiva `@import "tailwindcss"` en style.css)
- NO usar estilos en línea; usar clases de Tailwind
- Los componentes de UI reutilizables van en `shared/ui/`

## TypeScript

- Strict mode habilitado (tsconfig.app.json)
- Todos los tipos de respuesta del backend deben tener interface en `dto/` o `types/`
- NO usar `any`; usar `unknown` cuando el tipo es indeterminado
