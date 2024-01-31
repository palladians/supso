import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { featureFlag, usersToProjects } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	toggleFlag: async ({ request, locals, params }) => {
		const { projectId } = params;
		const session = await locals.auth.validate();
		const membership = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.userId, session.user.userId),
				eq(usersToProjects.projectId, projectId)
			),
			with: { project: { with: { featureFlags: true } } }
		});
		if (!membership) return error(400);
		const formData = await request.formData();
		const flagId = formData.get('flagId')?.toString() ?? '';
		const flag = membership.project.featureFlags.find((flag) => flag.id === flagId);
		if (!flag) return error(404);
		const enabled = flag.enabled === 'true';
		await db
			.update(featureFlag)
			.set({
				enabled: String(!enabled),
				updatedAt: Number(new Date()).toString()
			})
			.where(eq(featureFlag.id, flag.id));
		redirect(302, `/projects/${projectId}/flags`);
	},
	deleteFlag: async ({ request, locals, params }) => {
		const { projectId } = params;
		const session = await locals.auth.validate();
		const membership = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.userId, session.user.userId),
				eq(usersToProjects.projectId, projectId)
			),
			with: { project: { with: { featureFlags: true } } }
		});
		if (!membership) return error(400);
		const formData = await request.formData();
		const flagId = formData.get('id')?.toString() ?? '';
		await db
			.delete(featureFlag)
			.where(and(eq(featureFlag.id, flagId), eq(featureFlag.projectId, projectId)));
		redirect(302, `/projects/${projectId}/flags`);
	}
};

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const parentData = await parent();
	const { projectId } = params;
	const session = await locals.auth.validate();
	const project = await db.query.usersToProjects.findFirst({
		where: and(
			eq(usersToProjects.userId, session.user.userId),
			eq(usersToProjects.projectId, projectId)
		),
		with: { project: { with: { featureFlags: true } } }
	});
	if (!project) return error(404);
	const featureFlags = project.project.featureFlags;
	return {
		featureFlags,
		project: parentData.membership.project
	};
};
