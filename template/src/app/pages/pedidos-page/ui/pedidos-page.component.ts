import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PedidoStore } from '../../../features/pedidos-list/store/pedido.store';
import { PedidosTableComponent } from '../../../features/pedidos-list/ui/pedidos-table.component';

@Component({
  selector: 'app-pedidos-page',
  standalone: true,
  imports: [PedidosTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-surface-900">Gestión de Pedidos</h1>
          <p class="text-sm text-surface-500 mt-1">Consulta y administra los pedidos del sistema.</p>
        </div>
        <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-not-allowed opacity-80" title="Solo lectura en esta demo">
          Nuevo Pedido
        </button>
      </header>

      <main>
        @if (store.isLoading()) {
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        } @else if (store.error()) {
          <div class="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
            {{ store.error() }}
          </div>
        } @else {
          <app-pedidos-table [pedidos]="store.pedidos()"></app-pedidos-table>
        }
      </main>
    </div>
  `
})
export class PedidosPageComponent implements OnInit {
  store = inject(PedidoStore);

  ngOnInit(): void {
    this.store.loadPedidos();
  }
}
