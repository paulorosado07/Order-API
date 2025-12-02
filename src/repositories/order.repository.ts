import { prisma } from '../config/database';
import { OrderEntity } from '../models/order.model';

export class OrderRepository {
  async create(order: OrderEntity) {
    return prisma.order.create({
      data: {
        orderId: order.orderId,
        value: order.value,
        creationDate: order.creationDate,
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
  }

  async findById(orderId: string) {
    return prisma.order.findUnique({
      where: { orderId },
      include: { items: true }
    });
  }

  async list(filters?: { minValue?: number; maxValue?: number; startDate?: Date; endDate?: Date }) {
    const where: any = {};

    if (filters?.minValue !== undefined || filters?.maxValue !== undefined) {
      where.value = {};
      if (filters.minValue !== undefined) {
        where.value.gte = filters.minValue;
      }
      if (filters.maxValue !== undefined) {
        where.value.lte = filters.maxValue;
      }
    }

    if (filters?.startDate || filters?.endDate) {
      where.creationDate = {};
      if (filters.startDate) where.creationDate.gte = filters.startDate;
      if (filters.endDate) where.creationDate.lte = filters.endDate;
    }

    return prisma.order.findMany({
      where,
      orderBy: { creationDate: 'desc' }
    });
  }

  async update(orderId: string, order: Omit<OrderEntity, 'orderId' | 'creationDate'>) {
    // Como o PUT substitui tudo (menos creationDate), removemos todos os itens e criamos de novo
    return prisma.order.update({
      where: { orderId },
      data: {
        value: order.value,
        items: {
          deleteMany: {},
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
  }

  async delete(orderId: string) {
    return prisma.order.delete({
      where: { orderId }
      // onDelete: Cascade já está na relação, então Items são deletados juntos
    });
  }
}
