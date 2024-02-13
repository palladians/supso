import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import {
	projectInvitation,
	project as projectScheme,
	user as userScheme,
	usersToProjects,
	webhook
} from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	updateProject: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const ownerId = formData.get('ownerId')?.toString() ?? '';
		const admin = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.projectId, params.projectId),
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.role, 'admin')
			)
		});
		if (!admin) error(401);
		await db
			.update(projectScheme)
			.set({
				name,
				ownerId,
				updatedAt: Number(new Date()).toString()
			})
			.where(eq(projectScheme.id, params.projectId));
		redirect(302, `/projects/${params.projectId}/settings`);
	},
	inviteMember: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const admin = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.projectId, params.projectId),
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.role, 'admin')
			)
		});
		if (!admin) error(401);
		const user = await db.query.user.findFirst({
			where: eq(userScheme.email, email),
			with: {
				usersToProjects: true
			}
		});
		if (!user) error(400, 'This user does not exist.');
		const alreadyJoined = user?.usersToProjects.some(
			(membership) => membership.projectId === params.projectId
		);
		if (alreadyJoined) error(400, 'This user is already a member.');
		await db.insert(projectInvitation).values({
			projectId: params.projectId,
			userId: user.id
		});
		redirect(302, `/projects/${params.projectId}/settings`);
	},
	deleteInvitation: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const admin = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.projectId, params.projectId),
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.role, 'admin')
			)
		});
		if (!admin) error(401);
		const invitationId = formData.get('invitationId')?.toString() ?? '';
		await db.delete(projectInvitation).where(eq(projectInvitation.id, invitationId));
		redirect(302, `/projects/${params.projectId}/settings`);
	},
	removeMember: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const admin = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.projectId, params.projectId),
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.role, 'admin')
			)
		});
		if (!admin) error(401);
		const removalUserId = formData.get('userId')?.toString() ?? '';
		await db
			.delete(usersToProjects)
			.where(
				and(
					eq(usersToProjects.userId, removalUserId),
					eq(usersToProjects.projectId, params.projectId)
				)
			);
		redirect(302, `/projects/${params.projectId}/settings`);
	},
	updateRole: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const admin = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.projectId, params.projectId),
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.role, 'admin')
			)
		});
		if (!admin) error(401);
		const updateUserId = formData.get('userId')?.toString() ?? '';
		const role = formData.get('role')?.toString() ?? 'member';
		await db
			.update(usersToProjects)
			.set({
				role: role as never
			})
			.where(
				and(
					eq(usersToProjects.userId, updateUserId),
					eq(usersToProjects.projectId, params.projectId)
				)
			);
		redirect(302, `/projects/${params.projectId}/settings`);
	},
	deleteProject: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const admin = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.projectId, params.projectId),
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.role, 'admin')
			)
		});
		if (!admin) error(401);
		const projectId = formData.get('projectId')?.toString() ?? '';
		await db.delete(projectScheme).where(eq(projectScheme.id, projectId));
		redirect(302, '/projects');
	},
	deleteWebhook: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const admin = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.projectId, params.projectId),
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.role, 'admin')
			),
			with: {
				project: {
					with: {
						webhooks: true
					}
				}
			}
		});
		if (!admin) return error(401);
		const webhookId = formData.get('id')?.toString() ?? '';
		if (!admin.project.webhooks.some((webhook) => webhook.id === webhookId)) return error(404);
		await db.delete(webhook).where(eq(webhook.id, webhookId));
		redirect(302, `/projects/${params.projectId}/settings`);
	},
	addWebhook: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const admin = await db.query.usersToProjects.findFirst({
			where: and(
				eq(usersToProjects.projectId, params.projectId),
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.role, 'admin')
			)
		});
		if (!admin) return error(401);
		const service = formData.get('service')?.toString() ?? '';
		const url = formData.get('url')?.toString() ?? '';
		await db.insert(webhook).values({
			projectId: params.projectId,
			service: service as 'discord',
			url
		});
		redirect(302, `/projects/${params.projectId}/settings`);
	}
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const userId = locals.user?.id;
	if (!userId) error(400);
	const membership = await db.query.usersToProjects.findFirst({
		where: and(
			eq(usersToProjects.projectId, params.projectId),
			eq(usersToProjects.userId, userId),
			eq(usersToProjects.role, 'admin')
		),
		with: {
			project: {
				with: {
					usersToProjects: { with: { user: true } },
					projectInvitations: { with: { user: true } },
					webhooks: true
				}
			}
		}
	});
	if (!membership) return error(401);
	const membersOptions = membership.project.usersToProjects
		.map((userToProject) => userToProject.user)
		.map((member) => ({
			label: member.username,
			value: member.id
		}));
	return {
		project: membership.project,
		members: membership.project.usersToProjects,
		membersOptions,
		projectInvitations: membership.project.projectInvitations,
		webhooks: membership.project.webhooks
	};
};
