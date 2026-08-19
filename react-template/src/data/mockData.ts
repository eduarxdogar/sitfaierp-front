import { Empresa, AuditoriaTomaFisica, ItemConteo, UsuarioIAM, OrdenVenta, Factura, TerminalPOS } from '../types';

export const INITIAL_EMPRESAS: Empresa[] = [
  {
    id: 'emp-001',
    codigo: 'EMP-001',
    nombre: 'Logística Andina S.A.',
    rif: 'J-40123456-8',
    sector: 'Transporte',
    estado: 'ACTIVO',
    direccionFiscal: 'Av. Francisco de Miranda, Torre Cavendes, Piso 8, Ofic. 804, Los Palos Grandes, Caracas',
    telefono: '+58 212 2854922',
    email: 'contacto@logisticaandina.com',
    fechaRegistro: '2024-01-15',
    sucursales: [
      {
        id: 'suc-001a',
        codigo: 'SUC-001A',
        nombre: 'Sede Central (Caracas)',
        ubicacion: 'Distrito Capital, VE',
        encargado: 'Carlos Mendoza',
        telefono: '+58 212 2854923',
        activo: true,
        direccion: 'Av. Francisco de Miranda, Edif. Andina, Chacao'
      },
      {
        id: 'suc-001b',
        codigo: 'SUC-001B',
        nombre: 'Centro Distribución Valencia',
        ubicacion: 'Carabobo, VE',
        encargado: 'Maria Fernanda Ruiz',
        telefono: '+58 241 8329001',
        activo: true,
        direccion: 'Zona Industrial El Recreo, Galpón 14, Valencia'
      },
      {
        id: 'suc-001c',
        codigo: 'SUC-001C',
        nombre: 'Hub Logístico Maracaibo',
        ubicacion: 'Zulia, VE',
        encargado: 'Roberto Dávila',
        telefono: '+58 261 7445588',
        activo: true,
        direccion: 'Av. La Limpia, C.C. Galerías, Local 22'
      },
      {
        id: 'suc-001d',
        codigo: 'SUC-001D',
        nombre: 'Almacén Portuario Puerto Cabello',
        ubicacion: 'Carabobo, VE',
        encargado: 'Yelitza Barrientos',
        telefono: '+58 242 3612200',
        activo: true,
        direccion: 'Muelle 12, Zona Franca Aduanera'
      }
    ]
  },
  {
    id: 'emp-002',
    codigo: 'EMP-002',
    nombre: 'Inversiones Gamma 21',
    rif: 'J-31415926-5',
    sector: 'Retail',
    estado: 'SUSPENDIDO',
    direccionFiscal: 'Calle Paris con Mucuchies, Edif. Gamma, Las Mercedes, Caracas',
    telefono: '+58 212 9918234',
    email: 'administracion@gamma21.com',
    fechaRegistro: '2024-03-22',
    sucursales: [
      {
        id: 'suc-002a',
        codigo: 'SUC-002A',
        nombre: 'Tienda Flagship Sambil Chacao',
        ubicacion: 'Distrito Capital, VE',
        encargado: 'Alejandro Morales',
        telefono: '+58 212 2634455',
        activo: true,
        direccion: 'Nivel Autopista, Local AP-45'
      },
      {
        id: 'suc-002b',
        codigo: 'SUC-002B',
        nombre: 'Sucursal CCCT Nivel C2',
        ubicacion: 'Distrito Capital, VE',
        encargado: 'Valeria Gómez',
        telefono: '+58 212 9592233',
        activo: false,
        direccion: 'CCCT, Nivel C-2, Pasillo Central'
      },
      {
        id: 'suc-002c',
        codigo: 'SUC-002C',
        nombre: 'Tienda Barquisimeto Sambil',
        ubicacion: 'Lara, VE',
        encargado: 'Jorge Luis Peña',
        telefono: '+58 251 2541122',
        activo: false,
        direccion: 'Av. Venezuela con Av. Argimiro Bracamonte'
      }
    ]
  },
  {
    id: 'emp-003',
    codigo: 'EMP-003',
    nombre: 'Tech Solutions Corp',
    rif: 'J-27182818-2',
    sector: 'Tecnología',
    estado: 'BAJA',
    direccionFiscal: 'Av. Principal de Bello Monte, Torre Financiera, Piso 12',
    telefono: '+58 212 7531100',
    email: 'contacto@techsolutions.com.ve',
    fechaRegistro: '2023-11-10',
    sucursales: []
  },
  {
    id: 'emp-004',
    codigo: 'EMP-004',
    nombre: 'Distribuidora Farmacéutica del Centro',
    rif: 'J-50293841-0',
    sector: 'Farmacéutico',
    estado: 'ACTIVO',
    direccionFiscal: 'Av. Bolívar Norte, Sector San José, Valencia',
    telefono: '+58 241 8219900',
    email: 'ventas@farmacentro.com.ve',
    fechaRegistro: '2024-05-18',
    sucursales: [
      {
        id: 'suc-004a',
        codigo: 'SUC-004A',
        nombre: 'Droguería Central Valencia',
        ubicacion: 'Carabobo, VE',
        encargado: 'Dr. Fernando Páez',
        telefono: '+58 241 8219901',
        activo: true,
        direccion: 'Parque Industrial Castillito, Galpón 8'
      },
      {
        id: 'suc-004b',
        codigo: 'SUC-004B',
        nombre: 'Depósito Maracay La Encrucijada',
        ubicacion: 'Aragua, VE',
        encargado: 'Lic. Elena Ramos',
        telefono: '+58 243 5518833',
        activo: true,
        direccion: 'Autopista Regional del Centro, Km 72'
      }
    ]
  },
  {
    id: 'emp-005',
    codigo: 'EMP-005',
    nombre: 'Alimentos y Bebidas del Caribe C.A.',
    rif: 'J-18293041-3',
    sector: 'Alimentos',
    estado: 'ACTIVO',
    direccionFiscal: 'Zona Industrial Guatire, Av. Intercomunal, Parcela 44',
    telefono: '+58 212 3448899',
    email: 'info@alimentoscaribe.com',
    fechaRegistro: '2024-02-10',
    sucursales: [
      {
        id: 'suc-005a',
        codigo: 'SUC-005A',
        nombre: 'Planta Procesadora Guatire',
        ubicacion: 'Miranda, VE',
        encargado: 'Ing. Gustavo Albornoz',
        telefono: '+58 212 3448891',
        activo: true,
        direccion: 'Zona Industrial El Marqués, Guatire'
      },
      {
        id: 'suc-005b',
        codigo: 'SUC-005B',
        nombre: 'Silo Granelero Puerto Cabello',
        ubicacion: 'Carabobo, VE',
        encargado: 'Manuel Tovar',
        telefono: '+58 242 3624411',
        activo: true,
        direccion: 'Zona Portuaria Sector 3'
      },
      {
        id: 'suc-005c',
        codigo: 'SUC-005C',
        nombre: 'Centro Logístico Oriente Barcelona',
        ubicacion: 'Anzoátegui, VE',
        encargado: 'Daniela Salazar',
        telefono: '+58 281 2779900',
        activo: true,
        direccion: 'Av. Jorge Rodríguez, Barcelona'
      }
    ]
  },
  {
    id: 'emp-006',
    codigo: 'EMP-006',
    nombre: 'Grupo Ferretero Continental C.A.',
    rif: 'J-39821034-7',
    sector: 'Manufactura',
    estado: 'ACTIVO',
    direccionFiscal: 'Carretera Nacional Los Guayos, Km 5, Valencia',
    telefono: '+58 241 8387000',
    email: 'contacto@continentalferretero.com',
    fechaRegistro: '2024-06-01',
    sucursales: [
      {
        id: 'suc-006a',
        codigo: 'SUC-006A',
        nombre: 'Mega Tienda Los Guayos',
        ubicacion: 'Carabobo, VE',
        encargado: 'Héctor Quintero',
        telefono: '+58 241 8387010',
        activo: true,
        direccion: 'Carretera Nacional, Sector Paraparal'
      },
      {
        id: 'suc-006b',
        codigo: 'SUC-006B',
        nombre: 'Almacén de Distribución San Diego',
        ubicacion: 'Carabobo, VE',
        encargado: 'Beatriz Colmenares',
        telefono: '+58 241 8387020',
        activo: true,
        direccion: 'Av. Don Julio Centeno, C.C. Fin de Siglo'
      }
    ]
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
    auditorLider: 'Ing. Carlos Mendoza (Auditor Senior)',
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
  },
  {
    id: 'tf-103',
    codigo: 'TF-2026-087',
    empresaId: 'emp-005',
    empresaNombre: 'Alimentos y Bebidas del Caribe C.A.',
    sucursalId: 'suc-005a',
    sucursalNombre: 'Planta Procesadora Guatire',
    tipo: 'Auditoría Sorpresa',
    fechaProgramada: '2026-08-16',
    estado: 'Completado',
    auditorLider: 'Gustavo Albornoz',
    totalItems: 1200,
    itemsContados: 1200,
    exactitud: 98.9,
    discrepanciasMonto: 480.00
  },
  {
    id: 'tf-104',
    codigo: 'TF-2026-086',
    empresaId: 'emp-002',
    empresaNombre: 'Inversiones Gamma 21',
    sucursalId: 'suc-002a',
    sucursalNombre: 'Tienda Flagship Sambil Chacao',
    tipo: 'Por Muestreo',
    fechaProgramada: '2026-08-15',
    estado: 'Con Discrepancia',
    auditorLider: 'Valeria Gómez',
    totalItems: 420,
    itemsContados: 420,
    exactitud: 94.2,
    discrepanciasMonto: 1280.00
  }
];

export const INITIAL_ITEMS_CONTEO: ItemConteo[] = [
  {
    id: 'item-01',
    sku: 'LOG-PAL-4410',
    codigoBarra: '7591002341901',
    descripcion: 'Paleta Industrial de Carga Pesada 1.20x1.00m',
    categoria: 'Embalaje & Estiba',
    ubicacionPasillo: 'Pasillo A-04 / Rack 2',
    stockTeorico: 120,
    conteo1: 120,
    conteo2: 120,
    conteoFinal: 120,
    diferencia: 0,
    costoUnitario: 35.00,
    estado: 'Verificado'
  },
  {
    id: 'item-02',
    sku: 'LOG-STR-9920',
    codigoBarra: '7591002341925',
    descripcion: 'Rollo Film Stretch Transparente Calibre 80 (500m)',
    categoria: 'Insumos de Almacén',
    ubicacionPasillo: 'Pasillo B-01 / Rack 1',
    stockTeorico: 85,
    conteo1: 83,
    conteo2: 83,
    conteoFinal: 83,
    diferencia: -2,
    costoUnitario: 14.50,
    estado: 'Discrepancia'
  },
  {
    id: 'item-03',
    sku: 'LOG-FLK-0031',
    codigoBarra: '7591002341932',
    descripcion: 'Transpaleta Hidráulica Manual 2.5 Toneladas',
    categoria: 'Maquinaria & Equipos',
    ubicacionPasillo: 'Bahía Carga / Zona 3',
    stockTeorico: 6,
    conteo1: 6,
    conteo2: 6,
    conteoFinal: 6,
    diferencia: 0,
    costoUnitario: 420.00,
    estado: 'Verificado'
  },
  {
    id: 'item-04',
    sku: 'FAR-AMO-5001',
    codigoBarra: '7592003891012',
    descripcion: 'Amoxicilina 500mg Caja x 24 Cápsulas',
    categoria: 'Fármacos',
    ubicacionPasillo: 'Zona Climatizada / Anaquel 3',
    stockTeorico: 340,
    conteo1: 345,
    conteo2: 345,
    conteoFinal: 345,
    diferencia: 5,
    costoUnitario: 4.80,
    estado: 'Ajustado'
  },
  {
    id: 'item-05',
    sku: 'FAR-PAR-6502',
    codigoBarra: '7592003891029',
    descripcion: 'Paracetamol 650mg Blister x 10 Comprimidos',
    categoria: 'Fármacos',
    ubicacionPasillo: 'Zona Climatizada / Anaquel 1',
    stockTeorico: 510,
    conteo1: 510,
    conteo2: 510,
    conteoFinal: 510,
    diferencia: 0,
    costoUnitario: 1.20,
    estado: 'Verificado'
  },
  {
    id: 'item-06',
    sku: 'ALI-ARR-1001',
    codigoBarra: '7593004781005',
    descripcion: 'Arroz Blanco Tradicional Grano Entero 1Kg (Bulto x 24)',
    categoria: 'Alimentos No Perecederos',
    ubicacionPasillo: 'Nave Central / Fila 12',
    stockTeorico: 600,
    conteo1: 598,
    conteo2: 600,
    conteoFinal: 600,
    diferencia: 0,
    costoUnitario: 22.00,
    estado: 'Verificado'
  }
];

export const INITIAL_USUARIOS: UsuarioIAM[] = [
  {
    id: 'usr-001',
    nombre: 'Super Administrador SITFAI',
    email: 'sitfaierp@gmail.com',
    rol: 'SUPER_ADMIN',
    empresaAsignada: 'Global (Todas las empresas)',
    sucursalesAcceso: ['Todas'],
    estado: 'ACTIVO',
    ultimoAcceso: 'Hoy, hace 5 minutos'
  },
  {
    id: 'usr-002',
    nombre: 'Carlos Mendoza',
    email: 'carlos.mendoza@logisticaandina.com',
    rol: 'AUDITOR_SENIOR',
    empresaAsignada: 'Logística Andina S.A.',
    sucursalesAcceso: ['SUC-001A', 'SUC-001B'],
    estado: 'ACTIVO',
    ultimoAcceso: 'Hoy, 09:30 AM'
  },
  {
    id: 'usr-003',
    nombre: 'Maria Fernanda Ruiz',
    email: 'm.ruiz@logisticaandina.com',
    rol: 'JEFE_ALMACEN',
    empresaAsignada: 'Logística Andina S.A.',
    sucursalesAcceso: ['SUC-001B'],
    estado: 'ACTIVO',
    ultimoAcceso: 'Ayer, 04:15 PM'
  },
  {
    id: 'usr-004',
    nombre: 'Valeria Gómez',
    email: 'valeria.gomez@gamma21.com',
    rol: 'OPERADOR_CONTEO',
    empresaAsignada: 'Inversiones Gamma 21',
    sucursalesAcceso: ['SUC-002A'],
    estado: 'ACTIVO',
    ultimoAcceso: '2026-08-16'
  }
];

export const INITIAL_VENTAS: OrdenVenta[] = [
  {
    id: 'ov-901',
    numero: 'ORD-2026-00412',
    empresaNombre: 'Logística Andina S.A.',
    sucursalNombre: 'Sede Central (Caracas)',
    cliente: 'Cervecería Polar C.A.',
    rifCliente: 'J-00006372-9',
    fecha: '2026-08-18 11:20',
    total: 3450.00,
    moneda: 'USD',
    estado: 'Completada'
  },
  {
    id: 'ov-902',
    numero: 'ORD-2026-00411',
    empresaNombre: 'Distribuidora Farmacéutica del Centro',
    sucursalNombre: 'Droguería Central Valencia',
    cliente: 'Farmatodo C.A.',
    rifCliente: 'J-00020200-1',
    fecha: '2026-08-18 10:05',
    total: 8920.50,
    moneda: 'USD',
    estado: 'Facturada'
  },
  {
    id: 'ov-903',
    numero: 'ORD-2026-00410',
    empresaNombre: 'Alimentos y Bebidas del Caribe C.A.',
    sucursalNombre: 'Planta Procesadora Guatire',
    cliente: 'Automercados Plaza S.A.',
    rifCliente: 'J-00259834-0',
    fecha: '2026-08-17 16:40',
    total: 14200.00,
    moneda: 'USD',
    estado: 'Pendiente'
  }
];

export const INITIAL_FACTURAS: Factura[] = [
  {
    id: 'fac-301',
    numeroControl: '00-0098124',
    numeroFactura: 'FAC-001-000849',
    empresaNombre: 'Logística Andina S.A.',
    sucursalNombre: 'Sede Central (Caracas)',
    cliente: 'Cervecería Polar C.A.',
    rifCliente: 'J-00006372-9',
    baseImponible: 3450.00,
    iva: 552.00,
    total: 4002.00,
    fechaEmision: '2026-08-18',
    estado: 'Emitida'
  },
  {
    id: 'fac-302',
    numeroControl: '00-0098123',
    numeroFactura: 'FAC-004-001290',
    empresaNombre: 'Distribuidora Farmacéutica del Centro',
    sucursalNombre: 'Droguería Central Valencia',
    cliente: 'Farmatodo C.A.',
    rifCliente: 'J-00020200-1',
    baseImponible: 8920.50,
    iva: 1427.28,
    total: 10347.78,
    fechaEmision: '2026-08-18',
    estado: 'Pagada'
  }
];

export const INITIAL_POS: TerminalPOS[] = [
  {
    id: 'pos-01',
    codigoCaja: 'CAJA-01-CHACAO',
    empresaNombre: 'Inversiones Gamma 21',
    sucursalNombre: 'Tienda Flagship Sambil Chacao',
    cajeroActual: 'Alejandro Morales',
    estadoCaja: 'Abierta',
    totalVentasDia: 1420.80,
    ultimaTransaccion: '13:54 PM'
  },
  {
    id: 'pos-02',
    codigoCaja: 'CAJA-02-VALENCIA',
    empresaNombre: 'Grupo Ferretero Continental C.A.',
    sucursalNombre: 'Mega Tienda Los Guayos',
    cajeroActual: 'Héctor Quintero',
    estadoCaja: 'Abierta',
    totalVentasDia: 3890.00,
    ultimaTransaccion: '13:48 PM'
  },
  {
    id: 'pos-03',
    codigoCaja: 'CAJA-01-GUATIRE',
    empresaNombre: 'Alimentos y Bebidas del Caribe C.A.',
    sucursalNombre: 'Planta Procesadora Guatire',
    cajeroActual: 'Caja Despacho Directo',
    estadoCaja: 'Cerrada',
    totalVentasDia: 890.00,
    ultimaTransaccion: '11:15 AM'
  }
];
