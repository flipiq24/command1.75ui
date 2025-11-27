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

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brokerage: text("brokerage").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  outreachType: text("outreach_type").notNull(),
  priority: text("priority").notNull(),
  lastContact: text("last_contact").notNull(),
  nextAction: text("next_action").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  dealsWorked: text("deals_worked").notNull(),
  relationshipScore: text("relationship_score").notNull(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
