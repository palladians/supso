import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) return Response.json({ ok: true });
	await auth.invalidateAllUserSessions(session.user.userId);
	return redirect(302, '/signin');
};
