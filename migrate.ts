import 'dotenv/config';

import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './src/lib/db';

const main = async () => {
	await migrate(db, { migrationsFolder: 'drizzle' });
	process.exit(0);
};

main();
