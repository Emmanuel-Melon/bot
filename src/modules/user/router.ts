import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../../services/user';
import { createUserSchema, updateUserSchema } from './schema';

const userService = new UserService();

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = createUserSchema.parse(request.body);
      const user = await userService.create(data);
      return reply.code(201).send(user);
    } catch (error) {
      return reply.code(400).send(error);
    }
  });

  fastify.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await userService.findAll();
    return reply.send(users);
  });

  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = await userService.findById(request.params.id);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    return reply.send(user);
  });

  fastify.patch('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const data = updateUserSchema.parse(request.body);
      const user = await userService.update(request.params.id, data);
      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }
      return reply.send(user);
    } catch (error) {
      return reply.code(400).send(error);
    }
  });

  fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const deleted = await userService.delete(request.params.id);
    if (!deleted) {
      return reply.code(404).send({ message: 'User not found' });
    }
    return reply.code(204).send();
  });
}
