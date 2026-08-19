export const SUCURSALES_KEYS = {
  byEmpresa: (empresaId: string) => ['empresas', empresaId, 'sucursales'] as const,
};
export const SUCURSALES_ENDPOINTS = {
  base: (empresaId: string) => `empresas/${empresaId}/sucursales`,
  estado: (empresaId: string, sucursalId: string) => `empresas/${empresaId}/sucursales/${sucursalId}/estado`,
};
