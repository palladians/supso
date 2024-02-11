import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import { accessToken, user as userScheme } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	const user = await db.query.user.findFirst({
		where: eq(userScheme.id, session.user.userId),
		with: {
			accessTokens: {
				where: eq(accessToken.internal, 'true')
			},
			usersToProjects: {
				with: {
					project: true
				}
			}
		}
	});
	if (!user) return error(404);
	return {
		projects: user.usersToProjects.map((membership) => membership.project),
		accessToken: user.accessTokens[0]
	};
};