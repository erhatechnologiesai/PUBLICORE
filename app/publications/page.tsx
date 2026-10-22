"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { journalService, conferenceService, articleService } from "@/services";
import { Journal, Conference, Article } from "@/types";
import {
  BookOpen,
  Calendar,
  FileText,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  Globe2,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Quote,
  Eye,
} from "lucide-react";

export default function PublicationsHubPage() {
  const [activeTab, setActiveTab] = useState<"all" | "journals" | "conferences" | "articles">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [journals, setJournals] = useState<Journal[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      journalService.getAll(),
      conferenceService.getAll(),
      articleService.getAll(),
    ]).then(([jList, cList, aList]) => {
      setJournals(jList);
      setConferences(cList);
      setArticles(aList);
      setLoading(false);
    });
  }, []);

  const filteredJournals = journals.filter((j) =>
    !searchQuery ||
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.issn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConferences = conferences.filter((c) =>
    !searchQuery ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articles.filter((a) =>
    !searchQuery ||
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.journalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left space-y-8">
        {/* Header & Quick Telemetry */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
          <div className="space-y-2">
            <Badge variant="teal" size="sm">
              PUBLICORE Publishing Ecosystem
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Scholarly Publications & Proceedings
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Explore international peer-reviewed journals, indexed symposium proceedings, and original research literature with verified Crossref DOIs.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center shrink-0">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-subtle">
              <p className="text-[10px] uppercase font-bold text-slate-400">Journals</p>
              <p className="text-lg font-black text-navy-950">{journals.length || "12"}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-subtle">
              <p className="text-[10px] uppercase font-bold text-slate-400">Symposia</p>
              <p className="text-lg font-black text-cyan-800">{conferences.length || "8"}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-subtle">
              <p className="text-[10px] uppercase font-bold text-slate-400">Open Access</p>
              <p className="text-lg font-black text-emerald-600">100%</p>
            </div>
          </div>
        </div>

        {/* Filter and Tab Controller */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across journals, conferences, topics, and papers..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-slate-100 p-1 rounded-lg">
            {[
              { id: "all", label: "All Index" },
              { id: "journals", label: `Journals (${filteredJournals.length})` },
              { id: "conferences", label: `Conferences (${filteredConferences.length})` },
              { id: "articles", label: `Articles (${filteredArticles.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-navy-950 shadow-sm"
                    : "text-slate-600 hover:text-navy-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <div className="space-y-10">
            {/* JOURNALS SECTION */}
            {(activeTab === "all" || activeTab === "journals") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-700" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                      Academic Journals ({filteredJournals.length})
                    </h3>
                  </div>
                  <Link href="/journals" className="text-xs font-semibold text-cyan-700 hover:underline">
                    View Journal Directory →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredJournals.map((j) => (
                    <Card key={j.id} hover className="p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="navy" size="sm">
                            {j.shortTitle || "OPEN ACCESS"}
                          </Badge>
                          <span className="text-[10px] font-mono text-slate-400">ISSN: {j.issn}</span>
                        </div>
                        <Link href={`/journals/${j.slug}`}>
                          <h4 className="text-base font-bold text-navy-900 hover:text-cyan-700 leading-snug">
                            {j.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {j.aimsAndScope || j.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Impact Factor: <strong className="text-navy-950">{j.metrics.impactFactor}</strong>
                        </span>
                        <Link href={`/journals/${j.slug}`}>
                          <Button variant="ghost" size="sm" className="text-cyan-700 hover:text-cyan-800">
                            Explore <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* CONFERENCES SECTION */}
            {(activeTab === "all" || activeTab === "conferences") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                      Upcoming Symposia & Conferences ({filteredConferences.length})
                    </h3>
                  </div>
                  <Link href="/conferences" className="text-xs font-semibold text-cyan-700 hover:underline">
                    View Full Schedule →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredConferences.map((conf) => (
                    <Card key={conf.id} hover className="p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="blue" size="sm">
                            {conf.acronym}
                          </Badge>
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-700" /> {conf.dateRange}
                          </span>
                        </div>
                        <Link href={`/conferences/${conf.slug}`}>
                          <h4 className="text-base font-bold text-navy-900 hover:text-cyan-700 leading-snug">
                            {conf.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {conf.location}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          CFP Deadline: <strong className="text-navy-950">{conf.importantDates?.submissionDeadline || "Rolling"}</strong>
                        </span>
                        <Link href={`/conferences/${conf.slug}`}>
                          <Button variant="outline" size="sm">
                            CFP Details
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ARTICLES SECTION */}
            {(activeTab === "all" || activeTab === "articles") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                      Featured Articles ({filteredArticles.length})
                    </h3>
                  </div>
                  <Link href="/articles" className="text-xs font-semibold text-cyan-700 hover:underline">
                    Browse All Published Articles →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredArticles.slice(0, 4).map((art) => (
                    <Card key={art.id} hover className="p-5 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                            {art.journalName}
                          </span>
                          <span className="text-slate-400 font-mono">DOI: {art.doi}</span>
                        </div>
                        <Link href={`/articles/${art.slug}`}>
                          <h4 className="text-sm sm:text-base font-bold text-navy-900 hover:text-cyan-700 leading-snug">
                            {art.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {art.abstract}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Quote className="w-3.5 h-3.5 text-slate-400" /> {art.metrics.citations}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" /> {art.metrics.views}
                          </span>
                        </div>
                        <Link href={`/articles/${art.slug}`}>
                          <Button variant="teal" size="sm">
                            Read Article <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
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
