import dtcCreditsHi from "@/data/dtc_credits.hi.json";
import dtcQuestionsHi from "@/data/dtc_questions.hi.json";
import dtcQuestionsEn from "@/data/dtc_questions.json";
import studentCreditsHi from "@/data/student_credits.hi.json";
import studentQuestionsHi from "@/data/student_questions.hi.json";
import studentQuestionsEn from "@/data/student_questions.json";
import { computeEstimate } from "@/lib/matchingEngine";

const QUESTION_SETS = {
  student: { en: studentQuestionsEn, hi: studentQuestionsHi },
  dtc: { en: dtcQuestionsEn, hi: dtcQuestionsHi },
};

const CREDITS_HI = {
  student: studentCreditsHi,
  dtc: dtcCreditsHi,
};

/**
 * @param {"student" | "dtc"} audience
 * @param {"en" | "hi"} lang
 */
export function getQuestionsForAudience(audience, lang) {
  const pack = QUESTION_SETS[audience];
  if (!pack) {
    return [];
  }
  return lang === "hi" ? pack.hi : pack.en;
}

/**
 * Overlay Hindi display fields onto matched credits; rules stay from English matching.
 * @param {Array<object>} credits
 * @param {"student" | "dtc"} audience
 * @param {"en" | "hi"} lang
 * @param {Record<string, unknown>} answers
 */
export function mergeLocalizedCredits(credits, audience, lang, answers = {}) {
  if (lang !== "hi") {
    return credits;
  }

  const localizedDb = CREDITS_HI[audience];
  if (!localizedDb?.length) {
    return credits;
  }

  const byId = Object.fromEntries(localizedDb.map((credit) => [credit.id, credit]));

  return credits.map((credit) => {
    const loc = byId[credit.id];
    if (!loc) {
      return credit;
    }

    const merged = {
      ...credit,
      name: loc.name,
      documents_needed: loc.documents_needed,
      filing_destination: loc.filing_destination,
      fallback_explanation: loc.fallback_explanation,
    };

    if (loc.estimated_dollars?.disclaimer != null && merged.estimated_dollars) {
      merged.estimated_dollars = {
        ...merged.estimated_dollars,
        disclaimer: loc.estimated_dollars.disclaimer,
      };
    }

    return {
      ...merged,
      computed_estimate: computeEstimate(merged, answers),
    };
  });
}
