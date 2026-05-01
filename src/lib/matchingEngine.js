import dtcCredits from "../data/dtc_credits.json";
import studentCredits from "../data/student_credits.json";

const CREDIT_DATABASES = {
  student: studentCredits,
  dtc: dtcCredits,
};

/**
 * Match intake answers against the static credit database.
 *
 * @param {"student" | "dtc"} audience
 * @param {Record<string, unknown>} answers
 * @returns {Array<object>} eligible credits with computed estimate metadata
 */
export function matchCredits(audience, answers = {}) {
  const creditDb = CREDIT_DATABASES[audience];

  if (!creditDb) {
    return [];
  }

  return creditDb
    .filter((credit) => isEligible(credit.eligibility_rules, answers))
    .map((credit) => ({
      ...credit,
      computed_estimate: computeEstimate(credit, answers),
    }))
    .sort((a, b) => (a.ui_priority ?? 999) - (b.ui_priority ?? 999));
}

export function isEligible(rules = {}, answers = {}) {
  const allOf = rules.all_of ?? [];
  const anyOf = rules.any_of ?? [];
  const noneOf = rules.none_of ?? [];

  const passesAll = allOf.every((condition) => evaluateCondition(condition, answers));
  const passesAny = anyOf.length === 0 || anyOf.some((condition) => evaluateCondition(condition, answers));
  const passesNone = noneOf.every((condition) => !evaluateCondition(condition, answers));

  return passesAll && passesAny && passesNone;
}

export function evaluateCondition(condition, answers = {}) {
  const answerValue = answers[condition.question_id];
  const expectedValue = condition.value;

  switch (condition.operator) {
    case "equals":
      return answerValue === expectedValue;
    case "greater_than":
      return toNumber(answerValue) > Number(expectedValue);
    case "less_than":
      return toNumber(answerValue) < Number(expectedValue);
    case "includes":
      return includesValue(answerValue, expectedValue);
    case "not_includes":
      return !includesValue(answerValue, expectedValue);
    default:
      return false;
  }
}

export function computeEstimate(credit, answers = {}) {
  const estimate = credit.estimated_dollars ?? { type: "not_estimated" };
  const base = {
    type: estimate.type,
    disclaimer: estimate.disclaimer ?? "",
    calculation: estimate.calculation ?? null,
  };

  switch (estimate.type) {
    case "fixed":
      return {
        ...base,
        value: normalizeMoney(estimate.value),
        display: formatMoney(estimate.value),
      };
    case "calculated": {
      const value = calculateKnownFormula(estimate.calculation, answers);
      return {
        ...base,
        value,
        display: value === null ? "Varies" : formatMoney(value),
      };
    }
    case "range": {
      const range = calculateRange(credit, estimate, answers);
      return {
        ...base,
        range_low: range.low,
        range_high: range.high,
        display: formatRange(range.low, range.high),
      };
    }
    case "not_estimated":
    default:
      return {
        ...base,
        value: null,
        display: "Not estimated",
      };
  }
}

function calculateKnownFormula(formula, answers) {
  const tuitionAmount = toNumber(answers.tuition_amount_paid);
  const studentLoanInterest = toNumber(answers.student_loan_interest_amount);

  switch (formula) {
    case "tuition_amount_paid * 0.15":
      return tuitionAmount > 0 ? normalizeMoney(tuitionAmount * 0.15) : null;
    case "min(tuition_amount_paid * 0.15, 750)":
      return tuitionAmount > 0 ? normalizeMoney(Math.min(tuitionAmount * 0.15, 750)) : null;
    case "student_loan_interest_amount * 0.15":
      return studentLoanInterest > 0 ? normalizeMoney(studentLoanInterest * 0.15) : null;
    default:
      return null;
  }
}

function calculateRange(credit, estimate, answers) {
  if (credit.id === "dtc_retroactive_potential") {
    const years = Math.min(Math.max(toNumber(answers.years_with_condition), 0), 10);
    return {
      low: 0,
      high: normalizeMoney(years * 2800),
    };
  }

  return {
    low: normalizeMoney(estimate.range_low ?? 0),
    high: normalizeMoney(estimate.range_high ?? 0),
  };
}

function includesValue(answerValue, expectedValue) {
  if (Array.isArray(expectedValue)) {
    return expectedValue.includes(answerValue);
  }

  if (Array.isArray(answerValue)) {
    return answerValue.includes(expectedValue);
  }

  return answerValue === expectedValue;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
}

function formatMoney(value) {
  const normalized = normalizeMoney(value);

  if (normalized === null) {
    return "Varies";
  }

  return `$${normalized.toLocaleString("en-CA")}`;
}

function formatRange(low, high) {
  if (low === null || high === null) {
    return "Varies";
  }

  if (low === high) {
    return formatMoney(high);
  }

  return `${formatMoney(low)}-${formatMoney(high)}`;
}
