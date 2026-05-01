"use client";

import { useMemo, useState } from "react";
import { CircleHelp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import dtcQuestions from "@/data/dtc_questions.json";
import studentQuestions from "@/data/student_questions.json";
import PageShell from "@/components/PageShell";
import QuestionHelpBot from "@/components/QuestionHelpBot";
import QuestionCard from "@/components/QuestionCard";
import SectionHeader from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const questionSets = {
  student: studentQuestions,
  dtc: dtcQuestions,
};

const audienceLabels = {
  student: "student",
  dtc: "DTC applicant",
};

function isConditionMatch(answerValue, expectedValue) {
  if (Array.isArray(answerValue)) {
    return answerValue.includes(expectedValue);
  }

  return answerValue === expectedValue;
}

function isQuestionVisible(question, answers) {
  const condition = question.conditional_on;

  if (!condition) {
    return true;
  }

  return isConditionMatch(answers[condition.question_id], condition.answer_value);
}

function getVisibleQuestions(questions, answers) {
  return questions.filter((question) => isQuestionVisible(question, answers));
}

function pruneAnswers(questions, answers) {
  const visibleQuestionIds = new Set(
    getVisibleQuestions(questions, answers).map((question) => question.id)
  );

  return Object.fromEntries(
    Object.entries(answers).filter(([questionId]) =>
      visibleQuestionIds.has(questionId)
    )
  );
}

function isAnswered(question, value) {
  switch (question.answer_type) {
    case "multi_select":
      return Array.isArray(value) && value.length > 0;
    case "number":
      return value !== undefined && value !== null && value !== "";
    default:
      return value !== undefined && value !== null && value !== "";
  }
}

export default function IntakeFlow({ audience }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const questions = useMemo(
    () =>
      [...(questionSets[audience] ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      ),
    [audience]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const visibleQuestions = useMemo(
    () => getVisibleQuestions(questions, answers),
    [questions, answers]
  );

  if (visibleQuestions.length === 0) {
    return (
      <PageShell className="max-w-4xl">
        <Card className="border-[color-mix(in_oklab,var(--palette-blush)_55%,var(--palette-white))] bg-[color-mix(in_oklab,var(--palette-blush)_10%,white)]">
          <CardContent className="p-6 font-semibold text-[var(--palette-blush)]">
            We do not have an intake flow for this audience yet.
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const effectiveIndex = Math.min(currentIndex, visibleQuestions.length - 1);
  const currentQuestion = visibleQuestions[effectiveIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isFirstQuestion = effectiveIndex === 0;
  const isLastQuestion = effectiveIndex === visibleQuestions.length - 1;
  const totalQuestionCount = questions.length;
  const progressPercent = ((effectiveIndex + 1) / totalQuestionCount) * 100;
  const isHelpOpen = searchParams.get("help") === currentQuestion.id;

  function selectAnswer(value) {
    setAnswers((previousAnswers) => {
      const nextAnswers = {
        ...previousAnswers,
        [currentQuestion.id]: value,
      };
      return pruneAnswers(questions, nextAnswers);
    });
  }

  function toggleMultiSelectOption(optionValue) {
    const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
    const hasValue = selectedValues.includes(optionValue);
    const nextValues = hasValue
      ? selectedValues.filter((value) => value !== optionValue)
      : [...selectedValues, optionValue];

    selectAnswer(nextValues);
  }

  function goBack() {
    if (!isFirstQuestion) {
      setCurrentIndex((previousIndex) => previousIndex - 1);
    }
  }

  function openHelp() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("help", currentQuestion.id);
    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  function closeHelp() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("help");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function goNext() {
    if (!isAnswered(currentQuestion, currentAnswer)) {
      return;
    }

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: currentAnswer,
    };
    const cleanedAnswers = pruneAnswers(questions, nextAnswers);

    if (!isLastQuestion) {
      setCurrentIndex((previousIndex) => previousIndex + 1);
      return;
    }

    sessionStorage.setItem(
      "taxbridge-intake",
      JSON.stringify({ audience, answers: cleanedAnswers })
    );
    router.push("/results");
  }

  function renderAnswerInput() {
    const options = currentQuestion.options ?? [];

    if (["yes_no", "single_select"].includes(currentQuestion.answer_type)) {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = currentAnswer === option.value;

            return (
              <Button
                className="h-auto justify-start whitespace-normal break-words rounded-xl px-5 py-6 text-left text-base leading-6"
                key={option.value}
                onClick={() => selectAnswer(option.value)}
                variant={isSelected ? "default" : "outline"}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      );
    }

    if (currentQuestion.answer_type === "multi_select") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
            const isSelected = selectedValues.includes(option.value);

            return (
              <Button
                className="h-auto justify-start whitespace-normal break-words rounded-xl px-5 py-6 text-left text-base leading-6"
                key={option.value}
                onClick={() => toggleMultiSelectOption(option.value)}
                variant={isSelected ? "default" : "outline"}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      );
    }

    if (currentQuestion.answer_type === "number") {
      return (
        <input
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-base text-[var(--color-foreground)] outline-none ring-offset-2 ring-offset-[var(--color-card)] focus:ring-2 focus:ring-[var(--color-ring)]"
          inputMode="numeric"
          min={currentQuestion.ui_hints?.min}
          max={currentQuestion.ui_hints?.max}
          onChange={(event) => selectAnswer(event.target.value)}
          placeholder={currentQuestion.ui_hints?.placeholder ?? "Enter a number"}
          type="number"
          value={currentAnswer ?? ""}
        />
      );
    }

    if (currentQuestion.answer_type === "dropdown") {
      return (
        <div className="grid gap-3">
          <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
            Select one option
          </p>
          <div className="max-h-72 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
            <div className="grid gap-2">
              {options.map((option) => {
                const isSelected = currentAnswer === option.value;

                return (
                  <Button
                    className="h-auto justify-start whitespace-normal break-words rounded-xl px-4 py-3 text-left text-base leading-6"
                    key={option.value}
                    onClick={() => selectAnswer(option.value)}
                    variant={isSelected ? "default" : "outline"}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Card className="border-[color-mix(in_oklab,var(--palette-blush)_55%,var(--palette-white))] bg-[color-mix(in_oklab,var(--palette-blush)_10%,white)]">
        <CardContent className="p-4 text-sm font-semibold text-[var(--palette-blush)]">
          Unsupported question type: {currentQuestion.answer_type}
        </CardContent>
      </Card>
    );
  }

  return (
    <PageShell className="max-w-4xl">
      <Button className="mb-8 w-fit" onClick={() => router.push("/")} variant="link">
        Back to home
      </Button>

      <SectionHeader
        badge={
          <Badge className="w-fit" variant="secondary">
            Intake for {audienceLabels[audience]}
          </Badge>
        }
        title="Answer a few plain-English questions."
        description="We will use your answers only in this browser session to estimate which credits may be worth reviewing. Nothing is stored on a server."
      />

      <Card className="mt-10 border-[var(--color-border)] shadow-[var(--shadow-card)]">
        <CardContent className="grid gap-8 p-6 sm:p-8">
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[var(--color-muted-foreground)]">
              <span>
                Question {effectiveIndex + 1} of {totalQuestionCount}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} />
          </div>

          <QuestionCard
            action={
              <Button
                aria-label="Get help with this question"
                className="h-8 w-8 rounded-full p-0"
                onClick={openHelp}
                title="Not sure? Ask for help"
                variant="outline"
              >
                <CircleHelp className="h-4 w-4" />
              </Button>
            }
            helperText={currentQuestion.ui_hints?.help_text}
            questionText={currentQuestion.question_text}
          />

          {renderAnswerInput()}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button disabled={isFirstQuestion} onClick={goBack} variant="outline">
              Back
            </Button>
            <Button disabled={!isAnswered(currentQuestion, currentAnswer)} onClick={goNext}>
              {isLastQuestion ? "See my results" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <QuestionHelpBot
        audience={audience}
        isOpen={isHelpOpen}
        key={currentQuestion.id}
        onClose={closeHelp}
        question={currentQuestion}
      />
    </PageShell>
  );
}
