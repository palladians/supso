import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './drizzle',
	driver: 'libsql',
	dbCredentials: {
		url: 'file:sqlite.db'
	},
	verbose: true,
	strict: true
});
