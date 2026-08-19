export interface EmpresaResponse {
  id: string;
  ruc: string;
  razonSocial: string;
  estado: boolean;
}
export interface SucursalResponse {
  id: string;
  empresaId: string;
  nombre: string;
  direccion: string;
}
export interface CrearEmpresaRequest {
  ruc: string;
  razonSocial: string;
}
