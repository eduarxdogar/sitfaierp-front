import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Usuario,
  Rol,
  EstadoUsuario,
  ModuloSistema,
  PermisoAccion,
  CreateUsuarioDto,
  CreateRolDto
} from '../models/iam.interface';

@Injectable({
  providedIn: 'root'
})
export class IamService {
  private initialRoles: Rol[] = [
    {
      id: 'rol-1',
      codigo: 'SUPER_ADMIN',
      nombre: 'Super Administrador',
      descripcion: 'Acceso irrestricto y control total de la infraestructura multi-empresa y seguridad.',
      usuariosCount: 1,
      esSistema: true,
      fechaActualizacion: new Date('2026-08-01'),
      permisos: [
        { modulo: ModuloSistema.DASHBOARD, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.ELIMINAR, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.EMPRESAS, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.ELIMINAR, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.IAM, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.ELIMINAR, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.VENTAS_PEDIDOS, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.ELIMINAR, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.INVENTARIO, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.ELIMINAR, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.FACTURACION, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.ELIMINAR, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.POS, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.ELIMINAR, PermisoAccion.EXPORTAR] }
      ]
    },
    {
      id: 'rol-2',
      codigo: 'GERENTE_OPERACIONES',
      nombre: 'Gerente de Operaciones',
      descripcion: 'Gestión integral de pedidos, inventarios, compras y reportes financieros.',
      usuariosCount: 3,
      esSistema: false,
      fechaActualizacion: new Date('2026-08-10'),
      permisos: [
        { modulo: ModuloSistema.DASHBOARD, acciones: [PermisoAccion.LEER, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.VENTAS_PEDIDOS, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.INVENTARIO, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.EXPORTAR] },
        { modulo: ModuloSistema.FACTURACION, acciones: [PermisoAccion.LEER, PermisoAccion.EXPORTAR] }
      ]
    },
    {
      id: 'rol-3',
      codigo: 'ANALISTA_FACTURACION',
      nombre: 'Analista de Facturación',
      descripcion: 'Emisión, anulación, conciliación y exportación de comprobantes de pago.',
      usuariosCount: 2,
      esSistema: false,
      fechaActualizacion: new Date('2026-08-14'),
      permisos: [
        { modulo: ModuloSistema.DASHBOARD, acciones: [PermisoAccion.LEER] },
        { modulo: ModuloSistema.VENTAS_PEDIDOS, acciones: [PermisoAccion.LEER] },
        { modulo: ModuloSistema.FACTURACION, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR, PermisoAccion.EXPORTAR] }
      ]
    },
    {
      id: 'rol-4',
      codigo: 'OPERADOR_POS',
      nombre: 'Cajero / Operador POS',
      descripcion: 'Atención en terminales de punto de venta, emisión de tickets y arqueo de caja.',
      usuariosCount: 5,
      esSistema: false,
      fechaActualizacion: new Date('2026-08-20'),
      permisos: [
        { modulo: ModuloSistema.POS, acciones: [PermisoAccion.LEER, PermisoAccion.CREAR, PermisoAccion.EDITAR] },
        { modulo: ModuloSistema.INVENTARIO, acciones: [PermisoAccion.LEER] }
      ]
    }
  ];

  private initialUsers: Usuario[] = [
    {
      id: 'usr-1',
      nombreCompleto: 'Carlos Mendoza Ramos',
      email: 'carlos.mendoza@sitfai.com',
      telefono: '+51 987 654 321',
      rolId: 'rol-1',
      rolNombre: 'Super Administrador',
      empresa: 'SITFAI Headquarters',
      sucursal: 'Sede Principal',
      estado: EstadoUsuario.ACTIVO,
      avatarInitials: 'CM',
      ultimoAcceso: new Date('2026-08-29T14:32:00'),
      fechaCreacion: new Date('2026-01-15')
    },
    {
      id: 'usr-2',
      nombreCompleto: 'Valeria Quispe Torres',
      email: 'valeria.quispe@sitfai.com',
      telefono: '+51 976 123 456',
      rolId: 'rol-2',
      rolNombre: 'Gerente de Operaciones',
      empresa: 'Acme Corporation S.A.',
      sucursal: 'Almacén Central',
      estado: EstadoUsuario.ACTIVO,
      avatarInitials: 'VQ',
      ultimoAcceso: new Date('2026-08-29T11:15:00'),
      fechaCreacion: new Date('2026-03-20')
    },
    {
      id: 'usr-3',
      nombreCompleto: 'Roberto Silva Morales',
      email: 'roberto.silva@globex.pe',
      telefono: '+51 945 889 112',
      rolId: 'rol-3',
      rolNombre: 'Analista de Facturación',
      empresa: 'Globex Inc.',
      sucursal: 'Oficina Financiera',
      estado: EstadoUsuario.ACTIVO,
      avatarInitials: 'RS',
      ultimoAcceso: new Date('2026-08-28T18:40:00'),
      fechaCreacion: new Date('2026-04-10')
    },
    {
      id: 'usr-4',
      nombreCompleto: 'Elena Castro Del Valle',
      email: 'elena.castro@soylent.com',
      telefono: '+51 912 334 556',
      rolId: 'rol-4',
      rolNombre: 'Cajero / Operador POS',
      empresa: 'Soylent Corp',
      sucursal: 'Tienda Retail #04',
      estado: EstadoUsuario.INACTIVO,
      avatarInitials: 'EC',
      ultimoAcceso: new Date('2026-08-15T09:00:00'),
      fechaCreacion: new Date('2026-05-02')
    },
    {
      id: 'usr-5',
      nombreCompleto: 'Guillermo Paz Soldán',
      email: 'guillermo.paz@initech.com',
      telefono: '+51 998 776 223',
      rolId: 'rol-2',
      rolNombre: 'Gerente de Operaciones',
      empresa: 'Initech LLC',
      sucursal: 'Planta Industrial',
      estado: EstadoUsuario.BLOQUEADO,
      avatarInitials: 'GP',
      ultimoAcceso: new Date('2026-08-01T16:22:00'),
      fechaCreacion: new Date('2026-06-18')
    }
  ];

  getRoles(): Observable<Rol[]> {
    return of([...this.initialRoles]).pipe(delay(200));
  }

  getUsuarios(): Observable<Usuario[]> {
    return of([...this.initialUsers]).pipe(delay(200));
  }

  createUsuario(dto: CreateUsuarioDto, roles: Rol[]): Observable<Usuario> {
    const rol = roles.find(r => r.id === dto.rolId);
    const names = dto.nombreCompleto.trim().split(' ');
    const initials = names.length >= 2 
      ? (names[0][0] + names[1][0]).toUpperCase()
      : dto.nombreCompleto.slice(0, 2).toUpperCase();

    const nuevoUsuario: Usuario = {
      id: `usr-${Date.now()}`,
      nombreCompleto: dto.nombreCompleto,
      email: dto.email,
      telefono: dto.telefono,
      rolId: dto.rolId,
      rolNombre: rol ? rol.nombre : 'Sin Rol Asignado',
      empresa: dto.empresa,
      sucursal: dto.sucursal || 'Sede Principal',
      estado: dto.estado,
      avatarInitials: initials,
      ultimoAcceso: undefined,
      fechaCreacion: new Date()
    };

    return of(nuevoUsuario).pipe(delay(250));
  }

  createRol(dto: CreateRolDto): Observable<Rol> {
    const nuevoRol: Rol = {
      id: `rol-${Date.now()}`,
      codigo: dto.codigo.toUpperCase().replace(/\s+/g, '_'),
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      permisos: dto.permisos,
      usuariosCount: 0,
      esSistema: false,
      fechaActualizacion: new Date()
    };

    return of(nuevoRol).pipe(delay(250));
  }
}
