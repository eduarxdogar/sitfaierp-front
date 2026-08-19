// ─── TYPES ──────────────────────────────────────────────────────────────
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
  sector: string; 
  estado: EmpresaEstado;
  direccionFiscal?: string;
  telefono?: string;
  email?: string;
  sucursales: Sucursal[];
  fechaRegistro: string;
}

export interface AuditoriaTomaFisica {
  id: string;
  codigo: string; 
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
  exactitud: number; 
  discrepanciasMonto: number;
}

// ─── MOCK DATA ──────────────────────────────────────────────────────────
export const INITIAL_EMPRESAS: Empresa[] = [
  {
    id: 'emp-001',
    codigo: 'EMP-001',
    nombre: 'Logística Andina S.A.',
    rif: 'J-30125489-0',
    sector: 'Transporte',
    estado: 'ACTIVO',
    fechaRegistro: '2025-01-15',
    sucursales: [
      { id: 'suc-001a', codigo: 'SUC-001A', nombre: 'Sede Central (Caracas)', ubicacion: 'Caracas, DC', encargado: 'Roberto Sánchez', activo: true },
      { id: 'suc-001b', codigo: 'SUC-001B', nombre: 'Centro Distribución Valencia', ubicacion: 'Valencia, CB', encargado: 'Luis Méndez', activo: true }
    ]
  },
  {
    id: 'emp-002',
    codigo: 'EMP-002',
    nombre: 'Inversiones Gamma 21',
    rif: 'J-40556677-1',
    sector: 'Retail',
    estado: 'ACTIVO',
    fechaRegistro: '2025-03-22',
    sucursales: [
      { id: 'suc-002a', codigo: 'SUC-002A', nombre: 'Tienda Flagship Sambil Chacao', ubicacion: 'Chacao, MI', encargado: 'Ana Rivas', activo: true }
    ]
  },
  {
    id: 'emp-003',
    codigo: 'EMP-003',
    nombre: 'Grupo Ferretero Continental C.A.',
    rif: 'J-29884433-2',
    sector: 'Comercio',
    estado: 'SUSPENDIDO',
    fechaRegistro: '2024-11-05',
    sucursales: []
  }
];

export const INITIAL_TOMAS_FISICAS: AuditoriaTomaFisica[] = [
  {
    id: 'tf-101',
    codigo: 'TF-2026-089',
    empresaId: 'emp-001',
    empresaNombre: 'Logística Andina S.A.',
    sucursalId: 'suc-001b',
    sucursalNombre: 'Centro Distribución Valencia',
    tipo: 'General',
    fechaProgramada: '2026-08-18',
    estado: 'En Progreso',
    auditorLider: 'Ing. Carlos Mendoza',
    totalItems: 840,
    itemsContados: 692,
    exactitud: 99.4,
    discrepanciasMonto: 142.50
  },
  {
    id: 'tf-102',
    codigo: 'TF-2026-088',
    empresaId: 'emp-004',
    empresaNombre: 'Distribuidora Farmacéutica del Centro',
    sucursalId: 'suc-004a',
    sucursalNombre: 'Droguería Central Valencia',
    tipo: 'Cíclico',
    fechaProgramada: '2026-08-17',
    estado: 'Conciliando',
    auditorLider: 'Dra. Elena Ramos',
    totalItems: 350,
    itemsContados: 350,
    exactitud: 99.8,
    discrepanciasMonto: 24.10
  }
];