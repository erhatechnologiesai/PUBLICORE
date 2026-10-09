"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { metricsService } from "@/services";
import { BarChart3, TrendingUp, Globe, Download, Quote, Users } from "lucide-react";

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    metricsService.getGlobalMetrics().then(setMetrics);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Platform Scholarly Metrics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry on article views, field citations, international distribution, and turnaround times.
          </p>
        </div>

        {/* 6 Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <span className="text-xs text-slate-500">Total Indexed Articles</span>
            <p className="text-3xl font-extrabold text-navy-950 mt-1">{metrics?.publishedArticles?.toLocaleString() || "148,200"}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">+1,420 this month</p>
          </Card>
          <Card className="p-5">
            <span className="text-xs text-slate-500">Global Citations</span>
            <p className="text-3xl font-extrabold text-navy-950 mt-1">{metrics?.totalCitations?.toLocaleString() || "1,984,200"}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Field citation ratio: 3.8x</p>
          </Card>
          <Card className="p-5">
            <span className="text-xs text-slate-500">Annual Downloads</span>
            <p className="text-3xl font-extrabold text-navy-950 mt-1">{metrics?.annualDownloads?.toLocaleString() || "5,410,000"}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">98.2% via CDN</p>
          </Card>
          <Card className="p-5">
            <span className="text-xs text-slate-500">Average Turnaround</span>
            <p className="text-3xl font-extrabold text-navy-950 mt-1">{metrics?.averageReviewTurnaroundDays || "24.6"} Days</p>
            <p className="text-[11px] text-cyan-700 mt-0.5 font-medium">From submission to verdict</p>
          </Card>
          <Card className="p-5">
            <span className="text-xs text-slate-500">Open Access Ratio</span>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">{metrics?.openAccessPercentage || "86.4"}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">CC-BY 4.0 compliant</p>
          </Card>
          <Card className="p-5">
            <span className="text-xs text-slate-500">Participating Countries</span>
            <p className="text-3xl font-extrabold text-navy-950 mt-1">{metrics?.participatingCountries || "114"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Global research consortium</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

