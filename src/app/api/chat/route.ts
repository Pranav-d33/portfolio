import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { portfolioTools } from "@/lib/chatTools";
import { checkChatRateLimit, rateLimitHeaders } from "@/lib/rateLimit";

type StreamToolCall = {
  name: string;
  arguments: string;
};

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not configured");
      return new Response("Server not configured. Missing GROQ_API_KEY.", { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const rateLimit = checkChatRateLimit(req);

    if (!rateLimit.allowed) {
      return new Response("Moving a bit fast. Try again in a moment.", {
        status: 429,
        headers: rateLimitHeaders(rateLimit),
      });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse request JSON:", e);
      return new Response("Invalid JSON in request body", { status: 400 });
    }

    if (!body || typeof body !== "object" || !("messages" in body)) {
      console.error("Missing or invalid 'messages' field in request body");
      return new Response("Missing 'messages' field in request body", { status: 400 });
    }

    const { messages } = body as { messages: unknown };

    if (!Array.isArray(messages)) {
      console.error("'messages' is not an array:", typeof messages);
      return new Response("'messages' must be an array", { status: 400 });
    }

    if (messages.length === 0) {
      console.error("Messages array is empty");
      return new Response("Messages array cannot be empty", { status: 400 });
    }

    try {
      const stream = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        stream: true,
        max_tokens: 300,
        temperature: 0.7,
        tools: portfolioTools,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          let currentToolCall: StreamToolCall | null = null;

          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;
            
            if (delta?.content) {
              controller.enqueue(encoder.encode(delta.content));
            }

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (tc.function?.name) {
                  currentToolCall = { name: tc.function.name, arguments: "" };
                }
                if (tc.function?.arguments && currentToolCall) {
                  currentToolCall.arguments += tc.function.arguments;
                }
              }
            }
          }

          if (currentToolCall) {
            // Send the fully formed tool call at the end of the stream
            try {
              const parsedArgs = JSON.parse(currentToolCall.arguments || "{}");
              const payload = JSON.stringify({ name: currentToolCall.name, arguments: parsedArgs });
              controller.enqueue(encoder.encode(`\n__TOOL_CALL__${payload}`));
            } catch (e) {
              console.error("Failed to parse tool call arguments", e);
            }
          }

          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          ...rateLimitHeaders(rateLimit),
        },
      });
    } catch (groqError: unknown) {
      console.error("Groq API error:", groqError);
      
      // Check if it's an API error from Groq
      if (groqError instanceof Error) {
        const errorMsg = groqError.message || "Unknown error";
        console.error("Error message:", errorMsg);
        
        // Check for common Groq API errors
        if (errorMsg.includes("401") || errorMsg.includes("authentication")) {
          console.error("Authentication error with Groq API");
          return new Response("API authentication failed", { status: 500 });
        }
        if (errorMsg.includes("rate")) {
          return new Response("API rate limit exceeded", { status: 429 });
        }
      }
      
      throw groqError; // Re-throw to outer catch block
    }
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    
    // Rate limit error from Groq
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 429
    ) {
      return new Response("Moving a bit fast. Give it a second and try again.", { status: 429 });
    }
    
    // Invalid request body
    if (error instanceof SyntaxError) {
      return new Response("Invalid request format", { status: 400 });
    }
    
    // Detailed error logging for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Detailed error:", errorMessage);
    
    return new Response("Internal Server Error", { status: 500 });
  }
}
