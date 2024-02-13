import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { verificationCode } from '$lib/db/schema';
import { lucia } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const userId = formData.get('userId')?.toString() ?? '';
		const code = formData.get('code')?.toString() ?? '';
		const verification = await db.query.verificationCode.findFirst({
			where: and(eq(verificationCode.userId, userId), eq(verificationCode.code, code))
		});
		if (!verification) return error(401, 'Invalid token!');
		const session = await lucia.createSession(verification.userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes as never);
		redirect(302, '/projects');
	}
};
