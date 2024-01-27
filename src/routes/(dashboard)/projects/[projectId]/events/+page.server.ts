import { db } from '$lib/db';
import { and, desc, eq, lt } from 'drizzle-orm';
import type { PageServerLoad, RouteParams } from './$types';
import { event as eventScheme, project } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { uniq } from 'rambda';

const PAGE_SIZE = 10;

const fetchEvents = async ({
	params,
	session,
	lastCursor,
	channel,
	event
}: {
	params: RouteParams;
	session: any;
	lastCursor: string | null;
	channel: string | null;
	event: string | null;
}) => {
	const currentProject = await db.query.project.findFirst({
		where: eq(project.id, params.projectId),
		with: { usersToProjects: true }
	});
	if (!currentProject) return error(400, 'Project not found');
	const membershipExists = currentProject.usersToProjects.some(
		(userToProject) => userToProject.userId === session.user.userId
	);
	if (!membershipExists) return error(400, 'Unauthorized.');
	return db.query.event.findMany({
		where: and(
			eq(eventScheme.projectId, currentProject.id),
			lastCursor ? lt(eventScheme.createdAt, lastCursor) : undefined,
			channel ? eq(eventScheme.channel, channel) : undefined,
			event ? eq(eventScheme.event, event) : undefined
		),
		orderBy: desc(eventScheme.createdAt),
		limit: PAGE_SIZE
	});
};

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const lastCursor = url.searchParams.get('last_cursor');
	const channel = url.searchParams.get('channel');
	const event = url.searchParams.get('event');
	const session = await locals.auth.validate();
	const events = await fetchEvents({ session, params, lastCursor, channel, event });
	const channels = uniq(events.map((event) => event.channel));
	const eventNames = uniq(events.map((event) => event.event));
	const pages = Math.floor(events.length / PAGE_SIZE);

	return { events, channels, eventNames, pages };
};
