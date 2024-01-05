import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sqliteTable, text, blob, integer, numeric } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
const user = sqliteTable("user", {
  id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique().notNull(),
  username: text("username").notNull().unique(),
  createdAt: text("created_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString()),
  updatedAt: text("updated_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString())
});
const userSession = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  activeExpires: blob("active_expires", {
    mode: "bigint"
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint"
  }).notNull()
});
const userKey = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  hashedPassword: text("hashed_password")
});
const verificationCode = sqliteTable("verification_code", {
  id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  expires: integer("expires"),
  userId: text("user_id").notNull().references(() => user.id)
});
const project = sqliteTable("project", {
  id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  ownerId: text("user_id").notNull().references(() => user.id),
  createdAt: text("created_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString()),
  updatedAt: text("updated_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString())
});
const usersToProjects = sqliteTable("users_to_projects", {
  userId: text("user_id").notNull().references(() => user.id),
  projectId: text("project_id").notNull().references(() => project.id),
  role: text("role", { enum: ["member", "admin"] }).notNull().default("member")
});
const accessToken = sqliteTable("access_token", {
  id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  createdAt: text("created_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString()),
  updatedAt: text("updated_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString())
});
const event = sqliteTable("event", {
  id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id").notNull().references(() => project.id),
  channel: text("channel").notNull(),
  event: text("event").notNull(),
  content: text("content"),
  emoji: text("emoji"),
  notify: numeric("notify").default("false"),
  tags: text("tags", { mode: "json" }),
  context: text("context", { mode: "json" }),
  createdAt: text("created_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString()),
  updatedAt: text("updated_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString())
});
const board = sqliteTable("board", {
  id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id").notNull().references(() => project.id),
  name: text("name").notNull(),
  tag: text("tag").notNull(),
  options: text("options", { mode: "json" }).notNull(),
  createdAt: text("created_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString()),
  updatedAt: text("updated_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString())
});
const featureFlag = sqliteTable("feature_flag", {
  id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id").notNull().references(() => project.id),
  name: text("name").notNull(),
  description: text("description"),
  enabled: numeric("enabled").default("false"),
  createdAt: text("created_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString()),
  updatedAt: text("updated_at").$defaultFn(() => Number(/* @__PURE__ */ new Date()).toString())
});
const usersRelations = relations(user, ({ many }) => ({
  usersToProjects: many(usersToProjects),
  accessTokens: many(accessToken)
}));
const projectsRelations = relations(project, ({ many }) => ({
  usersToProjects: many(usersToProjects),
  events: many(event),
  boards: many(board),
  featureFlags: many(featureFlag)
}));
const accessTokenRelations = relations(accessToken, ({ one }) => ({
  user: one(user, {
    fields: [accessToken.userId],
    references: [user.id]
  })
}));
const usersToProjectsRelations = relations(usersToProjects, ({ one }) => ({
  user: one(user, {
    fields: [usersToProjects.userId],
    references: [user.id]
  }),
  project: one(project, {
    fields: [usersToProjects.projectId],
    references: [project.id]
  })
}));
const eventRelations = relations(event, ({ one }) => ({
  project: one(project, {
    fields: [event.projectId],
    references: [project.id]
  })
}));
const boardRelations = relations(board, ({ one }) => ({
  project: one(project, {
    fields: [board.projectId],
    references: [project.id]
  })
}));
const featureFlagRelations = relations(featureFlag, ({ one }) => ({
  project: one(project, {
    fields: [featureFlag.projectId],
    references: [project.id]
  })
}));
createInsertSchema(user);
createSelectSchema(user);
createInsertSchema(project);
createSelectSchema(project);
createInsertSchema(event);
createSelectSchema(event);
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accessToken,
  accessTokenRelations,
  board,
  boardRelations,
  event,
  eventRelations,
  featureFlag,
  featureFlagRelations,
  project,
  projectsRelations,
  user,
  userKey,
  userSession,
  usersRelations,
  usersToProjects,
  usersToProjectsRelations,
  verificationCode
}, Symbol.toStringTag, { value: "Module" }));
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });
export {
  accessToken as a,
  board as b,
  user as c,
  db as d,
  event as e,
  featureFlag as f,
  project as p,
  sqlite as s,
  usersToProjects as u,
  verificationCode as v
};
