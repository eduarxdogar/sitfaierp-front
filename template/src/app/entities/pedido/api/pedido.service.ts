import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pedido, EstadoPedido } from '../models/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  // private apiUrl = 'http://localhost:8085/api/v1/pedidos';

  getAll(): Observable<Pedido[]> {
    // Mocking for preview purposes, since there's no backend running at 8085 in this isolated environment.
    return of([
      { id: '1', numeroPedido: 'PED-001', fechaCreacion: new Date('2026-08-10'), estado: EstadoPedido.COMPLETADO, clienteId: 'CLI-001', total: 1500.50 },
      { id: '2', numeroPedido: 'PED-002', fechaCreacion: new Date('2026-08-11'), estado: EstadoPedido.PENDIENTE, clienteId: 'CLI-002', total: 320.00 },
      { id: '3', numeroPedido: 'PED-003', fechaCreacion: new Date('2026-08-12'), estado: EstadoPedido.EN_PROCESO, clienteId: 'CLI-003', total: 5400.00 },
      { id: '4', numeroPedido: 'PED-004', fechaCreacion: new Date('2026-08-13'), estado: EstadoPedido.CANCELADO, clienteId: 'CLI-001', total: 120.00 },
    ]).pipe(delay(500));
  }

  getById(id: string): Observable<Pedido> {
    console.log(id); // Use the variable
    throw new Error('Not implemented');
  }
}
