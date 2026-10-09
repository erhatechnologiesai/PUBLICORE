"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { reviewService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ShieldCheck, Clock, CheckCircle2, AlertTriangle, FileText, ChevronRight } from "lucide-react";

export default function ReviewerDashboardPage() {
  const [reviews, setReviews] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewService.getAssignedReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        <div>
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
            Peer Review Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
            Reviewer Hub & Assigned Dossiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Conduct rigorous double-blind scientific evaluations augmented by AI consistency checks.
          </p>
        </div>

        {/* 4 Cards: Pending Invitations, Active Reviews, Completed Reviews, Upcoming Deadlines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pending Invitations", value: "1", icon: Clock, note: "Response needed in 48h", highlight: true },
            { label: "Active Reviews", value: "2", icon: FileText, note: "1 due next week" },
            { label: "Completed Reviews", value: "14", icon: CheckCircle2, note: "Lifetime evaluations" },
            { label: "Reviewer Score", value: "98.4%", icon: ShieldCheck, note: "On-time turnaround" },
          ].map((c, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{c.label}</span>
                <c.icon className={`w-4 h-4 ${c.highlight ? "text-amber-600" : "text-cyan-600"}`} />
              </div>
              <p className="text-2xl font-extrabold text-navy-950 tracking-tight mt-2">{c.value}</p>
              <p className={`text-[11px] font-semibold mt-1 ${c.highlight ? "text-amber-700" : "text-slate-500"}`}>
                {c.note}
              </p>
            </Card>
          ))}
        </div>

        {/* Active Reviews Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Assigned Peer-Review Queue ({reviews.length})
            </h3>
            <span className="text-xs text-slate-400">Double-Blind Protected</span>
          </div>

          {loading ? (
            <LoadingSkeleton rows={2} />
          ) : (
            <div className="space-y-3">
              {reviews.map((ms) => (
                <div
                  key={ms.id}
                  className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{ms.code}</span>
                      <StatusBadge status={ms.status} />
                      <span className="text-[11px] text-cyan-800 font-medium">
                        Due: October 22, 2026
                      </span>
                    </div>

                    <Link href={`/dashboard/reviewer/workspace/${ms.id}`}>
                      <h4 className="text-sm font-bold text-navy-950 hover:text-cyan-700 transition-colors">
                        {ms.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {ms.abstract}
                    </p>
                  </div>

                  <Link href={`/dashboard/reviewer/workspace/${ms.id}`}>
                    <Button variant="teal" size="sm">
                      Open Review Workspace <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

