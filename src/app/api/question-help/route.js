import { NextResponse } from "next/server";

import {
  buildHelpBotMessage,
  buildHelpBotSystemPrompt,
} from "@/lib/helpBotPrompts";

const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_HISTORY_MESSAGES = 20;

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

  const { question, audience, messages = [] } = payload ?? {};

  if (!question?.question_text || !audience) {
    return NextResponse.json(
      { error: "Question and audience are required." },
      { status: 400 }
    );
  }

  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Messages must be an array." },
      { status: 400 }
    );
  }

  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);
  const conversationText = recentMessages
    .map((message) => {
      const role = message.role === "assistant" ? "assistant" : "user";
      const content = buildHelpBotMessage(message.content);
      return `${role}: ${content}`;
    })
    .join("\n");

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply:
        "I cannot load live help right now, but this question is asking for your best-fit situation based on CRA wording. Choose the option that is most consistently true for you. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.",
      source: "fallback",
    });
  }

  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const prompt = `${buildHelpBotSystemPrompt(question, audience)}

Conversation so far:
${conversationText || "user: Please explain this question in simple terms."}

Respond to the latest user message only.`;

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
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 320,
            temperature: 0.2,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with ${response.status}`);
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join("\n")
        .trim() ||
      "I can help explain what this question means and how to think through it. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.";

    return NextResponse.json({ reply, source: "gemini" });
  } catch (error) {
    console.error("Question help request failed.", error);

    return NextResponse.json({
      reply:
        "I could not process that right now. Try using the helper text on this question and choose the option that best matches your situation today. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.",
      source: "fallback",
    });
  }
}
