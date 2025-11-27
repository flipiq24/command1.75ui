import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDealSchema, insertAgentSchema } from "@shared/schema";

const patchDealSchema = insertDealSchema.partial();
const patchAgentSchema = insertAgentSchema.partial();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getAllDeals();
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.getDeal(id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      console.error("Error creating deal:", error);
      res.status(400).json({ message: "Failed to create deal" });
    }
  });

  app.patch("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.updateDeal(id, req.body);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error updating deal:", error);
      res.status(400).json({ message: "Failed to update deal" });
    }
  });

  app.delete("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDeal(id);
      if (!success) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  app.post("/api/deals/bulk-update", async (req, res) => {
    try {
      const { ids, updates } = req.body;
      if (!Array.isArray(ids) || !updates) {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const deals = await storage.bulkUpdateDeals(ids, updates);
      res.json(deals);
    } catch (error) {
      console.error("Error bulk updating deals:", error);
      res.status(400).json({ message: "Failed to bulk update deals" });
    }
  });

  // Agent endpoints
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const validatedData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(validatedData);
      res.status(201).json(agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(400).json({ message: "Failed to create agent" });
    }
  });

  app.patch("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.updateAgent(id, req.body);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error updating agent:", error);
      res.status(400).json({ message: "Failed to update agent" });
    }
  });

  app.delete("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAgent(id);
      if (!success) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting agent:", error);
      res.status(500).json({ message: "Failed to delete agent" });
    }
  });

  app.post("/api/agents/bulk-update", async (req, res) => {
    try {
      const { ids, updates } = req.body;
      if (!Array.isArray(ids) || !updates) {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const agents = await storage.bulkUpdateAgents(ids, updates);
      res.json(agents);
    } catch (error) {
      console.error("Error bulk updating agents:", error);
      res.status(400).json({ message: "Failed to bulk update agents" });
    }
  });

  // AI endpoints
  const { generateAIResponse, analyzeProperty, generatePropertyStory } = await import("./openai");

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, dealContext } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      const response = await generateAIResponse(message, dealContext);
      res.json({ response });
    } catch (error) {
      console.error("Error generating AI response:", error);
      res.status(500).json({ message: "Failed to generate AI response" });
    }
  });

  app.post("/api/ai/analyze-property", async (req, res) => {
    try {
      const { dealId } = req.body;
      if (!dealId) {
        return res.status(400).json({ message: "Deal ID is required" });
      }
      const deal = await storage.getDeal(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      const analysis = await analyzeProperty(deal);
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing property:", error);
      res.status(500).json({ message: "Failed to analyze property" });
    }
  });

  app.post("/api/ai/property-story", async (req, res) => {
    try {
      const { dealId } = req.body;
      if (!dealId) {
        return res.status(400).json({ message: "Deal ID is required" });
      }
      const deal = await storage.getDeal(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      const story = await generatePropertyStory({
        address: deal.address,
        price: deal.price,
        specs: deal.specs,
        propensity: deal.propensity,
        status: deal.status,
        mlsStatus: deal.mlsStatus || undefined,
        source: deal.source,
        keywords: ['repairs', 'investors', 'Investment', 'as-is', 'investor', 'estate', 'opportunity', 'Renovation'],
      });
      res.json({ story });
    } catch (error) {
      console.error("Error generating property story:", error);
      res.status(500).json({ message: "Failed to generate property story" });
    }
  });

  return httpServer;
}
