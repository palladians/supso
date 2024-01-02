import { db } from '$lib/db';
import { accessToken, user } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Actions } from '../../$types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	const accessTokens = await db.query.accessToken.findMany({
		where: eq(accessToken.userId, session.user.userId)
	});
	return {
		accessTokens
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const formData = await request.formData();
		const username = formData.get('username')?.toString() ?? '';
		await db
			.update(user)
			.set({
				username
			})
			.where(eq(user.id, session.user.userId));
		return redirect(302, '/profile');
	},
	createToken: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const formData = await request.formData();
		const tokenName = formData.get('name')?.toString() ?? '';
		await db.insert(accessToken).values({
			name: tokenName,
			userId: session.user.userId
		});
		return redirect(302, '/profile');
	},
	deleteToken: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		await db
			.delete(accessToken)
			.where(and(eq(accessToken.id, id), eq(accessToken.userId, session.user.userId)));
		return redirect(302, '/profile');
	}
};
