import { z } from 'zod';

export const OrderItemInputSchema = z.object({
  idItem: z.string().regex(/^\d+$/, {
    message: 'idItem deve conter apenas dígitos'
  }),
  quantidadeItem: z.number().int().min(0, {
    message: 'quantidadeItem não pode ser negativa'
  }),
  valorItem: z.number().int().min(0, {
    message: 'valorItem não pode ser negativo'
  })
});

export const OrderInputSchema = z.object({
  numeroPedido: z.string().min(1, { message: 'numeroPedido é obrigatório' }),
  valorTotal: z.number().int().min(0, { message: 'valorTotal não pode ser negativo' }),
  dataCriacao: z
    .string()
    .datetime({ offset: true, message: 'dataCriacao deve estar em formato ISO com timezone' }),
  items: z
    .array(OrderItemInputSchema)
    .min(1, { message: 'É obrigatório ter pelo menos um item' })
}).strict(); // .strict() rejeita campos extras


export const OrderUpdateSchema = z.object({
  valorTotal: z.number().int().min(0),
  items: z.array(OrderItemInputSchema).min(1)
}).strict();
