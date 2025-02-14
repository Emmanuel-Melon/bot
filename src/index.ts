import fastify from 'fastify';
import { config } from 'dotenv';
import { userRoutes } from './modules/user/router';
import { notificationRoutes } from './modules/notifications/router';

// Load environment variables
config();

const server = fastify({
  logger: true,
});

// Register routes
server.register(userRoutes, { prefix: '/api/users' });
server.register(notificationRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await server.listen({ port: 8080 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
