import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { luciaAdapter } from '$lib/db';

export const lucia = new Lucia(luciaAdapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (data) => {
		return {
			email: data.email,
			username: data.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
}
