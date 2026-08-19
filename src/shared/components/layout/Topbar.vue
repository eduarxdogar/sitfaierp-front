<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/features/auth/store/auth.store';

const authStore = useAuthStore();
const showProfileMenu = ref(false);
const AVATAR_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBP3b_DX0OxlZHk5bMt6htIJ97zMmzZrmLJBCzfXSHzugHsIIypblm5P13vVhjaqeGjIUvitJb-jOtsSbP8CqI5p4sQh3IGV18uSI9mnLk6Z6Jzz6rltyxyz1GsKQ6wHu21expCOSAzKlesee00XkI2KyNG_uEXLI5qLEFa1ZTYuvrqqLJvg0jH1SUMLWTtbYMt2s4XhIZfzj8qeH8o4PkzxA47IdXQbY5YXqCXh51beUibnZXZVyEX";

const unreadCount = 2;
</script>

<template>
  <header class="fixed top-0 right-0 w-[calc(100%-260px)] h-12 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
    <!-- Title -->
    <div class="flex items-center gap-3">
      <span class="text-[18px] font-extrabold text-[#0b1c30] tracking-tight">
        SITFAI ERP
      </span>
      <span class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
        v2.6 Multi-Tenant
      </span>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-2">
      <!-- Search -->
      <button class="text-[#434655] hover:bg-[#f1f5f9] hover:text-[#004ac6] p-1.5 rounded transition-colors cursor-pointer" title="Buscar">
        <span class="material-symbols-outlined text-[20px]">search</span>
      </button>

      <!-- Notifications -->
      <button class="relative text-[#434655] hover:bg-[#f1f5f9] hover:text-[#004ac6] p-1.5 rounded transition-colors cursor-pointer">
        <span class="material-symbols-outlined text-[20px]">notifications</span>
        <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
      </button>

      <!-- Help -->
      <button class="text-[#434655] hover:bg-[#f1f5f9] hover:text-[#004ac6] p-1.5 rounded transition-colors cursor-pointer">
        <span class="material-symbols-outlined text-[20px]">help_outline</span>
      </button>

      <div class="h-5 w-px bg-[#E2E8F0] mx-2"></div>

      <!-- User Profile -->
      <div class="relative">
        <button
          @click="showProfileMenu = !showProfileMenu"
          class="flex items-center gap-2 cursor-pointer hover:bg-[#f1f5f9] p-1 rounded-md transition-colors"
        >
          <span class="text-[11px] font-semibold text-[#475569] bg-[#E2E8F0] px-2 py-0.5 rounded-full tracking-wide">
            {{ authStore.userRoles?.[0] || 'SUPER_ADMIN' }}
          </span>
          <img
            alt="User Profile"
            class="w-7 h-7 rounded-full object-cover border border-slate-300"
            :src="AVATAR_URL"
            referrerpolicy="no-referrer"
          />
        </button>

        <!-- Profile Dropdown -->
        <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div class="px-4 py-2 border-b border-slate-100">
            <p class="text-[13px] font-semibold text-slate-900">{{ authStore.currentUser?.fullName || 'Super Administrador' }}</p>
            <p class="text-[11px] text-slate-500 truncate">{{ authStore.currentUser?.email || 'sitfaierp@gmail.com' }}</p>
          </div>
          <div class="py-1">
            <div class="px-4 py-1.5 text-[11px] text-slate-500 uppercase font-semibold">
              Módulo de Seguridad
            </div>
            <button @click="showProfileMenu = false" class="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-[16px] text-slate-500">verified_user</span>
              Permisos de Auditoría Global
            </button>
            <button @click="showProfileMenu = false" class="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-[16px] text-slate-500">database</span>
              Respaldos y Logs de Auditoría
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>