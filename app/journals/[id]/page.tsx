"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { journalService, articleService } from "@/services";
import { Journal, Article } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  BookOpen,
  Send,
  Users,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function JournalDetailPage() {
  const params = useParams();
  const slug = (params?.id as string) || "transactions-artificial-intelligence";
  const [journal, setJournal] = useState<Journal | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "articles" | "aims" | "board" | "guidelines"
  >("articles");

  useEffect(() => {
    Promise.all([
      journalService.getBySlug(slug),
      articleService.getAll(),
    ]).then(([j, arts]) => {
      setJournal(j);
      setArticles(arts);
      setLoading(false);
    });
  }, [slug]);

  if (loading || !journal) {
    return (
      <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
          <LoadingSkeleton rows={5} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Journal Banner Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  {journal.shortTitle} • ISSN {journal.issn}
                </span>
                {journal.openAccess && (
                  <Badge variant="green" size="sm">
                    Open Access CC-BY 4.0
                  </Badge>
                )}
                <Badge variant="navy" size="sm">
                  {journal.subject}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 tracking-tight">
                {journal.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {journal.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                <span>Editor-in-Chief: <strong>{journal.chiefEditor.name}</strong> ({journal.chiefEditor.institution})</span>
                <span>•</span>
                <span>Latest: <strong>{journal.latestIssue}</strong></span>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <Link href={`/submit?journal=${journal.id}`}>
                <Button variant="teal" size="lg" className="w-full shadow-sm">
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit Manuscript
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="sm" className="w-full">
                  Author Guidelines
                </Button>
              </Link>
            </div>
          </div>

          {/* Impact Metrics strip */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Impact Factor</p>
              <p className="text-2xl font-extrabold text-cyan-800 mt-0.5">{journal.metrics.impactFactor}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">CiteScore</p>
              <p className="text-2xl font-extrabold text-cyan-800 mt-0.5">{journal.metrics.citescore}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Acceptance Rate</p>
              <p className="text-2xl font-extrabold text-navy-950 mt-0.5">{journal.metrics.acceptanceRate}%</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">First Decision</p>
              <p className="text-2xl font-extrabold text-navy-950 mt-0.5">{journal.metrics.timeToFirstDecisionDays}d</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Time to Publish</p>
              <p className="text-2xl font-extrabold text-navy-950 mt-0.5">{journal.metrics.timeToPublishDays}d</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 mb-6">
          {[
            { id: "articles", label: "Latest Articles" },
            { id: "aims", label: "Aims & Scope" },
            { id: "board", label: "Editorial Board" },
            { id: "guidelines", label: "Peer Review & Guidelines" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-navy-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Articles */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">
              Recent Publications in {journal.shortTitle}
            </h3>
            {articles.map((art) => (
              <Card key={art.id} hover className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="teal" size="sm">{art.articleType}</Badge>
                    <span className="text-[11px] text-slate-400 font-mono">DOI: {art.doi}</span>
                  </div>
                  <Link href={`/articles/${art.slug}`}>
                    <h4 className="text-base font-bold text-navy-950 hover:text-cyan-700 transition-colors">
                      {art.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-600 font-medium">
                    {art.authors.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">{art.abstract}</p>
                </div>
                <Link href={`/articles/${art.slug}`}>
                  <Button variant="teal" size="sm">
                    Read Article <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: Aims & Scope */}
        {activeTab === "aims" && (
          <Card className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-navy-950">Aims & Scope</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {journal.aimsAndScope}
            </p>
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                Key Topical Areas:
              </h4>
              <div className="flex flex-wrap gap-2">
                {journal.topics.map((t, idx) => (
                  <Badge key={idx} variant="navy" size="md">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Tab 3: Editorial Board */}
        {activeTab === "board" && (
          <Card className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-navy-950">Editorial Leadership</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-700 text-white font-bold flex items-center justify-center text-sm">
                  {journal.chiefEditor.name.charAt(6)}
                </div>
                <div>
                  <Badge variant="teal" size="sm" className="mb-1">Editor-in-Chief</Badge>
                  <h4 className="text-sm font-bold text-navy-950">{journal.chiefEditor.name}</h4>
                  <p className="text-xs text-slate-500">{journal.chiefEditor.institution}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tab 4: Guidelines */}
        {activeTab === "guidelines" && (
          <Card className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-navy-950">Peer Review Model & Integrity</h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Double-Blind Evaluation:</strong> All submissions undergo initial screening for scope match, formatting completeness, and plagiarism similarity before assignment to an Associate Editor.
              </p>
              <p>
                <strong>AI Pre-Screening:</strong> AI diagnostics evaluate data reproducibility, reference validity, and methodology completeness without rendering binding decisions.
              </p>
              <p>
                <strong>Publication Ethics:</strong> Adheres strictly to the Committee on Publication Ethics (COPE) code of conduct.
              </p>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
