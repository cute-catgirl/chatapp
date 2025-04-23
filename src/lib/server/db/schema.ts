import { nanoid } from '../../index';
import { sql } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, varchar, vector, index } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	displayName: text('display_name').notNull(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { mode: 'date' }).notNull()
});

export const chat = pgTable('chat', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const message = pgTable('message', {
	id: text('id').primaryKey(),
	chatId: text('chat_id')
		.notNull()
		.references(() => chat.id),
	role: text('role').notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull()
});

export const userSettings = pgTable('user_settings', {
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	key: text('key').notNull(),
	value: text('value').notNull()
});

export const resources = pgTable('resources', {
	id: varchar('id', { length: 191 })
		.primaryKey()
		.$defaultFn(() => nanoid()),
	content: text('content').notNull(),

	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`now()`)
});

export const embeddings = pgTable(
	'embeddings',
	{
		id: varchar('id', { length: 191 })
			.primaryKey()
			.$defaultFn(() => nanoid()),
		resourceId: varchar('resource_id', { length: 191 }).references(() => resources.id, {
			onDelete: 'cascade'
		}),
		content: text('content').notNull(),
		embedding: vector('embedding', { dimensions: 1536 }).notNull()
	},
	(table) => ({
		embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops'))
	})
);

export const insertResourceSchema = createSelectSchema(resources)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export type NewResourceParams = z.infer<typeof insertResourceSchema>;

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Chat = typeof chat.$inferSelect;
export type Message = typeof message.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Embedding = typeof embeddings.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
