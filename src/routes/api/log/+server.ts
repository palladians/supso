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
	const body = await request.json();
	const eventPayload = insertEventSchema.extend({ notify: z.boolean().optional() }).parse(body);
	const membership = await db.query.usersToProjects.findFirst({
		where: and(
			eq(usersToProjects.userId, locals.apiUser.id),
			eq(usersToProjects.projectId, eventPayload.projectId)
		),
		with: { project: { with: { events: true } } }
	});
	const project = membership?.project;
	if (!project) return error(404, 'Not found');
	const context = parser.getResult();
	const eventBody = {
		projectId: project.id,
		channel: eventPayload.channel,
		event: eventPayload.event,
		content: eventPayload.content,
		emoji: eventPayload.emoji,
		notify: eventPayload.notify ? 'true' : 'false',
		tags: eventPayload.tags,
		context
	};
	const result = await db.insert(eventScheme).values(eventBody);
	return Response.json(result);
};
