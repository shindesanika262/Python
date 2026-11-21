# TFLAssessment — Role-Based Software Test Cases

Assessment is not just testing a student. It is a collaborative process of learning, evaluation, guidance, and career growth.

TFLAssessment is a collaborative platform connecting five key stakeholders: Admin, Mentor, Subject Matter Expert (SME), Student, and Employer. Each role interacts with different business functions, dashboards, and workflows. Our testing strategy must verify not only individual features but also how these roles collaborate throughout the assessment and placement lifecycle.

## 1. Understand the TFLAssessment testing scope

Five stakeholder roles

Admin · Mentor · SME · Student · Employer

Dashboard

Role-specific insights and progress

Assessment

Scheduling, conduction and monitoring

Question Bank

Creation, review, approval and reuse

Profile Management

Skills, identity and permissions

Monitoring & Reports

Progress, scores and performance

Placement

Jobs, candidates and hiring outcomes

The following test cases form a practical starting point for functional, integration, authorization, and end-to-end testing. They assume these capabilities exist or are planned; adapt them to the actual permissions and workflows implemented in TFLAssessment.

## 2. Common test case format

Each test case contains:

- Test Case ID — unique reference for tracking.
- Scenario — what must be tested.
- Preconditions — what must be true before testing.
- Test Steps — actions performed by the user.
- Expected Result — the correct behavior.
- Priority — P1 = critical, P2 = important, P3 = desirable.

Use `Not Run`, `Pass`, `Fail`, or `Blocked` to track execution.

## 3. Admin — Test cases

Role objective: Manage users, roles, access, assessment configuration, platform monitoring, and placement-related administration.

| Test ID | Test scenario                | Test steps                                                    | Expected result                                                               | Priority |
| ------- | ---------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------- |
| ADM-01  | Admin login                  | Enter valid admin credentials and log in                      | Admin dashboard opens                                                         | P1       |
| ADM-02  | Invalid login                | Enter an incorrect password                                   | Access is denied with a safe error message                                    | P1       |
| ADM-03  | Create user                  | Create a user with valid details and assign a role            | User is created with the correct role                                         | P1       |
| ADM-04  | Duplicate user               | Register an existing email or unique identifier               | Duplicate account is rejected or handled according to policy                  | P1       |
| ADM-05  | Assign role                  | Change a user's role                                          | New permissions take effect according to the authorization policy             | P1       |
| ADM-06  | Deactivate user              | Deactivate an existing account                                | User cannot access protected functionality after deactivation takes effect    | P1       |
| ADM-07  | Role-based dashboard         | Log in as Admin and review dashboard metrics                  | Administrative metrics and permitted controls are displayed                   | P1       |
| ADM-08  | Assessment configuration     | Create or configure an assessment schedule                    | Valid configuration is saved and reflected in the assessment workflow         | P1       |
| ADM-09  | Question bank administration | Review, categorize, or manage questions                       | Only authorized actions are permitted; changes are persisted                  | P1       |
| ADM-10  | Audit history                | Perform an administrative action and inspect the audit record | Relevant action, actor, and timestamp are recorded where auditing is required | P2       |
| ADM-11  | Unauthorized access          | Attempt to access an admin-only API as a Student              | Request is rejected without exposing protected data                           | P1       |
| ADM-12  | Search and filter            | Filter users by role, status, or other supported criteria     | Correct matching records are displayed                                        | P2       |

Important Admin edge cases

- An administrator must not accidentally remove their own last available administrative access unless the system has a safe recovery mechanism.
- Deactivated users must not retain access through an existing session or refresh token beyond the defined revocation policy.
- Role changes must not expose historical assessment data to unauthorized users.
- Deleting or disabling a user must not corrupt assessment records or placement history.

## 4. Mentor — Test cases

Role objective: Guide students, schedule or conduct assessments where authorized, monitor progress, interpret results, and recommend learning improvements.

| Test ID | Test scenario              | Test steps                                                 | Expected result                                                          | Priority |
| ------- | -------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ | -------- |
| MEN-01  | Mentor login               | Log in with valid mentor credentials                       | Mentor dashboard opens                                                   | P1       |
| MEN-02  | Assigned student list      | Open the student or cohort list                            | Only permitted students and cohorts are visible                          | P1       |
| MEN-03  | Student profile            | Open an assigned student's profile                         | Authorized profile, skills, and progress information is displayed        | P1       |
| MEN-04  | Assessment scheduling      | Schedule an assessment for an assigned cohort              | Assessment is saved with the correct date, time, and scope               | P1       |
| MEN-05  | Start assessment           | Open a scheduled assessment and start it, if authorized    | Assessment becomes available according to its schedule and permissions   | P1       |
| MEN-06  | Monitor live assessment    | View participating students during an assessment           | Supported status indicators update accurately                            | P1       |
| MEN-07  | Review assessment results  | Open completed assessment results                          | Correct scores and responses are displayed according to permissions      | P1       |
| MEN-08  | Provide feedback           | Add feedback or improvement recommendations                | Feedback is saved and associated with the correct student and assessment | P1       |
| MEN-09  | Track student progress     | Compare performance across multiple assessments            | Progress data reflects the correct student and assessment history        | P2       |
| MEN-10  | Identify learning gaps     | Review topic-wise or skill-wise performance                | Weak areas are correctly identified from available assessment data       | P2       |
| MEN-11  | Unauthorized cohort access | Try opening a student outside the mentor's permitted scope | Access is denied or restricted                                           | P1       |
| MEN-12  | Concurrent monitoring      | Multiple students submit responses simultaneously          | Monitoring remains accurate without duplicate or missing records         | P1       |

Mentor acceptance criterion: A mentor should be able to understand a student's learning journey without gaining access to administrative controls or unrelated students' private information.

## 5. Subject Matter Expert (SME) — Test cases

Role objective: Create high-quality assessment questions, validate technical accuracy, maintain question quality, and contribute subject expertise.

| Test ID | Test scenario              | Test steps                                                      | Expected result                                                                          | Priority |
| ------- | -------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------- |
| SME-01  | SME login                  | Log in with valid SME credentials                               | SME dashboard opens                                                                      | P1       |
| SME-02  | Create question            | Enter a question, answer options, correct answer, and topic     | Valid question is saved                                                                  | P1       |
| SME-03  | Mandatory field validation | Submit a question without required fields                       | Submission is rejected with validation feedback                                          | P1       |
| SME-04  | Configure difficulty       | Assign an available difficulty level                            | Selected difficulty is saved correctly                                                   | P2       |
| SME-05  | Map skill or topic         | Associate a question with a subject or skill                    | Question appears under the correct classification                                        | P1       |
| SME-06  | Edit draft question        | Modify a question that is still a draft                         | Updated content is saved                                                                 | P1       |
| SME-07  | Submit for review          | Submit a question for approval, if supported                    | Question enters the appropriate review state                                             | P1       |
| SME-08  | Approve or reject          | Review a submitted question if the SME has this permission      | Only permitted review actions are accepted and recorded                                  | P1       |
| SME-09  | Search question bank       | Search by topic, keyword, or difficulty                         | Correct matching questions are returned                                                  | P2       |
| SME-10  | Duplicate question         | Attempt to create an identical or near-identical question       | Duplicate detection or review behavior follows the defined policy                        | P2       |
| SME-11  | Question versioning        | Edit a question already used in an assessment                   | Historical results remain interpretable and existing attempts are not silently corrupted | P1       |
| SME-12  | Question security          | Attempt to access answer keys outside the SME's permitted scope | Unauthorized answer-key access is denied                                                 | P1       |

SME acceptance criterion: Question lifecycle, correctness, categorization, approval, and historical integrity must work together. A technically correct question is not enough if students can see its answer before the assessment.

## 6. Student — Test cases

Role objective: Maintain a profile, discover assigned assessments, complete them reliably, view permitted results, and improve skills.

| Test ID | Test scenario                    | Test steps                                                                 | Expected result                                                                                  | Priority |
| ------- | -------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------- |
| STU-01  | Student login                    | Log in with valid student credentials                                      | Student dashboard opens                                                                          | P1       |
| STU-02  | Profile creation                 | Enter required profile details                                             | Profile is created with valid data                                                               | P1       |
| STU-03  | Profile update                   | Change permitted profile fields and save                                   | Updated information is displayed after reload                                                    | P1       |
| STU-04  | View assigned assessments        | Open the assessment section                                                | Only assessments assigned or available to the student are listed                                 | P1       |
| STU-05  | Assessment before start time     | Attempt to start an assessment before its permitted window                 | Assessment remains inaccessible unless early access is allowed                                   | P1       |
| STU-06  | Start assessment                 | Start an available assessment                                              | Correct instructions, questions, and timer are displayed                                         | P1       |
| STU-07  | Answer questions                 | Select answers and navigate between questions                              | Answers are recorded correctly and persist according to the save policy                          | P1       |
| STU-08  | Unanswered questions             | Submit without answering every required question                           | System follows the configured validation and submission rules                                    | P1       |
| STU-09  | Submit assessment                | Confirm final submission                                                   | Attempt is finalized once and a confirmation is shown                                            | P1       |
| STU-10  | Timer expiration                 | Allow the assessment timer to expire                                       | System follows the configured auto-submit or expiry policy without losing eligible saved answers | P1       |
| STU-11  | Network interruption             | Disconnect and reconnect during an assessment                              | Recovery and answer persistence follow the documented policy                                     | P1       |
| STU-12  | View results                     | Open results after they are released                                       | Only authorized scores, feedback, and explanations are shown                                     | P1       |
| STU-13  | Review progress                  | Open assessment history or skill reports                                   | Data matches the student's own assessment records                                                | P2       |
| STU-14  | Access another student's profile | Attempt to open another student's records by changing an identifier or URL | Access is denied                                                                                 | P1       |
| STU-15  | Reattempt assessment             | Try to retake a completed assessment                                       | System enforces the configured attempt limit and retake policy                                   | P1       |
| STU-16  | Placement profile                | Complete permitted skills, education, and résumé fields                    | Profile data is validated and saved for authorized placement workflows                           | P1       |

Student acceptance criterion: An assessment must be fair, reliable, and secure. Refreshing the page, losing connectivity, or double-clicking Submit must not silently lose answers or create unintended duplicate attempts.

## 7. Employer — Test cases

Role objective: Discover eligible candidates, review authorized profiles and assessment evidence, publish or manage job opportunities where supported, and track recruitment progress.

| Test ID | Test scenario               | Test steps                                                                             | Expected result                                                              | Priority |
| ------- | --------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------- |
| EMP-01  | Employer login              | Log in using valid employer credentials                                                | Employer dashboard opens                                                     | P1       |
| EMP-02  | Employer profile            | Complete company and contact details                                                   | Valid employer profile is saved                                              | P1       |
| EMP-03  | Create job posting          | Enter job title, skills, experience, location, and eligibility                         | Valid job posting is saved in the configured state                           | P1       |
| EMP-04  | Invalid job posting         | Submit without mandatory job details                                                   | Validation prevents an invalid posting                                       | P1       |
| EMP-05  | Edit or close job           | Update or close an existing job posting                                                | Changes are saved and reflected in candidate discovery                       | P1       |
| EMP-06  | Search candidates           | Search using supported skills, experience, or eligibility filters                      | Matching authorized candidate profiles are returned                          | P1       |
| EMP-07  | View candidate profile      | Open a candidate's profile                                                             | Only permitted profile information is displayed                              | P1       |
| EMP-08  | View assessment evidence    | Open a candidate's assessment results, if authorized                                   | Only consented or otherwise authorized results are visible                   | P1       |
| EMP-09  | Shortlist candidate         | Add an eligible candidate to a shortlist                                               | Candidate is added to the correct job's shortlist                            | P1       |
| EMP-10  | Update recruitment status   | Move a candidate through configured recruitment stages                                 | Status changes are saved and correctly associated with the job and candidate | P1       |
| EMP-11  | Duplicate application       | Attempt to apply or shortlist the same candidate twice where duplicates are prohibited | Duplicate handling follows the configured business rule                      | P2       |
| EMP-12  | Unauthorized candidate data | Attempt to retrieve restricted data through a direct API request                       | Access is denied and sensitive data is not exposed                           | P1       |
| EMP-13  | Employer data isolation     | Attempt to access another employer's private job or recruitment records                | Cross-employer access is denied                                              | P1       |
| EMP-14  | Candidate availability      | Search for candidates whose profiles are inactive or unavailable                       | Results respect profile visibility and recruitment eligibility rules         | P1       |
| EMP-15  | Track hiring outcomes       | View recruitment statistics and candidate status                                       | Counts match the underlying recruitment records                              | P2       |

Employer acceptance criterion: Employers should be able to make evidence-based hiring decisions without accessing another employer's data or seeing student information that they are not authorized to view.

## 8. Cross-role integration test cases

Role-based testing verifies individual functionality. Integration testing verifies whether the complete collaborative workflow works across stakeholders.

## End-to-end assessment lifecycle

1. SME: Creates and submits assessment questions.
2. Admin or authorized reviewer: Approves questions and configures an assessment.
3. Mentor: Assigns or schedules the assessment for the correct cohort.
4. Student: Takes the assessment and submits responses.
5. Platform: Evaluates responses, calculates results, and updates records.
6. Mentor: Reviews performance and provides guidance.
7. Employer: Views eligible candidates and authorized assessment evidence.

| Test ID | Integration scenario              | Test procedure                                                            | Expected result                                                                                         | Priority |
| ------- | --------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------- |
| INT-01  | SME to assessment                 | Create and approve a question, then use it in an assessment               | Approved question is available to authorized assessment creators                                        | P1       |
| INT-02  | Admin to mentor                   | Configure an assessment and make it available to a mentor                 | Correct configuration is visible to the authorized mentor                                               | P1       |
| INT-03  | Mentor to student                 | Assign an assessment to a cohort                                          | Only eligible students receive access according to the assignment rules                                 | P1       |
| INT-04  | Student to evaluator              | Submit an assessment                                                      | Responses are evaluated using the correct answer key and scoring rules                                  | P1       |
| INT-05  | Evaluator to dashboard            | Complete an assessment and refresh relevant dashboards                    | Updated results and counts appear correctly                                                             | P1       |
| INT-06  | Assessment to profile             | Complete an assessment linked to specific skills                          | Student's assessment history or skill evidence updates as designed                                      | P1       |
| INT-07  | Mentor feedback to student        | Save feedback and open the student's permitted view                       | Correct feedback is displayed to the intended student                                                   | P1       |
| INT-08  | Student to employer               | Complete required profile and eligibility information                     | Candidate becomes discoverable only when applicable visibility and eligibility conditions are satisfied | P1       |
| INT-09  | Job to shortlist                  | Publish a job and shortlist a matching candidate                          | Candidate and job relationship is saved correctly                                                       | P1       |
| INT-10  | Role change propagation           | Change a user's role and attempt access using an existing session         | New permissions are enforced according to the session and token revocation policy                       | P1       |
| INT-11  | Concurrent assessment submissions | Have several students submit at approximately the same time               | Every valid attempt is saved once and results remain correctly associated                               | P1       |
| INT-12  | Audit consistency                 | Perform actions across multiple roles                                     | Required audit records contain the correct actor and action details                                     | P2       |
| INT-13  | Assessment cancellation           | Cancel an assessment after scheduling                                     | Access, notifications, and existing records follow the cancellation policy                              | P1       |
| INT-14  | Results correction                | Correct an erroneous result through an authorized process                 | Updated results, history, and dependent reports remain consistent                                       | P1       |
| INT-15  | Employer visibility update        | Withdraw candidate consent or disable profile visibility, where supported | Subsequent employer access respects the updated visibility rules                                        | P1       |

## 9. Security, authorization, and negative test cases

These tests are particularly important because TFLAssessment stores personal profiles, assessment responses, answer keys, performance records, and recruitment information.

| Test ID | Test scenario                                          | Expected result                                                  | Priority |
| ------- | ------------------------------------------------------ | ---------------------------------------------------------------- | -------- |
| SEC-01  | Access dashboard without login                         | Redirect to login or return an appropriate unauthorized response | P1       |
| SEC-02  | Call protected API without a valid token               | Request is rejected                                              | P1       |
| SEC-03  | Use an expired or tampered token                       | Request is rejected                                              | P1       |
| SEC-04  | Modify an object ID in an API URL                      | The user cannot access another user's restricted record          | P1       |
| SEC-05  | Submit unexpected fields to update a profile           | Unauthorized fields are ignored or rejected                      | P1       |
| SEC-06  | Inject SQL-like input into search fields               | Input is handled safely; no query manipulation occurs            | P1       |
| SEC-07  | Submit HTML or script payloads in text fields          | Stored and displayed content is handled safely                   | P1       |
| SEC-08  | Retrieve question answers before assessment completion | Answer keys are not disclosed to unauthorized users              | P1       |
| SEC-09  | Upload an unsupported or oversized file                | File is rejected safely with a useful validation message         | P1       |
| SEC-10  | Attempt repeated login failures                        | Configured rate limits or account protection are enforced        | P1       |
| SEC-11  | Access another employer's candidate records            | Cross-tenant access is denied                                    | P1       |
| SEC-12  | Inspect logs for sensitive data                        | Passwords, tokens, and other prohibited secrets are not logged   | P1       |

Mentor's security rule: Hiding a button in React is not security. Every protected operation must also be authorized by the backend API.

## 10. Performance, reliability, and usability tests

| Test ID | Test scenario                                        | Expected result                                                                               | Priority |
| ------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------- |
| NFR-01  | Load dashboards with representative data             | Dashboard loads within the agreed performance target                                          | P1       |
| NFR-02  | Multiple students start an assessment simultaneously | System supports the specified concurrent user load                                            | P1       |
| NFR-03  | Submit many responses concurrently                   | No lost, duplicated, or incorrectly associated responses                                      | P1       |
| NFR-04  | Run a long assessment session                        | Timer and response persistence remain reliable                                                | P1       |
| NFR-05  | Refresh during assessment                            | Previously saved answers are restored according to the save policy                            | P1       |
| NFR-06  | Database or dependent service becomes unavailable    | Errors are handled safely and recovery follows the system design                              | P1       |
| NFR-07  | Open dashboard on mobile and desktop                 | Supported screen sizes remain usable                                                          | P2       |
| NFR-08  | Use keyboard navigation                              | Supported forms, controls, and dialogs are accessible                                         | P2       |
| NFR-09  | Search a large question bank                         | Search remains responsive at the agreed data volume                                           | P2       |
| NFR-10  | Generate placement or assessment reports             | Reports contain correct totals and complete required records                                  | P1       |
| NFR-11  | Recover after service restart                        | Persisted assessment and profile data remains consistent                                      | P1       |
| NFR-12  | Check timestamps and time zones                      | Assessment availability, deadlines, and result timestamps follow the defined time-zone policy | P1       |

Performance targets must be agreed upon and measured in the actual test environment. For example, a team may set a dashboard response-time target of two seconds at a specified concurrent load, but that is a project-specific acceptance criterion rather than a universal standard.

## 11. Test execution tracker

Use the following interactive checklist to track the test cases during a QA cycle. It is a working checklist, not a live connection to your TFLAssessment application or test database.

Total cases

# 106

Executed

# 0

Passed

# 0

Execution progress

0%

Test categoryAdmin

ADM-01

Not Run

ADM-02

Not Run

ADM-03

Not Run

ADM-04

Not Run

ADM-05

Not Run

ADM-06

Not Run

ADM-07

Not Run

ADM-08

Not Run

ADM-09

Not Run

ADM-10

Not Run

ADM-11

Not Run

ADM-12

Not Run

&#x20; Copy resultsReset checklist

Statuses are held in this interactive checklist. Copy results before resetting or leaving the checklist.

## 12. Recommended testing strategy for TFLAssessment

A practical testing sequence for your development and QA team is:

1. Smoke testing: Verify login, role-specific dashboards, navigation, and core API availability.
2. Role-based functional testing: Execute the Admin, Mentor, SME, Student, and Employer test cases independently.
3. Integration testing: Validate the complete lifecycle from question creation to assessment results and placement.
4. Security testing: Verify authorization at both UI and API levels, including cross-user and cross-employer access.
5. Regression testing: Re-run critical tests whenever a feature, API, database schema, or permission changes.
6. Performance and acceptance testing: Validate concurrent assessment activity and obtain stakeholder approval before release.

### Definition of Done for a test case

A test case should be marked Pass only when:

- The actual behavior matches the expected result.
- The saved data is correct and persists after reload.
- The user cannot perform unauthorized actions.
- Related dashboards and reports remain consistent.
- Relevant error conditions are handled safely.
- Evidence is recorded, such as screenshots, API responses, or automated test output.

Transflower Mentor's closing thought: In TFLAssessment, we are testing more than screens and buttons. We are testing the trust between stakeholders. The SME trusts the question bank, the mentor trusts assessment evidence, the student trusts the evaluation process, the employer trusts the candidate's demonstrated skills, and the administrator trusts the integrity of the platform.

The strongest test suite verifies that this trust is preserved across the entire learning and placement journey.