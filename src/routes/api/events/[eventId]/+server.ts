import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { event as eventScheme } from '$lib/db/schema';

export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) return error(400);
	const event = await db.query.event.findFirst({
		where: eq(eventScheme.id, params.eventId),
		with: { project: { with: { usersToProjects: true } } }
	});
	if (!event) return error(404);
	const permitted = event.project.usersToProjects.some(
		(userToProject) => userToProject.userId === session.user.userId
	);
	if (!permitted) return error(404);
	return Response.json({ event });
};
