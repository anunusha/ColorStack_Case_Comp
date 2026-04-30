"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const questionSets = {
  student: [
    {
      id: "paid_tuition_2024",
      question_text: "Did you pay tuition fees in 2024?",
      helper_text: "This can include university, college, or eligible training.",
      answer_type: "yes_no",
    },
    {
      id: "has_t2202",
      question_text: "Do you have, or can you download, a T2202 form?",
      helper_text: "Most schools provide this through the student portal.",
      answer_type: "yes_no",
    },
    {
      id: "moved_for_school",
      question_text: "Did you move at least 40 km closer to school or work?",
      helper_text: "Moving expenses can matter for some students.",
      answer_type: "yes_no",
    },
    {
      id: "has_income",
      question_text: "Did you earn employment or self-employment income?",
      helper_text: "Income can affect refundable benefits and credits.",
      answer_type: "yes_no",
    },
    {
      id: "international_student",
      question_text: "Are you an international student?",
      helper_text: "Some filing steps differ, but you may still have options.",
      answer_type: "yes_no",
    },
  ],
  dtc: [
    {
      id: "has_impairment",
      question_text: "Do you have a disability or impairment that affects daily life?",
      helper_text: "This can include physical, mental, sensory, or chronic conditions.",
      answer_type: "yes_no",
    },
    {
      id: "lasting_12_months",
      question_text: "Has it lasted, or is it expected to last, at least 12 months?",
      helper_text: "The DTC focuses on prolonged impairments.",
      answer_type: "yes_no",
    },
    {
      id: "needs_support",
      question_text: "Do you often need extra time, therapy, devices, or support?",
      helper_text: "Support needs can help explain how the impairment affects you.",
      answer_type: "yes_no",
    },
    {
      id: "has_practitioner",
      question_text: "Do you have a medical practitioner who knows your situation?",
      helper_text: "A practitioner must certify the DTC application form.",
      answer_type: "yes_no",
    },
    {
      id: "filed_before",
      question_text: "Have you applied for the DTC before?",
      helper_text: "Prior applications can affect your next best step.",
      answer_type: "yes_no",
    },
  ],
};

const audienceLabels = {
  student: "student",
  dtc: "DTC applicant",
};

const answerOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export default function IntakeFlow({ audience }) {
  const router = useRouter();
  const questions = useMemo(() => questionSets[audience] ?? [], [audience]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  if (questions.length === 0) {
    return (
      <main className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-16">
        <p className="rounded-3xl border border-red-100 bg-red-50 p-6 font-semibold text-red-700">
          We do not have an intake flow for this audience yet.
        </p>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  function selectAnswer(value) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: value,
    }));
  }

  function goBack() {
    if (!isFirstQuestion) {
      setCurrentIndex((previousIndex) => previousIndex - 1);
    }
  }

  function goNext() {
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: currentAnswer,
    };

    if (!isLastQuestion) {
      setCurrentIndex((previousIndex) => previousIndex + 1);
      return;
    }

    sessionStorage.setItem(
      "taxbridge-intake",
      JSON.stringify({ audience, answers: nextAnswers })
    );
    router.push("/results");
  }

  return (
    <main className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-16">
      <button
        className="mb-8 w-fit text-sm font-semibold text-blue-700"
        onClick={() => router.push("/")}
        type="button"
      >
        Back to home
      </button>

      <div className="mb-8">
        <p className="mb-4 w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          Intake for {audienceLabels[audience]}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          Answer a few plain-English questions.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          We will use your answers only in this browser session to estimate
          which credits may be worth reviewing.
        </p>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between gap-4 text-sm font-semibold text-slate-600">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-700 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            TaxBridge asks
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
            {currentQuestion.question_text}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            {currentQuestion.helper_text}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {answerOptions.map((option) => {
            const isSelected = currentAnswer === option.value;

            return (
              <button
                className={`rounded-2xl border p-5 text-left font-semibold transition ${
                  isSelected
                    ? "border-blue-700 bg-blue-700 text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50"
                }`}
                key={option.label}
                onClick={() => selectAnswer(option.value)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isFirstQuestion}
            onClick={goBack}
            type="button"
          >
            Back
          </button>
          <button
            className="rounded-full bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentAnswer === undefined}
            onClick={goNext}
            type="button"
          >
            {isLastQuestion ? "See my results" : "Next"}
          </button>
        </div>
      </section>
    </main>
  );
}
