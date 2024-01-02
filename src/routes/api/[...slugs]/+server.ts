import { Elysia, t } from 'elysia';
import type { RequestHandler } from './$types';
import { swagger } from '@elysiajs/swagger';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { accessToken, event } from '$lib/db/schema';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-country';

const singleEmojiRegex =
	/^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?\uFE0F?|\p{Emoji_Component}\uFE0F?|\u200D\p{Emoji}\uFE0F?|\u200D\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?\uFE0F?|\u200D\p{Emoji_Component}\uFE0F?)+$/u;

const app = new Elysia({ prefix: '/api' })
	.use(swagger({ documentation: { info: { title: 'Supso API', version: '0.1.0' } } }))
	.guard(
		{
			headers: t.Object({
				authorization: t.TemplateLiteral('Bearer ${string}'),
				'user-agent': t.String(),
				'X-Forwarded-For': t.Optional(t.String())
			})
		},
		(api) =>
			api
				.resolve(async ({ headers: { authorization } }) => {
					const bearer = authorization.split(' ')[1];
					if (!bearer) throw new Error('Missing token.');
					const user = (
						await db.query.accessToken.findFirst({
							where: eq(accessToken.id, bearer),
							with: { user: { with: { usersToProjects: { with: { project: true } } } } }
						})
					)?.user;
					if (!user) throw new Error('Invalid token.');
					const projects = user?.usersToProjects.map((userToProject) => userToProject.project);
					return {
						user,
						projects
					};
				})
				.post(
					'/log',
					async ({ body, projects, headers }) => {
						const parser = new UAParser(headers['user-agent']);
						const userInProject = projects.find((project) => project.id === body.projectId);
						if (!userInProject) throw new Error('Unauthorized');
						const geo = geoip.lookup(headers?.['X-Forwarded-For'] ?? '');
						const context = {
							...parser.getResult(),
							geo
						};
						return db.insert(event).values({
							projectId: body.projectId,
							channel: body.channel,
							event: body.event,
							content: body.content,
							emoji: body.emoji,
							notify: body.notify ? 'true' : 'false',
							tags: body.tags,
							context
						});
					},
					{
						body: t.Object({
							projectId: t.String({ minLength: 1 }),
							channel: t.String({ minLength: 1 }),
							event: t.String({ minLength: 1 }),
							content: t.Optional(t.String()),
							emoji: t.Optional(t.RegExp(singleEmojiRegex)),
							notify: t.Optional(t.Boolean()),
							tags: t.Optional(t.Record(t.String(), t.String()))
						})
					}
				)
				.ws('/on_event', {
					body: t.Object({
						projectId: t.String({ minLength: 1 })
					}),
					async message({ send, data }, { projectId }) {
						const userInProject = data.projects.find((project) => project.id === projectId);
						if (!userInProject) throw new Error('Unauthorized');
						const events = await db.query.event.findMany({ where: eq(event.projectId, projectId) });
						return send({ events });
					}
				})
	);

export const GET: RequestHandler = ({ request }) => app.handle(request);
export const POST: RequestHandler = ({ request }) => app.handle(request);
