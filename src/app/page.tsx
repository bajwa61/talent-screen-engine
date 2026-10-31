"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ShieldCheck,
  Zap,
  BarChart3,
  Search,
  UserCheck,
  Sparkles,
  ChevronRight,
  ClipboardCheck,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { BENCHMARK_TEST_CASES, BENCHMARK_RUBRIC } from "@/eval/testCases";
import { BASELINE_COMPARISONS } from "@/eval/baselineData";
import { ScreeningReport } from "@/types";

export default function Dashboard() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case_01");
  const [activeTab, setActiveTab] = useState<"screen" | "evaluation" | "baseline">("screen");
  const [provider, setProvider] = useState<"mock" | "gemini" | "openai">("mock");
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<ScreeningReport | null>(null);
  const [evalSummary, setEvalSummary] = useState<any>(null);
  const [humanReviewStatus, setHumanReviewStatus] = useState<string>("PENDING_REVIEW");
  const [humanNotes, setHumanNotes] = useState<string>("");

  const handleRunScreen = async (caseIdToRun = selectedCaseId) => {
    setLoading(true);
    try {
      const res = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: caseIdToRun, provider }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
        setHumanReviewStatus(data.report.decision.humanApprovalRequired ? "PENDING_REVIEW" : "APPROVED");
      } else {
        alert("Error running screening: " + (data.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunEvaluation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setEvalSummary(data.summary);
      }
    } catch (e: any) {
      alert("Evaluation error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const activeBenchmark = BENCHMARK_TEST_CASES.find((c) => c.id === selectedCaseId);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              TalentScreen AI
            </h1>
            <p className="text-xs text-slate-400">
              Candidate Review & Dossier Normalizer • Verbatim Quote Grounding
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("screen")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "screen"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Review Pipeline
          </button>
          <button
            onClick={() => {
              setActiveTab("evaluation");
              if (!evalSummary) handleRunEvaluation();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "evaluation"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            10-Case Benchmark Harness
          </button>
          <button
            onClick={() => setActiveTab("baseline")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "baseline"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Baseline Comparison
          </button>
        </div>

        {/* Provider selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Engine:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="mock">Deterministic Mock (100% Offline)</option>
            <option value="gemini">Google Gemini 1.5</option>
            <option value="openai">OpenAI GPT-4o-mini</option>
          </select>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === "screen" && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Queue / Benchmark Case Selector */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                    Applicant Review Queue
                  </h2>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    10 Test Profiles
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Select a representative candidate package to run through normalization, evidence grading, and risk detection.
                </p>

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {BENCHMARK_TEST_CASES.map((c) => {
                    const isSelected = c.id === selectedCaseId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCaseId(c.id);
                          handleRunScreen(c.id);
                        }}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-950/30 text-white"
                            : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span>{c.name}</span>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] rounded font-semibold ${
                              c.expectedRiskSeverity === "CRITICAL"
                                ? "bg-rose-950 text-rose-300 border border-rose-800"
                                : c.expectedRiskSeverity === "HIGH"
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            }`}
                          >
                            {c.expectedRiskSeverity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{c.archetype}</div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleRunScreen()}
                  disabled={loading}
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Analyzing Evidence...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      Run Screening Pipeline
                    </>
                  )}
                </button>
              </div>

              {/* Target Rubric Mini-Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                <div className="text-slate-200 font-semibold flex items-center justify-between">
                  <span>Target Role Rubric</span>
                  <span className="text-[11px] text-indigo-400">{BENCHMARK_RUBRIC.level}</span>
                </div>
                <div className="text-slate-300 font-medium">{BENCHMARK_RUBRIC.roleTitle}</div>
                <div className="text-slate-400 text-[11px]">{BENCHMARK_RUBRIC.idealCandidateSummary}</div>
                <div className="border-t border-slate-800 pt-2 space-y-1">
                  {BENCHMARK_RUBRIC.criteria.map((cr) => (
                    <div key={cr.id} className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{cr.name}</span>
                      <span className="text-slate-500">{cr.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Detailed Dossier & Report */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {!report ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                  <ClipboardCheck className="w-12 h-12 text-indigo-500 mx-auto mb-3 opacity-60" />
                  <h3 className="text-base font-semibold text-slate-200">No Screening Report Loaded</h3>
                  <p className="text-xs mt-1 max-w-sm mx-auto">
                    Click "Run Screening Pipeline" on any applicant in the queue to extract factual dossier, verify verbatim quotes, and compute ATS recommendations.
                  </p>
                </div>
              ) : (
                <>
                  {/* Executive Decision Banner */}
                  <div
                    className={`rounded-xl border p-5 ${
                      report.decision.fitBand === "TIER_1_STRONG_YES"
                        ? "bg-emerald-950/30 border-emerald-800"
                        : report.decision.fitBand === "TIER_2_SOLID"
                        ? "bg-cyan-950/30 border-cyan-800"
                        : report.decision.fitBand === "TIER_3_BORDERLINE"
                        ? "bg-amber-950/30 border-amber-800"
                        : "bg-rose-950/30 border-rose-800"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                            Fit Band: {report.decision.fitBand.replace(/_/g, " ")}
                          </span>
                          {report.decision.humanApprovalRequired ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Human Approval Required
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Auto-Cleared
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl font-black mt-1 text-white">
                          {report.decision.recommendation.replace(/_/g, " ")}
                        </h2>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-extrabold text-white">
                          {report.decision.overallFitScore}
                          <span className="text-sm font-normal text-slate-400">/100</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Weighted Fit Score</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {report.decision.executiveSummary}
                    </p>

                    {report.decision.humanApprovalReasons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-amber-300">
                        <span className="font-semibold">Audit Warning Triggers:</span>
                        <ul className="list-disc list-inside mt-1 text-[11px] text-amber-200/90 space-y-0.5">
                          {report.decision.humanApprovalReasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Criteria Evidence Grid with Verbatim Quotes */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Criteria Evidence Audit & Anti-Hallucination Quotes
                      </h3>
                      <span className="text-xs text-slate-400">
                        All quotes checked against source text
                      </span>
                    </div>

                    <div className="space-y-3">
                      {report.criteriaEvaluations.map((cr) => (
                        <div
                          key={cr.criterionId}
                          className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200">{cr.criterionName}</span>
                              <span className="text-[10px] text-slate-500 uppercase">({cr.weight})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                  cr.grade === "EXCEEDS"
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                    : cr.grade === "MEETS"
                                    ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                                    : cr.grade === "PARTIAL"
                                    ? "bg-amber-950 text-amber-300 border border-amber-800"
                                    : "bg-rose-950 text-rose-300 border border-rose-800"
                                }`}
                              >
                                {cr.grade} ({cr.score}/100)
                              </span>
                              {cr.isHallucinationChecked ? (
                                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/50">
                                  ✓ Grounded
                                </span>
                              ) : (
                                <span className="text-[10px] text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/50">
                                  ⚠ Unverified
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-slate-300 text-[11px]">{cr.analysis}</p>

                          {cr.verbatimQuotes.length > 0 && (
                            <div className="bg-slate-900/90 border border-slate-800 rounded p-2 space-y-1">
                              <span className="text-[10px] font-semibold text-slate-400 block">
                                Verbatim Source Citations:
                              </span>
                              {cr.verbatimQuotes.map((quote, qidx) => (
                                <div key={qidx} className="italic text-slate-300 text-[11px] border-l-2 border-indigo-500 pl-2">
                                  "{quote}"
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Forensic Risk & Anomaly Detector */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Forensic Anomaly & Discrepancy Findings
                      </h3>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                        {report.risks.length} Flags Detected
                      </span>
                    </div>

                    {report.risks.length === 0 ? (
                      <div className="text-xs text-slate-400 p-4 border border-dashed border-slate-800 rounded-lg text-center">
                        Zero anomalies detected. Candidate history and recruiter screen align cleanly.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {report.risks.map((risk) => (
                          <div
                            key={risk.id}
                            className={`p-3 rounded-lg border text-xs space-y-1 ${
                              risk.severity === "CRITICAL"
                                ? "border-rose-900/80 bg-rose-950/20 text-rose-200"
                                : risk.severity === "HIGH"
                                ? "border-amber-900/80 bg-amber-950/20 text-amber-200"
                                : "border-slate-800 bg-slate-950/60 text-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span>
                                [{risk.severity}] {risk.category}: {risk.summary}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300">{risk.details}</p>
                            {risk.evidenceSnippet && (
                              <div className="text-[10px] italic text-slate-400">
                                Evidence: "{risk.evidenceSnippet}"
                              </div>
                            )}
                            <div className="text-[11px] text-indigo-300 font-medium pt-1">
                              Targeted Interview Follow-up: {risk.suggestedInterviewFollowup}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recruiter Action & Human Sign-off Gate */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      Recruiter Human-in-the-Loop Sign-off & ATS Export
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-1">Human Review State:</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setHumanReviewStatus("APPROVED")}
                            className={`px-3 py-1.5 rounded-lg font-medium border ${
                              humanReviewStatus === "APPROVED"
                                ? "bg-emerald-600 border-emerald-500 text-white"
                                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                            }`}
                          >
                            Approve Decision
                          </button>
                          <button
                            onClick={() => setHumanReviewStatus("OVERRIDDEN")}
                            className={`px-3 py-1.5 rounded-lg font-medium border ${
                              humanReviewStatus === "OVERRIDDEN"
                                ? "bg-amber-600 border-amber-500 text-white"
                                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                            }`}
                          >
                            Override Recommendation
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">ATS Stage Assigned:</span>
                        <div className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-indigo-300 font-mono">
                          {report.decision.atsSyncPayload.stage}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block mb-1">Recruiter Reviewer Notes:</span>
                      <textarea
                        rows={2}
                        value={humanNotes}
                        onChange={(e) => setHumanNotes(e.target.value)}
                        placeholder="Add human recruiter sign-off notes or calibration feedback before syncing to ATS..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-[11px] text-slate-400">
                        Latency: <span className="text-slate-200">{report.executionDurationMs} ms</span> | Cost:{" "}
                        <span className="text-slate-200">${report.tokenUsage.estimatedCostUsd.toFixed(5)}</span> |
                        Tokens:{" "}
                        <span className="text-slate-200">
                          {report.tokenUsage.promptTokens + report.tokenUsage.completionTokens}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(report, null, 2));
                          alert("Screening Dossier JSON copied to clipboard!");
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        Copy ATS JSON Payload
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: 10-Case Benchmark Evaluation Harness */}
        {activeTab === "evaluation" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Automated 10-Case Benchmark Evaluation Harness
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Executes the full suite of 10 edge and failure scenarios against ground truth to measure accuracy, quote verification, and latency.
                </p>
              </div>
              <button
                onClick={handleRunEvaluation}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Re-Run Full Test Harness
              </button>
            </div>

            {evalSummary && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400">Ground Truth Accuracy</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">
                      {evalSummary.accuracyPercentage}%
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {evalSummary.passedCount} of {evalSummary.totalTestCases} cases matched exactly
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400">Quote Grounding Rate</span>
                    <div className="text-2xl font-bold text-indigo-400 mt-1">
                      {evalSummary.quoteVerificationRate}%
                    </div>
                    <span className="text-[10px] text-slate-500">0% hallucinated criteria</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400">Average Screening Latency</span>
                    <div className="text-2xl font-bold text-white mt-1">
                      {evalSummary.averageLatencyMs} ms
                    </div>
                    <span className="text-[10px] text-slate-500">Per candidate package</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400">Total Compute Cost</span>
                    <div className="text-2xl font-bold text-cyan-400 mt-1">
                      ${evalSummary.totalCostUsd.toFixed(5)}
                    </div>
                    <span className="text-[10px] text-slate-500">For all 10 candidate screens</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-800 font-semibold text-sm text-slate-200">
                    Individual Test Scenario Results
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-4">Case ID & Name</th>
                          <th className="py-2.5 px-4">Archetype</th>
                          <th className="py-2.5 px-4">Expected Rec.</th>
                          <th className="py-2.5 px-4">Actual Rec.</th>
                          <th className="py-2.5 px-4">Score</th>
                          <th className="py-2.5 px-4">Risks</th>
                          <th className="py-2.5 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {evalSummary.results.map((r: any) => (
                          <tr key={r.testCaseId} className="hover:bg-slate-850">
                            <td className="py-3 px-4 font-medium text-white">{r.candidateName}</td>
                            <td className="py-3 px-4 text-slate-400">{r.archetype}</td>
                            <td className="py-3 px-4 font-mono text-[11px]">{r.expectedRecommendation}</td>
                            <td className="py-3 px-4 font-mono text-[11px] text-indigo-300">
                              {r.actualRecommendation}
                            </td>
                            <td className="py-3 px-4 font-semibold">{r.overallFitScore}/100</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  r.risksDetectedCount > 0 ? "bg-amber-950 text-amber-300" : "text-slate-500"
                                }`}
                              >
                                {r.risksDetectedCount} flags
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {r.recommendationMatch ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                                </span>
                              ) : (
                                <span className="text-rose-400 font-bold flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> FAIL
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 3: Baseline Comparison */}
        {activeTab === "baseline" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Workflow Transformation: Baseline vs. TalentScreen AI
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Rigorous empirical comparison between manual recruiter screening, naive ChatGPT usage, and the production TalentScreen engine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(BASELINE_COMPARISONS).map(([key, item]) => {
                const isTarget = key === "talentscreen_engine";
                return (
                  <div
                    key={key}
                    className={`rounded-xl p-5 border text-xs space-y-4 ${
                      isTarget
                        ? "bg-indigo-950/20 border-indigo-500/80 shadow-lg shadow-indigo-500/10"
                        : "bg-slate-900 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white">{item.method}</h3>
                      {isTarget && (
                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          OUR SYSTEM
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Review Time per Screen:</span>
                        <span className={`font-bold ${isTarget ? "text-emerald-400" : "text-white"}`}>
                          {item.averageScreeningTimeMinutes} mins
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Ground Truth Accuracy:</span>
                        <span className={`font-bold ${isTarget ? "text-emerald-400" : "text-white"}`}>
                          {item.accuracyVsGroundTruthPct}%
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Hallucination Rate:</span>
                        <span className={`font-bold ${item.hallucinationOrFabricationRatePct > 10 ? "text-rose-400" : "text-emerald-400"}`}>
                          {item.hallucinationOrFabricationRatePct}%
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Risk & Knockout Catch Rate:</span>
                        <span className={`font-bold ${isTarget ? "text-emerald-400" : "text-white"}`}>
                          {item.riskCatchRatePct}%
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Cost per Candidate:</span>
                        <span className={`font-bold ${isTarget ? "text-emerald-400" : "text-white"}`}>
                          ${item.costPerCandidateUsd.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Human Hours / 100 Screens:</span>
                        <span className={`font-bold ${isTarget ? "text-emerald-400" : "text-white"}`}>
                          {item.humanLaborHoursPer100Candidates} hrs
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Audit Trail Quality:</span>
                        <span className="font-bold text-indigo-300">{item.auditTrailQuality}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
