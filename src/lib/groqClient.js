const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export async function callGroqChat(
  messages,
  { maxTokens = 300, temperature = 0.2, maxAttempts = 2 } = {}
) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    return {
      ok: false,
      status: 0,
      source: "missing_key",
      data: null,
    };
  }

  let lastResponse = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    lastResponse = response;

    if (response.ok) {
      const data = await response.json();
      return {
        ok: true,
        status: response.status,
        source: "groq",
        data,
      };
    }

    if (response.status === 429) {
      const errorBody = await response.text();
      return {
        ok: false,
        status: 429,
        source: "rate_limited",
        data: {
          errorBody,
          retryAfter: response.headers.get("retry-after"),
          rateLimitReset: response.headers.get("x-ratelimit-reset"),
        },
      };
    }

    if (attempt < maxAttempts && response.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
      continue;
    }

    const errorBody = await response.text();
    return {
      ok: false,
      status: response.status,
      source: "upstream_error",
      data: { errorBody },
    };
  }

  return {
    ok: false,
    status: lastResponse?.status ?? 500,
    source: "unknown_error",
    data: null,
  };
}

export function getGroqText(data) {
  return data?.choices?.[0]?.message?.content?.trim() ?? "";
}
