export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

export interface Pedido {
  id: string;
  numeroPedido: string;
  fechaCreacion: string | Date;
  estado: EstadoPedido;
  clienteId: string;
  total: number;
}
