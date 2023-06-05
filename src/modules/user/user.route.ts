import type { FastifyInstance } from 'fastify';
import { $ref } from '../schema';
import { getUsersHandler, loginHandler, registerUserHandler } from './user.controller';

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: { 201: $ref('createUserResponseSchema') },
      },
    },
    registerUserHandler,
  );

  server.post(
    '/login',
    { schema: { body: $ref('loginSchema'), response: { 200: $ref('loginResponseSchema') } } },
    loginHandler,
  );

  server.get('/', { preHandler: [server.authenticate] }, getUsersHandler);

  return Promise.resolve();
}

export default userRoutes;
