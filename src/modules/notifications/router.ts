import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { NotificationService } from '../../services/notifications';

const headerSchema = z.object({
  'x-signature': z.string()
});

const payloadSchema = z.object({
  status: z.string(),
  run_id: z.string(),
  repo: z.string(),
  commit: z.string(),
  actor: z.string(),
  details_url: z.string(),
  test_results: z.string()
});

export async function notificationRoutes(fastify: FastifyInstance) {
  const notificationService = new NotificationService();

  fastify.post('/github-notifications', {
    schema: {
      headers: {
        type: 'object',
        required: ['x-signature'],
        properties: {
          'x-signature': { type: 'string' }
        }
      }
    },
    handler: async (request, reply) => {
      try {
        const headers = headerSchema.parse(request.headers);
        const payload = payloadSchema.parse(request.body);

        // Verify signature
        if (headers['x-signature'] !== process.env.API_SIGNATURE) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        await notificationService.processNotification(payload);
        return { status: 'notifications_triggered' };
      } catch (error) {
        fastify.log.error('Notification failed', error);
        return reply.code(500).send({ error: 'Notification processing failed' });
      }
    }
  });
}
