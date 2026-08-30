import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Usuario, EstadoUsuario } from '../../../../entities/iam/models/iam.interface';
import { IamStore } from '../../store/iam.store';

@Component({
  selector: 'app-usuarios-table',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-auto rounded-lg border border-surface-200 shadow-sm bg-white">
      <table class="w-full text-left text-sm text-surface-700">
        <thead class="bg-surface-100 text-surface-600 font-semibold border-b border-surface-200 uppercase text-xs tracking-wider">
          <tr>
            <th scope="col" class="px-4 py-3">Usuario / Identidad</th>
            <th scope="col" class="px-4 py-3">Rol Asignado</th>
            <th scope="col" class="px-4 py-3">Empresa & Sucursal</th>
            <th scope="col" class="px-4 py-3">Último Acceso</th>
            <th scope="col" class="px-4 py-3 text-center">Estado</th>
            <th scope="col" class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-200">
          @for (user of usuarios(); track user.id) {
            <tr class="hover:bg-surface-50 transition-colors">
              
              <!-- Usuario y Avatar -->
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div class="h-9 w-9 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                    {{ user.avatarInitials }}
                  </div>
                  <div class="min-w-0">
                    <div class="font-medium text-surface-900 truncate">{{ user.nombreCompleto }}</div>
                    <div class="text-xs text-surface-500 truncate flex items-center mt-0.5">
                      <span class="material-icons text-[13px] mr-1 text-surface-400">email</span>
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Rol -->
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-100 text-surface-800 border border-surface-200">
                  <span class="material-icons text-[14px] mr-1.5 text-primary-600">shield</span>
                  {{ user.rolNombre }}
                </span>
              </td>

              <!-- Empresa y Sucursal -->
              <td class="px-4 py-3">
                <div class="text-surface-900 font-medium">{{ user.empresa }}</div>
                <div class="text-xs text-surface-500 flex items-center mt-0.5">
                  <span class="material-icons text-[13px] mr-1 text-surface-400">location_on</span>
                  {{ user.sucursal || 'Sede Central' }}
                </div>
              </td>

              <!-- Ultimo Acceso -->
              <td class="px-4 py-3 text-surface-600 text-xs">
                @if (user.ultimoAcceso) {
                  <div class="font-medium text-surface-800">{{ user.ultimoAcceso | date:'dd/MM/yyyy' }}</div>
                  <div class="text-[11px] text-surface-400">{{ user.ultimoAcceso | date:'HH:mm:ss' }}</div>
                } @else {
                  <span class="text-surface-400 italic">Nunca accedió</span>
                }
              </td>

              <!-- Estado -->
              <td class="px-4 py-3 text-center">
                <button
                  type="button"
                  (click)="store.toggleEstadoUsuario(user.id)"
                  [title]="'Clic para alternar estado (Actual: ' + user.estado + ')'"
                  class="cursor-pointer inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider transition-opacity hover:opacity-80"
                  [class]="getEstadoClasses(user.estado)">
                  {{ user.estado }}
                </button>
              </td>

              <!-- Acciones -->
              <td class="px-4 py-3 text-right">
                <div class="inline-flex items-center space-x-1">
                  <button
                    type="button"
                    (click)="store.openEditUsuarioModal(user)"
                    class="p-1.5 rounded text-surface-500 hover:text-primary-600 hover:bg-surface-100 transition-colors"
                    title="Editar Usuario">
                    <span class="material-icons text-[18px]">edit</span>
                  </button>
                  
                  <button
                    type="button"
                    (click)="sendResetPassword(user)"
                    class="p-1.5 rounded text-surface-500 hover:text-amber-600 hover:bg-surface-100 transition-colors"
                    title="Restablecer Contraseña">
                    <span class="material-icons text-[18px]">key</span>
                  </button>

                  <button
                    type="button"
                    (click)="deleteUser(user)"
                    class="p-1.5 rounded text-surface-500 hover:text-red-600 hover:bg-surface-100 transition-colors"
                    title="Eliminar Usuario">
                    <span class="material-icons text-[18px]">delete_outline</span>
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="px-4 py-12 text-center text-surface-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="material-icons text-surface-300 text-4xl mb-2">person_search</span>
                  <p class="font-medium text-surface-700">No se encontraron usuarios</p>
                  <p class="text-xs text-surface-400 mt-1">Pruebe modificando los filtros de búsqueda o registre un nuevo usuario.</p>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class UsuariosTableComponent {
  usuarios = input.required<Usuario[]>();
  readonly store = inject(IamStore);

  getEstadoClasses(estado: EstadoUsuario): string {
    switch (estado) {
      case EstadoUsuario.ACTIVO:
        return 'bg-green-100 text-green-800 border border-green-200';
      case EstadoUsuario.INACTIVO:
        return 'bg-surface-200 text-surface-700 border border-surface-300';
      case EstadoUsuario.BLOQUEADO:
        return 'bg-red-100 text-red-800 border border-red-200';
      case EstadoUsuario.INVITADO:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-surface-100 text-surface-800 border border-surface-200';
    }
  }

  sendResetPassword(user: Usuario): void {
    this.store.showToast(`Enlace de restablecimiento enviado a ${user.email}`, 'info');
  }

  deleteUser(user: Usuario): void {
    if (confirm(`¿Está seguro de eliminar al usuario ${user.nombreCompleto}?`)) {
      this.store.deleteUsuario(user.id);
    }
  }
}
