import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Pedido, EstadoPedido } from '../../../entities/pedido/models/pedido.interface';

@Component({
  selector: 'app-pedidos-table',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-auto rounded-lg border border-surface-200 shadow-sm">
      <table class="w-full text-sm text-left text-surface-700">
        <thead class="text-xs text-surface-500 uppercase bg-surface-50 border-b border-surface-200">
          <tr>
            <th scope="col" class="px-4 py-3 font-medium">Nº Pedido</th>
            <th scope="col" class="px-4 py-3 font-medium">Fecha</th>
            <th scope="col" class="px-4 py-3 font-medium">Cliente ID</th>
            <th scope="col" class="px-4 py-3 font-medium">Estado</th>
            <th scope="col" class="px-4 py-3 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          @for (pedido of pedidos(); track pedido.id) {
            <tr class="bg-white border-b border-surface-100 hover:bg-surface-50 transition-colors">
              <td class="px-4 py-3 font-medium text-surface-900">{{ pedido.numeroPedido }}</td>
              <td class="px-4 py-3">{{ pedido.fechaCreacion | date:'mediumDate' }}</td>
              <td class="px-4 py-3">{{ pedido.clienteId }}</td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" 
                      [class]="getEstadoClass(pedido.estado)">
                  {{ pedido.estado }}
                </span>
              </td>
              <td class="px-4 py-3 text-right font-medium text-surface-900">{{ pedido.total | currency }}</td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="px-4 py-8 text-center text-surface-500">
                No hay pedidos disponibles.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class PedidosTableComponent {
  pedidos = input.required<Pedido[]>();

  getEstadoClass(estado: EstadoPedido): string {
    switch (estado) {
      case EstadoPedido.COMPLETADO:
        return 'bg-green-100 text-green-800 border border-green-200';
      case EstadoPedido.PENDIENTE:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case EstadoPedido.EN_PROCESO:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case EstadoPedido.CANCELADO:
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-surface-100 text-surface-800 border border-surface-200';
    }
  }
}
