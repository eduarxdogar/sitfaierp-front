import React from 'react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (tab: any) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTo
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Discrepancia en Toma Física TF-2026-086',
      desc: 'Inversiones Gamma 21 (Tienda Flagship Sambil Chacao) reporta merma de $1,280.00.',
      time: 'Hace 15 min',
      unread: true,
      tab: 'inventory'
    },
    {
      id: 'notif-2',
      title: 'Nueva Sucursal Operativa',
      desc: 'Logística Andina S.A. activó el Almacén Portuario Puerto Cabello.',
      time: 'Hace 1 hora',
      unread: true,
      tab: 'tenant-branches'
    },
    {
      id: 'notif-3',
      title: 'Cierre de Arqueo POS exitoso',
      desc: 'Grupo Ferretero Continental C.A. - Mega Tienda Los Guayos.',
      time: 'Hace 3 horas',
      unread: false,
      tab: 'pos'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#0F172A]/30 backdrop-blur-xs" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col animate-in slide-in-from-right duration-200">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]">notifications</span>
            <h3 className="text-[14px] font-bold text-slate-800">Alertas & Auditorías</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto divide-y divide-slate-100 flex-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onNavigateTo(n.tab);
                onClose();
              }}
              className={`py-3 px-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                n.unread ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[12px] font-bold text-slate-800">{n.title}</h4>
                {n.unread && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
              </div>
              <p className="text-[11px] text-slate-600 mb-1">{n.desc}</p>
              <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-center">
          <button
            onClick={onClose}
            className="text-[12px] text-blue-600 font-semibold hover:underline"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </div>
  );
};
