import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { board as boardScheme } from '$lib/db/schema';

export const GET: RequestHandler = async ({ locals, request }) => {
	const { searchParams } = new URL(request.url);
	const boardId = searchParams.get('boardId');
	if (!boardId) return error(404, 'Not found');
	const user = locals.apiUser;
	if (!user) return error(400, 'Unauthorized');
	let interval: NodeJS.Timeout;
	const readable = new ReadableStream({
		start(controller) {
			interval = setInterval(async () => {
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
				if (!board) return error(404, 'Not found');
				const permitted = board.project?.usersToProjects?.some(
					(membership) => membership.userId === user.id
				);
				if (!permitted) return error(400, 'Unauthorized');
				controller.enqueue(`data: ${JSON.stringify({ eventsOrder: board.eventsOrder })}`);
			}, 5000);
		},
		cancel() {
			clearInterval(interval);
		}
	});
	return new Response(readable, {
		headers: {
			'content-type': 'text/event-stream'
		}
	});
};
