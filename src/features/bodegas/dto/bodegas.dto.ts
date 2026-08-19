export interface BodegaResponse {
  id: string;
  sucursalId: string;
  codigo: string;
  nombre: string;
  tipo: string;
  estado: string;
  creadoEn: string;
}
export interface CrearBodegaRequest {
  codigo: string;
  nombre: string;
  tipo: string;
}
