import { NextResponse } from "next/server";
import { runScreeningPipeline } from "@/pipeline";
import { BENCHMARK_RUBRIC, BENCHMARK_TEST_CASES } from "@/eval/testCases";
import { CandidatePackage, CandidatePackageSchema } from "@/types";
import { SupportedProvider } from "@/providers/llmRouter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let candidatePkg: CandidatePackage;

    if (body.caseId) {
      const benchmarkCase = BENCHMARK_TEST_CASES.find((c) => c.id === body.caseId);
      if (!benchmarkCase) {
        return NextResponse.json({ error: `Benchmark case ${body.caseId} not found` }, { status: 404 });
      }
      candidatePkg = benchmarkCase.candidatePackage;
    } else if (body.candidatePackage) {
      candidatePkg = CandidatePackageSchema.parse(body.candidatePackage);
    } else {
      return NextResponse.json(
        { error: "Must provide either 'caseId' or 'candidatePackage' in request body" },
        { status: 400 }
      );
    }

    const provider = (body.provider || "mock") as SupportedProvider;
    const report = await runScreeningPipeline(candidatePkg, BENCHMARK_RUBRIC, { provider });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Screen API route error:", error);
    return NextResponse.json({ error: error.message || "Pipeline execution failed" }, { status: 500 });
  }
}
