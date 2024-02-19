import { db } from '$lib/db';
import { and, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { event as eventScheme, usersToProjects } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { take, sortBy, reverse } from 'rambda';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) error(400);
	const memberships = await db.query.usersToProjects.findMany({
		where: and(eq(usersToProjects.userId, userId)),
		with: {
			project: {
				with: {
					events: {
						orderBy: desc(eventScheme.createdAt),
						limit: 10,
						with: { assignee: true, comments: { with: { user: true } } }
					}
				}
			}
		}
	});
	if (!memberships) error(401);
	const events = memberships.map((membership) => membership.project.events).flat();
	const comments = events.map((event) => event.comments).flat();
	const lastTenEvents = take(10, events);
	const lastTenComments = take(6, reverse(sortBy((comment) => comment.createdAt, comments)));
	return {
		lastTenEvents,
		lastTenComments
	};
};
