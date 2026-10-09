"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchService } from "@/services";
import { Article, Journal, Conference } from "@/types";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Quote,
  Eye,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") || "";
  const initialMode = (searchParams?.get("mode") as any) || "all";

  const [query, setQuery] = useState(initialQ);
  const [searchMode, setSearchMode] = useState<"all" | "semantic" | "ai" | "keywords">(initialMode);
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");

  const [articles, setArticles] = useState<Article[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [aiInterpretation, setAiInterpretation] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    executeSearch();
  }, [openAccessOnly, selectedSubject, searchMode]);

  const executeSearch = async (overrideQ?: string) => {
    const activeQ = overrideQ !== undefined ? overrideQ : query;
    setLoading(true);
    const result = await searchService.search({
      query: activeQ,
      mode: searchMode,
      openAccessOnly,
      subject: selectedSubject !== "All" ? selectedSubject : undefined,
    });
    setArticles(result.articles);
    setJournals(result.journals);
    setConferences(result.conferences);
    setAiInterpretation(result.aiInterpretation);
    setLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Search Header and Bar */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Research Discovery Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Search peer-reviewed papers, academic journals, topics, and authors across the global corpus.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 'Find recent research on transformer models for medical imaging'..."
                className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-300 rounded-xl text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 shadow-subtle"
              />
              <Button type="submit" variant="teal" size="sm" className="absolute right-2.5 shadow-sm">
                Search
              </Button>
            </div>

            {/* Mode Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                {[
                  { id: "all", label: "Unified Discovery" },
                  { id: "semantic", label: "Semantic Search" },
                  { id: "ai", label: "AI Guided", icon: Sparkles },
                  { id: "keywords", label: "Exact Keywords" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSearchMode(tab.id as any)}
                    className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                      searchMode === tab.id
                        ? "bg-white text-navy-950 shadow-sm"
                        : "text-slate-600 hover:text-navy-950"
                    }`}
                  >
                    {tab.icon && <tab.icon className="w-3 h-3 text-cyan-600" />}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Advanced Filter toggles */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                >
                  <option value="All">All Disciplines</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Biomedical Engineering">Biomedical Engineering</option>
                  <option value="Quantum Computing">Quantum Computing</option>
                </select>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={openAccessOnly}
                    onChange={(e) => setOpenAccessOnly(e.target.checked)}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Open Access</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* AI Query Interpretation Banner */}
        {aiInterpretation && (
          <div className="mb-8 p-4 bg-cyan-50/80 border border-cyan-200 rounded-xl text-xs text-cyan-950 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-cyan-900 uppercase tracking-wider text-[10px] block mb-0.5">
                AI Semantic Disambiguation
              </span>
              {aiInterpretation}
            </div>
          </div>
        )}

        {/* Results Body */}
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Column: Articles (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Relevant Articles ({articles.length})
                </h3>
                <span className="text-xs text-slate-400">Sorted by semantic relevance</span>
              </div>

              {articles.length === 0 ? (
                <EmptyState
                  title="No matching research found"
                  description="Try adjusting your search query or removing subject filters."
                  actionText="Reset Search"
                  onAction={() => {
                    setQuery("");
                    executeSearch("");
                  }}
                />
              ) : (
                articles.map((article) => (
                  <Card key={article.id} hover className="p-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                        {article.journalName}
                      </span>
                      <Badge variant="navy" size="sm">
                        {article.articleType}
                      </Badge>
                      {article.isOpenAccess && (
                        <Badge variant="green" size="sm">
                          Open Access
                        </Badge>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {article.publishedAt}
                      </span>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="text-base font-bold text-navy-900 hover:text-cyan-700 transition-colors leading-snug">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 font-medium">
                      {article.authors.map((a) => a.name).join(", ")}
                    </p>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {article.abstract}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Quote className="w-3 h-3 text-slate-400" />
                          {article.metrics.citations} citations
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          {article.metrics.views.toLocaleString()} views
                        </span>
                      </div>

                      <Link href={`/articles/${article.slug}`}>
                        <span className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-0.5">
                          Read Article â†’
                        </span>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Right Column: Matched Journals & Conferences (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Matched Journals */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3">
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Matched Journals ({journals.length})
                </h4>
                <div className="space-y-3">
                  {journals.map((j) => (
                    <div key={j.id} className="pt-2 border-t border-slate-100 first:border-0 first:pt-0">
                      <Link href={`/journals/${j.slug}`}>
                        <p className="text-xs font-bold text-navy-900 hover:text-cyan-700 leading-snug">
                          {j.title}
                        </p>
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Impact Factor: <strong>{j.metrics.impactFactor}</strong> • {j.subject}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Conferences */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3">
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Conferences ({conferences.length})
                </h4>
                <div className="space-y-3">
                  {conferences.map((c) => (
                    <div key={c.id} className="pt-2 border-t border-slate-100 first:border-0 first:pt-0">
                      <Link href={`/conferences/${c.slug}`}>
                        <p className="text-xs font-bold text-navy-900 hover:text-cyan-700 leading-snug">
                          {c.acronym} — {c.title}
                        </p>
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {c.dateRange} • {c.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
          Loading Search Engine...
        </div>
      }
    >
      <SearchContent />
    </React.Suspense>
  );
}

