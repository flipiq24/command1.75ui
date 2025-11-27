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
