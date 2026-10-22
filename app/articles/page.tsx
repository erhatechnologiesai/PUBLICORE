"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { articleService } from "@/services";
import { Article } from "@/types";
import {
  Search,
  SlidersHorizontal,
  Quote,
  Eye,
  Download,
  BookOpen,
  ChevronRight,
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
} from "lucide-react";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState<"citations" | "views" | "newest" | "title">("citations");
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load saved bookmarks from localStorage
    try {
      const saved = localStorage.getItem("publicore_saved_articles");
      if (saved) setSavedArticleIds(JSON.parse(saved));
    } catch {
      // ignore
    }
    loadArticles();
  }, [openAccessOnly]);

  const loadArticles = async () => {
    setLoading(true);
    const data = await articleService.getAll({ openAccessOnly });
    setArticles(data);
    setLoading(false);
  };

  const toggleBookmark = (art: Article) => {
    const isSaved = savedArticleIds.includes(art.id);
    let next: string[];
    if (isSaved) {
      next = savedArticleIds.filter((id) => id !== art.id);
      setToastMessage(`Removed "${art.title.slice(0, 40)}..." from saved library.`);
    } else {
      next = [...savedArticleIds, art.id];
      setToastMessage(`Saved "${art.title.slice(0, 40)}..." to your reading list!`);
    }
    setSavedArticleIds(next);
    try {
      localStorage.setItem("publicore_saved_articles", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleCopyCitation = (art: Article) => {
    const citation = `${art.authors.map((a) => a.name).join(", ")}. (${art.publishedAt}). "${art.title}." ${art.journalName}, vol. ${art.volume || 14}, no. ${art.issue || 2}. https://doi.org/${art.doi}`;
    navigator.clipboard.writeText(citation);
    setCopiedDoi(art.doi);
    setToastMessage(`Copied formatted APA citation for DOI ${art.doi}!`);
    setTimeout(() => setCopiedDoi(null), 2500);
  };

  const handleDownloadPdf = (art: Article) => {
    const content = `PUBLICORE SCHOLARLY PUBLICATION
=====================================================
Title: ${art.title}
Authors: ${art.authors.map((a) => `${a.name} (${a.institution})`).join("; ")}
Journal: ${art.journalName} (Vol ${art.volume || 14}, Issue ${art.issue || 2})
Date of Publication: ${art.publishedAt}
Persistent DOI: https://doi.org/${art.doi}
Open Access License: Creative Commons CC-BY 4.0

ABSTRACT:
${art.abstract}

KEYWORDS:
${art.keywords.join(", ")}

SECTIONS & METHODOLOGY:
${art.sections?.map((s) => `\n## ${s.heading}\n${s.content}`).join("\n\n") || "Full research text available online via PUBLICORE Interactive Reader."}

=====================================================
Archived & Verified by PUBLICORE Repository Index`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${art.slug}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToastMessage(`Downloaded full manuscript text for ${art.title.slice(0, 35)}...`);
  };

  const filtered = articles
    .filter((a) => {
      const matchesQ =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.abstract.toLowerCase().includes(query.toLowerCase()) ||
        a.authors.some((author) => author.name.toLowerCase().includes(query.toLowerCase())) ||
        a.keywords.some((kw) => kw.toLowerCase().includes(query.toLowerCase()));
      const matchesType = selectedType === "All" || a.articleType === selectedType;
      return matchesQ && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === "citations") return b.metrics.citations - a.metrics.citations;
      if (sortOrder === "views") return b.metrics.views - a.metrics.views;
      if (sortOrder === "title") return a.title.localeCompare(b.title);
      return 0; // default order
    });

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="teal" size="sm">
              Digital Research Library
            </Badge>
            {savedArticleIds.length > 0 && (
              <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Bookmark className="w-3 h-3 fill-current" /> {savedArticleIds.length} Saved
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Peer-Reviewed Articles & Preprints
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Access original research articles, review methodologies, and benchmark datasets across foundational and computational disciplines.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title, author, keyword, or methodology..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Type selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700"
            >
              <option value="All">All Article Types</option>
              <option value="Research Article">Research Article</option>
              <option value="Review Paper">Review Paper</option>
              <option value="Methodology">Methodology</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700"
            >
              <option value="citations">Sort by: Most Cited</option>
              <option value="views">Sort by: Most Viewed</option>
              <option value="title">Sort by: Title (A-Z)</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={openAccessOnly}
                onChange={(e) => setOpenAccessOnly(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span>Open Access Only</span>
            </label>
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Articles Match Criteria"
            description="Try modifying your keyword search or unchecking Open Access filter."
            actionText="Clear Filters"
            onAction={() => {
              setQuery("");
              setOpenAccessOnly(false);
              setSelectedType("All");
            }}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((article) => {
              const isSaved = savedArticleIds.includes(article.id);
              const isCopied = copiedDoi === article.doi;

              return (
                <Card key={article.id} hover className="p-6 transition-all">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-5">
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
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
                        <span className="text-[11px] text-slate-400 font-mono">
                          DOI: {article.doi}
                        </span>
                      </div>

                      <Link href={`/articles/${article.slug}`}>
                        <h3 className="text-lg font-bold text-navy-950 hover:text-cyan-700 transition-colors leading-snug">
                          {article.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-600 font-medium">
                        {article.authors.map((a) => a.name).join(", ")}
                      </p>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {article.abstract}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {article.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Metrics & Quick Interactive Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto shrink-0 gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1" title="Citations">
                          <Quote className="w-3.5 h-3.5" />
                          <strong className="text-navy-900">{article.metrics.citations}</strong>
                        </span>
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="w-3.5 h-3.5" />
                          <strong className="text-navy-900">{article.metrics.views.toLocaleString()}</strong>
                        </span>
                      </div>

                      {/* Interactive Button Group */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyCitation(article)}
                          title="Copy Citation"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-cyan-800 transition-colors"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Quote className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(article)}
                          title="Download Manuscript File"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-cyan-800 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleBookmark(article)}
                          title="Bookmark Article"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isSaved
                              ? "bg-cyan-50 border-cyan-400 text-cyan-700"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-cyan-800"
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                        </button>

                        <Link href={`/articles/${article.slug}`}>
                          <Button variant="teal" size="sm" className="shadow-sm ml-1">
                            Read <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {toastMessage && (
        <Toast
          type="info"
          title="Library Action"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      <Footer />
    </div>
  );
}
