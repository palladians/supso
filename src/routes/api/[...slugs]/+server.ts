import { Elysia, t } from 'elysia';
import type { RequestHandler } from './$types';
import { swagger } from '@elysiajs/swagger';

const app = new Elysia({ prefix: '/api' })
	.use(swagger())
	.get('/', () => 'hi')
	.post('/', ({ body }) => body, {
		body: t.Object({
			name: t.String()
		})
	});

export const GET: RequestHandler = ({ request }) => app.handle(request);
export const POST: RequestHandler = ({ request }) => app.handle(request);
