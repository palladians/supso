import { db } from '$lib/db';
import {
	accessToken,
	projectInvitation,
	user as userScheme,
	usersToProjects
} from '$lib/db/schema';
import { eq, and, not } from 'drizzle-orm';
import type { Actions } from '../../$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await db.query.user.findFirst({
		where: eq(userScheme.id, locals.user?.id ?? ''),
		with: {
			accessTokens: {
				where: not(eq(accessToken.internal, 'true'))
			},
			projectInvitations: {
				with: {
					project: true
				}
			}
		}
	});
	return {
		accessTokens: user?.accessTokens,
		projectInvitations: user?.projectInvitations
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString() ?? '';
		await db
			.update(userScheme)
			.set({
				username,
				updatedAt: Number(new Date()).toString()
			})
			.where(eq(userScheme.id, locals.user?.id ?? ''));
		return redirect(302, '/profile');
	},
	createToken: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) return error(400);
		const formData = await request.formData();
		const tokenName = formData.get('name')?.toString() ?? '';
		await db.insert(accessToken).values({
			name: tokenName,
			userId,
			internal: 'false'
		});
		return redirect(302, '/profile');
	},
	deleteToken: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		await db.delete(accessToken).where(and(eq(accessToken.id, id), eq(accessToken.userId, userId)));
		return redirect(302, '/profile');
	},
	acceptInvitation: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const invitation = await db.query.projectInvitation.findFirst({
			where: and(eq(projectInvitation.id, id), eq(projectInvitation.userId, userId))
		});
		if (!invitation) error(400);
		await db.transaction(async (t) => {
			const [membership] = await t
				.insert(usersToProjects)
				.values({
					projectId: invitation.projectId,
					userId: invitation.userId,
					role: 'member'
				})
				.returning();
			await t.delete(projectInvitation).where(eq(projectInvitation.id, id));
			return membership;
		});
		return redirect(302, '/profile');
	},
	rejectInvitation: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const invitation = await db.query.projectInvitation.findFirst({
			where: and(eq(projectInvitation.id, id), eq(projectInvitation.userId, userId))
		});
		if (!invitation) error(400);
		await db.delete(projectInvitation).where(eq(projectInvitation.id, id));
		return redirect(302, '/profile');
	}
};
