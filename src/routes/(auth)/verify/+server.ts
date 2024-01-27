import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { verificationCode } from '$lib/db/schema';
import { auth } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const token = url.searchParams.get('token') ?? '';
	const verification = await db.query.verificationCode.findFirst({
		where: eq(verificationCode.id, token)
	});
	if (!verification) return error(401, 'Invalid token!');
	const session = await auth.createSession({
		userId: verification.userId,
		attributes: {}
	});
	const sessionCookie = auth.createSessionCookie(session);
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes as never);
	redirect(302, '/projects');
};
