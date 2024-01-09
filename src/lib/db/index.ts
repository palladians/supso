import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '$lib/db/schema';
import { SECRET_SQLITE_URL, SECRET_SQLITE_KEY } from '$env/static/private';

export const client = createClient({ url: SECRET_SQLITE_URL, authToken: SECRET_SQLITE_KEY });
export const db = drizzle(client, { schema });
