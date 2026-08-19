import React from 'react';
import { Empresa, AuditoriaTomaFisica } from '../types';

interface DashboardViewProps {
  empresas: Empresa[];
  tomasFisicas: AuditoriaTomaFisica[];
  onNavigateTo: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  empresas,
  tomasFisicas,
  onNavigateTo
}) => {
  const totalEmpresas = empresas.length;
  const totalSucursales = empresas.reduce((acc, curr) => acc + curr.sucursales.length, 0);
  const activasEmpresas = empresas.filter(e => e.estado === 'ACTIVO').length;
  const tomasEnProgreso = tomasFisicas.filter(t => t.estado === 'En Progreso').length;

  return (
    <div className="max-w-[1600px] mx-auto w-full pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight">
            Dashboard Ejecutivo SITFAI
          </h2>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Monitoreo en tiempo real de empresas, sucursales y precisión de tomas físicas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTo('inventory')}
            className="h-[32px] px-3 bg-[#004ac6] text-white rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
            Nueva Toma Física
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-2xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Empresas Registradas</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <span className="material-symbols-outlined text-[18px]">domain</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-extrabold text-[#0b1c30]">{totalEmpresas}</span>
            <span className="text-[11px] font-semibold text-emerald-600">({activasEmpresas} activas)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-tenant centralizado</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-2xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sucursales Operativas</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded">
              <span className="material-symbols-outlined text-[18px]">store</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-extrabold text-[#0b1c30]">{totalSucursales}</span>
            <span className="text-[11px] font-semibold text-emerald-600">En 6 estados</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Puntos de venta & almacenes</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-2xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Exactitud de Inventario</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-extrabold text-[#004ac6]">99.4%</span>
            <span className="text-[11px] font-semibold text-indigo-600">IRA Meta</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Exactitud · Control · Confianza</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-2xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tomas Físicas en Curso</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-extrabold text-[#D97706]">{tomasEnProgreso}</span>
            <span className="text-[11px] font-semibold text-slate-500">de {tomasFisicas.length} totales</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Conteos cíclicos en vivo</p>
        </div>
      </div>

      {/* Main Row: Tomas Físicas Recientes & Sectores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tomas Físicas Table */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-blue-600">inventory</span>
              Tomas Físicas y Auditorías Recientes
            </h3>
            <button
              onClick={() => onNavigateTo('inventory')}
              className="text-[11px] text-blue-600 font-semibold hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase">
                  <th className="py-2 px-3">CÓDIGO</th>
                  <th className="py-2 px-3">EMPRESA / SUCURSAL</th>
                  <th className="py-2 px-3">TIPO</th>
                  <th className="py-2 px-3">AVANCE</th>
                  <th className="py-2 px-3">EXACTITUD</th>
                  <th className="py-2 px-3">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {tomasFisicas.map((tf) => (
                  <tr key={tf.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-blue-600 font-bold">{tf.codigo}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="font-semibold text-slate-800 block">{tf.empresaNombre}</span>
                      <span className="text-[11px] text-slate-400">{tf.sucursalNombre}</span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">{tf.tipo}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${(tf.itemsContados / tf.totalItems) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {tf.itemsContados}/{tf.totalItems}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-700">{tf.exactitud}%</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tf.estado === 'Completado' ? 'bg-emerald-100 text-emerald-700' :
                        tf.estado === 'En Progreso' ? 'bg-blue-100 text-blue-700' :
                        tf.estado === 'Conciliando' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tf.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribution Card & Quick Links */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">pie_chart</span>
              Distribución por Sector
            </h3>
            
            <div className="space-y-2.5 text-[12px]">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Transporte & Logística</span>
                  <span className="font-semibold">33%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-1/3"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Retail & Comercio</span>
                  <span className="font-semibold">25%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-1/4"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Alimentos & Bebidas</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-1/5"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Farmacéutico</span>
                  <span className="font-semibold">22%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[22%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] text-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-blue-400 text-[20px]">verified</span>
              <span className="text-[13px] font-bold">Lema SITFAI</span>
            </div>
            <p className="text-[12px] text-slate-300 font-medium">
              "Exactitud · Control · Confianza"
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Garantizando la integridad contable y operativa de las existencias físicas en todas sus sucursales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
