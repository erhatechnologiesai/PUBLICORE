"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { manuscriptService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText, Send, ChevronRight, Search } from "lucide-react";

export default function MyManuscriptsPage() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    manuscriptService.getAll().then((data) => {
      setManuscripts(data);
      setLoading(false);
    });
  }, []);

  const filtered = manuscripts.filter((m) => {
    if (filter === "all") return true;
    if (filter === "active") return m.status !== "Published" && m.status !== "Rejected";
    if (filter === "published") return m.status === "Published";
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">My Research Manuscripts</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive registry of your active, under-review, and published scholarly papers.
            </p>
          </div>
          <Link href="/submit">
            <Button variant="teal" size="sm">
              <Send className="w-3.5 h-3.5 mr-1" />
              New Submission
            </Button>
          </Link>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {["all", "active", "published"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === f
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {f} ({f === "all" ? manuscripts.length : f === "active" ? 3 : 1})
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No Manuscripts" description="You have no manuscripts in this view." />
        ) : (
          <div className="space-y-3">
            {filtered.map((ms) => (
              <Card key={ms.id} hover className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{ms.code}</span>
                    <StatusBadge status={ms.status} />
                    <span className="text-xs text-slate-400 font-medium">{ms.articleType}</span>
                  </div>
                  <Link href={`/dashboard/author/manuscripts/${ms.id}`}>
                    <h3 className="text-base font-bold text-navy-950 hover:text-cyan-700 transition-colors">
                      {ms.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500">
                    Journal: {ms.journalName} • Submitted {ms.submittedAt}
                  </p>
                </div>
                <Link href={`/dashboard/author/manuscripts/${ms.id}`}>
                  <Button variant="outline" size="sm">
                    View Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

