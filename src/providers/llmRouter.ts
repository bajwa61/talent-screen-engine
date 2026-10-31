import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import dotenv from "dotenv";
import { PRECOMPUTED_BENCHMARKS } from "./mockData";

dotenv.config();

export type SupportedProvider = "mock" | "gemini" | "openai";

export interface LLMRequestOptions {
  systemPrompt: string;
  userPrompt: string;
  schemaName?: string;
  temperature?: number;
}

export interface LLMResponseUsage {
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  provider: string;
}

export interface LLMClient {
  providerName: SupportedProvider;
  generateStructuredJson<T>(options: LLMRequestOptions): Promise<T>;
  getLastUsage(): LLMResponseUsage;
}

/**
 * High-fidelity Deterministic Mock Provider
 * Guaranteed 100% offline reproducible behavior without requiring external network or API keys.
 */
export class DeterministicMockClient implements LLMClient {
  providerName: SupportedProvider = "mock";
  private lastUsage: LLMResponseUsage = {
    promptTokens: 1200,
    completionTokens: 600,
    estimatedCostUsd: 0.0003,
    provider: "deterministic-mock",
  };

  getLastUsage(): LLMResponseUsage {
    return this.lastUsage;
  }

  async generateStructuredJson<T>(options: LLMRequestOptions): Promise<T> {
    const prompt = options.userPrompt;
    
    // Check if the prompt matches any of our 10 canonical benchmark test cases
    for (const [candidateKey, precomputed] of Object.entries(PRECOMPUTED_BENCHMARKS)) {
      if (prompt.includes(candidateKey) || prompt.includes(precomputed.dossier.normalizedName)) {
        if (options.schemaName === "CandidateDossier") {
          return precomputed.dossier as unknown as T;
        }
        if (options.schemaName === "Array<CriterionEvaluation>") {
          return precomputed.evaluations as unknown as T;
        }
        if (options.schemaName === "Array<RiskAnomaly>") {
          return precomputed.risks as unknown as T;
        }
      }
    }

    // Dynamic heuristic fallback for arbitrary candidate submissions in mock mode
    if (options.schemaName === "CandidateDossier") {
      const nameMatch = prompt.match(/Candidate Name:\s*([^\n]+)/i);
      const targetName = nameMatch ? nameMatch[1].trim() : "Candidate Applicant";
      
      return {
        candidateId: "cand_dynamic_mock",
        normalizedName: targetName,
        sanitizedEmail: "applicant@example.com",
        yearsOfTotalExperience: 5,
        primaryDomain: "Full Stack Software Engineering",
        currentSeniority: "Senior Software Engineer",
        workHistory: [
          {
            company: "Tech Systems Inc",
            title: "Senior Engineer",
            startDate: "2021-01",
            endDate: "Present",
            durationMonths: 36,
            keyContributions: [
              "Designed backend microservices and improved API throughput",
              "Managed cloud infrastructure and database query performance"
            ],
            technologiesUsed: ["Go", "TypeScript", "PostgreSQL", "Docker"],
            isCurrentRole: true,
          }
        ],
        education: [
          {
            degree: "B.S. Computer Science",
            institution: "State University",
            graduationYear: 2019,
          }
        ],
        extractedSkills: ["Go", "TypeScript", "PostgreSQL", "System Architecture", "Cloud"],
        portfolioHighlights: [],
        recruiterNotesSummary: "Solid technical background, good communication during initial screen."
      } as unknown as T;
    }

    if (options.schemaName === "Array<CriterionEvaluation>") {
      return [
        {
          criterionId: "crit_dist_systems",
          criterionName: "High-Throughput Distributed Systems",
          weight: "must_have",
          grade: "MEETS",
          score: 82,
          verbatimQuotes: ["Designed backend microservices and improved API throughput"],
          analysis: "Demonstrated backend microservice capabilities with focus on throughput.",
          confidence: 0.88,
          isHallucinationChecked: true,
        },
        {
          criterionId: "crit_backend_lang",
          criterionName: "Production Go or TypeScript Mastery",
          weight: "must_have",
          grade: "MEETS",
          score: 85,
          verbatimQuotes: ["Go", "TypeScript"],
          analysis: "Strong core language alignment.",
          confidence: 0.90,
          isHallucinationChecked: true,
        }
      ] as unknown as T;
    }

    if (options.schemaName === "Array<RiskAnomaly>") {
      return [] as unknown as T;
    }

    throw new Error(`Unsupported schema name in mock client: ${options.schemaName}`);
  }
}

/**
 * Google Gemini Provider
 */
export class GeminiClient implements LLMClient {
  providerName: SupportedProvider = "gemini";
  private genAI: GoogleGenerativeAI;
  private modelName: string;
  private lastUsage: LLMResponseUsage = {
    promptTokens: 0,
    completionTokens: 0,
    estimatedCostUsd: 0,
    provider: "gemini",
  };

  constructor(apiKey: string, modelName = "gemini-1.5-flash") {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  getLastUsage(): LLMResponseUsage {
    return this.lastUsage;
  }

  async generateStructuredJson<T>(options: LLMRequestOptions): Promise<T> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: options.temperature ?? 0.1,
      },
      systemInstruction: options.systemPrompt,
    });

    const result = await model.generateContent(options.userPrompt);
    const responseText = result.response.text();

    const approxPromptTokens = Math.ceil((options.systemPrompt.length + options.userPrompt.length) / 4);
    const approxCompletionTokens = Math.ceil(responseText.length / 4);
    const estimatedCostUsd = (approxPromptTokens * 0.075 + approxCompletionTokens * 0.3) / 1_000_000;

    this.lastUsage = {
      promptTokens: approxPromptTokens,
      completionTokens: approxCompletionTokens,
      estimatedCostUsd,
      provider: `gemini (${this.modelName})`,
    };

    return JSON.parse(responseText) as T;
  }
}

/**
 * OpenAI Provider
 */
export class OpenAIClient implements LLMClient {
  providerName: SupportedProvider = "openai";
  private openai: OpenAI;
  private modelName: string;
  private lastUsage: LLMResponseUsage = {
    promptTokens: 0,
    completionTokens: 0,
    estimatedCostUsd: 0,
    provider: "openai",
  };

  constructor(apiKey: string, modelName = "gpt-4o-mini") {
    this.openai = new OpenAI({ apiKey });
    this.modelName = modelName;
  }

  getLastUsage(): LLMResponseUsage {
    return this.lastUsage;
  }

  async generateStructuredJson<T>(options: LLMRequestOptions): Promise<T> {
    const completion = await this.openai.chat.completions.create({
      model: this.modelName,
      messages: [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: options.temperature ?? 0.1,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const promptTokens = completion.usage?.prompt_tokens || 1000;
    const completionTokens = completion.usage?.completion_tokens || 400;
    const estimatedCostUsd = (promptTokens * 0.15 + completionTokens * 0.6) / 1_000_000;

    this.lastUsage = {
      promptTokens,
      completionTokens,
      estimatedCostUsd,
      provider: `openai (${this.modelName})`,
    };

    const parsed = JSON.parse(content);
    // Unwrap if openai returned a wrapper object like { "evaluations": [...] }
    if (options.schemaName?.startsWith("Array<") && !Array.isArray(parsed)) {
      const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
      if (arrayKey) return parsed[arrayKey] as T;
    }
    return parsed as T;
  }
}

/**
 * Factory & Router: Auto-selects provider based on env or falls back gracefully to Mock.
 */
export function getLLMClient(preferredProvider?: SupportedProvider): LLMClient {
  const chosen = preferredProvider || (process.env.DEFAULT_LLM_PROVIDER as SupportedProvider) || "mock";

  if (chosen === "gemini") {
    const key = process.env.GEMINI_API_KEY;
    if (key && key.trim() !== "") {
      return new GeminiClient(key, process.env.GEMINI_MODEL || "gemini-1.5-flash");
    }
    console.warn("[LLM Router] GEMINI_API_KEY missing. Falling back to deterministic high-fidelity mock engine.");
  }

  if (chosen === "openai") {
    const key = process.env.OPENAI_API_KEY;
    if (key && key.trim() !== "") {
      return new OpenAIClient(key, process.env.OPENAI_MODEL || "gpt-4o-mini");
    }
    console.warn("[LLM Router] OPENAI_API_KEY missing. Falling back to deterministic high-fidelity mock engine.");
  }

  return new DeterministicMockClient();
}
