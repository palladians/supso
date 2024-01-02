import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { usersToProjects } from '$lib/db/schema';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/signin');
	const projects = (
		await db.query.usersToProjects.findMany({
			where: eq(usersToProjects.userId, session.user.userId),
			with: { project: true }
		})
	).map((userToProject) => userToProject.project);
	return {
		user: session.user,
		projects
	};
};
