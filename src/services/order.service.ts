import { OrderInput, OrderEntity, OrderItem } from "../models/order.model";
import { OrderRepository } from "../repositories/order.repository";
import { OrderInputSchema, OrderUpdateSchema } from "../schemas/order.schema";

export class OrderService {
  private orderRepository = new OrderRepository();

  private consolidateItems(items: OrderItem[]): OrderItem[] {
    const map = new Map<number, OrderItem>();

    for (const item of items) {
      const existing = map.get(item.productId);
      if (existing) {
        map.set(item.productId, {
          productId: item.productId,
          quantity: existing.quantity + item.quantity,
          price: item.price, // assumindo mesmo preço por produto
        });
      } else {
        map.set(item.productId, { ...item });
      }
    }

    return Array.from(map.values());
  }

  private ensureTotalsMatch(value: number, items: OrderItem[]) {
    const calculated = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (calculated !== value) {
      throw new Error(
        `Valor total inconsistente. valorTotal esperado: ${value}, mas a soma dos itens é ${calculated}.`
      );
    }
  }

  private mapInputToEntity(input: OrderInput): OrderEntity {
    const items: OrderItem[] = input.items.map((i) => ({
      productId: parseInt(i.idItem, 10),
      quantity: i.quantidadeItem,
      price: i.valorItem,
    }));

    const consolidatedItems = this.consolidateItems(items);

    this.ensureTotalsMatch(input.valorTotal, consolidatedItems);

    return {
      orderId: input.numeroPedido,
      value: input.valorTotal,
      creationDate: new Date(input.dataCriacao),
      items: consolidatedItems,
    };
  }

  async createOrder(rawData: unknown) {
    try {
      // Validação de esquema
      const parsed = OrderInputSchema.parse(rawData);

      const entity = this.mapInputToEntity(parsed);
      const created = await this.orderRepository.create(entity);

      // HATEOAS + envelope
      return {
        orderId: created.orderId,
        links: [
          {
            rel: "self",
            href: `http://localhost:3000/order/${created.orderId}`,
            method: "GET",
          },
        ],
      };
    } catch (err: any) {
      // 🔥 ERRO DO PRISMA -> orderId duplicado
      if (err.code === "P2002") {
        let orderId =
          typeof rawData === "object" &&
          rawData !== null &&
          "numeroPedido" in rawData
            ? rawData.numeroPedido
            : "";
        const e: any = new Error(
          `Já existe um pedido com o orderId ${orderId}`
        );
        e.statusCode = 400;
        e.error = "Bad Request";
        throw e;
      }

      throw err;
    }
  }

  async getOrder(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      const error: any = new Error("Pedido não encontrado");
      error.statusCode = 404;
      error.error = "Not Found";
      throw error;
    }

    // Monta resposta no formato ORIGINAL
    return {
      numeroPedido: order.orderId,
      valorTotal: order.value,
      dataCriacao: order.creationDate.toISOString(),
      items: order.items.map((item) => ({
        idItem: item.productId.toString(),
        quantidadeItem: item.quantity,
        valorItem: item.price,
      })),
    };
  }

  async listOrders(query: any) {
    const filters: {
      minValue?: number;
      maxValue?: number;
      startDate?: Date;
      endDate?: Date;
    } = {};

    if (query.minValue) filters.minValue = Number(query.minValue);
    if (query.maxValue) filters.maxValue = Number(query.maxValue);
    if (query.startDate) filters.startDate = new Date(query.startDate);
    if (query.endDate) filters.endDate = new Date(query.endDate);

    const orders = await this.orderRepository.list(filters);

    return orders.map((o) => ({
      orderId: o.orderId,
      value: o.value,
      creationDate: o.creationDate.toISOString(),
      links: [
        {
          rel: "self",
          href: `http://localhost:3000/order/${o.orderId}`,
          method: "GET",
        },
      ],
    }));
  }

  async updateOrder(orderId: string, rawData: unknown) {
    // valida apenas valorTotal e items
    const parsed = OrderUpdateSchema.parse(rawData);

    const existing = await this.orderRepository.findById(orderId);

    if (!existing) {
      const error: any = new Error("Pedido não encontrado para atualização");
      error.statusCode = 404;
      error.error = "Not Found";
      throw error;
    }

    // criar entidade com dataCriacao preservada
    const items: OrderItem[] = parsed.items.map((i) => ({
      productId: parseInt(i.idItem, 10),
      quantity: i.quantidadeItem,
      price: i.valorItem,
    }));

    const consolidated = this.consolidateItems(items);
    this.ensureTotalsMatch(parsed.valorTotal, consolidated);

    // chama repositório
    const updated = await this.orderRepository.update(orderId, {
      value: parsed.valorTotal,
      items: consolidated,
    });

    return {
        numeroPedido: updated.orderId,
        valorTotal: updated.value,
        dataCriacao: updated.creationDate.toISOString(),
        items: updated.items.map((item) => ({
          idItem: item.productId.toString(),
          quantidadeItem: item.quantity,
          valorItem: item.price,
        })),
      };
  }

  async deleteOrder(orderId: string) {
    const existing = await this.orderRepository.findById(orderId);
    if (!existing) {
      const error: any = new Error("Pedido não encontrado para exclusão");
      error.statusCode = 404;
      error.error = "Not Found";
      throw error;
    }

    await this.orderRepository.delete(orderId);

    return {
      message: "Pedido deletado com sucesso",
    };
  }
}
