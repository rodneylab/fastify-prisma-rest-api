import type { FastifyInstance } from 'fastify';
import { $ref } from '../schema';
import { createProductHandler, getProductsHandler } from './product.controller';

async function productRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: { 201: $ref('productResponseSchema') },
      },
    },
    createProductHandler,
  );

  server.get(
    '/',
    {
      schema: {
        response: { 200: $ref('productsResponseSchema') },
      },
    },
    getProductsHandler,
  );

  return Promise.resolve();
}

export default productRoutes;
