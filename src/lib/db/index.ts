import { drizzle } from 'drizzle-orm/node-postgres';
import Postgres from 'pg';
import * as schema from '$lib/db/schema';
import { SECRET_PG_URL } from '$env/static/private';

export const client = new Postgres.Pool({
	connectionString: SECRET_PG_URL
});

export const db = drizzle(client, { schema });
