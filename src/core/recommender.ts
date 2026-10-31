import {
  CriterionEvaluation,
  DecisionAction,
  DecisionActionSchema,
  DecisionRecommendation,
  RiskAnomaly,
  RoleRubric,
  CandidateDossier,
} from "../types";

export function synthesizeDecision(
  dossier: CandidateDossier,
  rubric: RoleRubric,
  criteriaEvals: CriterionEvaluation[],
  risks: RiskAnomaly[]
): DecisionAction {
  // 1. Calculate weighted fit score (0-100)
  let totalWeightPoints = 0;
  let earnedWeightPoints = 0;

  for (const c of criteriaEvals) {
    let weightMultiplier = 1.0;
    if (c.weight === "must_have") weightMultiplier = 3.0;
    else if (c.weight === "strong_plus") weightMultiplier = 2.0;
    else weightMultiplier = 1.0;

    totalWeightPoints += 100 * weightMultiplier;
    earnedWeightPoints += c.score * weightMultiplier;
  }

  const rawFitScore = totalWeightPoints > 0 ? Math.round((earnedWeightPoints / totalWeightPoints) * 100) : 50;

  // 2. Risk penalty adjustments
  const criticalRisks = risks.filter((r) => r.severity === "CRITICAL");
  const highRisks = risks.filter((r) => r.severity === "HIGH");
  const mediumRisks = risks.filter((r) => r.severity === "MEDIUM");

  let penalty = 0;
  penalty += criticalRisks.length * 35;
  penalty += highRisks.length * 15;
  penalty += mediumRisks.length * 5;

  const overallFitScore = Math.max(0, Math.min(100, rawFitScore - penalty));

  // 3. Check knockout and must-have failures
  const mustHaveEvaluations = criteriaEvals.filter((c) => c.weight === "must_have");
  const failedMustHaves = mustHaveEvaluations.filter((c) => c.grade === "NOT_MET" || c.score < 50);

  // 4. Determine recommendation & human approval triggers
  let recommendation: DecisionRecommendation;
  const humanApprovalReasons: string[] = [];

  if (criticalRisks.length > 0) {
    recommendation = "REJECT_KNOCKOUT_CRITERIA";
    humanApprovalReasons.push(`Critical risk identified: ${criticalRisks.map((r) => r.summary).join("; ")}`);
  } else if (failedMustHaves.length > 0) {
    recommendation = "REJECT_NOT_QUALIFIED";
    humanApprovalReasons.push(`Failed essential must-have criteria: ${failedMustHaves.map((c) => c.criterionName).join(", ")}`);
  } else if (mediumRisks.length > 0 && overallFitScore >= 75) {
    // Candidates with solid scores but notable medium flags (e.g. overqualified executive returning to IC)
    // are routed to Hiring Manager review before formal technical screens
    recommendation = "ADVANCE_HIRING_MANAGER_LOOP";
    humanApprovalReasons.push(`Medium risk or executive calibration needed: ${mediumRisks.map((r) => r.summary).join("; ")}`);
  } else if (overallFitScore >= 85 && highRisks.length === 0) {
    recommendation = "ADVANCE_TECHNICAL_SCREEN";
  } else if (overallFitScore >= 75 && highRisks.length === 0) {
    recommendation = "ADVANCE_HIRING_MANAGER_LOOP";
  } else if (overallFitScore >= 50 || highRisks.length > 0 || mediumRisks.length >= 2) {
    recommendation = "RECRUITER_CLARIFICATION_NEEDED";
    humanApprovalReasons.push("Borderline composite score or unverified risk flags requiring recruiter probe.");
  } else {
    recommendation = "REJECT_NOT_QUALIFIED";
  }

  // Any borderline or high-risk case MUST have human approval
  const humanApprovalRequired =
    humanApprovalReasons.length > 0 ||
    overallFitScore < 70 ||
    highRisks.length > 0 ||
    failedMustHaves.length > 0;

  // 5. Fit band
  let fitBand: "TIER_1_STRONG_YES" | "TIER_2_SOLID" | "TIER_3_BORDERLINE" | "TIER_4_NO";
  if (overallFitScore >= 85) fitBand = "TIER_1_STRONG_YES";
  else if (overallFitScore >= 70) fitBand = "TIER_2_SOLID";
  else if (overallFitScore >= 50) fitBand = "TIER_3_BORDERLINE";
  else fitBand = "TIER_4_NO";

  // 6. Executive summary
  const executiveSummary = `${dossier.normalizedName} evaluated for ${rubric.roleTitle}. Overall Fit: ${overallFitScore}/100 (${fitBand.replace(/_/g, " ")}). Recommendation: ${recommendation.replace(/_/g, " ")}. Key strengths include: ${criteriaEvals
    .filter((c) => c.grade === "EXCEEDS" || c.grade === "MEETS")
    .map((c) => c.criterionName)
    .slice(0, 2)
    .join(", ") || "General background"}. ${
    risks.length > 0 ? `Risks flagged: ${risks.map((r) => r.summary).slice(0, 2).join("; ")}.` : "No significant anomalies found."
  }`;

  // 7. Suggested next steps
  const suggestedNextSteps: string[] = [];
  if (recommendation === "ADVANCE_TECHNICAL_SCREEN") {
    suggestedNextSteps.push("Schedule 45-minute technical deep dive with senior engineering lead.");
    suggestedNextSteps.push("Confirm availability window for coding pairing session.");
  } else if (recommendation === "ADVANCE_HIRING_MANAGER_LOOP") {
    suggestedNextSteps.push("Send hiring manager brief with normalized dossier highlights.");
    suggestedNextSteps.push("Schedule 30-minute portfolio/project retrospective.");
  } else if (recommendation === "RECRUITER_CLARIFICATION_NEEDED") {
    suggestedNextSteps.push("Conduct 15-minute alignment sync regarding flagged anomalies.");
    risks.forEach((r) => suggestedNextSteps.push(`Probe: ${r.suggestedInterviewFollowup}`));
  } else {
    suggestedNextSteps.push("Send polite, constructive disposition email.");
    suggestedNextSteps.push("Archive candidate in ATS pool with tag: talent-pool-future-revisit.");
  }

  // 8. ATS sync payload
  const tags = [
    `fit:${overallFitScore}`,
    `band:${fitBand.toLowerCase()}`,
    `role:${rubric.roleId}`,
  ];
  if (humanApprovalRequired) tags.push("needs-recruiter-signoff");

  const internalNotesMarkdown = `### TalentScreen AI Review
**Fit Score**: ${overallFitScore}/100 (${fitBand})
**Recommendation**: ${recommendation}
**Human Signoff Required**: ${humanApprovalRequired ? "YES" : "NO"}

#### Criteria Breakdown
${criteriaEvals.map((c) => `- **${c.criterionName}** (${c.weight}): ${c.grade} (${c.score}/100) — *"${c.verbatimQuotes[0] || "No quote"}"*`).join("\n")}

#### Risk Audit
${risks.length > 0 ? risks.map((r) => `- [${r.severity}] ${r.category}: ${r.summary}`).join("\n") : "- None detected."}
`;

  return DecisionActionSchema.parse({
    recommendation,
    overallFitScore,
    fitBand,
    humanApprovalRequired,
    humanApprovalReasons,
    executiveSummary,
    suggestedNextSteps,
    atsSyncPayload: {
      stage: recommendation.startsWith("ADVANCE") ? "Interviewing" : recommendation === "RECRUITER_CLARIFICATION_NEEDED" ? "Recruiter Review" : "Rejected",
      tags,
      internalNotesMarkdown,
      rejectionReason: recommendation.startsWith("REJECT") ? executiveSummary : undefined,
    },
  });
}
