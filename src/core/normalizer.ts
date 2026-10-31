import { CandidatePackage, CandidatePackageSchema } from "../types";

export interface NormalizedPackage {
  candidateId: string;
  candidateName: string;
  sanitizedEmail: string;
  targetRole: string;
  consolidatedText: string;
  resumeText: string;
  intakeNotesText: string;
  supplementalText: string;
  sanitizedTokensCount: number;
  piiRedactedCount: number;
}

/**
 * PII Sanitization rules to remove phone numbers, SSNs, and clean sensitive personal markers
 * while preserving legitimate qualifications, company names, and dates.
 */
export function sanitizeTextPII(rawText: string): { cleaned: string; redactorHits: number } {
  let redactorHits = 0;

  // Mask US/International Phone numbers (e.g. +1 (555) 019-2834, 555-123-4567)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  let cleaned = rawText.replace(phoneRegex, () => {
    redactorHits++;
    return "[REDACTED_PHONE]";
  });

  // Mask SSN / Gov IDs (e.g. 123-45-6789)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  cleaned = cleaned.replace(ssnRegex, () => {
    redactorHits++;
    return "[REDACTED_GOV_ID]";
  });

  // Normalize excessive white spaces and broken line breaks
  cleaned = cleaned
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "  ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { cleaned, redactorHits };
}

/**
 * Normalizes an incoming messy submission package into structured, sanitized,
 * and high-context representation ready for extraction and evaluation.
 */
export function normalizeCandidatePackage(rawPackage: unknown): NormalizedPackage {
  const parsed = CandidatePackageSchema.parse(rawPackage);

  let resumeText = "";
  let intakeNotesText = "";
  let supplementalText = "";
  let totalPiiRedactions = 0;

  for (const doc of parsed.documents) {
    const { cleaned, redactorHits } = sanitizeTextPII(doc.rawContent);
    totalPiiRedactions += redactorHits;

    if (doc.type === "resume") {
      resumeText += (resumeText ? "\n\n" : "") + cleaned;
    } else if (doc.type === "intake_notes" || doc.type === "screening_transcript") {
      intakeNotesText += (intakeNotesText ? "\n\n" : "") + cleaned;
    } else {
      supplementalText += (supplementalText ? "\n\n" : "") + `[${doc.type.toUpperCase()} - ${doc.filename || "Doc"}]:\n` + cleaned;
    }
  }

  const consolidatedParts = [
    `CANDIDATE: ${parsed.candidateName}`,
    `TARGET ROLE: ${parsed.targetRole}`,
    `=== RESUME CONTENT ===\n${resumeText || "(No resume text provided)"}`,
  ];

  if (intakeNotesText) {
    consolidatedParts.push(`=== RECRUITER INTAKE NOTES ===\n${intakeNotesText}`);
  }
  if (supplementalText) {
    consolidatedParts.push(`=== SUPPLEMENTAL DOCUMENTS ===\n${supplementalText}`);
  }

  const consolidatedText = consolidatedParts.join("\n\n");
  const approximateTokens = Math.ceil(consolidatedText.length / 4);

  return {
    candidateId: parsed.candidateId,
    candidateName: parsed.candidateName,
    sanitizedEmail: parsed.contactEmail || "applicant@redacted.domain",
    targetRole: parsed.targetRole,
    consolidatedText,
    resumeText,
    intakeNotesText,
    supplementalText,
    sanitizedTokensCount: approximateTokens,
    piiRedactedCount: totalPiiRedactions,
  };
}
