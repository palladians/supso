import { lucia } from 'lucia';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import { sqlite } from '$lib/db';
import { dev } from '$app/environment';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
	adapter: betterSqlite3(sqlite, {
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
