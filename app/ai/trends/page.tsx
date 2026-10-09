"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { aiService } from "@/services";
import { ResearchTrend } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  TrendingUp,
  Sparkles,
  BarChart3,
  Building2,
  Tag,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

export default function ResearchTrendsPage() {
  const [trends, setTrends] = useState<ResearchTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiService.getResearchTrends().then((data) => {
      setTrends(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="teal" size="sm" className="mb-2">
              <TrendingUp className="w-3 h-3 text-cyan-600 mr-1" />
              Bibliometric Forecasting
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
              Global Research Trends & Trajectories
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Multi-year publication velocity, emerging interdisciplinary frontiers, and institutional epicenters.
            </p>
          </div>

          <Link href="/ai/gaps">
            <Button variant="outline" size="sm">
              View Potential Research Gaps â†’
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <div className="space-y-6">
            {trends.map((trend, idx) => (
              <Card key={idx} hover className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                        {trend.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +{trend.growthRate}% 5-Yr Velocity
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-navy-950 tracking-tight mt-1">
                      {trend.topic}
                    </h3>
                  </div>

                  <Link href={`/search?q=${encodeURIComponent(trend.topic)}`}>
                    <Button variant="teal" size="sm">
                      Explore Publications
                    </Button>
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {trend.description}
                </p>

                {/* 5-Year Publication Histogram Visualization */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    5-Year Annual Publication Volume
                  </p>
                  <div className="grid grid-cols-5 gap-3 items-end h-32 pt-4">
                    {trend.fiveYearPublicationVolume.map((vol, vIdx) => {
                      const max = Math.max(...trend.fiveYearPublicationVolume);
                      const heightPercent = Math.round((vol / max) * 100);
                      return (
                        <div key={vIdx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                            {vol.toLocaleString()}
                          </span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full max-w-[48px] bg-gradient-to-t from-cyan-700 to-cyan-500 rounded-t-md transition-all hover:opacity-90"
                          />
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {trend.years[vIdx]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer metadata: Keywords & Top Institutions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Tag className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {trend.keyKeywords.map((kw, kIdx) => (
                        <span key={kIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1.5 text-slate-600 text-[11px]">
                      <span className="font-semibold text-slate-400">Leading Research Centers:</span>
                      {trend.topInstitutions.join(", ")}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

