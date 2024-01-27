import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import { usersToProjects } from '$lib/db/schema';

export const GET: RequestHandler = async ({ locals, request }) => {
	const { searchParams } = new URL(request.url);
	const projectId = searchParams.get('projectId');
	const user = locals.apiUser;
	if (!user) return error(400, 'Unauthorized');
	const memberships = await db.query.usersToProjects.findMany({
		where: and(
			eq(usersToProjects.userId, user.id),
			projectId ? eq(usersToProjects.projectId, projectId) : undefined
		),
		with: {
			project: {
				with: {
					events: true
				}
			}
		}
	});
	const events = memberships.map((membership) => membership.project.events).flat();
	return Response.json({ events });
};
