<script setup lang="ts">
import type { RolResponse, PermisoModulo } from '../dto/iam.dto';

defineProps<{
  roles: RolResponse[];
}>();

const emit = defineEmits<{
  editar: [rol: RolResponse];
  eliminar: [id: string];
}>();

function formatDate(isoString: string): string {
  if (!isoString) return 'Desconocido';
  const date = new Date(isoString);
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function summarizePermisos(permisos?: PermisoModulo[]): string {
  if (!permisos || permisos.length === 0) return 'Sin permisos configurados';
  return permisos.map((p) => `${p.modulo}: ${p.acciones.length}`).join(' | ');
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="rol in roles"
      :key="rol.id"
      class="bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="p-4 border-b border-border bg-surface-50 flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">shield</span>
          </div>
          <div>
            <h3 class="text-sm font-bold text-text-main flex items-center gap-2">
              {{ rol.nombre }}
              <span
                v-if="rol.esSistema"
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800"
              >
                SISTEMA
              </span>
            </h3>
            <p class="text-[11px] text-text-muted font-mono mt-0.5">{{ rol.codigo }}</p>
          </div>
        </div>
        
        <!-- Actions Dropdown or simple buttons (using simple buttons for now) -->
        <div class="flex space-x-1">
          <button
            type="button"
            class="p-1.5 text-text-muted hover:text-primary rounded hover:bg-white transition-colors cursor-pointer"
            title="Editar Rol"
            @click="emit('editar', rol)"
          >
            <span class="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            v-if="!rol.esSistema"
            type="button"
            class="p-1.5 text-text-muted hover:text-red-600 rounded hover:bg-white transition-colors cursor-pointer"
            title="Eliminar Rol"
            @click="emit('eliminar', rol.id)"
          >
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 flex-1 flex flex-col space-y-3">
        <p class="text-xs text-text-muted leading-relaxed">
          {{ rol.descripcion || 'Sin descripción.' }}
        </p>
        
        <div class="bg-surface-50 p-2.5 rounded-lg border border-border mt-auto">
          <p class="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Matriz de Permisos</p>
          <p class="text-xs text-text-main font-medium">
            {{ summarizePermisos(rol.permisos) }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-border bg-surface-50 flex items-center justify-between text-xs text-text-muted">
        <div class="flex items-center space-x-1">
          <span class="material-symbols-outlined text-[16px]">group</span>
          <span class="font-medium text-text-main">{{ rol.usuariosCount }}</span>
          <span>usuarios</span>
        </div>
        <div class="flex items-center space-x-1">
          <span class="material-symbols-outlined text-[14px]">update</span>
          <span>{{ formatDate(rol.fechaActualizacion) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="!roles || roles.length === 0" class="col-span-full py-16 flex flex-col items-center justify-center text-text-muted bg-white rounded-xl border border-border shadow-sm">
      <span class="material-symbols-outlined text-[48px] mb-3 opacity-30">admin_panel_settings</span>
      <p class="font-medium text-text-main">No hay roles registrados</p>
      <p class="text-xs text-text-muted mt-1">Cree un nuevo rol para gestionar los permisos RBAC.</p>
    </div>
  </div>
</template>
