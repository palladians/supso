import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { usersToProjects } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	const parentData = await parent();
	const membership = await db.query.usersToProjects.findFirst({
		where: and(
			eq(usersToProjects.projectId, params.projectId),
			eq(usersToProjects.userId, parentData.user.id)
		),
		with: {
			project: true
		}
	});
	if (!membership) error(401);
	return {
		membership
	};
};
