import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { groupBy, take } from 'rambda';
import { usersToProjects } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { formatDateShort } from '$lib/format/date';
import { format, eachDayOfInterval } from 'date-fns';
import { enUS } from 'date-fns/locale';

const daysOfWeek = eachDayOfInterval({
	start: new Date(new Date().setDate(new Date().getDate() - 6)),
	end: new Date()
});

const weekdays = daysOfWeek.map((day) => format(day, 'P', { locale: enUS }));

const buildEventsChartData = ({ eventsByDate }: { eventsByDate: Record<string, any[]> }) => {
	return weekdays.map((date) => ({ date, events: eventsByDate[date]?.length ?? 0 }));
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	const membership = await db.query.usersToProjects.findFirst({
		where: and(
			eq(usersToProjects.projectId, params.projectId),
			eq(usersToProjects.userId, session.user.userId)
		),
		with: {
			project: {
				with: {
					events: true
				}
			}
		}
	});
	if (!membership) error(401);
	const eventsByDate = groupBy(
		(events) => events.date,
		membership.project.events.map((event) => ({
			...event,
			date: formatDateShort(event.createdAt ?? '')
		}))
	);
	const eventsChartData = buildEventsChartData({ eventsByDate });
	const lastFiveEvents = take(5, membership.project.events);

	return { role: membership.role, lastFiveEvents, eventsChartData };
};
