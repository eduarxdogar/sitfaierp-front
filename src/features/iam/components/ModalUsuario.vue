<script setup lang="ts">
import { computed, watch } from 'vue';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { crearUsuarioSchema } from '../schema/iam.schema';
import type { UsuarioResponse, RolResponse, CrearUsuarioRequest, EstadoUsuario } from '../dto/iam.dto';

// ─── Props & Emits ────────────────────────────────────────────────────────────
const props = defineProps<{
  /** null = modo creación, UsuarioResponse = modo edición */
  usuarioEnEdicion: UsuarioResponse | null;
  roles: RolResponse[];
  isPending?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: CrearUsuarioRequest];
}>();

// ─── Form Setup ───────────────────────────────────────────────────────────────
const isEditing = computed(() => !!props.usuarioEnEdicion);

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(crearUsuarioSchema),
  initialValues: {
    nombreCompleto: '',
    username: '',
    email: '',
    rolId: '',
    empresa: 'SITFAI Headquarters',
    empresa_id: '',
    sucursal: 'Sede Principal',
    estado: 'ACTIVO' as EstadoUsuario,
    enviarInvitacion: true,
  },
});

const { value: nombreCompleto } = useField<string>('nombreCompleto');
const { value: username } = useField<string>('username');
const { value: email } = useField<string>('email');
const { value: rolId } = useField<string>('rolId');
const { value: empresa } = useField<string>('empresa');
// empresa_id se vincula por v-model directamente en el template sin necesidad de variable local
useField<string>('empresa_id');
const { value: sucursal } = useField<string>('sucursal');
const { value: estado } = useField<EstadoUsuario>('estado');
const { value: enviarInvitacion } = useField<boolean>('enviarInvitacion');

const estados: EstadoUsuario[] = ['ACTIVO', 'INACTIVO', 'INVITADO', 'BLOQUEADO'];

// Precargar datos cuando sea edición
watch(
  () => props.usuarioEnEdicion,
  (usuario) => {
    if (usuario) {
      resetForm({
        values: {
          nombreCompleto: usuario.nombreCompleto,
          username: usuario.username,
          email: usuario.email,
          rolId: usuario.rolId,
          empresa: usuario.empresa,
          empresa_id: usuario.empresa_id,
          sucursal: usuario.sucursal ?? '',
          estado: usuario.estado,
          enviarInvitacion: false,
        },
      });
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

// ─── Submit ───────────────────────────────────────────────────────────────────
const onSubmit = handleSubmit((values) => {
  emit('submit', values as CrearUsuarioRequest);
});
</script>

<template>
  <!-- Overlay Backdrop -->
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <!-- Modal Box -->
    <div class="bg-white rounded-xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden">

      <!-- Header -->
      <div class="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-50">
        <div class="flex items-center space-x-3">
          <div class="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px]">
              {{ isEditing ? 'edit' : 'person_add' }}
            </span>
          </div>
          <div>
            <h3 class="text-base font-bold text-text-main">
              {{ isEditing ? 'Editar Usuario Corporativo' : 'Registrar Nuevo Usuario' }}
            </h3>
            <p class="text-xs text-text-muted">
              {{ isEditing ? 'Actualice las credenciales y permisos del usuario' : 'Defina los accesos y la pertenencia organizacional' }}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="text-text-muted hover:text-text-main rounded-lg p-1.5 hover:bg-surface-50 transition-colors cursor-pointer"
          @click="emit('close')"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Form Body -->
      <form class="p-6 space-y-4" @submit.prevent="onSubmit">

        <!-- Nombre Completo & Username -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nombre Completo -->
          <div>
            <label for="iam-nombreCompleto" class="block text-xs font-semibold text-text-main mb-1">
              Nombre Completo <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">badge</span>
              <input
                id="iam-nombreCompleto"
                v-model="nombreCompleto"
                type="text"
                placeholder="Ej. Martín Vizcarra Cornejo"
                class="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                :class="errors.nombreCompleto ? 'border-red-500' : 'border-border'"
              />
            </div>
            <span v-if="errors.nombreCompleto" class="text-[11px] text-red-600 mt-1 block">
              {{ errors.nombreCompleto }}
            </span>
          </div>

          <!-- Username -->
          <div>
            <label for="iam-username" class="block text-xs font-semibold text-text-main mb-1">
              Username <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">alternate_email</span>
              <input
                id="iam-username"
                v-model="username"
                type="text"
                placeholder="Ej. m.vizcarra"
                class="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                :class="errors.username ? 'border-red-500' : 'border-border'"
              />
            </div>
            <span v-if="errors.username" class="text-[11px] text-red-600 mt-1 block">
              {{ errors.username }}
            </span>
          </div>
        </div>

        <!-- Email & Rol -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Email -->
          <div>
            <label for="iam-email" class="block text-xs font-semibold text-text-main mb-1">
              Correo Electrónico <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">email</span>
              <input
                id="iam-email"
                v-model="email"
                type="email"
                placeholder="usuario@sitfai.com"
                class="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                :class="errors.email ? 'border-red-500' : 'border-border'"
              />
            </div>
            <span v-if="errors.email" class="text-[11px] text-red-600 mt-1 block">
              {{ errors.email }}
            </span>
          </div>

          <!-- Rol -->
          <div>
            <label for="iam-rolId" class="block text-xs font-semibold text-text-main mb-1">
              Rol de Seguridad <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">admin_panel_settings</span>
              <select
                id="iam-rolId"
                v-model="rolId"
                class="w-full pl-9 pr-8 py-2 text-sm border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                :class="errors.rolId ? 'border-red-500' : 'border-border'"
              >
                <option value="" disabled>Seleccione un rol...</option>
                <option v-for="rol in roles" :key="rol.id" :value="rol.id">
                  {{ rol.nombre }} ({{ rol.codigo }})
                </option>
              </select>
              <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-text-muted pointer-events-none">expand_more</span>
            </div>
            <span v-if="errors.rolId" class="text-[11px] text-red-600 mt-1 block">
              {{ errors.rolId }}
            </span>
          </div>
        </div>

        <!-- Empresa & Sucursal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="iam-empresa" class="block text-xs font-semibold text-text-main mb-1">
              Empresa / Razón Social <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">business</span>
              <input
                id="iam-empresa"
                v-model="empresa"
                type="text"
                placeholder="Ej. SITFAI S.A.C."
                class="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                :class="errors.empresa ? 'border-red-500' : 'border-border'"
              />
            </div>
            <span v-if="errors.empresa" class="text-[11px] text-red-600 mt-1 block">
              {{ errors.empresa }}
            </span>
          </div>

          <div>
            <label for="iam-sucursal" class="block text-xs font-semibold text-text-main mb-1">
              Sucursal / Sede
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">store</span>
              <input
                id="iam-sucursal"
                v-model="sucursal"
                type="text"
                placeholder="Ej. Sede Central / Almacén #1"
                class="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Estado (radio cards) -->
        <div>
          <label class="block text-xs font-semibold text-text-main mb-2">Estado de la Cuenta</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <label
              v-for="st in estados"
              :key="st"
              class="flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer transition-all text-xs font-medium"
              :class="estado === st
                ? 'border-primary bg-blue-50 text-primary'
                : 'border-border text-text-muted hover:border-primary/40'"
            >
              <input
                type="radio"
                :value="st"
                v-model="estado"
                class="text-primary focus:ring-primary"
              />
              <span>{{ st }}</span>
            </label>
          </div>
        </div>

        <!-- Enviar invitación (solo en creación) -->
        <div v-if="!isEditing" class="pt-1">
          <label class="flex items-start space-x-3 cursor-pointer p-3 bg-surface-50 rounded-lg border border-border hover:border-primary/40 transition-colors">
            <input
              type="checkbox"
              v-model="enviarInvitacion"
              class="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
            />
            <div class="text-xs">
              <span class="font-semibold text-text-main">Enviar correo de activación</span>
              <p class="text-text-muted mt-0.5">
                Se remitirá un enlace temporal con credenciales iniciales para que el usuario configure su contraseña segura.
              </p>
            </div>
          </label>
        </div>

        <!-- Footer Buttons -->
        <div class="pt-4 border-t border-border flex items-center justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-text-main bg-white border border-border rounded-lg hover:bg-surface-50 transition-colors cursor-pointer"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isPending"
            class="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span v-if="isPending" class="material-symbols-outlined text-[18px] animate-spin">sync</span>
            <span v-else class="material-symbols-outlined text-[18px]">save</span>
            {{ isEditing ? 'Actualizar Usuario' : 'Guardar Usuario' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
