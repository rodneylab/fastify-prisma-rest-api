import type { FastifyReply, FastifyRequest } from 'fastify';
import { server } from '../../app';
import { verifyPassword } from '../../utils/hash';
import type { CreateUserInput, LoginInput } from './user.schema';
import { createUser, findUers, findUserByEmail } from './user.service';

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  const { body } = request;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (error: unknown) {
    console.error(error as string);
    return reply.code(500);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) {
  const {
    body: { email, password: candidatePassword },
  } = request;

  const user = await findUserByEmail(email);

  if (user) {
    const { password: hash, salt } = user;
    const correctPassword = verifyPassword({
      candidatePassword,
      salt,
      hash,
    });

    if (correctPassword) {
      const { ...rest } = user;

      return { accessToken: server.jwt.sign(rest) };
    }
  }

  return reply.code(401).send({ message: 'Invalid email or password' });
}

export async function getUsersHandler() {
  const users = await findUers();

  return users;
}
