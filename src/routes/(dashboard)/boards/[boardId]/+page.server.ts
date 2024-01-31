import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { board as boardScheme, event as eventScheme } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	updateEventsOrder: async ({ request, locals, params }) => {
		const { boardId } = params;
		const session = await locals.auth.validate();
		const board = await db.query.board.findFirst({
			where: eq(boardScheme.id, boardId),
			with: {
				project: {
					with: {
						usersToProjects: true
					}
				}
			}
		});
		if (!board) return error(404);
		const permitted = board.project.usersToProjects.some(
			(userToProject) => userToProject.userId === session.user.userId
		);
		if (!permitted) return error(400);
		const formData = await request.formData();
		const eventsOrder = formData.get('eventsOrder')?.toString() ?? '';
		await db
			.update(boardScheme)
			.set({
				eventsOrder,
				updatedAt: Number(new Date()).toString()
			})
			.where(eq(boardScheme.id, boardId));
		redirect(302, `/boards/${boardId}`);
	},
	updateEventTag: async ({ request, locals, params }) => {
		const { boardId } = params;
		const session = await locals.auth.validate();
		const board = await db.query.board.findFirst({
			where: eq(boardScheme.id, boardId),
			with: {
				project: {
					with: {
						usersToProjects: true,
						events: true
					}
				}
			}
		});
		if (!board) return error(404);
		const permitted = board.project.usersToProjects.some(
			(userToProject) => userToProject.userId === session.user.userId
		);
		if (!permitted) return error(400);
		const formData = await request.formData();
		const eventId = formData.get('eventId')?.toString();
		const event = board.project.events.find((event) => event.id === eventId);
		if (!event) return error(400, 'Event not found');
		const key = formData.get('key');
		const value = formData.get('value');
		const updatedTags = {
			...event.tags,
			[key]: value
		};
		await db
			.update(eventScheme)
			.set({
				tags: updatedTags,
				updatedAt: Number(new Date()).toString()
			})
			.where(eq(eventScheme.id, eventId ?? ''));
		redirect(302, `/boards/${boardId}`);
	},
	deleteEvent: async ({ request, locals, params }) => {
		const { boardId } = params;
		const session = await locals.auth.validate();
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const board = await db.query.board.findFirst({
			where: eq(boardScheme.id, boardId),
			with: {
				project: {
					with: {
						usersToProjects: true,
						events: {
							where: eq(eventScheme.id, id ?? '')
						}
					}
				}
			}
		});
		if (!board) return error(404);
		const permitted = board.project.usersToProjects.some(
			(userToProject) => userToProject.userId === session.user.userId
		);
		if (!permitted) return error(400);
		await db.delete(eventScheme).where(eq(eventScheme.id, board.project.events[0].id));
		redirect(302, `/boards/${boardId}`);
	}
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	const board = await db.query.board.findFirst({
		where: eq(boardScheme.id, params.boardId),
		with: { project: { with: { usersToProjects: true, events: true } } }
	});
	if (!board) return error(400);
	const viewAllowed = board.project?.usersToProjects.some(
		(userToProject) => userToProject.userId === session.user.userId
	);
	if (!viewAllowed) return error(404);
	return { board, project: board.project };
};
