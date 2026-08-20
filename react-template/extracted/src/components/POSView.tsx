import React from 'react';
import { TerminalPOS } from '../types';

interface POSViewProps {
  posTerminals: TerminalPOS[];
}

export const POSView: React.FC<POSViewProps> = ({ posTerminals }) => {
  return (
    <div className="max-w-[1600px] mx-auto w-full pb-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[26px]">point_of_sale</span>
            Puntos de Venta (POS) & Terminales de Caja
          </h2>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Supervisión de cajas registradoras por sucursal, turnos activos y arqueos diarios.
          </p>
        </div>

        <button
          onClick={() => alert('Registrar nueva caja')}
          className="h-[32px] px-3.5 bg-[#004ac6] text-white rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Abrir Terminal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posTerminals.map((pos) => (
          <div key={pos.id} className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-2xs">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {pos.codigoCaja}
                </span>
                <h4 className="text-[14px] font-bold text-slate-800 mt-1">{pos.sucursalNombre}</h4>
                <p className="text-[11px] text-slate-400">{pos.empresaNombre}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                pos.estadoCaja === 'Abierta' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {pos.estadoCaja}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[12px]">
              <div className="flex justify-between text-slate-600">
                <span>Cajero Actual:</span>
                <span className="font-semibold text-slate-800">{pos.cajeroActual}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ventas del Día:</span>
                <span className="font-bold text-emerald-600 font-mono">${pos.totalVentasDia.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Última Transacción:</span>
                <span>{pos.ultimaTransaccion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
