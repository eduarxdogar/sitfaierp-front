import React, { useState } from 'react';
import { ItemConteo, AuditoriaTomaFisica, Empresa } from '../types';

interface InventoryAuditViewProps {
  items: ItemConteo[];
  tomasFisicas: AuditoriaTomaFisica[];
  empresas: Empresa[];
  onUpdateItemConteo: (itemId: string, conteo1: number, conteo2: number) => void;
  onAjustarDiscrepancia: (itemId: string) => void;
}

export const InventoryAuditView: React.FC<InventoryAuditViewProps> = ({
  items: initialItems,
  tomasFisicas,
  empresas,
  onUpdateItemConteo,
  onAjustarDiscrepancia
}) => {
  const [items, setItems] = useState<ItemConteo[]>(initialItems);
  const [selectedToma, setSelectedToma] = useState<string>(tomasFisicas[0]?.id || '');
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('TODAS');
  const [filterDiscrepanciaOnly, setFilterDiscrepanciaOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'conteos' | 'auditorias'>('conteos');

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.sku.toLowerCase().includes(barcodeSearch.toLowerCase()) ||
      item.codigoBarra.includes(barcodeSearch) ||
      item.descripcion.toLowerCase().includes(barcodeSearch.toLowerCase()) ||
      item.ubicacionPasillo.toLowerCase().includes(barcodeSearch.toLowerCase());

    const matchesCategory = filterCategory === 'TODAS' || item.categoria === filterCategory;
    const matchesDiscrepancia = !filterDiscrepanciaOnly || item.diferencia !== 0;

    return matchesSearch && matchesCategory && matchesDiscrepancia;
  });

  const handleConteoChange = (itemId: string, field: 'conteo1' | 'conteo2', value: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const c1 = field === 'conteo1' ? value : item.conteo1 ?? value;
        const c2 = field === 'conteo2' ? value : item.conteo2 ?? value;
        const cFinal = c1;
        const diff = cFinal - item.stockTeorico;
        const estado = diff === 0 ? 'Verificado' : 'Discrepancia';

        onUpdateItemConteo(itemId, c1, c2);
        return {
          ...item,
          [field]: value,
          conteoFinal: cFinal,
          diferencia: diff,
          estado
        };
      }
      return item;
    }));
  };

  const handleAjustar = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        onAjustarDiscrepancia(itemId);
        return {
          ...item,
          stockTeorico: item.conteoFinal ?? item.stockTeorico,
          diferencia: 0,
          estado: 'Ajustado'
        };
      }
      return item;
    }));
  };

  const currentTomaObj = tomasFisicas.find(t => t.id === selectedToma) || tomasFisicas[0];

  return (
    <div className="max-w-[1600px] mx-auto w-full pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[28px]">fact_check</span>
            Toma Física & Auditoría de Inventarios
          </h2>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            SITFAI - Exactitud · Control · Confianza. Registro de conteos ciegos, dobles y conciliación de stock.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('conteos')}
            className={`px-3 py-1 text-[12px] font-semibold rounded-md transition-all ${
              activeTab === 'conteos'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hoja de Conteo en Vivo
          </button>
          <button
            onClick={() => setActiveTab('auditorias')}
            className={`px-3 py-1 text-[12px] font-semibold rounded-md transition-all ${
              activeTab === 'auditorias'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Auditorías Programadas
          </button>
        </div>
      </div>

      {activeTab === 'conteos' ? (
        <>
          {/* Active Audit Session Bar */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded">
                <span className="material-symbols-outlined text-[24px]">warehouse</span>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block">Sesión de Auditoría Activa</label>
                <select
                  value={selectedToma}
                  onChange={(e) => setSelectedToma(e.target.value)}
                  className="text-[14px] font-bold text-slate-800 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
                >
                  {tomasFisicas.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.codigo} - {t.empresaNombre} ({t.sucursalNombre})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[12px]">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Auditor Responsable</span>
                <span className="font-semibold text-slate-700">{currentTomaObj?.auditorLider}</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Exactitud Actual</span>
                <span className="font-bold text-emerald-600 text-[14px]">{currentTomaObj?.exactitud}%</span>
              </div>
            </div>
          </div>

          {/* Counts Table Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
            {/* Actions Bar */}
            <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-slate-400 text-[18px]">
                    barcode_scanner
                  </span>
                  <input
                    value={barcodeSearch}
                    onChange={(e) => setBarcodeSearch(e.target.value)}
                    placeholder="Escanear código de barra, SKU o descripción..."
                    className="h-[32px] pl-8 pr-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] outline-none w-full bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-[12px] text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filterDiscrepanciaOnly}
                    onChange={(e) => setFilterDiscrepanciaOnly(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Solo Discrepancias</span>
                </label>

                <button
                  onClick={() => alert('Generando informe de toma física oficial SITFAI en PDF...')}
                  className="h-[32px] px-3 bg-[#004ac6] text-white rounded text-[11px] font-semibold hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Cierre de Conteo
                </button>
              </div>
            </div>

            {/* Counts Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3 font-mono">SKU / CÓDIGO</th>
                    <th className="py-2.5 px-3">DESCRIPCIÓN DEL ARTÍCULO</th>
                    <th className="py-2.5 px-3">UBICACIÓN</th>
                    <th className="py-2.5 px-3 text-center">TEÓRICO</th>
                    <th className="py-2.5 px-3 text-center">1ER CONTEO</th>
                    <th className="py-2.5 px-3 text-center">2DO CONTEO</th>
                    <th className="py-2.5 px-3 text-center">DIF.</th>
                    <th className="py-2.5 px-3 text-center">ESTADO</th>
                    <th className="py-2.5 px-3 text-right">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredItems.map((item) => {
                    const hasDiff = item.diferencia !== 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3">
                          <span className="font-bold text-slate-800 block">{item.sku}</span>
                          <span className="text-[10px] text-slate-400">{item.codigoBarra}</span>
                        </td>
                        <td className="py-2 px-3 font-sans">
                          <span className="font-medium text-slate-800">{item.descripcion}</span>
                          <span className="block text-[10px] text-slate-400">{item.categoria}</span>
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-600 text-[11px]">
                          {item.ubicacionPasillo}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-700">
                          {item.stockTeorico}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            value={item.conteo1 ?? ''}
                            onChange={(e) => handleConteoChange(item.id, 'conteo1', parseInt(e.target.value) || 0)}
                            className="w-16 h-7 text-center border border-slate-300 rounded font-mono text-[12px] focus:border-blue-600 outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            value={item.conteo2 ?? ''}
                            onChange={(e) => handleConteoChange(item.id, 'conteo2', parseInt(e.target.value) || 0)}
                            className="w-16 h-7 text-center border border-slate-300 rounded font-mono text-[12px] focus:border-blue-600 outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          <span className={`${
                            item.diferencia === 0 ? 'text-emerald-600' :
                            item.diferencia > 0 ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {item.diferencia > 0 ? `+${item.diferencia}` : item.diferencia}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-sans">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.estado === 'Verificado' ? 'bg-emerald-100 text-emerald-700' :
                            item.estado === 'Ajustado' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.estado}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-sans">
                          {hasDiff ? (
                            <button
                              onClick={() => handleAjustar(item.id)}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-semibold transition-colors"
                            >
                              Ajustar
                            </button>
                          ) : (
                            <span className="text-emerald-600 text-[11px] font-medium flex items-center justify-end gap-1">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              Conforme
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Auditorias Programadas View */
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden p-6">
          <h3 className="text-[16px] font-bold text-slate-800 mb-4">Cronograma Anual de Auditorías de Inventario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tomasFisicas.map(tf => (
              <div key={tf.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[12px] font-mono font-bold text-blue-600">{tf.codigo}</span>
                    <h4 className="text-[14px] font-bold text-slate-800">{tf.empresaNombre}</h4>
                    <p className="text-[11px] text-slate-500">{tf.sucursalNombre}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">{tf.tipo}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center text-[12px] text-slate-600">
                  <span>Fecha: {tf.fechaProgramada}</span>
                  <span className="font-semibold text-slate-800">{tf.itemsContados}/{tf.totalItems} ítems</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
