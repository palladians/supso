import { db } from '$lib/db';
import { board, usersToProjects } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from '../../$types';
import { and, eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const { projectId } = params;
		const membership = await db.query.usersToProjects.findFirst({
			where: and(eq(usersToProjects.userId, userId), eq(usersToProjects.projectId, projectId))
		});
		if (!membership) return error(400);
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const tag = formData.get('tag')?.toString() ?? '';
		const tagValues = formData.get('tagValues')?.toString() ?? '';
		const tagValuesArray = tagValues.split(',');
		await db.insert(board).values({
			name,
			tag,
			options: tagValuesArray,
			projectId
		});
		redirect(302, `/projects/${projectId}/boards`);
	}
};
