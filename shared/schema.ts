import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  specs: text("specs").notNull(),
  price: text("price").notNull(),
  propensity: text("propensity").array().notNull().default(sql`ARRAY[]::text[]`),
  source: text("source").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  statusPercent: text("status_percent").notNull(),
  lastOpen: text("last_open").notNull(),
  lastCalled: text("last_called").notNull(),
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
});

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;
