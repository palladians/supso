import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import { accessToken, user as userScheme } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { env as envPublic } from '$env/dynamic/public';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await db.query.user.findFirst({
		where: eq(userScheme.id, locals.user?.id ?? ''),
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
		accessToken: user.accessTokens[0],
		appUrl: envPublic.PUBLIC_APP_URL
	};
};
