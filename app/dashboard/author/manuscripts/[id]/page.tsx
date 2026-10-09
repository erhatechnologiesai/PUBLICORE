"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ManuscriptTimeline } from "@/components/ManuscriptTimeline";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { manuscriptService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Download, FileText, Sparkles, UserCheck, History, ArrowLeft } from "lucide-react";

export default function ManuscriptDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "ms-002";
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    manuscriptService.getById(id).then((ms) => {
      setManuscript(ms || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSkeleton rows={4} />
      </DashboardLayout>
    );
  }

  if (!manuscript) {
    return (
      <DashboardLayout>
        <p className="text-sm text-slate-500">Manuscript not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-5xl">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard/author/manuscripts" className="hover:text-navy-950 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Manuscripts
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-500">{manuscript.code}</span>
              <StatusBadge status={manuscript.status} />
              <Badge variant="teal" size="sm">v{manuscript.version}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-navy-950 mt-1">{manuscript.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Journal: {manuscript.journalName} • Submitted {manuscript.submittedAt}
            </p>
          </div>

          {manuscript.status === "Revision" && (
            <Link href={`/dashboard/author/revisions/${manuscript.id}`}>
              <Button variant="teal" size="sm">Open Revision Center</Button>
            </Link>
          )}
        </div>

        {/* 10-Step Timeline */}
        <ManuscriptTimeline currentStatus={manuscript.status} timeline={manuscript.timeline} />

        {/* AI Screening Highlights */}
        {manuscript.aiScreening && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5 text-cyan-800">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                AI Pre-Screening Summary
              </h3>
              <Badge variant="green" size="sm">Passed Screening</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Scope Match</p>
                <p className="text-xl font-bold text-cyan-800 mt-1">{manuscript.aiScreening.scopeMatch}%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Completeness</p>
                <p className="text-xl font-bold text-cyan-800 mt-1">{manuscript.aiScreening.completeness}%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Novelty Rigor</p>
                <p className="text-xl font-bold text-emerald-700 mt-1">{manuscript.aiScreening.noveltyScore}%</p>
              </div>
            </div>
          </Card>
        )}

        {/* Abstract and Details */}
        <Card className="p-6 space-y-4 text-xs">
          <h3 className="font-bold text-navy-950 uppercase tracking-wider text-xs">Abstract</h3>
          <p className="text-slate-600 leading-relaxed">{manuscript.abstract}</p>

          <div className="pt-2 flex flex-wrap gap-1.5">
            {manuscript.keywords.map((kw, i) => (
              <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                {kw}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
