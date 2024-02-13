import { lucia } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) return Response.json({ ok: true });
	await lucia.invalidateUserSessions(userId);
	return redirect(302, '/signin');
};
