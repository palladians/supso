import { lucia } from 'lucia';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import { sqlite } from '$lib/db';
import { dev } from '$app/environment';

export const auth = lucia({
	adapter: betterSqlite3(sqlite, {
		user: 'user',
		key: 'user_key',
		session: 'user_session'
	}),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (data) => {
		return {
			email: data.email
		};
	}
});

export type Auth = typeof auth;
