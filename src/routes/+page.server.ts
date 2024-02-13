import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;
	if (userId) throw redirect(302, '/projects');
	if (!userId) throw redirect(302, '/signin');
};
