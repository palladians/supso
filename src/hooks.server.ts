import { auth } from '$lib/auth';
import { getUserByBearer } from '$lib/auth/utils';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const { headers } = event.request;
	const authorization = headers.get('authorization');
	const bearer = authorization?.split(' ')[1] ?? '';
	const apiUser = await getUserByBearer(bearer);
	event.locals.apiUser = apiUser;
	return await resolve(event);
};
