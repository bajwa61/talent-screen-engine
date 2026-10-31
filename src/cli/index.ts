import { Command } from "commander";
import fs from "fs";
import path from "path";
import { runScreeningPipeline } from "../pipeline";
import { BENCHMARK_RUBRIC, BENCHMARK_TEST_CASES } from "../eval/testCases";
import { CandidatePackage, CandidatePackageSchema } from "../types";
import { SupportedProvider } from "../providers/llmRouter";

const program = new Command();

program
  .name("talentscreen")
  .description("TalentScreen AI: Candidate Review & Dossier Normalizer CLI")
  .version("1.0.0");

program
  .command("screen")
  .description("Screen an individual candidate package or benchmark case")
  .option("-c, --case <caseId>", "Run a preset benchmark case ID (e.g. case_01 to case_10)")
  .option("-i, --input <filepath>", "Path to candidate package JSON file")
  .option("-p, --provider <provider>", "LLM provider: mock | gemini | openai", "mock")
  .option("-o, --output <filepath>", "Save screening report JSON to file")
  .action(async (options) => {
    try {
      let candidatePkg: CandidatePackage;

      if (options.case) {
        const found = BENCHMARK_TEST_CASES.find((c) => c.id === options.case);
        if (!found) {
          console.error(`❌ Unknown test case ID: "${options.case}". Valid options are case_01 through case_10.`);
          process.exit(1);
        }
        candidatePkg = found.candidatePackage;
        console.log(`\n📂 Loaded benchmark case: ${found.id} - ${found.name} (${found.archetype})`);
      } else if (options.input) {
        const fullPath = path.resolve(process.cwd(), options.input);
        if (!fs.existsSync(fullPath)) {
          console.error(`❌ File not found at path: ${fullPath}`);
          process.exit(1);
        }
        const fileContent = fs.readFileSync(fullPath, "utf-8");
        candidatePkg = CandidatePackageSchema.parse(JSON.parse(fileContent));
        console.log(`\n📂 Loaded candidate package from ${fullPath}`);
      } else {
        console.log(`ℹ️ No input or case specified. Defaulting to benchmark case_01 (Elena Rostova)...`);
        candidatePkg = BENCHMARK_TEST_CASES[0].candidatePackage;
      }

      console.log(`⚙️ Executing screening pipeline (Provider: ${options.provider})...`);
      const report = await runScreeningPipeline(candidatePkg, BENCHMARK_RUBRIC, {
        provider: options.provider as SupportedProvider,
      });

      console.log(`\n======================================================`);
      console.log(`🎯 TALENTSCREEN AI SCREENING DOSSIER REPORT`);
      console.log(`======================================================`);
      console.log(`Candidate:        ${report.candidateName} (${report.candidateId})`);
      console.log(`Target Role:      ${report.roleTitle}`);
      console.log(`Overall Fit:      ${report.decision.overallFitScore}/100 [${report.decision.fitBand}]`);
      console.log(`Recommendation:    ${report.decision.recommendation}`);
      console.log(`Human Signoff:    ${report.decision.humanApprovalRequired ? "⚠️ REQUIRED" : "✅ AUTO-CLEARED"}`);
      console.log(`Execution Latency:${report.executionDurationMs} ms`);

      if (report.decision.humanApprovalReasons.length > 0) {
        console.log(`\n⚠️ HUMAN APPROVAL TRIGGERS:`);
        report.decision.humanApprovalReasons.forEach((r) => console.log(`  - ${r}`));
      }

      console.log(`\n📋 CRITERIA EVIDENCE AUDIT (Verbatim Quotes Grounding):`);
      report.criteriaEvaluations.forEach((c) => {
        const quoteStatus = c.isHallucinationChecked ? "✅ Quote Verified" : "⚠️ Unverified";
        console.log(`  • [${c.grade}] ${c.criterionName} (${c.score}/100) [${quoteStatus}]`);
        console.log(`    Analysis: ${c.analysis}`);
        c.verbatimQuotes.forEach((q) => console.log(`    Quote: "${q}"`));
      });

      console.log(`\n🛡️ RISK & ANOMALY DETECTIONS (${report.risks.length} flagged):`);
      if (report.risks.length === 0) {
        console.log(`  - Zero anomalies detected. Clean candidate record.`);
      } else {
        report.risks.forEach((r) => {
          console.log(`  • [${r.severity}] ${r.category}: ${r.summary}`);
          console.log(`    Follow-up: ${r.suggestedInterviewFollowup}`);
        });
      }

      console.log(`\n💼 ATS STAGE & NEXT ACTIONS:`);
      console.log(`  Stage: ${report.decision.atsSyncPayload.stage}`);
      console.log(`  Tags:  ${report.decision.atsSyncPayload.tags.join(", ")}`);
      console.log(`  Suggested Next Steps:`);
      report.decision.suggestedNextSteps.forEach((s) => console.log(`    - ${s}`));
      console.log(`======================================================\n`);

      if (options.output) {
        const outPath = path.resolve(process.cwd(), options.output);
        fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");
        console.log(`💾 Saved full screening report to: ${outPath}\n`);
      }
    } catch (err) {
      console.error("❌ Screening pipeline error:", err);
      process.exit(1);
    }
  });

program
  .command("list-cases")
  .description("List all available benchmark test cases")
  .action(() => {
    console.log(`\n📋 AVAILABLE BENCHMARK CASES:`);
    BENCHMARK_TEST_CASES.forEach((c) => {
      console.log(`  - ${c.id.padEnd(10)} | ${c.name.padEnd(20)} | Archetype: ${c.archetype}`);
    });
    console.log(`\nRun via: npx tsx src/cli/index.ts screen --case <caseId>\n`);
  });

program.parse(process.argv);
