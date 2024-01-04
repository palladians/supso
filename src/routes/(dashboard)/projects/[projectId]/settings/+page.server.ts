import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { project as projectScheme } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
	toggleFlag: async ({ request, locals, params }) => {}
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	const project = await db.query.project.findFirst({
		where: eq(projectScheme.id, params.projectId),
		with: { usersToProjects: { with: { user: true } } }
	});
	if (!project) return error(404);
	const permitted = project.usersToProjects.some(
		(userToProject) => userToProject.userId === session.user.userId
	);
	if (!permitted) return error(400);
	const members = project.usersToProjects;
	const membersOptions = members
		.map((userToProject) => userToProject.user)
		.map((member) => ({
			label: member.username,
			value: member.id
		}));
	return { project, members, membersOptions };
};
