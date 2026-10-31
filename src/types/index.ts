import { z } from "zod";

export const SourceDocumentSchema = z.object({
  id: z.string(),
  type: z.enum(["resume", "intake_notes", "portfolio_link", "cover_letter", "screening_transcript"]),
  filename: z.string().optional(),
  rawContent: z.string(),
  uploadedAt: z.string(),
});

export type SourceDocument = z.infer<typeof SourceDocumentSchema>;

export const CandidatePackageSchema = z.object({
  candidateId: z.string(),
  candidateName: z.string(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  targetRole: z.string(),
  documents: z.array(SourceDocumentSchema),
  submittedAt: z.string(),
  metadata: z.record(z.any()).optional(),
});

export type CandidatePackage = z.infer<typeof CandidatePackageSchema>;

export const CriteriaWeightSchema = z.enum(["must_have", "strong_plus", "nice_to_have"]);
export type CriteriaWeight = z.infer<typeof CriteriaWeightSchema>;

export const RoleCriterionSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: CriteriaWeightSchema,
  description: z.string(),
  minYearsExperience: z.number().optional(),
  benchmarkKeywords: z.array(z.string()).default([]),
});

export type RoleCriterion = z.infer<typeof RoleCriterionSchema>;

export const RoleRubricSchema = z.object({
  roleId: z.string(),
  roleTitle: z.string(),
  department: z.string(),
  level: z.string(),
  criteria: z.array(RoleCriterionSchema),
  knockoutRules: z.array(z.string()).default([]),
  idealCandidateSummary: z.string(),
});

export type RoleRubric = z.infer<typeof RoleRubricSchema>;

export const WorkExperienceItemSchema = z.object({
  company: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().optional().or(z.literal("Present")),
  durationMonths: z.number().default(0),
  keyContributions: z.array(z.string()),
  technologiesUsed: z.array(z.string()),
  isCurrentRole: z.boolean().default(false),
});

export type WorkExperienceItem = z.infer<typeof WorkExperienceItemSchema>;

export const EducationItemSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  graduationYear: z.number().optional(),
  honors: z.string().optional(),
});

export type EducationItem = z.infer<typeof EducationItemSchema>;

export const CandidateDossierSchema = z.object({
  candidateId: z.string(),
  normalizedName: z.string(),
  sanitizedEmail: z.string().optional(),
  yearsOfTotalExperience: z.number(),
  primaryDomain: z.string(),
  currentSeniority: z.string(),
  workHistory: z.array(WorkExperienceItemSchema),
  education: z.array(EducationItemSchema),
  extractedSkills: z.array(z.string()),
  portfolioHighlights: z.array(z.string()).default([]),
  recruiterNotesSummary: z.string().default(""),
});

export type CandidateDossier = z.infer<typeof CandidateDossierSchema>;

export const EvidenceGradeSchema = z.enum(["EXCEEDS", "MEETS", "PARTIAL", "NOT_MET", "UNCLEAR"]);
export type EvidenceGrade = z.infer<typeof EvidenceGradeSchema>;

export const CriterionEvaluationSchema = z.object({
  criterionId: z.string(),
  criterionName: z.string(),
  weight: CriteriaWeightSchema,
  grade: EvidenceGradeSchema,
  score: z.number().min(0).max(100), // 0 to 100
  verbatimQuotes: z.array(z.string()),
  analysis: z.string(),
  confidence: z.number().min(0).max(1),
  isHallucinationChecked: z.boolean().default(true),
});

export type CriterionEvaluation = z.infer<typeof CriterionEvaluationSchema>;

export const RiskSeveritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export type RiskSeverity = z.infer<typeof RiskSeveritySchema>;

export const RiskAnomalySchema = z.object({
  id: z.string(),
  category: z.enum([
    "UNEXPLAINED_GAP",
    "TENURE_INSTABILITY",
    "RESUME_INFLATION",
    "MISSING_HARD_REQUIREMENT",
    "COMPENSATION_OR_INTENT_MISMATCH",
    "UNVERIFIED_CLAIM",
  ]),
  severity: RiskSeveritySchema,
  summary: z.string(),
  details: z.string(),
  evidenceSnippet: z.string().optional(),
  suggestedInterviewFollowup: z.string(),
});

export type RiskAnomaly = z.infer<typeof RiskAnomalySchema>;

export const DecisionRecommendationSchema = z.enum([
  "ADVANCE_TECHNICAL_SCREEN",
  "ADVANCE_HIRING_MANAGER_LOOP",
  "RECRUITER_CLARIFICATION_NEEDED",
  "REJECT_NOT_QUALIFIED",
  "REJECT_KNOCKOUT_CRITERIA",
]);

export type DecisionRecommendation = z.infer<typeof DecisionRecommendationSchema>;

export const DecisionActionSchema = z.object({
  recommendation: DecisionRecommendationSchema,
  overallFitScore: z.number().min(0).max(100),
  fitBand: z.enum(["TIER_1_STRONG_YES", "TIER_2_SOLID", "TIER_3_BORDERLINE", "TIER_4_NO"]),
  humanApprovalRequired: z.boolean(),
  humanApprovalReasons: z.array(z.string()),
  executiveSummary: z.string(),
  suggestedNextSteps: z.array(z.string()),
  atsSyncPayload: z.object({
    stage: z.string(),
    tags: z.array(z.string()),
    internalNotesMarkdown: z.string(),
    rejectionReason: z.string().optional(),
  }),
});

export type DecisionAction = z.infer<typeof DecisionActionSchema>;

export const ScreeningReportSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  candidateName: z.string(),
  roleId: z.string(),
  roleTitle: z.string(),
  evaluatedAt: z.string(),
  executionProvider: z.string(),
  executionDurationMs: z.number(),
  tokenUsage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    estimatedCostUsd: z.number(),
  }),
  dossier: CandidateDossierSchema,
  criteriaEvaluations: z.array(CriterionEvaluationSchema),
  risks: z.array(RiskAnomalySchema),
  decision: DecisionActionSchema,
  auditTrail: z.array(
    z.object({
      timestamp: z.string(),
      event: z.string(),
      status: z.enum(["SUCCESS", "WARNING", "ERROR", "OVERRIDE"]),
      details: z.string(),
    })
  ),
  humanReviewState: z
    .object({
      status: z.enum(["PENDING_REVIEW", "APPROVED", "OVERRIDDEN", "REJECTED"]),
      reviewerName: z.string().optional(),
      reviewedAt: z.string().optional(),
      reviewerNotes: z.string().optional(),
      overriddenRecommendation: DecisionRecommendationSchema.optional(),
    })
    .default({ status: "PENDING_REVIEW" }),
});

export type ScreeningReport = z.infer<typeof ScreeningReportSchema>;
