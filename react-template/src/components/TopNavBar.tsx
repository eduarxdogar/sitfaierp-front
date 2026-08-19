import React, { useState } from 'react';

interface TopNavBarProps {
  onOpenSearch: () => void;
  onOpenHelp: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  onOpenSearch,
  onOpenHelp,
  onOpenNotifications,
  unreadCount = 2
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Avatar URL provided in HTML
  const AVATAR_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBP3b_DX0OxlZHk5bMt6htIJ97zMmzZrmLJBCzfXSHzugHsIIypblm5P13vVhjaqeGjIUvitJb-jOtsSbP8CqI5p4sQh3IGV18uSI9mnLk6Z6Jzz6rltyxyz1GsKQ6wHu21expCOSAzKlesee00XkI2KyNG_uEXLI5qLEFa1ZTYuvrqqLJvg0jH1SUMLWTtbYMt2s4XhIZfzj8qeH8o4PkzxA47IdXQbY5YXqCXh51beUibnZXZVyEX";

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-12 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="text-[18px] font-extrabold text-[#0b1c30] tracking-tight">
          SITFAI ERP
        </span>
        <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
          v2.6 Multi-Tenant
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          title="Buscar en todo el sistema (Ctrl + K)"
          className="text-[#434655] hover:bg-[#f1f5f9] hover:text-[#004ac6] p-1.5 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          title="Notificaciones de Auditoría y Alertas"
          className="relative text-[#434655] hover:bg-[#f1f5f9] hover:text-[#004ac6] p-1.5 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Help */}
        <button
          onClick={onOpenHelp}
          title="Manual de Toma Física y Auditoría"
          className="text-[#434655] hover:bg-[#f1f5f9] hover:text-[#004ac6] p-1.5 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>

        <div className="h-5 w-px bg-[#E2E8F0] mx-2"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer hover:bg-[#f1f5f9] p-1 rounded-md transition-colors"
          >
            <span className="text-[11px] font-semibold text-[#475569] bg-[#E2E8F0] px-2 py-0.5 rounded-full tracking-wide">
              SUPER_ADMIN
            </span>
            <img
              alt="User Profile"
              className="w-7 h-7 rounded-full object-cover border border-slate-300"
              src={AVATAR_URL}
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-[13px] font-semibold text-slate-900">Super Administrador</p>
                <p className="text-[11px] text-slate-500 truncate">sitfaierp@gmail.com</p>
              </div>
              <div className="py-1">
                <div className="px-4 py-1.5 text-[11px] text-slate-500 uppercase font-semibold">
                  Módulo de Seguridad
                </div>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-500">verified_user</span>
                  Permisos de Auditoría Global
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-500">database</span>
                  Respaldos y Logs de Auditoría
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
