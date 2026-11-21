# TFLAssessment — Consolidated Requirement Document

## 1. Overview

TFLAssessment is a mentor-controlled, AI-assisted assessment and talent-readiness platform designed to transform evaluation from a traditional exam model into a continuous, evidence-based learning and development system.

The platform is intended to support learners, mentors, academic administrators, employers, and institutional stakeholders across the Transflower Learning Framework (TFL). It measures real capability, provides actionable feedback, identifies skill gaps, supports project and role-based evaluation, and aligns student development with placement and industry readiness.

The platform is not just a testing system. It is a skill intelligence and mentorship ecosystem.

> AI suggests. Mentors decide.

---

## 2. Purpose and Vision

The purpose of TFLAssessment is to enable evidence-based mentorship by continuously measuring, guiding, and developing learner capability across the TFL curriculum.

The system exists to:

- Evaluate real learning outcomes rather than memorization
- Measure practical skills, reasoning, and application
- Support mentoring with data-backed insight
- Improve placement readiness and employer confidence
- Provide continuous feedback and remediation guidance
- Align assessment to industry and academic standards
- Preserve fairness, integrity, and trust in AI-assisted evaluation

### Strategic Vision

TFLAssessment aspires to become:

- A capability-based assessment platform
- A mentor-driven learning intelligence system
- A placement-readiness engine
- An evidence-based talent validation ecosystem
- A future-ready assessment platform for digital education and hiring

---

## 3. Core Philosophy

The project is built on the principle that assessment is not judgment; it is guidance with evidence.

### What TFLAssessment is

- Mentor-controlled
- Skill-mapped
- Outcome-driven
- AI-assisted
- Human-in-the-loop
- Evidence-based

### What TFLAssessment is not

- Not a generic exam engine
- Not a fully autonomous AI judge
- Not a replacement for mentors
- Not a blind ranking platform
- Not an AI-only grading system without governance

---

## 4. Business Context

Traditional assessment systems often focus on marks and one-time testing. This creates several business issues:

- Students are evaluated mainly on memory, not capability
- Mentors lack timely and structured insight into student progress
- Institutions struggle to measure placement readiness
- Project and skill validation are often inconsistent
- Feedback is delayed, generic, and not action-oriented
- There is no unified system connecting learning, assessment, mentoring, and employer visibility

TFLAssessment addresses this by combining assessment, project review, analytics, and mentoring into a single platform.

---

## 5. Business Objectives

The business objectives of TFLAssessment are:

1. Improve capability-based learning outcomes
2. Deliver timely and actionable feedback
3. Create personalized learning journeys
4. Support real-world project validation
5. Provide institutional analytics and evidence
6. Strengthen placement readiness and job alignment
7. Reduce manual grading and mentoring overhead
8. Maintain academic and professional integrity
9. Scale across batches, cohorts, and learning programs
10. Align assessment quality with industry expectations

---

## 6. Scope

### 6.1 In Scope

- User and role management
- Skill taxonomy and learning outcome mapping
- Assessment authoring and lifecycle management
- Multiple assessment modes: MCQ, coding, scenario, design, project, interview
- AI-assisted question generation and evaluation
- Project submission, milestone tracking, and review
- Feedback and remediation planning
- Dashboards and analytics for students, mentors, and institutions
- Placement readiness and employer-facing visibility
- Security, audit trail, and governance controls
- Integration with LMS, HRMS, and ecosystem tools

### 6.2 Out of Scope

- Fully autonomous hiring decisions
- Unsupervised AI grading without mentor review
- Ranking students without context and evidence
- Replacing mentors and SMEs
- Public exam management unrelated to training and placement goals

---

## 7. Stakeholders and Roles

### Students
- Need skill evaluation and meaningful feedback
- Require clarity on strengths, gaps, and next steps
- Need a growth-oriented learning model

### Mentors
- Need insight into learner performance and progression
- Need control over assessment quality and review workflows
- Need easier visibility into gap areas and remediation needs

### Academic / Institution Leaders
- Need quality assurance and evidence of learning outcomes
- Need accreditation and placement-readiness reporting
- Need measurable and scalable educational impact

### Employers / Recruiters
- Need real evidence of skill readiness and project performance
- Want better visibility into candidate quality before interviews

### Admins
- Need governance, user management, access control, and platform monitoring

### SMEs / Subject Matter Experts
- Need to author and validate quality assessment content
- Need structured skill alignment and quality control

---

## 8. Business Requirements Summary

### BR-01: Student Assessment Management
The system shall support the assessment of students based on skills, course layers, and learning outcomes.

### BR-02: Mentor-Controlled Assessment Configuration
Mentors shall define assessment types, difficulty, objectives, and criteria.

### BR-03: AI-Assisted Question Generation
The system shall generate assessment content using AI while preserving instructional intent and quality rules.

### BR-04: Multi-Mode Evaluation
The system shall support MCQ, coding, scenario, design, and project evaluation.

### BR-05: Project-Based Validation
The system shall support submission, milestone tracking, and evidence-based review of projects.

### BR-06: Feedback and Learning Guidance
The system shall provide detailed, actionable feedback to learners and mentors.

### BR-07: Skill Gap Analysis
The system shall identify weak learning areas and recommend remediation.

### BR-08: Placement Readiness Tracking
The system shall measure technical and role-readiness indicators for jobs and internships.

### BR-09: Analytics and Reporting
The platform shall provide dashboards and reports for students, mentors, and institutions.

### BR-10: Security, Privacy, and Compliance
The system shall protect user data and maintain ethical AI usage.

### BR-11: System Integration
The platform shall integrate with institutional and enterprise ecosystem tools.

### BR-12: Continuous Improvement and Governance
The system shall evolve with feedback, quality control, and governance policies.

---

## 9. Functional Requirements

## 9.1 User and Role Management

- Secure login and role-based authorization
- Mentor, student, admin, employer, and SME management
- Role assignment and access restrictions
- Profile maintenance and account activation/deactivation
- User search, filtering, and status management

## 9.2 Assessment Management

- Create and schedule assessments
- Assign assessments to cohorts, groups, or individuals
- Define question types and time limits
- Support randomization and question bank usage
- Maintain assessment lifecycle and result visibility

## 9.3 Skill Taxonomy and Question Bank

- Map assessment items to skills, outcomes, and TFL layers
- Maintain a structured question repository
- Tag questions by subject, skill, difficulty, role, and domain
- Support question review and approval by SMEs or mentors

## 9.4 AI-Powered Assessment Engine

- Generate assessment questions using AI
- Create multiple variations of similar questions
- Support adaptive difficulty based on performance
- Evaluate coding, scenario, and subjective answers
- Detect similarity and possible plagiarism in code or answers
- Provide AI-based proctoring support in future phases

## 9.5 Project Evaluation

- Student project upload and documentation
- Milestone review for design, coding, testing, and deployment
- Architecture review and code quality evaluation
- Git/repository integration and contribution tracking
- Viva or defense-based evaluation workflow

## 9.6 Learning Guidance and Feedback

- Personalized learning recommendations
- Skill-gap analysis and recommended labs/projects
- AI mentor assistant for doubts and guidance
- Auto-remedial plan generation
- Performance prediction and placement readiness estimation

## 9.7 Placement Readiness and Interview Simulation

- Resume validation and role matching
- Mock interview simulation using STAR-based evaluation
- Company-specific assessment packs
- Soft-skill evaluation and job-readiness scoring

## 9.8 Advanced Analytics and Reporting

- Student skill radar charts
- Cohort performance heatmaps
- Placement probability dashboards
- Mentor effectiveness metrics
- Institutional performance dashboards for quality and compliance

## 9.9 Security, Compliance, and Trust Layer

- Audit trails and controlled access
- AI fairness monitoring and bias awareness
- GDPR / DPDP / compliance-aligned handling of personal data
- Certification trust, backup, and recovery

---

## 10. Non-Functional Requirements

### 10.1 Performance
- Page load time under 3 seconds
- Assessment start time under 5 seconds
- AI evaluation response under 10 seconds
- Report generation under 15 seconds
- Support for 10,000+ concurrent users during peak load

### 10.2 Scalability
- Auto-scaling and load balancing
- Cloud-native architecture support
- Multi-node horizontal scale
- AI inference layer separation
- Database and workload scaling

### 10.3 Security
- TLS 1.3 in transit
- AES-256 at rest
- MFA and RBAC support
- Secure browser, screen-monitoring, and anti-cheating controls
- Firewall, WAF, DDoS mitigation
- SQL injection, XSS, CSRF prevention

### 10.4 Reliability and Availability
- 99.9% uptime target
- Redundant architecture and failover support
- Disaster recovery with RPO under 15 minutes and RTO under 1 hour
- Backup and graceful degradation support

### 10.5 Usability and Accessibility
- Mobile-responsive UI
- WCAG 2.1 accessibility support
- Keyboard navigation and screen-reader support
- Multilingual capability

### 10.6 Maintainability
- Modular architecture
- CI/CD and automated testing
- Static code analysis and documentation
- Upgrade-friendly platform design

### 10.7 Interoperability
- REST / GraphQL / OpenAPI-based integrations
- LMS, HRMS, and third-party tool support
- JSON, XML, CSV data interchange

---

## 11. Product Engineering Perspective

Product engineering is the process of transforming a real-world problem into a reliable, usable, scalable, and continuously improving digital product. In the TFLAssessment context, this means going beyond code delivery and ensuring that the solution truly solves a learning and talent-readiness problem for students, mentors, institutions, and employers.

The core question is not simply, “Can we build this feature?” but rather, “Does this feature solve the right problem, create value, and improve outcomes?”

### 11.1 Product Engineering Lifecycle

1. Problem discovery
   - Understand learner pain points, mentor needs, institution goals, and employer expectations.
2. Product requirements
   - Define personas, user journeys, functional needs, and acceptance criteria.
3. Product design
   - Model workflows, business rules, user experience, architecture, and data flow.
4. Engineering and development
   - Build dashboards, APIs, domain logic, assessments, integrations, and reporting.
5. Testing and validation
   - Verify correctness, security, performance, usability, and learning impact.
6. Deployment and operations
   - Release in production, monitor usage, and ensure reliability and support.
7. Feedback and evolution
   - Measure outcomes, learn from real usage, and improve the platform continuously.

This lifecycle is iterative. Feedback may send the team back to discovery, design, or development to refine the product.

### 11.2 Product Engineering vs. Software Development

| Software development | Product engineering |
| --- | --- |
| Focuses on building software functionality | Focuses on delivering a successful product |
| Starts with assigned tasks or feature requirements | Investigates the underlying problem and user value |
| Asks, “Does the feature work?” | Asks, “Does the feature solve the problem?” |
| Measured by code quality and delivery | Measured by adoption, user outcomes, and business value |
| May end at deployment | Continues through feedback and improvement |

### 11.3 TFLAssessment Example

A simple student assessment feature is not valuable in isolation. Product engineering asks whether the assessment:

- measures the intended skill,
- provides mentors with actionable evidence,
- helps students improve,
- supports placement readiness,
- and produces measurable institutional value.

For example, the feature “identify a student’s Python skill gaps” must be designed around:

- User: student or mentor
- Problem: the learner sees a raw score but does not understand the actual gaps
- Input: assessment answers, skill metadata, expected outcomes, and historical performance
- Business logic: score, map results to skills, identify weak areas, and suggest learning interventions
- Output: a skill-gap report with evidence and recommended next actions
- Validation: does the report help the learner improve and guide mentor intervention?

### 11.4 Product Engineering in the AI Era

AI can accelerate coding, test generation, documentation, prototyping, and analysis. However, AI does not replace the need to understand the user problem or validate the result. A sound engineering sequence is:

1. Understand the problem
2. Understand the domain
3. Design the solution
4. Define data and business rules
5. Build and test the core workflow
6. Introduce AI where it delivers measurable value
7. Monitor outcomes and improve continuously

This principle is central to TFLAssessment: AI should enhance assessment and mentoring, not bypass the foundation of sound product design and human review.

> AI can accelerate engineering work. Product thinking ensures that we are engineering the right thing.

---

## 12. Architecture Overview

The platform follows a layered architecture with modular responsibilities:

- Presentation Layer: dashboards, assessment UI, learner portals
- API Layer: access, workflows, and integration endpoints
- Application Services: assessment logic, evaluation, reporting, and workflows
- Domain / Business Logic Layer: scoring rules, validation, skill-gap analysis, and role-based rules
- Data Access Layer: repositories, queries, validation logic, and persistence
- Data Layer: user records, assessments, skills, submissions, feedback, and reports
- AI Intelligence Layer: question generation, answer evaluation suggestions, recommendation logic, and feedback support
- Integration Layer: LMS, HRMS, employer systems, analytics, and external services

This layered design allows the platform to evolve without tightly coupling user experience, business logic, and infrastructure concerns.

### Core Domain Model

The system is built around core entities such as:

- User
- Role
- Skill
- Assessment
- Question
- Submission
- Project
- Feedback
- Report
- Employer Review
- Cohort / Batch
- Learning Outcome

### Architecture as Product Engineering

A product engineer considers more than just screens and classes. They evaluate whether the architecture supports:

- Maintainability: Can the team safely evolve the system?
- Security: Can each role access only what it is authorized to access?
- Reliability: Does assessment submission and scoring work correctly?
- Scalability: Can the platform support more students, cohorts, and assessments?
- Observability: Can the team diagnose failures and measure outcomes?
- Usability: Can stakeholders complete their work without confusion?

This is why architecture is not an isolated technical concern; it is part of the product’s success criteria.

---

## 13. AI-First vs Foundation-First

A key principle in this project is that AI should not be added before the foundation is reliable.

### AI-First Approach
An AI-first project might connect an LLM immediately and generate features such as question generation or recommendation engines. However, without reliable data, skill taxonomy, workflows, and review systems, the output may be impressive but not dependable.

### Foundation-First Approach
The project should first establish:

- quality data
- clear business rules
- structured assessment workflows
- approved skill taxonomy
- feedback loops
- mentor review and validation

Only after these are in place should AI add real value.

This is a central design principle:

> AI does not replace the assessment process. It enhances the process when the required foundations are in place.

---

## 14. Assessment Types and Methods

TFLAssessment supports multiple assessment classes:

- Diagnostic assessment
- Formative assessment
- Summative assessment
- Skill-gap evaluation
- Role-readiness assessment
- Project-based evaluation
- Interview and viva simulation

### Evaluation Methods

| Type | Evaluation Method |
| --- | --- |
| MCQ | Auto-evaluation |
| Coding | Logic + output + code quality |
| Scenario | Rubric-based assessment |
| Design | Mentor and AI-assisted review |
| Project | Evidence-based rubric review |
| Interview | STAR and viva analysis |

---

## 15. Employer Monitoring System (EMS)

The Employer Monitoring System provides employers with visibility into candidates before the interview stage.

### Purpose

To shift hiring from resume-based judgment to evidence-based confidence.

### Key Features

- Candidate scorecards
- Skill-level drill-down
- Project and assessment visibility
- Continuous progress monitoring
- Role matching and readiness indicators
- Learning journey insight and mentor feedback evidence

### Strategic Value

- Reduced hiring risk
- Better early candidate selection
- Trust-driven hiring decisions
- Faster talent identification
- Improved alignment with job requirements

---

## 16. Test Engine and Assessment Platform

The TFLAssessment platform also functions as an intelligent employee and learner assessment engine.

### Core Modules

- User authentication and authorization
- Assessment creation and management
- Centralized question bank
- Online test interface
- Scoring, feedback, and insights
- Reporting and analytics
- Employee performance matrix
- AI-driven skill enhancement (future phase)
- Integration and compatibility
- Security, privacy, and integrity
- Feedback and continuous improvement

### Supported Functionality

- Multiple choice, true/false, short answer, essay, and coding assessments
- Time-bound test delivery and access windows
- Role-specific and cohort-based assessment assignment
- Reporting dashboards and performance matrices
- Self-evaluation and mentor-guided improvement cycles

---

## 17. Agile Product Backlog (High-Level)

Following Agile delivery principles, the backlog is organized around epics and user stories.

### Epic 1: User and Role Management
- Secure login and logout
- Account creation and role assignment
- Profile management
- User status tracking

### Epic 2: Role-Based Dashboards
- Admin metrics dashboard
- Mentor dashboard
- Student progress dashboard
- Employer pipeline dashboard

### Epic 3: Question Bank Management
- Create and review questions
- Search, filter, and tag assessments
- Manage standards and quality review

### Epic 4: Assessment Lifecycle
- Schedule tests
- Conduct assessments
- Capture results
- Publish scorecards and feedback

### Epic 5: Monitoring and Evaluation
- Reflection, scoring, project assessment, and audit processes
- Skill-gap and placement-readiness evaluation

### Epic 6: Profiles and Placement
- Candidate readiness profiles
- Job-role mapping
- Employer aligned summaries

Cross-cutting concerns include:

- Security
- Auditability
- Reliability
- Reporting
- Accessibility

---

## 18. Test Cases and Quality Assurance

The testing approach includes validation across user flows, security, performance, accessibility, and integration.

### Sample Test Areas

1. User authentication and authorization
2. Assessment creation and management
3. Taking assessments and time control
4. Multiple question types and scoring
5. Feedback and reporting
6. Security and cheating prevention
7. Performance and scalability
8. Cross-browser and accessibility validation
9. Localization and integration testing
10. Backup and recovery testing

### Quality Goals

- Correctness
- Reliability
- Security
- Usability
- Performance
- Transparent evaluation

---

## 19. Key Assumptions and Constraints

### Assumptions
- Stable internet access is available
- Mentors are available for review and guidance
- Institutions provide learner and cohort data
- Cloud infrastructure and support are available
- Learners use supported devices and browsers

### Constraints
- Budget and timeline constraints
- Policy and compliance requirements
- Infrastructure readiness
- Need for human oversight on AI outputs
- Need for iterative delivery and phased evolution

---

## 20. Business Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| AI-generated content is inaccurate | Trust issues in evaluation | Human approval and validation |
| Over-reliance on automation | Loss of mentor control | Human-in-the-loop governance |
| Data privacy breaches | Compliance and trust risk | RBAC, encryption, audit trails |
| Inconsistent grading | Student dissatisfaction | Standardized rubrics and review |
| Low adoption | Weak ROI | Focus on usability and mentor value |

---

## 21. Success Metrics

The product will be considered successful when:

- Students receive actionable, skill-based feedback
- Mentors can monitor learner growth and intervene effectively
- Institutions can track readiness and quality trends
- Assessments align with learning outcomes and industry needs
- Placement readiness improves through evidence-backed guidance
- The system remains secure, scalable, and sustainable

---

## 22. Final Summary

TFLAssessment is a strategic platform for Transflower that moves assessment beyond marks and exam-centric evaluation into a learning, mentoring, and readiness ecosystem. It connects skill development, project evidence, AI-assisted feedback, and employer-facing validation into one coherent system.

The requirement foundation establishes a clear business and product direction: build the platform around real learning outcomes, mentor governance, structured data, and trustworthy AI support. This is how TFLAssessment becomes a modern, credible, and future-ready talent intelligence platform.

---

## 23. Approval / Review

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Product Owner |  |  |  |
| Academic Lead |  |  |  |
| Mentor Representative |  |  |  |
| Technical Lead |  |  |  |
| Employer / Stakeholder |  |  |  |
