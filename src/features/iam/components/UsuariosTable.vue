<script setup lang="ts">
import { computed } from 'vue';
import type { UsuarioResponse, EstadoUsuario } from '../dto/iam.dto';
import keycloak from '@/shared/services/auth/keycloak.client';
import { useSucursales } from '../../empresas/sub-features/sucursales/useSucursales';

// ─── Props & Emits ────────────────────────────────────────────────────────────
const props = defineProps<{
  usuarios: UsuarioResponse[];
}>();

const emit = defineEmits<{
  editar: [usuario: UsuarioResponse];
  cambiarEstado: [payload: { id: string; estado: EstadoUsuario }];
  eliminar: [id: string];
  resetPassword: [email: string];
}>();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const tenantId = computed(() => (keycloak.tokenParsed as any)?.empresa_id || '');
const { obtenerSucursales } = useSucursales(tenantId);
const sucursales = obtenerSucursales.data;

const getSucursalNombre = (usuario: UsuarioResponse) => {
  if (!usuario.sucursal) return '-';
  const suc = sucursales.value?.find((s: any) => s.id === usuario.sucursal);
  return suc ? suc.nombre : 'Cargando...';
};

function getEstadoClasses(estado: EstadoUsuario): string {
  switch (estado) {
    case 'ACTIVO':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'INACTIVO':
      return 'bg-slate-100 text-slate-600 border border-slate-200';
    case 'BLOQUEADO':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'INVITADO':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}

function toggleEstado(usuario: UsuarioResponse) {
  const nuevoEstado: EstadoUsuario =
    usuario.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
  emit('cambiarEstado', { id: usuario.id, estado: nuevoEstado });
}

function confirmarEliminar(usuario: UsuarioResponse) {
  if (confirm(`¿Está seguro de eliminar al usuario ${usuario.nombreCompleto}?`)) {
    emit('eliminar', usuario.id);
  }
}

/** Genera las iniciales del avatar desde el nombre completo */
function getInitials(nombreCompleto: string): string {
  if (nombreCompleto) {
    return nombreCompleto
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
  return '??';
}

/** Formatea fecha ISO a dd/MM/yyyy HH:mm */
function formatDate(iso?: string): { date: string; time: string } | null {
  if (!iso) return null;
  const d = new Date(iso);
  const date = d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-border shadow-sm bg-white">
    <table class="w-full text-left text-sm text-text-main">
      <!-- Header -->
      <thead class="bg-surface-50 text-text-muted font-semibold border-b border-border text-[10px] uppercase tracking-wider">
        <tr>
          <th scope="col" class="px-4 py-3">Usuario / Identidad</th>
          <th scope="col" class="px-4 py-3">Rol Asignado</th>
          <th scope="col" class="px-4 py-3">Empresa &amp; Sucursal</th>
          <th scope="col" class="px-4 py-3">Último Acceso</th>
          <th scope="col" class="px-4 py-3 text-center">Estado</th>
          <th scope="col" class="px-4 py-3 text-right">Acciones</th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody class="divide-y divide-slate-100">
        <!-- Rows -->
        <tr
          v-for="usuario in usuarios"
          :key="usuario.id"
          class="hover:bg-surface-50 transition-colors"
        >
          <!-- Avatar + Nombre + Email -->
          <td class="px-4 py-3">
            <div class="flex items-center space-x-3">
              <div class="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                {{ usuario.avatarInitials || getInitials(usuario.nombreCompleto) }}
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-text-main truncate">{{ usuario.nombreCompleto }}</div>
                <div class="text-xs text-text-muted truncate flex items-center mt-0.5">
                  <span class="material-symbols-outlined text-[13px] mr-1">email</span>
                  {{ usuario.email }}
                </div>
              </div>
            </div>
          </td>

          <!-- Rol -->
          <td class="px-4 py-3">
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-50 text-text-main border border-border">
              <span class="material-symbols-outlined text-[14px] mr-1.5 text-primary">shield</span>
              {{ usuario.rol }}
            </span>
          </td>

          <!-- Empresa & Sucursal -->
          <td class="px-4 py-3">
            <div class="font-medium text-text-main">{{ usuario.empresa }}</div>
            <div class="text-xs text-text-muted flex items-center mt-0.5">
              <span class="material-symbols-outlined text-[13px] mr-1">location_on</span>
              {{ getSucursalNombre(usuario) }}
            </div>
          </td>

          <!-- Último Acceso -->
          <td class="px-4 py-3 text-xs">
            <template v-if="formatDate(usuario.ultimoAcceso)">
              <div class="font-medium text-text-main">{{ formatDate(usuario.ultimoAcceso)!.date }}</div>
              <div class="text-[11px] text-text-muted">{{ formatDate(usuario.ultimoAcceso)!.time }}</div>
            </template>
            <span v-else class="text-text-muted italic">Nunca accedió</span>
          </td>

          <!-- Estado — clic para alternar -->
          <td class="px-4 py-3 text-center">
            <button
              type="button"
              :title="`Estado actual: ${usuario.estado}. Clic para cambiar.`"
              class="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider transition-opacity hover:opacity-80 cursor-pointer"
              :class="getEstadoClasses(usuario.estado)"
              @click="toggleEstado(usuario)"
            >
              {{ usuario.estado }}
            </button>
          </td>

          <!-- Acciones -->
          <td class="px-4 py-3 text-right">
            <div class="inline-flex items-center space-x-1">
              <!-- Editar -->
              <button
                type="button"
                title="Editar usuario"
                class="p-1.5 rounded text-text-muted hover:text-primary hover:bg-surface-50 transition-colors cursor-pointer"
                @click="emit('editar', usuario)"
              >
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>

              <!-- Restablecer contraseña -->
              <button
                type="button"
                title="Restablecer contraseña"
                class="p-1.5 rounded text-text-muted hover:text-amber-600 hover:bg-surface-50 transition-colors cursor-pointer"
                @click="emit('resetPassword', usuario.email)"
            >
                <span class="material-symbols-outlined text-[18px]">key</span>
              </button>

              <!-- Eliminar -->
              <button
                type="button"
                title="Eliminar usuario"
                class="p-1.5 rounded text-text-muted hover:text-red-600 hover:bg-surface-50 transition-colors cursor-pointer"
                @click="confirmarEliminar(usuario)"
              >
                <span class="material-symbols-outlined text-[18px]">delete_outline</span>
              </button>
            </div>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-if="!usuarios || usuarios.length === 0">
          <td colspan="6" class="px-4 py-12 text-center text-text-muted">
            <div class="flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-[40px] mb-2 opacity-30">person_search</span>
              <p class="font-medium text-text-main">No se encontraron usuarios</p>
              <p class="text-xs text-text-muted mt-1">
                Pruebe modificando los filtros o registre un nuevo usuario.
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
