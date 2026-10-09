"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Settings, Shield, Sparkles, Database, Mail, Save } from "lucide-react";

export default function SystemSettingsPage() {
  const [similarityThreshold, setSimilarityThreshold] = useState("15");
  const [minReviews, setMinReviews] = useState("2");
  const [doiPrefix, setDoiPrefix] = useState("10.1042/pub");
  const [openAccessDefault, setOpenAccessDefault] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-4xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">System & Governance Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Platform-wide parameters for AI screening agents, DOI prefixes, and peer review policies.
            </p>
          </div>
          <Button variant="teal" size="sm" onClick={() => alert("Settings saved successfully!")}>
            <Save className="w-3.5 h-3.5 mr-1" /> Save Settings
          </Button>
        </div>

        {/* AI Orchestration Parameters */}
        <Card className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5 text-cyan-800">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            AI Intake & Screening Thresholds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Maximum Allowable Similarity Score (%)"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(e.target.value)}
              helperText="Manuscripts exceeding this trigger automated red-flag alert to editor"
            />
            <Input
              label="Minimum Required Reviewers Per Article"
              value={minReviews}
              onChange={(e) => setMinReviews(e.target.value)}
              helperText="Enforced before editorial decision can be confirmed"
            />
          </div>
        </Card>

        {/* Archival & Identifier Settings */}
        <Card className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5 text-navy-900">
            <Database className="w-4 h-4 text-cyan-700" />
            Digital Object Identifier (DOI) & Open Access
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Crossref Registered DOI Prefix"
              value={doiPrefix}
              onChange={(e) => setDoiPrefix(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Default Publishing License
              </label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-navy-900">
                <option>Creative Commons Attribution 4.0 International (CC-BY 4.0)</option>
                <option>Creative Commons Attribution-NonCommercial (CC-BY-NC 4.0)</option>
                <option>Public Domain Dedication (CC0 1.0)</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

