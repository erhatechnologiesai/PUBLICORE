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
import { articleService } from "@/services";
import { Article } from "@/types";
import { Search, SlidersHorizontal, Quote, Eye, Download, BookOpen, ChevronRight } from "lucide-react";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    loadArticles();
  }, [openAccessOnly]);

  const loadArticles = async () => {
    setLoading(true);
    const data = await articleService.getAll({ openAccessOnly });
    setArticles(data);
    setLoading(false);
  };

  const filtered = articles.filter((a) => {
    const matchesQ =
      !query ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.abstract.toLowerCase().includes(query.toLowerCase()) ||
      a.authors.some((author) => author.name.toLowerCase().includes(query.toLowerCase()));
    const matchesType = selectedType === "All" || a.articleType === selectedType;
    return matchesQ && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">
            Digital Research Library
          </Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Peer-Reviewed Articles & Preprints
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Access thousands of original research articles, review methodologies, and data papers across foundational and applied sciences.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title, author, or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
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
            {filtered.map((article) => (
              <Card key={article.id} hover className="p-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
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
                      <span className="text-[11px] text-slate-400 font-mono">
                        DOI: {article.doi}
                      </span>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="text-lg font-bold text-navy-900 hover:text-cyan-700 transition-colors leading-snug">
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

                  {/* Right Metrics & Read CTA */}
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1" title="Citations">
                        <Quote className="w-3.5 h-3.5" />
                        <strong>{article.metrics.citations}</strong>
                      </span>
                      <span className="flex items-center gap-1" title="Views">
                        <Eye className="w-3.5 h-3.5" />
                        <strong>{article.metrics.views.toLocaleString()}</strong>
                      </span>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <Button variant="teal" size="sm">
                        Read Article <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </Button>
                    </Link>
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

