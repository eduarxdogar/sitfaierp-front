export enum TipoMovimiento {
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO',
  AJUSTE = 'AJUSTE'
}

export enum EstadoStock {
  OPTIMO = 'Óptimo',
  BAJO = 'Bajo Stock',
  CRITICO = 'Crítico',
  SOBRESTOCK = 'Sobrestock'
}

export interface ProductoInventario {
  id: string;
  sku: string;
  codigoBarras: string;
  nombre: string;
  categoria: string;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  stockSeguridad: number;
  costoUnitario: number;
  precioVenta: number;
  valorizado: number;
  estado: EstadoStock;
  ubicacionPasillo: string;
  ultimaActualizacion: string | Date;
}

export interface MovimientoKardex {
  id: string;
  fecha: string | Date;
  tipo: TipoMovimiento;
  motivo: string;
  documentoReferencia: string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  costoUnitario: number;
  responsable: string;
}

export interface CrearMovimientoRequest {
  tipo: TipoMovimiento;
  productoId: string;
  cantidad: number;
  motivo: string;
  documentoReferencia?: string;
  responsable?: string;
}
