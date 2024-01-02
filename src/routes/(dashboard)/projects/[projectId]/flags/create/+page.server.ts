import { db } from '$lib/db';
import { featureFlag, usersToProjects } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from '../../$types';
import { and, eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const { projectId } = params;
		const session = await locals.auth.validate();
		const membership = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.userId, session.user.userId),
				eq(usersToProjects.projectId, projectId)
			)
		});
		if (!membership) return error(400);
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const description = formData.get('description')?.toString() ?? '';
		await db.insert(featureFlag).values({
			name,
			description,
			projectId
		});
		redirect(302, `/projects/${projectId}`);
	}
};
