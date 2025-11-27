import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  type User, 
  type InsertUser, 
  type Deal, 
  type InsertDeal,
  users,
  deals 
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
    const results: Deal[] = [];
    for (const id of ids) {
      const result = await db.update(deals).set(updates).where(eq(deals.id, id)).returning();
      if (result[0]) results.push(result[0]);
    }
    return results;
  }
}

export const storage = new DbStorage();
