import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">help_outline</span>
            <h3 className="text-[16px] font-bold text-slate-900">Guía de Operación SITFAI ERP</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-[13px] text-slate-600">
          <div>
            <h4 className="font-bold text-slate-800 text-[14px] mb-1">🏢 Multi-Tenancy & Sucursales</h4>
            <p>
              El módulo <strong>Tenant & Branches</strong> permite gestionar la cartera de clientes o empresas del grupo corporativo. Cada empresa puede tener múltiples sucursales con switches individuales para activación/desactivación en tiempo real.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-[14px] mb-1">📦 Metodología de Toma Física</h4>
            <p>
              <strong>1. Conteo 1 (Ciego):</strong> El operador de almacén registra las existencias sin conocer el valor teórico para evitar sesgos.<br/>
              <strong>2. Conteo 2 (Verificación):</strong> Si hay discrepancia, el supervisor realiza un segundo conteo.<br/>
              <strong>3. Conciliación & Ajuste:</strong> Se genera el comprobante contable de merma o sobrante.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-[14px] mb-1">🎯 Exactitud · Control · Confianza</h4>
            <p className="text-[12px] italic text-slate-500">
              SITFAI cumple con las normas de auditoría de control interno para existencias físicas e inventarios en retail, logística, alimentos y farmacéutica.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
          <button
            onClick={onClose}
            className="h-[32px] px-4 bg-[#004ac6] text-white rounded text-[12px] font-semibold hover:bg-blue-700"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
