import { db } from '$lib/db';
import { accessToken } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const getUserByBearer = async (bearer: string) => {
	if (bearer.length === 0) return;
	const token = await db.query.accessToken.findFirst({
		where: eq(accessToken.id, bearer),
		with: {
			user: true
		}
	});
	return token?.user;
};
