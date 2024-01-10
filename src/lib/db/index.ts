import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

export const client = createClient({
	url: process.env.SECRET_SQLITE_URL ?? '',
	authToken: process.env.SECRET_SQLITE_KEY ?? ''
});
export const db = drizzle(client, { schema });
