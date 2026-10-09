"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { manuscriptService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Sparkles,
  History,
  FileCheck2,
  CheckCircle2,
  Send,
  ArrowRight,
  MessageSquare,
  Split,
  ChevronDown,
} from "lucide-react";

export default function RevisionCenterPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "ms-003";

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorResponse1, setAuthorResponse1] = useState(
    "We thank the reviewer for this crucial suggestion. We have calibrated our 72-hour robotic fluid handler data and inserted Table 2 in Section 3.2 detailing error standard deviations (< 0.12 μL across 1,000 cycles)."
  );
  const [authorResponse2, setAuthorResponse2] = useState(
    "Thank you for the constructive feedback. Reproducibility code repositories have been pinned with DOI badges."
  );
  const [activeTab, setActiveTab] = useState<"feedback" | "diff">("feedback");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    manuscriptService.getById(id).then((ms) => {
      setManuscript(ms || null);
      setLoading(false);
    });
  }, [id]);

  const handleSubmitRevision = async () => {
    setSubmitting(true);
    await manuscriptService.updateStatus(id, "Under Review");
    setSubmitting(false);
    alert("Revision submitted! Manuscript returned to Associate Editor for verification.");
    router.push("/dashboard/author");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-700 uppercase tracking-wider">
                Revision Workspace • {manuscript?.code || "PUB-2026-1290"}
              </span>
              <Badge variant="amber" size="sm">
                Status: Minor Revision Requested
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-navy-950 mt-1">
              Revision Center: {manuscript?.title || "Autonomous Multi-Agent CRISPR Target Validation"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Journal: {manuscript?.journalName} • Version 1 → Version 2 (Revised)
            </p>
          </div>

          <Button
            variant="teal"
            size="md"
            isLoading={submitting}
            onClick={handleSubmitRevision}
            className="shadow-sm shrink-0"
          >
            <Send className="w-4 h-4 mr-1.5" />
            Submit Revised Manuscript
          </Button>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "feedback"
                ? "bg-navy-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Reviewer Feedback & AI Syntheses (2)
          </button>
          <button
            onClick={() => setActiveTab("diff")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "diff"
                ? "bg-navy-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            Manuscript Version Comparison (Diff)
          </button>
        </div>

        {activeTab === "feedback" ? (
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                    Reviewer 1 Feedback (Double-Blind)
                  </h3>
                </div>
                <Badge variant="amber" size="sm">
                  Recommendation: Minor Revision
                </Badge>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                  OFFICIAL REVIEWER COMMENTS:
                </span>
                "The autonomous wet-lab loop is remarkably innovative. However, the author must clarify how pipette calibration drift was monitored over continuous 72-hour automated runs in Section 3.2. Adding a small table on liquid handler error variance will make the methodology bulletproof."
              </div>

              <div className="p-4 bg-cyan-50/80 rounded-xl border border-cyan-200 text-xs text-cyan-950 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-cyan-900 uppercase tracking-wider text-[10px]">
                    PUBLICORE AI Feedback Interpretation
                  </span>
                  <p className="leading-relaxed">
                    Reviewer 1 strongly validates your overall architecture and hypothesis, but pinpointed an experimental reproducibility requirement: verify 72-hour pipette fluid calibration metrics and document liquid handling standard deviation in Section 3.2.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Author Point-by-Point Response to Reviewer 1:
                </label>
                <textarea
                  rows={3}
                  value={authorResponse1}
                  onChange={(e) => setAuthorResponse1(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-900 focus:outline-none focus:border-cyan-600 bg-white"
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                    Reviewer 2 Feedback (Double-Blind)
                  </h3>
                </div>
                <Badge variant="green" size="sm">
                  Recommendation: Accept
                </Badge>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                  OFFICIAL REVIEWER COMMENTS:
                </span>
                "Outstanding paper. The Bayesian active learning policy significantly outperforms heuristic sgRNA selection. Reproducibility artifacts are thoroughly documented."
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Author Response to Reviewer 2:
                </label>
                <textarea
                  rows={2}
                  value={authorResponse2}
                  onChange={(e) => setAuthorResponse2(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-900 focus:outline-none focus:border-cyan-600 bg-white"
                />
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase">
                  Version 1 (Original Submitted)
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">July 02, 2026</span>
              </div>
              <div className="text-xs text-slate-600 space-y-3 leading-relaxed font-mono bg-slate-50 p-4 rounded-lg">
                <p><strong>Section 3.2: Automated Pipetting Array</strong></p>
                <p className="line-through text-rose-700 bg-rose-50 p-1 rounded">
                  "Liquid handlers ran continuously across 72 hours under default laboratory atmospheric settings."
                </p>
                <p>
                  "Liquid handlers were actuated via serial RS-232 telemetry using standard protocols."
                </p>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-cyan-800 uppercase">
                  Version 2 (Revised Candidate)
                </h4>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Current Draft
                </span>
              </div>
              <div className="text-xs text-slate-700 space-y-3 leading-relaxed font-mono bg-slate-50 p-4 rounded-lg">
                <p><strong>Section 3.2: Automated Pipetting Array</strong></p>
                <p className="text-emerald-800 bg-emerald-50 p-1 rounded">
                  "Liquid handlers ran continuously across 72 hours with gravimetric calibration monitored at 6-hour intervals (mean drift σ = 0.08 μL, Table 2)."
                </p>
                <p>
                  "Liquid handlers were actuated via serial RS-232 telemetry using verified closed-loop validation."
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
