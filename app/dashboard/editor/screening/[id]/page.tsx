"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { manuscriptService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  ArrowRight,
  ArrowLeft,
  XCircle,
} from "lucide-react";

export default function ManuscriptScreeningPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "ms-002";

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    manuscriptService.getById(id).then((ms) => {
      setManuscript(ms || null);
      setLoading(false);
    });
  }, [id]);

  const handleApproveScreening = async () => {
    await manuscriptService.screenManuscript(id, "pass");
    alert("AI Screening Approved by Editor! Proceeding to Reviewer Assignment.");
    router.push(`/dashboard/editor/assign-reviewers/${id}`);
  };

  const handleDeskReject = async () => {
    await manuscriptService.screenManuscript(id, "reject");
    alert("Editorial Rejection Issued: Scope mismatch or formatting defects.");
    router.push("/dashboard/editor");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSkeleton rows={4} />
      </DashboardLayout>
    );
  }

  const screening = manuscript?.aiScreening || {
    scopeMatch: 95,
    completeness: 98,
    researchArea: "Edge AI & Neuromorphic Architecture",
    secondaryAreas: ["Embedded Systems", "Acoustic Ecology"],
    noveltyScore: 92,
    methodologyRigor: 94,
    plagiarismSimilarity: 4.2,
    potentialIssues: [
      "Hardware benchmark conducted on single silicon revision (Loihi 2); verify thermal drift variance.",
    ],
    keyHighlights: [
      "Complete empirical energy benchmarks provided",
      "Novel spike-rate loss formulation mathematically proven",
      "Open-source dataset of 80,000 avian audio clips",
    ],
    suggestedKeywords: ["Neuromorphic Audio", "Spiking Transformers", "Ultra-Low Power"],
  };

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
              <StatusBadge status={manuscript?.status || "Screening"} />
              <Badge variant="teal" size="sm">
                AI Screening Diagnostic
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-950 mt-1">
              {manuscript?.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Journal: {manuscript?.journalName} • Author: {manuscript?.authors[0]?.name}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeskReject}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Desk Reject
            </Button>
            <Button variant="teal" size="sm" onClick={handleApproveScreening}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Approve & Assign Reviewers
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Journal Scope Match</span>
            <p className="text-2xl font-extrabold text-cyan-800 mt-1">{screening.scopeMatch}%</p>
            <p className="text-[10px] text-emerald-600 font-medium">Strong Alignment</p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Structural Completeness</span>
            <p className="text-2xl font-extrabold text-cyan-800 mt-1">{screening.completeness}%</p>
            <p className="text-[10px] text-emerald-600 font-medium">All Sections Valid</p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Methodology Rigor</span>
            <p className="text-2xl font-extrabold text-indigo-700 mt-1">{screening.methodologyRigor}%</p>
            <p className="text-[10px] text-emerald-600 font-medium">High Standard</p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Similarity Index</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{screening.plagiarismSimilarity}%</p>
            <p className="text-[10px] text-emerald-600 font-medium">Clear Plagiarism Check</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              AI Detected Manuscript Highlights
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {screening.keyHighlights.map((hl, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Potential Items for Reviewer Attention
            </h3>
            {screening.potentialIssues.length === 0 ? (
              <p className="text-xs text-slate-500">No red flags identified by AI intake agent.</p>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {screening.potentialIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card className="p-6 space-y-3">
          <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
            Submitted Manuscript Abstract
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {manuscript?.abstract}
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
