import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import { usersToProjects } from '$lib/db/schema';
import { Feed } from 'feed';
import { PUBLIC_APP_URL } from '$env/static/public';

export const GET: RequestHandler = async ({ locals, request }) => {
	const projectId = request.params;
	const user = locals.apiUser;
	if (!user) return error(400, 'Unauthorized');
	const memberships = await db.query.usersToProjects.findMany({
		where: and(
			eq(usersToProjects.userId, user.id),
			projectId ? eq(usersToProjects.projectId, projectId) : undefined
		),
		with: {
			project: {
				with: {
					events: { limit: 50 }
				}
			}
		}
	});
	const { project } = memberships[0];
	const feed = new Feed({
		title: `${project.name} Events`,
		description: `${project.name} events feed.`,
		id: 'http://app.supso.co/',
		link: 'http://app.supso.co/',
		language: 'en',
		copyright: `${new Date().getFullYear()} Supso`
	});
	project.events.forEach((event) => {
		feed.addItem({
			title: event.event,
			description: `${project.name}: ${event.event} in ${event.channel}`,
			content: event.content ?? '',
			date: new Date(parseInt(event.createdAt ?? '')),
			link: PUBLIC_APP_URL + '/events/' + event.id
		});
	});
	return new Response(feed.rss2(), { headers: { 'Content-Type': 'text/xml' } });
};
