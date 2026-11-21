import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { WEBAPI_DOTNET_URL } from "@/lib/utils";

import SelectedAnswersType from "./entities/SelectedAnswerType";
import QuestionType from "./entities/DisplayQuestion";

const getResponseError = async (response: Response, fallback: string) => {
  const responseText = await response.text();
  if (!responseText) {
    return `${fallback} (HTTP ${response.status}).`;
  }

  try {
    const body = JSON.parse(responseText);
    return body?.message || body?.detail || body?.title || responseText;
  } catch {
    return responseText;
  }
};

const Question = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const timerEndedRef = useRef(false);

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersType>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [examEnded, setExamEnded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!timerStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted]);

  useEffect(() => {
    if (timerStarted && timeLeft === 0) {
      timerEndedRef.current = true;
      setExamEnded(true);
      formRef.current?.requestSubmit();
    }
  }, [timeLeft, timerStarted]);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuestions = async () => {
      setLoading(true);
      setLoadError(null);
      setTimerStarted(false);
      setExamEnded(false);
      setTimeLeft(10 * 60);
      setDurationSeconds(0);

      if (!assessmentId) {
        setLoadError("Missing assessment information.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${WEBAPI_DOTNET_URL}/Assessment/${assessmentId}/questions`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(await getResponseError(response, "Could not load questions"));
        }

        const data: unknown = await response.json();
        const questionList = Array.isArray(data) ? data as QuestionType[] : [];
        setQuestions(questionList);
        setCurrentIndex(0);
        setSelectedAnswers({});

        const duration = Number(questionList[0]?.duration);
        if (duration > 0) {
          const seconds = duration * 60;
          setDurationSeconds(seconds);
          setTimeLeft(seconds);
          setTimerStarted(true);
        } else {
          setDurationSeconds(0);
          setTimerStarted(false);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadError(error instanceof Error
          ? error.message
          : "Could not load questions. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadQuestions();
    return () => controller.abort();
  }, [assessmentId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const getOptions = (question: QuestionType) => {
    const opts: { key: string; value: string; }[] = [];
    if (question.optionA)
      opts.push({ key: "A", value: question.optionA });
    if (question.optionB)
      opts.push({ key: "B", value: question.optionB });
    if (question.optionC)
      opts.push({ key: "C", value: question.optionC });
    if (question.optionD)
      opts.push({ key: "D", value: question.optionD });
    return opts;
  };
  const handleAnswerChange = (questionId: number, selectedKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: selectedKey, }));
  };
  const handleFirst = () => setCurrentIndex(0);
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handleLast = () =>
    setCurrentIndex(questions.length - 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || assessmentSubmitted) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const currentStudent = JSON.parse(
        sessionStorage.getItem("current") || "{}",
      );
      const studentId = Number(currentStudent?.userid);
      const currentAssessmentId = Number(assessmentId);
      if (!Number.isInteger(studentId) || studentId <= 0 ||
        !Number.isInteger(currentAssessmentId) || currentAssessmentId <= 0) {
        throw new Error("Missing student or assessment information.");
      }

      const payload = {
        studentId,
        assessmentId: currentAssessmentId,
        timeTakenMinutes: durationSeconds > 0
          ? Math.ceil((durationSeconds - timeLeft) / 60)
          : 0,
        answers: Object.entries(selectedAnswers).map(
          ([questionId, selectedOption]) => ({
            questionId: Number(questionId),
            selectedOption,
          }),
        ),
      };

      const response = await fetch(`${WEBAPI_DOTNET_URL}/Assessment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(await getResponseError(response, "Failed to submit answers"));
      }

      setAssessmentSubmitted(true);

      if (timerEndedRef.current) {
        setTimeout(() => {
          navigate(`/models/result/${currentAssessmentId}`);
        }, 2000);
      } else {
        navigate(`/models/result/${currentAssessmentId}`);
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit assessment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading questions...
      </div>
    );
  }
  if (loadError) {
    return (
      <div role="alert" className="p-6 text-red-600">
        {loadError}
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="p-6">
        No questions available
      </div>
    );
  }
  const currentQuestion = questions[currentIndex];
  const options = getOptions(currentQuestion);
  const isTimeRunningOut = timeLeft <= 20 && timeLeft > 0;
  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-slate-200 relative">
      {examEnded && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="relative bg-white rounded-lg p-6 shadow-xl text-center w-80">
            <h2 className="text-xl font-semibold text-gray-800">
              Assessment Submitted Time Is Over..!
            </h2>
            <p className="mt-3 text-gray-600">
              Thank you for attempting the assessment.
            </p>

          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-950">
          Assessment
        </h1>

        <div
          className={`text-xl font-mono font-bold px-4 py-2 rounded-xl border-2 ${timeLeft <= 20 && timeLeft > 0
            ? "text-red-600 border-red-500 bg-red-50"
            : "text-slate-700 border-slate-200"
            }`}
        >
          Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mt-6 rounded-3xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex justify-between border-b border-slate-200 pb-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Question
              {" "}
              {currentIndex + 1}
              {" "}
              of
              {" "}
              {questions.length}
            </h3>
            <span className="inline-flex rounded-full bg-[#fee2e2] px-4 py-2 text-sm font-semibold text-[#b91c1c]">
              #
              {currentQuestion.questionId}
            </span>
          </div>
          <p className="mt-4 text-base leading-7 text-slate-700">
            {currentQuestion.description}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {options.map((option) => (
              <label key={option.key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:border-[#dc2626]">

                <input type="radio" name={`question-${currentQuestion.questionId}`} value={option.key}

                  checked={selectedAnswers[currentQuestion.questionId] === option.key}
                  onChange={() =>
                    handleAnswerChange(currentQuestion.questionId, option.key)
                  }
                  className="h-4 w-4 accent-[#dc2626]" />
                <span className="text-slate-700 text-sm">
                  {option.key}.
                  {" "}
                  {option.value}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex justify-center gap-2">
            <button type="button" onClick={handleFirst} disabled={currentIndex === 0} className="rounded-lg bg-slate-200 px-3 py-1.5">
              First
            </button>
            <button type="button" onClick={handlePrevious} disabled={currentIndex === 0} className="rounded-lg bg-slate-200 px-3 py-1.5"       >
              Previous
            </button>
            <button type="button" onClick={handleNext} disabled={currentIndex === questions.length - 1} className="rounded-lg bg-slate-200 px-3 py-1.5" >
              Next
            </button>
            <button
              type="button" onClick={handleLast} disabled={currentIndex === questions.length - 1} className="rounded-lg bg-slate-200 px-3 py-1.5">
              Last
            </button>
          </div>
          {submitError && (
            <p role="alert" className="mx-auto text-sm text-red-600">
              {submitError}
            </p>
          )}
          <button type="submit" id="submit-assessment-btn" disabled={isSubmitting || assessmentSubmitted} className="mx-auto rounded-lg bg-[#dc2626] px-8 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" >
            {isSubmitting ? "Submitting..." : assessmentSubmitted ? "Assessment Submitted" : "Submit All Answers"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Question;
