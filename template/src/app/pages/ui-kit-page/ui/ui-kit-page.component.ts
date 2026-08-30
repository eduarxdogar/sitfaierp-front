import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ui-kit-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
        <main class="p-8">
          <div class="max-w-6xl mx-auto space-y-8">
            
            <div>
              <h1 class="text-2xl font-bold text-surface-900 tracking-tight">Corporate UI Kit</h1>
              <p class="text-sm text-surface-500 mt-1">Librería de componentes de alta densidad para SITFAI ERP.</p>
            </div>

            <div class="bg-surface-100 rounded-lg shadow-sm border border-surface-200 p-6 space-y-8">
              
              <!-- Seccion Botones -->
              <section>
                <h2 class="text-sm font-bold text-surface-800 mb-4 uppercase tracking-wider">Acciones (Botones)</h2>
                <div class="flex items-center space-x-4">
                  <button class="bg-primary-600 text-white hover:bg-primary-700 transition-colors rounded-md px-4 py-2 text-sm font-medium shadow-sm flex items-center cursor-pointer">
                    <span class="material-icons text-[18px] mr-2">add</span>
                    Nuevo Registro
                  </button>
                  <button class="border border-surface-300 text-surface-800 hover:bg-surface-200 transition-colors rounded-md px-4 py-2 text-sm font-medium shadow-sm flex items-center cursor-pointer bg-white">
                    <span class="material-icons text-[18px] mr-2">filter_list</span>
                    Filtros
                  </button>
                  <button class="text-primary-600 hover:bg-primary-50 transition-colors rounded-md px-4 py-2 text-sm font-medium flex items-center cursor-pointer">
                    <span class="material-icons text-[18px] mr-2">download</span>
                    Exportar
                  </button>
                </div>
              </section>

              <hr class="border-surface-200" />

              <!-- Seccion Form Controls -->
              <section>
                 <h2 class="text-sm font-bold text-surface-800 mb-4 uppercase tracking-wider">Controles de Formulario</h2>
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Input -->
                    <div>
                      <label for="uikit-cliente-nombre" class="block text-sm font-medium text-surface-700 mb-1">Nombre del Cliente</label>
                      <input id="uikit-cliente-nombre" type="text" class="w-full bg-white border border-surface-300 rounded-md shadow-sm px-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow" placeholder="Ej. Acme Corp" />
                    </div>
                    <!-- Select -->
                    <div>
                      <label for="uikit-condicion-pago" class="block text-sm font-medium text-surface-700 mb-1">Condición de Pago</label>
                      <select id="uikit-condicion-pago" class="w-full bg-white border border-surface-300 rounded-md shadow-sm px-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow">
                        <option>Contado</option>
                        <option>Crédito 30 días</option>
                        <option>Crédito 60 días</option>
                      </select>
                    </div>
                    <!-- Toggle -->
                    <div class="flex flex-col justify-center">
                      <span class="block text-sm font-medium text-surface-700 mb-2">Estado del Cliente</span>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer" checked>
                        <div class="w-9 h-5 bg-surface-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                        <span class="ml-3 text-sm font-medium text-surface-900">Activo</span>
                      </label>
                    </div>
                 </div>
              </section>

              <hr class="border-surface-200" />

              <!-- Seccion Tabla -->
              <section>
                <h2 class="text-sm font-bold text-surface-800 mb-4 uppercase tracking-wider">Data Table (Alta Densidad)</h2>
                <div class="overflow-x-auto rounded-md border border-surface-200 shadow-sm bg-white">
                  <table class="w-full text-left text-sm text-surface-700">
                    <thead class="bg-surface-100 text-surface-600 font-semibold border-b border-surface-200">
                      <tr>
                        <th scope="col" class="px-4 py-2.5">ID</th>
                        <th scope="col" class="px-4 py-2.5">Empresa / Razón Social</th>
                        <th scope="col" class="px-4 py-2.5">Fecha Alta</th>
                        <th scope="col" class="px-4 py-2.5 text-right">Monto Base</th>
                        <th scope="col" class="px-4 py-2.5 text-center">Estado</th>
                        <th scope="col" class="px-4 py-2.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Fila 1 -->
                      <tr class="border-b border-surface-200 hover:bg-surface-50 transition-colors">
                        <td class="px-4 py-2 font-medium text-surface-900">EMP-001</td>
                        <td class="px-4 py-2">Acme Corporation S.A.</td>
                        <td class="px-4 py-2">12/08/2026</td>
                        <td class="px-4 py-2 text-right">$15,400.00</td>
                        <td class="px-4 py-2 text-center">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-green-100 text-green-800 border border-green-200">ACTIVO</span>
                        </td>
                        <td class="px-4 py-2 text-right">
                           <button class="text-surface-500 hover:text-primary-600 transition-colors px-1 cursor-pointer"><span class="material-icons text-[18px]">edit</span></button>
                        </td>
                      </tr>
                      <!-- Fila 2 -->
                      <tr class="border-b border-surface-200 hover:bg-surface-50 transition-colors">
                        <td class="px-4 py-2 font-medium text-surface-900">EMP-002</td>
                        <td class="px-4 py-2">Globex Inc.</td>
                        <td class="px-4 py-2">10/08/2026</td>
                        <td class="px-4 py-2 text-right">$3,200.50</td>
                        <td class="px-4 py-2 text-center">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-amber-100 text-amber-800 border border-amber-200">SUSPENDIDO</span>
                        </td>
                        <td class="px-4 py-2 text-right">
                           <button class="text-surface-500 hover:text-primary-600 transition-colors px-1 cursor-pointer"><span class="material-icons text-[18px]">edit</span></button>
                        </td>
                      </tr>
                      <!-- Fila 3 -->
                      <tr class="border-b border-surface-200 hover:bg-surface-50 transition-colors">
                        <td class="px-4 py-2 font-medium text-surface-900">EMP-003</td>
                        <td class="px-4 py-2">Soylent Corp</td>
                        <td class="px-4 py-2">05/08/2026</td>
                        <td class="px-4 py-2 text-right">$8,900.00</td>
                        <td class="px-4 py-2 text-center">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-green-100 text-green-800 border border-green-200">ACTIVO</span>
                        </td>
                        <td class="px-4 py-2 text-right">
                           <button class="text-surface-500 hover:text-primary-600 transition-colors px-1 cursor-pointer"><span class="material-icons text-[18px]">edit</span></button>
                        </td>
                      </tr>
                      <!-- Fila 4 -->
                      <tr class="border-b border-surface-200 hover:bg-surface-50 transition-colors">
                        <td class="px-4 py-2 font-medium text-surface-900">EMP-004</td>
                        <td class="px-4 py-2">Initech LLC</td>
                        <td class="px-4 py-2">01/08/2026</td>
                        <td class="px-4 py-2 text-right">$0.00</td>
                        <td class="px-4 py-2 text-center">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-red-100 text-red-800 border border-red-200">BAJA</span>
                        </td>
                        <td class="px-4 py-2 text-right">
                           <button class="text-surface-500 hover:text-primary-600 transition-colors px-1 cursor-pointer"><span class="material-icons text-[18px]">edit</span></button>
                        </td>
                      </tr>
                      <!-- Fila 5 -->
                      <tr class="border-b border-surface-200 hover:bg-surface-50 transition-colors">
                        <td class="px-4 py-2 font-medium text-surface-900">EMP-005</td>
                        <td class="px-4 py-2">Massive Dynamic</td>
                        <td class="px-4 py-2">28/07/2026</td>
                        <td class="px-4 py-2 text-right">$45,000.00</td>
                        <td class="px-4 py-2 text-center">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-green-100 text-green-800 border border-green-200">ACTIVO</span>
                        </td>
                        <td class="px-4 py-2 text-right">
                           <button class="text-surface-500 hover:text-primary-600 transition-colors px-1 cursor-pointer"><span class="material-icons text-[18px]">edit</span></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          </div>
        </main>
  `
})
export class UiKitPageComponent {}
