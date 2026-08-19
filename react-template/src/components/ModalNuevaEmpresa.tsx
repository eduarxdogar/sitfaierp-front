import React, { useState } from 'react';
import { Empresa } from '../types';

interface ModalNuevaEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (empresaData: Partial<Empresa>) => void;
}

export const ModalNuevaEmpresa: React.FC<ModalNuevaEmpresaProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [nombre, setNombre] = useState('');
  const [rif, setRif] = useState('');
  const [sector, setSector] = useState('Logística y Transporte');
  const [direccionFiscal, setDireccionFiscal] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !rif.trim()) {
      setError('Por favor complete la Razón Social y el RIF/NIT obligatorio.');
      return;
    }

    onSave({
      nombre: nombre.trim(),
      rif: rif.trim(),
      sector,
      direccionFiscal: direccionFiscal.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      estado: 'ACTIVO',
      sucursales: []
    });

    // Reset form
    setNombre('');
    setRif('');
    setDireccionFiscal('');
    setTelefono('');
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[520px] border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]">domain_add</span>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">Nueva Empresa</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-200/50"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-red-600 text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <form id="form-nueva-empresa" onSubmit={handleSubmit} className="space-y-4">
            {/* Razon Social */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-slate-400 text-[18px]">
                  business
                </span>
                <input
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full h-[34px] pl-9 pr-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Ej. Corporación Acme, C.A."
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* ID Fiscal */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  ID Fiscal (RIF/NIT) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-slate-400 text-[18px]">
                    badge
                  </span>
                  <input
                    value={rif}
                    onChange={(e) => {
                      setRif(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full h-[34px] pl-9 pr-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 placeholder:text-slate-400 font-mono"
                    placeholder="J-00000000-0"
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Sector Comercial
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 cursor-pointer"
                >
                  <option value="Logística y Transporte">Logística y Transporte</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Farmacéutico">Farmacéutico</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Servicios">Servicios</option>
                </select>
              </div>
            </div>

            {/* Dirección Fiscal */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Dirección Fiscal Principal
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
                  location_on
                </span>
                <textarea
                  value={direccionFiscal}
                  onChange={(e) => setDireccionFiscal(e.target.value)}
                  rows={2}
                  className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 placeholder:text-slate-400 resize-none"
                  placeholder="Dirección fiscal completa, ciudad y estado..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Teléfono */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Teléfono Principal
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-slate-400 text-[18px]">
                    call
                  </span>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full h-[34px] pl-9 pr-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="+58 212 0000000"
                    type="tel"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Email Corporativo
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-slate-400 text-[18px]">
                    mail
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[34px] pl-9 pr-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="contacto@empresa.com"
                    type="email"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
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
            form="form-nueva-empresa"
            className="h-[32px] px-4 bg-[#004ac6] text-white rounded font-medium text-[12px] hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            Guardar Empresa
          </button>
        </div>
      </div>
    </div>
  );
};
