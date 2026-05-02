import { NextResponse } from "next/server";

import {
  buildHelpBotMessage,
  buildHelpBotSystemPrompt,
} from "@/lib/helpBotPrompts";
import { callGroqChat, getGroqText } from "@/lib/groqClient";

const MAX_HISTORY_MESSAGES = 20;

function withDisclaimer(message, lang = "en") {
  if (lang === "hi") {
    return `${message} मैं मार्गदर्शन उपकरण हूँ, कर पेशेवर नहीं। जटिल स्थितियों के लिए CVITP स्वयंसेवक या सीधे CRA से संपर्क करें।`;
  }

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

  const { question, audience, messages = [], lang: langRaw } = payload ?? {};
  const lang = langRaw === "hi" ? "hi" : "en";

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

  const fallbackNoApi =
    lang === "hi"
      ? withDisclaimer(
          "अभी लाइव सहायता लोड नहीं हो सकी, लेकिन यह प्रश्न CRA शब्दों के आधार पर आपकी सबसे उपयुक्त स्थिति पूछ रहा है। वह विकल्प चुनें जो लगातार सबसे अधिक सही हो।",
          "hi"
        )
      : withDisclaimer(
          "I cannot load live help right now, but this question is asking for your best-fit situation based on CRA wording. Choose the option that is most consistently true for you.",
          "en"
        );

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      reply: fallbackNoApi,
      source: "fallback",
    });
  }

  try {
    const defaultConversationSeed =
      lang === "hi"
        ? "user: कृपया इस प्रश्न को सरल भाषा में समझाएँ।"
        : "user: Please explain this question in simple terms.";

    const systemPrompt = `${buildHelpBotSystemPrompt(question, audience, lang)}

Conversation so far:
${conversationText || defaultConversationSeed}

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
      return NextResponse.json(
        {
          reply: withDisclaimer(
            lang === "hi"
              ? "अभी बहुत अनुरोध आ रहे हैं। कृपया लगभग 20-30 सेकंड प्रतीक्षा करें और फिर पूछें, या अभी अगले प्रश्न पर जारी रखें।"
              : "I am getting a lot of requests right now. Please wait about 20-30 seconds and ask again, or continue with the next question for now.",
            lang
          ),
          source: "rate_limited",
        },
        { status: 429 }
      );
    }

    if (!result.ok) {
      console.error("Groq question-help request failed.", {
        status: result.status,
        source: result.source,
        errorBody: result.data?.errorBody,
      });
      return NextResponse.json({
        reply: withDisclaimer(
          lang === "hi"
            ? "अभी इसे प्रोसेस नहीं कर सका। इस प्रश्न पर सहायक टेक्स्ट का उपयोग करें और आज जो स्थिति सबसे अधिक मेल खाती है वह विकल्प चुनें।"
            : "I could not process that right now. Try using the helper text on this question and choose the option that best matches your situation today.",
          lang
        ),
        source: "fallback",
      });
    }

    const reply = getGroqText(result.data);
    if (!reply) {
      return NextResponse.json({
        reply: withDisclaimer(
          lang === "hi"
            ? "मैं उत्तर नहीं बना पाया। अपना प्रश्न सरल शब्दों में फिर से लिखकर देखें।"
            : "I couldn't generate a response. Try rephrasing your question in simpler terms.",
          lang
        ),
        source: "empty_text",
      });
    }

    return NextResponse.json({ reply, source: "groq" });
  } catch (error) {
    console.error("Question help request failed.", error);

    return NextResponse.json({
      reply: withDisclaimer(
        lang === "hi"
          ? "अभी इसे प्रोसेस नहीं कर सका। इस प्रश्न पर सहायक टेक्स्ट का उपयोग करें और आज जो स्थिति सबसे अधिक मेल खाती है वह विकल्प चुनें।"
          : "I could not process that right now. Try using the helper text on this question and choose the option that best matches your situation today.",
        lang
      ),
      source: "fallback",
    });
  }
}
