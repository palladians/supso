import { db } from '$lib/db';
import { accessToken, user, verificationCode } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env as envPrivate } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';

const ensureUser = async ({ email }: { email: string }) => {
	const existingUser = await db.query.user.findFirst({ where: eq(user.email, email) });
	if (existingUser) return existingUser;
	const newUser = await db.transaction(async (tx) => {
		const [newUser] = await tx
			.insert(user)
			.values({
				email,
				username: uniqueNamesGenerator({
					dictionaries: [adjectives, colors, animals]
				})
			})
			.returning();
		await tx.insert(accessToken).values({ name: 'Default', userId: newUser.id, internal: 'true' });
		return newUser;
	});
	return newUser;
};

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) throw redirect(302, '/projects');
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const existingUser = await ensureUser({ email });
		await db.delete(verificationCode).where(eq(verificationCode.userId, existingUser.id));
		const [code] = await db
			.insert(verificationCode)
			.values({
				email: existingUser.email,
				userId: existingUser.id
			})
			.returning();
		const emailRequest = await fetch('https://api.useplunk.com/v1/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${envPrivate.SECRET_PLUNK_API_KEY}`
			},
			body: JSON.stringify({
				to: email,
				subject: 'Sign in to Supso',
				body: `Verification code: ${code.code}`
			})
		});
		const response = (await emailRequest.json()) as { success: boolean };
		if (!response.success) return error(500, 'Bad Plunk request');
		return redirect(302, `/verify?uid=${code.userId}`);
	}
};
