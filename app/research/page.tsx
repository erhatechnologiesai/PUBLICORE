"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { articleService } from "@/services";
import { Article } from "@/types";
import {
  Search,
  Sparkles,
  BookOpen,
  TrendingUp,
  Compass,
  ArrowRight,
  Cpu,
  Bot,
  Lightbulb,
  Layers,
  Quote,
  Eye,
  Download,
  Calendar,
  Users,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function ResearchPortalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState("All");

  useEffect(() => {
    articleService.getAll().then(setArticles);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/search");
    }
  };

  const aiTools = [
    {
      title: "AI Research Assistant",
      desc: "Synthesize cross-disciplinary papers, dissect methodology derivations, and query citations in an interactive scholarly chat.",
      href: "/ai/assistant",
      icon: Bot,
      badge: "Interactive Chat",
      color: "text-cyan-700 bg-cyan-50",
    },
    {
      title: "Scholarly Research Gaps",
      desc: "Surface empirical contradictions, methodology blindspots, and high-potential uninvestigated hypothesis spaces across 148,000+ papers.",
      href: "/ai/gaps",
      icon: Lightbulb,
      badge: "Hypothesis Discovery",
      color: "text-amber-700 bg-amber-50",
    },
    {
      title: "Emerging Research Trends",
      desc: "Track 5-year growth trajectory curves, rising computational concepts, and citation momentum across institutions worldwide.",
      href: "/ai/trends",
      icon: TrendingUp,
      badge: "Momentum Analytics",
      color: "text-indigo-700 bg-indigo-50",
    },
    {
      title: "Research Taxonomy Trees",
      desc: "Explore hierarchically organized scientific disciplines, sub-fields, and cross-cutting interdisciplinary research clusters.",
      href: "/topics",
      icon: Layers,
      badge: "Taxonomy Explorer",
      color: "text-emerald-700 bg-emerald-50",
    },
  ];

  const disciplines = [
    { name: "Computer Science", count: "38.2k", icon: Cpu },
    { name: "Artificial Intelligence", count: "44.1k", icon: Bot },
    { name: "Biomedical Engineering", count: "29.4k", icon: Layers },
    { name: "Medicine & Oncology", count: "31.9k", icon: BookOpen },
    { name: "Sustainable Energy", count: "14.2k", icon: Compass },
    { name: "Quantum Computing", count: "11.1k", icon: Sparkles },
  ];

  const filteredArticles = articles.filter((art) => {
    if (selectedDiscipline === "All") return true;
    return (
      art.journalName.toLowerCase().includes(selectedDiscipline.toLowerCase()) ||
      art.title.toLowerCase().includes(selectedDiscipline.toLowerCase()) ||
      art.abstract.toLowerCase().includes(selectedDiscipline.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left space-y-12">
        {/* Header & Search Hero */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-subtle space-y-6">
          <div className="space-y-2">
            <Badge variant="teal" size="sm">
              Discovery Hub & Intelligence
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
              Scholarly Research & Knowledge Discovery
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Explore peer-reviewed publications, investigate empirical literature gaps, and query multi-disciplinary papers with AI reasoning.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query papers, methods, or hypotheses (e.g. 'Self-supervised vision models for histology')..."
                className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white focus:ring-1 focus:ring-cyan-600 shadow-sm"
              />
              <Button type="submit" variant="teal" size="sm" className="absolute right-2.5 shadow-sm">
                Explore
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 text-slate-500">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-400">Popular:</span>
                {["Diffusion Models", "Histopathology", "Quantum Decoupling", "CRISPR-Cas9"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(p)}`)}
                    className="bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 px-2 py-0.5 rounded text-[11px] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Link href="/search?mode=ai" className="text-cyan-700 hover:underline font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Open Semantic AI Mode →
              </Link>
            </div>
          </form>
        </div>

        {/* AI Research Intelligence Suite */}
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
                AI Cognitive Frameworks
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight mt-0.5">
                AI Research Intelligence Workspaces
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {aiTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.title}
                  hover
                  className="p-6 space-y-4 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="navy" size="sm">
                        {tool.badge}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-navy-950 leading-snug">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link href={tool.href}>
                      <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                        Launch Tool <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Discipline Filter and Featured Publications */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
                Corpus Exploration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight mt-0.5">
                Peer-Reviewed Scholarly Discoveries
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedDiscipline("All")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedDiscipline === "All"
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Fields
              </button>
              {disciplines.slice(0, 4).map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => setSelectedDiscipline(d.name)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    selectedDiscipline === d.name
                      ? "bg-cyan-700 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
            {filteredArticles.slice(0, 4).map((art) => (
              <article
                key={art.id}
                className="group relative bg-gradient-to-br from-white via-[#fcfefe] to-[#f4f8fb] rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-cyan-400/80 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-950/[0.08]"
              >
                {/* Top Multicolor Accent Glow Line on Hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-t-2xl sm:rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Ambient Sheen */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-cyan-500/[0.04] to-transparent rounded-bl-full pointer-events-none group-hover:from-cyan-500/[0.08] transition-all duration-300" />

                <div className="space-y-3.5 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-semibold text-xs text-cyan-900 bg-cyan-50/90 border border-cyan-200/80 px-2.5 py-1 rounded-lg">
                      {art.journalName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Open Access
                      </span>
                      {art.publishedAt && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {art.publishedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link href={`/articles/${art.slug}`} className="block group/title">
                    <h3 className="text-base sm:text-lg lg:text-[1.15rem] font-bold text-navy-950 group-hover/title:text-cyan-700 transition-colors duration-200 leading-snug tracking-tight">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="text-[13px] sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal">
                    {art.abstract}
                  </p>

                  <div className="text-xs sm:text-[13px] text-slate-600 font-medium flex items-center gap-2 pt-0.5">
                    <div className="w-5 h-5 rounded-full bg-cyan-100/70 border border-cyan-200/60 flex items-center justify-center shrink-0 text-cyan-800">
                      <Users className="w-3 h-3" />
                    </div>
                    <span className="truncate">{art.authors.map((a) => a.name).join(", ")}</span>
                  </div>
                </div>

                <div className="pt-4 sm:pt-5 mt-5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs text-slate-600 relative z-10">
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-600" title="Citations">
                      <Quote className="w-3.5 h-3.5 text-slate-400" />
                      {art.metrics?.citations?.toLocaleString() ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-600" title="Views">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {art.metrics?.views?.toLocaleString() ?? 0}
                    </span>
                    {art.metrics?.downloads !== undefined && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-600" title="Downloads">
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        {art.metrics?.downloads?.toLocaleString() ?? 0}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/articles/${art.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-700 to-cyan-800 hover:from-cyan-800 hover:to-cyan-900 text-white text-xs sm:text-[13px] font-bold shadow-xs hover:shadow-md hover:shadow-cyan-900/20 transition-all duration-200 group/btn active:scale-95 ml-auto sm:ml-0"
                  >
                    <span>Read Paper</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
