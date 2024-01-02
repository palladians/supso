import { db } from '$lib/db';
import { and, desc, eq } from 'drizzle-orm';
import type { PageServerLoad, RouteParams } from './$types';
import { groupBy, take } from 'rambda';
import { event, project } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { formatDateShort } from '$lib/format/date';
import colors from 'tailwindcss/colors';
import { format, eachDayOfInterval } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { ChartData } from 'chart.js';

const daysOfWeek = eachDayOfInterval({
	start: new Date(new Date().setDate(new Date().getDate() - 6)),
	end: new Date()
});

const weekdays = daysOfWeek.map((day) => format(day, 'P', { locale: enUS }));

const buildChartTemplate = ({
	dates,
	events
}: {
	dates: string[];
	events: number[];
}): ChartData<'bar', (number | [number, number])[], unknown> => ({
	labels: dates,
	datasets: [
		{
			label: 'Events',
			data: events,
			backgroundColor: [colors.cyan[500]],
			borderWidth: 2,
			borderColor: [colors.cyan[300]],
			borderRadius: 8
		}
	]
});

const fetchEvents = async ({ params, session }: { params: RouteParams; session: any }) => {
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
		where: and(eq(event.projectId, currentProject.id)),
		orderBy: desc(event.createdAt)
	});
};

const buildEventsChartData = ({ eventsByDate }: { eventsByDate: Record<string, any[]> }) => {
	const dateEvents = weekdays.map((date) => ({ date, events: eventsByDate[date]?.length ?? 0 }));
	return buildChartTemplate({
		dates: dateEvents.map((entry) => entry.date),
		events: dateEvents.map((entry) => entry.events)
	});
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	const events = await fetchEvents({ session, params });
	const eventsByDate = groupBy(
		(events) => events.date,
		events.map((event) => ({ ...event, date: formatDateShort(event.createdAt ?? '') }))
	);
	const eventsChartData = buildEventsChartData({ eventsByDate });
	const lastFiveEvents = take(5, events);

	return { lastFiveEvents, eventsChartData };
};
