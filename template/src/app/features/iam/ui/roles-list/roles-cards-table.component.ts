import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Rol } from '../../../../entities/iam/models/iam.interface';
import { IamStore } from '../../store/iam.store';

@Component({
  selector: 'app-roles-cards-table',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (rol of roles(); track rol.id) {
          <div class="bg-white rounded-xl border border-surface-200 shadow-sm p-5 hover:border-surface-300 transition-all flex flex-col justify-between">
            <div>
              <!-- Header Card -->
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-lg flex items-center justify-center font-bold"
                    [class]="rol.esSistema ? 'bg-amber-100 text-amber-800' : 'bg-primary-50 text-primary-700'">
                    <span class="material-icons text-[22px]">{{ rol.esSistema ? 'verified_user' : 'shield' }}</span>
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <h4 class="text-sm font-bold text-surface-900">{{ rol.nombre }}</h4>
                      @if (rol.esSistema) {
                        <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">
                          SISTEMA
                        </span>
                      }
                    </div>
                    <span class="text-xs font-mono text-surface-500 uppercase">{{ rol.codigo }}</span>
                  </div>
                </div>

                <!-- Actions menu -->
                <div class="flex items-center space-x-1">
                  <button
                    type="button"
                    (click)="store.openEditRolModal(rol)"
                    class="p-1.5 text-surface-400 hover:text-primary-600 rounded-md hover:bg-surface-100 transition-colors"
                    title="Configurar Permisos del Rol">
                    <span class="material-icons text-[18px]">tune</span>
                  </button>
                  @if (!rol.esSistema) {
                    <button
                      type="button"
                      (click)="deleteRol(rol)"
                      class="p-1.5 text-surface-400 hover:text-red-600 rounded-md hover:bg-surface-100 transition-colors"
                      title="Eliminar Rol">
                      <span class="material-icons text-[18px]">delete_outline</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Descripcion -->
              <p class="text-xs text-surface-600 mt-3 line-clamp-2 leading-relaxed">
                {{ rol.descripcion }}
              </p>

              <!-- Matriz de modulos incluidos -->
              <div class="mt-4 pt-3 border-t border-surface-100">
                <span class="text-[11px] font-semibold text-surface-500 uppercase tracking-wider block mb-2">
                  Alcance de Permisos ({{ getTotalActions(rol) }} acciones concedidas)
                </span>
                <div class="flex flex-wrap gap-1.5">
                  @for (p of rol.permisos; track p.modulo) {
                    @if (p.acciones.length > 0) {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface-100 text-surface-700 border border-surface-200">
                        <span class="font-semibold mr-1">{{ p.modulo }}:</span>
                        <span class="text-primary-700 font-bold">{{ p.acciones.length }}</span>
                      </span>
                    }
                  }
                </div>
              </div>
            </div>

            <!-- Footer Stats -->
            <div class="mt-5 pt-3 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
              <div class="flex items-center space-x-1.5 font-medium">
                <span class="material-icons text-[16px] text-surface-400">group</span>
                <span>{{ rol.usuariosCount }} {{ rol.usuariosCount === 1 ? 'usuario asignado' : 'usuarios asignados' }}</span>
              </div>
              <div class="text-[11px] text-surface-400">
                Modificado: {{ rol.fechaActualizacion | date:'dd/MM/yyyy' }}
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-2 py-12 text-center bg-white rounded-xl border border-surface-200">
            <span class="material-icons text-surface-300 text-4xl mb-2">security</span>
            <p class="font-medium text-surface-700">No se encontraron roles de seguridad</p>
            <p class="text-xs text-surface-400 mt-1">Cree un nuevo rol con la matriz de permisos granular.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class RolesCardsTableComponent {
  roles = input.required<Rol[]>();
  readonly store = inject(IamStore);

  getTotalActions(rol: Rol): number {
    return rol.permisos.reduce((acc, curr) => acc + curr.acciones.length, 0);
  }

  deleteRol(rol: Rol): void {
    if (rol.usuariosCount > 0) {
      this.store.showToast(`No se puede eliminar: tiene ${rol.usuariosCount} usuarios asignados.`, 'error');
      return;
    }
    if (confirm(`¿Está seguro de eliminar el rol "${rol.nombre}"?`)) {
      this.store.deleteRol(rol.id);
    }
  }
}
