import { NextResponse } from "next/server";

import {
  buildHelpBotMessage,
  buildHelpBotSystemPrompt,
} from "@/lib/helpBotPrompts";
import { callGroqChat, getGroqText } from "@/lib/groqClient";

const MAX_HISTORY_MESSAGES = 20;

function withDisclaimer(message) {
  return `${message} I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.`;
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

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      reply:
        "I cannot load live help right now, but this question is asking for your best-fit situation based on CRA wording. Choose the option that is most consistently true for you. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.",
      source: "fallback",
    });
  }

  try {
    const systemPrompt = `${buildHelpBotSystemPrompt(question, audience)}

Conversation so far:
${conversationText || "user: Please explain this question in simple terms."}

Respond to the latest user message only.`;
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: buildHelpBotMessage(message.content),
      })),
    ];

    const result = await callGroqChat(groqMessages, {
      maxTokens: 500,
      temperature: 0.2,
    });

    if (!result.ok && result.status === 429) {
      console.warn("Groq question-help rate limited.", {
        retryAfter: result.data?.retryAfter ?? null,
        rateLimitReset: result.data?.rateLimitReset ?? null,
        errorBody: result.data?.errorBody ?? null,
      });
      return NextResponse.json({
        reply: withDisclaimer(
          "I am getting a lot of requests right now. Please wait about 20-30 seconds and ask again, or continue with the next question for now."
        ),
        source: "rate_limited",
      }, { status: 429 });
    }

    if (!result.ok) {
      console.error("Groq question-help request failed.", {
        status: result.status,
        source: result.source,
        errorBody: result.data?.errorBody,
      });
      return NextResponse.json({
        reply: withDisclaimer(
          "I could not process that right now. Try using the helper text on this question and choose the option that best matches your situation today."
        ),
        source: "fallback",
      });
    }

    const reply = getGroqText(result.data);
    if (!reply) {
      return NextResponse.json({
        reply: withDisclaimer(
          "I couldn't generate a response. Try rephrasing your question in simpler terms."
        ),
        source: "empty_text",
      });
    }

    return NextResponse.json({ reply, source: "groq" });
  } catch (error) {
    console.error("Question help request failed.", error);

    return NextResponse.json({
      reply:
        "I could not process that right now. Try using the helper text on this question and choose the option that best matches your situation today. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.",
      source: "fallback",
    });
  }
}
