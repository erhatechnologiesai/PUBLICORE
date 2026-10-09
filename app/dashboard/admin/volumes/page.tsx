"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Layers, Calendar, ExternalLink } from "lucide-react";

export default function VolumeManagementPage() {
  const volumes = [
    { journal: "Publicore Transactions on Artificial Intelligence", volume: "Vol. 12", issue: "Issue 4 (October 2026)", articlesCount: 24, status: "Current Issue" },
    { journal: "Publicore Transactions on Artificial Intelligence", volume: "Vol. 12", issue: "Issue 3 (July 2026)", articlesCount: 28, status: "Archived" },
    { journal: "Publicore Journal of Bioengineering & Medicine", volume: "Vol. 9", issue: "Issue 8 (September 2026)", articlesCount: 19, status: "Current Issue" },
    { journal: "Publicore Quantum Systems & Computing", volume: "Vol. 6", issue: "Issue 3 (September 2026)", articlesCount: 16, status: "Current Issue" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Volume & Issue Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Compile published manuscripts into numbered quarterly issues and archival volumes.
            </p>
          </div>
          <Button variant="teal" size="sm" onClick={() => alert("Simulated: Open Issue Assembly Tool.")}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Create New Issue
          </Button>
        </div>

        <div className="space-y-3">
          {volumes.map((v, i) => (
            <Card key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={v.status === "Current Issue" ? "teal" : "gray"} size="sm">
                    {v.status}
                  </Badge>
                  <span className="text-xs font-bold text-navy-950">{v.volume}, {v.issue}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{v.journal}</p>
                <p className="text-[11px] text-slate-400">{v.articlesCount} Peer-Reviewed Articles Indexed</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => alert(`Browse articles in ${v.issue}`)}>
                  Browse Issue
                </Button>
                <Button variant="secondary" size="sm" onClick={() => alert(`Export Crossref deposit XML for ${v.issue}`)}>
                  Export Deposit XML
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

