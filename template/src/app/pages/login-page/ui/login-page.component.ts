import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-surface-50 flex font-sans">
      <!-- Left Branding Panel -->
      <div class="hidden lg:flex lg:w-1/2 bg-surface-900 relative overflow-hidden flex-col justify-between p-12">
        <div class="relative z-10">
          <div class="flex items-center text-white font-bold text-2xl tracking-tight mb-12">
             <svg class="w-8 h-8 text-primary-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
             SITFAI ERP
          </div>
          <h1 class="text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-md tracking-tight">
            Gestión Inteligente para la Empresa Moderna
          </h1>
          <p class="mt-6 text-surface-300 text-lg max-w-md leading-relaxed">
            Unifique sus operaciones, simplifique sus finanzas y escale su negocio con nuestra plataforma integral diseñada para la alta eficiencia.
          </p>
        </div>
        
        <!-- Abstract background pattern -->
        <div class="absolute inset-0 opacity-20 pointer-events-none">
           <svg class="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4" width="800" height="800" fill="none" viewBox="0 0 800 800"><circle cx="400" cy="400" r="400" fill="url(#grad1)"/><defs><radialGradient id="grad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)"><stop stop-color="#3b82f6"/><stop offset="1" stop-color="#0f172a" stop-opacity="0"/></radialGradient></defs></svg>
        </div>
        
        <div class="relative z-10 text-surface-500 text-sm font-medium">
          &copy; 2026 SITFAI Technologies. Todos los derechos reservados.
        </div>
      </div>

      <!-- Right Login Panel -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-24 bg-white relative shadow-2xl z-10">
        <div class="w-full max-w-sm space-y-8">
          
          <!-- Mobile Logo (hidden on desktop) -->
          <div class="flex lg:hidden items-center text-surface-900 font-bold text-2xl tracking-tight mb-8 justify-center">
             <svg class="w-8 h-8 text-primary-600 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
             SITFAI ERP
          </div>

          <div class="text-center lg:text-left">
            <h2 class="text-2xl font-bold text-surface-900 tracking-tight">Iniciar Sesión</h2>
            <p class="mt-2 text-sm text-surface-500">Ingrese sus credenciales corporativas.</p>
          </div>

          <form class="mt-8 space-y-6" (submit)="onSubmit($event)">
            <div class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-surface-700 mb-1">Correo Electrónico</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="material-icons text-surface-400 text-[18px]">email</span>
                  </div>
                  <input id="email" name="email" type="email" autocomplete="email" required class="block w-full pl-10 pr-3 py-2.5 border border-surface-300 rounded-md shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-surface-900 transition-shadow bg-surface-50 focus:bg-white" placeholder="admin@sitfai.com">
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-surface-700 mb-1">Contraseña</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="material-icons text-surface-400 text-[18px]">lock</span>
                  </div>
                  <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full pl-10 pr-3 py-2.5 border border-surface-300 rounded-md shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-surface-900 transition-shadow bg-surface-50 focus:bg-white" placeholder="••••••••">
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded cursor-pointer">
                <label for="remember-me" class="ml-2 block text-sm text-surface-700 cursor-pointer">
                  Recordarme
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>

            <div>
              <button type="submit" routerLink="/ui-kit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors cursor-pointer">
                Ingresar al Sistema
              </button>
            </div>
          </form>
          
          <!-- Logo Options Showcase (Exploration) -->
          <div class="pt-8 mt-12 border-t border-surface-100">
             <h3 class="text-[11px] font-bold text-surface-400 uppercase tracking-widest mb-4 text-center lg:text-left">Opciones de Isotipo (Vectores SVG)</h3>
             <div class="grid grid-cols-3 gap-3">
                
                <!-- Option 1: Layers (Current) -->
                <div class="flex flex-col items-center p-3 rounded-lg border-2 border-primary-100 bg-primary-50 cursor-pointer hover:border-primary-200 transition-colors group">
                   <svg class="w-6 h-6 text-primary-600 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                   <span class="text-[10px] font-bold text-primary-800">Layers</span>
                </div>

                <!-- Option 2: Solid Block -->
                <div class="flex flex-col items-center p-3 rounded-lg border border-surface-200 bg-white cursor-pointer hover:bg-surface-50 transition-colors group">
                   <svg class="w-6 h-6 text-surface-900 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                   <span class="text-[10px] font-bold text-surface-600">Modules</span>
                </div>

                <!-- Option 3: Hex Connect -->
                <div class="flex flex-col items-center p-3 rounded-lg border border-surface-200 bg-white cursor-pointer hover:bg-surface-50 transition-colors group">
                   <svg class="w-6 h-6 text-surface-900 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                   <span class="text-[10px] font-bold text-surface-600">Nexus</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  onSubmit(event: Event) {
    event.preventDefault();
  }
}
