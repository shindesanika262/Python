# TFLAssessment — Agile Product Backlog

Product Owner's vision | Transflower Learning

TFLAssessment is a collaborative assessment and talent-readiness platform that connects Admins, Mentors, Subject Matter Experts (SMEs), Students, and Employers through assessment management, learning insights, skill evaluation, and placement workflows.

Following Agile methodology, we will organize the product backlog around Epics → User Stories → Acceptance Criteria → Priorities → Sprint Planning.

The goal is not simply to build dashboards and forms. The goal is to create a trustworthy system in which questions are authored and validated, assessments are conducted fairly, students receive meaningful feedback, mentors guide improvement, and employers discover eligible talent based on evidence.

## 1. Product vision and Agile delivery model

Product Vision

Measure skills → Identify gaps → Guide growth → Enable hiring

Epic 1 User & Role Management

Epic 2 Role-Based Dashboards

Epic 3 Question Bank

Epic 4 Assessment Lifecycle

Epic 5 Monitoring & Evaluation

Epic 6 Profiles & Placement

Cross-cutting capabilities

Security · Auditability · Reliability · Reporting · Accessibility

### Scrum assumptions

- Sprint duration: 2 weeks.
- Product Backlog: prioritized, refined, and owned by the Product Owner.
- Sprint Planning: the team selects work based on priority, dependencies, and capacity.
- Definition of Done: code reviewed, tested, secured, documented where needed, and accepted against the story criteria.
- Story points: relative effort estimates, not hours or days.

The backlog below is a proposed starting point based on the functionality described for TFLAssessment. Final permissions and business rules should be confirmed with the stakeholders.

## 2. User story format

Each story follows the standard Agile format:

> As a [user role], I want [capability], so that [business value].

Each story includes acceptance criteria that can be verified by the QA team. Priorities use MoSCoW-inspired labels: P1 — Must have, P2 — Should have, P3 — Could have. Story points are preliminary estimates using a Fibonacci scale.

## 3. Epic 1 — User and Role Management

Business objective: Ensure every stakeholder has secure access to the features and data required for their role.

| Story ID | User story                                                                                                     | Acceptance criteria                                                                                                            | Priority | Points |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- | ------ |
| TA-101   | As a user, I want to log in securely so that I can access my TFLAssessment workspace.                          | Valid credentials allow login; invalid credentials are rejected; errors do not reveal sensitive account information.           | P1       | 3      |
| TA-102   | As a user, I want to log out so that my account is protected when I finish using the platform.                 | Logout invalidates the session according to policy and prevents further protected access.                                      | P1       | 2      |
| TA-103   | As an Admin, I want to create stakeholder accounts so that users can join the platform.                        | Admin can create accounts with valid required fields; duplicate identifiers are handled; successful creation is confirmed.     | P1       | 5      |
| TA-104   | As an Admin, I want to assign roles so that users receive appropriate permissions.                             | Admin can assign supported roles; backend authorization enforces the assigned permissions.                                     | P1       | 5      |
| TA-105   | As an Admin, I want to activate or deactivate accounts so that I can control platform access.                  | Status changes are saved; deactivated users cannot continue accessing protected features beyond the defined revocation policy. | P1       | 3      |
| TA-106   | As a user, I want to maintain my profile so that my information remains accurate.                              | Valid permitted fields can be updated; invalid values are rejected; saved changes persist.                                     | P1       | 3      |
| TA-107   | As an Admin, I want to view and filter users by role and status so that I can manage the platform efficiently. | Search and filters return matching records; unauthorized profile fields remain protected.                                      | P2       | 3      |

## 4. Epic 2 — Role-Based Dashboards

Business objective: Give each stakeholder a useful view of their work, responsibilities, and progress.

| Story ID | User story                                                                                                                            | Acceptance criteria                                                                                           | Priority | Points |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| TA-201   | As an Admin, I want to view platform-wide metrics so that I can monitor overall activity.                                             | Dashboard displays defined user, assessment, and activity metrics; counts match the underlying data.          | P1       | 5      |
| TA-202   | As a Mentor, I want to view my assigned students and upcoming assessments so that I can plan mentoring activities.                    | Only authorized cohorts appear; scheduled assessments and relevant student progress are displayed accurately. | P1       | 5      |
| TA-203   | As an SME, I want to view my question bank and review workload so that I can manage question development.                             | Dashboard shows permitted question counts by supported lifecycle status.                                      | P2       | 3      |
| TA-204   | As a Student, I want to view upcoming assessments and my learning progress so that I know what to do next.                            | Dashboard displays eligible assessments, released results, and available progress indicators.                 | P1       | 5      |
| TA-205   | As an Employer, I want to view hiring and candidate pipeline metrics so that I can monitor recruitment activity.                      | Dashboard displays authorized job, shortlist, and recruitment status counts.                                  | P2       | 5      |
| TA-206   | As a stakeholder, I want my dashboard to show only role-appropriate information so that irrelevant or restricted data is not exposed. | Dashboard content and backend APIs enforce the same authorization rules.                                      | P1       | 5      |

## 5. Epic 3 — Question Bank Management

Business objective: Build a reusable, searchable, high-quality repository of assessment questions.

| Story ID | User story                                                                                                                                      | Acceptance criteria                                                                                                           | Priority | Points |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| TA-301   | As an SME, I want to create questions so that I can contribute subject knowledge to assessments.                                                | Required question content, answer format, and other mandatory fields are validated and saved.                                 | P1       | 5      |
| TA-302   | As an SME, I want to categorize questions by subject, topic, skill, and difficulty so that questions can be selected appropriately.             | Supported classifications can be assigned, saved, and used in search or filtering.                                            | P1       | 3      |
| TA-303   | As an SME, I want to edit draft questions so that I can improve their accuracy and clarity.                                                     | Draft changes are saved; required validations run; edits do not corrupt historical assessment records.                        | P1       | 3      |
| TA-304   | As an authorized reviewer, I want to approve or reject submitted questions so that only reviewed questions enter the approved bank.             | Approval and rejection require permission; status changes and required review comments are recorded.                          | P1       | 5      |
| TA-305   | As an assessment creator, I want to search and filter approved questions so that I can assemble suitable assessments efficiently.               | Search filters supported question attributes and returns only questions permitted for selection.                              | P1       | 5      |
| TA-306   | As an SME, I want to identify possible duplicate questions so that the bank maintains quality and reduces repetition.                           | The system flags likely duplicates or follows the configured duplicate-review process.                                        | P2       | 5      |
| TA-307   | As an authorized user, I want questions to have a controlled lifecycle so that draft, approved, and retired questions are handled consistently. | Only permitted lifecycle transitions are allowed; retired questions cannot be added to new assessments unless policy permits. | P1       | 5      |
| TA-308   | As an Admin, I want to control access to answer keys so that assessment integrity is preserved.                                                 | Students and other unauthorized users cannot retrieve correct answers before authorized release.                              | P1       | 5      |

## 6. Epic 4 — Assessment Creation and Scheduling

Business objective: Enable authorized users to configure and deliver assessments with clear rules and schedules.

| Story ID | User story                                                                                                                  | Acceptance criteria                                                                                              | Priority | Points |
| -------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| TA-401   | As an authorized assessment creator, I want to create an assessment so that I can evaluate specified skills.                | Assessment requires valid title, question configuration, timing, and other mandatory fields.                     | P1       | 5      |
| TA-402   | As an assessment creator, I want to select questions from the approved bank so that assessments use reviewed content.       | Only eligible questions are selectable; question count and scoring configuration are validated.                  | P1       | 5      |
| TA-403   | As an Admin or authorized Mentor, I want to schedule an assessment so that participants know when it is available.          | Start time, end time, duration, and permitted access window are saved and enforced.                              | P1       | 5      |
| TA-404   | As a Mentor, I want to assign assessments to students or cohorts so that the correct participants are evaluated.            | Assignment is saved; only eligible assigned students receive access.                                             | P1       | 5      |
| TA-405   | As a Student, I want to see assessment instructions before starting so that I understand the rules.                         | Instructions, duration, permitted attempts, and relevant rules are displayed before the attempt begins.          | P1       | 3      |
| TA-406   | As an Admin or authorized Mentor, I want to cancel or reschedule an assessment so that schedule changes are managed safely. | Updated schedule or cancellation is recorded; access and participant notifications follow the configured policy. | P1       | 5      |
| TA-407   | As an assessment creator, I want to configure scoring and attempt rules so that evaluation is consistent.                   | Scoring, negative marking if applicable, passing thresholds, and attempt limits follow the saved configuration.  | P1       | 5      |

## 7. Epic 5 — Assessment Conduction and Student Experience

Business objective: Allow students to take assessments fairly while preserving their responses and enforcing assessment rules.

| Story ID | User story                                                                                                                                         | Acceptance criteria                                                                                                     | Priority | Points |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| TA-501   | As a Student, I want to start an eligible assessment so that I can demonstrate my skills.                                                          | Only authorized students can start during the permitted window; an attempt is created according to the attempt policy.  | P1       | 5      |
| TA-502   | As a Student, I want to answer questions and navigate between them so that I can complete my assessment.                                           | Answers and navigation state behave consistently; supported question types validate correctly.                          | P1       | 5      |
| TA-503   | As a Student, I want my answers to be saved during the assessment so that accidental refreshes or interruptions do not unnecessarily lose my work. | Save status is reliable; previously persisted responses are restored according to the recovery policy.                  | P1       | 8      |
| TA-504   | As a Student, I want to see the remaining time so that I can manage my assessment.                                                                 | Timer reflects the server-authoritative deadline and cannot be extended simply by changing the browser clock.           | P1       | 5      |
| TA-505   | As a Student, I want to review my responses before final submission so that I can correct mistakes.                                                | The review screen shows answered and unanswered questions correctly while the attempt remains editable.                 | P1       | 3      |
| TA-506   | As a Student, I want to submit my assessment so that my responses are finalized for evaluation.                                                    | Confirmation rules are enforced; duplicate submissions do not create duplicate finalized attempts.                      | P1       | 5      |
| TA-507   | As a Student, I want the system to handle expiry consistently so that my assessment is concluded fairly.                                           | At expiry, the configured auto-submit or closure rule runs using the authoritative deadline and eligible saved answers. | P1       | 5      |
| TA-508   | As an Admin, I want assessment attempts to respect retake rules so that assessment policies are applied consistently.                              | Attempts beyond the configured limit are rejected unless an authorized exception is recorded.                           | P1       | 5      |

## 8. Epic 6 — Assessment Monitoring and Evaluation

Business objective: Give mentors and authorized stakeholders reliable visibility into assessment participation, scoring, and learning gaps.

| Story ID | User story                                                                                                                               | Acceptance criteria                                                                                             | Priority | Points |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| TA-601   | As a Mentor, I want to monitor assessment participation so that I can identify students who have not started or completed an assessment. | Participation states reflect the latest persisted attempt information.                                          | P1       | 5      |
| TA-602   | As a Mentor, I want to view individual assessment performance so that I can understand each student's strengths and weaknesses.          | Authorized results show the correct student, attempt, score, and permitted response details.                    | P1       | 5      |
| TA-603   | As a Student, I want to view my results after release so that I can understand my performance.                                           | Results are available only after the configured release condition is met.                                       | P1       | 3      |
| TA-604   | As a Mentor, I want to compare performance by skill or topic so that I can identify learning gaps.                                       | Skill-level metrics are calculated from the correct questions and scoring rules.                                | P1       | 5      |
| TA-605   | As a Mentor, I want to provide feedback and improvement recommendations so that students know how to improve.                            | Feedback is saved against the intended student and assessment and displayed to authorized users.                | P1       | 5      |
| TA-606   | As an authorized evaluator, I want to review and correct an erroneous result so that genuine evaluation mistakes can be addressed.       | Correction requires permission, preserves the original audit trail, and updates dependent results consistently. | P1       | 5      |
| TA-607   | As an Admin, I want to generate assessment reports so that I can review participation, completion, and performance across cohorts.       | Report totals match underlying records and respect the selected cohort, assessment, and date filters.           | P2       | 5      |
| TA-608   | As a Mentor, I want to compare a student's results across assessments so that I can track learning growth over time.                     | Historical results are displayed in chronological order with consistent scoring context.                        | P2       | 5      |

## 9. Epic 7 — Student Profile and Skill Evidence

Business objective: Maintain a reliable profile of student qualifications, skills, achievements, and assessment evidence for learning and placement.

| Story ID | User story                                                                                                                                          | Acceptance criteria                                                                                             | Priority | Points |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| TA-701   | As a Student, I want to maintain my education and contact information so that my profile remains accurate.                                          | Required fields are validated; permitted changes persist and are reflected in the profile.                      | P1       | 3      |
| TA-702   | As a Student, I want to maintain my technical skills so that mentors and authorized employers can understand my capabilities.                       | Skills can be added, edited, or removed according to validation and visibility rules.                           | P1       | 3      |
| TA-703   | As a Student, I want to upload my résumé so that I can provide my career information for placement.                                                 | Supported file types and sizes are validated; the file is stored securely and linked to the correct profile.    | P1       | 5      |
| TA-704   | As a Mentor, I want to view my assigned students' profiles and skill evidence so that I can guide their development.                                | Only permitted profiles and evidence are visible, with access controls enforced by the backend.                 | P1       | 5      |
| TA-705   | As a Student, I want to control the visibility of permitted profile information so that I can manage how my information is shared.                  | Visibility settings are saved and enforced consistently in profile views and APIs.                              | P1       | 5      |
| TA-706   | As an authorized user, I want to view relevant assessment evidence alongside a student's skills so that skill claims can be interpreted in context. | Evidence is linked to the correct assessment and student, with result-release and authorization rules enforced. | P2       | 5      |

## 10. Epic 8 — Placement and Employer Collaboration

Business objective: Connect assessment-backed student skills with job opportunities and employer hiring workflows.

| Story ID | User story                                                                                                                                    | Acceptance criteria                                                                                                     | Priority | Points |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| TA-801   | As an Employer, I want to maintain my company profile so that candidates and administrators can identify my organization.                     | Required company details are validated and saved; only authorized employer users can edit them.                         | P1       | 3      |
| TA-802   | As an Employer, I want to create job postings so that eligible candidates can discover available opportunities.                               | Job requirements, skills, and eligibility criteria are validated; posting status controls visibility.                   | P1       | 5      |
| TA-803   | As an Employer, I want to search candidates by skills and eligibility so that I can discover relevant talent.                                 | Search uses supported filters and returns only candidates whose profiles are visible and eligible.                      | P1       | 8      |
| TA-804   | As an Employer, I want to view authorized candidate profiles and assessment evidence so that I can make informed hiring decisions.            | Only permitted information and released evidence are displayed, consistent with applicable consent and access policies. | P1       | 5      |
| TA-805   | As an Employer, I want to shortlist candidates for a job so that I can manage promising applicants.                                           | Shortlisting records the candidate-job relationship and prevents invalid duplicate entries according to policy.         | P1       | 5      |
| TA-806   | As an Employer, I want to update candidate recruitment stages so that I can track the hiring pipeline.                                        | Supported status transitions are saved with the correct candidate and job association.                                  | P1       | 5      |
| TA-807   | As a Student, I want to see relevant placement opportunities for which I am eligible so that I can pursue suitable jobs.                      | Job listings respect eligibility, visibility, application windows, and the student's profile permissions.               | P2       | 5      |
| TA-808   | As an Admin, I want to view placement activity and hiring outcomes so that I can evaluate employer engagement and student placement progress. | Placement reports reflect recorded job, shortlist, and recruitment outcomes without double-counting.                    | P2       | 5      |

## 11. Epic 9 — Security, Audit, and Platform Reliability

These stories apply across all five stakeholder roles. They are part of the product backlog because a collaborative platform must protect data and preserve the integrity of assessment outcomes.

| Story ID | User story                                                                                                                                              | Acceptance criteria                                                                                                       | Priority | Points |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| TA-901   | As an Admin, I want all protected operations to enforce role permissions so that users cannot perform unauthorized actions.                             | Backend APIs validate authentication and authorization for every protected operation.                                     | P1       | 8      |
| TA-902   | As a platform owner, I want assessment and profile data isolated by authorized ownership so that users cannot access other users' restricted records.   | Attempts to access records by changing IDs or API parameters are rejected when unauthorized.                              | P1       | 8      |
| TA-903   | As an Admin, I want important administrative and assessment actions audited so that changes can be traced.                                              | Required audit entries record actor, action, target, timestamp, and relevant outcome without exposing prohibited secrets. | P1       | 5      |
| TA-904   | As a Student, I want my assessment data to remain consistent during concurrent submissions or service interruptions so that my results are trustworthy. | Valid submissions are persisted without unintended duplication, loss, or incorrect ownership.                             | P1       | 8      |
| TA-905   | As a platform owner, I want the system to enforce rate limits and safe input handling so that common abuse patterns are mitigated.                      | Defined rate limits, validation, and output-encoding rules are applied to relevant endpoints and interfaces.              | P1       | 5      |
| TA-906   | As an Admin, I want platform health and failures to be observable so that operational issues can be diagnosed.                                          | Relevant service errors and health indicators are available through the configured monitoring system.                     | P2       | 5      |
| TA-907   | As a platform owner, I want data recovery and backup procedures to be testable so that critical assessment records can be restored after a failure.     | Restore procedures are validated against agreed recovery objectives and data-integrity checks.                            | P1       | 8      |
| TA-908   | As a user, I want the application to remain usable across supported devices and assistive technologies so that I can complete my work effectively.      | Agreed responsive-layout, keyboard-navigation, and accessibility criteria are met.                                        | P2       | 5      |

## 12. Suggested MVP sprint roadmap

The following roadmap is a proposed sequence, not a fixed commitment. The Product Owner and delivery team should adjust it based on dependencies, team velocity, architecture, and the existing state of TFLAssessment.

### Sprint 1

Weeks 1–2

Foundation and access control

TA-101, TA-102, TA-103, TA-104, TA-106

Deliverable: Users can log in and access authorized functionality.

### Sprint 2

Weeks 3–4

Question bank

TA-301, TA-302, TA-303, TA-304, TA-305

Deliverable: SMEs can prepare and review assessment questions.

### Sprint 3

Weeks 5–6

Assessment configuration

TA-401, TA-402, TA-403, TA-404, TA-405

Deliverable: Authorized users can configure, schedule, and assign assessments.

### Sprint 4

Weeks 7–8

Student assessment experience

TA-501, TA-502, TA-503, TA-504, TA-506

Deliverable: Students can complete assessments with reliable answer persistence.

### Sprint 5

Weeks 9–10

Evaluation and mentoring

TA-601, TA-602, TA-603, TA-604, TA-605

Deliverable: Results, learning gaps, and mentor feedback are available.

### Sprint 6

Weeks 11–12

Profiles and placement MVP

TA-701, TA-702, TA-703, TA-801, TA-802, TA-803, TA-805

Deliverable: Students maintain profiles and employers begin job and candidate workflows.

### Sprint 7

Weeks 13–14

Integration and security hardening

TA-206, TA-308, TA-901, TA-902, TA-903, TA-904

Deliverable: Cross-role workflows and critical access controls are verified.

### Sprint 8

Weeks 15–16

Reporting, reliability, and release readiness

TA-201, TA-202, TA-204, TA-607, TA-808, TA-907, TA-908

Deliverable: Core dashboards, reporting, recovery, accessibility, and release checks are completed.

Planning note: This eight-sprint roadmap is an initial 16-week MVP proposal. It includes selected representative stories rather than all 66 stories. Some stories, particularly authentication, backend authorization, auditability, and assessment persistence, must be implemented earlier if the existing platform does not already provide them. The team should refine each sprint backlog before committing to delivery.

## 13. Definition of Ready and Definition of Done

Agile user stories should be sufficiently understood before development begins, and the team should agree on what completed work means.

Definition of Ready

Before a story enters a sprint

- User and business value are clear.
- Acceptance criteria are testable.
- Dependencies are identified.
- UX/API/data requirements are understood.
- The team has estimated the effort.

Definition of Done

Before a story is completed

- Implementation is complete and reviewed.
- Acceptance criteria pass.
- Relevant automated and regression tests pass.
- Authorization and validation are verified.
- Documentation and audit requirements are met.
- Product Owner acceptance is recorded as agreed.

## 14. Product Backlog prioritization and ownership

| Backlog area             | Primary stakeholder      | MVP objective                            |
| ------------------------ | ------------------------ | ---------------------------------------- |
| User management          | Admin                    | Secure identity and access               |
| Dashboards               | All five roles           | Relevant role-specific information       |
| Question bank            | SME, Admin               | Reviewed and reusable questions          |
| Assessment lifecycle     | Admin, Mentor            | Configure and assign assessments         |
| Assessment conduction    | Student                  | Reliable assessment completion           |
| Evaluation               | Mentor, Student          | Accurate results and actionable feedback |
| Student profiles         | Student, Mentor          | Verified skill and assessment evidence   |
| Placement                | Employer, Student, Admin | Candidate discovery and recruitment      |
| Security and reliability | Admin, platform team     | Trustworthy, protected operations        |

### What the Product Owner should do next

1. Validate the backlog: Confirm which features are already implemented, which are incomplete, and which are new.
2. Refine the highest-priority stories: Break larger stories into smaller, independently testable pieces.
3. Confirm business rules: Especially role permissions, question approval, assessment timing, result release, student data visibility, and placement eligibility.
4. Connect stories to test cases: Link each story ID to its functional and integration test cases from the earlier test plan.
5. Plan the first sprint: Select stories based on dependencies, team capacity, and the most valuable end-to-end workflow.

The proposed backlog contains 66 user stories across nine epics. Treat the estimates and sprint assignments as initial planning inputs, not fixed commitments.

Transflower Mentor's principle: Build the product incrementally. At the end of each sprint, demonstrate working software and ask: What new value can a student, mentor, SME, administrator, or employer actually experience? That is how TFLAssessment can evolve from a collection of modules into a collaborative learning and employability platform.