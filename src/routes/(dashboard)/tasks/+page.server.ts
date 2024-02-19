import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { and, desc, eq } from 'drizzle-orm';
import { usersToProjects, event as eventScheme } from '$lib/db/schema';

export const actions: Actions = {
	resolveTask: async ({ request }) => {
		const formData = await request.formData();
		const taskId = formData.get('taskId')?.toString() ?? '';
		await db.update(eventScheme).set({ resolved: 'true' }).where(eq(eventScheme.id, taskId));
		return redirect(302, '/tasks');
	}
};

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
						where: and(eq(eventScheme.assigneeId, userId), eq(eventScheme.resolved, 'false'))
					}
				}
			}
		}
	});
	if (!memberships) error(401);
	const events = memberships
		.map((membership) =>
			membership.project.events.map((event) => ({
				...event,
				project: { id: membership.project.id, name: membership.project.name }
			}))
		)
		.flat();
	return {
		events
	};
};
