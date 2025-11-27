import { eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { 
  type User, 
  type InsertUser, 
  type Deal, 
  type InsertDeal,
  type Agent,
  type InsertAgent,
  users,
  deals,
  agents
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllDeals(): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: number): Promise<boolean>;
  bulkUpdateDeals(ids: number[], updates: Partial<InsertDeal>): Promise<Deal[]>;

  getAllAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: number): Promise<boolean>;
  bulkUpdateAgents(ids: number[], updates: Partial<InsertAgent>): Promise<Agent[]>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllDeals(): Promise<Deal[]> {
    return db.select().from(deals);
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    const result = await db.select().from(deals).where(eq(deals.id, id));
    return result[0];
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const result = await db.insert(deals).values(deal).returning();
    return result[0];
  }

  async updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal | undefined> {
    const result = await db.update(deals).set(deal).where(eq(deals.id, id)).returning();
    return result[0];
  }

  async deleteDeal(id: number): Promise<boolean> {
    const result = await db.delete(deals).where(eq(deals.id, id)).returning();
    return result.length > 0;
  }

  async bulkUpdateDeals(ids: number[], updates: Partial<InsertDeal>): Promise<Deal[]> {
    if (ids.length === 0) return [];
    return db.update(deals).set(updates).where(inArray(deals.id, ids)).returning();
  }

  async getAllAgents(): Promise<Agent[]> {
    return db.select().from(agents);
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const result = await db.select().from(agents).where(eq(agents.id, id));
    return result[0];
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const result = await db.insert(agents).values(agent).returning();
    return result[0];
  }

  async updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent | undefined> {
    const result = await db.update(agents).set(agent).where(eq(agents.id, id)).returning();
    return result[0];
  }

  async deleteAgent(id: number): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, id)).returning();
    return result.length > 0;
  }

  async bulkUpdateAgents(ids: number[], updates: Partial<InsertAgent>): Promise<Agent[]> {
    if (ids.length === 0) return [];
    return db.update(agents).set(updates).where(inArray(agents.id, ids)).returning();
  }
}

export const storage = new DbStorage();
