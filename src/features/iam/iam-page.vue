<script setup lang="ts">
import { ref, computed } from 'vue';
import { useIam } from './composables/useIam';
import { useToast } from '@/shared/composables/use-toast';
import IamStats from './components/IamStats.vue';
import UsuariosTable from './components/UsuariosTable.vue';
import ModalUsuario from './components/ModalUsuario.vue';
import RolesCardsTable from './components/RolesCardsTable.vue';
import ModalRol from './components/ModalRol.vue';
import type { UsuarioResponse, CrearUsuarioRequest, EstadoUsuario, RolResponse, CrearRolRequest } from './dto/iam.dto';

// ─── Composables ──────────────────────────────────────────────────────────────
const toast = useToast();
const {
  obtenerUsuarios,
  obtenerRoles,
  crearUsuario,
  crearRol,
  actualizarUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario,
} = useIam();

// ─── Data ─────────────────────────────────────────────────────────────────────
const { data: usuarios, isLoading: isLoadingUsuarios } = obtenerUsuarios;
const { data: roles, isLoading: isLoadingRoles } = obtenerRoles;
const isLoading = computed(() => isLoadingUsuarios.value || isLoadingRoles.value);

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'usuarios' | 'roles';
const activeTab = ref<Tab>('usuarios');

// ─── Search & Filters ─────────────────────────────────────────────────────────
const searchQuery = ref('');
const filtroEstado = ref<string>('ALL');
const filtroRol = ref<string>('ALL');

const filteredUsuarios = computed(() => {

  
  const q = searchQuery.value.toLowerCase().trim();
  const estado = filtroEstado.value;
  const rolId = filtroRol.value;
  const list = usuarios.value ?? [];

  return list.filter((u) => {
    const matchSearch =
      !q ||
      u.nombreCompleto.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.empresa.toLowerCase().includes(q) ||
      u.rol.toLowerCase().includes(q);
    const matchEstado = estado === 'ALL' || u.estado === estado;
    const matchRol = rolId === 'ALL' || u.rolId === rolId;
    return matchSearch && matchEstado && matchRol;
  });
});

// ─── Modal Usuario state ──────────────────────────────────────────────────────
const isModalOpen = ref(false);
const usuarioEnEdicion = ref<UsuarioResponse | null>(null);

function abrirModalCrear() {
  usuarioEnEdicion.value = null;
  isModalOpen.value = true;
}

function abrirModalEditar(usuario: UsuarioResponse) {
  usuarioEnEdicion.value = usuario;
  isModalOpen.value = true;
}

function cerrarModal() {
  isModalOpen.value = false;
  usuarioEnEdicion.value = null;
}

// ─── Modal Rol state ──────────────────────────────────────────────────────────
const isModalRolOpen = ref(false);
const rolEnEdicion = ref<RolResponse | null>(null);

function abrirModalCrearRol() {
  rolEnEdicion.value = null;
  isModalRolOpen.value = true;
}

function abrirModalEditarRol(rol: RolResponse) {
  rolEnEdicion.value = rol;
  isModalRolOpen.value = true;
}

function cerrarModalRol() {
  isModalRolOpen.value = false;
  rolEnEdicion.value = null;
}

// ─── Handlers ─────────────────────────────────────────────────────────────────
async function handleSubmitUsuario(payload: CrearUsuarioRequest) {
  try {
    if (usuarioEnEdicion.value) {
      await actualizarUsuario.mutateAsync({ id: usuarioEnEdicion.value.id, data: payload });
      toast.success('Usuario actualizado correctamente.');
    } else {
      await crearUsuario.mutateAsync(payload);
      toast.success('Usuario creado con éxito.');
    }
    cerrarModal();
  } catch (error: any) {
    toast.error(error?.message ?? 'Error al guardar el usuario.');
  }
}

async function handleCambiarEstado(payload: { id: string; estado: EstadoUsuario }) {
  try {
    await cambiarEstadoUsuario.mutateAsync({ id: payload.id, data: { estado: payload.estado } });
    toast.success('Estado del usuario actualizado.');
  } catch {
    toast.error('No se pudo cambiar el estado del usuario.');
  }
}

async function handleEliminar(id: string) {
  try {
    await eliminarUsuario.mutateAsync(id);
    toast.success('Usuario eliminado correctamente.');
  } catch {
    toast.error('Error al eliminar el usuario.');
  }
}

function handleResetPassword(email: string) {
  toast.success(`Enlace de restablecimiento enviado a ${email}`);
}

async function handleSubmitRol(payload: CrearRolRequest) {
  try {
    if (rolEnEdicion.value) {
      // await actualizarRol.mutateAsync({ id: rolEnEdicion.value.id, data: payload });
      toast.success('Rol actualizado correctamente (mock).');
    } else {
      await crearRol.mutateAsync(payload);
      toast.success('Rol creado con éxito.');
    }
    cerrarModalRol();
  } catch (error: any) {
    toast.error(error?.message ?? 'Error al guardar el rol.');
  }
}

function handleEliminarRol(id: string) {
  // await eliminarRol.mutateAsync(id);
  toast.success(`Rol ${id} eliminado (mock).`);
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6 bg-surface-50 min-h-screen font-sans">

    <!-- ── Modal ─────────────────────────────────────────────────────────── -->
    <ModalUsuario
      v-if="isModalOpen"
      :usuario-en-edicion="usuarioEnEdicion"
      :roles="roles ?? []"
      :is-pending="crearUsuario.isPending.value || actualizarUsuario.isPending.value"
      @close="cerrarModal"
      @submit="handleSubmitUsuario"
    />

    <ModalRol
      v-if="isModalRolOpen"
      :rol-en-edicion="rolEnEdicion"
      :is-pending="crearRol.isPending.value"
      @close="cerrarModalRol"
      @submit="handleSubmitRol"
    />

    <!-- ── Page Header ────────────────────────────────────────────────────── -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <span class="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
          <h1 class="text-[20px] font-extrabold text-text-main tracking-tight">
            IAM - Gestión de Identidades y Accesos
          </h1>
        </div>
        <p class="text-xs text-text-muted mt-1">
          Administre usuarios corporativos, roles organizacionales y matrices de permisos de seguridad RBAC.
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <!-- Crear Rol -->
        <button
          type="button"
          class="px-3.5 py-2 text-xs font-semibold text-text-main bg-white border border-border rounded-lg hover:bg-surface-50 transition-colors shadow-xs flex items-center cursor-pointer"
          @click="abrirModalCrearRol"
        >
          <span class="material-symbols-outlined text-[18px] mr-1.5 text-text-muted">add_moderator</span>
          Crear Rol
        </button>

        <!-- Nuevo Usuario -->
        <button
          type="button"
          class="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm flex items-center cursor-pointer"
          @click="abrirModalCrear"
        >
          <span class="material-symbols-outlined text-[18px] mr-1.5">person_add</span>
          Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- ── Stats Cards ────────────────────────────────────────────────────── -->
    <IamStats
      :usuarios="usuarios ?? []"
      :roles-count="roles?.length ?? 0"
    />

    <!-- ── Main Panel ─────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-xl border border-border shadow-sm overflow-hidden">

      <!-- Tab Bar -->
      <div class="flex items-center justify-between border-b border-border px-6 pt-3 bg-surface-50/50">
        <div class="flex space-x-6">
          <button
            type="button"
            class="pb-3 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors cursor-pointer"
            :class="activeTab === 'usuarios'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-main'"
            @click="activeTab = 'usuarios'; searchQuery = ''"
          >
            <span class="material-symbols-outlined text-[18px]">people</span>
            <span>Usuarios ({{ usuarios?.length ?? 0 }})</span>
          </button>

          <button
            type="button"
            class="pb-3 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors cursor-pointer"
            :class="activeTab === 'roles'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-main'"
            @click="activeTab = 'roles'; searchQuery = ''"
          >
            <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>Roles y Permisos ({{ roles?.length ?? 0 }})</span>
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="p-4 border-b border-border bg-surface-50/30 flex flex-col md:flex-row md:items-center justify-between gap-3">

        <!-- Search -->
        <div class="flex-1 max-w-md relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">search</span>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="activeTab === 'usuarios'
              ? 'Buscar usuario por nombre, email o empresa...'
              : 'Buscar rol por nombre o código...'"
            class="w-full pl-9 pr-4 py-2 text-xs border border-border rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-text-muted"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-2.5 top-2 text-text-muted hover:text-text-main cursor-pointer"
            @click="searchQuery = ''"
          >
            <span class="material-symbols-outlined text-[18px]">clear</span>
          </button>
        </div>

        <!-- Filtros secundarios (solo tab usuarios) -->
        <div v-if="activeTab === 'usuarios'" class="flex items-center space-x-3">

          <!-- Filtro por Rol -->
          <div class="relative">
            <select
              v-model="filtroRol"
              class="pl-3 pr-8 py-2 text-xs border border-border rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer text-text-main"
            >
              <option value="ALL">Todos los Roles</option>
              <option v-for="rol in (roles ?? [])" :key="rol.id" :value="rol.id">{{ rol.nombre }}</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-text-muted pointer-events-none">expand_more</span>
          </div>

          <!-- Filtro por Estado -->
          <div class="relative">
            <select
              v-model="filtroEstado"
              class="pl-3 pr-8 py-2 text-xs border border-border rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer text-text-main"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="INACTIVO">Inactivos</option>
              <option value="BLOQUEADO">Bloqueados</option>
              <option value="INVITADO">Invitados</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-text-muted pointer-events-none">expand_more</span>
          </div>

        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6">

        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-text-muted">
          <span class="material-symbols-outlined animate-spin text-[32px] text-primary mb-3">sync</span>
          <p class="text-sm font-medium">Cargando datos IAM...</p>
        </div>

        <!-- Tab: Usuarios -->
        <template v-else-if="activeTab === 'usuarios'">
          <UsuariosTable
            :usuarios="filteredUsuarios"
            @editar="abrirModalEditar"
            @cambiar-estado="handleCambiarEstado"
            @eliminar="handleEliminar"
            @reset-password="handleResetPassword"
          />
        </template>

        <!-- Tab: Roles -->
        <template v-else>
          <RolesCardsTable
            :roles="roles ?? []"
            @editar="abrirModalEditarRol"
            @eliminar="handleEliminarRol"
          />
        </template>

      </div>
    </div>

  </div>
</template>
