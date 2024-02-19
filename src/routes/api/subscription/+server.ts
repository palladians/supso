import crypto from 'node:crypto';
import type { RequestHandler } from './$types';
import { type LemonsqueezySubscription } from 'lemonsqueezy.ts';
import { db } from '$lib/db';
import { project } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { env as envPrivate } from '$env/dynamic/private';

type SubscriptionBody = {
	meta: {
		test_mode: boolean;
		event_name: 'subscription_created' | 'subscription_expired' | 'subscription_cancelled';
		custom_data: {
			project_id: string;
		};
		webhook_id: string;
	};
	data: LemonsqueezySubscription;
};

export const POST: RequestHandler = async ({ request }) => {
	const bodyRaw = await request.text();
	const hmac = crypto.createHmac('sha256', envPrivate.SECRET_LS_WEBHOOK_KEY ?? '');
	const digest = Buffer.from(hmac.update(bodyRaw).digest('hex'), 'utf8');
	const signature = Buffer.from(request.headers.get('x-signature') as string, 'utf8');

	if (!crypto.timingSafeEqual(digest, signature)) {
		return Response.json({ error: true }, { status: 400 });
	}
	const body: SubscriptionBody = JSON.parse(bodyRaw);
	switch (body.meta.event_name) {
		case 'subscription_created':
			await db
				.update(project)
				.set({ subscriptionTier: 'pro' })
				.where(eq(project.id, body.meta.custom_data.project_id));
			break;
		case 'subscription_expired':
		case 'subscription_cancelled':
			await db
				.update(project)
				.set({ subscriptionTier: null })
				.where(eq(project.id, body.meta.custom_data.project_id));
	}
	return Response.json({ ok: true });
};
