import { db } from '$lib/db';
import { and, desc, eq, lt } from 'drizzle-orm';
import type { PageServerLoad, RouteParams } from './$types';
import { event, project } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { uniq } from 'rambda';

const PAGE_SIZE = 10;

const fetchEvents = async ({
	params,
	session,
	lastCursor
}: {
	params: RouteParams;
	session: any;
	lastCursor: string | null;
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
			eq(event.projectId, currentProject.id),
			lastCursor ? lt(event.createdAt, lastCursor) : undefined
		),
		orderBy: desc(event.createdAt),
		limit: PAGE_SIZE
	});
};

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const lastCursor = url.searchParams.get('last_cursor');
	const session = await locals.auth.validate();
	const events = await fetchEvents({ session, params, lastCursor });
	const channels = uniq(events.map((event) => event.channel));
	const eventNames = uniq(events.map((event) => event.event));
	const pages = Math.floor(events.length / PAGE_SIZE);

	return { events, channels, eventNames, pages };
};
