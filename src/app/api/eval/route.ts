import { NextResponse } from "next/server";
import { runEvaluationSuite } from "@/eval/evalHarness";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const provider = body.provider || "mock";
    const summary = await runEvaluationSuite(provider);
    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    console.error("Eval API route error:", error);
    return NextResponse.json({ error: error.message || "Eval harness failed" }, { status: 500 });
  }
}
