export const EMPRESAS_KEYS = {
  all: ['empresas'] as const,
  detail: (id: string) => ['empresas', id] as const,
  sucursales: (id: string) => ['empresas', id, 'sucursales'] as const,
};
export const EMPRESAS_ENDPOINTS = {
  base: 'empresas',
  detail: (id: string) => `empresas/${id}`,
  sucursales: (id: string) => `empresas/${id}/sucursales`,
  estado: (id: string) => `empresas/${id}/estado`,
};
