import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sqliteTable, text, integer, numeric, unique } from 'drizzle-orm/sqlite-core';
import type { z } from 'zod';
import { relations } from 'drizzle-orm';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';

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

export const session = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at').notNull()
});

export const verificationCode = sqliteTable('verification_code', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	code: text('code')
		.notNull()
		.$defaultFn(() => generateRandomString(8, alphabet('0-9'))),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
		.unique(),
	email: text('email').notNull(),
	expiresAt: integer('expires_at')
		.notNull()
		.$defaultFn(() => createDate(new TimeSpan(5, 'm')).getTime())
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
	subscriptionTier: text('subscription_tier', { enum: ['pro'] }),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const usersToProjects = sqliteTable('users_to_projects', {
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	projectId: text('project_id')
		.notNull()
		.references(() => project.id, { onDelete: 'cascade' }),
	role: text('role', { enum: ['member', 'admin'] })
		.notNull()
		.default('member')
});

export const accessToken = sqliteTable('access_token', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	internal: numeric('internal').default('true'),
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
		.references(() => project.id, { onDelete: 'cascade' }),
	channel: text('channel').notNull(),
	event: text('event').notNull(),
	content: text('content'),
	emoji: text('emoji'),
	notify: numeric('notify').default('false'),
	resolved: numeric('resolved').default('false'),
	customName: text('customName'),
	tags: text('tags', { mode: 'json' }),
	context: text('context', { mode: 'json' }),
	priority: text('priority', { enum: ['low', 'normal', 'high'] })
		.notNull()
		.default('normal'),
	assigneeId: text('assignee_id').references(() => user.id),
	dueDate: text('due_date'),
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
		.references(() => project.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	tag: text('tag').notNull(),
	options: text('options', { mode: 'json' }).notNull(),
	eventsOrder: text('events_order', { mode: 'json' }),
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
		.references(() => project.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	enabled: numeric('enabled').default('false'),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const projectInvitation = sqliteTable(
	'project_invitation',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		projectId: text('project_id')
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' })
	},
	(t) => ({
		userProjectUnique: unique().on(t.userId, t.projectId)
	})
);

export const webhook = sqliteTable('webhook', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id')
		.notNull()
		.references(() => project.id, { onDelete: 'cascade' }),
	url: text('url').notNull(),
	service: text('service', { enum: ['slack', 'discord'] }).notNull(),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const comment = sqliteTable('comment', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	eventId: text('event_id')
		.notNull()
		.references(() => event.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	edited: numeric('edited').default('false'),
	createdAt: text('created_at').$defaultFn(() => Number(new Date()).toString()),
	updatedAt: text('updated_at').$defaultFn(() => Number(new Date()).toString())
});

export const usersRelations = relations(user, ({ many }) => ({
	usersToProjects: many(usersToProjects),
	accessTokens: many(accessToken),
	projectInvitations: many(projectInvitation),
	assignedEvents: many(event),
	comments: many(comment)
}));

export const projectsRelations = relations(project, ({ many }) => ({
	usersToProjects: many(usersToProjects),
	events: many(event),
	boards: many(board),
	featureFlags: many(featureFlag),
	projectInvitations: many(projectInvitation),
	webhooks: many(webhook)
}));

export const accessTokenRelations = relations(accessToken, ({ one }) => ({
	user: one(user, {
		fields: [accessToken.userId],
		references: [user.id]
	})
}));

export const projectInvitationRelations = relations(projectInvitation, ({ one }) => ({
	user: one(user, {
		fields: [projectInvitation.userId],
		references: [user.id]
	}),
	project: one(project, {
		fields: [projectInvitation.projectId],
		references: [project.id]
	})
}));

export const webhookRelations = relations(webhook, ({ one }) => ({
	project: one(project, {
		fields: [webhook.projectId],
		references: [project.id]
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

export const eventRelations = relations(event, ({ one, many }) => ({
	project: one(project, {
		fields: [event.projectId],
		references: [project.id]
	}),
	assignee: one(user, {
		fields: [event.assigneeId],
		references: [user.id]
	}),
	comments: many(comment)
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

export const commentRelations = relations(comment, ({ one }) => ({
	event: one(event, {
		fields: [comment.eventId],
		references: [event.id]
	}),
	user: one(user, {
		fields: [comment.userId],
		references: [user.id]
	})
}));

const insertUserSchema = createInsertSchema(user);
const selectUserSchema = createSelectSchema(user);
const insertProjectSchema = createInsertSchema(project);
const selectProjectSchema = createSelectSchema(project);
export const insertEventSchema = createInsertSchema(event);
const selectEventSchema = createSelectSchema(event);
export const insertBoardSchema = createInsertSchema(board);
const selectBoardSchema = createSelectSchema(board);
export const insertCommentSchema = createInsertSchema(comment);
const selectCommentSchema = createSelectSchema(comment);

export type User = z.infer<typeof insertUserSchema> & z.infer<typeof selectUserSchema>;
export type Project = z.infer<typeof insertProjectSchema> & z.infer<typeof selectProjectSchema>;
export type Event = z.infer<typeof insertEventSchema> & z.infer<typeof selectEventSchema>;
export type Board = z.infer<typeof insertBoardSchema> & z.infer<typeof selectBoardSchema>;
export type Comment = z.infer<typeof insertCommentSchema> & z.infer<typeof selectCommentSchema>;
