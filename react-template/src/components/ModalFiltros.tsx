import React from 'react';
import { EmpresaEstado } from '../types';

interface ModalFiltrosProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSector: string;
  onChangeSector: (sector: string) => void;
  selectedEstado: string;
  onChangeEstado: (estado: string) => void;
  onReset: () => void;
}

export const ModalFiltros: React.FC<ModalFiltrosProps> = ({
  isOpen,
  onClose,
  selectedSector,
  onChangeSector,
  selectedEstado,
  onChangeEstado,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-12 left-64 w-80 bg-white border border-[#E2E8F0] rounded-lg shadow-xl p-4 z-40 animate-in fade-in slide-in-from-top-1">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h4 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-blue-600">filter_alt</span>
          Filtros de Empresas
        </h4>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      <div className="py-3 space-y-3">
        {/* Sector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Sector Comercial
          </label>
          <select
            value={selectedSector}
            onChange={(e) => onChangeSector(e.target.value)}
            className="w-full h-[32px] px-2.5 text-[12px] border border-slate-300 rounded focus:border-[#004ac6] outline-none bg-white text-slate-800"
          >
            <option value="TODOS">Todos los sectores</option>
            <option value="Transporte">Transporte</option>
            <option value="Retail">Retail</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Farmacéutico">Farmacéutico</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Manufactura">Manufactura</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Estado de Empresa
          </label>
          <select
            value={selectedEstado}
            onChange={(e) => onChangeEstado(e.target.value)}
            className="w-full h-[32px] px-2.5 text-[12px] border border-slate-300 rounded focus:border-[#004ac6] outline-none bg-white text-slate-800"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Solo ACTIVO</option>
            <option value="SUSPENDIDO">Solo SUSPENDIDO</option>
            <option value="BAJA">Solo BAJA</option>
          </select>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={onReset}
          className="text-[12px] text-slate-500 hover:text-slate-800 font-medium underline"
        >
          Limpiar filtros
        </button>
        <button
          onClick={onClose}
          className="h-[28px] px-3 bg-[#004ac6] text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition-colors"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};
