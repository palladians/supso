import { db } from '$lib/db';
import { project, usersToProjects } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from '../../../$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const createdProject = await db.transaction(async (tx) => {
			const [createdProject] = await tx
				.insert(project)
				.values({
					name,
					ownerId: userId
				})
				.returning();
			await tx.insert(usersToProjects).values({
				userId: userId,
				projectId: createdProject.id,
				role: 'admin'
			});
			return createdProject;
		});
		redirect(302, `/projects/${createdProject.id}`);
	}
};
