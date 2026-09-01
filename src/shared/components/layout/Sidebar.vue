<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/features/auth/store/auth.store';

const route = useRoute();
const authStore = useAuthStore();

const navItems = ref([
  { id: 'dashboard', label: 'Dashboard Ejecutivo', icon: 'dashboard', route: '/dashboard', allowedRoles: ['SUPER_ADMIN', 'BODEGA_OPERATOR', 'VENTAS_OPERATOR'] },
  { id: 'iam', label: 'Identidad y Accesos (IAM)', icon: 'shield_person', route: '/iam', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'tenant-branches', label: 'Gestión de Empresas', icon: 'domain', route: '/empresas', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'sales', label: 'Órdenes y Ventas', icon: 'receipt_long', route: '#', allowedRoles: ['SUPER_ADMIN', 'VENTAS_OPERATOR'] },
  { id: 'inventory', label: 'Auditoría y Tomas Físicas', icon: 'inventory_2', route: '/inventario', allowedRoles: ['SUPER_ADMIN', 'BODEGA_OPERATOR'] },
  { id: 'billing', label: 'Facturación Fiscal', icon: 'request_quote', route: '#', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'pos', label: 'Puntos de Venta (POS)', icon: 'point_of_sale', route: '#', allowedRoles: ['SUPER_ADMIN', 'VENTAS_OPERATOR'] }
]);

const logout = async () => {
  await authStore.logout();
};

const currentTab = computed(() => {
  if (route.path.startsWith('/empresas')) return 'tenant-branches';
  if (route.path.startsWith('/dashboard')) return 'dashboard';
  return '';
});
</script>

<template>
  <aside class="fixed left-0 top-0 bottom-0 w-65 bg-text-main border-r border-[#1E293B] flex flex-col z-30 shadow-xl overflow-hidden font-sans">
    
    <!-- Branding Header -->
    <div class="h-16 flex items-center gap-3 px-5 border-b border-[#1E293B] bg-text-main/90 backdrop-blur shrink-0 cursor-pointer hover:bg-[#1E293B]/50 transition-colors group">
      <div class="h-9 w-9 flex items-center justify-center rounded-md bg-white/10 border border-slate-700/50 shadow-sm transition-transform group-hover:scale-105">
        <span class="material-symbols-outlined text-white text-[20px]">layers</span>
      </div>
      <div>
        <h1 class="text-[16px] font-bold text-white tracking-tight leading-tight flex items-center gap-1.5">
          SITFAI ERP
        </h1>
        <p class="text-[11px] text-slate-400 font-medium">Management Suite</p>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 overflow-y-auto px-2 space-y-1 py-4">
      <ul class="space-y-1">
        <template v-for="item in navItems" :key="item.id">
          <li v-if="item.allowedRoles.some(role => authStore.hasRole(role))">
            <router-link
              :to="item.route"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 text-left"
              :class="[
                currentTab === item.id 
                  ? 'bg-[#1E293B] text-white border-l-[3px] border-primary shadow-sm font-semibold pl-3' 
                  : 'text-slate-400 hover:bg-[#1E293B]/70 hover:text-slate-100'
              ]"
            >
              <span 
                class="material-symbols-outlined text-[20px]"
                :class="currentTab === item.id ? 'text-blue-400' : 'text-slate-400'"
                :style="currentTab === item.id ? { fontVariationSettings: `'FILL' 1` } : {}"
              >
                {{ item.icon }}
              </span>
              <span class="truncate">{{ item.label }}</span>
            </router-link>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Footer Navigation -->
    <div class="mt-auto pt-3 border-t border-slate-800 px-2 space-y-1 mb-4">
      <button class="w-full flex items-center gap-3 px-3.5 py-2 rounded-md text-[13px] font-medium transition-colors text-slate-400 hover:bg-[#1E293B]/70 hover:text-slate-100 cursor-pointer">
        <span class="material-symbols-outlined text-[20px]">settings</span>
        <span>Configuración</span>
      </button>

      <button
        @click="logout"
        class="w-full flex items-center gap-3 px-3.5 py-2 rounded-md text-[13px] font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left cursor-pointer"
      >
        <span class="material-symbols-outlined text-[20px]">logout</span>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>