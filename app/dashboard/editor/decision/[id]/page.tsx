"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { manuscriptService, editorService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ArrowLeft,
  Send,
  AlertTriangle,
  Scale,
} from "lucide-react";

export default function EditorialDecisionPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "ms-002";

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState<
    "Accept" | "Minor Revision" | "Major Revision" | "Reject"
  >("Accept");
  const [editorDecisionNotes, setEditorDecisionNotes] = useState(
    "Based on the unanimous positive appraisal of both double-blind reviewers and verified mathematical convergence bounds, the manuscript is accepted for publication in PTAI. Author has resolved all prior formatting questions."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    manuscriptService.getById(id).then((ms) => {
      setManuscript(ms || null);
      setLoading(false);
    });
  }, [id]);

  const handleExecuteDecision = async () => {
    setIsSubmitting(true);
    await editorService.submitDecision(id, decision, editorDecisionNotes);
    setIsSubmitting(false);
    alert(`Editorial Decision [${decision}] recorded! Author and production desk notified.`);
    router.push("/dashboard/editor");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSkeleton rows={4} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-5xl">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard/editor" className="hover:text-navy-950 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editorial Queue
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {manuscript?.code || "PUB-2026-1142"}
              </span>
              <StatusBadge status={manuscript?.status || "Under Review"} />
              <Badge variant="teal" size="sm">
                Editorial Decision Desk
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-950 mt-1">
              Final Editorial Decision: {manuscript?.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Journal: {manuscript?.journalName} • Lead Author: {manuscript?.authors[0]?.name}
            </p>
          </div>

          <Button
            variant="teal"
            size="md"
            isLoading={isSubmitting}
            onClick={handleExecuteDecision}
            className="shadow-sm shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Issue Formal Decision ({decision})
          </Button>
        </div>

        <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                AI Review Consensus & Synthesis
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Consensus Level: High (94%)
            </span>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-slate-300">
            <p>
              Both independent reviewers concur that the mathematical framework is sound and reproducible.
              Reviewer 1 proposed minor hardware temperature clarifications, which were adequately resolved in the revised Section 3.2.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-cyan-400 font-bold block mb-1">
                  REVIEWER 1 (Double-Blind):
                </span>
                <p className="text-slate-200">Recommendation: <strong>Minor Revision</strong> (Scores: 4/4/5/4)</p>
              </div>
              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-cyan-400 font-bold block mb-1">
                  REVIEWER 2 (Double-Blind):
                </span>
                <p className="text-slate-200">Recommendation: <strong>Accept</strong> (Scores: 5/5/4/5)</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
            Editor Formal Verdict
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
              Select Decision
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  { id: "Accept", label: "Accept for Publication", color: "border-emerald-500 bg-emerald-50 text-emerald-950" },
                  { id: "Minor Revision", label: "Minor Revision", color: "border-amber-500 bg-amber-50 text-amber-950" },
                  { id: "Major Revision", label: "Major Revision", color: "border-amber-500 bg-amber-50 text-amber-950" },
                  { id: "Reject", label: "Reject Manuscript", color: "border-rose-500 bg-rose-50 text-rose-950" },
                ] as const
              ).map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setDecision(opt.id as any)}
                  className={`p-3.5 rounded-xl border text-xs font-bold cursor-pointer text-center transition-all ${
                    decision === opt.id
                      ? `${opt.color} ring-2 ring-cyan-500/20`
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
              Editorial Letter to Authors (Decision Justification)
            </label>
            <textarea
              rows={4}
              value={editorDecisionNotes}
              onChange={(e) => setEditorDecisionNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-900 focus:outline-none focus:border-cyan-600 bg-white"
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
