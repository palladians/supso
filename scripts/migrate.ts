import 'dotenv/config';

import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '../src/lib/db';

export const execMigrate = async () => {
	return migrate(db, { migrationsFolder: 'drizzle' });
};

const main = async () => {
	await execMigrate();
	process.exit(0);
};

main();
