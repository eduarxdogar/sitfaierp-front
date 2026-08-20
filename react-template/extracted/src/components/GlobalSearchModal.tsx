import React, { useState } from 'react';
import { Empresa, AuditoriaTomaFisica, AppTab } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresas: Empresa[];
  tomasFisicas: AuditoriaTomaFisica[];
  onNavigateTo: (tab: AppTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  empresas,
  tomasFisicas,
  onNavigateTo
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedEmpresas = empresas.filter(e => 
    e.nombre.toLowerCase().includes(query.toLowerCase()) ||
    e.rif.toLowerCase().includes(query.toLowerCase()) ||
    e.codigo.toLowerCase().includes(query.toLowerCase())
  );

  const matchedTomas = tomasFisicas.filter(t =>
    t.codigo.toLowerCase().includes(query.toLowerCase()) ||
    t.empresaNombre.toLowerCase().includes(query.toLowerCase()) ||
    t.sucursalNombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50">
          <span className="material-symbols-outlined text-slate-400 text-[22px]">search</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar empresa, RIF, sucursal, toma física o SKU..."
            className="w-full bg-transparent text-[14px] text-slate-800 placeholder:text-slate-400 outline-none"
          />
          <button
            onClick={onClose}
            className="text-[11px] font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 hover:bg-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-[13px]">
          {/* Quick Shortcuts */}
          {!query && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Accesos Rápidos</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onNavigateTo('tenant-branches'); onClose(); }}
                  className="p-2 text-left rounded-lg border border-slate-100 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">domain</span>
                  <span className="font-medium text-slate-700">Gestión de Empresas</span>
                </button>
                <button
                  onClick={() => { onNavigateTo('inventory'); onClose(); }}
                  className="p-2 text-left rounded-lg border border-slate-100 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-indigo-600 text-[18px]">fact_check</span>
                  <span className="font-medium text-slate-700">Toma Física en Vivo</span>
                </button>
              </div>
            </div>
          )}

          {/* Empresas Match */}
          {matchedEmpresas.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Empresas Encontradas</p>
              <div className="space-y-1">
                {matchedEmpresas.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => { onNavigateTo('tenant-branches'); onClose(); }}
                    className="p-2 rounded hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{emp.nombre}</span>
                      <span className="text-[11px] text-slate-400 block font-mono">{emp.codigo} • {emp.rif}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {emp.sucursales.length} sucursales
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tomas Fisicas Match */}
          {matchedTomas.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tomas Físicas & Auditorías</p>
              <div className="space-y-1">
                {matchedTomas.map(tf => (
                  <div
                    key={tf.id}
                    onClick={() => { onNavigateTo('inventory'); onClose(); }}
                    className="p-2 rounded hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div>
                      <span className="font-bold text-blue-600 font-mono">{tf.codigo}</span>
                      <span className="text-slate-700 ml-2 font-medium">{tf.empresaNombre}</span>
                      <span className="text-[11px] text-slate-400 block">{tf.sucursalNombre}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {tf.exactitud}% Exactitud
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && matchedEmpresas.length === 0 && matchedTomas.length === 0 && (
            <p className="text-center py-6 text-slate-400 text-[13px]">
              No se encontraron resultados para "{query}".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
