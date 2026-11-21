import { useState } from "react";

function Assessment() {
    const assessmentCriteria = [
        {
            title: "Depth of understanding",
            detail: "Explains the concept in their own words and why it works."
        },
        {
            title: "Practical demonstration",
            detail: "Runs working Python code and explains important lines and output."
        },
        {
            title: "Problem-solving ability",
            detail: "Covers a real use case, edge cases, errors or limitations."
        },
        {
            title: "Content composition",
            detail: "Uses a logical structure: introduction, explanation, demo and conclusion."
        },
        {
            title: "Storytelling ability",
            detail: "Uses a relatable scenario, analogy or example to teach the concept."
        },
        {
            title: "Communication skills",
            detail: "Speaks clearly and uses technical vocabulary appropriately."
        },
        {
            title: "Presentation and confidence",
            detail: "Appears prepared, composed and comfortable explaining the topic."
        },
        {
            title: "Visual and video quality",
            detail: "Audio, code, slides, diagrams and screen recording are clear and useful."
        },
        {
            title: "AI literacy and independent thinking",
            detail: "Validates AI-assisted content and can explain and modify their solution."
        },
        {
            title: "Professionalism and audience engagement",
            detail: "Respects the time limit, acknowledges sources and ends professionally."
        }
    ];

    const [studentName, setStudentName] = useState("");
    const [topic, setTopic] = useState("");
    const [mentor, setMentor] = useState("");
    const [assessmentDate, setAssessmentDate] = useState("");
    const [feedback, setFeedback] = useState("");
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [scores, setScores] = useState(Array(10).fill(0));
    // Calculate total score
    const total = scores.reduce((sum, score) => sum + score, 0);
    // Calculate readiness level
    function getReadiness(total) {
        if (total >= 90) {
            return {
                title: "Mentor-ready",
                description:
                    "Strong independent explanation, demonstration and communication."
            };
        }

        if (total >= 75) {
            return {
                title: "Workplace-ready potential",
                description: "Good foundation with a few areas to strengthen."
            };
        }

        if (total >= 60) {
            return {
                title: "Developing",
                description:
                    "More practice needed in applying and explaining concepts."
            };
        }

        if (total >= 40) {
            return {
                title: "Needs guided practice",
                description:
                    "Targeted support needed in understanding or communication."
            };
        }

        return {
            title: "Rebuild fundamentals",
            description:
                "Revisit the concept and submit a fresh demonstration."
        };
    }

    const readiness = getReadiness(total);
    // Update score for a particular criterion
    function updateScore(index, value) {
        const newScores = [...scores];
        newScores[index] = Number(value);
        setScores(newScores);
    }

    // Get current local date and time
    function getCurrentDateTime() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // Save assessment using POST API
    async function saveAssessment() {
        setMessage("");

        // Validate student details
        if (!studentName.trim()) {
            setMessage("Please enter student name.");
            return;
        }

        if (!topic.trim()) {
            setMessage("Please enter Python topic.");
            return;
        }

        if (!mentor.trim()) {
            setMessage("Please enter evaluating mentor.");
            return;
        }

        if (!assessmentDate) {
            setMessage("Please select assessment date.");
            return;
        }

        // Prepare data for backend API
        const assessmentData = {
            student_name: studentName,
            topic: topic,
            evaluate_mentor: mentor,

            // Real-time date and local time
            assessment_date: getCurrentDateTime(),

            // Assessment criteria marks
            depth_of_understanding: scores[0],
            practical_demonstration: scores[1],
            problem_solving_ability: scores[2],
            content_composition: scores[3],
            storytelling_ability: scores[4],
            communication_skills: scores[5],
            presentation_and_confidence: scores[6],
            visual_and_video_quality: scores[7],
            ai_literacy_and_independent_thinking: scores[8],
            professionalism_and_audience_engagement: scores[9],

            // Result and feedback
            result_title: readiness.title,
            mentor_feedback: feedback
        };

        try {
            setIsSaving(true);

            // Send data to FastAPI backend
            const response = await fetch(
                "http://127.0.0.1:5000/api/assessments",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(assessmentData)
                }
            );

            // Read API response
            const result = await response.json();

            // Handle API error
            if (!response.ok) {
                setMessage(
                    result.detail || "Assessment could not be saved."
                );

                return;
            }

            // Success message
            setMessage("Assessment saved successfully!");

            console.log("Saved assessment:", result);

        } catch (error) {
            console.error("API Error:", error);

            setMessage(
                "Unable to connect to backend API. Please check the server."
            );

        } finally {
            setIsSaving(false);
        }
    }

    // Build assessment report
    function buildReport() {
        return [
            "TRANSFLOWER LEARNING — PYTHON MENTOR CHALLENGE",
            "VIDEO-BASED EMPLOYABILITY ASSESSMENT",
            "",
            `Student: ${studentName || "Not entered"}`,
            `Python topic: ${topic || "Not entered"}`,
            `Evaluating mentor: ${mentor || "Not entered"}`,
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
            "",
            "Note: This is one source of employability evidence, not a standalone hiring decision."
        ].join("\n");
    }

    // Copy assessment report
    async function copyReport() {
        const report = buildReport();

        try {
            await navigator.clipboard.writeText(report);

            setMessage(
                "Assessment report copied. Paste it into your document or spreadsheet."
            );

        } catch (error) {
            // Fallback for browsers that block clipboard access
            const temp = document.createElement("textarea");

            temp.value = report;
            temp.style.position = "fixed";
            temp.style.opacity = "0";

            document.body.appendChild(temp);

            temp.select();

            const copied = document.execCommand("copy");

            temp.remove();

            setMessage(
                copied
                    ? "Assessment report copied."
                    : "Copy was blocked by the browser. Use Print / Save as PDF instead."
            );
        }
    }

    // Print or save report as PDF
    function printReport() {
        setMessage("");

        window.print();
    }

    // Reset assessment form
    function resetForm() {
        if (!window.confirm("Clear all student details, scores and feedback?")) {
            return;
        }

        setStudentName("");
        setTopic("");
        setMentor("");
        setAssessmentDate("");
        setFeedback("");
        setScores(Array(10).fill(0));
        setMessage("");
    }

    return (
        <>
            <style>{`
                .assessment-page {
                    --brand: #8b0000;
                    --brand-dark: #5f0000;
                    --brand-light: #fff0f0;
                    --ink: #242424;
                    --muted: #666;
                    --line: #e5e5e5;
                    --surface: #ffffff;
                    --page: #f5f6f8;

                    background: var(--page);
                    color: var(--ink);
                    font-family: Arial, Helvetica, sans-serif;
                    line-height: 1.5;
                    min-height: 100vh;
                }

                .assessment-page * {
                    box-sizing: border-box;
                }

                .assessment-page header {
                    background: linear-gradient(
                        135deg,
                        var(--brand-dark),
                        var(--brand)
                    );
                    color: white;
                    padding: 28px 18px;
                    text-align: center;
                }

                .assessment-page header .brand {
                    margin: 0 0 5px;
                    font-size: 14px;
                    letter-spacing: 2px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .assessment-page header h1 {
                    margin: 0;
                    font-size: clamp(24px, 4vw, 36px);
                    color: white;
                    text-align: center;
                }

                .assessment-page header p {
                    margin: 8px 0 0;
                    color: #ffe6e6;
                }

                .assessment-page main {
                    max-width: 960px;
                    margin: 24px auto;
                    padding: 0 16px 36px;
                }

                .assessment-page .card {
                    background: var(--surface);
                    border: 1px solid var(--line);
                    border-radius: 14px;
                    padding: 22px;
                    margin-bottom: 18px;
                    box-shadow: 0 3px 12px rgba(0,0,0,.035);
                }

                .assessment-page h2 {
                    font-size: 20px;
                    margin: 0 0 14px;
                    text-align: left;
                }

                .assessment-page h3 {
                    text-align: left;
                }

                .assessment-page .intro {
                    color: var(--muted);
                    margin-top: 5px;
                    text-align: left;
                }

                .assessment-page .fields {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 14px;
                    margin-top: 20px;
                }

                .assessment-page .fields label {
                    text-align: left;
                }

                .assessment-page .fields input {
                    text-align: left;
                }

                .assessment-page label {
                    display: block;
                    font-weight: 700;
                    font-size: 14px;
                    margin-bottom: 6px;
                    text-align: left;
                }

                .assessment-page input[type="text"],
                .assessment-page input[type="date"],
                .assessment-page textarea {
                    width: 100%;
                    border: 1px solid #cfd2d8;
                    border-radius: 8px;
                    padding: 11px 12px;
                    font: inherit;
                    background: white;
                    color: #242424;
                }

                .assessment-page input:focus,
                .assessment-page textarea:focus {
                    outline: 2px solid #e5a4a4;
                    border-color: var(--brand);
                }

                .assessment-page .criterion {
                    border: 1px solid var(--line);
                    border-radius: 10px;
                    padding: 15px 16px;
                    margin-top: 12px;
                }

                .assessment-page .criterion-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 12px;
                }

                .assessment-page .criterion h3 {
                    margin: 0;
                    font-size: 16px;
                }

                .assessment-page .criterion p {
                    color: var(--muted);
                    margin: 4px 0 10px;
                    font-size: 13px;
                }

                .assessment-page .score {
                    min-width: 56px;
                    text-align: center;
                    font-weight: 700;
                    color: var(--brand);
                    background: var(--brand-light);
                    border-radius: 8px;
                    padding: 5px 8px;
                }

                .assessment-page input[type="range"] {
                    width: 100%;
                    accent-color: var(--brand);
                    cursor: pointer;
                }

                .assessment-page .range-labels {
                    display: flex;
                    justify-content: space-between;
                    color: var(--muted);
                    font-size: 12px;
                }

                .assessment-page .summary {
                    background: #faf5f5;
                    border: 1px solid #ecd5d5;
                    border-radius: 12px;
                    padding: 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 18px;
                    flex-wrap: wrap;
                }

                .assessment-page .summary small {
                    color: var(--muted);
                    font-weight: 700;
                    letter-spacing: .8px;
                }

                .assessment-page .total {
                    color: var(--brand);
                    font-size: 36px;
                    font-weight: 800;
                    line-height: 1.2;
                }

                .assessment-page .level {
                    font-weight: 700;
                    font-size: 17px;
                    text-align: left;
                }

                .assessment-page .level-description {
                    color: var(--muted);
                    font-size: 13px;
                    margin-top: 3px;
                }

                .assessment-page .actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 16px;
                }

                .assessment-page button {
                    border: 0;
                    border-radius: 8px;
                    padding: 11px 16px;
                    font: inherit;
                    font-weight: 700;
                    cursor: pointer;
                }

                .assessment-page button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .assessment-page .primary {
                    background: var(--brand);
                    color: white;
                }

                .assessment-page .primary:hover {
                    background: var(--brand-dark);
                }

                .assessment-page .secondary {
                    background: white;
                    color: var(--brand);
                    border: 1px solid var(--brand);
                }

                .assessment-page .neutral {
                    background: #eceef1;
                    color: #292929;
                }

                .assessment-page .message {
                    min-height: 22px;
                    color: #246b37;
                    font-size: 14px;
                    margin-top: 8px;
                }

                .assessment-page .rubric {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 10px;
                }

                .assessment-page .rubric div {
                    padding: 12px;
                    background: #f7f7f8;
                    border-radius: 8px;
                    text-align: left;
                }

                .assessment-page .rubric strong {
                    display: block;
                }

                .assessment-page footer {
                    text-align: center;
                    color: var(--muted);
                    font-size: 13px;
                    padding: 8px 16px 24px;
                }

                @media (max-width: 620px) {
                    .assessment-page .fields,
                    .assessment-page .rubric {
                        grid-template-columns: 1fr;
                    }

                    .assessment-page .card {
                        padding: 16px;
                    }

                    .assessment-page .summary {
                        align-items: flex-start;
                    }
                }

                @media print {
                    .assessment-page {
                        background: white;
                    }

                    .assessment-page header {
                        background: white;
                        color: #111;
                        border-bottom: 2px solid var(--brand);
                        padding: 12px;
                    }

                    .assessment-page header h1 {
                        color: #111;
                    }

                    .assessment-page header p {
                        color: #333;
                    }

                    .assessment-page main {
                        margin: 10px auto;
                        max-width: none;
                    }

                    .assessment-page .card {
                        box-shadow: none;
                        break-inside: avoid;
                        padding: 12px;
                    }

                    .assessment-page .actions,
                    .assessment-page .message,
                    .assessment-page footer {
                        display: none !important;
                    }

                    .assessment-page input,
                    .assessment-page textarea {
                        border: 1px solid #aaa;
                    }

                    .assessment-page .criterion {
                        break-inside: avoid;
                    }

                    .assessment-page input[type="range"] {
                        print-color-adjust: exact;
                    }
                }
            `}</style>

            <div className="assessment-page">
                <header>
                    <p className="brand">Transflower Learning</p>

                    <h1>Python Mentor Challenge</h1>

                    <p>
                        Video-Based Employability Assessment · 20-Minute Presentation
                    </p>
                </header>

                <main>
                    {/* Student Information */}
                    <section className="card">
                        <h2>Student Information</h2>

                        <p className="intro">
                            Record the student details before evaluating the video.
                        </p>

                        <div className="fields">
                            <div>
                                <label>Student name / ID</label>

                                <input
                                    type="text"
                                    placeholder="Enter student name or ID"
                                    value={studentName}
                                    onChange={(e) =>
                                        setStudentName(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label>Python topic</label>

                                <input
                                    type="text"
                                    placeholder="e.g. Decorators, Generators, Exceptions"
                                    value={topic}
                                    onChange={(e) =>
                                        setTopic(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label>Evaluating mentor</label>

                                <input
                                    type="text"
                                    placeholder="Mentor name"
                                    value={mentor}
                                    onChange={(e) =>
                                        setMentor(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label>Assessment date</label>

                                <input
                                    type="date"
                                    value={assessmentDate}
                                    onChange={(e) =>
                                        setAssessmentDate(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* Assessment Criteria */}
                    <section className="card">
                        <h2>Assessment Rubric — 100 Marks</h2>

                        <p className="intro">
                            Choose a score from 0 to 10 for each parameter.
                            Evaluate observable evidence, not just video polish.
                        </p>

                        <div id="criteria">
                            {assessmentCriteria.map((criterion, index) => (
                                <article
                                    className="criterion"
                                    key={index}
                                >
                                    <div className="criterion-top">
                                        <div>
                                            <h3>
                                                {index + 1}. {criterion.title}
                                            </h3>

                                            <p>{criterion.detail}</p>
                                        </div>

                                        <div className="score">
                                            {scores[index]} / 10
                                        </div>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        step="1"
                                        value={scores[index]}
                                        aria-label={`${criterion.title}, score out of 10`}
                                        onChange={(e) =>
                                            updateScore(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div className="range-labels">
                                        <span>0 — Insufficient</span>
                                        <span>5 — Developing</span>
                                        <span>10 — Excellent</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Overall Result */}
                    <section className="card">
                        <h2>Overall Result</h2>

                        <div className="summary" aria-live="polite">
                            <div>
                                <small>TOTAL SCORE</small>

                                <div className="total">
                                    {total}

                                    <span
                                        style={{
                                            fontSize: "18px",
                                            color: "#666"
                                        }}
                                    >
                                        {" "} / 100
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="level">
                                    {readiness.title}
                                </div>

                                <div className="level-description">
                                    {readiness.description}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <label>
                                Mentor feedback — evidence, strengths and next steps
                            </label>

                            <textarea
                                rows="5"
                                placeholder="Example: Explains loops clearly. Next step: demonstrate a boundary case and explain why it occurs."
                                value={feedback}
                                onChange={(e) =>
                                    setFeedback(e.target.value)
                                }
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="actions">

                            <button
                                className="primary"
                                type="button"
                                onClick={saveAssessment}
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? "Saving..."
                                    : "Save Assessment"}
                            </button>

                            <button
                                className="primary"
                                type="button"
                                onClick={copyReport}
                            >
                                Copy Assessment Report
                            </button>

                            <button
                                className="secondary"
                                type="button"
                                onClick={printReport}
                            >
                                Print / Save as PDF
                            </button>

                            <button
                                className="neutral"
                                type="button"
                                onClick={resetForm}
                            >
                                Reset Form
                            </button>
                        </div>

                        {/* API Response Message */}
                        <div className="message" role="status">
                            {message}
                        </div>
                    </section>

                    {/* Scoring Guide */}
                    <section className="card">
                        <h2>Scoring Guide</h2>

                        <div className="rubric">
                            <div>
                                <strong>9–10 · Excellent</strong>
                                Independent explanation, strong demonstration and real-world connection.
                            </div>

                            <div>
                                <strong>7–8 · Good</strong>
                                Correct and clear, with minor gaps or occasional reliance on notes.
                            </div>

                            <div>
                                <strong>5–6 · Developing</strong>
                                Understands basics but needs more depth, clarity or troubleshooting.
                            </div>

                            <div>
                                <strong>3–4 · Weak</strong>
                                Mostly memorized; limited understanding or incomplete demonstration.
                            </div>

                            <div>
                                <strong>0–2 · Insufficient evidence</strong>
                                Cannot explain the core idea or provide meaningful evidence.
                            </div>
                        </div>

                        <p
                            className="intro"
                            style={{ margin: "14px 0 0" }}
                        >
                            Suggested readiness bands: 90–100 Mentor-ready ·
                            75–89 Workplace-ready potential ·
                            60–74 Developing ·
                            40–59 Needs guided practice ·
                            0–39 Rebuild fundamentals.

                            These are internal guidance bands, not universal hiring standards.
                        </p>
                    </section>
                </main>

                <footer>
                    Transflower Learning · Learn deeply. Demonstrate clearly. Mentor responsibly.
                </footer>
            </div>
        </>
    );
}

export default Assessment;