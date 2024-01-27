import { error, redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { user as userScheme } from '$lib/db/schema';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/signin');
	const user = await db.query.user.findFirst({
		where: eq(userScheme.id, session.user.userId),
		with: { accessTokens: true, usersToProjects: { with: { project: true } } }
	});
	if (!user) return error(400);
	const projects = user?.usersToProjects.map((membership) => membership.project);
	return {
		user,
		projects
	};
};
