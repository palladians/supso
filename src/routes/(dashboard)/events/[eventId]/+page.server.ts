import { db } from '$lib/db';
import { and, eq, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { event as eventScheme, board as boardScheme } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
	setAssignee: async ({ request, params }) => {
		const { eventId } = params;
		const formData = await request.formData();
		const assigneeId = formData.get('assigneeId')?.toString() ?? '';
		await db.update(eventScheme).set({ assigneeId }).where(eq(eventScheme.id, eventId));
	},
	setDueDate: async ({ request, params }) => {
		const { eventId } = params;
		const formData = await request.formData();
		const dueDate = formData.get('dueDate')?.toString() ?? '';
		await db.update(eventScheme).set({ dueDate }).where(eq(eventScheme.id, eventId));
	},
	updateTags: async ({ request, params }) => {
		const { eventId } = params;
		const formData = await request.formData();
		const tagKeys = formData.getAll('tag.key');
		const tagValues = formData.getAll('tag.value');
		const tags = {} as Record<string, string>;
		tagKeys.forEach((key, i) => {
			tags[key.toString()] = tagValues[i].toString();
		});
		await db.update(eventScheme).set({ tags }).where(eq(eventScheme.id, eventId));
	},
	updateContent: async ({ request, params }) => {
		const { eventId } = params;
		const formData = await request.formData();
		const content = formData.get('content')?.toString() ?? '';
		await db.update(eventScheme).set({ content }).where(eq(eventScheme.id, eventId));
	}
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	const event = await db.query.event.findFirst({
		where: eq(eventScheme.id, params.eventId),
		with: { project: { with: { usersToProjects: { with: { user: true } } } } }
	});
	if (!event) return error(400);
	const viewAllowed = event.project?.usersToProjects.some(
		(userToProject) => userToProject.userId === session.user.userId
	);
	if (!viewAllowed) return error(404);
	const tags = event.tags ? Object.keys(event.tags) : [];
	const boards =
		tags.length > 0
			? await db.query.board.findMany({
					where: and(eq(boardScheme.projectId, event.projectId), inArray(boardScheme.tag, tags))
				})
			: [];
	const projectMembers = event.project.usersToProjects.map((membership) => ({
		value: membership.user.id,
		label: membership.user.username
	}));
	return { event, project: event.project, boards, projectMembers };
};
