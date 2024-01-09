import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './drizzle',
	driver: (process.env.SECRET_DB_DRIVER ?? '') as 'turso',
	dbCredentials: {
		url: process.env.SECRET_SQLITE_URL ?? '',
		authToken: process.env.SECRET_SQLITE_KEY ?? ''
	},
	verbose: true,
	strict: true
});
