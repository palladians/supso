import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { eq, gt, or } from 'drizzle-orm';
import { board as boardScheme, event as eventScheme } from '$lib/db/schema';
import superjson from 'superjson';
import { getTime, sub } from 'date-fns';

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
				const fiveSecondsAgo = getTime(sub(new Date(), { seconds: 5 }));
				const board = await db.query.board.findFirst({
					where: eq(boardScheme.id, boardId),
					with: {
						project: {
							with: {
								usersToProjects: true,
								events: {
									where: or(
										gt(eventScheme.updatedAt, fiveSecondsAgo.toString()),
										gt(eventScheme.createdAt, fiveSecondsAgo.toString())
									)
								}
							}
						}
					}
				});
				if (!board) return error(404, 'Not found');
				const permitted = board.project?.usersToProjects?.some(
					(membership) => membership.userId === user.id
				);
				if (!permitted) return error(400, 'Unauthorized');
				const payload = superjson.stringify({
					eventsOrder: board.eventsOrder,
					events: board.project.events
				});
				controller.enqueue('data: ' + payload);
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
