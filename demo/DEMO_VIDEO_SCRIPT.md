# 5-Minute Demo Video Script & Walkthrough Guide

Use this script to accompany the generated video `demo/TalentScreen_AI_Demo_Walkthrough.mp4` or when recording a 5-minute Loom walkthrough screen-recording.

---

### [00:00 - 01:00] 1. The Problem & Baseline
**Visual**: Show `DAY1_DISCOVERY_BASELINE.md` and the Baseline Comparison card in the Web UI.
- *"Hi everyone, today I'm demonstrating **TalentScreen AI**, a working system designed to solve a critical bottleneck for technical recruiters and engineering hiring managers.*
- *When technical job openings go live, companies receive between 250 and 500 applicants per role. In the manual baseline workflow, recruiters spend **32 minutes per submission** reading resumes, searching for keywords, checking salary expectations, and writing ATS summaries. Reviewing just 100 applicants consumes over **53 human hours** and costs **$26.67 per candidate** in recruiter labor.*
- *When recruiters try to solve this with simple ChatGPT copy-pasting, it creates a dangerous **22% hallucination rate**—the LLM invents technologies or projects not in the resume—and misses 40% of hidden knockouts like visa boundaries and severe compensation mismatches.*
- *We built TalentScreen AI to solve this completely: reducing review time to **9 seconds**, eliminating hallucinations with verbatim quote verification, and preserving human judgment for critical decisions."*

---

### [01:00 - 02:00] 2. Live Flow: Real Input to Output
**Visual**: Open terminal and run:
`npx tsx src/cli/index.ts screen --case case_01`
- *"Let's look at the live core pipeline in action. I'm running our CLI runner on candidate Elena Rostova, who applied for a Senior Distributed Systems Backend role.*
- *Here's what happens in under 15 milliseconds:*
  1. *First, the **Ingestion & Normalizer** strips phone numbers and government IDs to preserve PII privacy, and harmonizes messy text formatting.*
  2. *Second, the **Factual Dossier Extractor** extracts 8 years of true work history and verified skills.*
  3. *Third, the **Criteria Evaluator** grades Elena against our role rubric: she scores 94/100, backed by exact verbatim quotes from her resume about architecting Kafka pipelines at 120k requests per second.*
  4. *Fourth, our **Quote Verifier** programmatically confirms that every single quote exists in the source text.*
  5. *Fifth, the **Risk Detector** confirms zero discrepancies or compensation mismatches.*
  6. *Finally, the **Synthesis Engine** recommends `ADVANCE_TECHNICAL_SCREEN` and generates a clean ATS markdown payload."*

---

### [02:00 - 03:15] 3. Non-Developer User Experience (Web Dashboard)
**Visual**: Open browser at `http://localhost:3000` (run `npm run dev`).
- *"Now let's switch to the perspective of a non-technical recruiter using our interactive dashboard.*
- *On the left, the recruiter has an applicant queue loaded with 10 representative candidate profiles. Notice the immediate risk badges: green for clean profiles, amber for high risks, and dark red for critical knockouts.*
- *When we select **Marcus Sterling** (`case_02`), who claims to be a VP and Chief AI Architect who led an $80 billion transformation, look at what happens:*
  - *The system detects **extreme resume inflation**: candidate has only 3 years of experience, and phone notes reveal his only verifiable role was a WordPress internship.*
  - *His score drops to 0/100, recommendation is `REJECT_KNOCKOUT_CRITERIA`, and the system flags **MANDATORY HUMAN APPROVAL REQUIRED**.*
- *Now look at **David Chen** (`case_04`): David is an embedded C++ engineer pivoting to cloud distributed systems. The system gives him a 66/100 borderline score and routes him to `RECRUITER_CLARIFICATION_NEEDED` with a specific interview question to probe his cloud scaling depth.*
- *The recruiter can add their calibration notes, click 'Approve Decision' or 'Override', and copy the full ATS JSON payload with one click."*

---

### [03:15 - 04:15] 4. Evaluation & Failure Handling
**Visual**: Switch to the "10-Case Benchmark Harness" tab in the dashboard or run `npm run eval`.
- *"To prove system reliability, we built an automated 10-case evaluation harness testing extreme scenarios.*
- *During Day 4 hardening, we uncovered and fixed three key failure modes:*
  1. *First, **Citation Hallucination**: Early LLM prompts summarized qualifications instead of quoting text. We fixed this by implementing `verifyQuotesInSource()`. Any hallucinated citation automatically triggers a 25-point penalty and marks the quote unverified.*
  2. *Second, **Threshold Flapping**: High-performing candidates with 86/100 fit were flapping between technical screen and hiring manager review. We recalibrated our decision boundaries so clean candidates above 85 advance directly.*
  3. *Third, **Layout Breakage**: OCR text from scanned resumes broke regex parsers. We introduced semantic boundary tags (`=== RESUME ===`, `=== NOTES ===`) to allow the LLM to parse context natively.*
- *When we run the test harness across all 10 cases, we achieve a **100% ground-truth match rate** and **100% quote verification**."*

---

### [04:15 - 05:00] 5. Measured Results & Limitations
**Visual**: Switch to the "Baseline Comparison" tab in the dashboard.
- *"Let's summarize the final measured impact against our Day 1 baseline:*
  - *Review time dropped from **32 minutes to 0.15 minutes**—a **99.5% reduction** in candidate turnaround.*
  - *Human recruiter labor decreased from **53.3 hours to 3.5 hours per 100 screens**—saving over 93% of recruiter time.*
  - *Cost plummeted from **$26.67 to $0.02** per screen.*
  - *Hallucination rate is **0.0%**, verified by our programmatic quote checker.*
- *Finally, our most important limitation:*
  - *Text-based screening cannot evaluate live coding performance or whiteboard architecture under pressure. For career pivoters and downlevel candidates, human technical pairing remains essential.*
- *The entire project is open-source, runnable offline with zero setup, and ready on GitHub. Thank you!"*
