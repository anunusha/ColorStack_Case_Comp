"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageShell from "@/components/PageShell";
import QuestionCard from "@/components/QuestionCard";
import SectionHeader from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
      <PageShell className="max-w-4xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 font-semibold text-red-700">
            We do not have an intake flow for this audience yet.
          </CardContent>
        </Card>
      </PageShell>
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

      <Card className="mt-10 shadow-sm">
        <CardContent className="grid gap-8 p-6 sm:p-8">
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[var(--color-muted-foreground)]">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} />
          </div>

          <QuestionCard
            helperText={currentQuestion.helper_text}
            questionText={currentQuestion.question_text}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {answerOptions.map((option) => {
              const isSelected = currentAnswer === option.value;

              return (
                <Button
                  className="h-auto justify-start rounded-xl px-5 py-6 text-left text-base"
                  key={option.label}
                  onClick={() => selectAnswer(option.value)}
                  variant={isSelected ? "default" : "outline"}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button disabled={isFirstQuestion} onClick={goBack} variant="outline">
              Back
            </Button>
            <Button disabled={currentAnswer === undefined} onClick={goNext}>
              {isLastQuestion ? "See my results" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
