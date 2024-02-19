import 'dotenv/config';

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import {
	user,
	session,
	verificationCode,
	project,
	usersToProjects,
	accessToken,
	event,
	board,
	featureFlag,
	projectInvitation,
	webhook,
	usersRelations,
	projectsRelations,
	accessTokenRelations,
	projectInvitationRelations,
	webhookRelations,
	usersToProjectsRelations,
	eventRelations,
	boardRelations,
	featureFlagRelations,
	comment,
	commentRelations
} from './schema';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

const schema = {
	user,
	session,
	verificationCode,
	project,
	usersToProjects,
	accessToken,
	event,
	board,
	featureFlag,
	projectInvitation,
	webhook,
	usersRelations,
	projectsRelations,
	accessTokenRelations,
	projectInvitationRelations,
	webhookRelations,
	usersToProjectsRelations,
	eventRelations,
	boardRelations,
	featureFlagRelations,
	comment,
	commentRelations
};

export const client = createClient({
	url: process.env.SECRET_SQLITE_URL ?? ''
});

export const db = drizzle(client, { schema });
export const luciaAdapter = new DrizzleSQLiteAdapter(db as never, session, user);
