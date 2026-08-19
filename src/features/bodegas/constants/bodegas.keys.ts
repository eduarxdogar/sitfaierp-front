export const BODEGAS_KEYS = {
  all: ['bodegas'] as const,
  bySucursal: (sucursalId: string) => ['bodegas', 'sucursal', sucursalId] as const,
};
export const BODEGAS_ENDPOINTS = {
  base: 'bodegas',
  bySucursal: (sucursalId: string) => `sucursales/${sucursalId}/bodegas`,
  estado: (id: string) => `bodegas/${id}/estado`,
};
