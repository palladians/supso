import { db } from '$lib/db';
import { and, asc, desc, eq, gt, lt } from 'drizzle-orm';
import type { PageServerLoad, RouteParams } from './$types';
import { event as eventScheme, project } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { uniq } from 'rambda';

const PAGE_SIZE = 10;

const fetchEvents = async ({
	params,
	userId,
	fromDate,
	toDate,
	channel,
	event,
	order
}: {
	params: RouteParams;
	userId: string;
	fromDate: string | null;
	toDate: string | null;
	channel: string | null;
	event: string | null;
	order: string | null;
}) => {
	const currentProject = await db.query.project.findFirst({
		where: eq(project.id, params.projectId),
		with: { usersToProjects: true }
	});
	if (!currentProject) return error(400, 'Project not found');
	const membershipExists = currentProject.usersToProjects.some(
		(userToProject) => userToProject.userId === userId
	);
	if (!membershipExists) return error(400, 'Unauthorized.');
	return db.query.event.findMany({
		where: and(
			eq(eventScheme.projectId, currentProject.id),
			fromDate ? gt(eventScheme.createdAt, fromDate) : undefined,
			toDate ? lt(eventScheme.createdAt, toDate) : undefined,
			channel ? eq(eventScheme.channel, channel) : undefined,
			event ? eq(eventScheme.event, event) : undefined
		),
		orderBy: order === 'asc' ? asc(eventScheme.createdAt) : desc(eventScheme.createdAt),
		limit: PAGE_SIZE
	});
};

export const load: PageServerLoad = async ({ locals, params, url, parent }) => {
	const userId = locals.user?.id;
	if (!userId) error(400);
	const parentData = await parent();
	const fromDate = url.searchParams.get('from');
	const toDate = url.searchParams.get('to');
	const channel = url.searchParams.get('channel');
	const event = url.searchParams.get('event');
	const order = url.searchParams.get('order');
	const events = await fetchEvents({ userId, params, fromDate, toDate, channel, event, order });
	const channels = uniq(events.map((event) => event.channel));
	const eventNames = uniq(events.map((event) => event.event));
	const pages = Math.floor(events.length / PAGE_SIZE);

	return { events, channels, eventNames, pages, project: parentData.membership.project };
};
