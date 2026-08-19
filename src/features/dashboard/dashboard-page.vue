<script setup lang="ts">
import { ref } from 'vue';
import { INITIAL_TOMAS_FISICAS } from '@/shared/data/mockData';

const tomasFisicas = ref(INITIAL_TOMAS_FISICAS);
const tomasEnProgreso = tomasFisicas.value.filter(tf => tf.estado === 'En Progreso').length;

const getStatusClass = (estado: string) => {
  if (estado === 'Completado') return 'bg-emerald-100 text-emerald-700';
  if (estado === 'En Progreso') return 'bg-blue-100 text-blue-700';
  if (estado === 'Conciliando') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};
</script>

<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-[20px] font-extrabold text-[#0b1c30] tracking-tight">Dashboard General</h2>
        <p class="text-[12px] text-slate-500 font-medium mt-0.5">Métricas globales y estado de auditorías multi-tenant</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="bg-white border border-[#E2E8F0] text-slate-600 px-3 py-1.5 rounded text-[12px] font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">download</span>
          Exportar PDF
        </button>
        <button class="bg-[#004ac6] text-white px-3 py-1.5 rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">add</span>
          Nueva Toma Física
        </button>
      </div>
    </div>

    <!-- KPIs Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-sm hover:border-blue-300 transition-all">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Empresas Activas</span>
          <span class="p-1.5 bg-blue-50 text-blue-600 rounded">
            <span class="material-symbols-outlined text-[18px]">domain</span>
          </span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-[24px] font-extrabold text-[#004ac6]">14</span>
          <span class="text-[11px] font-semibold text-emerald-600 flex items-center">
            <span class="material-symbols-outlined text-[14px]">trending_up</span> +2 este mes
          </span>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">Suscripciones vigentes en el ERP</p>
      </div>

      <div class="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-sm hover:border-blue-300 transition-all">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Sucursales Auditadas</span>
          <span class="p-1.5 bg-emerald-50 text-emerald-600 rounded">
            <span class="material-symbols-outlined text-[18px]">storefront</span>
          </span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-[24px] font-extrabold text-[#004ac6]">42</span>
          <span class="text-[11px] font-semibold text-slate-500">de 58 totales</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">Cobertura de toma física anual</p>
      </div>

      <div class="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-sm hover:border-blue-300 transition-all">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Exactitud de Inventario</span>
          <span class="p-1.5 bg-indigo-50 text-indigo-600 rounded">
            <span class="material-symbols-outlined text-[18px]">fact_check</span>
          </span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-[24px] font-extrabold text-[#004ac6]">99.4%</span>
          <span class="text-[11px] font-semibold text-indigo-600">IRA Meta</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">Exactitud • Control • Confianza</p>
      </div>

      <div class="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-sm hover:border-blue-300 transition-all">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Tomas en Curso</span>
          <span class="p-1.5 bg-amber-50 text-amber-600 rounded">
            <span class="material-symbols-outlined text-[18px]">pending_actions</span>
          </span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-[24px] font-extrabold text-[#D97706]">{{ tomasEnProgreso }}</span>
          <span class="text-[11px] font-semibold text-slate-500">de {{ tomasFisicas.length }} totales</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">Conteos cíclicos en vivo</p>
      </div>
    </div>

    <!-- Main Row: Tomas Físicas Recientes -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
          <h3 class="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-blue-600">inventory</span>
            Tomas Físicas y Auditorías Recientes
          </h3>
          <button class="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer">Ver todas</button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-[12px]">
            <thead>
              <tr class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase">
                <th class="py-2 px-3">CÓDIGO</th>
                <th class="py-2 px-3">EMPRESA / SUCURSAL</th>
                <th class="py-2 px-3">TIPO</th>
                <th class="py-2 px-3">AVANCE</th>
                <th class="py-2 px-3">EXACTITUD</th>
                <th class="py-2 px-3">ESTADO</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono">
              <tr v-for="tf in tomasFisicas" :key="tf.id" class="hover:bg-slate-50 transition-colors">
                <td class="py-2.5 px-3 text-blue-600 font-bold">{{ tf.codigo }}</td>
                <td class="py-2.5 px-3 font-sans">
                  <span class="font-semibold text-slate-800 block">{{ tf.empresaNombre }}</span>
                  <span class="text-[11px] text-slate-400">{{ tf.sucursalNombre }}</span>
                </td>
                <td class="py-2.5 px-3 font-sans text-slate-600">{{ tf.tipo }}</td>
                <td class="py-2.5 px-3 font-sans">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-600" :style="{ width: `${(tf.itemsContados / tf.totalItems) * 100}%` }"></div>
                    </div>
                    <span class="text-[11px] text-slate-500">{{ tf.itemsContados }}/{{ tf.totalItems }}</span>
                  </div>
                </td>
                <td class="py-2.5 px-3 font-bold text-slate-700">{{ tf.exactitud }}%</td>
                <td class="py-2.5 px-3 font-sans">
                  <span :class="getStatusClass(tf.estado)" class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {{ tf.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-[#0F172A] text-white p-4 rounded-lg shadow-sm">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-blue-400 text-[20px]">verified</span>
            <span class="text-[13px] font-bold">Lema SITFAI</span>
          </div>
          <p class="text-[12px] text-slate-300 font-medium">"Exactitud • Control • Confianza"</p>
          <p class="text-[11px] text-slate-400 mt-1">Garantizando la integridad contable y operativa en todas las sucursales.</p>
        </div>
      </div>
    </div>
  </div>
</template>