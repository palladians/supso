import { error, redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { db } from '$lib/db';
import { desc, eq } from 'drizzle-orm';
import { user as userScheme, event as eventScheme, type Event, type Project } from '$lib/db/schema';
import { sortBy } from 'rambda';

export const load: LayoutServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) throw redirect(302, '/signin');
	const user = await db.query.user.findFirst({
		where: eq(userScheme.id, userId),
		with: {
			accessTokens: true,
			usersToProjects: {
				with: {
					project: {
						with: {
							events: {
								where: eq(eventScheme.notify, 'true'),
								limit: 5,
								orderBy: desc(eventScheme.createdAt)
							}
						}
					}
				}
			}
		}
	});
	if (!user) return error(400);
	const projects: (Project & { events: Event[] })[] = user?.usersToProjects.map(
		(membership) => membership.project
	);
	const notifications = sortBy(
		(event: Event) => event.createdAt ?? '',
		projects.map((project) => project.events).flat()
	).reverse();
	return {
		user,
		projects,
		notifications
	};
};
