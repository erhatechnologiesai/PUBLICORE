"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { aiService } from "@/services";
import { ResearchGap } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Compass,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Search,
  ExternalLink,
  Split,
  ChevronRight,
} from "lucide-react";

export default function ResearchGapsPage() {
  const [gaps, setGaps] = useState<ResearchGap[]>([]);
  const [selectedGap, setSelectedGap] = useState<ResearchGap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiService.getResearchGaps().then((data) => {
      setGaps(data);
      if (data.length > 0) setSelectedGap(data[0]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Banner with Mandatory Researcher Validation Disclaimer */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-900 tracking-tight">
              Scholarly Notice: AI Research Gap Intelligence
            </h4>
            <p className="text-amber-800 mt-0.5 leading-relaxed">
              PUBLICORE synthesizes literature contradictions and under-researched areas as{" "}
              <strong>potential research gaps</strong>. These insights are predictive suggestions
              derived from bibliometric vector analysis and strictly require human researcher empirical validation.
            </p>
          </div>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="teal" size="sm" className="mb-2">
              <Sparkles className="w-3 h-3 text-cyan-600 mr-1" />
              Autonomous Literature Synthesis
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
              Potential Research Gaps & Frontiers
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Cross-study contradiction mapping, methodology bottlenecks, and unaddressed scientific questions.
            </p>
          </div>

          <Link href="/ai/trends">
            <Button variant="outline" size="sm">
              Explore Research Trends â†’
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: List of Identified Potential Gaps */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">
                Identified Potential Research Gaps ({gaps.length})
              </h3>
              {gaps.map((gap) => (
                <div
                  key={gap.id}
                  onClick={() => setSelectedGap(gap)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedGap?.id === gap.id
                      ? "bg-white border-cyan-500 shadow-md ring-1 ring-cyan-500/20"
                      : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded truncate">
                      {gap.field}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      {gap.suggestedByAIConfidence}% AI Confidence
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-navy-950 leading-snug">
                    {gap.gapTitle}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {gap.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Full Detailed Intelligence Synthesis */}
            {selectedGap && (
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
                {/* Header */}
                <div className="pb-6 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="teal" size="sm">
                      {selectedGap.field}
                    </Badge>
                    <Badge variant="navy" size="sm">
                      Topic: {selectedGap.topic}
                    </Badge>
                    <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Confidence: {selectedGap.suggestedByAIConfidence}%
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
                    Potential Gap: {selectedGap.gapTitle}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {selectedGap.description}
                  </p>
                </div>

                {/* Section 1: Current Literature & Major Findings */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5 text-cyan-800">
                    <BookOpen className="w-4 h-4" />
                    Current Literature Synthesis
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                    {selectedGap.currentLiteratureSummary}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Major Peer-Reviewed Findings:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                      {selectedGap.majorFindings.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section 2: Methodologies & Limitations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                      Common Methodologies
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {selectedGap.commonMethodologies.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-cyan-600 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 space-y-2">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Known Methodological Limitations
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {selectedGap.knownLimitations.map((l, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section 3: Published Contradictions */}
                {selectedGap.contradictions.length > 0 && (
                  <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/30 space-y-2">
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Split className="w-3.5 h-3.5 text-rose-600" />
                      Identified Literature Contradictions
                    </h4>
                    {selectedGap.contradictions.map((c, idx) => (
                      <p key={idx} className="text-xs text-slate-700 leading-relaxed">
                        {c}
                      </p>
                    ))}
                  </div>
                )}

                {/* Section 4: Potential Research Directions */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    Recommended Potential Research Directions
                  </h3>
                  <div className="space-y-2">
                    {selectedGap.potentialResearchDirections.map((dir, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl text-xs text-slate-800 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{dir}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporting Papers */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Supporting Literature:</span>
                    {selectedGap.supportingPapers.map((sp) => (
                      <Link
                        key={sp.id}
                        href="/articles/multimodal-latent-diffusion-pathology"
                        className="text-cyan-700 hover:underline font-mono text-[11px]"
                      >
                        [{sp.doi}]
                      </Link>
                    ))}
                  </div>

                  <Link href={`/ai/assistant?gap=${selectedGap.id}`}>
                    <Button variant="teal" size="sm">
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Explore in AI Workspace
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

