import { Injectable, computed, inject, signal } from '@angular/core';
import { IamService } from '../../../entities/iam/api/iam.service';
import {
  Usuario,
  Rol,
  EstadoUsuario,
  CreateUsuarioDto,
  CreateRolDto
} from '../../../entities/iam/models/iam.interface';

export interface ToastNotification {
  id: number;
  text: string;
  type: 'success' | 'info' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class IamStore {
  private iamService = inject(IamService);

  // State Signals
  readonly usuarios = signal<Usuario[]>([]);
  readonly roles = signal<Rol[]>([]);
  readonly selectedTab = signal<'usuarios' | 'roles'>('usuarios');
  readonly searchQuery = signal<string>('');
  readonly filtroEstado = signal<string>('ALL');
  readonly filtroRol = signal<string>('ALL');
  readonly isLoading = signal<boolean>(false);
  
  readonly isUsuarioModalOpen = signal<boolean>(false);
  readonly usuarioEnEdicion = signal<Usuario | null>(null);

  readonly isRolModalOpen = signal<boolean>(false);
  readonly rolEnEdicion = signal<Rol | null>(null);

  readonly toast = signal<ToastNotification | null>(null);

  // Computed signals
  readonly filteredUsuarios = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const estado = this.filtroEstado();
    const rolId = this.filtroRol();
    const list = this.usuarios();

    return list.filter((u) => {
      const matchSearch =
        !q ||
        u.nombreCompleto.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.empresa.toLowerCase().includes(q) ||
        u.rolNombre.toLowerCase().includes(q);

      const matchEstado = estado === 'ALL' || u.estado === estado;
      const matchRol = rolId === 'ALL' || u.rolId === rolId;

      return matchSearch && matchEstado && matchRol;
    });
  });

  readonly filteredRoles = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const list = this.roles();

    return list.filter((r) => {
      return (
        !q ||
        r.nombre.toLowerCase().includes(q) ||
        r.codigo.toLowerCase().includes(q) ||
        r.descripcion.toLowerCase().includes(q)
      );
    });
  });

  readonly stats = computed(() => {
    const usrs = this.usuarios();
    const rls = this.roles();

    const activos = usrs.filter((u) => u.estado === EstadoUsuario.ACTIVO).length;
    const inactivos = usrs.filter((u) => u.estado === EstadoUsuario.INACTIVO).length;
    const bloqueados = usrs.filter((u) => u.estado === EstadoUsuario.BLOQUEADO).length;

    return {
      totalUsuarios: usrs.length,
      activos,
      inactivos,
      bloqueados,
      totalRoles: rls.length
    };
  });

  // Actions
  loadInitialData(): void {
    this.isLoading.set(true);

    this.iamService.getRoles().subscribe({
      next: (rolesData) => {
        this.roles.set(rolesData);
        this.iamService.getUsuarios().subscribe({
          next: (usuariosData) => {
            this.usuarios.set(usuariosData);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: () => this.isLoading.set(false)
    });
  }

  setTab(tab: 'usuarios' | 'roles'): void {
    this.selectedTab.set(tab);
    this.searchQuery.set('');
  }

  setSearchQuery(q: string): void {
    this.searchQuery.set(q);
  }

  setFiltroEstado(estado: string): void {
    this.filtroEstado.set(estado);
  }

  setFiltroRol(rolId: string): void {
    this.filtroRol.set(rolId);
  }

  // Modals & CRUD
  openCreateUsuarioModal(): void {
    this.usuarioEnEdicion.set(null);
    this.isUsuarioModalOpen.set(true);
  }

  openEditUsuarioModal(user: Usuario): void {
    this.usuarioEnEdicion.set(user);
    this.isUsuarioModalOpen.set(true);
  }

  closeUsuarioModal(): void {
    this.isUsuarioModalOpen.set(false);
    this.usuarioEnEdicion.set(null);
  }

  openCreateRolModal(): void {
    this.rolEnEdicion.set(null);
    this.isRolModalOpen.set(true);
  }

  openEditRolModal(rol: Rol): void {
    this.rolEnEdicion.set(rol);
    this.isRolModalOpen.set(true);
  }

  closeRolModal(): void {
    this.isRolModalOpen.set(false);
    this.rolEnEdicion.set(null);
  }

  createUsuario(dto: CreateUsuarioDto): void {
    this.isLoading.set(true);
    this.iamService.createUsuario(dto, this.roles()).subscribe({
      next: (nuevo) => {
        this.usuarios.update((list) => [nuevo, ...list]);
        // Update user count in corresponding role
        this.roles.update((rls) =>
          rls.map((r) =>
            r.id === nuevo.rolId ? { ...r, usuariosCount: r.usuariosCount + 1 } : r
          )
        );
        this.isLoading.set(false);
        this.closeUsuarioModal();
        this.showToast(`Usuario "${nuevo.nombreCompleto}" creado con éxito.`, 'success');
      },
      error: () => {
        this.isLoading.set(false);
        this.showToast('Error al crear usuario', 'error');
      }
    });
  }

  updateUsuario(id: string, updatedData: Partial<Usuario>): void {
    const rol = this.roles().find((r) => r.id === updatedData.rolId);
    this.usuarios.update((list) =>
      list.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            ...updatedData,
            rolNombre: rol ? rol.nombre : u.rolNombre
          };
        }
        return u;
      })
    );
    this.closeUsuarioModal();
    this.showToast('Usuario actualizado correctamente.', 'success');
  }

  toggleEstadoUsuario(id: string): void {
    this.usuarios.update((list) =>
      list.map((u) => {
        if (u.id === id) {
          const nuevoEstado =
            u.estado === EstadoUsuario.ACTIVO
              ? EstadoUsuario.INACTIVO
              : EstadoUsuario.ACTIVO;
          return { ...u, estado: nuevoEstado };
        }
        return u;
      })
    );
    this.showToast('Estado del usuario actualizado.', 'info');
  }

  deleteUsuario(id: string): void {
    const target = this.usuarios().find((u) => u.id === id);
    if (!target) return;

    this.usuarios.update((list) => list.filter((u) => u.id !== id));
    this.roles.update((rls) =>
      rls.map((r) =>
        r.id === target.rolId ? { ...r, usuariosCount: Math.max(0, r.usuariosCount - 1) } : r
      )
    );
    this.showToast(`Usuario "${target.nombreCompleto}" eliminado.`, 'info');
  }

  createRol(dto: CreateRolDto): void {
    this.isLoading.set(true);
    this.iamService.createRol(dto).subscribe({
      next: (nuevoRol) => {
        this.roles.update((list) => [...list, nuevoRol]);
        this.isLoading.set(false);
        this.closeRolModal();
        this.showToast(`Rol "${nuevoRol.nombre}" configurado con éxito.`, 'success');
      },
      error: () => {
        this.isLoading.set(false);
        this.showToast('Error al crear rol', 'error');
      }
    });
  }

  updateRol(id: string, dto: Partial<Rol>): void {
    this.roles.update((list) =>
      list.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            ...dto,
            fechaActualizacion: new Date()
          };
        }
        return r;
      })
    );
    this.closeRolModal();
    this.showToast('Rol y permisos actualizados.', 'success');
  }

  deleteRol(id: string): void {
    const target = this.roles().find((r) => r.id === id);
    if (!target) return;
    if (target.esSistema) {
      this.showToast('No es posible eliminar roles protegidos del sistema.', 'error');
      return;
    }
    if (target.usuariosCount > 0) {
      this.showToast(`El rol "${target.nombre}" tiene ${target.usuariosCount} usuarios asignados. Reasígnelos antes de eliminar.`, 'error');
      return;
    }

    this.roles.update((list) => list.filter((r) => r.id !== id));
    this.showToast(`Rol "${target.nombre}" eliminado.`, 'info');
  }

  showToast(text: string, type: 'success' | 'info' | 'error' = 'success'): void {
    this.toast.set({
      id: Date.now(),
      text,
      type
    });
    setTimeout(() => {
      this.toast.set(null);
    }, 3500);
  }
}
