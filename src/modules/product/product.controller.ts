import type { FastifyRequest } from 'fastify';
import { CreateProductInput } from './product.schema';
import { createProduct, getProducts } from './product.service';

export async function createProductHandler(request: FastifyRequest<{ Body: CreateProductInput }>) {
  const {
    body,
    user: { id: ownerId },
  } = request;
  const product = await createProduct({
    ...body,
    ownerId,
  });

  return product;
}

export async function getProductsHandler() {
  const products = await getProducts();

  return products;
}
