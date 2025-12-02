import { OrderService } from '../src/services/order.service';

describe('OrderService - regras de negócio', () => {
  it('deve rejeitar pedido com valorTotal diferente da soma dos itens', async () => {
    const service = new OrderService();

    const input = {
      numeroPedido: 'v1000001',
      valorTotal: 100,
      dataCriacao: '2023-07-19T12:24:11.5299601+00:00',
      items: [
        {
          idItem: '1',
          quantidadeItem: 1,
          valorItem: 50
        }
      ]
    };

    await expect(service.createOrder(input as any)).rejects.toThrow(
      /Valor total inconsistente/
    );
  });
});
