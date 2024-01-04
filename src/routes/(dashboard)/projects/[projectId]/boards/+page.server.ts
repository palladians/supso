import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { usersToProjects } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { projectId } = params;
	const session = await locals.auth.validate();
	const project = await db.query.usersToProjects.findFirst({
		where: and(
			eq(usersToProjects.userId, session.user.userId),
			eq(usersToProjects.projectId, projectId)
		),
		with: { project: { with: { boards: true } } }
	});
	if (!project) return error(404);
	const boards = project.project.boards;
	return {
		boards
	};
};
