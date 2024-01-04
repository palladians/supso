import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { board as boardScheme } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

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
	const boardEvents = board.project.events.filter((event) => {
		const tags = event.tags as Record<string, any>;
		return tags[board.tag];
	});
	const boardOptions = board.options as string[];
	const eventsByOption = boardOptions.map((option) => [
		option,
		boardEvents.filter((event) => {
			const tags = event.tags as Record<string, any>;
			return tags[board.tag] === option;
		})
	]);
	return { board, eventsByOption };
};
