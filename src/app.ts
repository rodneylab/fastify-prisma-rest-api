import fastifyJwt from '@fastify/jwt';
import 'dotenv/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import { register } from 'fastify-zod';
import { version } from '../package.json';
import productRoutes from './modules/product/product.route';
import jsonSchemas from './modules/schema';
import userRoutes from './modules/user/user.route';

export const server = Fastify();

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (req: unknown, rep: unknown) => void;
  }
}

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      email: string;
      name: string;
      id: number;
    };
  }
}

const jwtSecret = process.env.JWT_SECRET;
if (typeof jwtSecret === 'undefined') {
  throw new Error('JWT_SECRET must be defined');
}

void server.register(fastifyJwt, {
  secret: jwtSecret,
});

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (error: unknown) {
    return reply.send(error as string);
  }
});

server.get('/health_check', function () {
  return { status: 'OK' };
});

async function main() {
  await register(server, {
    jsonSchemas,
    swaggerOptions: {
      swagger: {
        info: {
          title: 'Fastify Prisma REST API Tutorial',
          description: 'Example Fastify API with Swagger docs.',
          version,
        },
      },
    },
    swaggerUiOptions: {
      routePrefix: '/docs',
      staticCSP: true,
    },
  });

  try {
    await server.register(productRoutes, { prefix: 'api/products' });
    await server.register(userRoutes, { prefix: 'api/users' });
    await server.listen({
      host: '0.0.0.0',
      port: 4000,
    });
    console.log(`Server ready at
		http://localhost:4000`);
  } catch (error: unknown) {
    console.error(error as string);
    process.exit(1);
  }
}

void main();
