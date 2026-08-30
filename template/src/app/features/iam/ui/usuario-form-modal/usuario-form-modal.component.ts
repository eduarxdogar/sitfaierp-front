import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  EstadoUsuario,
  CreateUsuarioDto
} from '../../../../entities/iam/models/iam.interface';
import { IamStore } from '../../store/iam.store';

@Component({
  selector: 'app-usuario-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Overlay Backdrop -->
    <div
      class="fixed inset-0 z-50 overflow-y-auto bg-surface-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      
      <!-- Modal Box -->
      <div
        class="bg-white rounded-xl shadow-2xl border border-surface-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div class="flex items-center space-x-3">
            <div class="h-9 w-9 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <span class="material-icons text-[20px]">{{ isEditing() ? 'edit' : 'person_add' }}</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-surface-900">
                {{ isEditing() ? 'Editar Usuario Corporativo' : 'Registrar Nuevo Usuario' }}
              </h3>
              <p class="text-xs text-surface-500">
                {{ isEditing() ? 'Actualice las credenciales y permisos del usuario' : 'Defina los accesos y la pertenencia organizacional' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="store.closeUsuarioModal()"
            class="text-surface-400 hover:text-surface-600 rounded-lg p-1.5 hover:bg-surface-200 transition-colors">
            <span class="material-icons text-[20px]">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          
          <!-- Nombre Completo & Correo -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="nombreCompleto" class="block text-xs font-semibold text-surface-700 mb-1">
                Nombre Completo <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="material-icons absolute left-3 top-2.5 text-[18px] text-surface-400">badge</span>
                <input
                  id="nombreCompleto"
                  type="text"
                  formControlName="nombreCompleto"
                  placeholder="Ej. Martín Vizcarra Cornejo"
                  class="w-full pl-9 pr-3 py-2 text-sm border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  [class.border-red-500]="userForm.get('nombreCompleto')?.invalid && userForm.get('nombreCompleto')?.touched" />
              </div>
              @if (userForm.get('nombreCompleto')?.invalid && userForm.get('nombreCompleto')?.touched) {
                <span class="text-[11px] text-red-600 mt-1 block">El nombre completo es obligatorio (mín. 3 caracteres).</span>
              }
            </div>

            <div>
              <label for="email" class="block text-xs font-semibold text-surface-700 mb-1">
                Correo Electrónico <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="material-icons absolute left-3 top-2.5 text-[18px] text-surface-400">email</span>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="usuario@sitfai.com"
                  class="w-full pl-9 pr-3 py-2 text-sm border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  [class.border-red-500]="userForm.get('email')?.invalid && userForm.get('email')?.touched" />
              </div>
              @if (userForm.get('email')?.invalid && userForm.get('email')?.touched) {
                <span class="text-[11px] text-red-600 mt-1 block">Ingrese un correo corporativo válido.</span>
              }
            </div>
          </div>

          <!-- Rol & Teléfono -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="rolId" class="block text-xs font-semibold text-surface-700 mb-1">
                Rol de Seguridad <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="material-icons absolute left-3 top-2.5 text-[18px] text-surface-400">admin_panel_settings</span>
                <select
                  id="rolId"
                  formControlName="rolId"
                  class="w-full pl-9 pr-3 py-2 text-sm border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="" disabled>Seleccione un rol...</option>
                  @for (rol of store.roles(); track rol.id) {
                    <option [value]="rol.id">{{ rol.nombre }} ({{ rol.codigo }})</option>
                  }
                </select>
                <span class="material-icons absolute right-3 top-2.5 text-[18px] text-surface-400 pointer-events-none">expand_more</span>
              </div>
              @if (userForm.get('rolId')?.invalid && userForm.get('rolId')?.touched) {
                <span class="text-[11px] text-red-600 mt-1 block">Debe asignar un rol al usuario.</span>
              }
            </div>

            <div>
              <label for="telefono" class="block text-xs font-semibold text-surface-700 mb-1">
                Teléfono de Contacto
              </label>
              <div class="relative">
                <span class="material-icons absolute left-3 top-2.5 text-[18px] text-surface-400">call</span>
                <input
                  id="telefono"
                  type="text"
                  formControlName="telefono"
                  placeholder="+51 999 888 777"
                  class="w-full pl-9 pr-3 py-2 text-sm border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <!-- Empresa & Sucursal -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="empresa" class="block text-xs font-semibold text-surface-700 mb-1">
                Empresa / Razón Social <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="material-icons absolute left-3 top-2.5 text-[18px] text-surface-400">business</span>
                <input
                  id="empresa"
                  type="text"
                  formControlName="empresa"
                  placeholder="Ej. SITFAI S.A.C."
                  class="w-full pl-9 pr-3 py-2 text-sm border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  [class.border-red-500]="userForm.get('empresa')?.invalid && userForm.get('empresa')?.touched" />
              </div>
              @if (userForm.get('empresa')?.invalid && userForm.get('empresa')?.touched) {
                <span class="text-[11px] text-red-600 mt-1 block">La empresa es requerida.</span>
              }
            </div>

            <div>
              <label for="sucursal" class="block text-xs font-semibold text-surface-700 mb-1">
                Sucursal / Sede
              </label>
              <div class="relative">
                <span class="material-icons absolute left-3 top-2.5 text-[18px] text-surface-400">store</span>
                <input
                  id="sucursal"
                  type="text"
                  formControlName="sucursal"
                  placeholder="Ej. Sede Central / Almacén #1"
                  class="w-full pl-9 pr-3 py-2 text-sm border border-surface-300 rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <!-- Estado inicial -->
          <div>
            <label for="estado" class="block text-xs font-semibold text-surface-700 mb-1">
              Estado de la Cuenta
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              @for (st of estados; track st) {
                <label
                  class="flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer transition-all text-xs font-medium"
                  [class.border-primary-600]="userForm.get('estado')?.value === st"
                  [class.bg-primary-50]="userForm.get('estado')?.value === st"
                  [class.text-primary-900]="userForm.get('estado')?.value === st"
                  [class.border-surface-200]="userForm.get('estado')?.value !== st">
                  <input
                    type="radio"
                    formControlName="estado"
                    [value]="st"
                    class="text-primary-600 focus:ring-primary-500" />
                  <span>{{ st }}</span>
                </label>
              }
            </div>
          </div>

          <!-- Enviar Invitacion Checkbox (solo si es nuevo) -->
          @if (!isEditing()) {
            <div class="pt-2">
              <label class="flex items-start space-x-3 cursor-pointer p-3 bg-surface-50 rounded-lg border border-surface-200">
                <input
                  type="checkbox"
                  formControlName="enviarInvitacion"
                  class="mt-0.5 rounded text-primary-600 focus:ring-primary-500 h-4 w-4" />
                <div class="text-xs">
                  <span class="font-semibold text-surface-900">Enviar correo de activación</span>
                  <p class="text-surface-500 mt-0.5">
                    Se remitirá un enlace temporal con credenciales iniciales para que el usuario configure su contraseña segura.
                  </p>
                </div>
              </label>
            </div>
          }

          <!-- Footer Buttons -->
          <div class="pt-4 border-t border-surface-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              (click)="store.closeUsuarioModal()"
              class="px-4 py-2 text-sm font-medium text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="userForm.invalid"
              class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center">
              <span class="material-icons text-[18px] mr-1.5">save</span>
              {{ isEditing() ? 'Actualizar Usuario' : 'Guardar Usuario' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class UsuarioFormModalComponent implements OnInit {
  readonly store = inject(IamStore);

  readonly estados = [
    EstadoUsuario.ACTIVO,
    EstadoUsuario.INACTIVO,
    EstadoUsuario.INVITADO,
    EstadoUsuario.BLOQUEADO
  ];

  readonly isEditing = computed(() => !!this.store.usuarioEnEdicion());

  userForm = new FormGroup({
    nombreCompleto: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl(''),
    rolId: new FormControl('', [Validators.required]),
    empresa: new FormControl('SITFAI Headquarters', [Validators.required]),
    sucursal: new FormControl('Sede Principal'),
    estado: new FormControl<EstadoUsuario>(EstadoUsuario.ACTIVO, [Validators.required]),
    enviarInvitacion: new FormControl(true)
  });

  ngOnInit(): void {
    const editUser = this.store.usuarioEnEdicion();
    if (editUser) {
      this.userForm.patchValue({
        nombreCompleto: editUser.nombreCompleto,
        email: editUser.email,
        telefono: editUser.telefono || '',
        rolId: editUser.rolId,
        empresa: editUser.empresa,
        sucursal: editUser.sucursal || '',
        estado: editUser.estado,
        enviarInvitacion: false
      });
    } else {
      // Default to first role if available
      const firstRole = this.store.roles()[0];
      if (firstRole) {
        this.userForm.patchValue({ rolId: firstRole.id });
      }
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const val = this.userForm.getRawValue();
    const editUser = this.store.usuarioEnEdicion();

    if (editUser) {
      this.store.updateUsuario(editUser.id, {
        nombreCompleto: val.nombreCompleto ?? '',
        email: val.email ?? '',
        telefono: val.telefono ?? undefined,
        rolId: val.rolId ?? '',
        empresa: val.empresa ?? '',
        sucursal: val.sucursal ?? undefined,
        estado: val.estado ?? EstadoUsuario.ACTIVO
      });
    } else {
      const dto: CreateUsuarioDto = {
        nombreCompleto: val.nombreCompleto ?? '',
        email: val.email ?? '',
        telefono: val.telefono ?? undefined,
        rolId: val.rolId ?? '',
        empresa: val.empresa ?? '',
        sucursal: val.sucursal ?? undefined,
        estado: val.estado ?? EstadoUsuario.ACTIVO,
        enviarInvitacion: !!val.enviarInvitacion
      };
      this.store.createUsuario(dto);
    }
  }
}
