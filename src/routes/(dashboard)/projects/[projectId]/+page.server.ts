import { db } from '$lib/db';
import { and, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { groupBy, take } from 'rambda';
import { usersToProjects, event as eventScheme } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { formatDateShort } from '$lib/format/date';
import { format, eachDayOfInterval, eachMonthOfInterval, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';

const daysTillNow = ({ span }: { span: number }) =>
	eachDayOfInterval({
		start: new Date(new Date().setDate(new Date().getDate() - span)),
		end: new Date()
	});

const buildEventsChartData = ({
	groupedEvents,
	duration
}: {
	groupedEvents: Record<string, any[]>;
	duration: string;
}) => {
	let timespan;
	switch (duration) {
		case '1w':
			timespan = daysTillNow({ span: 6 });
			break;
		case '1m':
			timespan = daysTillNow({ span: 30 });
			break;
		case '1y':
			timespan = eachMonthOfInterval({
				start: subMonths(new Date(), 12),
				end: new Date()
			});
	}
	if (!timespan) return;
	return timespan
		.map((day) => format(day, duration === '1y' ? 'y-MM' : 'P', { locale: enUS }))
		.map((date) => ({ date, events: groupedEvents[date]?.length ?? 0 }));
};

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { searchParams } = url;
	const duration = searchParams.get('duration') ?? '1w';
	const session = await locals.auth.validate();
	const membership = await db.query.usersToProjects.findFirst({
		where: and(
			eq(usersToProjects.projectId, params.projectId),
			eq(usersToProjects.userId, session.user.userId)
		),
		with: {
			project: {
				with: {
					events: {
						orderBy: desc(eventScheme.createdAt)
					}
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
	const eventsByMonth = groupBy(
		(events) => (events?.createdAt ? format(new Date(parseInt(events.createdAt)), 'y-MM') : ''),
		membership.project.events.map((event) => ({
			...event,
			date: formatDateShort(event.createdAt ?? '')
		}))
	);
	const eventsChartData = buildEventsChartData({
		groupedEvents: duration === '1y' ? eventsByMonth : eventsByDate,
		duration
	});
	const lastFiveEvents = take(5, membership.project.events);

	return {
		role: membership.role,
		lastFiveEvents,
		eventsChartData,
		project: membership.project,
		duration
	};
};
