# Day 2: Design the System and Ship v0

## 1. System Architecture & End-to-End Data Flow

```
┌────────────────────────────────────────────────────────┐
│                   Multi-Modal Ingestion                │
│  Raw Resumes (.txt/.pdf) + Recruiter Intake Notes      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│           1. Normalization & PII Sanitization           │
│   - Phone / SSN Redaction                              │
│   - Text cleanup & whitespace harmonization            │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             2. Structured Factual Extraction            │
│   - Work history items, tenure calculation             │
│   - Verified technologies and education                │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│      3. Criteria Evidence Evaluator & Anti-Hallucination│
│   - Evaluates criteria against strict rubric           │
│   - Strict substring quote verification filter         │
│   - Scores adjusted if citations cannot be proven      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│         4. Forensic Risk & Discrepancy Detector         │
│   - Heuristic rules (tenure <10 mos, exp < role min)   │
│   - LLM anomaly probe (inflation, comp mismatch)       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             5. Synthesis & Human Gate Engine           │
│   - Weighted score calculation (Must-Have 3x, etc.)    │
│   - Human approval trigger check                       │
│   - ATS Stage & Next Actions generated                 │
└──────────────────────────┬─────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      Web Dashboard UI              CLI Command Runner
  (Interactive Non-Dev Review)  (Automated ATS Batch Ingest)
```

## 2. Input/Output Schemas and Data Contracts
The core system is enforced by strict TypeScript & Zod schemas in `src/types/index.ts`:

- `CandidatePackage`: Inbound bundle containing candidate identity, contact info, target role, and array of source documents (`resume`, `intake_notes`, `portfolio_link`).
- `RoleRubric`: Department role definition with weighted criteria (`must_have`, `strong_plus`, `nice_to_have`), minimum years required, and explicit knockout rules.
- `CandidateDossier`: Extracted factual record with normalized work history, verified skills, and recruiter intake highlights.
- `CriterionEvaluation`: Individual evaluation item with grade (`EXCEEDS`, `MEETS`, `PARTIAL`, `NOT_MET`), numerical score (0-100), verbatim quotes, and `isHallucinationChecked` boolean.
- `RiskAnomaly`: Flagged issue with category (`UNEXPLAINED_GAP`, `TENURE_INSTABILITY`, `RESUME_INFLATION`, `MISSING_HARD_REQUIREMENT`, `COMPENSATION_OR_INTENT_MISMATCH`), severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and suggested interview follow-up question.
- `ScreeningReport`: Complete immutable audit payload containing fit score, recommendation, human sign-off triggers, and ATS sync payload.

## 3. Model, Tool, Storage, and Interface Choices with Rationale

| Component | Selected Choice | Architectural Rationale |
| :--- | :--- | :--- |
| **Language & Framework** | TypeScript / Node.js + Next.js 14 | End-to-end type safety between data contracts, API routes, and React UI components. Zero serialization bugs. |
| **Validation Layer** | Zod v3 | Runtime schema validation ensures malformed LLM outputs or invalid API requests fail immediately and gracefully. |
| **LLM Router & Adapters** | Multi-Provider (Gemini + OpenAI + Mock) | Enables zero-setup 100% offline local testing via deterministic mock engine, with instant switch to Google Gemini or OpenAI when API keys are provided. |
| **Anti-Hallucination** | Substring Quote Grounding Filter | Programmatically checks if every cited quote actually exists in the source text. Completely eliminates LLM confabulation. |
| **User Interfaces** | Next.js React Dashboard + CLI Runner | Caters to both non-developer recruiters (visual UI with side-by-side evidence) and engineering ops (headless CLI batch processing). |

## 4. Human Approval Points and Privacy Guardrails
1. **PII Redaction at Ingestion**: Phone numbers and government IDs are masked (`[REDACTED_PHONE]`, `[REDACTED_GOV_ID]`) before prompts are built, ensuring candidate privacy.
2. **Mandatory Human-in-the-Loop Triggers**:
   - Any candidate with a **CRITICAL** or **HIGH** risk severity.
   - Any composite fit score under **70/100**.
   - Any failure of an essential **must-have** criterion.
   - Overqualified executive pivots or ambiguous compensation constraints.
3. **Audit Trail**: Every pipeline run generates an immutable chronological log of actions, latency, token costs, and human override actions.
