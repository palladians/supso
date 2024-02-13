import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './drizzle',
	driver: 'libsql',
	dbCredentials: {
		url: process.env.SECRET_SQLITE_URL ?? ''
	},
	verbose: true,
	strict: true
});
