import { CriterionEvaluation, CriterionEvaluationSchema, RoleRubric } from "../types";
import { CandidateDossier } from "../types";
import { NormalizedPackage } from "./normalizer";
import { LLMClient } from "../providers/llmRouter";

export const EVALUATION_SYSTEM_PROMPT = `You are an elite, objective Technical Talent Assessor.
Your mission is to evaluate a candidate dossier against strict role criteria.

STRICT VERBATIM CITATION & ANTI-HALLUCINATION RULES:
1. Every score and grade MUST be backed by 1 to 3 VERBATIM quotes directly copied from the candidate's source text.
2. If an assertion is not directly quoted, it cannot be considered proven.
3. Grade options:
   - EXCEEDS: Candidate substantially surpasses the criteria with proven track record and scale.
   - MEETS: Candidate satisfies all core aspects with clear evidence.
   - PARTIAL: Candidate has tangential experience or meets only some sub-requirements.
   - NOT_MET: No evidence found or explicitly contradicts requirement.
   - UNCLEAR: Ambiguous claims without demonstrable context.
4. Score scale: 0-100.
   - EXCEEDS: 90-100
   - MEETS: 75-89
   - PARTIAL: 45-74
   - NOT_MET: 0-44
   - UNCLEAR: 20-50
5. You must return a strict JSON array of evaluations matching the criteria.`;

/**
 * Validates that verbatim quotes cited by LLM exist in the source text.
 * Prevents hallucinations by checking substring presence (case-insensitive & whitespace tolerant).
 */
export function verifyQuotesInSource(quotes: string[], sourceText: string): { verifiedQuotes: string[]; allVerified: boolean } {
  const normalizedSource = sourceText.toLowerCase().replace(/\s+/g, " ");
  const verified: string[] = [];

  for (const quote of quotes) {
    const cleanQuote = quote.trim().toLowerCase().replace(/\s+/g, " ");
    if (cleanQuote.length > 10 && normalizedSource.includes(cleanQuote)) {
      verified.push(quote);
    } else {
      // Partial window check if minor punctuation mismatch
      const words = cleanQuote.split(" ");
      if (words.length >= 4) {
        const sub1 = words.slice(0, 4).join(" ");
        const sub2 = words.slice(-4).join(" ");
        if (normalizedSource.includes(sub1) && normalizedSource.includes(sub2)) {
          verified.push(quote);
          continue;
        }
      }
      // If quote is short and found
      if (cleanQuote.length <= 10 && normalizedSource.includes(cleanQuote)) {
        verified.push(quote);
      }
    }
  }

  return {
    verifiedQuotes: verified,
    allVerified: verified.length === quotes.length && quotes.length > 0,
  };
}

export async function evaluateCriteriaEvidence(
  dossier: CandidateDossier,
  rubric: RoleRubric,
  pkg: NormalizedPackage,
  llmClient: LLMClient
): Promise<CriterionEvaluation[]> {
  const prompt = `CANDIDATE DOSSIER:
Name: ${dossier.normalizedName}
Experience: ${dossier.yearsOfTotalExperience} years
Skills: ${dossier.extractedSkills.join(", ")}
Work History Summary:
${dossier.workHistory.map(w => `- ${w.title} at ${w.company} (${w.startDate} - ${w.endDate}): ${w.keyContributions.join("; ")} [Tech: ${w.technologiesUsed.join(", ")}]`).join("\n")}

FULL SOURCE DOCUMENT TEXT (FOR VERBATIM QUOTES):
${pkg.consolidatedText}

ROLE RUBRIC TO EVALUATE:
Role: ${rubric.roleTitle} (${rubric.department}, ${rubric.level})
Criteria:
${JSON.stringify(rubric.criteria, null, 2)}

Return a JSON array of evaluations where each item has:
{
  "criterionId": "<matching criterion id>",
  "criterionName": "<matching criterion name>",
  "weight": "<must_have | strong_plus | nice_to_have>",
  "grade": "<EXCEEDS | MEETS | PARTIAL | NOT_MET | UNCLEAR>",
  "score": <number 0-100>,
  "verbatimQuotes": ["<exact quote from source text>"],
  "analysis": "<objective rationale explaining grade and score>",
  "confidence": <0.0 to 1.0>
}`;

  const evaluationsRaw = await llmClient.generateStructuredJson<CriterionEvaluation[]>({
    systemPrompt: EVALUATION_SYSTEM_PROMPT,
    userPrompt: prompt,
    schemaName: "Array<CriterionEvaluation>",
  });

  // Anti-hallucination verification pass
  const verifiedEvaluations: CriterionEvaluation[] = [];

  for (const rawEval of evaluationsRaw) {
    const quoteCheck = verifyQuotesInSource(rawEval.verbatimQuotes || [], pkg.consolidatedText);
    
    // If quotes were fabricated or empty when grade is MEETS/EXCEEDS, penalize score and flag
    let adjustedScore = rawEval.score;
    let adjustedGrade = rawEval.grade;
    let isHallucinationChecked = quoteCheck.allVerified;

    if (!quoteCheck.allVerified && (rawEval.grade === "MEETS" || rawEval.grade === "EXCEEDS")) {
      // LLM failed to provide genuine verifiable quotes from candidate's text
      adjustedScore = Math.max(35, rawEval.score - 25);
      if (adjustedScore < 75) {
        adjustedGrade = "PARTIAL";
      }
      isHallucinationChecked = false;
    }

    const validated = CriterionEvaluationSchema.parse({
      ...rawEval,
      score: adjustedScore,
      grade: adjustedGrade,
      verbatimQuotes: quoteCheck.verifiedQuotes.length > 0 ? quoteCheck.verifiedQuotes : rawEval.verbatimQuotes,
      isHallucinationChecked,
    });

    verifiedEvaluations.push(validated);
  }

  return verifiedEvaluations;
}
