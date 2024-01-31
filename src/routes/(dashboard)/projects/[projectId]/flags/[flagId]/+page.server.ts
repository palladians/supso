import { db } from '$lib/db';
import { featureFlag, usersToProjects } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from '../../$types';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { projectId, flagId } = params;
	const session = await locals.auth.validate();
	const membership = await db.query.usersToProjects.findFirst({
		where: and(
			eq(usersToProjects.userId, session.user.userId),
			eq(usersToProjects.projectId, projectId)
		),
		with: { project: { with: { featureFlags: true } } }
	});
	if (!membership) return error(400);
	const flag = membership.project.featureFlags.find((flag) => flag.id === flagId);
	return {
		flag
	};
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const { projectId, flagId } = params;
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
		await db
			.update(featureFlag)
			.set({
				name,
				description,
				updatedAt: Number(new Date()).toString()
			})
			.where(eq(featureFlag.id, flagId));
		redirect(302, `/projects/${projectId}/flags`);
	}
};
