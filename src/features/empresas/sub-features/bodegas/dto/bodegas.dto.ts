export interface BodegaResponse {
  id: string;
  empresaId: string;
  sucursalId: string;
  codigo: string;
  nombre: string;
  activa: boolean;
  creadoEn: string;
}
export interface CrearBodegaRequest {
  sucursalId: string;
  codigo: string;
  nombre: string;
}
