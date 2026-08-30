import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { IamStore } from '../../../features/iam/store/iam.store';
import { UsuariosTableComponent } from '../../../features/iam/ui/usuarios-table/usuarios-table.component';
import { RolesCardsTableComponent } from '../../../features/iam/ui/roles-list/roles-cards-table.component';
import { UsuarioFormModalComponent } from '../../../features/iam/ui/usuario-form-modal/usuario-form-modal.component';
import { RolFormModalComponent } from '../../../features/iam/ui/rol-form-modal/rol-form-modal.component';

@Component({
  selector: 'app-iam-page',
  standalone: true,
  imports: [
    UsuariosTableComponent,
    RolesCardsTableComponent,
    UsuarioFormModalComponent,
    RolFormModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="material-icons text-primary-600 text-2xl">admin_panel_settings</span>
            <h1 class="text-2xl font-bold text-surface-900 tracking-tight">
              IAM - Gestión de Identidades y Accesos
            </h1>
          </div>
          <p class="text-xs text-surface-500 mt-1">
            Administre usuarios corporativos, roles organizacionales y matrices de permisos de seguridad RBAC.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button
            type="button"
            (click)="store.openCreateRolModal()"
            class="px-3.5 py-2 text-xs font-semibold text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors shadow-xs flex items-center cursor-pointer">
            <span class="material-icons text-[18px] mr-1.5 text-surface-500">add_moderator</span>
            Crear Rol
          </button>

          <button
            type="button"
            (click)="store.openCreateUsuarioModal()"
            class="px-4 py-2 text-xs font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center cursor-pointer">
            <span class="material-icons text-[18px] mr-1.5">person_add</span>
            Nuevo Usuario
          </button>
        </div>
      </div>

      <!-- Stats Overview Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Usuarios -->
        <div class="bg-white p-4 rounded-xl border border-surface-200 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">Total Usuarios</span>
            <div class="text-2xl font-bold text-surface-900 mt-1">{{ store.stats().totalUsuarios }}</div>
            <span class="text-[11px] text-surface-400">En todo el ecosistema</span>
          </div>
          <div class="h-11 w-11 rounded-lg bg-surface-100 text-surface-700 flex items-center justify-center">
            <span class="material-icons text-[24px]">group</span>
          </div>
        </div>

        <!-- Usuarios Activos -->
        <div class="bg-white p-4 rounded-xl border border-surface-200 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">Usuarios Activos</span>
            <div class="text-2xl font-bold text-green-600 mt-1">{{ store.stats().activos }}</div>
            <span class="text-[11px] text-green-700 font-medium">Habilitados para login</span>
          </div>
          <div class="h-11 w-11 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-200">
            <span class="material-icons text-[24px]">verified</span>
          </div>
        </div>

        <!-- Roles Configurados -->
        <div class="bg-white p-4 rounded-xl border border-surface-200 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">Roles y Políticas</span>
            <div class="text-2xl font-bold text-primary-700 mt-1">{{ store.stats().totalRoles }}</div>
            <span class="text-[11px] text-surface-400">Matrices RBAC activas</span>
          </div>
          <div class="h-11 w-11 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center border border-primary-100">
            <span class="material-icons text-[24px]">shield</span>
          </div>
        </div>

        <!-- Inactivos o Bloqueados -->
        <div class="bg-white p-4 rounded-xl border border-surface-200 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">Inactivos / Bloq.</span>
            <div class="text-2xl font-bold text-amber-600 mt-1">
              {{ store.stats().inactivos + store.stats().bloqueados }}
            </div>
            <span class="text-[11px] text-surface-400">Sin acceso concurrente</span>
          </div>
          <div class="h-11 w-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <span class="material-icons text-[24px]">lock</span>
          </div>
        </div>

      </div>

      <!-- Main Tabs & Filters Card -->
      <div class="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
        
        <!-- Tab Bar Navigation -->
        <div class="flex items-center justify-between border-b border-surface-200 px-6 pt-3 bg-surface-50/50">
          <div class="flex space-x-6">
            
            <button
              type="button"
              (click)="store.setTab('usuarios')"
              class="pb-3 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors cursor-pointer"
              [class.border-primary-600]="store.selectedTab() === 'usuarios'"
              [class.text-primary-600]="store.selectedTab() === 'usuarios'"
              [class.border-transparent]="store.selectedTab() !== 'usuarios'"
              [class.text-surface-500]="store.selectedTab() !== 'usuarios'">
              <span class="material-icons text-[18px]">people</span>
              <span>Usuarios ({{ store.usuarios().length }})</span>
            </button>

            <button
              type="button"
              (click)="store.setTab('roles')"
              class="pb-3 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors cursor-pointer"
              [class.border-primary-600]="store.selectedTab() === 'roles'"
              [class.text-primary-600]="store.selectedTab() === 'roles'"
              [class.border-transparent]="store.selectedTab() !== 'roles'"
              [class.text-surface-500]="store.selectedTab() !== 'roles'">
              <span class="material-icons text-[18px]">admin_panel_settings</span>
              <span>Roles y Permisos ({{ store.roles().length }})</span>
            </button>

          </div>
        </div>

        <!-- Filter Bar -->
        <div class="p-4 border-b border-surface-200 bg-surface-50/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <!-- Search input -->
          <div class="flex-1 max-w-md relative">
            <span class="material-icons absolute left-3 top-2.5 text-[18px] text-surface-400">search</span>
            <input
              type="text"
              [value]="store.searchQuery()"
              (input)="onSearchInput($event)"
              [placeholder]="store.selectedTab() === 'usuarios' ? 'Buscar usuario por nombre, email o empresa...' : 'Buscar rol por nombre o código...'"
              class="w-full pl-9 pr-4 py-2 text-xs border border-surface-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder-surface-400" />
            @if (store.searchQuery()) {
              <button
                type="button"
                (click)="store.setSearchQuery('')"
                class="absolute right-2.5 top-2 text-surface-400 hover:text-surface-600">
                <span class="material-icons text-[18px]">clear</span>
              </button>
            }
          </div>

          <!-- Secondary Filters (Only for Usuarios tab) -->
          @if (store.selectedTab() === 'usuarios') {
            <div class="flex items-center space-x-3">
              
              <!-- Filter Rol -->
              <div class="relative">
                <select
                  [value]="store.filtroRol()"
                  (change)="onRolFilterChange($event)"
                  class="pl-3 pr-8 py-2 text-xs border border-surface-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer text-surface-700">
                  <option value="ALL">Todos los Roles</option>
                  @for (r of store.roles(); track r.id) {
                    <option [value]="r.id">{{ r.nombre }}</option>
                  }
                </select>
                <span class="material-icons absolute right-2.5 top-2.5 text-[16px] text-surface-400 pointer-events-none">expand_more</span>
              </div>

              <!-- Filter Estado -->
              <div class="relative">
                <select
                  [value]="store.filtroEstado()"
                  (change)="onEstadoFilterChange($event)"
                  class="pl-3 pr-8 py-2 text-xs border border-surface-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer text-surface-700">
                  <option value="ALL">Todos los Estados</option>
                  <option value="ACTIVO">Activos</option>
                  <option value="INACTIVO">Inactivos</option>
                  <option value="BLOQUEADO">Bloqueados</option>
                  <option value="INVITADO">Invitados</option>
                </select>
                <span class="material-icons absolute right-2.5 top-2.5 text-[16px] text-surface-400 pointer-events-none">expand_more</span>
              </div>

            </div>
          }

        </div>

        <!-- Tab Content Body -->
        <div class="p-6">
          @if (store.selectedTab() === 'usuarios') {
            <app-usuarios-table [usuarios]="store.filteredUsuarios()" />
          } @else {
            <app-roles-cards-table [roles]="store.filteredRoles()" />
          }
        </div>

      </div>

      <!-- Modals for Users and Roles -->
      @if (store.isUsuarioModalOpen()) {
        <app-usuario-form-modal />
      }

      @if (store.isRolModalOpen()) {
        <app-rol-form-modal />
      }

      <!-- Floating Toast Notifications -->
      @if (store.toast(); as t) {
        <div
          class="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold text-white animate-in slide-in-from-bottom-4 duration-200"
          [class]="t.type === 'success' ? 'bg-surface-900 border-l-4 border-green-500' : t.type === 'error' ? 'bg-surface-900 border-l-4 border-red-500' : 'bg-surface-900 border-l-4 border-primary-500'">
          <span class="material-icons text-[18px]"
            [class]="t.type === 'success' ? 'text-green-400' : t.type === 'error' ? 'text-red-400' : 'text-primary-400'">
            {{ t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info' }}
          </span>
          <span>{{ t.text }}</span>
        </div>
      }

    </div>
  `
})
export class IamPageComponent implements OnInit {
  readonly store = inject(IamStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.store.setSearchQuery(val);
  }

  onRolFilterChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.store.setFiltroRol(val);
  }

  onEstadoFilterChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.store.setFiltroEstado(val);
  }
}
