import React, { useState } from 'react';
import { Sucursal, Empresa } from '../types';

interface ModalNuevaSucursalProps {
  isOpen: boolean;
  empresa: Empresa | null;
  onClose: () => void;
  onSaveSucursal: (empresaId: string, sucursalData: Omit<Sucursal, 'id'>) => void;
}

export const ModalNuevaSucursal: React.FC<ModalNuevaSucursalProps> = ({
  isOpen,
  empresa,
  onClose,
  onSaveSucursal
}) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('Distrito Capital, VE');
  const [encargado, setEncargado] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !empresa) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !encargado.trim()) {
      setError('Por favor indique el nombre de la sucursal y el encargado.');
      return;
    }

    const nextIndex = empresa.sucursales.length + 1;
    const charCode = String.fromCharCode(64 + nextIndex); // A, B, C, D...
    const numPart = empresa.codigo.replace('EMP-', '');
    const generatedCodigo = `SUC-${numPart}${charCode}`;

    onSaveSucursal(empresa.id, {
      codigo: generatedCodigo,
      nombre: nombre.trim(),
      ubicacion: ubicacion.trim(),
      encargado: encargado.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      activo: true
    });

    setNombre('');
    setEncargado('');
    setTelefono('');
    setDireccion('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[480px] border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-3.5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">Nueva Sucursal / Sede</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Empresa: <strong className="text-blue-600">{empresa.nombre}</strong> ({empresa.codigo})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-200/50"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-red-600 text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <form id="form-nueva-sucursal" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Nombre de la Sucursal / Depósito <span className="text-red-500">*</span>
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Centro Distribución Valencia"
                className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Ubicación (Estado / Región)
                </label>
                <select
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 cursor-pointer"
                >
                  <option value="Distrito Capital, VE">Distrito Capital, VE</option>
                  <option value="Carabobo, VE">Carabobo, VE</option>
                  <option value="Miranda, VE">Miranda, VE</option>
                  <option value="Zulia, VE">Zulia, VE</option>
                  <option value="Lara, VE">Lara, VE</option>
                  <option value="Aragua, VE">Aragua, VE</option>
                  <option value="Anzoátegui, VE">Anzoátegui, VE</option>
                  <option value="Bolívar, VE">Bolívar, VE</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Encargado / Jefe Sede <span className="text-red-500">*</span>
                </label>
                <input
                  value={encargado}
                  onChange={(e) => setEncargado(e.target.value)}
                  placeholder="Ej. Carlos Mendoza"
                  className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Dirección Detallada
              </label>
              <textarea
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                rows={2}
                placeholder="Zona industrial, calle, galpón o centro comercial..."
                className="w-full px-3 py-1.5 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Teléfono de Contacto Sede
              </label>
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+58 241 0000000"
                className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[32px] px-4 bg-white border border-slate-300 rounded text-slate-700 font-medium text-[12px] hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-nueva-sucursal"
            className="h-[32px] px-4 bg-[#004ac6] text-white rounded font-medium text-[12px] hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Crear Sucursal
          </button>
        </div>
      </div>
    </div>
  );
};
