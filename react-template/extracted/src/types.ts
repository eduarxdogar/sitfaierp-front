export type AppTab = 
  | 'tenant-branches'
  | 'dashboard'
  | 'iam'
  | 'sales'
  | 'inventory'
  | 'billing'
  | 'pos'
  | 'settings';

export type EmpresaEstado = 'ACTIVO' | 'SUSPENDIDO' | 'BAJA';

export interface Sucursal {
  id: string;
  codigo: string;
  nombre: string;
  ubicacion: string;
  encargado: string;
  telefono?: string;
  activo: boolean;
  direccion?: string;
}

export interface Empresa {
  id: string;
  codigo: string; // EMP-001
  nombre: string;
  rif: string; // J-40123456-8
  sector: string; // Transporte, Retail, Manufactura, Tecnología, Farmacéutico, Alimentos
  estado: EmpresaEstado;
  direccionFiscal?: string;
  telefono?: string;
  email?: string;
  sucursales: Sucursal[];
  fechaRegistro: string;
}

export interface AuditoriaTomaFisica {
  id: string;
  codigo: string; // TF-2026-089
  empresaId: string;
  empresaNombre: string;
  sucursalId: string;
  sucursalNombre: string;
  tipo: 'General' | 'Cíclico' | 'Por Muestreo' | 'Auditoría Sorpresa';
  fechaProgramada: string;
  estado: 'En Progreso' | 'Planificado' | 'Conciliando' | 'Completado' | 'Con Discrepancia';
  auditorLider: string;
  totalItems: number;
  itemsContados: number;
  exactitud: number; // e.g. 99.4%
  discrepanciasMonto: number;
}

export interface ItemConteo {
  id: string;
  sku: string;
  codigoBarra: string;
  descripcion: string;
  categoria: string;
  ubicacionPasillo: string;
  stockTeorico: number;
  conteo1: number | null;
  conteo2: number | null;
  conteoFinal: number | null;
  diferencia: number;
  costoUnitario: number;
  estado: 'Pendiente' | 'Verificado' | 'Discrepancia' | 'Ajustado';
}

export interface UsuarioIAM {
  id: string;
  nombre: string;
  email: string;
  rol: 'SUPER_ADMIN' | 'AUDITOR_SENIOR' | 'JEFE_ALMACEN' | 'OPERADOR_CONTEO' | 'GERENTE_OPERACIONES';
  empresaAsignada: string;
  sucursalesAcceso: string[];
  estado: 'ACTIVO' | 'INACTIVO';
  ultimoAcceso: string;
}

export interface OrdenVenta {
  id: string;
  numero: string;
  empresaNombre: string;
  sucursalNombre: string;
  cliente: string;
  rifCliente: string;
  fecha: string;
  total: number;
  moneda: 'USD' | 'VES';
  estado: 'Completada' | 'Pendiente' | 'Facturada' | 'Anulada';
}

export interface Factura {
  id: string;
  numeroControl: string;
  numeroFactura: string;
  empresaNombre: string;
  sucursalNombre: string;
  cliente: string;
  rifCliente: string;
  baseImponible: number;
  iva: number;
  total: number;
  fechaEmision: string;
  estado: 'Emitida' | 'Pagada' | 'Anulada';
}

export interface TerminalPOS {
  id: string;
  codigoCaja: string;
  empresaNombre: string;
  sucursalNombre: string;
  cajeroActual: string;
  estadoCaja: 'Abierta' | 'Cerrada' | 'En Arqueo';
  totalVentasDia: number;
  ultimaTransaccion: string;
}
