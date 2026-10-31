# AI Collaboration Note: TalentScreen AI

### Project: Candidate Review & Dossier Normalizer (TalentScreen AI)
**Author**: Muhammad Ahmed Bajwa  
**Repository**: [github.com/bajwa61/talent-screen-engine](https://github.com/bajwa61/talent-screen-engine)  
**Submission Role**: AI Engineer / Forward Deployed Systems

---

## 1. AI Tools Used & Their Respective Roles

| Tool / Model | Primary Role in Project | Level of Delegation |
| :--- | :--- | :--- |
| **Cursor IDE (Claude 3.7 Sonnet / Composer)** | Scaffolding TypeScript schemas, structuring UI layout components, writing CLI argument parsers | High (Implementation accelerator) |
| **Google Gemini 1.5 Flash (via API adapter)** | Production LLM inference provider for unstructured text extraction and qualitative semantic evaluation | High (Core pipeline worker) |
| **OpenAI GPT-4o-mini (via API adapter)** | Alternative production provider for cross-model validation and provider redundancy | High (Alternative runtime) |
| **Deterministic Offline Mock Engine** | 100% reproducible, offline evaluation testing without API keys or token costs | Autonomous deterministic runtime |
| **Zod v3 + Substring Quote Verifier** | Programmatic validator that audits LLM outputs before they reach the decision layer | Deterministic code guardrail |

---

## 2. Specific Work Delegated to AI

1. **Repetitive Code Scaffolding**:
   - Generation of TypeScript interfaces matching domain entities (`CandidatePackage`, `RoleRubric`, `CandidateDossier`, `CriterionEvaluation`, `RiskAnomaly`, `DecisionAction`).
   - Tailwind CSS component styling and Lucide React icon integration for the non-developer dashboard.
2. **Synthetic Data Synthesis**:
   - Creating 10 representative, highly realistic benchmark candidate packages across diverse archetypes (Elena Rostova, Marcus Sterling, Sarah Jenkins, David Chen, etc.).
3. **Drafting Initial Evaluation Prompts**:
   - Generating standard prompt instructions for factual extraction and rubric scoring.

---

## 3. How AI-Generated Results Were Verified

1. **Automated Substring Verification (`verifyQuotesInSource`)**:
   - Every qualification score awarded by the LLM was verified against the candidate's raw source text.
   - If a cited quote was summarized or fabricated by the LLM, the algorithm detected the missing substring, penalized the score by 25 points, and logged an `EVALUATION_GUARDRAIL_TRIGGER` audit entry.
2. **Multi-Case Regression Harness**:
   - An automated test harness (`src/eval/evalHarness.ts`) executed all 10 benchmark test cases against predefined ground-truth expectations.
   - Any hallucination, score drift, or misclassification immediately flagged as a test failure.
3. **Manual Human Audits**:
   - Every candidate profile was independently inspected to ensure extracted tenures, technologies, and salary requests matched reality.

---

## 4. Important Results Rejected or Manually Corrected

1. **Rejected Generic LLM Summaries as Citations**:
   - Early LLM prompts returned conversational summaries like `"Candidate has 8 years in distributed systems"`.
   - **Correction**: Rejected this behavior. Modified the system prompt and runtime validator to demand verbatim text quotes directly from the applicant's resume.
2. **Corrected Overly Aggressive Disqualification for High-Slope Juniors**:
   - The LLM initially marked candidate `case_07` (Maya Lin, 2 years exp, 800+ star open source rate limiter) as a flat `REJECT_NOT_QUALIFIED`.
   - **Correction**: Introduced the `RECRUITER_CLARIFICATION_NEEDED` stage and `humanApprovalRequired` trigger so hiring managers can consider down-leveling high-potential junior engineers rather than losing them.
3. **Overturned Automatic Pass for Overqualified Executive**:
   - For `case_09` (Dr. Robert Sterling, 16 yrs exp, ex-VP of Infrastructure seeking an IC coding role), the model gave a 99% score and attempted to auto-advance.
   - **Correction**: Enforced a human approval gate (`ADVANCE_HIRING_MANAGER_LOOP` with `humanApprovalRequired=true`) to verify motivation and avoid turnover risk.

---

## 5. Core Decisions Personally Owned

1. **System Architecture & Boundaries**:
   - Decided to isolate the extraction phase from the evaluation phase and from the risk detection phase. This prevents prompt-bloat and avoids cognitive bias in the LLM.
2. **Human-in-the-Loop Philosophy**:
   - Established that AI should never make terminal employment decisions autonomously. All borderline cases, knockouts, and executive transitions require explicit human approval.
3. **Deterministic Heuristics Combined with Semantic LLM**:
   - Refused to rely solely on an LLM for tenure calculations. Built a deterministic date checker for tenure gaps and minimum year checks, pairing it with semantic LLM anomaly detection.
4. **Offline First & Zero-Dependency Execution**:
   - Engineered the deterministic mock engine so any evaluator or engineer can test the entire pipeline end-to-end without an API key or internet access.
