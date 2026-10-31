import { CandidatePackage, RoleRubric } from "../types";

export const BENCHMARK_RUBRIC: RoleRubric = {
  roleId: "role_sr_dist_eng",
  roleTitle: "Senior Distributed Systems Backend Engineer",
  department: "Platform Infrastructure",
  level: "Senior (L5/L6)",
  criteria: [
    {
      id: "crit_dist_systems",
      name: "High-Throughput Distributed Systems",
      weight: "must_have",
      description: "Minimum 4+ years architecting event-driven or distributed systems handling >20k req/s, distributed consensus, or high-volume messaging (Kafka/RabbitMQ/gRPC).",
      minYearsExperience: 4,
      benchmarkKeywords: ["distributed systems", "kafka", "consensus", "throughput", "concurrency", "grpc"],
    },
    {
      id: "crit_backend_lang",
      name: "Production Go or TypeScript Mastery",
      weight: "must_have",
      description: "Demonstrated production-level craftsmanship with Go or TypeScript backend microservices, performance tuning, and concurrency safety.",
      minYearsExperience: 3,
      benchmarkKeywords: ["go", "golang", "typescript", "microservices", "concurrency", "goroutines"],
    },
    {
      id: "crit_cloud_infra",
      name: "Cloud Infrastructure & Kubernetes",
      weight: "strong_plus",
      description: "Hands-on experience deploying and troubleshooting Kubernetes clusters, Docker containers, and cloud cost/latency optimizations on AWS or GCP.",
      minYearsExperience: 2,
      benchmarkKeywords: ["kubernetes", "docker", "aws", "infrastructure", "helm", "terraform"],
    },
  ],
  knockoutRules: [
    "Must have legal authorization to work in target location without immediate unbudgeted visa sponsorship.",
    "Must have minimum 5 years of verifiable professional software engineering experience.",
    "Must have direct experience with server-side / distributed infrastructure (pure front-end only is knockout).",
  ],
  idealCandidateSummary: "A seasoned engineer who has designed and operated high-volume production services, writes clean idiomatic Go or TypeScript, diagnoses p99 latency regressions, and communicates architectural trade-offs with humility and rigor.",
};

export interface BenchmarkTestCase {
  id: string;
  name: string;
  archetype: string;
  description: string;
  candidatePackage: CandidatePackage;
  expectedRecommendation: string;
  expectedRiskSeverity: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  expectedHumanApproval: boolean;
  benchmarkGroundTruthNotes: string;
}

export const BENCHMARK_TEST_CASES: BenchmarkTestCase[] = [
  // Test Case 1: Strong Match
  {
    id: "case_01",
    name: "Elena Rostova",
    archetype: "Strong Match (Tier 1 Top 5%)",
    description: "Senior Staff Engineer with 8 years building Kafka distributed systems at 120k req/sec, Raft consensus in Go, and verified cloud cost savings.",
    candidatePackage: {
      candidateId: "cand_01_strong_match",
      candidateName: "Elena Rostova",
      contactEmail: "elena.rostova@engineer.dev",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-15T09:00:00Z",
      documents: [
        {
          id: "doc_01_resume",
          type: "resume",
          filename: "Elena_Rostova_Staff_Backend.pdf",
          rawContent: `ELENA ROSTOVA
Contact: +1 (555) 019-2834 | elena.rostova@engineer.dev | Seattle, WA
Summary: Senior Staff Software Engineer with 8 years of experience building mission-critical distributed systems and event-driven data backends.

EXPERIENCE:
Apex Cloud Technologies — Senior Backend Engineer (2021-03 - Present)
- Architected Kafka event-streaming pipeline handling 120,000 requests/sec with p99 latency under 22ms.
- Designed distributed consensus mechanism using Raft and Go for dynamic cluster reconfiguration across 50 nodes.
- Reduced AWS infrastructure costs by 34% through memory pooling and zero-copy byte buffers.
- Mentored 6 mid-level engineers and led distributed systems architecture guild.

Vanguard Payment Systems — Backend Software Engineer (2018-06 - 2021-02)
- Implemented idempotent transaction ledger processing $450M daily volume in Node.js and TypeScript.
- Authored gRPC service interfaces with protobuf schemas across 14 decoupled microservices.
- Automated Kubernetes deployment rollouts using ArgoCD with zero customer downtime.

EDUCATION:
University of Washington — B.S. Computer Science (2014 - 2018), Summa Cum Laude
PROJECTS:
Raft Mini Consensus (github.com/erostova/raft-mini-consensus) — 1,200 GitHub stars`,
          uploadedAt: "2026-10-15T09:00:00Z",
        },
        {
          id: "doc_01_notes",
          type: "intake_notes",
          rawContent: `Recruiter Screen Notes - Elena Rostova:
- Phone: +1 555-019-2834
- Location: Seattle, WA (US Citizen, no visa needed)
- Salary Target: $195k base + equity (fits budget $180k-$215k)
- Culture: Articulate, humble, explained Kafka partition rebalancing tradeoffs flawlessly.
- Recommendation: Fast track to tech screen!`,
          uploadedAt: "2026-10-15T11:00:00Z",
        },
      ],
    },
    expectedRecommendation: "ADVANCE_TECHNICAL_SCREEN",
    expectedRiskSeverity: "NONE",
    expectedHumanApproval: false,
    benchmarkGroundTruthNotes: "Flawless technical fit, high quote grounding, clean background, perfectly within compensation band.",
  },

  // Test Case 2: Resume Inflation / Fabricated Claims
  {
    id: "case_02",
    name: "Marcus Sterling",
    archetype: "Resume Inflation & Buzzword Stuffing",
    description: "3 years experience claiming to be VP of Engineering & Chief AI Architect who led an $80B Fortune 500 digital transformation; phone screen showed lack of basic CS knowledge.",
    candidatePackage: {
      candidateId: "cand_02_resume_inflation",
      candidateName: "Marcus Sterling",
      contactEmail: "marcus.sterling@cloudconsult.io",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-16T10:15:00Z",
      documents: [
        {
          id: "doc_02_resume",
          type: "resume",
          filename: "Marcus_Sterling_VP_Chief_Architect.docx",
          rawContent: `MARCUS STERLING
Chief Enterprise AI Architect & VP of Engineering
Contact: 555-392-8172 | SSN: 991-23-4567

PROFESSIONAL EXPERIENCE:
HyperScale Global Innovations (Self-employed / Agency) (2023-01 - Present)
Chief Enterprise AI Architect & VP of Engineering
- Personally oversaw entire global Fortune 500 AI transformation delivering $80B value.
- Implemented next-generation blockchain quantum distributed computing mesh using Go, Kafka, and Kubernetes.
- Disrupted legacy paradigm using deep neural synergetic cloud architectures.

Junior Tech Works (2021-06 - 2022-12)
Intern Web Developer
- Fixed CSS layout bugs on WordPress landing pages using HTML and jQuery.
- Configured contact forms and managed email auto-responder plugins.

EDUCATION:
Online Academy — B.A. General Studies (2021)`,
          uploadedAt: "2026-10-16T10:15:00Z",
        },
        {
          id: "doc_02_notes",
          type: "intake_notes",
          rawContent: `Recruiter Screen Notes - Marcus Sterling:
- Red Flag Alert: Candidate claims to have managed $80B transformation, but when asked about how Kafka consumer groups work, he stated "Kafka is an automated AI algorithm."
- Candidate could not explain basic microservices or SQL isolation levels when asked simple screen questions; claims VP experience was solo freelancing from his dorm room.
- Total real coding experience appears to be less than 2 years of HTML/CSS.`,
          uploadedAt: "2026-10-16T14:30:00Z",
        },
      ],
    },
    expectedRecommendation: "REJECT_KNOCKOUT_CRITERIA",
    expectedRiskSeverity: "CRITICAL",
    expectedHumanApproval: true,
    benchmarkGroundTruthNotes: "Extreme inflation anomaly, failed mandatory 5-year requirement, critical severity risk.",
  },

  // Test Case 3: Missing Hard Requirement (Role Mismatch)
  {
    id: "case_03",
    name: "Sarah Jenkins",
    archetype: "Missing Hard Requirement (Role Mismatch)",
    description: "Accomplished Senior UI/Design Systems Engineer applied for Distributed Backend role by mistake; confirmed zero backend or database experience.",
    candidatePackage: {
      candidateId: "cand_03_missing_hard_req",
      candidateName: "Sarah Jenkins",
      contactEmail: "sarah.jenkins@designsystems.net",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-17T08:20:00Z",
      documents: [
        {
          id: "doc_03_resume",
          type: "resume",
          filename: "Sarah_Jenkins_Design_Engineer.pdf",
          rawContent: `SARAH JENKINS
Senior Front-End Design Systems Engineer
Email: sarah.jenkins@designsystems.net | Phoenix, AZ

EXPERIENCE:
PixelCraft Studios — Senior Front-End Engineer (2020-04 - Present)
- Built WCAG AAA accessible Design System with 65+ reusable React and Tailwind components adopted by 12 client apps.
- Improved client-side Core Web Vitals resulting in 99/100 Lighthouse performance.
- Automated visual regression testing pipelines using Storybook and Chromatic.

Creative Spark Media — UI Developer (2018-06 - 2020-03)
- Developed responsive web interfaces in Vue.js and CSS modules.
- Collaborated with Figma product designers to standardize spacing tokens and color palettes.

EDUCATION:
Arizona State University — B.S. Graphic Information Technology (2018)`,
          uploadedAt: "2026-10-17T08:20:00Z",
        },
        {
          id: "doc_03_notes",
          type: "intake_notes",
          rawContent: `Intake Notes:
- Sarah reached out via LinkedIn messaging: Candidate applied for Senior Distributed Backend role by mistake; confirmed she has zero backend/server/database experience.
- Asked if we have a Frontend or Design Systems opening. (We do not currently).`,
          uploadedAt: "2026-10-17T09:45:00Z",
        },
      ],
    },
    expectedRecommendation: "REJECT_KNOCKOUT_CRITERIA",
    expectedRiskSeverity: "CRITICAL",
    expectedHumanApproval: true,
    benchmarkGroundTruthNotes: "Candidate completely lacks backend infrastructure domain; knockout criteria failed cleanly.",
  },

  // Test Case 4: Borderline / High Potential Career Pivot
  {
    id: "case_04",
    name: "David Chen",
    archetype: "Borderline / High-Slope Career Pivot",
    description: "5 years firmware/embedded C++ engineer pivoting to cloud distributed systems; built impressive self-taught Go/PostgreSQL IoT bridge.",
    candidatePackage: {
      candidateId: "cand_04_borderline_pivot",
      candidateName: "David Chen",
      contactEmail: "d.chen@embeddedlab.org",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-18T14:10:00Z",
      documents: [
        {
          id: "doc_04_resume",
          type: "resume",
          rawContent: `DAVID CHEN
Embedded Systems & Firmware Engineer | Chicago, IL
Email: d.chen@embeddedlab.org | Phone: 555-827-1940

EXPERIENCE:
OmniRobotics Corp — Embedded Systems Engineer (2021-01 - Present)
- Authored hard real-time CAN-bus communication firmware in C/C++ on ARM Cortex-M4.
- Self-taught Go and built local telemetry bridge logging sensor feeds to PostgreSQL handling 5k msgs/sec.
- Optimized DMA buffers and low-power sleep modes extending robotic battery runtime by 18%.

NextGen Sensors — Junior Firmware Developer (2019-06 - 2020-12)
- Implemented SPI and I2C peripheral drivers in embedded C.

EDUCATION:
Purdue University — B.S. Electrical & Computer Engineering (2019)`,
          uploadedAt: "2026-10-18T14:10:00Z",
        },
        {
          id: "doc_04_notes",
          type: "intake_notes",
          rawContent: `Recruiter Screen:
- Candidate is eager to transition from hardware firmware to cloud distributed systems. Very sharp fundamentals, but lacks large-scale multi-tenant cloud experience.
- Strong cultural fit, passionate learner. Would need technical vetting on distributed consensus and horizontal scaling.`,
          uploadedAt: "2026-10-18T16:00:00Z",
        },
      ],
    },
    expectedRecommendation: "RECRUITER_CLARIFICATION_NEEDED",
    expectedRiskSeverity: "MEDIUM",
    expectedHumanApproval: true,
    benchmarkGroundTruthNotes: "Borderline fit; high foundational skills in C++/concurrency, but nascent cloud scale. Requires human recruiter/HM calibration.",
  },

  // Test Case 5: Unexplained Career Gap with Tenures
  {
    id: "case_05",
    name: "Alexander Vance",
    archetype: "Unexplained Gaps & Tenure Instability",
    description: "Multiple 7-month stints and unexplained 13-month and 8-month gaps in employment history.",
    candidatePackage: {
      candidateId: "cand_05_gap_and_tenure",
      candidateName: "Alexander Vance",
      contactEmail: "avance@engineermail.net",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-19T11:00:00Z",
      documents: [
        {
          id: "doc_05_resume",
          type: "resume",
          rawContent: `ALEXANDER VANCE
Backend Engineer | Austin, TX

EXPERIENCE:
FinFlow Tech — Backend Engineer (2023-08 - 2024-03)
- Built REST APIs in Node.js for customer loan onboarding flow.
- Optimized SQL indexes reducing checkout latency by 15%.

CloudScale Co — Software Engineer (2022-09 - 2023-04)
- Maintained Redis caching layer and wrote microservice integrations.

DataVibe Systems — Junior Backend Developer (2020-01 - 2021-08)
- Built data ingestion pipelines in Go and PostgreSQL.

EDUCATION:
Penn State — B.S. Information Systems (2017)`,
          uploadedAt: "2026-10-19T11:00:00Z",
        },
        {
          id: "doc_05_notes",
          type: "intake_notes",
          rawContent: `Recruiter Screening:
- Candidate has an unexplained 13-month gap between August 2021 and September 2022, and another gap since March 2024 (8 months).
- Needs clarification on tenure instability (two consecutive 7-month stays).`,
          uploadedAt: "2026-10-19T13:00:00Z",
        },
      ],
    },
    expectedRecommendation: "RECRUITER_CLARIFICATION_NEEDED",
    expectedRiskSeverity: "HIGH",
    expectedHumanApproval: true,
    benchmarkGroundTruthNotes: "Solid technical baseline, but heavy risk penalties due to unexplained gaps and short tenures.",
  },

  // Test Case 6: Compensation and Intent Mismatch
  {
    id: "case_06",
    name: "Julian K. Thorne",
    archetype: "Compensation & Intent Mismatch",
    description: "Principal Architect requesting $380,000 base salary and remote work from Switzerland; budget is $215k US-only.",
    candidatePackage: {
      candidateId: "cand_06_comp_mismatch",
      candidateName: "Julian K. Thorne",
      contactEmail: "julian.thorne@leadtech.com",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-20T08:00:00Z",
      documents: [
        {
          id: "doc_06_resume",
          type: "resume",
          rawContent: `JULIAN K. THORNE
Principal Distributed Systems Architect | Geneva, Switzerland
10 years experience building ultra-low-latency financial trading platforms in Go and C++.

EXPERIENCE:
Apex Global Capital — Principal Distributed Systems Architect (2019-02 - Present)
- Led 40-engineer distributed trading floor engineering organization.
- Designed ultra-low latency FPGA and Go execution gateways processing billions in transactions.

EDUCATION:
Georgia Tech — M.S. Computer Engineering (2014)`,
          uploadedAt: "2026-10-20T08:00:00Z",
        },
        {
          id: "doc_06_notes",
          type: "intake_notes",
          rawContent: `Intake Notes:
- Candidate is exceptional technically, but firm on minimum $380,000 base salary + remote from Switzerland; our approved budget is max $215,000 USD and US-only payroll.
- Unwilling to negotiate on base or international employment entity.`,
          uploadedAt: "2026-10-20T10:00:00Z",
        },
      ],
    },
    expectedRecommendation: "REJECT_KNOCKOUT_CRITERIA",
    expectedRiskSeverity: "CRITICAL",
    expectedHumanApproval: true,
    benchmarkGroundTruthNotes: "Phenomenal technical credentials, but disqualified by financial and payroll jurisdictional constraints.",
  },

  // Test Case 7: Junior High Potential (Fast Learner)
  {
    id: "case_07",
    name: "Maya Lin",
    archetype: "Junior High Potential (Down-level Candidate)",
    description: "2 years experience, built open-source Go rate limiter with 800+ stars; below 5-year senior bar but great mid-level candidate.",
    candidatePackage: {
      candidateId: "cand_07_junior_high_potential",
      candidateName: "Maya Lin",
      contactEmail: "maya.lin@columbia.edu",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-21T09:30:00Z",
      documents: [
        {
          id: "doc_07_resume",
          type: "resume",
          rawContent: `MAYA LIN
Associate Software Engineer | New York, NY
Email: maya.lin@columbia.edu | GitHub: mayalin

EXPERIENCE:
OpenMesh Technologies — Associate Software Engineer (2022-08 - Present)
- Shipped Go telemetry collector adopted by 40 internal services with 99.95% uptime.
- Authored integration test suite reducing release regression rate by 45%.
- Maintained PostgreSQL read-replicas and connection pooling.

EDUCATION:
Columbia University — B.S. Computer Science (2022), Dean's List`,
          uploadedAt: "2026-10-21T09:30:00Z",
        },
        {
          id: "doc_07_notes",
          type: "intake_notes",
          rawContent: `Recruiter Screen:
- Incredible slope and grit. Very articulate. Only 2 years of experience against a 5-year requirement, but candidate built open source rate limiter with 800+ GitHub stars.
- Recommend HM consider opening a Mid-Level position for her.`,
          uploadedAt: "2026-10-21T11:00:00Z",
        },
      ],
    },
    expectedRecommendation: "RECRUITER_CLARIFICATION_NEEDED",
    expectedRiskSeverity: "HIGH",
    expectedHumanApproval: true,
    benchmarkGroundTruthNotes: "Tenure below senior requirement, but high capability. System flags for recruiter/HM downlevel calibration.",
  },

  // Test Case 8: Format Disaster / Messy Unstructured Resume
  {
    id: "case_08",
    name: "Bao Nguyen",
    archetype: "Messy Unstructured Source Text",
    description: "Scrambled OCR formatting, tabbed text, and jammed bullets that break standard regex parsers; qualified Senior Backend Engineer.",
    candidatePackage: {
      candidateId: "cand_08_messy_unstructured",
      candidateName: "Bao Nguyen",
      contactEmail: "bao.n@redacted.domain",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-22T15:00:00Z",
      documents: [
        {
          id: "doc_08_resume",
          type: "resume",
          filename: "Bao_resume_scan_ocr_broken.txt",
          rawContent: `Bao Nguyen === Senior Backend Developer === (555) 902-1829 || San Jose CA
Skills::: Go, Kafka, Kubernetes, PostgreSQL, gRPC, Docker, Linux, C++
WORK HIST:
StreamFlow Networks || Senior Backend Developer (2020-03 - Present)
*** Handled migration of legacy monolithic system to Go microservices processing 60k requests/sec *** Configured Kafka partition replication and reduced consumer lag by 80% *** Designed multi-tenant PostgreSQL schemas with connection pooling ***
Prior: CloudBase Inc (2018-06 - 2020-02) Software Engineer - developed internal REST endpoints.
EDU: San Jose State University B.S. Software Engineering 2018`,
          uploadedAt: "2026-10-22T15:00:00Z",
        },
        {
          id: "doc_08_notes",
          type: "intake_notes",
          rawContent: `Recruiter Notes:
Original resume was horribly formatted (text OCR scrambled, weird table encoding, raw bullets jammed together). Normalizer successfully parsed core content. Great screen, confirmed technical chops.`,
          uploadedAt: "2026-10-22T16:30:00Z",
        },
      ],
    },
    expectedRecommendation: "ADVANCE_TECHNICAL_SCREEN",
    expectedRiskSeverity: "NONE",
    expectedHumanApproval: false,
    benchmarkGroundTruthNotes: "Tests resilience of normalizer and extractor against distorted, unstructured plain text.",
  },

  // Test Case 9: Overqualified Staff/Director Seeking Hands-On IC Role
  {
    id: "case_09",
    name: "Dr. Robert Sterling",
    archetype: "Overqualified Executive Returning to IC",
    description: "16 years experience, ex-VP of Infrastructure with MIT PhD; wants hands-on coding IC role with no management responsibilities.",
    candidatePackage: {
      candidateId: "cand_09_overqualified_leader",
      candidateName: "Dr. Robert Sterling",
      contactEmail: "r.sterling@stafftech.io",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-23T12:00:00Z",
      documents: [
        {
          id: "doc_09_resume",
          type: "resume",
          rawContent: `DR. ROBERT STERLING
VP of Cloud Infrastructure & Distinguished Architect | Boston, MA
Email: r.sterling@stafftech.io

SUMMARY:
16 years of distributed infrastructure leadership. Led 120-person platform engineering organization across multi-region datacenters. Authored multi-datacenter consensus and zero-downtime failover strategy.

EXPERIENCE:
Global Scale Data — VP of Cloud Infrastructure (2018-05 - Present)
- Managed 120-person platform engineering organization across multi-region datacenters.
- Authored multi-datacenter consensus and zero-downtime failover strategy in Go and C++.

CoreEngine Systems — Principal Architect (2012-08 - 2018-04)
- Architected Paxos-based cluster storage engine.

EDUCATION:
MIT — Ph.D. Distributed Systems (2008)`,
          uploadedAt: "2026-10-23T12:00:00Z",
        },
        {
          id: "doc_09_notes",
          type: "intake_notes",
          rawContent: `Recruiter Screen Notes:
- Candidate is intentionally stepping back from VP management to return to individual contributor coding. Wants zero direct reports. Verify coding freshness during live pairing.
- Willing to accept Senior/Staff compensation band ($210k).`,
          uploadedAt: "2026-10-23T14:00:00Z",
        },
      ],
    },
    expectedRecommendation: "ADVANCE_HIRING_MANAGER_LOOP",
    expectedRiskSeverity: "MEDIUM",
    expectedHumanApproval: true,
    benchmarkGroundTruthNotes: "Scores exceptionally high, but triggers human approval gate to verify motivations for stepping back from executive track.",
  },

  // Test Case 10: International Visa / Relocation Boundary
  {
    id: "case_10",
    name: "Ananya Sharma",
    archetype: "Work Authorization & Relocation Boundary",
    description: "Strong engineer based in India needing immediate US relocation sponsorship; role requisition explicitly cannot sponsor relocations.",
    candidatePackage: {
      candidateId: "cand_10_international_visa",
      candidateName: "Ananya Sharma",
      contactEmail: "ananya.sharma@techcloud.in",
      targetRole: "Senior Distributed Systems Backend Engineer",
      submittedAt: "2026-10-24T06:00:00Z",
      documents: [
        {
          id: "doc_10_resume",
          type: "resume",
          rawContent: `ANANYA SHARMA
Senior Backend Engineer | Bangalore, India
Email: ananya.sharma@techcloud.in

EXPERIENCE:
HyperCloud Bangalore — Senior Backend Engineer (2020-01 - Present)
- Built distributed multi-tenant API gateway in Go serving 30,000 req/sec.
- Orchestrated Kubernetes statefulsets for Cassandra datastore clusters.
- Implemented gRPC endpoints with circuit breaking.

EDUCATION:
IIT Delhi — B.Tech Computer Science (2018)`,
          uploadedAt: "2026-10-24T06:00:00Z",
        },
        {
          id: "doc_10_notes",
          type: "intake_notes",
          rawContent: `Recruiter Screen:
- Candidate resides in India and requires immediate US H-1B or O-1 visa sponsorship to relocate. Company policy current role cannot sponsor international relocations.
- Great technical profile, but knockout policy applies.`,
          uploadedAt: "2026-10-24T08:00:00Z",
        },
      ],
    },
    expectedRecommendation: "REJECT_KNOCKOUT_CRITERIA",
    expectedRiskSeverity: "CRITICAL",
    expectedHumanApproval: true,
    benchmarkGroundTruthNotes: "Disqualified strictly on organizational immigration policy; clear knockout without wasting engineering interview hours.",
  },
];
