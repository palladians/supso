import { auth } from '$lib/auth';
import { db } from '$lib/db';
import { accessToken } from '$lib/db/schema';
import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

const getUserByBearer = async (bearer: string) => {
	if (bearer.length === 0) return;
	const tokens = await db.query.accessToken.findFirst({
		where: eq(accessToken.id, bearer),
		with: {
			user: true
		}
	});
	return tokens?.user;
};

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const { headers } = event.request;
	const authorization = headers.get('authorization');
	const bearer = authorization?.split(' ')[1] ?? '';
	const apiUser = await getUserByBearer(bearer);
	event.locals.apiUser = apiUser;
	return await resolve(event);
};
