import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { board as boardScheme } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	updateBoard: async ({ request, locals, params }) => {
		const { boardId } = params;
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
			(userToProject) => userToProject.userId === locals.user?.id
		);
		if (!permitted) return error(400);
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const tag = formData.get('tag')?.toString() ?? '';
		const tagValues = formData.get('tagValues')?.toString() ?? '';
		const tagValuesArray = tagValues.split(',');
		await db
			.update(boardScheme)
			.set({
				name,
				tag,
				options: tagValuesArray,
				updatedAt: Number(new Date()).toString()
			})
			.where(eq(boardScheme.id, boardId));
		redirect(302, `/boards/${boardId}/settings`);
	},
	deleteBoard: async ({ request, locals, params }) => {
		const { boardId } = params;
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
			(userToProject) => userToProject.userId === locals.user?.id
		);
		if (!permitted) return error(400);
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		await db.delete(boardScheme).where(eq(boardScheme.id, id));
		redirect(302, `/projects/${board.project.id}/boards`);
	}
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const board = await db.query.board.findFirst({
		where: eq(boardScheme.id, params.boardId),
		with: { project: { with: { usersToProjects: true, events: true } } }
	});
	if (!board) return error(400);
	const viewAllowed = board.project?.usersToProjects.some(
		(userToProject) => userToProject.userId === locals.user?.id
	);
	if (!viewAllowed) return error(404);
	return { board };
};
