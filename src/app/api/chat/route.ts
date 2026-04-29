import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { portfolioTools } from "@/lib/chatTools";
import { checkChatRateLimit, rateLimitHeaders } from "@/lib/rateLimit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build" });

type StreamToolCall = {
  name: string;
  arguments: string;
};

export async function POST(req: Request) {
  try {
    const rateLimit = checkChatRateLimit(req);

    if (!rateLimit.allowed) {
      return new Response("Moving a bit fast. Try again in a moment.", {
        status: 429,
        headers: rateLimitHeaders(rateLimit),
      });
    }

    const { messages } = await req.json();

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
  } catch (error: unknown) {
    console.error("Groq API error:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 429
    ) {
       return new Response("Moving a bit fast. Give it a second and try again.", { status: 429 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
