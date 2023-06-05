import { buildJsonSchemas } from 'fastify-zod';
import { productModels } from './product/product.schema';
import { userModels } from './user/user.schema';

const jsonSchemas = buildJsonSchemas({
  ...productModels,
  ...userModels,
});
const { $ref } = jsonSchemas;

export { jsonSchemas as default, $ref };
