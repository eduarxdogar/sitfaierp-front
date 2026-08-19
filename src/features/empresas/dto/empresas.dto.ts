export interface SucursalResponse {
  id: string;
  codigo: string;
  nombre: string;
  estado: string;
  creadoEn: string;
  actualizadoEn: string;
}
export interface EmpresaResponse {
  id: string;
  ruc: string;
  nombre: string; 
  estado: string;
  sucursales: SucursalResponse[];
  creadoEn: string;
  actualizadoEn: string;
}
export interface CrearEmpresaRequest {
  ruc: string;
  razonSocial: string;
}
