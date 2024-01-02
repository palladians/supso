import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { event as eventScheme } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	const event = await db.query.event.findFirst({
		where: eq(eventScheme.id, params.eventId),
		with: { project: { with: { usersToProjects: true } } }
	});
	if (!event) return error(400);
	const viewAllowed = event.project?.usersToProjects.some(
		(userToProject) => userToProject.userId === session.user.userId
	);
	if (!viewAllowed) return error(404);
	return { event };
};
