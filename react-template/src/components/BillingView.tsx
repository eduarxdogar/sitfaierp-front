import React from 'react';
import { Factura } from '../types';

interface BillingViewProps {
  facturas: Factura[];
}

export const BillingView: React.FC<BillingViewProps> = ({ facturas }) => {
  return (
    <div className="max-w-[1600px] mx-auto w-full pb-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[26px]">receipt_long</span>
            Facturación & Control Fiscal
          </h2>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Emisión de facturas fiscales, números de control SENIAT y retenciones.
          </p>
        </div>

        <button
          onClick={() => alert('Generar nueva factura')}
          className="h-[32px] px-3.5 bg-[#004ac6] text-white rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">receipt</span>
          Nueva Factura Fiscal
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">FACTURA N°</th>
                <th className="py-2.5 px-3">N° CONTROL</th>
                <th className="py-2.5 px-3">EMPRESA EMISORA</th>
                <th className="py-2.5 px-3">CLIENTE</th>
                <th className="py-2.5 px-3 text-right">BASE IMPONIBLE</th>
                <th className="py-2.5 px-3 text-right">IVA (16%)</th>
                <th className="py-2.5 px-3 text-right">TOTAL USD</th>
                <th className="py-2.5 px-3 text-center">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {facturas.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-blue-600">{f.numeroFactura}</td>
                  <td className="py-2.5 px-3 text-slate-500">{f.numeroControl}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">{f.empresaNombre}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-medium text-slate-800">{f.cliente}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{f.rifCliente}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right">${f.baseImponible.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">${f.iva.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">${f.total.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      f.estado === 'Pagada' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {f.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
