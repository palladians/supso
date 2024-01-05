import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log(process.env.SECRET_PG_URL);

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.SECRET_PG_URL ?? ''
	},
	verbose: true,
	strict: true
});
