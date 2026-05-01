import { getFallbackExplanation } from "@/lib/prompts";

export async function explainCredit(credit, userContext = {}) {
  const fallbackExplanation = getFallbackExplanation(credit);

  try {
    const response = await fetch("/api/explain-credit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credit, userContext }),
    });

    if (!response.ok) {
      throw new Error(`Explanation request failed with ${response.status}`);
    }

    const { explanation } = await response.json();

    return {
      ...credit,
      plain_english_explanation: explanation || fallbackExplanation,
    };
  } catch (error) {
    console.warn("Using fallback credit explanation.", error);

    return {
      ...credit,
      plain_english_explanation: fallbackExplanation,
    };
  }
}

export async function explainCredits(credits, userContext = {}) {
  return Promise.all(
    credits.map((credit) => explainCredit(credit, userContext))
  );
}
