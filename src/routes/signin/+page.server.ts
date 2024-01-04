import { db } from '$lib/db';
import { user, verificationCode } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SECRET_PLUNK_API_KEY } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';

const ensureUser = async ({ email }: { email: string }) => {
	const existingUser = await db.query.user.findFirst({ where: eq(user.email, email) });
	if (existingUser) return existingUser;
	const [newUser] = await db
		.insert(user)
		.values({
			email,
			username: uniqueNamesGenerator({
				dictionaries: [adjectives, colors, animals]
			})
		})
		.returning();
	return newUser;
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/projects');
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
				userId: existingUser.id,
				expires: Date.now() + 1000 * 60 * 5
			})
			.returning();
		const emailRequest = await fetch('https://api.useplunk.com/v1/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SECRET_PLUNK_API_KEY}`
			},
			body: JSON.stringify({
				to: email,
				subject: 'Sign in to Supso',
				body: `Sign in: ${PUBLIC_APP_URL}/verify?token=${code.id}`
			})
		});
		const response = (await emailRequest.json()) as { success: boolean };
		if (!response.success) return redirect(302, '/signin?error=true');
		return redirect(302, '/signin?success=true');
	}
};
