import { CandidateDossier, CriterionEvaluation, RiskAnomaly } from "../types";

export interface PrecomputedCaseMock {
  dossier: CandidateDossier;
  evaluations: CriterionEvaluation[];
  risks: RiskAnomaly[];
}

export const PRECOMPUTED_BENCHMARKS: Record<string, PrecomputedCaseMock> = {
  // Case 1: Strong Match - Senior Backend Distributed Systems Engineer
  "cand_01_strong_match": {
    dossier: {
      candidateId: "cand_01_strong_match",
      normalizedName: "Elena Rostova",
      sanitizedEmail: "elena.rostova@engineer.dev",
      yearsOfTotalExperience: 8,
      primaryDomain: "Distributed Backend Systems & Event-Driven Microservices",
      currentSeniority: "Senior Staff Software Engineer",
      workHistory: [
        {
          company: "Apex Cloud Technologies",
          title: "Senior Backend Engineer",
          startDate: "2021-03",
          endDate: "Present",
          durationMonths: 44,
          keyContributions: [
            "Architected Kafka event-streaming pipeline handling 120,000 requests/sec with p99 latency under 22ms",
            "Designed distributed consensus mechanism using Raft and Go for dynamic cluster reconfiguration",
            "Reduced AWS infrastructure costs by 34% through memory pooling and zero-copy byte buffers"
          ],
          technologiesUsed: ["Go", "Kafka", "PostgreSQL", "Docker", "Kubernetes", "AWS"],
          isCurrentRole: true,
        },
        {
          company: "Vanguard Payment Systems",
          title: "Backend Software Engineer",
          startDate: "2018-06",
          endDate: "2021-02",
          durationMonths: 32,
          keyContributions: [
            "Implemented idempotent transaction ledger processing $450M daily volume in Node.js and TypeScript",
            "Authored gRPC service interfaces with protobuf schemas across 14 decoupled microservices"
          ],
          technologiesUsed: ["TypeScript", "Node.js", "Redis", "gRPC", "PostgreSQL"],
          isCurrentRole: false,
        }
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          institution: "University of Washington",
          graduationYear: 2018,
          honors: "Summa Cum Laude"
        }
      ],
      extractedSkills: ["Distributed Systems", "Go", "Kafka", "PostgreSQL", "Kubernetes", "gRPC", "System Design"],
      portfolioHighlights: ["github.com/erostova/raft-mini-consensus"],
      recruiterNotesSummary: "Strong communicator, stellar architectural depth during screen, compensation matches band perfectly ($190k-$210k)."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "EXCEEDS",
        score: 96,
        verbatimQuotes: [
          "Architected Kafka event-streaming pipeline handling 120,000 requests/sec with p99 latency under 22ms"
        ],
        analysis: "Proven mastery in high-throughput event streaming with concrete throughput (120k req/s) and sub-25ms latency guarantees.",
        confidence: 0.98,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "EXCEEDS",
        score: 95,
        verbatimQuotes: [
          "Designed distributed consensus mechanism using Raft and Go for dynamic cluster reconfiguration",
          "Implemented idempotent transaction ledger processing $450M daily volume in Node.js and TypeScript"
        ],
        analysis: "Exceptional dual competence in Go systems programming and TypeScript backend services.",
        confidence: 0.96,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_cloud_infra",
        criterionName: "Cloud Infrastructure & Kubernetes",
        weight: "strong_plus",
        grade: "MEETS",
        score: 88,
        verbatimQuotes: [
          "Reduced AWS infrastructure costs by 34% through memory pooling and zero-copy byte buffers"
        ],
        analysis: "Direct cloud optimization track record on AWS and Kubernetes container orchestration.",
        confidence: 0.92,
        isHallucinationChecked: true,
      }
    ],
    risks: []
  },

  // Case 2: Resume Inflation / Buzzword Stuffing
  "cand_02_resume_inflation": {
    dossier: {
      candidateId: "cand_02_resume_inflation",
      normalizedName: "Marcus Sterling",
      sanitizedEmail: "marcus.sterling@cloudconsult.io",
      yearsOfTotalExperience: 3,
      primaryDomain: "General Web Development",
      currentSeniority: "Self-Styled Chief Enterprise Architect",
      workHistory: [
        {
          company: "HyperScale Global Innovations (Self-employed / Agency)",
          title: "Chief Enterprise AI Architect & VP of Engineering",
          startDate: "2023-01",
          endDate: "Present",
          durationMonths: 20,
          keyContributions: [
            "Personally oversaw entire global Fortune 500 AI transformation delivering $80B value",
            "Implemented next-generation blockchain quantum distributed computing mesh"
          ],
          technologiesUsed: ["Go", "Kafka", "Kubernetes", "Quantum AI", "Blockchain"],
          isCurrentRole: true,
        },
        {
          company: "Junior Tech Works",
          title: "Intern Web Developer",
          startDate: "2021-06",
          endDate: "2022-12",
          durationMonths: 18,
          keyContributions: [
            "Fixed CSS layout bugs on WordPress landing pages using HTML and jQuery"
          ],
          technologiesUsed: ["HTML", "CSS", "jQuery", "WordPress"],
          isCurrentRole: false,
        }
      ],
      education: [
        {
          degree: "B.A. General Studies",
          institution: "Online Academy",
          graduationYear: 2021,
        }
      ],
      extractedSkills: ["AI Architecture", "Blockchain", "Quantum", "HTML", "WordPress"],
      portfolioHighlights: [],
      recruiterNotesSummary: "Candidate could not explain basic microservices or SQL isolation levels when asked simple screen questions; claims VP experience was solo freelancing."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "NOT_MET",
        score: 18,
        verbatimQuotes: [
          "Implemented next-generation blockchain quantum distributed computing mesh"
        ],
        analysis: "Claims of distributed computing lack any factual architectural grounding; recruiter phone notes confirm inability to explain basic network calls or database isolation.",
        confidence: 0.95,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "NOT_MET",
        score: 25,
        verbatimQuotes: [
          "Fixed CSS layout bugs on WordPress landing pages using HTML and jQuery"
        ],
        analysis: "Actual verifiable engineering experience is limited to junior front-end and WordPress tweaks.",
        confidence: 0.94,
        isHallucinationChecked: true,
      }
    ],
    risks: [
      {
        id: "risk_inflation_01",
        category: "RESUME_INFLATION",
        severity: "CRITICAL",
        summary: "Extreme title and impact exaggeration (Solo freelancer claiming VP/Chief Enterprise Architect of $80B transformation)",
        details: "Contradiction between 3 years total experience with WordPress internship followed by unverified Chief Architect claims.",
        evidenceSnippet: "Personally oversaw entire global Fortune 500 AI transformation delivering $80B value",
        suggestedInterviewFollowup: "Probe actual team size managed, code repositories authored, and specific production system architecture.",
      },
      {
        id: "risk_inflation_02",
        category: "MISSING_HARD_REQUIREMENT",
        severity: "HIGH",
        summary: "Fails mandatory 5+ years production backend engineering requirement",
        details: "Candidate has approximately 3 years total experience with only WordPress maintenance verified.",
        evidenceSnippet: "Candidate profile indicates 3 years total experience.",
        suggestedInterviewFollowup: "Immediate disqualification recommended.",
      }
    ]
  },

  // Case 3: Missing Hard Requirement (Knockout)
  "cand_03_missing_hard_req": {
    dossier: {
      candidateId: "cand_03_missing_hard_req",
      normalizedName: "Sarah Jenkins",
      sanitizedEmail: "sarah.jenkins@designsystems.net",
      yearsOfTotalExperience: 6,
      primaryDomain: "Pure Front-End UI/UX Engineering",
      currentSeniority: "Senior React UI Developer",
      workHistory: [
        {
          company: "PixelCraft Studios",
          title: "Senior Front-End Engineer",
          startDate: "2020-04",
          endDate: "Present",
          durationMonths: 54,
          keyContributions: [
            "Built WCAG AAA accessible Design System with 65+ reusable React and Tailwind components",
            "Improved client-side Core Web Vitals resulting in 99/100 Lighthouse performance"
          ],
          technologiesUsed: ["React", "TypeScript", "TailwindCSS", "Storybook", "Jest"],
          isCurrentRole: true,
        }
      ],
      education: [
        {
          degree: "B.S. Graphic Information Technology",
          institution: "Arizona State University",
          graduationYear: 2018,
        }
      ],
      extractedSkills: ["React", "TypeScript", "TailwindCSS", "CSS3", "Design Systems", "Accessibility"],
      portfolioHighlights: ["sarahjenkins-ui.design"],
      recruiterNotesSummary: "Candidate applied for Senior Distributed Backend role by mistake; confirmed she has zero backend/server/database experience."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "NOT_MET",
        score: 0,
        verbatimQuotes: [
          "Candidate applied for Senior Distributed Backend role by mistake; confirmed she has zero backend/server/database experience."
        ],
        analysis: "Completely absent backend distributed systems experience. Source explicitly confirms candidate is pure front-end.",
        confidence: 0.99,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "PARTIAL",
        score: 50,
        verbatimQuotes: [
          "Built WCAG AAA accessible Design System with 65+ reusable React and Tailwind components"
        ],
        analysis: "Has front-end TypeScript component skills, but zero server-side Node.js or Go runtime experience.",
        confidence: 0.95,
        isHallucinationChecked: true,
      }
    ],
    risks: [
      {
        id: "risk_hard_req_01",
        category: "MISSING_HARD_REQUIREMENT",
        severity: "CRITICAL",
        summary: "Zero distributed systems or backend infrastructure experience for a backend role",
        details: "Candidate applied for backend role despite having exclusive UI/Design System background.",
        evidenceSnippet: "confirmed she has zero backend/server/database experience",
        suggestedInterviewFollowup: "Redirect candidate application to open Senior Front-End Engineer position.",
      }
    ]
  },

  // Case 4: Borderline / High Potential Career Pivot
  "cand_04_borderline_pivot": {
    dossier: {
      candidateId: "cand_04_borderline_pivot",
      normalizedName: "David Chen",
      sanitizedEmail: "d.chen@embeddedlab.org",
      yearsOfTotalExperience: 5,
      primaryDomain: "Embedded Firmware & Low-Level C++ Systems",
      currentSeniority: "Firmware Engineer II",
      workHistory: [
        {
          company: "OmniRobotics Corp",
          title: "Embedded Systems Engineer",
          startDate: "2021-01",
          endDate: "Present",
          durationMonths: 46,
          keyContributions: [
            "Authored hard real-time CAN-bus communication firmware in C/C++ on ARM Cortex-M4",
            "Self-taught Go and built local telemetry bridge logging sensor feeds to PostgreSQL"
          ],
          technologiesUsed: ["C++", "C", "RTOS", "Go", "PostgreSQL", "Linux"],
          isCurrentRole: true,
        }
      ],
      education: [
        {
          degree: "B.S. Electrical & Computer Engineering",
          institution: "Purdue University",
          graduationYear: 2019,
        }
      ],
      extractedSkills: ["C++", "Embedded Systems", "Go", "RTOS", "Memory Optimization", "PostgreSQL"],
      portfolioHighlights: ["github.com/dchen-iot/can-to-cloud-bridge"],
      recruiterNotesSummary: "Candidate is eager to transition from hardware firmware to cloud distributed systems. Very sharp fundamentals, but lacks large-scale multi-tenant cloud experience."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "PARTIAL",
        score: 62,
        verbatimQuotes: [
          "Self-taught Go and built local telemetry bridge logging sensor feeds to PostgreSQL"
        ],
        analysis: "Understands low-level concurrent systems and networking protocols, but cloud-native horizontal scalability is nascent.",
        confidence: 0.88,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "MEETS",
        score: 80,
        verbatimQuotes: [
          "Authored hard real-time CAN-bus communication firmware in C/C++ on ARM Cortex-M4",
          "Self-taught Go and built local telemetry bridge logging sensor feeds to PostgreSQL"
        ],
        analysis: "Deep systems programming fluency; Go usage is solid though primarily on single-node bridge applications.",
        confidence: 0.90,
        isHallucinationChecked: true,
      }
    ],
    risks: [
      {
        id: "risk_borderline_01",
        category: "UNVERIFIED_CLAIM",
        severity: "MEDIUM",
        summary: "Cloud distributed scalability skills are self-taught rather than enterprise-scale",
        details: "Candidate has strong low-level systems foundation but lacks multi-region cloud production war stories.",
        evidenceSnippet: "Very sharp fundamentals, but lacks large-scale multi-tenant cloud experience.",
        suggestedInterviewFollowup: "Evaluate candidate on cloud architectural trade-offs (CAP theorem, eventual consistency, Kafka consumer groups).",
      }
    ]
  },

  // Case 5: Unexplained Career Gap with Tenures
  "cand_05_gap_and_tenure": {
    dossier: {
      candidateId: "cand_05_gap_and_tenure",
      normalizedName: "Alexander Vance",
      sanitizedEmail: "avance@engineermail.net",
      yearsOfTotalExperience: 7,
      primaryDomain: "Backend Engineering",
      currentSeniority: "Senior Backend Developer",
      workHistory: [
        {
          company: "FinFlow Tech",
          title: "Backend Engineer",
          startDate: "2023-08",
          endDate: "2024-03",
          durationMonths: 7,
          keyContributions: [
            "Built REST APIs in Node.js for customer loan onboarding flow"
          ],
          technologiesUsed: ["Node.js", "Express", "PostgreSQL"],
          isCurrentRole: false,
        },
        {
          company: "CloudScale Co",
          title: "Software Engineer",
          startDate: "2022-09",
          endDate: "2023-04",
          durationMonths: 7,
          keyContributions: [
            "Maintained Redis caching layer and wrote microservice integrations"
          ],
          technologiesUsed: ["Node.js", "Redis", "Docker"],
          isCurrentRole: false,
        },
        {
          company: "DataVibe Systems",
          title: "Junior Backend Developer",
          startDate: "2020-01",
          endDate: "2021-08",
          durationMonths: 19,
          keyContributions: [
            "Built data ingestion pipelines in Go and PostgreSQL"
          ],
          technologiesUsed: ["Go", "PostgreSQL"],
          isCurrentRole: false,
        }
      ],
      education: [
        {
          degree: "B.S. Information Systems",
          institution: "Penn State",
          graduationYear: 2017,
        }
      ],
      extractedSkills: ["Go", "Node.js", "PostgreSQL", "Redis", "Docker"],
      portfolioHighlights: [],
      recruiterNotesSummary: "Candidate has an unexplained 13-month gap between August 2021 and September 2022, and another gap since March 2024 (8 months)."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "MEETS",
        score: 76,
        verbatimQuotes: [
          "Maintained Redis caching layer and wrote microservice integrations"
        ],
        analysis: "Adequate foundational backend microservices and caching experience.",
        confidence: 0.85,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "MEETS",
        score: 78,
        verbatimQuotes: [
          "Built data ingestion pipelines in Go and PostgreSQL"
        ],
        analysis: "Competent in both Go and Node.js backend development.",
        confidence: 0.87,
        isHallucinationChecked: true,
      }
    ],
    risks: [
      {
        id: "risk_gap_01",
        category: "UNEXPLAINED_GAP",
        severity: "HIGH",
        summary: "Multiple significant unexplained career gaps (13 months and 8 months)",
        details: "Gaps exist from Aug 2021 to Sep 2022, and currently since March 2024 without explanation in CV.",
        evidenceSnippet: "Candidate has an unexplained 13-month gap... and another gap since March 2024",
        suggestedInterviewFollowup: "Recruiter must clarify gap activities (sabbatical, stealth startup, family care, or performance exit).",
      },
      {
        id: "risk_tenure_01",
        category: "TENURE_INSTABILITY",
        severity: "MEDIUM",
        summary: "Two most recent tenures were only 7 months each",
        details: "Recent work history shows quick exits at FinFlow Tech (7 mos) and CloudScale Co (7 mos).",
        evidenceSnippet: "FinFlow Tech (7 mos) and CloudScale Co (7 mos)",
        suggestedInterviewFollowup: "Probe reasons for departure from recent two employers.",
      }
    ]
  },

  // Case 6: Compensation and Intent Mismatch
  "cand_06_comp_mismatch": {
    dossier: {
      candidateId: "cand_06_comp_mismatch",
      normalizedName: "Julian K. Thorne",
      sanitizedEmail: "julian.thorne@leadtech.com",
      yearsOfTotalExperience: 10,
      primaryDomain: "Enterprise Architecture & Fintech",
      currentSeniority: "Principal Architect",
      workHistory: [
        {
          company: "Apex Global Capital",
          title: "Principal Distributed Systems Architect",
          startDate: "2019-02",
          endDate: "Present",
          durationMonths: 68,
          keyContributions: [
            "Led 40-engineer distributed trading floor engineering organization",
            "Designed ultra-low latency FPGA and Go execution gateways"
          ],
          technologiesUsed: ["Go", "C++", "Kafka", "AWS", "Kubernetes"],
          isCurrentRole: true,
        }
      ],
      education: [
        {
          degree: "M.S. Computer Engineering",
          institution: "Georgia Tech",
          graduationYear: 2014,
        }
      ],
      extractedSkills: ["Go", "Enterprise Architecture", "Kafka", "Low Latency", "Cloud"],
      portfolioHighlights: [],
      recruiterNotesSummary: "Candidate is exceptional technically, but firm on minimum $380,000 base salary + remote from Switzerland; our approved budget is max $215,000 USD and US-only payroll."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "EXCEEDS",
        score: 98,
        verbatimQuotes: [
          "Designed ultra-low latency FPGA and Go execution gateways"
        ],
        analysis: "Flawless elite credentials in enterprise financial distributed systems.",
        confidence: 0.99,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "EXCEEDS",
        score: 97,
        verbatimQuotes: [
          "Designed ultra-low latency FPGA and Go execution gateways"
        ],
        analysis: "High-caliber Go engineering at massive scale.",
        confidence: 0.98,
        isHallucinationChecked: true,
      }
    ],
    risks: [
      {
        id: "risk_comp_01",
        category: "COMPENSATION_OR_INTENT_MISMATCH",
        severity: "CRITICAL",
        summary: "Severe compensation gap ($380k requested vs $215k budget) and payroll jurisdiction mismatch (Switzerland vs US only)",
        details: "Candidate demands $380,000 base salary which exceeds department budget by 76%, plus is non-US domiciled.",
        evidenceSnippet: "firm on minimum $380,000 base salary + remote from Switzerland; our approved budget is max $215,000 USD",
        suggestedInterviewFollowup: "Recruiter must verify if candidate is flexible on band or international contracting entity before booking interview loops.",
      }
    ]
  },

  // Case 7: Junior High Potential (Fast Learner)
  "cand_07_junior_high_potential": {
    dossier: {
      candidateId: "cand_07_junior_high_potential",
      normalizedName: "Maya Lin",
      sanitizedEmail: "maya.lin@columbia.edu",
      yearsOfTotalExperience: 2,
      primaryDomain: "Backend & Systems",
      currentSeniority: "Associate Software Engineer",
      workHistory: [
        {
          company: "OpenMesh Technologies",
          title: "Associate Software Engineer",
          startDate: "2022-08",
          endDate: "Present",
          durationMonths: 26,
          keyContributions: [
            "Shipped Go telemetry collector adopted by 40 internal services with 99.95% uptime",
            "Authored integration test suite reducing release regression rate by 45%"
          ],
          technologiesUsed: ["Go", "Docker", "PostgreSQL", "GitHub Actions"],
          isCurrentRole: true,
        }
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          institution: "Columbia University",
          graduationYear: 2022,
          honors: "Dean's List"
        }
      ],
      extractedSkills: ["Go", "Docker", "PostgreSQL", "CI/CD", "Testing"],
      portfolioHighlights: ["github.com/mayalin/go-rate-limiter-redis"],
      recruiterNotesSummary: "Incredible slope and grit. Very articulate. Only 2 years of experience against a 5-year requirement, but candidate built open source rate limiter with 800+ GitHub stars."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "PARTIAL",
        score: 68,
        verbatimQuotes: [
          "Shipped Go telemetry collector adopted by 40 internal services with 99.95% uptime"
        ],
        analysis: "Shows genuine production chops shipping service telemetry, though total enterprise breadth is constrained by tenure.",
        confidence: 0.91,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "MEETS",
        score: 84,
        verbatimQuotes: [
          "candidate built open source rate limiter with 800+ GitHub stars"
        ],
        analysis: "High technical slope evidenced by well-received open-source Go rate limiter.",
        confidence: 0.94,
        isHallucinationChecked: true,
      }
    ],
    risks: [
      {
        id: "risk_exp_07",
        category: "MISSING_HARD_REQUIREMENT",
        severity: "HIGH",
        summary: "Experience tenure (2 years) is below formal Senior title requirement (5 years)",
        details: "Role is calibrated as Senior; candidate is strong Mid/Associate.",
        evidenceSnippet: "Only 2 years of experience against a 5-year requirement",
        suggestedInterviewFollowup: "Hiring manager should calibrate if team can down-level to Mid-Level Software Engineer.",
      }
    ]
  },

  // Case 8: Format Disaster / Messy Unstructured Resume
  "cand_08_messy_unstructured": {
    dossier: {
      candidateId: "cand_08_messy_unstructured",
      normalizedName: "Bao Nguyen",
      sanitizedEmail: "bao.n@redacted.domain",
      yearsOfTotalExperience: 6,
      primaryDomain: "Distributed Systems & Cloud Platform",
      currentSeniority: "Senior Backend Engineer",
      workHistory: [
        {
          company: "StreamFlow Networks",
          title: "Senior Backend Developer",
          startDate: "2020-03",
          endDate: "Present",
          durationMonths: 55,
          keyContributions: [
            "Handled migration of legacy monolithic system to Go microservices processing 60k requests/sec",
            "Configured Kafka partition replication and reduced consumer lag by 80%"
          ],
          technologiesUsed: ["Go", "Kafka", "Kubernetes", "PostgreSQL"],
          isCurrentRole: true,
        }
      ],
      education: [
        {
          degree: "B.S. Software Engineering",
          institution: "San Jose State University",
          graduationYear: 2018,
        }
      ],
      extractedSkills: ["Go", "Kafka", "Microservices", "PostgreSQL", "Kubernetes"],
      portfolioHighlights: [],
      recruiterNotesSummary: "Original resume was horribly formatted (text OCR scrambled, weird table encoding, raw bullets jammed together). Normalizer successfully parsed core content."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "MEETS",
        score: 85,
        verbatimQuotes: [
          "Handled migration of legacy monolithic system to Go microservices processing 60k requests/sec"
        ],
        analysis: "Strong distributed migration credentials extracted accurately despite distorted source text.",
        confidence: 0.89,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "MEETS",
        score: 86,
        verbatimQuotes: [
          "Configured Kafka partition replication and reduced consumer lag by 80%"
        ],
        analysis: "Solid systems capabilities with Go and event brokers.",
        confidence: 0.90,
        isHallucinationChecked: true,
      }
    ],
    risks: []
  },

  // Case 9: Overqualified Staff/Director Seeking Hands-On IC Role
  "cand_09_overqualified_leader": {
    dossier: {
      candidateId: "cand_09_overqualified_leader",
      normalizedName: "Dr. Robert Sterling",
      sanitizedEmail: "r.sterling@stafftech.io",
      yearsOfTotalExperience: 16,
      primaryDomain: "Distributed Systems Architecture & Engineering Leadership",
      currentSeniority: "VP of Infrastructure / Distinguished Engineer",
      workHistory: [
        {
          company: "Global Scale Data",
          title: "VP of Cloud Infrastructure",
          startDate: "2018-05",
          endDate: "Present",
          durationMonths: 77,
          keyContributions: [
            "Managed 120-person platform engineering organization across multi-region datacenters",
            "Authored multi-datacenter consensus and zero-downtime failover strategy"
          ],
          technologiesUsed: ["Go", "C++", "Kafka", "Kubernetes", "AWS"],
          isCurrentRole: true,
        }
      ],
      education: [
        {
          degree: "Ph.D. Distributed Systems",
          institution: "MIT",
          graduationYear: 2008,
        }
      ],
      extractedSkills: ["Distributed Systems", "Infrastructure", "Go", "Strategy", "Leadership"],
      portfolioHighlights: ["ieee.org/papers/sterling-distributed-consensus"],
      recruiterNotesSummary: "Candidate is intentionally stepping back from VP management to return to individual contributor coding. Wants zero direct reports. Verify coding freshness."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "EXCEEDS",
        score: 99,
        verbatimQuotes: [
          "Authored multi-datacenter consensus and zero-downtime failover strategy"
        ],
        analysis: "Legendary pedigree and foundational research in distributed systems.",
        confidence: 0.99,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "MEETS",
        score: 88,
        verbatimQuotes: [
          "Managed 120-person platform engineering organization across multi-region datacenters"
        ],
        analysis: "Master-level understanding, though daily hands-on commits over recent 3 years should be validated in live pairing.",
        confidence: 0.92,
        isHallucinationChecked: true,
      }
    ],
    risks: [
      {
        id: "risk_overqual_01",
        category: "COMPENSATION_OR_INTENT_MISMATCH",
        severity: "MEDIUM",
        summary: "Executive-to-IC pivot risk (VP wanting IC Senior role)",
        details: "Requires intentional confirmation that candidate is truly satisfied with IC autonomy and no managerial scope.",
        evidenceSnippet: "Candidate is intentionally stepping back from VP management to return to individual contributor coding",
        suggestedInterviewFollowup: "Explore motivations for stepping back and test day-to-day coding enthusiasm during pairing.",
      }
    ]
  },

  // Case 10: International Visa / Work Authorization Boundary
  "cand_10_international_visa": {
    dossier: {
      candidateId: "cand_10_international_visa",
      normalizedName: "Ananya Sharma",
      sanitizedEmail: "ananya.sharma@techcloud.in",
      yearsOfTotalExperience: 6,
      primaryDomain: "Distributed Cloud Systems",
      currentSeniority: "Senior Backend Developer",
      workHistory: [
        {
          company: "HyperCloud Bangalore",
          title: "Senior Backend Engineer",
          startDate: "2020-01",
          endDate: "Present",
          durationMonths: 58,
          keyContributions: [
            "Built distributed multi-tenant API gateway in Go serving 30,000 req/sec",
            "Orchestrated Kubernetes statefulsets for Cassandra datastore clusters"
          ],
          technologiesUsed: ["Go", "Kafka", "Kubernetes", "Cassandra", "gRPC"],
          isCurrentRole: true,
        }
      ],
      education: [
        {
          degree: "B.Tech Computer Science",
          institution: "IIT Delhi",
          graduationYear: 2018,
        }
      ],
      extractedSkills: ["Go", "Kubernetes", "Cassandra", "gRPC", "Kafka"],
      portfolioHighlights: [],
      recruiterNotesSummary: "Candidate resides in India and requires immediate US H-1B or O-1 visa sponsorship to relocate. Company policy current role cannot sponsor international relocations."
    },
    evaluations: [
      {
        criterionId: "crit_dist_systems",
        criterionName: "High-Throughput Distributed Systems",
        weight: "must_have",
        grade: "MEETS",
        score: 87,
        verbatimQuotes: [
          "Built distributed multi-tenant API gateway in Go serving 30,000 req/sec"
        ],
        analysis: "Solid real-world scale and gateway architectural experience.",
        confidence: 0.94,
        isHallucinationChecked: true,
      },
      {
        criterionId: "crit_backend_lang",
        criterionName: "Production Go or TypeScript Mastery",
        weight: "must_have",
        grade: "MEETS",
        score: 88,
        verbatimQuotes: [
          "Built distributed multi-tenant API gateway in Go serving 30,000 req/sec"
        ],
        analysis: "High production proficiency in Go microservices.",
        confidence: 0.95,
        isHallucinationChecked: true,
      }
    ],
    risks: [
      {
        id: "risk_visa_01",
        category: "MISSING_HARD_REQUIREMENT",
        severity: "CRITICAL",
        summary: "Direct policy knockout: Requires US Visa relocation sponsorship not supported by role",
        details: "Company cannot sponsor foreign relocation for this opening as stated in requisition knockout rules.",
        evidenceSnippet: "Company policy current role cannot sponsor international relocations",
        suggestedInterviewFollowup: "Communicate policy respectfully and archive for future international remote openings.",
      }
    ]
  }
};
