import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen bg-surface-50 font-sans">
      <!-- Sidebar Izquierdo -->
      <aside class="w-64 bg-surface-900 text-surface-50 flex flex-col flex-shrink-0">
        <div class="h-16 flex items-center px-6 border-b border-surface-800 font-bold text-xl tracking-tight">
          <svg class="w-6 h-6 text-primary-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          SITFAI
        </div>
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <a routerLink="/ui-kit" routerLinkActive="bg-surface-800 text-surface-50" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-surface-300 hover:bg-surface-800 hover:text-surface-50 transition-colors">
            <span class="material-icons text-[18px] mr-3">dashboard</span>
            Corporate UI Kit
          </a>
          <a href="#" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-surface-300 hover:bg-surface-800 hover:text-surface-50 transition-colors">
            <span class="material-icons text-[18px] mr-3">business</span>
            Gestión de Empresas
          </a>
          <a routerLink="/iam" routerLinkActive="bg-surface-800 text-surface-50" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-surface-300 hover:bg-surface-800 hover:text-surface-50 transition-colors">
            <span class="material-icons text-[18px] mr-3">admin_panel_settings</span>
            IAM (Usuarios y Roles)
          </a>
          <a routerLink="/pedidos" routerLinkActive="bg-surface-800 text-surface-50" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-surface-300 hover:bg-surface-800 hover:text-surface-50 transition-colors">
            <span class="material-icons text-[18px] mr-3">shopping_cart</span>
            Ventas y Pedidos
          </a>
        </nav>
        <div class="p-4 border-t border-surface-800">
           <a routerLink="/login" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-surface-300 border border-surface-700 rounded-md hover:bg-surface-800 hover:text-surface-50 transition-colors">
              <span class="material-icons text-[18px] mr-2">logout</span> Cerrar Sesión
           </a>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Navbar -->
        <header class="h-16 bg-surface-100 border-b border-surface-200 flex items-center justify-between px-6 flex-shrink-0">
          <div class="flex items-center text-surface-500 bg-white border border-surface-200 rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
             <span class="material-icons text-[18px] mr-2">search</span>
             <input type="text" placeholder="Buscar..." class="bg-transparent border-none focus:ring-0 text-sm w-64 outline-none placeholder-surface-400 text-surface-900" />
          </div>
          <div class="flex items-center space-x-6">
             <button class="text-surface-500 hover:text-surface-800 transition-colors relative cursor-pointer">
               <span class="material-icons">notifications</span>
               <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
             </button>
             <div class="flex items-center space-x-3 cursor-pointer hover:bg-surface-200 p-1.5 rounded-md transition-colors">
               <div class="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                 SA
               </div>
               <div class="flex flex-col">
                 <span class="text-xs font-bold text-surface-900">SUPER_ADMIN</span>
                 <span class="text-[10px] text-surface-500">Global Admin</span>
               </div>
             </div>
          </div>
        </header>
        
        <!-- Contenido Dinamico (Router Outlet) -->
        <div class="flex-1 overflow-auto">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class MainLayoutComponent {}
