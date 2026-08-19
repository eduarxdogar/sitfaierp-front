import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [toleranceThreshold, setToleranceThreshold] = useState('0.5');
  const [currency, setCurrency] = useState('USD');
  const [autoReconcile, setAutoReconcile] = useState(true);
  const [blindCountRequired, setBlindCountRequired] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full pb-10 space-y-6">
      <div>
        <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[26px]">settings</span>
          Configuración General del ERP
        </h2>
        <p className="text-[12px] text-[#64748B] mt-0.5">
          Parámetros de auditoría de inventario, tolerancias de merma y reglas multi-tenant.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Configuración guardada exitosamente en el sistema.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm divide-y divide-slate-100">
        {/* Parametros de Auditoria */}
        <div className="p-6 space-y-4">
          <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">fact_check</span>
            Reglas de Toma Física (SITFAI)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Tolerancia Máxima de Discrepancia (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={toleranceThreshold}
                onChange={(e) => setToleranceThreshold(e.target.value)}
                className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-blue-600 outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Discrepancias superiores requerirán aprobación de SUPER_ADMIN.
              </span>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Moneda Base de Valorización
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-blue-600 outline-none"
              >
                <option value="USD">Dólares Americanos (USD)</option>
                <option value="VES">Bolívares Digitales (VES)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={blindCountRequired}
                onChange={(e) => setBlindCountRequired(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span className="font-medium">Exigir Conteo Ciego (Ocultar Stock Teórico a los Operadores de Campo)</span>
            </label>

            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReconcile}
                onChange={(e) => setAutoReconcile(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span className="font-medium">Auto-conciliación inmediata cuando 1er y 2do conteo coinciden al 100%</span>
            </label>
          </div>
        </div>

        {/* Multi-Tenant Security */}
        <div className="p-6 space-y-4">
          <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">security</span>
            Aislamiento Multi-Tenant
          </h3>
          <p className="text-[12px] text-slate-500">
            Cada empresa opera en partición lógica aislada. Las sucursales solo tienen visibilidad de su almacén asignado.
          </p>
        </div>

        <div className="p-4 bg-slate-50 flex justify-end">
          <button
            type="submit"
            className="h-[34px] px-5 bg-[#004ac6] text-white rounded font-medium text-[12px] hover:bg-blue-700 transition-colors shadow-sm"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};
