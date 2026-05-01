export function buildCreditExplanationPrompt(credit, userContext = {}) {
  const estimate = credit.computed_estimate?.display ?? formatEstimate(credit);
  const answersSummary = formatAnswers(userContext.answers);

  return `You are helping a Canadian taxpayer understand a possible tax credit in plain English.

Audience: ${userContext.audience ?? credit.audience ?? "unknown"}
Credit name: ${credit.name}
Estimated value: ${estimate}
Filing destination: ${credit.filing_destination}
Documents needed: ${credit.documents_needed?.join(", ") || "Not listed"}
Fallback explanation: ${credit.fallback_explanation}
User answers:
${answersSummary}

Write 2 to 3 short sentences. Be careful and non-definitive: say this "may" apply, not that it definitely applies. Avoid tax jargon where possible. End with one concrete "next step" the person can take. Do not mention that you are an AI.`;
}

export function getFallbackExplanation(credit) {
  return (
    credit?.fallback_explanation ??
    "This may be worth reviewing before you file. Your next step is to gather the listed documents and confirm eligibility with CRA guidance or a free tax clinic."
  );
}

function formatEstimate(credit) {
  const estimate = credit?.estimated_dollars;

  if (!estimate) {
    return "Not estimated";
  }

  if (typeof estimate === "number") {
    return `$${estimate.toLocaleString("en-CA")}`;
  }

  if (estimate.type === "fixed") {
    return `$${Number(estimate.value ?? 0).toLocaleString("en-CA")}`;
  }

  if (estimate.type === "range") {
    return `$${Number(estimate.range_low ?? 0).toLocaleString("en-CA")} to $${Number(
      estimate.range_high ?? 0
    ).toLocaleString("en-CA")}`;
  }

  if (estimate.type === "calculated") {
    return "Calculated from the user's answers";
  }

  return "Not estimated";
}

function formatAnswers(answers = {}) {
  const entries = Object.entries(answers);

  if (entries.length === 0) {
    return "- No answers provided";
  }

  return entries
    .map(([questionId, answer]) => `- ${questionId}: ${formatAnswer(answer)}`)
    .join("\n");
}

function formatAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.join(", ");
  }

  if (answer === null || answer === undefined || answer === "") {
    return "not provided";
  }

  return String(answer);
}
