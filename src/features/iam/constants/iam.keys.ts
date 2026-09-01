// ─────────────────────────────────────────────────────────────────────────────
// IAM Keys — query keys y rutas del API
// NOTA: buildUrl() ya antepone VITE_API_URL (ej: http://localhost:8000/api/v1)
//       → Solo se pasa la parte relativa: "iam/usuarios", NO "/api/v1/iam/..."
// ─────────────────────────────────────────────────────────────────────────────

export const IAM_KEYS = {
  all: ['usuarios'] as const,
  detail: (id: string) => ['usuarios', id] as const,
  roles: ['roles'] as const,
} as const;

export const IAM_ENDPOINTS = {
  /** → http://localhost:8000/api/v1/iam/usuarios  (GET / POST) */
  usuarios: 'iam/usuarios',
  /** → http://localhost:8000/api/v1/iam/roles  (GET / POST) */
  roles: 'iam/roles',
  /** → http://localhost:8000/api/v1/iam/usuarios/{id}/estado  (PATCH) */
  estado: (id: string) => `iam/usuarios/${id}/estado`,
  /** → http://localhost:8000/api/v1/iam/usuarios/{id}/desactivar  (PATCH) */
  desactivar: (id: string) => `iam/usuarios/${id}/desactivar`,
  /** → http://localhost:8000/api/v1/iam/usuarios/{id}/reactivar  (PATCH) */
  reactivar: (id: string) => `iam/usuarios/${id}/reactivar`,
  /** → http://localhost:8000/api/v1/iam/usuarios/{id}  (PUT / DELETE) */
  detalle: (id: string) => `iam/usuarios/${id}`,
} as const;
