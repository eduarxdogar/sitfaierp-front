<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { crearRolSchema } from '../schema/iam.schema';
import type { RolResponse, CrearRolRequest, PermisoModulo } from '../dto/iam.dto';

// ─── Props & Emits ────────────────────────────────────────────────────────────
const props = defineProps<{
  rolEnEdicion?: RolResponse | null;
  isPending?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: CrearRolRequest];
}>();

// ─── Constants ────────────────────────────────────────────────────────────────
const MODULOS = [
  'Dashboard',
  'Gestión de Empresas',
  'IAM (Usuarios y Roles)',
  'Ventas y Pedidos',
  'Inventario y Almacenes',
  'Facturación Electrónica',
  'Punto de Venta (POS)',
];

const ACCIONES = ['LEER', 'CREAR', 'EDITAR', 'ELIMINAR', 'EXPORTAR'];

// ─── Form Setup ───────────────────────────────────────────────────────────────
const isEditing = computed(() => !!props.rolEnEdicion);

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(crearRolSchema),
  initialValues: {
    nombre: '',
    codigo: '',
    descripcion: '',
  },
});

const { value: nombre } = useField<string>('nombre');
const { value: codigo } = useField<string>('codigo');
const { value: descripcion } = useField<string>('descripcion');

// ─── Matrix State ─────────────────────────────────────────────────────────────
// Map: modulo -> Set<accion>
const matrizPermisos = ref<Record<string, Set<string>>>({});

// Inicializar la matriz y el formulario
watch(
  () => props.rolEnEdicion,
  (rol) => {
    // 1. Construir la matriz temporalmente
    const nuevaMatriz: Record<string, Set<string>> = {};
    MODULOS.forEach((m) => {
      nuevaMatriz[m] = new Set();
    });

    if (rol) {
      resetForm({
        values: {
          nombre: rol.nombre,
          codigo: rol.codigo,
          descripcion: rol.descripcion || '',
        },
      });
      // Mapear los permisos del backend a la matriz
      if (rol.permisos) {
        rol.permisos.forEach((p) => {
          if (nuevaMatriz[p.modulo]) {
            p.acciones.forEach((a) => nuevaMatriz[p.modulo]!.add(a));
          }
        });
      }
    } else {
      resetForm();
    }
    
    // 2. Asignar al ref reactivo para disparar la actualización de los checkboxes
    matrizPermisos.value = nuevaMatriz;
  },
  { immediate: true },
);

// ─── Matrix Helpers ───────────────────────────────────────────────────────────
function isAccionChecked(modulo: string, accion: string): boolean {
  return matrizPermisos.value[modulo]?.has(accion) || false;
}

function toggleAccion(modulo: string, accion: string) {
  if (matrizPermisos.value[modulo]?.has(accion)) {
    matrizPermisos.value[modulo]?.delete(accion);
  } else {
    matrizPermisos.value[modulo]?.add(accion);
  }
}

function isRowAllChecked(modulo: string): boolean {
  const current = matrizPermisos.value[modulo]?.size || 0;
  return current === ACCIONES.length;
}

function isRowIndeterminate(modulo: string): boolean {
  const current = matrizPermisos.value[modulo]?.size || 0;
  return current > 0 && current < ACCIONES.length;
}

function toggleRowAll(modulo: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (!matrizPermisos.value[modulo]) return;
  if (checked) {
    ACCIONES.forEach((a) => matrizPermisos.value[modulo]!.add(a));
  } else {
    matrizPermisos.value[modulo]!.clear();
  }
}

// ─── Submit ───────────────────────────────────────────────────────────────────
const onSubmit = handleSubmit((values) => {
  const permisosMapped: PermisoModulo[] = [];
  
  for (const [modulo, setAcciones] of Object.entries(matrizPermisos.value)) {
    if (setAcciones.size > 0) {
      permisosMapped.push({
        modulo,
        acciones: Array.from(setAcciones),
      });
    }
  }

  emit('submit', {
    ...values,
    permisos: permisosMapped,
  } as CrearRolRequest);
});
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-white rounded-xl shadow-2xl border border-border w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-50 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px]">{{ isEditing ? 'edit' : 'add_moderator' }}</span>
          </div>
          <div>
            <h3 class="text-base font-bold text-text-main">
              {{ isEditing ? 'Editar Rol y Permisos' : 'Configurar Nuevo Rol' }}
            </h3>
            <p class="text-xs text-text-muted">
              Configure la matriz de acceso RBAC granular.
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

      <!-- Form Body (scrollable) -->
      <form class="flex-1 overflow-y-auto" @submit.prevent="onSubmit">
        <div class="p-6 space-y-6">
          
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="rol-nombre" class="block text-xs font-semibold text-text-main mb-1">
                Nombre del Rol <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">shield</span>
                <input
                  id="rol-nombre"
                  v-model="nombre"
                  type="text"
                  placeholder="Ej. Gerente de Operaciones"
                  class="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  :class="errors.nombre ? 'border-red-500' : 'border-border'"
                />
              </div>
              <span v-if="errors.nombre" class="text-[11px] text-red-600 mt-1 block">{{ errors.nombre }}</span>
            </div>

            <div>
              <label for="rol-codigo" class="block text-xs font-semibold text-text-main mb-1">
                Código Interno <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted pointer-events-none">code</span>
                <input
                  id="rol-codigo"
                  v-model="codigo"
                  type="text"
                  placeholder="Ej. GERENTE_OPERACIONES"
                  class="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all uppercase"
                  :class="errors.codigo ? 'border-red-500' : 'border-border'"
                  :disabled="isEditing"
                />
              </div>
              <span v-if="errors.codigo" class="text-[11px] text-red-600 mt-1 block">{{ errors.codigo }}</span>
            </div>
          </div>

          <div>
            <label for="rol-desc" class="block text-xs font-semibold text-text-main mb-1">
              Descripción
            </label>
            <input
              id="rol-desc"
              v-model="descripcion"
              type="text"
              placeholder="Ej. Acceso completo a los módulos de ventas e inventario"
              class="w-full px-3 py-2 text-sm border rounded-lg bg-surface-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all border-border"
            />
            <span v-if="errors.descripcion" class="text-[11px] text-red-600 mt-1 block">{{ errors.descripcion }}</span>
          </div>

          <!-- Matriz RBAC -->
          <div class="border border-border rounded-xl overflow-hidden shadow-sm">
            <div class="bg-surface-50 px-4 py-3 border-b border-border flex items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-text-main">Matriz de Permisos (RBAC)</h4>
                <p class="text-[11px] text-text-muted mt-0.5">Defina qué acciones puede realizar este rol en cada módulo del sistema.</p>
              </div>
              <span class="material-symbols-outlined text-[24px] text-primary opacity-20">admin_panel_settings</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-text-main">
                <thead class="bg-surface border-b border-border text-[10px] uppercase font-bold text-text-muted tracking-wider">
                  <tr>
                    <th class="px-4 py-2 w-1/3">Módulo de Sistema</th>
                    <th class="px-3 py-2 text-center w-12 border-x border-border/50">TODO</th>
                    <th v-for="accion in ACCIONES" :key="accion" class="px-3 py-2 text-center border-l border-border/20">
                      {{ accion }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-100">
                  <tr v-for="modulo in MODULOS" :key="modulo" class="hover:bg-surface-50 transition-colors">
                    <!-- Nombre Módulo -->
                    <td class="px-4 py-2.5 font-medium text-xs">{{ modulo }}</td>
                    
                    <!-- TODO Checkbox -->
                    <td class="px-3 py-2.5 text-center border-x border-border/50 bg-surface-50/50">
                      <input
                        type="checkbox"
                        class="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                        :checked="isRowAllChecked(modulo)"
                        :indeterminate="isRowIndeterminate(modulo)"
                        @change="toggleRowAll(modulo, $event)"
                      />
                    </td>
                    
                    <!-- Acciones Checkboxes -->
                    <td v-for="accion in ACCIONES" :key="accion" class="px-3 py-2.5 text-center border-l border-border/20">
                      <label class="flex items-center justify-center cursor-pointer w-full h-full">
                        <input
                          type="checkbox"
                          class="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                          :checked="isAccionChecked(modulo, accion)"
                          @change="toggleAccion(modulo, accion)"
                        />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="px-6 py-4 border-t border-border flex items-center justify-end space-x-3 bg-surface-50 sticky bottom-0 shrink-0">
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
            class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span v-if="isPending" class="material-symbols-outlined text-[18px] animate-spin">sync</span>
            <span v-else class="material-symbols-outlined text-[18px]">save</span>
            {{ isEditing ? 'Actualizar Rol' : 'Guardar Rol' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>
