import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sqliteTable, text, blob, integer, numeric } from 'drizzle-orm/sqlite-core';
import type { z } from 'zod';
import { relations } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').unique().notNull(),
	username: text('username').notNull().unique(),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const userSession = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activeExpires: blob('active_expires', {
		mode: 'bigint'
	}).notNull(),
	idleExpires: blob('idle_expires', {
		mode: 'bigint'
	}).notNull()
});

export const userKey = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password')
});

export const verificationCode = sqliteTable('verification_code', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	expires: integer('expires'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const project = sqliteTable('project', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	ownerId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const usersToProjects = sqliteTable('users_to_projects', {
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	projectId: text('project_id')
		.notNull()
		.references(() => project.id)
});

export const accessToken = sqliteTable('access_token', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const event = sqliteTable('event', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id')
		.notNull()
		.references(() => project.id),
	channel: text('channel').notNull(),
	event: text('event').notNull(),
	content: text('content'),
	emoji: text('emoji'),
	notify: numeric('notify').default('false'),
	tags: blob('tags', { mode: 'json' }),
	context: blob('context', { mode: 'json' }),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const board = sqliteTable('board', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id')
		.notNull()
		.references(() => project.id),
	tag: text('tag').notNull(),
	options: blob('options', { mode: 'json' }).notNull(),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const featureFlag = sqliteTable('feature_flag', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id')
		.notNull()
		.references(() => project.id),
	name: text('name').notNull(),
	description: text('description'),
	enabled: numeric('enabled').default('false'),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const usersRelations = relations(user, ({ many }) => ({
	usersToProjects: many(usersToProjects),
	accessTokens: many(accessToken)
}));

export const projectsRelations = relations(project, ({ many }) => ({
	usersToProjects: many(usersToProjects),
	events: many(event),
	boards: many(board),
	featureFlags: many(featureFlag)
}));

export const accessTokenRelations = relations(accessToken, ({ one }) => ({
	user: one(user, {
		fields: [accessToken.userId],
		references: [user.id]
	})
}));

export const usersToProjectsRelations = relations(usersToProjects, ({ one }) => ({
	user: one(user, {
		fields: [usersToProjects.userId],
		references: [user.id]
	}),
	project: one(project, {
		fields: [usersToProjects.projectId],
		references: [project.id]
	})
}));

export const eventRelations = relations(event, ({ one }) => ({
	project: one(project, {
		fields: [event.projectId],
		references: [project.id]
	})
}));

export const boardRelations = relations(board, ({ one }) => ({
	project: one(project, {
		fields: [board.projectId],
		references: [project.id]
	})
}));

export const featureFlagRelations = relations(featureFlag, ({ one }) => ({
	project: one(project, {
		fields: [featureFlag.projectId],
		references: [project.id]
	})
}));

const insertUserSchema = createInsertSchema(user);
const selectUserSchema = createSelectSchema(user);
const insertProjectSchema = createInsertSchema(project);
const selectProjectSchema = createSelectSchema(project);

export type User = z.infer<typeof insertUserSchema> & z.infer<typeof selectUserSchema>;
export type Project = z.infer<typeof insertProjectSchema> & z.infer<typeof selectProjectSchema>;
