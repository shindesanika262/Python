# What We Learned About Testing While Building TFLCoMentor

### A Transflower Mentor's Perspective

- Junior developers ask: *"How do I write a test for this method?"*
- Middle developers ask: *"How do I achieve 90% code coverage?"*
- Senior developers ask: **"How do I know this feature actually works for the user?"**

That difference changes the way we design, develop and test software.

While working on **TFLCoMentor**, our AI-enabled mentoring platform at Transflower, one engineering principle became increasingly important: **A green test report does not automatically mean a reliable application.**

Imagine a student using TFLCoMentor to take an assessment, receive feedback, understand skill gaps and generate a learning plan.

**The workflow crosses multiple components**:

**Student Portal → API → Authentication → Assessment → Evaluation → Insights → Growth Plan → Database**

A unit test can prove that an evaluation method returns the expected score.

- But does it prove that the correct student was evaluated?
- Does it prove that the score was saved correctly?
- Does it prove that the API returned the right result?
- Does it prove that the student's mentor can see the result while another student cannot?

Not necessarily.

Mocks can help us test individual components. But mocks cannot prove that the real database schema, SQL queries, dependency injection, authorization rules and API contracts work together.

That is why we need a balanced testing strategy.

📌 **1. Unit Tests — Test the Fundamentals**

Use pytest or the appropriate framework to test pure business logic.

Examples:

- Skill score calculations
- Assessment validation rules
- Eligibility conditions
- Learning-plan business rules

These tests should be fast, focused and easy to understand.

📌 **2. Integration Tests — Test the Real Connections**

Test meaningful workflows across real application components.

For TFLCoMentor, this could mean:

**Student Request → API → Assessment Service → Database → API Response**

Use a real test database where appropriate. Validate SQL queries, mappings, transactions, dependency injection and persistence.

For .NET applications, tools such as WebApplicationFactory, Testcontainers and Respawn can help establish repeatable integration tests.

📌 **3. API Contract Tests — Protect Communication**

TFLCoMentor has multiple modules and service boundaries.

When one module changes its response, another module may break.

Contract tests help verify that APIs preserve their expected request and response structures, including required fields, data types and error responses.

📌 **4. End-to-End Tests — Test the Learner's Journey**

Use Playwright to test workflows that matter to the user:

**Login → Take Assessment → View Evaluation → Review Skill Gaps → Access Learning Plan**

This checks the integrated application from the user's perspective.

📌 **5. Performance Tests — Prepare for Real Usage**

A feature that works for one student may struggle when hundreds of learners access assessments simultaneously.Use tools such as k6 or NBomber to investigate response times, throughput, error rates and system behavior under load.

### What about code coverage?

Coverage is useful. It tells us which parts of the code were executed during testing. But 98% coverage does not prove that the tests are meaningful. A test can execute every line and still fail to verify the most important business rule.

### The Transflower testing principle

- Don't mock everything.
- Don't introduce interfaces merely to satisfy a mocking framework.
- Don't test implementation details when observable behavior matters more.
- Don't abandon unit tests either.

Choose the right level of testing for the risk.

- Unit tests verify logic.
- Integration tests verify connections.
- Contract tests verify expectations between systems.
- End-to-end tests verify user workflows.
- Performance tests reveal behavior under load.

And in the age of AI-assisted development, this discipline matters even more. AI can generate implementation code and test cases quickly. But engineers must still decide what needs to be verified, which assumptions are dangerous and whether the tests provide meaningful evidence.

**AI can generate tests. Engineering judgment determines whether those tests are worth trusting.**

At Transflower, our goal is not simply to make the CI/CD pipeline green. Our goal is to build software that continues to work when real users, real data and real business rules meet.

**Don't just test your methods. Test your system. Test your assumptions. Test the experience you promise your users.**
