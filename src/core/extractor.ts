import { CandidateDossier, CandidateDossierSchema } from "../types";
import { NormalizedPackage } from "./normalizer";
import { LLMClient } from "../providers/llmRouter";

export const DOSSIER_EXTRACTION_SYSTEM_PROMPT = `You are a Senior Talent Operations Data Extraction Specialist.
Your job is to analyze normalized candidate materials (resume, recruiter intake notes, supplemental docs)
and extract an accurate, highly structured factual candidate dossier.

CRITICAL EXTRACTION RULES:
1. Do NOT embellish or infer qualifications not stated in the source text.
2. Accurately calculate years of total relevant professional experience.
3. Extract each work experience entry with true company name, title, date range, duration, key contributions, and technologies used.
4. Extract recruiter intake notes summary if intake notes are present.
5. Return ONLY a valid JSON object matching the requested schema. No markdown wrapping, no extra keys.`;

export async function extractCandidateDossier(
  pkg: NormalizedPackage,
  llmClient: LLMClient
): Promise<CandidateDossier> {
  const prompt = `Candidate ID: ${pkg.candidateId}
Candidate Name: ${pkg.candidateName}
Target Role: ${pkg.targetRole}

RAW SOURCE TEXT:
${pkg.consolidatedText}

Extract the candidate dossier matching this JSON structure:
{
  "candidateId": "${pkg.candidateId}",
  "normalizedName": "${pkg.candidateName}",
  "sanitizedEmail": "${pkg.sanitizedEmail}",
  "yearsOfTotalExperience": <number>,
  "primaryDomain": "<e.g. Distributed Backend Systems, Frontend Engineering, DevOps>",
  "currentSeniority": "<e.g. Senior Software Engineer, Lead, Staff, Mid-level>",
  "workHistory": [
    {
      "company": "<string>",
      "title": "<string>",
      "startDate": "<string>",
      "endDate": "<string or Present>",
      "durationMonths": <number>,
      "keyContributions": ["<bullet 1>", "<bullet 2>"],
      "technologiesUsed": ["<tech 1>", "<tech 2>"],
      "isCurrentRole": <boolean>
    }
  ],
  "education": [
    {
      "degree": "<string>",
      "institution": "<string>",
      "graduationYear": <number or undefined>,
      "honors": "<string or undefined>"
    }
  ],
  "extractedSkills": ["<skill 1>", "<skill 2>"],
  "portfolioHighlights": ["<highlight 1>"],
  "recruiterNotesSummary": "<summary of recruiter screening signals or empty string>"
}`;

  const responseJson = await llmClient.generateStructuredJson<CandidateDossier>({
    systemPrompt: DOSSIER_EXTRACTION_SYSTEM_PROMPT,
    userPrompt: prompt,
    schemaName: "CandidateDossier",
  });

  // Runtime validation with fallback defaults if minor fields omitted
  return CandidateDossierSchema.parse(responseJson);
}
