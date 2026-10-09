"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_JOURNALS } from "@/mock/data";
import { Plus, BookOpen, ExternalLink, Settings } from "lucide-react";

export default function JournalManagementPage() {
  const [journals, setJournals] = useState(MOCK_JOURNALS);

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Journal Registry</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure peer-reviewed academic journals, aims and scopes, and indexing parameters.
            </p>
          </div>
          <Button variant="teal" size="sm" onClick={() => alert("Simulated: Launch New Journal Wizard.")}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Register New Journal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {journals.map((j) => (
            <Card key={j.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  ISSN {j.issn}
                </span>
                <Badge variant="teal" size="sm">Active</Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-navy-950">{j.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{j.subject}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400">Impact Factor</p>
                  <p className="font-bold text-navy-950 mt-0.5">{j.metrics.impactFactor}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400">Articles</p>
                  <p className="font-bold text-navy-950 mt-0.5">{j.totalArticles}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400">Acceptance Rate</p>
                  <p className="font-bold text-navy-950 mt-0.5">{j.metrics.acceptanceRate}%</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">Editor-in-Chief: <strong>{j.chiefEditor.name}</strong></span>
                <Button variant="outline" size="sm" onClick={() => alert(`Edit journal settings for ${j.title}`)}>
                  <Settings className="w-3.5 h-3.5 mr-1" /> Settings
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

