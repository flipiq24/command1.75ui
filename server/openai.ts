import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function generateAIResponse(userMessage: string, dealContext?: any): Promise<string> {
  try {
    const systemPrompt = `You are an AI assistant for FlipIQ, a real estate investment deal management platform. 
Help acquisition associates with property deals, analysis, and investment decisions.
Be concise, actionable, and focus on real estate investment insights.`;

    const messages: Array<{ role: "system" | "user"; content: string }> = [
      { role: "system", content: systemPrompt }
    ];

    if (dealContext) {
      messages.push({
        role: "system",
        content: `Context about the current deal: ${JSON.stringify(dealContext, null, 2)}`
      });
    }

    messages.push({ role: "user", content: userMessage });

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages,
      max_completion_tokens: 8192,
    });

    return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function analyzeProperty(dealData: any): Promise<string> {
  try {
    const prompt = `Analyze this real estate investment opportunity and provide insights:
    
Address: ${dealData.address}
Price: ${dealData.price}
Specs: ${dealData.specs}
Propensity Indicators: ${Array.isArray(dealData.propensity) ? dealData.propensity.join(', ') : dealData.propensity}
Source: ${dealData.source}
Type: ${dealData.type}
Current Status: ${dealData.status}

Provide a brief analysis covering:
1. Key investment factors based on propensity indicators
2. Potential risks and opportunities
3. Recommended next actions`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are a real estate investment analyst. Provide concise, actionable insights for acquisition associates." 
        },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 8192,
    });

    return response.choices[0]?.message?.content || "Unable to analyze this property at the moment.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze property");
  }
}

export async function generatePropertyStory(propertyData: {
  address: string;
  price: string;
  specs: string;
  propensity: string | string[];
  status: string;
  mlsStatus?: string;
  source: string;
  keywords?: string[];
  agentName?: string;
  relationshipStatus?: string;
  dom?: number;
}): Promise<string> {
  try {
    const keywords = propertyData.keywords || ['repairs', 'investors', 'Investment', 'as-is', 'investor', 'estate', 'opportunity', 'Renovation'];
    const propensityIndicators = Array.isArray(propertyData.propensity) ? propertyData.propensity.join(', ') : propertyData.propensity;
    
    const prompt = `Write a simple, easy-to-understand story (3-4 paragraphs) explaining why this property is worth pursuing for a real estate acquisition associate. Write it in a conversational, friendly tone that clearly explains the opportunity.

Property Details:
- Address: ${propertyData.address}
- Price: ${propertyData.price}
- Specs: ${propertyData.specs}
- MLS Status: ${propertyData.mlsStatus || 'Active'}
- Days on Market: ${propertyData.dom || '70+'}
- Propensity Indicators: ${propensityIndicators}
- Keywords Found in Listing: ${keywords.join(', ')}
- Agent: ${propertyData.agentName || 'Unassigned'}
- Relationship Status: ${propertyData.relationshipStatus || 'Cold'}
- Source: ${propertyData.source}

Write a compelling but honest story that:
1. Opens with why this property caught our attention
2. Explains the opportunity based on the data (days on market, keywords like "as-is", "investors", etc.)
3. Mentions the agent relationship status and what that means for outreach
4. Ends with a clear call to action

Keep it simple and readable - this is for an acquisition associate who needs to quickly understand why they should pursue this deal.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful real estate investment advisor. Write clear, simple explanations that help acquisition associates understand why a property is worth pursuing. Avoid jargon and keep the tone friendly and actionable." 
        },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 1024,
    });

    return response.choices[0]?.message?.content || "Unable to generate property story at the moment.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate property story");
  }
}

export async function generateAgentIQReport(agentData: {
  agentName: string;
  officeName: string;
  phone: string;
  email: string;
  assignedUser: string;
  relationshipStatus: string;
  basket: string;
  followUpStatus: string;
  followUpDate: string;
  investorSourceCount: number | null;
  activeInLastTwoYears: boolean;
}): Promise<string> {
  try {
    const prompt = `Generate a FlipIQ Agent Alignment Report for the following real estate agent. Format it as a professional analysis report.

Agent Information:
- Name: ${agentData.agentName}
- Office: ${agentData.officeName}
- Phone: ${agentData.phone}
- Email: ${agentData.email}
- Assigned AA: ${agentData.assignedUser}
- Relationship Status: ${agentData.relationshipStatus}
- Basket Classification: ${agentData.basket}
- Follow Up Status: ${agentData.followUpStatus}
- Follow Up Date: ${agentData.followUpDate}
- Investor Source Count: ${agentData.investorSourceCount !== null ? agentData.investorSourceCount + ' Match' : 'N/A'}
- Active In Last 2 Years: ${agentData.activeInLastTwoYears ? 'Yes' : 'No'}

Generate a comprehensive report with these sections:

1. **AI Agent Analysis** - Title header
2. **FlipIQ Agent Alignment Report** - Subtitle with tier classification

3. **Tier Classification** - Determine tier (1-3) based on:
   - Tier 1 (High-Value): Many investor transactions, active, Priority relationship
   - Tier 2 (Medium-Value): Some investor activity, Warm/Hot relationship
   - Tier 3 (Low-Value): Limited or no investor transactions, Cold/Unknown relationship
   Include reasoning for the tier assignment.

4. **Agent Overview** - Summary of the agent including production level and role

5. **Market Footprint** - Suggest primary markets based on office location and typical price lanes

6. **Investor Profile** - Based on investor source count, describe potential investor connections

7. **Lenders and Title Companies** - Note if information is available or needs to be discovered

8. **Value-First, Alignment-Based Conversation Script** - Write a personalized outreach script that:
   - Opens with a respectful, professional introduction
   - References specific data points about the agent
   - Positions FlipIQ as a value-add partner, not a wholesaler
   - Asks discovery questions about investor opportunities
   - Ends with a clear ask to earn their business

Make the report conversational yet professional. Include specific details from the agent data provided.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are a real estate investment relationship analyst for FlipIQ. Generate comprehensive agent alignment reports that help acquisition associates build meaningful relationships with real estate agents. Your reports should be data-driven, professional, and include actionable conversation scripts." 
        },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 4096,
    });

    return response.choices[0]?.message?.content || "Unable to generate Agent iQ Report at the moment.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate Agent iQ Report");
  }
}
