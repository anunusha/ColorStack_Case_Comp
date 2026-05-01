import { NextResponse } from "next/server";

import {
  buildCreditExplanationPrompt,
  getFallbackExplanation,
} from "@/lib/prompts";

const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

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
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      explanation: fallbackExplanation,
      source: "fallback",
    });
  }

  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const response = await fetch(
      `${GEMINI_API_BASE_URL}/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: buildCreditExplanationPrompt(credit, userContext),
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 220,
            temperature: 0.2,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with ${response.status}`);
    }

    const data = await response.json();
    const explanation =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join("\n")
        .trim() || fallbackExplanation;

    return NextResponse.json({
      explanation,
      source: explanation === fallbackExplanation ? "fallback" : "gemini",
    });
  } catch (error) {
    console.error("Gemini explanation failed.", error);

    return NextResponse.json({
      explanation: fallbackExplanation,
      source: "fallback",
    });
  }
}
