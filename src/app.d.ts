// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/db/schema';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			apiUser: User | undefined;
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = Partial<User>;
		type DatabaseSessionAttributes = Partial<User>;
	}
}

export {};
