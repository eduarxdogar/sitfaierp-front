<script setup lang="ts">
import { computed } from 'vue';
import type { UsuarioResponse } from '../dto/iam.dto';

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps<{
  usuarios: UsuarioResponse[];
  rolesCount?: number;
}>();

// ─── Computed Stats ───────────────────────────────────────────────────────────
const stats = computed(() => {
  const list = props.usuarios;
  return {
    total: list.length,
    activos: list.filter((u) => u.estado === 'ACTIVO').length,
    inactivos: list.filter((u) => u.estado === 'INACTIVO').length,
    bloqueados: list.filter((u) => u.estado === 'BLOQUEADO').length,
    roles: props.rolesCount ?? 0,
    sinAcceso: list.filter((u) => u.estado === 'INACTIVO' || u.estado === 'BLOQUEADO').length,
  };
});
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

    <!-- Total Usuarios -->
    <div class="bg-white p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
      <div>
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Total Usuarios</span>
        <div class="text-2xl font-bold text-text-main mt-1">{{ stats.total }}</div>
        <span class="text-[11px] text-text-muted">En todo el ecosistema</span>
      </div>
      <div class="h-11 w-11 rounded-lg bg-surface-50 text-text-muted flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-[24px]">group</span>
      </div>
    </div>

    <!-- Usuarios Activos -->
    <div class="bg-white p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
      <div>
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Usuarios Activos</span>
        <div class="text-2xl font-bold text-green-600 mt-1">{{ stats.activos }}</div>
        <span class="text-[11px] text-green-700 font-medium">Habilitados para login</span>
      </div>
      <div class="h-11 w-11 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-200 flex-shrink-0">
        <span class="material-symbols-outlined text-[24px]">verified</span>
      </div>
    </div>

    <!-- Roles y Políticas -->
    <div class="bg-white p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
      <div>
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Roles y Políticas</span>
        <div class="text-2xl font-bold text-primary mt-1">{{ stats.roles }}</div>
        <span class="text-[11px] text-text-muted">Matrices RBAC activas</span>
      </div>
      <div class="h-11 w-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 flex-shrink-0">
        <span class="material-symbols-outlined text-[24px]">shield</span>
      </div>
    </div>

    <!-- Inactivos / Bloqueados -->
    <div class="bg-white p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
      <div>
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Inactivos / Bloq.</span>
        <div class="text-2xl font-bold text-amber-600 mt-1">{{ stats.sinAcceso }}</div>
        <span class="text-[11px] text-text-muted">Sin acceso concurrente</span>
      </div>
      <div class="h-11 w-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 flex-shrink-0">
        <span class="material-symbols-outlined text-[24px]">lock</span>
      </div>
    </div>

  </div>
</template>
