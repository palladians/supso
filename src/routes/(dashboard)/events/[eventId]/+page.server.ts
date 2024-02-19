import { db } from '$lib/db';
import { and, desc, eq, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { event as eventScheme, board as boardScheme, comment } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';

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
	},
	setResolved: async ({ params }) => {
		const { eventId } = params;
		await db.update(eventScheme).set({ resolved: 'true' }).where(eq(eventScheme.id, eventId));
	},
	undoResolved: async ({ params }) => {
		const { eventId } = params;
		await db.update(eventScheme).set({ resolved: 'false' }).where(eq(eventScheme.id, eventId));
	},
	addComment: async ({ params, request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const { eventId } = params;
		const formData = await request.formData();
		const content = formData.get('content')?.toString() ?? '';
		await db.insert(comment).values({ content, eventId, userId });
		redirect(302, `/events/${eventId}`);
	},
	updateComment: async ({ params, request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const content = formData.get('content')?.toString() ?? '';
		await db.update(comment).set({ content, edited: 'true' }).where(eq(comment.id, id));
		redirect(302, `/events/${params.eventId}`);
	},
	deleteComment: async ({ params, request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(400);
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		await db.delete(comment).where(eq(comment.id, id));
		redirect(302, `/events/${params.eventId}`);
	}
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const event = await db.query.event.findFirst({
		where: eq(eventScheme.id, params.eventId),
		with: {
			project: { with: { usersToProjects: { with: { user: true } } } },
			comments: { with: { user: true }, orderBy: desc(comment.createdAt) }
		}
	});
	if (!event) return error(400);
	const viewAllowed = event.project?.usersToProjects.some(
		(userToProject) => userToProject.userId === locals.user?.id
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
