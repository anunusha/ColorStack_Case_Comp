import { NextResponse } from "next/server";

import {
  buildHelpBotMessage,
  buildHelpBotSystemPrompt,
} from "@/lib/helpBotPrompts";

const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_HISTORY_MESSAGES = 20;
const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
];

function withDisclaimer(message) {
  return `${message} I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.`;
}

async function callGeminiWithRetry(url, payload, maxAttempts = 2) {
  let lastResponse = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    lastResponse = response;

    if (response.ok) {
      return response;
    }

    // Retry only transient upstream failures once.
    if (attempt < maxAttempts && response.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
      continue;
    }

    return response;
  }

  return lastResponse;
}

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

    const geminiUrl = `${GEMINI_API_BASE_URL}/${model}:generateContent?key=${apiKey}`;
    const geminiPayload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.2,
      },
      safetySettings: SAFETY_SETTINGS,
    };
    const response = await callGeminiWithRetry(geminiUrl, geminiPayload);

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({
          reply: withDisclaimer(
            "I am getting a lot of requests right now. Please wait about 20-30 seconds and ask again, or continue with the next question for now."
          ),
          source: "rate_limited",
        });
      }

      throw new Error(`Gemini request failed with ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini question-help response:", {
      promptBlockReason: data?.promptFeedback?.blockReason ?? null,
      candidateCount: Array.isArray(data?.candidates) ? data.candidates.length : 0,
      firstFinishReason: data?.candidates?.[0]?.finishReason ?? null,
    });

    if (data?.promptFeedback?.blockReason) {
      return NextResponse.json({
        reply: withDisclaimer(
          "I had trouble processing that phrasing. Try asking about one term in this question, or describe your situation in one short sentence."
        ),
        source: "blocked_prompt",
      });
    }

    if (!Array.isArray(data?.candidates) || data.candidates.length === 0) {
      return NextResponse.json({
        reply: withDisclaimer(
          "I could not generate a response just now. Try rephrasing your question in simpler terms."
        ),
        source: "empty_candidates",
      });
    }

    const candidate = data.candidates[0];

    if (candidate.finishReason === "SAFETY") {
      return NextResponse.json({
        reply: withDisclaimer(
          "I cannot answer that exact phrasing. Try asking about one option label from this question and I can help map your situation to it."
        ),
        source: "blocked_safety",
      });
    }

    if (candidate.finishReason === "MAX_TOKENS") {
      console.warn(
        "Gemini question-help response was truncated. Consider raising maxOutputTokens."
      );
    }

    const reply = candidate.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!reply) {
      return NextResponse.json({
        reply: withDisclaimer(
          "I got an empty response. Try asking again with fewer details in one sentence."
        ),
        source: "empty_text",
      });
    }

    return NextResponse.json({ reply, source: "gemini" });
  } catch (error) {
    console.error("Question help request failed.", error);

    if (String(error?.message || "").includes("429")) {
      return NextResponse.json({
        reply: withDisclaimer(
          "I am temporarily rate-limited. Please retry shortly, or continue with the intake and come back to help when needed."
        ),
        source: "rate_limited",
      });
    }

    return NextResponse.json({
      reply:
        "I could not process that right now. Try using the helper text on this question and choose the option that best matches your situation today. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.",
      source: "fallback",
    });
  }
}
