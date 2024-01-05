import { lucia } from 'lucia';
import { pg } from '@lucia-auth/adapter-postgresql';
import { client } from '$lib/db';
import { dev } from '$app/environment';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
	adapter: pg(client, {
		user: 'user',
		key: 'user_key',
		session: 'user_session'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			email: data.email,
			username: data.username
		};
	}
});

export type Auth = typeof auth;
