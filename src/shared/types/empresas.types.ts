export interface EmpresaResponse { 
  id: string; 
  ruc: string; 
  nombre: string; 
  estado: string; 
  sucursales: any[]; 
  creadoEn: string; 
  actualizadoEn: string; 
}

export interface CrearEmpresaRequest { 
  ruc: string; 
  razonSocial: string; 
}