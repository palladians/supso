import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { and, eq, gt } from 'drizzle-orm';
import { event as eventScheme, usersToProjects } from '$lib/db/schema';
import { getTime, sub } from 'date-fns';

export const GET: RequestHandler = async ({ locals, request }) => {
	const { searchParams } = new URL(request.url);
	const projectId = searchParams.get('projectId');
	const user = locals.apiUser;
	if (!user) return error(400, 'Unauthorized');
	let interval: NodeJS.Timeout;
	const readable = new ReadableStream({
		start(controller) {
			interval = setInterval(async () => {
				const fiveSecondsAgo = getTime(sub(new Date(), { seconds: 5 }));
				const memberships = await db.query.usersToProjects.findMany({
					where: and(
						eq(usersToProjects.userId, user.id),
						projectId ? eq(usersToProjects.projectId, projectId) : undefined
					),
					with: {
						project: {
							with: {
								events: {
									where: gt(eventScheme.createdAt, fiveSecondsAgo.toString())
								}
							}
						}
					}
				});
				const events = memberships.map((membership) => membership.project.events).flat();
				controller.enqueue(`data: ${JSON.stringify(events)}`);
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
