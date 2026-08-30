import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ModuloSistema,
  PermisoAccion,
  PermisoModulo,
  CreateRolDto
} from '../../../../entities/iam/models/iam.interface';
import { IamStore } from '../../store/iam.store';

@Component({
  selector: 'app-rol-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Overlay Backdrop -->
    <div class="fixed inset-0 z-50 overflow-y-auto bg-surface-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      
      <!-- Modal Container -->
      <div class="bg-white rounded-xl shadow-2xl border border-surface-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50 flex-shrink-0">
          <div class="flex items-center space-x-3">
            <div class="h-9 w-9 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <span class="material-icons text-[20px]">admin_panel_settings</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-surface-900">
                {{ isEditing() ? 'Configurar Rol y Permisos' : 'Crear Nuevo Rol de Seguridad' }}
              </h3>
              <p class="text-xs text-surface-500">
                Matriz de Control de Acceso Basado en Roles (RBAC) para los módulos del ERP
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="store.closeRolModal()"
            class="text-surface-400 hover:text-surface-600 rounded-lg p-1.5 hover:bg-surface-200 transition-colors">
            <span class="material-icons text-[20px]">close</span>
          </button>
        </div>

        <!-- Form Body (Scrollable) -->
        <form [formGroup]="rolForm" (ngSubmit)="onSubmit()" class="flex-1 overflow-y-auto p-6 space-y-6">
          
          <!-- Informacion General del Rol -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="nombre" class="block text-xs font-semibold text-surface-700 mb-1">
                Nombre del Rol <span class="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                formControlName="nombre"
                placeholder="Ej. Auditor Financiero"
                class="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                [class.border-red-500]="rolForm.get('nombre')?.invalid && rolForm.get('nombre')?.touched" />
              @if (rolForm.get('nombre')?.invalid && rolForm.get('nombre')?.touched) {
                <span class="text-[11px] text-red-600 mt-1 block">El nombre del rol es obligatorio.</span>
              }
            </div>

            <div>
              <label for="codigo" class="block text-xs font-semibold text-surface-700 mb-1">
                Código del Sistema (Identificador) <span class="text-red-500">*</span>
              </label>
              <input
                id="codigo"
                type="text"
                formControlName="codigo"
                placeholder="EJ. AUDITOR_FINANCIERO"
                class="w-full px-3 py-2 text-sm font-mono uppercase border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                [class.border-red-500]="rolForm.get('codigo')?.invalid && rolForm.get('codigo')?.touched" />
              @if (rolForm.get('codigo')?.invalid && rolForm.get('codigo')?.touched) {
                <span class="text-[11px] text-red-600 mt-1 block">Ingrese un código único sin espacios.</span>
              }
            </div>

            <div class="col-span-1 md:col-span-2">
              <label for="descripcion" class="block text-xs font-semibold text-surface-700 mb-1">
                Descripción del Rol y Responsabilidades <span class="text-red-500">*</span>
              </label>
              <textarea
                id="descripcion"
                rows="2"
                formControlName="descripcion"
                placeholder="Especifique el alcance de funciones y restricciones de este perfil..."
                class="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                [class.border-red-500]="rolForm.get('descripcion')?.invalid && rolForm.get('descripcion')?.touched"></textarea>
            </div>
          </div>

          <!-- Matriz de Permisos Granulares -->
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 pb-2 border-b border-surface-200 gap-2">
              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold uppercase tracking-wider text-surface-800">
                  Matriz de Permisos por Módulo
                </span>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                  {{ totalPermisosSeleccionados() }} seleccionados
                </span>
              </div>

              <!-- Quick action buttons -->
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  (click)="selectAllPermisos()"
                  class="px-2.5 py-1 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors">
                  Seleccionar Todo
                </button>
                <button
                  type="button"
                  (click)="clearAllPermisos()"
                  class="px-2.5 py-1 text-xs font-medium text-surface-600 bg-surface-100 border border-surface-200 rounded-md hover:bg-surface-200 transition-colors">
                  Limpiar Todo
                </button>
              </div>
            </div>

            <!-- Tabla de Matriz -->
            <div class="overflow-x-auto rounded-lg border border-surface-200">
              <table class="w-full text-left text-xs">
                <thead class="bg-surface-100 text-surface-700 font-bold border-b border-surface-200 uppercase">
                  <tr>
                    <th scope="col" class="px-4 py-2.5 w-1/3">Módulo del Sistema</th>
                    <th scope="col" class="px-3 py-2.5 text-center">Todo</th>
                    @for (accion of acciones; track accion) {
                      <th scope="col" class="px-3 py-2.5 text-center">{{ accion }}</th>
                    }
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-200 bg-white">
                  @for (mod of modulos; track mod) {
                    <tr class="hover:bg-surface-50 transition-colors">
                      
                      <!-- Modulo Nombre -->
                      <td class="px-4 py-3 font-semibold text-surface-900 flex items-center space-x-2">
                        <span class="material-icons text-[16px] text-surface-400">folder_open</span>
                        <span>{{ mod }}</span>
                      </td>

                      <!-- Toggle Todo el Modulo -->
                      <td class="px-3 py-3 text-center bg-surface-50/50">
                        <input
                          type="checkbox"
                          [checked]="isModuloFullyChecked(mod)"
                          (change)="toggleModuleAll(mod, $event)"
                          class="rounded text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer" />
                      </td>

                      <!-- Acciones individuales -->
                      @for (acc of acciones; track acc) {
                        <td class="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            [checked]="hasPermission(mod, acc)"
                            (change)="togglePermission(mod, acc)"
                            class="rounded text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer" />
                        </td>
                      }

                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (totalPermisosSeleccionados() === 0 && rolForm.touched) {
              <span class="text-[11px] text-red-600 mt-2 block font-medium">
                Debe asignar al menos un permiso de acceso a este rol.
              </span>
            }
          </div>

        </form>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-surface-200 bg-surface-50 flex items-center justify-between flex-shrink-0">
          <span class="text-xs text-surface-500">
            {{ isEditing() ? 'Los cambios aplicarán a todos los usuarios con este rol.' : 'Podrá reasignar usuarios a este rol en cualquier momento.' }}
          </span>
          <div class="flex items-center space-x-3">
            <button
              type="button"
              (click)="store.closeRolModal()"
              class="px-4 py-2 text-sm font-medium text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors">
              Cancelar
            </button>
            <button
              type="button"
              (click)="onSubmit()"
              [disabled]="rolForm.invalid || totalPermisosSeleccionados() === 0"
              class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center">
              <span class="material-icons text-[18px] mr-1.5">save</span>
              {{ isEditing() ? 'Actualizar Rol' : 'Crear Rol' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class RolFormModalComponent implements OnInit {
  readonly store = inject(IamStore);

  readonly modulos: ModuloSistema[] = [
    ModuloSistema.DASHBOARD,
    ModuloSistema.EMPRESAS,
    ModuloSistema.IAM,
    ModuloSistema.VENTAS_PEDIDOS,
    ModuloSistema.INVENTARIO,
    ModuloSistema.FACTURACION,
    ModuloSistema.POS
  ];

  readonly acciones: PermisoAccion[] = [
    PermisoAccion.LEER,
    PermisoAccion.CREAR,
    PermisoAccion.EDITAR,
    PermisoAccion.ELIMINAR,
    PermisoAccion.EXPORTAR
  ];

  readonly permisosState = signal<PermisoModulo[]>([]);

  readonly isEditing = computed(() => !!this.store.rolEnEdicion());

  readonly totalPermisosSeleccionados = computed(() => {
    return this.permisosState().reduce((acc, curr) => acc + curr.acciones.length, 0);
  });

  rolForm = new FormGroup({
    codigo: new FormControl('', [Validators.required, Validators.minLength(2)]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  ngOnInit(): void {
    const editRol = this.store.rolEnEdicion();
    if (editRol) {
      this.rolForm.patchValue({
        codigo: editRol.codigo,
        nombre: editRol.nombre,
        descripcion: editRol.descripcion
      });
      // Clone existing permissions
      this.permisosState.set(
        editRol.permisos.map((p) => ({
          modulo: p.modulo,
          acciones: [...p.acciones]
        }))
      );
    } else {
      // Default: create an empty matrix for each modulo
      this.permisosState.set(
        this.modulos.map((m) => ({
          modulo: m,
          acciones: [PermisoAccion.LEER] // default Read permission
        }))
      );
    }
  }

  hasPermission(modulo: ModuloSistema, accion: PermisoAccion): boolean {
    const found = this.permisosState().find((p) => p.modulo === modulo);
    return found ? found.acciones.includes(accion) : false;
  }

  togglePermission(modulo: ModuloSistema, accion: PermisoAccion): void {
    this.permisosState.update((list) => {
      let mod = list.find((p) => p.modulo === modulo);
      if (!mod) {
        mod = { modulo, acciones: [] };
        list.push(mod);
      }

      if (mod.acciones.includes(accion)) {
        mod.acciones = mod.acciones.filter((a) => a !== accion);
      } else {
        mod.acciones.push(accion);
      }

      return [...list];
    });
  }

  isModuloFullyChecked(modulo: ModuloSistema): boolean {
    const found = this.permisosState().find((p) => p.modulo === modulo);
    if (!found) return false;
    return this.acciones.every((a) => found.acciones.includes(a));
  }

  toggleModuleAll(modulo: ModuloSistema, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.permisosState.update((list) => {
      let mod = list.find((p) => p.modulo === modulo);
      if (!mod) {
        mod = { modulo, acciones: [] };
        list.push(mod);
      }

      if (checked) {
        mod.acciones = [...this.acciones];
      } else {
        mod.acciones = [];
      }

      return [...list];
    });
  }

  selectAllPermisos(): void {
    this.permisosState.set(
      this.modulos.map((m) => ({
        modulo: m,
        acciones: [...this.acciones]
      }))
    );
  }

  clearAllPermisos(): void {
    this.permisosState.set(
      this.modulos.map((m) => ({
        modulo: m,
        acciones: []
      }))
    );
  }

  onSubmit(): void {
    if (this.rolForm.invalid || this.totalPermisosSeleccionados() === 0) {
      this.rolForm.markAllAsTouched();
      return;
    }

    const val = this.rolForm.getRawValue();
    const editRol = this.store.rolEnEdicion();

    const activePermisos = this.permisosState().filter((p) => p.acciones.length > 0);

    if (editRol) {
      this.store.updateRol(editRol.id, {
        nombre: val.nombre ?? '',
        codigo: (val.codigo ?? '').toUpperCase().replace(/\s+/g, '_'),
        descripcion: val.descripcion ?? '',
        permisos: activePermisos
      });
    } else {
      const dto: CreateRolDto = {
        codigo: (val.codigo ?? '').toUpperCase().replace(/\s+/g, '_'),
        nombre: val.nombre ?? '',
        descripcion: val.descripcion ?? '',
        permisos: activePermisos
      };
      this.store.createRol(dto);
    }
  }
}
