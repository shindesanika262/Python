
import React, { useState } from "react";
import axios from "axios";
import "../../../../src/App.css";

const assessmentCriteria = [
  {
    title: "Depth of understanding",
    detail: "Explains the concept in their own words and why it works.",
  },
  {
    title: "Practical demonstration",
    detail: "Demonstrates working Python code and explains the output.",
  },
  {
    title: "Problem-solving ability",
    detail: "Covers use cases, edge cases, errors, and limitations.",
  },
  {
    title: "Content composition",
    detail: "Uses a logical introduction, explanation, demo, and conclusion.",
  },
  {
    title: "Storytelling ability",
    detail: "Uses relatable scenarios, analogies, or examples.",
  },
  {
    title: "Communication skills",
    detail: "Speaks clearly and uses technical vocabulary appropriately.",
  },
  {
    title: "Presentation and confidence",
    detail: "Appears prepared and explains the topic confidently.",
  },
  {
    title: "Visual and video quality",
    detail: "Audio, code, slides, and screen recording are clear.",
  },
  {
    title: "AI literacy and independent thinking",
    detail: "Validates AI-assisted content and explains the solution.",
  },
  {
    title: "Professionalism and audience engagement",
    detail: "Respects the time limit and presents professionally.",
  },
];

function getReadiness(total) {
  if (total >= 90) {
    return {
      title: "Mentor-ready",
      description: "Strong explanation, demonstration, and communication.",
    };
  }

  if (total >= 75) {
    return {
      title: "Workplace-ready potential",
      description: "Good foundation with a few areas to strengthen.",
    };
  }

  if (total >= 60) {
    return {
      title: "Developing",
      description: "More practice is needed in applying and explaining concepts.",
    };
  }

  if (total >= 40) {
    return {
      title: "Needs guided practice",
      description: "Targeted support is needed in understanding or communication.",
    };
  }

  return {
    title: "Rebuild fundamentals",
    description: "Revisit the concept and submit a fresh demonstration.",
  };
}

function VideoAssessment() {
  const [studentId, setStudentId] = useState("");
  const [topic, setTopic] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [feedback, setFeedback] = useState("");
  const [scores, setScores] = useState(Array(10).fill(0));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const total = scores.reduce((sum, score) => sum + score, 0);
  const readiness = getReadiness(total);

  function updateScore(index, value) {
    setScores((previous) =>
      previous.map((score, i) =>
        i === index ? Number(value) : score
      )
    );
  }

  async function saveAssessment(event) {
    event.preventDefault();
    setMessage("");

    const numericStudentId = Number(studentId);
    const numericMentorId = Number(mentorId);

    if (!Number.isInteger(numericStudentId) || numericStudentId <= 0) {
      setMessage("Enter a valid existing numeric Student ID.");
      return;
    }

    if (!Number.isInteger(numericMentorId) || numericMentorId <= 0) {
      setMessage("Enter a valid existing numeric Mentor ID.");
      return;
    }

    if (!topic.trim()) {
      setMessage("Enter the Python topic.");
      return;
    }

    if (!assessmentDate) {
      setMessage("Select the assessment date.");
      return;
    }

    // These field names must match assessment_schema.py.
    const assessmentData = {
      student_id: numericStudentId,
      topic: topic.trim(),
      mentor_id: numericMentorId,
      assessment_date: assessmentDate,
      depth_understanding: scores[0],
      practical_demons: scores[1],
      problem_ability: scores[2],
      content: scores[3],
      storytelling: scores[4],
      communication: scores[5],
      presentation: scores[6],
      video_quality: scores[7],
      ai_literacy: scores[8],
      professionalism: scores[9],
      total_score: total,
      feedback: feedback.trim() || null,
    };

    setSaving(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/assessments/addassessment",
        assessmentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const savedId = response.data.new_assessment_id;

      setMessage(
        `Assessment saved successfully. Assessment ID: ${savedId}`
      );

      setStudentId("");
      setTopic("");
      setMentorId("");
      setAssessmentDate(new Date().toISOString().slice(0, 10));
      setFeedback("");
      setScores(Array(10).fill(0));
    } catch (error) {
      console.error("Assessment save error:", error);

      const detail = error.response?.data?.detail;
      console.error(
        "Backend validation response:",
        JSON.stringify(detail, null, 2)
      );

      let errorMessage;

      if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item) => {
            const field = Array.isArray(item.loc)
              ? item.loc.join(" -> ")
              : "Field";

            return `${field}: ${item.msg}`;
          })
          .join("\n");
      } else if (typeof detail === "string") {
        errorMessage = detail;
      } else if (error.response?.status === 500) {
        errorMessage =
          "Database error. Check the FastAPI terminal and database connection.";
      } else {
        errorMessage =
          error.message || "Unable to save the assessment.";
      }

      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  function buildReport() {
    return [
      "TRANSFLOWER LEARNING — PYTHON MENTOR CHALLENGE",
      "VIDEO-BASED EMPLOYABILITY ASSESSMENT",
      "",
      `Student ID: ${studentId || "Not entered"}`,
      `Python topic: ${topic || "Not entered"}`,
      `Mentor ID: ${mentorId || "Not entered"}`,
      `Assessment date: ${assessmentDate || "Not entered"}`,
      "",
      ...assessmentCriteria.map(
        (criterion, index) =>
          `${index + 1}. ${criterion.title}: ${scores[index]}/10`
      ),
      "",
      `TOTAL: ${total}/100`,
      `READINESS LEVEL: ${readiness.title}`,
      `Interpretation: ${readiness.description}`,
      "",
      "MENTOR FEEDBACK:",
      feedback || "Not entered",
    ].join("\n");
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(buildReport());
      setMessage("Assessment report copied.");
    } catch {
      setMessage("Unable to copy the report. Use Print / Save as PDF.");
    }
  }

  return (
    <div className="assessment-page">
      <header className="assessment-header">
        <h1>Transflower Learning</h1>
        <h2>Python Mentor Challenge</h2>
        <p>Video-Based Employability Assessment</p>
        <p>Duration: 20 minutes | Total Marks: 100</p>
      </header>

      <main>
        <form onSubmit={saveAssessment}>
          <section className="card">
            <h2>Student Information</h2>

            <div className="fields">
              <label>
                Student ID
                <input
                  type="number"
                  min="1"
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                  placeholder="Enter existing Student ID"
                  required
                />
              </label>

              <label>
                Python Topic
                <input
                  type="text"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="e.g. Decorators, Generators"
                  required
                />
              </label>

              <label>
                Mentor ID
                <input
                  type="number"
                  min="1"
                  value={mentorId}
                  onChange={(event) => setMentorId(event.target.value)}
                  placeholder="Enter existing Mentor ID"
                  required
                />
              </label>

              <label>
                Assessment Date
                <input
                  type="date"
                  value={assessmentDate}
                  onChange={(event) => setAssessmentDate(event.target.value)}
                  required
                />
              </label>
            </div>
          </section>

          <section className="card">
            <h2>Assessment Rubric — 100 Marks</h2>
            <p className="intro">
              Choose a score from 0 to 10 for each criterion.
            </p>

            {assessmentCriteria.map((criterion, index) => (
              <article className="criterion" key={criterion.title}>
                <div className="criterion-top">
                  <div>
                    <h3>
                      {index + 1}. {criterion.title}
                    </h3>
                    <p>{criterion.detail}</p>
                  </div>

                  <div className="score">{scores[index]} / 10</div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={scores[index]}
                  onChange={(event) =>
                    updateScore(index, event.target.value)
                  }
                  aria-label={`${criterion.title}, score out of 10`}
                />

                <div className="range-labels">
                  <span>0 — Insufficient</span>
                  <span>5 — Developing</span>
                  <span>10 — Excellent</span>
                </div>
              </article>
            ))}
          </section>

          <section className="card">
            <h2>Overall Result</h2>

            <div className="summary">
              <div>
                <small>TOTAL SCORE</small>
                <div className="total">
                  {total}
                  <span className="total-max"> / 100</span>
                </div>
              </div>

              <div>
                <small>READINESS LEVEL</small>
                <div className="level">{readiness.title}</div>
                <p>{readiness.description}</p>
              </div>
            </div>

            <div className="feedback-area">
              <label htmlFor="feedback">Mentor Feedback</label>
              <textarea
                id="feedback"
                rows="5"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="Enter strengths, evidence, and recommendations..."
              />
            </div>

            <div className="actions">
              <button className="primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Assessment"}
              </button>

            </div>

            {message && (
              <p className="message" role="status" aria-live="polite">
                {message}
              </p>
            )}
          </section>
        </form>

        <section className="card scoring-guide">
          <h2>Scoring Guide</h2>

          <div className="scoring-grid">
            <div className="scoring-level">
              <strong>9–10 — Excellent</strong>
              <p>Strong independent explanation and demonstration.</p>
            </div>
            <div className="scoring-level">
              <strong>7–8 — Good</strong>
              <p>Correct and clear, with minor gaps.</p>
            </div>
            <div className="scoring-level">
              <strong>5–6 — Developing</strong>
              <p>Understands the basics but needs more practice.</p>
            </div>
            <div className="scoring-level">
              <strong>3–4 — Weak</strong>
              <p>Limited understanding or incomplete demonstration.</p>
            </div>
            <div className="scoring-level">
              <strong>0–2 — Insufficient evidence</strong>
              <p>Cannot explain the core concept adequately.</p>
            </div>
          </div>

          <p className="readiness-bands">
            Suggested readiness bands: 90–100 Mentor-ready ·
            75–89 Workplace-ready potential · 60–74 Developing ·
            40–59 Needs guided practice · 0–39 Rebuild fundamentals.
          </p>
        </section>
      </main>

      <footer>
        Transflower Learning · Learn deeply. Demonstrate clearly.
        Mentor responsibly.
      </footer>
    </div>
  );
}

export default VideoAssessment;
