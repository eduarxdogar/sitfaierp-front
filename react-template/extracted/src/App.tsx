import React, { useState } from 'react';
import { AppTab, Empresa, Sucursal } from './types';
import {
  INITIAL_EMPRESAS,
  INITIAL_TOMAS_FISICAS,
  INITIAL_ITEMS_CONTEO,
  INITIAL_USUARIOS,
  INITIAL_VENTAS,
  INITIAL_FACTURAS,
  INITIAL_POS
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopNavBar } from './components/TopNavBar';
import { TenantBranchesView } from './components/TenantBranchesView';
import { DashboardView } from './components/DashboardView';
import { InventoryAuditView } from './components/InventoryAuditView';
import { IAMView } from './components/IAMView';
import { SalesView } from './components/SalesView';
import { BillingView } from './components/BillingView';
import { POSView } from './components/POSView';
import { SettingsView } from './components/SettingsView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { HelpModal } from './components/HelpModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

export default function App() {
  // Main view tab (defaults to 'tenant-branches' as in the primary user screenshot)
  const [currentTab, setCurrentTab] = useState<AppTab>('tenant-branches');

  // Application Data States
  const [empresas, setEmpresas] = useState<Empresa[]>(INITIAL_EMPRESAS);
  const [tomasFisicas, setTomasFisicas] = useState(INITIAL_TOMAS_FISICAS);
  const [itemsConteo, setItemsConteo] = useState(INITIAL_ITEMS_CONTEO);
  const [usuarios] = useState(INITIAL_USUARIOS);
  const [ventas] = useState(INITIAL_VENTAS);
  const [facturas] = useState(INITIAL_FACTURAS);
  const [posTerminals] = useState(INITIAL_POS);

  // Overlay Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Tenant & Branches
  const handleAddEmpresa = (empresaData: Partial<Empresa>) => {
    const nextNum = empresas.length + 1;
    const padNum = String(nextNum).padStart(3, '0');
    const newEmpresa: Empresa = {
      id: `emp-${Date.now()}`,
      codigo: `EMP-${padNum}`,
      nombre: empresaData.nombre || 'Nueva Empresa',
      rif: empresaData.rif || 'J-00000000-0',
      sector: empresaData.sector || 'Servicios',
      estado: empresaData.estado || 'ACTIVO',
      direccionFiscal: empresaData.direccionFiscal || '',
      telefono: empresaData.telefono || '',
      email: empresaData.email || '',
      fechaRegistro: new Date().toISOString().split('T')[0],
      sucursales: []
    };
    setEmpresas([newEmpresa, ...empresas]);
  };

  const handleUpdateEmpresa = (empresaId: string, updatedData: Partial<Empresa>) => {
    setEmpresas(prev => prev.map(emp => 
      emp.id === empresaId ? { ...emp, ...updatedData } : emp
    ));
  };

  const handleDeleteEmpresa = (empresaId: string) => {
    setEmpresas(prev => prev.filter(emp => emp.id !== empresaId));
  };

  const handleAddSucursal = (empresaId: string, sucursalData: Omit<Sucursal, 'id'>) => {
    setEmpresas(prev => prev.map(emp => {
      if (emp.id === empresaId) {
        const newSucursal: Sucursal = {
          ...sucursalData,
          id: `suc-${Date.now()}`
        };
        return {
          ...emp,
          sucursales: [...emp.sucursales, newSucursal]
        };
      }
      return emp;
    }));
  };

  const handleToggleSucursal = (empresaId: string, sucursalId: string) => {
    setEmpresas(prev => prev.map(emp => {
      if (emp.id === empresaId) {
        return {
          ...emp,
          sucursales: emp.sucursales.map(suc => 
            suc.id === sucursalId ? { ...suc, activo: !suc.activo } : suc
          )
        };
      }
      return emp;
    }));
  };

  const handleUpdateItemConteo = (itemId: string, conteo1: number, conteo2: number) => {
    setItemsConteo(prev => prev.map(item => {
      if (item.id === itemId) {
        const cFinal = conteo1;
        const diff = cFinal - item.stockTeorico;
        return {
          ...item,
          conteo1,
          conteo2,
          conteoFinal: cFinal,
          diferencia: diff,
          estado: diff === 0 ? 'Verificado' : 'Discrepancia'
        };
      }
      return item;
    }));
  };

  const handleAjustarDiscrepancia = (itemId: string) => {
    setItemsConteo(prev => prev.map(item => {
      if (item.id === itemId) {
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

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] h-screen overflow-hidden flex antialiased">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col ml-[260px] h-screen bg-[#f8f9ff] relative z-10">
        {/* Fixed Top Bar */}
        <TopNavBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 mt-12 overflow-y-auto p-6">
          {currentTab === 'tenant-branches' && (
            <TenantBranchesView
              empresas={empresas}
              onAddEmpresa={handleAddEmpresa}
              onUpdateEmpresa={handleUpdateEmpresa}
              onDeleteEmpresa={handleDeleteEmpresa}
              onAddSucursal={handleAddSucursal}
              onToggleSucursal={handleToggleSucursal}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardView
              empresas={empresas}
              tomasFisicas={tomasFisicas}
              onNavigateTo={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryAuditView
              items={itemsConteo}
              tomasFisicas={tomasFisicas}
              empresas={empresas}
              onUpdateItemConteo={handleUpdateItemConteo}
              onAjustarDiscrepancia={handleAjustarDiscrepancia}
            />
          )}

          {currentTab === 'iam' && (
            <IAMView
              usuarios={usuarios}
              empresas={empresas}
            />
          )}

          {currentTab === 'sales' && (
            <SalesView
              ventas={ventas}
            />
          )}

          {currentTab === 'billing' && (
            <BillingView
              facturas={facturas}
            />
          )}

          {currentTab === 'pos' && (
            <POSView
              posTerminals={posTerminals}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Overlays */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        empresas={empresas}
        tomasFisicas={tomasFisicas}
        onNavigateTo={(tab) => setCurrentTab(tab)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTo={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}
