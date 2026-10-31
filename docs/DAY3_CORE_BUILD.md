# Day 3: Build the Working Core

## 1. End-to-End Core Workflow Implementation
The working core engine is implemented and fully executable across multiple interfaces:

- **Ingestion & Sanitization** (`src/core/normalizer.ts`):
  - Strips PII markers (phone numbers, SSNs, personal IDs).
  - Handles messy OCR, line wrap artifacts, and consolidates multi-document packages into unified context.
- **Factual Extraction Engine** (`src/core/extractor.ts`):
  - Extracts work history, tenure duration in months, tech stacks, and education without making subjective judgments.
- **Criteria Evaluator** (`src/core/evaluator.ts`):
  - Scores candidate evidence against weighted criteria.
  - Implements `verifyQuotesInSource` substring verification to enforce verbatim citation grounding.
- **Risk & Anomaly Engine** (`src/core/riskDetector.ts`):
  - Combines deterministic heuristics (short stints, low experience) with semantic forensic checks (unexplained gaps, buzzword inflation, compensation mismatches).
- **Decision Synthesizer** (`src/core/recommender.ts`):
  - Computes weighted composite fit scores (0–100).
  - Applies risk penalties and evaluates knockout rules.
  - Generates clear next steps and ATS-ready markdown + JSON payload.

## 2. Integrated Data Sources & Tools
1. **Multi-Source Candidate Package Ingest**:
   - Ingests structured JSON resumes, freeform recruiter phone screen notes, screening transcripts, and portfolio repositories simultaneously.
2. **Multi-Provider LLM Infrastructure**:
   - Integrated with `@google/generative-ai` (Gemini 1.5 Flash).
   - Integrated with `openai` (GPT-4o / GPT-4o-mini).
   - High-fidelity **Deterministic Mock Engine** with zero dependencies for 100% offline reproducibility.
3. **ATS Integration Payload Generator**:
   - Outputs ready-to-sync ATS payloads with tags, stage assignment (`Interviewing`, `Recruiter Review`, `Rejected`), and structured evaluation markdown.

## 3. Configuration & Secrets Separation
- Sensitive environment variables are decoupled into `.env` (template provided in `.env.example`).
- System defaults to `DEFAULT_LLM_PROVIDER=mock`, allowing immediate execution without requiring external API keys or cloud credentials.
- Runtime options allow dynamic provider overriding per request.

## 4. Interfaces Built
- **Non-Developer Web Dashboard** (`src/app/page.tsx`):
  - Candidate review queue with risk badge indicators.
  - Executive recommendation banner with color-coded fit bands.
  - Side-by-side evidence audit displaying verbatim quotes and grounding status.
  - Human sign-off panel with 1-click Approval, Override, and ATS payload export.
- **CLI Runner** (`src/cli/index.ts`):
  - Interactive terminal tool: `npm run screen -- --case case_01`
  - Benchmark inspector: `npm run screen -- list-cases`
  - Custom file processor: `npm run screen -- --input <path_to_json> --output <path_to_report>`
