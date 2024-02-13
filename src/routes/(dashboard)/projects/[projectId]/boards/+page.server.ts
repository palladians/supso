import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { usersToProjects } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const userId = locals.user?.id;
	if (!userId) error(400);
	const parentData = await parent();
	const { projectId } = params;
	const project = await db.query.usersToProjects.findFirst({
		where: and(eq(usersToProjects.userId, userId), eq(usersToProjects.projectId, projectId)),
		with: { project: { with: { boards: true } } }
	});
	if (!project) return error(404);
	const boards = project.project.boards;
	return {
		boards,
		project: parentData.membership.project
	};
};
