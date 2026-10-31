# Day 1: Discover, Map, and Baseline

## 1. Target User and Job-to-be-Done
- **Primary User**: Technical Recruiters, Talent Operations Leads, and Hiring Managers in scaling technology organizations.
- **Job-to-be-Done**: When high volumes of candidate submissions (resumes, intake notes, screening transcripts) arrive for competitive technical roles, the recruiter needs to quickly, objectively, and accurately evaluate whether each applicant meets role criteria, identify red flags or knockouts, ground every claim in verifiable evidence, and route the candidate to the correct ATS next step—without wasting engineering interviewer hours on unqualified or mismatched candidates.

## 2. Current Workflow Map & Bottleneck
```
[Messy Inbound Submissions]
       │
       ▼
[Manual Resume Reading & Skimming]  <-- 32 min average per submission
       │
       ▼
[Subjective Keyword Search in ATS]   <-- High fatigue, bias, keyword stuffing manipulation
       │
       ▼
[Unstructured Phone Screen Notes]   <-- Compensation mismatches & visa boundaries buried in notes
       │
       ▼
[Hiring Manager Review Ping]        <-- 48-hr turnaround lag; 40% rejected immediately by HM
       │
       ▼
[Manual Disposition or Interview Invite]
```

### Evidence of Pain
- **Time Sink**: Inbound technical roles receive 250–500 applications per opening. At 32 minutes per manual review (reviewing resume, cross-referencing intake notes, checking salary expectations, logging ATS notes), reviewing 100 candidates requires over **53 recruiter hours**.
- **Resume Inflation / Buzzword Fraud**: Candidates stuff keywords ("Kafka", "Distributed Systems", "Go") into resumes without genuine architectural experience. Naive keyword search or ChatGPT prompting accepts fabricated claims.
- **High Hallucination Rate in Generic LLMs**: Generic ChatGPT copy-pasting yields a **22% hallucination rate**, inventing qualifications or misattributing skills across multiple candidate tabs.
- **Buried Discrepancies**: Critical knockouts (e.g. international relocation restrictions, $380k salary expectation vs. $215k budget, 13-month unexplained gaps) are overlooked until after engineering interviews are booked.

## 3. Baseline Metrics (Manual vs. Naive AI)
| Metric | 1. Manual Recruiter | 2. Naive ChatGPT Copy-Paste |
| :--- | :--- | :--- |
| **Average Time per Review** | 32.0 minutes | 12.0 minutes |
| **Accuracy vs Ground Truth** | 68.0% | 74.0% |
| **Hallucination / Fabrication Rate** | 4.0% (human error) | 22.0% (LLM ungrounded) |
| **Risk / Knockout Catch Rate** | 45.0% | 60.0% |
| **Cost per Candidate Review** | $26.67 USD ($50/hr labor) | $10.05 USD (labor + sub) |
| **Human Labor Hours per 100 Candidates** | 53.3 hours | 20.0 hours |
| **ATS Queue Turnaround Time** | 48.0 hours | 24.0 hours |
| **Audit Trail Quality** | Low (unstructured scratchpads) | Low (ephemeral chat tabs) |

## 4. Success Metrics & Explicit Non-Goals
### Success Criteria
1. **Turnaround & Speed**: Reduce candidate review latency from 32 minutes to under **15 seconds** machine execution (< 2 minutes with human review).
2. **Anti-Hallucination Grounding**: **100%** of criteria scores backed by verbatim quotes verified against source text.
3. **Risk Detection Accuracy**: Catch ≥ 95% of knockouts, inflation, and compensation mismatches.
4. **Labor Reduction**: Reduce human labor from 53.3 hours per 100 applicants to under 4 hours (≥ 90% reduction).
5. **Zero-Friction Non-Developer UX**: Visual interactive dashboard with side-by-side evidence quotes and 1-click ATS export.

### Explicit Non-Goals
- **Autonomous Auto-Rejections**: The system will NEVER autonomously reject or advance a human without auditability. High-risk and borderline candidates always trigger mandatory human approval gates.
- **Video Facial / Voice Sentiment Analysis**: No pseudo-scientific emotion tracking.
- **Scraping Personal Social Media**: We restrict analysis strictly to candidate-submitted materials and recruiter intake notes.

## 5. 10 Benchmark Test Cases Coverage
1. `case_01`: **Strong Match** (Elena Rostova - 8 yrs exp, Kafka 120k req/s, Raft Go consensus, fits salary).
2. `case_02`: **Resume Inflation & Fraud** (Marcus Sterling - 3 yrs exp claiming VP of $80B transformation; WordPress intern).
3. `case_03`: **Missing Hard Requirement** (Sarah Jenkins - Senior Front-End UI applied for Distributed Backend role by mistake).
4. `case_04`: **Borderline Career Pivot** (David Chen - Embedded C++ engineer pivoting to cloud distributed systems with self-taught Go).
5. `case_05`: **Unexplained Gaps & Tenure Instability** (Alexander Vance - 13-mo gap, 8-mo gap, multiple 7-mo stints).
6. `case_06`: **Compensation & Intent Mismatch** (Julian K. Thorne - Outstanding technical staff asking $380k + Swiss remote vs $215k US budget).
7. `case_07`: **Junior High Potential** (Maya Lin - 2 yrs exp with 800-star open-source rate limiter, below Senior bar; downlevel opportunity).
8. `case_08`: **Messy Unstructured Source Text** (Bao Nguyen - OCR text scrambled with broken layout, qualified Senior Backend Engineer).
9. `case_09`: **Overqualified Executive Returning to IC** (Dr. Robert Sterling - Ex-VP of Infrastructure with MIT PhD wanting hands-on coding IC role).
10. `case_10`: **Work Authorization & Relocation Boundary** (Ananya Sharma - Exceptional engineer in India requiring unbudgeted US visa sponsorship).
