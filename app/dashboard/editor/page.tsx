"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { editorService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Inbox,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  History,
  FileCheck2,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function EditorDashboardPage() {
  const [queue, setQueue] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<string>("All");

  useEffect(() => {
    editorService.getEditorialQueue().then((data) => {
      setQueue(data);
      setLoading(false);
    });
  }, []);

  const STAGES = [
    "All",
    "New Submissions",
    "Screening",
    "Under Review",
    "Revision",
    "Accepted",
    "Published",
  ];

  const filteredQueue = queue.filter((m) => {
    if (activeStage === "All") return true;
    if (activeStage === "New Submissions") return m.status === "Submitted";
    if (activeStage === "Screening") return m.status === "Screening";
    if (activeStage === "Under Review") return m.status === "Under Review";
    if (activeStage === "Revision") return m.status === "Revision";
    if (activeStage === "Accepted") return m.status === "Accepted";
    if (activeStage === "Published") return m.status === "Published";
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
            Editorial Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
            Editor-in-Chief & Associate Editorial Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Oversee manuscript intake, AI screening diagnostics, double-blind peer matching, and final publication decisions.
          </p>
        </div>

        {/* Editorial Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "New Submissions", value: "4", note: "Require Initial Screening" },
            { label: "Under Active Review", value: "1", note: "2/3 reviews completed" },
            { label: "Decisions Pending", value: "2", note: "Consensus reached" },
            { label: "Avg Turnaround", value: "21 Days", note: "Target: < 28 days" },
          ].map((item, idx) => (
            <Card key={idx} className="p-5">
              <span className="text-xs font-medium text-slate-500">{item.label}</span>
              <p className="text-2xl font-extrabold text-navy-950 mt-1">{item.value}</p>
              <p className="text-[11px] text-cyan-700 font-semibold mt-0.5">{item.note}</p>
            </Card>
          ))}
        </div>

        {/* Workflow Stages Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {STAGES.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStage(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeStage === st
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Editorial Queue Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Editorial Dossiers ({filteredQueue.length})
            </h3>
            <span className="text-xs text-slate-400">Strict Human Decision-Making</span>
          </div>

          {loading ? (
            <LoadingSkeleton rows={4} />
          ) : (
            <div className="space-y-3">
              {filteredQueue.map((ms) => (
                <div
                  key={ms.id}
                  className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {ms.code}
                      </span>
                      <StatusBadge status={ms.status} />
                      <span className="text-[11px] text-cyan-800 font-medium bg-cyan-50 px-2 py-0.5 rounded">
                        {ms.journalName.split(" ")[1]}
                      </span>
                      {ms.aiScreening && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Screening {ms.aiScreening.scopeMatch}% Match
                        </span>
                      )}
                    </div>

                    <Link href={`/dashboard/editor/screening/${ms.id}`}>
                      <h4 className="text-base font-bold text-navy-950 hover:text-cyan-700 transition-colors">
                        {ms.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-slate-500">
                      Author: {ms.authors[0]?.name} ({ms.authors[0]?.institution}) • Submitted {ms.submittedAt}
                    </p>
                  </div>

                  {/* Editorial Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Link href={`/dashboard/editor/screening/${ms.id}`}>
                      <Button variant="outline" size="sm">
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                        AI Screening
                      </Button>
                    </Link>

                    <Link href={`/dashboard/editor/assign-reviewers/${ms.id}`}>
                      <Button variant="outline" size="sm">
                        <Users className="w-3.5 h-3.5 mr-1" />
                        Match Reviewers
                      </Button>
                    </Link>

                    <Link href={`/dashboard/editor/decision/${ms.id}`}>
                      <Button variant="teal" size="sm">
                        Decision Desk
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

