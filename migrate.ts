import 'dotenv/config';

import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './src/lib/db';

const main = async () => {
	try {
		await migrate(db, { migrationsFolder: 'drizzle' });
	} catch (e) {
		console.log('>>>MIGRATION_FAILED', e);
	}
	process.exit(0);
};

main();
