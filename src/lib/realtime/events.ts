import type { Event } from '$lib/db/schema';
import { toJSON } from './reader';

type SubscribeProps = {
	accessToken: string;
	callback: (events: Event[]) => void;
	projectId?: string;
};

export const subscribeToEvents = async ({ accessToken, callback, projectId }: SubscribeProps) => {
	const url = projectId ? `/api/events/stream?projectId=${projectId}` : '/api/events/stream';
	const { body } = await fetch(url, {
		headers: { authorization: 'Bearer ' + accessToken }
	});
	if (!body) return;
	return toJSON({ body, callback });
};
