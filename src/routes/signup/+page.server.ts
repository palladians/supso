import { db } from '$lib/db';
import { user, verificationCode } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

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
		console.log(code.id);
		// TODO: send email
	}
};
