export interface OrderItemInput {
  idItem: string;
  quantidadeItem: number;
  valorItem: number;
}

export interface OrderInput {
  numeroPedido: string;
  valorTotal: number;
  dataCriacao: string; // ISO com timezone
  items: OrderItemInput[];
}

// Modelo interno (já transformado)
export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderEntity {
  orderId: string;
  value: number;
  creationDate: Date;
  items: OrderItem[];
}
