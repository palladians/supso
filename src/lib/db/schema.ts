import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { pgTable, text, json, boolean, bigint, uuid, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import type { z } from 'zod';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').unique().notNull(),
	username: text('username').notNull().unique(),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const userSession = pgTable('user_session', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activeExpires: bigint('active_expires', {
		mode: 'bigint'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'bigint'
	}).notNull()
});

export const userKey = pgTable('user_key', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password')
});

export const verificationCode = pgTable('verification_code', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	expires: bigint('expires', { mode: 'bigint' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const project = pgTable('project', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	name: text('name').notNull(),
	ownerId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const roleEnum = pgEnum('role', ['member', 'admin']);

export const usersToProjects = pgTable('users_to_projects', {
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	projectId: uuid('project_id')
		.notNull()
		.references(() => project.id),
	role: roleEnum('role').default('member')
});

export const accessToken = pgTable('access_token', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	name: text('name').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const event = pgTable('event', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => project.id),
	channel: text('channel').notNull(),
	event: text('event').notNull(),
	content: text('content'),
	emoji: text('emoji'),
	notify: boolean('notify').default(false),
	tags: json('tags'),
	context: json('context'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const board = pgTable('board', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => project.id),
	name: text('name').notNull(),
	tag: text('tag').notNull(),
	options: json('options').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const featureFlag = pgTable('feature_flag', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => project.id),
	name: text('name').notNull(),
	description: text('description'),
	enabled: boolean('enabled').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
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
const insertEventSchema = createInsertSchema(event);
const selectEventSchema = createSelectSchema(event);

export type User = z.infer<typeof insertUserSchema> & z.infer<typeof selectUserSchema>;
export type Project = z.infer<typeof insertProjectSchema> & z.infer<typeof selectProjectSchema>;
export type Event = z.infer<typeof insertEventSchema> & z.infer<typeof selectEventSchema>;
