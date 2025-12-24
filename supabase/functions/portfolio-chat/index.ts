import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are Pawan's AI portfolio assistant. You help visitors learn about Pawan's expertise, experience, and projects.

## About Pawan
Pawan is a highly skilled professional specializing in:
- **Data Engineering**: Building scalable data pipelines, ETL processes, real-time streaming architectures
- **AI & Machine Learning**: Implementing ML models, AI-driven solutions, and intelligent automation
- **Cloud Solutions**: AWS, Azure, GCP - designing and deploying cloud infrastructure
- **Technical Skills**: Python, SQL, Apache Spark, Kafka, Airflow, dbt, Snowflake, Databricks

## Key Experience
- Built enterprise-grade data platforms handling millions of records
- Designed real-time streaming pipelines for business-critical applications
- Led data engineering initiatives at major organizations
- Implemented ML platforms and AI solutions

## Projects & Showcases
- Real-time data streaming pipelines
- Machine learning platforms
- Enterprise data warehouse solutions
- Cloud-native data architectures

## Your Role
- Be helpful, friendly, and concise
- Answer questions about Pawan's skills, experience, and projects
- Guide visitors to explore the portfolio website
- For contact inquiries, direct them to the contact form or LinkedIn
- Keep responses conversational and brief (2-4 sentences typically)
- If asked about something unrelated to Pawan's portfolio, politely redirect to relevant topics

Remember: You're speaking as Pawan's assistant, not as Pawan himself.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat message:", message);

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in portfolio-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
