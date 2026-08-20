import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout
}) => {
  // Brand logo using Image 4 as requested by the user
  const LOGO_URL = "https://lh3.googleusercontent.com/aida/AP1WRLvxu-MYYtYE8513Z-EI3sdxrOhODmhXA6epqci0UyOQDHbGb_ancmkTTrGz4awAe6afZxrRhSvRbwbnm5Dg8W8mwiW21n2PtgTgJXjOQNL2m7J-RZ3vUWuWf_cwonf4-yUvgKZC7DsJV5XvTQ2lCYyKSMecUMnHLAs6BwHaMduRiYhQ1phqVeRNWYfgbCtEK14jzhuIs-csKoGJLHo65lYS-iH3I7BhtfBFLYHk8yvJGxDFtc6of43XlG8";

  const navItems: { id: AppTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'tenant-branches', label: 'Tenant & Branches', icon: 'domain' },
    { id: 'iam', label: 'IAM', icon: 'admin_panel_settings' },
    { id: 'sales', label: 'Sales', icon: 'payments' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
    { id: 'billing', label: 'Billing', icon: 'receipt_long' },
    { id: 'pos', label: 'POS', icon: 'point_of_sale' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#0F172A] flex flex-col py-4 z-30 select-none shadow-xl">
      {/* Brand Header */}
      <div 
        onClick={() => onSelectTab('tenant-branches')}
        className="px-4 mb-6 flex items-center gap-3 cursor-pointer group"
      >
        <img
          alt="SITFAI ERP Logo"
          className="h-9 w-9 rounded-md object-contain bg-white/10 p-0.5 border border-slate-700/50 shadow-sm transition-transform group-hover:scale-105"
          src={LOGO_URL}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback gracefully if external image has loading issue
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div>
          <h1 className="text-[16px] font-bold text-white tracking-tight leading-tight flex items-center gap-1.5">
            SITFAI ERP
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Management Suite</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[#1E293B] text-white border-l-[3px] border-[#2563eb] shadow-sm font-semibold pl-3'
                      : 'text-slate-400 hover:bg-[#1E293B]/70 hover:text-slate-100'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-blue-400' : 'text-slate-400'
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto pt-3 border-t border-slate-800 px-2 space-y-1">
        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
            currentTab === 'settings'
              ? 'bg-[#1E293B] text-white border-l-[3px] border-[#2563eb] pl-3'
              : 'text-slate-400 hover:bg-[#1E293B]/70 hover:text-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings</span>
        </button>

        <button
          onClick={() => {
            if (onLogout) onLogout();
            else alert('Sesión de SUPER_ADMIN finalizada.');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-md text-[13px] font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
