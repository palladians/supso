import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { insertEventSchema, usersToProjects, event as eventScheme } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request, locals }) => {
	const parser = new UAParser(request.headers.get('user-agent'));
	if (!locals.apiUser) return error(403);
	const body = await request.json<Event>();
	const eventPayload = insertEventSchema.extend({ notify: z.boolean() }).parse(body);
	const projects = (
		await db.query.usersToProjects.findMany({
			where: and(
				eq(usersToProjects.userId, locals.apiUser.id),
				eq(usersToProjects.projectId, eventPayload.projectId)
			),
			with: { project: { with: { events: true } } }
		})
	).map((userToProject) => userToProject.project);
	const permitted = projects.length > 0;
	if (!permitted) return error(404);
	const context = parser.getResult();
	const result = await db.insert(eventScheme).values({
		projectId: eventPayload.projectId,
		channel: eventPayload.channel,
		event: eventPayload.event,
		content: eventPayload.content,
		emoji: eventPayload.emoji,
		notify: eventPayload.notify ? 'true' : 'false',
		tags: eventPayload.tags,
		context
	});
	return Response.json(result);
};
