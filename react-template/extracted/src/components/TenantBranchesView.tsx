import React, { useState, useMemo } from 'react';
import { Empresa, Sucursal } from '../types';
import { ModalNuevaEmpresa } from './ModalNuevaEmpresa';
import { ModalNuevaSucursal } from './ModalNuevaSucursal';
import { ModalEditarEmpresa } from './ModalEditarEmpresa';
import { ModalFiltros } from './ModalFiltros';

interface TenantBranchesViewProps {
  empresas: Empresa[];
  onAddEmpresa: (empresaData: Partial<Empresa>) => void;
  onUpdateEmpresa: (empresaId: string, updatedData: Partial<Empresa>) => void;
  onDeleteEmpresa: (empresaId: string) => void;
  onAddSucursal: (empresaId: string, sucursalData: Omit<Sucursal, 'id'>) => void;
  onToggleSucursal: (empresaId: string, sucursalId: string) => void;
}

export const TenantBranchesView: React.FC<TenantBranchesViewProps> = ({
  empresas,
  onAddEmpresa,
  onUpdateEmpresa,
  onDeleteEmpresa,
  onAddSucursal,
  onToggleSucursal
}) => {
  // State for expanded rows
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>(['emp-001']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('TODOS');
  const [selectedEstado, setSelectedEstado] = useState('TODOS');
  
  // Modals state
  const [isNuevaEmpresaOpen, setIsNuevaEmpresaOpen] = useState(false);
  const [isFiltrosOpen, setIsFiltrosOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [sucursalTargetEmpresa, setSucursalTargetEmpresa] = useState<Empresa | null>(null);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleRow = (empresaId: string) => {
    setExpandedRowIds(prev => 
      prev.includes(empresaId) 
        ? prev.filter(id => id !== empresaId) 
        : [...prev, empresaId]
    );
  };

  // Filtered companies
  const filteredEmpresas = useMemo(() => {
    return empresas.filter(emp => {
      const matchesSearch = 
        emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.rif.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.sector.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector = selectedSector === 'TODOS' || emp.sector === selectedSector;
      const matchesEstado = selectedEstado === 'TODOS' || emp.estado === selectedEstado;

      return matchesSearch && matchesSector && matchesEstado;
    });
  }, [empresas, searchTerm, selectedSector, selectedEstado]);

  // Paginated companies
  const totalPages = Math.max(1, Math.ceil(filteredEmpresas.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmpresas = filteredEmpresas.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['ID', 'Nombre', 'RIF/NIT', 'Sector', 'Estado', 'Sucursales', 'Teléfono', 'Email'];
    const rows = filteredEmpresas.map(e => [
      e.codigo,
      `"${e.nombre}"`,
      e.rif,
      e.sector,
      e.estado,
      e.sucursales.length,
      e.telefono || '',
      e.email || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sitfai_empresas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV exportado exitosamente.');
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 text-[13px]">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight">
            Gestión de Empresas
          </h2>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Administración centralizada de tenants y sucursales (POST /empresas).
          </p>
        </div>
        
        <button
          id="btn-nueva-empresa"
          onClick={() => setIsNuevaEmpresaOpen(true)}
          className="bg-[#004ac6] text-white text-[12px] font-semibold h-[32px] px-3.5 rounded flex items-center gap-2 hover:bg-[#2563eb] transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nueva Empresa
        </button>
      </div>

      {/* High Density Data Table Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-visible flex flex-col relative">
        {/* Table Actions Bar */}
        <div className="p-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 relative">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-slate-400 text-[18px]">
                search
              </span>
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-[32px] pl-8 pr-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none w-64 bg-white text-slate-800 placeholder:text-slate-400"
                placeholder="Buscar por nombre o RIF..."
                type="text"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFiltrosOpen(!isFiltrosOpen)}
                className={`h-[32px] px-2.5 bg-white border border-slate-300 rounded text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors text-[11px] font-semibold ${
                  (selectedSector !== 'TODOS' || selectedEstado !== 'TODOS') ? 'border-blue-500 text-blue-600 bg-blue-50/50' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span>Filtros</span>
                {(selectedSector !== 'TODOS' || selectedEstado !== 'TODOS') && (
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                )}
              </button>

              <ModalFiltros
                isOpen={isFiltrosOpen}
                onClose={() => setIsFiltrosOpen(false)}
                selectedSector={selectedSector}
                onChangeSector={(sec) => {
                  setSelectedSector(sec);
                  setCurrentPage(1);
                }}
                selectedEstado={selectedEstado}
                onChangeEstado={(est) => {
                  setSelectedEstado(est);
                  setCurrentPage(1);
                }}
                onReset={() => {
                  setSelectedSector('TODOS');
                  setSelectedEstado('TODOS');
                  setCurrentPage(1);
                  setIsFiltrosOpen(false);
                }}
              />
            </div>

            {(selectedSector !== 'TODOS' || selectedEstado !== 'TODOS' || searchTerm) && (
              <span className="text-[11px] text-slate-500 italic">
                {filteredEmpresas.length} resultados encontrados
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              title="Descargar tabla en formato CSV"
              className="h-[32px] px-2.5 bg-white border border-slate-300 rounded text-slate-700 flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors text-[11px] font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center"></th>
                <th className="py-2.5 px-3 w-24">ID</th>
                <th className="py-2.5 px-3">NOMBRE DE EMPRESA</th>
                <th className="py-2.5 px-3 w-36 font-mono">RIF/NIT</th>
                <th className="py-2.5 px-3 w-36">SECTOR</th>
                <th className="py-2.5 px-3 w-28 text-center">SUCURSALES</th>
                <th className="py-2.5 px-3 w-32">ESTADO</th>
                <th className="py-2.5 px-3 w-24 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#0b1c30]">
              {currentEmpresas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <span className="material-symbols-outlined text-[36px] text-slate-300 block mb-1">domain_disabled</span>
                    No se encontraron empresas con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                currentEmpresas.map((empresa) => {
                  const isExpanded = expandedRowIds.includes(empresa.id);
                  const isBaja = empresa.estado === 'BAJA';

                  return (
                    <React.Fragment key={empresa.id}>
                      {/* Main Company Row */}
                      <tr
                        onClick={() => toggleRow(empresa.id)}
                        className={`border-b border-[#E2E8F0] h-[42px] table-row-hover transition-colors cursor-pointer ${
                          isExpanded ? 'bg-blue-50/20' : 'bg-white'
                        }`}
                      >
                        {/* Chevron */}
                        <td className="py-1 px-3 text-center">
                          <span
                            className="material-symbols-outlined text-slate-400 text-[18px] transition-transform duration-200 inline-block select-none"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                          >
                            chevron_right
                          </span>
                        </td>

                        {/* ID */}
                        <td className="py-1 px-3 text-slate-500 font-mono text-[12px]">
                          {empresa.codigo}
                        </td>

                        {/* Nombre */}
                        <td className="py-1 px-3">
                          <span
                            className={`font-semibold ${
                              isBaja ? 'text-slate-400 line-through' : 'text-[#004ac6] hover:underline'
                            }`}
                          >
                            {empresa.nombre}
                          </span>
                          {empresa.direccionFiscal && (
                            <span className="block text-[10px] text-slate-400 truncate max-w-xs font-normal">
                              {empresa.direccionFiscal}
                            </span>
                          )}
                        </td>

                        {/* RIF */}
                        <td className={`py-1 px-3 font-mono text-[12px] ${isBaja ? 'text-slate-400' : 'text-slate-600'}`}>
                          {empresa.rif}
                        </td>

                        {/* Sector */}
                        <td className={`py-1 px-3 ${isBaja ? 'text-slate-400' : 'text-slate-600'}`}>
                          {empresa.sector}
                        </td>

                        {/* Sucursales Count */}
                        <td className="py-1 px-3 text-center font-bold">
                          <span className={`inline-block px-2 py-0.5 rounded text-[12px] ${
                            empresa.sucursales.length > 0 
                              ? 'bg-slate-100 text-slate-800' 
                              : 'bg-slate-50 text-slate-400 font-normal'
                          }`}>
                            {empresa.sucursales.length}
                          </span>
                        </td>

                        {/* Estado Badge */}
                        <td className="py-1 px-3">
                          {empresa.estado === 'ACTIVO' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#16A34A]/10 text-[#16A34A] tracking-wider">
                              ACTIVO
                            </span>
                          )}
                          {empresa.estado === 'SUSPENDIDO' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706]/10 text-[#D97706] tracking-wider">
                              SUSPENDIDO
                            </span>
                          )}
                          {empresa.estado === 'BAJA' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DC2626]/10 text-[#DC2626] tracking-wider">
                              BAJA
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-1 px-3 text-right">
                          <div className="flex items-center justify-end gap-1 relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setEditingEmpresa(empresa)}
                              title="Editar datos de la empresa"
                              className="p-1 text-slate-400 hover:text-[#004ac6] hover:bg-slate-100 rounded transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>

                            <button
                              onClick={() => setActionMenuOpenId(actionMenuOpenId === empresa.id ? null : empresa.id)}
                              title="Más opciones"
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">more_vert</span>
                            </button>

                            {/* Dropdown Menu */}
                            {actionMenuOpenId === empresa.id && (
                              <div className="absolute right-0 top-7 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 text-left text-[12px]">
                                <button
                                  onClick={() => {
                                    setSucursalTargetEmpresa(empresa);
                                    setActionMenuOpenId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px]">add_location</span>
                                  Agregar Sucursal
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingEmpresa(empresa);
                                    setActionMenuOpenId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                  Modificar Estado
                                </button>
                                <div className="border-t border-slate-100 my-1"></div>
                                <button
                                  onClick={() => {
                                    if (confirm(`¿Confirma que desea eliminar la empresa ${empresa.nombre}?`)) {
                                      onDeleteEmpresa(empresa.id);
                                      showToast('Empresa eliminada del registro.');
                                    }
                                    setActionMenuOpenId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                  Eliminar Registro
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Nested Expanded Row */}
                      {isExpanded && (
                        <tr className="bg-[#F8FAFC]">
                          <td className="p-0 border-b border-[#E2E8F0]" colSpan={8}>
                            <div className="bg-[#F8FAFC] p-3.5 pl-10 border-l-[3px] border-[#004ac6] shadow-inner">
                              <div className="flex justify-between items-center mb-2.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-[12px] font-bold text-slate-700">
                                    Sucursales Activas (GET /empresas/{empresa.codigo.toLowerCase()}/sucursales)
                                  </h4>
                                  <span className="text-[10px] text-slate-400 bg-slate-200/70 px-1.5 py-0.2 rounded font-mono">
                                    {empresa.sucursales.length} sucursales
                                  </span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSucursalTargetEmpresa(empresa);
                                  }}
                                  className="h-[24px] px-2 bg-white border border-slate-300 rounded text-slate-700 flex items-center gap-1 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-colors text-[11px] font-medium shadow-2xs"
                                >
                                  <span className="material-symbols-outlined text-[14px]">add</span>
                                  <span>Sucursal</span>
                                </button>
                              </div>

                              {empresa.estado === 'BAJA' ? (
                                <div className="p-3 bg-white/60 border border-dashed border-slate-300 rounded text-[12px] text-slate-400 italic">
                                  No hay sucursales activas para una empresa en estado de BAJA.
                                </div>
                              ) : empresa.sucursales.length === 0 ? (
                                <div className="p-3 bg-white border border-slate-200 rounded text-[12px] text-slate-500 flex items-center justify-between">
                                  <span>Esta empresa aún no tiene sucursales o sedes registradas.</span>
                                  <button
                                    onClick={() => setSucursalTargetEmpresa(empresa)}
                                    className="text-blue-600 font-semibold hover:underline text-[11px]"
                                  >
                                    + Registrar primera sucursal
                                  </button>
                                </div>
                              ) : (
                                <div className="border border-[#E2E8F0] bg-white rounded overflow-hidden shadow-2xs">
                                  <table className="w-full text-left">
                                    <thead>
                                      <tr className="bg-[#F1F5F9] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-1.5 px-3 w-28 font-mono">ID SUC.</th>
                                        <th className="py-1.5 px-3">NOMBRE</th>
                                        <th className="py-1.5 px-3">UBICACIÓN</th>
                                        <th className="py-1.5 px-3">ENCARGADO</th>
                                        <th className="py-1.5 px-3 w-24 text-center">ESTADO</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-[12px] text-slate-700 divide-y divide-slate-100">
                                      {empresa.sucursales.map((sucursal) => (
                                        <tr key={sucursal.id} className="hover:bg-slate-50/80 transition-colors">
                                          <td className="py-2 px-3 font-mono text-[11px] text-slate-400 font-medium">
                                            {sucursal.codigo}
                                          </td>
                                          <td className="py-2 px-3 font-medium text-slate-800">
                                            {sucursal.nombre}
                                            {sucursal.direccion && (
                                              <span className="block text-[10px] text-slate-400 font-normal">
                                                {sucursal.direccion}
                                              </span>
                                            )}
                                          </td>
                                          <td className="py-2 px-3 text-slate-500">
                                            {sucursal.ubicacion}
                                          </td>
                                          <td className="py-2 px-3 text-slate-700">
                                            {sucursal.encargado}
                                          </td>
                                          <td className="py-2 px-3 text-center">
                                            <label className="toggle-switch align-middle">
                                              <input
                                                type="checkbox"
                                                checked={sucursal.activo}
                                                onChange={() => {
                                                  onToggleSucursal(empresa.id, sucursal.id);
                                                  showToast(`Estado de sucursal ${sucursal.codigo} actualizado.`);
                                                }}
                                              />
                                              <span className="toggle-slider"></span>
                                            </label>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-2.5 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row justify-between items-center gap-2 text-[12px] text-slate-500">
          <span>
            Mostrando {filteredEmpresas.length === 0 ? 0 : startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredEmpresas.length)} de {filteredEmpresas.length} registros (Total: 156 en BD)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            <span className="px-2 font-medium text-slate-700">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ModalNuevaEmpresa
        isOpen={isNuevaEmpresaOpen}
        onClose={() => setIsNuevaEmpresaOpen(false)}
        onSave={(data) => {
          onAddEmpresa(data);
          showToast('Empresa registrada correctamente.');
        }}
      />

      <ModalNuevaSucursal
        isOpen={!!sucursalTargetEmpresa}
        empresa={sucursalTargetEmpresa}
        onClose={() => setSucursalTargetEmpresa(null)}
        onSaveSucursal={(empId, sucData) => {
          onAddSucursal(empId, sucData);
          showToast('Nueva sucursal añadida exitosamente.');
        }}
      />

      <ModalEditarEmpresa
        isOpen={!!editingEmpresa}
        empresa={editingEmpresa}
        onClose={() => setEditingEmpresa(null)}
        onUpdate={(empId, updated) => {
          onUpdateEmpresa(empId, updated);
          showToast('Datos de empresa actualizados.');
        }}
      />
    </div>
  );
};
