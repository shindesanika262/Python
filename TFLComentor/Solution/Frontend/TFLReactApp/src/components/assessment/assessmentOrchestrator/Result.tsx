import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";

import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";

import { WEBAPI_DOTNET_URL } from "../../../lib/utils";
import ResultData from "./entities/ResultData";

const saveAssessmentResult = async (
  studentId: number,
  assessmentId: number,
  result: ResultData,
) => {
  const response = await fetch(`${WEBAPI_DOTNET_URL}/StudentResult/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({
      studentId,
      assessmentId,
      score: result.scorePercentage,
      percentile: result.scorePercentage,
      timeTakenMinutes: 10,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    if (responseText) {
      let errorMessage = responseText;
      try {
        const body = JSON.parse(responseText);
        errorMessage = body?.message || body?.detail || body?.title || responseText;
      } catch {
        // Keep plain-text server errors visible on the result page.
      }
      throw new Error(errorMessage);
    }
    throw new Error(`The result could not be saved (HTTP ${response.status}).`);
  }
};

const Result = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingResult, setSavingResult] = useState<boolean>(false);

  useEffect(() => {
    const currentStudent = JSON.parse(sessionStorage.getItem("current") || "{}");
    const studentId = Number(currentStudent?.userid);
    const currentAssessmentId = Number(assessmentId);
    if (!Number.isInteger(studentId) || studentId <= 0 ||
      !Number.isInteger(currentAssessmentId) || currentAssessmentId <= 0) {
      setError("Missing student or assessment information.");
      setLoading(false);
      return;
    }
    console.log("studentId:", studentId);
    console.log("assessmentId:", assessmentId);

    fetch(`${WEBAPI_DOTNET_URL}/Score/GetAssessmentResultData/${studentId}/${assessmentId}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch result");
        }
        return res.json();
      })
      .then(async (data: ResultData) => {
        setResult(data);
        setSavingResult(true);
        try {
          const resultAssessmentId = Number(data.assessmentId) || currentAssessmentId;
          await saveAssessmentResult(studentId, resultAssessmentId, data);
          setSaveError(null);
        } catch (saveErr) {
          console.error("Error saving assessment result:", saveErr);
          setSaveError(saveErr instanceof Error
            ? saveErr.message
            : "The result could not be saved.");
        } finally {
          setSavingResult(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load result. Please try again.");
      })
      .finally(() => { setLoading(false); });
  }, [assessmentId]);

  const handleRetrySave = async () => {
    if (!result) return;

    const currentStudent = JSON.parse(sessionStorage.getItem("current") || "{}");
    const studentId = Number(currentStudent?.userid);
    const currentAssessmentId = Number(result.assessmentId) || Number(assessmentId);
    if (!Number.isInteger(studentId) || studentId <= 0 ||
      !Number.isInteger(currentAssessmentId) || currentAssessmentId <= 0) {
      return;
    }

    setSavingResult(true);
    setSaveError(null);
    try {
      await saveAssessmentResult(studentId, currentAssessmentId, result);
    } catch (saveErr) {
      console.error("Error saving assessment result:", saveErr);
      setSaveError(saveErr instanceof Error
        ? saveErr.message
        : "The result could not be saved.");
    } finally {
      setSavingResult(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-elegant overflow-hidden">
            <div className="bg-gradient-hero p-6 sm:p-8">
              <CardContent className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Assessment Result
                </h2>
                {loading && (<p className="text-muted-foreground">Loading result...</p>)}
                {!loading && error && (<p className="text-red-500">{error}</p>)}
                {!loading && result && (<div className="space-y-4 text-lg">
                  <p><strong>Test Title:</strong>{" "}{result.testTitle}</p>
                  <p><strong>Total Questions:</strong>{" "}{result.totalQuestions}</p>
                  <p><strong>Correct Answers:</strong>{" "}{result.correctAnswers}</p>
                  <p><strong>Wrong Answers:</strong>{" "}{result.wrongAnswers}</p>
                  <p>
                    <strong>UnAnswered Questions:</strong>{" "}
                    {Math.max(0, result.totalQuestions - result.correctAnswers - result.wrongAnswers)}
                  </p>
                  <p><strong>Percentage:</strong>{" "}{result.scorePercentage.toFixed(2)}%</p>
                </div>
                )}
                {!loading && result && saveError && (
                  <div role="alert" className="mt-4 space-y-3 text-sm text-red-600">
                    <p>Your result is available, but it could not be saved: {saveError}</p>
                    <Button onClick={handleRetrySave} disabled={savingResult}>
                      {savingResult ? "Saving result..." : "Retry saving result"}
                    </Button>
                  </div>
                )}
                {!loading && result && savingResult && !saveError && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Saving your result...
                  </p>
                )}

                {!loading && !result && !error && (<p className="text-red-500">No result data found.</p>)}
                <Button onClick={() => navigate("/models/upcoming-assessment")} className="mt-8">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Assessments
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Result;