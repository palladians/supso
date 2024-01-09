import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { usersToProjects } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.apiUser) return error(403);
	const projects = (
		await db.query.usersToProjects.findMany({
			where: eq(usersToProjects.userId, locals.apiUser.id),
			with: { project: { with: { featureFlags: true } } }
		})
	).map((userToProject) => userToProject.project);
	const currentProject = projects.find((project) => project.id === params.projectId);
	if (!currentProject) throw new Error('Unauthorized');
	const flags = currentProject.featureFlags.map((flag) => [flag.name, flag.enabled === 'true']);
	return Response.json(Object.fromEntries(flags));
};
