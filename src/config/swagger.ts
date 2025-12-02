export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API de Pedidos - Teste Técnico',
    version: '1.0.0',
    description: 'API para gerenciar pedidos (criação, leitura, atualização e exclusão).'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Servidor local' }
  ],
  paths: {
    '/order': {
      post: {
        summary: 'Criar novo pedido',
        tags: ['Pedidos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
                properties: {
                  numeroPedido: { type: 'string', example: 'v10089015vdb-01' },
                  valorTotal: { type: 'number', example: 10000 },
                  dataCriacao: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-07-19T12:24:11.5299601+00:00'
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['idItem', 'quantidadeItem', 'valorItem'],
                      properties: {
                        idItem: { type: 'string', example: '2434' },
                        quantidadeItem: { type: 'number', example: 1 },
                        valorItem: { type: 'number', example: 1000 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Pedido criado com sucesso'
          },
          '400': {
            description: 'Erro de validação'
          }
        }
      }
    },
    '/order/{orderId}': {
      get: {
        summary: 'Obter um pedido pelo número',
        tags: ['Pedidos'],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Número do pedido (orderId)'
          }
        ],
        responses: {
          '200': {
            description: 'Pedido encontrado'
          },
          '404': {
            description: 'Pedido não encontrado'
          }
        }
      },
      put: {
        summary: 'Atualizar um pedido existente',
        tags: ['Pedidos'],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
                properties: {
                  valorTotal: { type: 'number', example: 1000 },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['idItem', 'quantidadeItem', 'valorItem'],
                      properties: {
                        idItem: { type: 'string', example: '2434' },
                        quantidadeItem: { type: 'number', example: 1 },
                        valorItem: { type: 'number', example: 1000 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Pedido atualizado'
          },
          '400': { 
            description: 'Erro de validação'
          },
          '404': {
            description: 'Pedido não encontrado'
          }
        }
      },
      delete: {
        summary: 'Deletar um pedido',
        tags: ['Pedidos'],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Pedido deletado'
          },
          '404': {
            description: 'Pedido não encontrado'
          }
        }
      }
    },
    '/order/list/all': {
      get: {
        summary: 'Listar todos os pedidos',
        tags: ['Pedidos'],
        parameters: [],
        responses: {
          '200': {
            description: 'Lista de pedidos'
          }
        }
      }
    }
  },
  components: {}
};
