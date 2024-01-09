import { lucia } from 'lucia';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { client } from '$lib/db';
import { dev } from '$app/environment';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
	adapter: libsql(client, {
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
