import fastify from 'fastify';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const server = fastify({
  logger: true
});

// Get host and port from environment variables with defaults
const host = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '8080', 10);

// Add your routes here
server.get('/', async (request, reply) => {
  return { status: 'ok' };
});

// Start the server
const start = async () => {
  try {
    await server.listen({ port, host });
    console.log(`Server is running on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
