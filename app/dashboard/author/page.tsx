"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ManuscriptTimeline } from "@/components/ManuscriptTimeline";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { manuscriptService, authService } from "@/services";
import { Manuscript, User } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Quote,
  Send,
  History,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function AuthorDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([authService.getCurrentUser(), manuscriptService.getAll()]).then(
      ([user, msList]) => {
        setCurrentUser(user);
        setManuscripts(msList);
        setLoading(false);
      }
    );
  }, []);

  const underReviewManuscript =
    manuscripts.find((m) => m.status === "Under Review") || manuscripts[1];
  const revisionManuscript =
    manuscripts.find((m) => m.status === "Revision") || manuscripts[2];

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                Author Workspace
              </span>
              <Badge variant="teal" size="sm">
                ORCID: {currentUser?.orcid || "0000-0002-1825-0097"}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
              Welcome back, {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {currentUser?.institution} • h-index: {currentUser?.hIndex || 34}
            </p>
          </div>

          <Link href="/submit">
            <Button variant="teal" size="md" className="shadow-sm">
              <Send className="w-4 h-4 mr-1.5" />
              Submit New Manuscript
            </Button>
          </Link>
        </div>

        {/* Author Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Submissions", value: "3", icon: FileText, change: "1 In Peer Review" },
            { label: "Revision Actions", value: "1", icon: History, change: "Requires Response", highlight: true },
            { label: "Total Citations", value: "4,210", icon: Quote, change: "+148 this month" },
            { label: "Lifetime Views", value: "84.2k", icon: Eye, change: "+12.4% vs 2025" },
          ].map((stat, idx) => (
            <Card key={idx} className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.highlight ? "text-amber-600" : "text-cyan-600"}`} />
              </div>
              <p className="text-2xl font-extrabold text-navy-950 tracking-tight mt-2">
                {stat.value}
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${stat.highlight ? "text-amber-700" : "text-emerald-600"}`}>
                {stat.change}
              </p>
            </Card>
          ))}
        </div>

        {/* PRIMARY DIFFERENTIATOR: MANUSCRIPT TIMELINE VISUALIZER */}
        {underReviewManuscript && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono text-cyan-700 uppercase tracking-wider">
                  Active Tracking • {underReviewManuscript.code}
                </span>
                <h3 className="text-base font-bold text-navy-950">
                  {underReviewManuscript.title}
                </h3>
              </div>
              <Link href={`/dashboard/author/manuscripts/${underReviewManuscript.id}`}>
                <Button variant="outline" size="sm">
                  View Dossier
                </Button>
              </Link>
            </div>

            {/* Manuscript Timeline Component */}
            <ManuscriptTimeline
              currentStatus={underReviewManuscript.status}
              timeline={underReviewManuscript.timeline}
            />
          </div>
        )}

        {/* Revision Alert Card if any revision is active */}
        {revisionManuscript && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                  Action Required: Revision Requested
                </span>
                <h4 className="text-sm font-bold text-amber-950 mt-0.5">
                  {revisionManuscript.title}
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  The Associate Editor has returned minor reviewer comments for your response.
                </p>
              </div>
            </div>
            <Link href={`/dashboard/author/revisions/${revisionManuscript.id}`}>
              <Button variant="secondary" size="sm" className="bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300">
                <History className="w-3.5 h-3.5 mr-1" />
                Open Revision Center
              </Button>
            </Link>
          </div>
        )}

        {/* Manuscripts Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              My Research Submissions
            </h3>
            <Link href="/dashboard/author/manuscripts" className="text-xs font-semibold text-cyan-700 hover:underline">
              View All ({manuscripts.length}) â†’
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton rows={3} />
          ) : (
            <div className="space-y-3">
              {manuscripts.map((ms) => (
                <div
                  key={ms.id}
                  className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {ms.code}
                      </span>
                      <StatusBadge status={ms.status} />
                      <span className="text-[11px] text-slate-400">
                        v{ms.version} • {ms.journalName.split(" ")[1]}
                      </span>
                    </div>

                    <Link href={`/dashboard/author/manuscripts/${ms.id}`}>
                      <h4 className="text-sm font-bold text-navy-950 hover:text-cyan-700 transition-colors">
                        {ms.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-slate-500">
                      Submitted on {ms.submittedAt} • Updated {ms.updatedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ms.status === "Revision" ? (
                      <Link href={`/dashboard/author/revisions/${ms.id}`}>
                        <Button variant="teal" size="sm">
                          Submit Revision
                        </Button>
                      </Link>
                    ) : ms.status === "Published" ? (
                      <Link href={`/articles/multimodal-latent-diffusion-pathology`}>
                        <Button variant="outline" size="sm">
                          Read Published
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/dashboard/author/manuscripts/${ms.id}`}>
                        <Button variant="outline" size="sm">
                          Track Progress
                        </Button>
                      </Link>
                    )}
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

