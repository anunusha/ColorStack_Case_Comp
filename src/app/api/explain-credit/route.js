import { NextResponse } from "next/server";

import {
  buildCreditExplanationPrompt,
  getFallbackExplanation,
} from "@/lib/prompts";
import { callGroqChat, getGroqText } from "@/lib/groqClient";

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { credit, userContext = {} } = payload;

  if (!credit?.name) {
    return NextResponse.json(
      { error: "A credit object is required." },
      { status: 400 }
    );
  }

  const fallbackExplanation = getFallbackExplanation(credit);
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      explanation: fallbackExplanation,
      source: "fallback",
    });
  }

  try {
    const result = await callGroqChat(
      [
        {
          role: "user",
          content: buildCreditExplanationPrompt(credit, userContext),
        },
      ],
      { maxTokens: 300, temperature: 0.2 }
    );

    if (!result.ok && result.status === 429) {
      console.warn("Groq explain-credit rate limited.", {
        retryAfter: result.data?.retryAfter ?? null,
        rateLimitReset: result.data?.rateLimitReset ?? null,
        errorBody: result.data?.errorBody ?? null,
      });
      return NextResponse.json({
        explanation: fallbackExplanation,
        source: "rate_limited",
      }, { status: 429 });
    }

    if (!result.ok) {
      console.error("Groq explanation request failed.", {
        status: result.status,
        source: result.source,
        errorBody: result.data?.errorBody,
      });
      return NextResponse.json({
        explanation: fallbackExplanation,
        source: "fallback",
      });
    }

    const explanation = getGroqText(result.data) || fallbackExplanation;

    return NextResponse.json({
      explanation,
      source: explanation === fallbackExplanation ? "fallback" : "groq",
    });
  } catch (error) {
    console.error("Groq explanation failed.", error);

    return NextResponse.json({
      explanation: fallbackExplanation,
      source: "fallback",
    });
  }
}
