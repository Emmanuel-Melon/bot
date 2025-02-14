import fastify from 'fastify';
import { userRoutes } from './modules/user/router';

const server = fastify({
  logger: true,
});

// Register routes
server.register(userRoutes, { prefix: '/api/users' });

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
