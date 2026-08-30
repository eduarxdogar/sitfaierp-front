import { inject, Injectable, signal } from '@angular/core';
import { Pedido } from '../../../entities/pedido/models/pedido.interface';
import { PedidoService } from '../../../entities/pedido/api/pedido.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoStore {
  private pedidoService = inject(PedidoService);

  readonly pedidos = signal<Pedido[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  loadPedidos(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        this.pedidos.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error loading pedidos');
        this.isLoading.set(false);
      }
    });
  }
}
