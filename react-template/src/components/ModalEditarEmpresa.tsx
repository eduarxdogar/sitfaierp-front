import React, { useState, useEffect } from 'react';
import { Empresa, EmpresaEstado } from '../types';

interface ModalEditarEmpresaProps {
  isOpen: boolean;
  empresa: Empresa | null;
  onClose: () => void;
  onUpdate: (empresaId: string, updatedData: Partial<Empresa>) => void;
}

export const ModalEditarEmpresa: React.FC<ModalEditarEmpresaProps> = ({
  isOpen,
  empresa,
  onClose,
  onUpdate
}) => {
  const [nombre, setNombre] = useState('');
  const [rif, setRif] = useState('');
  const [sector, setSector] = useState('');
  const [estado, setEstado] = useState<EmpresaEstado>('ACTIVO');
  const [direccionFiscal, setDireccionFiscal] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (empresa) {
      setNombre(empresa.nombre);
      setRif(empresa.rif);
      setSector(empresa.sector);
      setEstado(empresa.estado);
      setDireccionFiscal(empresa.direccionFiscal || '');
      setTelefono(empresa.telefono || '');
      setEmail(empresa.email || '');
    }
  }, [empresa]);

  if (!isOpen || !empresa) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(empresa.id, {
      nombre: nombre.trim(),
      rif: rif.trim(),
      sector,
      estado,
      direccionFiscal: direccionFiscal.trim(),
      telefono: telefono.trim(),
      email: email.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[520px] border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-3.5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">Editar Empresa</h3>
            <p className="text-[11px] text-slate-500 font-mono">Código: {empresa.codigo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-200/50"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="form-editar-empresa" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Razón Social
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  RIF / NIT
                </label>
                <input
                  value={rif}
                  onChange={(e) => setRif(e.target.value)}
                  className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Estado Operativo
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as EmpresaEstado)}
                  className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 cursor-pointer font-semibold"
                >
                  <option value="ACTIVO">ACTIVO (Operativo)</option>
                  <option value="SUSPENDIDO">SUSPENDIDO (Pausa)</option>
                  <option value="BAJA">BAJA (Inactivo)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Sector Comercial
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 cursor-pointer"
                >
                  <option value="Transporte">Transporte</option>
                  <option value="Retail">Retail</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Farmacéutico">Farmacéutico</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Servicios">Servicios</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Teléfono
                </label>
                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[34px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Dirección Fiscal
              </label>
              <textarea
                value={direccionFiscal}
                onChange={(e) => setDireccionFiscal(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-slate-900 resize-none"
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
            form="form-editar-empresa"
            className="h-[32px] px-4 bg-[#004ac6] text-white rounded font-medium text-[12px] hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            Actualizar Empresa
          </button>
        </div>
      </div>
    </div>
  );
};
