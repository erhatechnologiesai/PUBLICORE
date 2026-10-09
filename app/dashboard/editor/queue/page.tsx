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
import { Sparkles, Users, CheckCircle2, ChevronRight, Search } from "lucide-react";

export default function EditorialFullQueuePage() {
  const [queue, setQueue] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    editorService.getEditorialQueue().then((data) => {
      setQueue(data);
      setLoading(false);
    });
  }, []);

  const filtered = queue.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.authors.some((a) => a.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Full Submissions Queue</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive registry of all submitted, screened, reviewed, and completed dossiers.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, title, or author..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} Dossiers</span>
        </div>

        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <div className="space-y-3">
            {filtered.map((ms) => (
              <Card key={ms.id} hover className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{ms.code}</span>
                    <StatusBadge status={ms.status} />
                    <span className="text-xs text-slate-400 font-medium">{ms.journalName.split(" ")[1]}</span>
                  </div>

                  <Link href={`/dashboard/editor/screening/${ms.id}`}>
                    <h3 className="text-base font-bold text-navy-950 hover:text-cyan-700 transition-colors">
                      {ms.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500">
                    Lead: {ms.authors[0]?.name} • Submitted {ms.submittedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/editor/screening/${ms.id}`}>
                    <Button variant="outline" size="sm">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                      Screen
                    </Button>
                  </Link>
                  <Link href={`/dashboard/editor/assign-reviewers/${ms.id}`}>
                    <Button variant="outline" size="sm">
                      <Users className="w-3.5 h-3.5 mr-1" />
                      Match
                    </Button>
                  </Link>
                  <Link href={`/dashboard/editor/decision/${ms.id}`}>
                    <Button variant="teal" size="sm">
                      Decision
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

