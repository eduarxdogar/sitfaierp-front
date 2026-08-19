import React from 'react';
import { OrdenVenta } from '../types';

interface SalesViewProps {
  ventas: OrdenVenta[];
}

export const SalesView: React.FC<SalesViewProps> = ({ ventas }) => {
  return (
    <div className="max-w-[1600px] mx-auto w-full pb-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[26px]">payments</span>
            Ventas & Órdenes Comerciales
          </h2>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Registro de pedidos por empresa y sucursal vinculado al stock en tiempo real.
          </p>
        </div>

        <button
          onClick={() => alert('Registrar nueva orden')}
          className="h-[32px] px-3.5 bg-[#004ac6] text-white rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
          Nueva Orden
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">N° ORDEN</th>
                <th className="py-2.5 px-3">EMPRESA</th>
                <th className="py-2.5 px-3">SUCURSAL</th>
                <th className="py-2.5 px-3">CLIENTE</th>
                <th className="py-2.5 px-3">FECHA</th>
                <th className="py-2.5 px-3 text-right">TOTAL</th>
                <th className="py-2.5 px-3 text-center">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {ventas.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-blue-600">{v.numero}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">{v.empresaNombre}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">{v.sucursalNombre}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-medium text-slate-800">{v.cliente}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{v.rifCliente}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">{v.fecha}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                    ${v.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      v.estado === 'Completada' ? 'bg-emerald-100 text-emerald-700' :
                      v.estado === 'Facturada' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {v.estado}
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
