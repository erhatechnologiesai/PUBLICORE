"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { articleService, journalService, conferenceService, metricsService } from "@/services";
import { Article, Journal, Conference } from "@/types";
import {
  ArrowRight,
  Search,
  BookOpen,
  ShieldCheck,
  Compass,
  BarChart3,
  CheckCircle2,
  Calendar,
  Globe2,
  FileText,
  FileCheck2,
  Download,
  Eye,
  Quote,
  Cpu,
  Layers,
  Database,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Bot,
  MapPin,
  Sparkles,
  TrendingUp,
  Clock,
  Lock,
  Building2,
  Check,
  Upload,
  Bookmark,
  RefreshCw,
  X,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("Any Year");
  const [selectedArticleType, setSelectedArticleType] = useState("All");
  const [openAccessOnly, setOpenAccessOnly] = useState(true);

  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<any>(null);

  // Dynamic feedback states
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hero Pre-Screening interactive demo state
  const [screeningStatus, setScreeningStatus] = useState<"ready" | "running" | "verified">("ready");
  const [scopeMatch, setScopeMatch] = useState("98.4%");
  const [methodRigor, setMethodRigor] = useState("95.1%");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("publicore_saved_articles");
      if (saved) setSavedArticleIds(JSON.parse(saved));
    } catch {
      // ignore
    }

    articleService.getAll().then(setFeaturedArticles);
    journalService.getAll().then(setJournals);
    conferenceService.getAll().then(setConferences);
    metricsService.getGlobalMetrics().then(setGlobalMetrics);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategory !== "All") params.set("subject", selectedCategory);
    if (selectedYear !== "Any Year") params.set("year", selectedYear);
    if (selectedArticleType !== "All") params.set("type", selectedArticleType);
    if (openAccessOnly) params.set("oa", "true");

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory((prev) => (prev === categoryName ? "All" : categoryName));
  };

  const toggleBookmark = (art: Article) => {
    const isSaved = savedArticleIds.includes(art.id);
    let next: string[];
    if (isSaved) {
      next = savedArticleIds.filter((id) => id !== art.id);
      setToastMessage(`Removed "${art.title.slice(0, 35)}..." from saved library.`);
    } else {
      next = [...savedArticleIds, art.id];
      setToastMessage(`Saved "${art.title.slice(0, 35)}..." to reading list!`);
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
    setToastMessage(`Copied citation for DOI: ${art.doi}!`);
    setTimeout(() => setCopiedDoi(null), 2500);
  };

  const handleDownloadPaper = (art: Article) => {
    const content = `PUBLICORE OPEN ACCESS PUBLICATION
=====================================================
Title: ${art.title}
Authors: ${art.authors.map((a) => `${a.name} (${a.institution})`).join("; ")}
Journal: ${art.journalName} (Vol ${art.volume || 14}, Issue ${art.issue || 2})
DOI: https://doi.org/${art.doi}
License: Creative Commons Attribution 4.0 (CC-BY)

ABSTRACT:
${art.abstract}

KEYWORDS:
${art.keywords.join(", ")}

=====================================================
Archived by PUBLICORE Scholarly Infrastructure`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${art.slug}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToastMessage(`Downloaded publication file for ${art.title.slice(0, 35)}...`);
  };

  const handleRunScreeningDemo = () => {
    setScreeningStatus("running");
    setTimeout(() => {
      setScopeMatch("99.8%");
      setMethodRigor("98.9%");
      setScreeningStatus("verified");
      setToastMessage("AI Rigor screening complete: Statistical baselines & ethics COI verified!");
    }, 1200);
  };

  const categories = [
    { name: "Computer Science", icon: Cpu },
    { name: "Artificial Intelligence", icon: Bot },
    { name: "Biomedical Engineering", icon: Layers },
    { name: "Medicine", icon: BookOpen },
    { name: "Biotechnology", icon: FileText },
    { name: "Data Science", icon: Database },
    { name: "Sustainable Energy", icon: Globe2 },
    { name: "Quantum Computing", icon: BarChart3 },
  ];

  const portals = [
    {
      title: "Author Dashboard",
      description: "Submit manuscripts, track double-blind reviews, collaborate on revisions, and publish with automated DOI assignment.",
      href: "/dashboard/author",
      icon: BookOpen,
      badge: "Active Submissions",
      cta: "Author Portal",
    },
    {
      title: "Reviewer Workspace",
      description: "Structured peer-review interface with AI conflict-of-interest screening, methodology checks, and rubric scoring.",
      href: "/dashboard/reviewer",
      icon: ShieldCheck,
      badge: "Double-Blind",
      cta: "Reviewer Portal",
    },
    {
      title: "Editorial Queue",
      description: "Streamline desk screening, automated reviewer matching, decision workflows, and instant JATS XML production.",
      href: "/dashboard/editor",
      icon: FileCheck2,
      badge: "Editorial Control",
      cta: "Editor Portal",
    },
    {
      title: "Production & JATS",
      description: "Automated XML transformation, galley typesetting, figure validation, and Crossref DOI registration pipelines.",
      href: "/dashboard/production",
      icon: Cpu,
      badge: "JATS / XML",
      cta: "Production Queue",
    },
    {
      title: "Institutional Admin",
      description: "Consortium-level reporting, open-access fund allocation, compliance audits, and institutional citation metrics.",
      href: "/dashboard/admin",
      icon: Layers,
      badge: "Analytics",
      cta: "Admin Console",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Manuscript Ingestion & AI Screening",
      desc: "Automated structural validation, hallucination checking, COI screening, and preprint generation in under 4 minutes.",
      icon: Upload,
    },
    {
      step: "02",
      title: "Transparent Double-Blind Review",
      desc: "AI-assisted reviewer matching with human domain editors supervising multi-stage iterative revisions.",
      icon: ShieldCheck,
    },
    {
      step: "03",
      title: "Automated JATS XML & PDF Typesetting",
      desc: "Zero-friction production workflow generates publication-ready JATS XML, HTML, and high-res print PDFs automatically.",
      icon: Cpu,
    },
    {
      step: "04",
      title: "Global Indexing & Verified DOIs",
      desc: "Instant Crossref DOI minting, semantic scholar indexing, repository preservation, and neural citation tracking.",
      icon: Globe2,
    },
  ];

  const filteredArticles = featuredArticles.filter((art) => {
    if (selectedCategory === "All") return true;
    return (
      art.journalName.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      art.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      art.abstract.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      art.keywords.some((k) => k.toLowerCase().includes(selectedCategory.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans selection:bg-[#177994]/20 selection:text-[#0B1A2C]">
      {/* Global Official Navigation Bar */}
      <Navbar />

      <main className="flex-1">
        {/* =========================================================
            HERO SECTION: CLEAN ACADEMIC PLATFORM (ORIGINAL DESIGN)
        ========================================================= */}
        <section className="relative overflow-hidden bg-white/60 backdrop-blur-xs border-b border-slate-200/60 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          {/* Subtle architectural background accents in #177994 */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#177994]/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-[#177994]/10 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Heading, Subheading & Action CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Fluid Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight leading-[1.12]">
                  Advance Research
                  <br />
                  <span className="text-[#177994]">
                    Accelerate Discovery
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                  An AI-native academic research and publishing platform built to help
                  researchers submit, review, publish, discover, and measure knowledge
                  faster — with human-controlled scientific integrity at every milestone.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link href="/submit" className="w-full sm:w-auto">
                    <Button variant="teal" size="lg" className="w-full sm:w-auto shadow-sm font-semibold justify-center">
                      Submit Research
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>

                  <Link href="/journals" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-cyan-300 text-cyan-900 hover:bg-cyan-50 bg-white font-semibold justify-center shadow-xs"
                    >
                      <BookOpen className="w-4 h-4 mr-1.5 text-cyan-700" />
                      Explore Journals
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Clean Elevated Manuscript Pre-Screening Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 space-y-5 text-left">
                    
                    {/* Header bar of sample research */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${screeningStatus === "running" ? "bg-amber-500 animate-ping" : "bg-cyan-600 animate-pulse"}`} />
                        <span className="text-[11px] font-bold text-navy-900 uppercase tracking-wider">
                          Manuscript Pre-Screening
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-colors ${
                        screeningStatus === "verified"
                          ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                          : "text-cyan-800 bg-cyan-50 border-cyan-200"
                      }`}>
                        {screeningStatus === "verified" ? "Verified • 99% Rigor" : "Verified • 96% Rigor"}
                      </span>
                    </div>

                    {/* Paper card snippet */}
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                      <span className="text-[10px] font-mono text-cyan-800 font-bold uppercase tracking-wider">
                        DOI: 10.1042/PUB.2026.04189
                      </span>
                      <h4 className="text-sm font-bold text-navy-950 leading-snug">
                        Multimodal Latent Diffusion for Histopathology Synthesis
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        Hierarchical conditioning across paired clinical notes and spatial transcriptomic profiles elevates rare oncology diagnostic AUROC to 0.963.
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                        <span>Cambridge & Stanford</span>
                        <span>•</span>
                        <span className="text-cyan-800 font-semibold">14,200 Validated Samples</span>
                      </div>
                    </div>

                    {/* Telemetry Metrics */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-200/60 transition-all">
                        <p className="text-[10px] font-semibold text-slate-500">Scope Match</p>
                        <p className="text-base font-extrabold text-cyan-800">{scopeMatch}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 transition-all">
                        <p className="text-[10px] font-semibold text-slate-500">Method Rigor</p>
                        <p className="text-base font-extrabold text-navy-950">{methodRigor}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-200/60 transition-all">
                        <p className="text-[10px] font-semibold text-slate-500">Reviewers</p>
                        <p className="text-base font-extrabold text-cyan-800">3 Matched</p>
                      </div>
                    </div>

                    {/* Interactive Screening Trigger & Editorial Assistant Bar */}
                    <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">Editorial Screening Assistant</p>
                          <p className="text-[10px] text-slate-400 truncate">Assists screening; humans decide</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRunScreeningDemo}
                        disabled={screeningStatus === "running"}
                        className="text-[11px] font-semibold text-cyan-300 hover:text-white flex items-center gap-1 transition-colors shrink-0 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700"
                      >
                        {screeningStatus === "running" ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Analyzing...
                          </>
                        ) : screeningStatus === "verified" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            Verified
                          </>
                        ) : (
                          <>
                            Run Screening <ChevronRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 1: CLEAN MINIMAL RESEARCH SEARCH
        ========================================================= */}
        <section className="py-12 bg-white/70 backdrop-blur-md border-b border-slate-200/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            {/* Minimal Clean Title - No Extra Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-950 tracking-tight">
                Search Research
              </h2>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-3.5">
              {/* Premium Floating Search Capsule */}
              <div className="relative flex items-center bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(11,26,44,0.07)] hover:border-slate-300 focus-within:border-[#177994] focus-within:ring-2 focus-within:ring-[#177994]/15 transition-all p-1.5 sm:p-2">
                <div className="pl-3 sm:pl-4 pr-2 text-[#177994] pointer-events-none">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers, authors, topics, or DOIs..."
                  className="w-full bg-transparent text-sm sm:text-base text-navy-950 placeholder:text-slate-400 focus:outline-none py-2 pr-2"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg mr-1 transition-colors"
                    title="Clear query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <Button
                  type="submit"
                  variant="teal"
                  size="sm"
                  className="px-5 py-2.5 rounded-xl font-semibold shadow-sm shrink-0"
                >
                  Search
                </Button>
              </div>

              {/* Minimalist Controls Toolbar with Unified Dropdowns */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Dynamic Open Access Toggle */}
                  <button
                    type="button"
                    onClick={() => setOpenAccessOnly(!openAccessOnly)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
                      openAccessOnly
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${openAccessOnly ? "bg-emerald-600 animate-pulse" : "bg-slate-400"}`} />
                    Open Access
                  </button>

                  {/* All Disciplines Dropdown (Converted from row of pills) */}
                  <div className="relative inline-flex items-center">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold text-navy-950 focus:outline-none focus:border-[#177994] focus:ring-1 focus:ring-[#177994]/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="All">All Disciplines</option>
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5" />
                  </div>

                  {/* All Years Dropdown */}
                  <div className="relative inline-flex items-center">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold text-navy-950 focus:outline-none focus:border-[#177994] focus:ring-1 focus:ring-[#177994]/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="Any Year">All Years</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5" />
                  </div>

                  {/* All Types Dropdown */}
                  <div className="relative inline-flex items-center">
                    <select
                      value={selectedArticleType}
                      onChange={(e) => setSelectedArticleType(e.target.value)}
                      className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold text-navy-950 focus:outline-none focus:border-[#177994] focus:ring-1 focus:ring-[#177994]/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="All">All Types</option>
                      <option value="Research Article">Research</option>
                      <option value="Review Paper">Review</option>
                      <option value="Methodology">Methodology</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5" />
                  </div>
                </div>

                {/* AI Semantic Mode Pill */}
                <Link
                  href="/search?mode=ai"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-50/80 hover:bg-cyan-100 text-[#177994] font-semibold text-xs border border-cyan-200/70 transition-colors ml-auto shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#177994]" />
                  <span>AI Semantic Mode</span>
                </Link>
              </div>
            </form>

          </div>
        </section>

        {/* =========================================================
            SECTION 2: WORKSPACE ROLE PORTALS
        ========================================================= */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
                Role-Based Workspaces
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
                Integrated Editorial & Research Portals
              </h2>
            </div>
            <Link href="/dashboard/author" className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1">
              Access Dashboards <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.title}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="navy" size="sm">
                        {portal.badge}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy-950 group-hover:text-cyan-700 transition-colors">
                        {portal.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {portal.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={portal.href}
                      className="text-xs font-semibold text-cyan-700 group-hover:text-cyan-800 flex items-center gap-1"
                    >
                      {portal.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            SECTION 3: FEATURED PEER-REVIEWED ARTICLES (DYNAMIC)
        ========================================================= */}
        <section className="py-14 bg-white/50 backdrop-blur-xs border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
                  Latest Scholarly Discoveries
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
                  Featured Peer-Reviewed Publications
                  {selectedCategory !== "All" && (
                    <span className="text-sm font-semibold text-cyan-800 block sm:inline sm:ml-2">
                      ({selectedCategory})
                    </span>
                  )}
                </h2>
              </div>
              <Link href="/articles" className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1">
                Browse All Publications <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.slice(0, 4).map((art) => {
                const isSaved = savedArticleIds.includes(art.id);
                const isCopied = copiedDoi === art.doi;

                return (
                  <div
                    key={art.id}
                    className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-6 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-cyan-800">DOI: {art.doi}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="teal" size="sm">
                            Open Access
                          </Badge>
                          <span className="text-slate-400">{art.publishedAt}</span>
                        </div>
                      </div>

                      <Link href={`/articles/${art.slug}`}>
                        <h3 className="text-base font-bold text-navy-950 hover:text-cyan-700 leading-snug">
                          {art.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {art.abstract}
                      </p>

                      <div className="text-xs text-slate-500 font-medium pt-1">
                        {art.authors.map((a) => a.name).join(", ")}
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="w-3.5 h-3.5 text-slate-400" /> {art.metrics?.views ?? 0}
                        </span>
                        <span className="flex items-center gap-1" title="Citations">
                          <Quote className="w-3.5 h-3.5 text-slate-400" /> {art.metrics?.citations ?? 0}
                        </span>
                        <span className="flex items-center gap-1" title="Downloads">
                          <Download className="w-3.5 h-3.5 text-slate-400" /> {art.metrics?.downloads ?? 0}
                        </span>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          type="button"
                          onClick={() => handleCopyCitation(art)}
                          title="Copy APA Citation"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-cyan-800 transition-colors"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Quote className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadPaper(art)}
                          title="Download Manuscript File"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-cyan-800 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleBookmark(art)}
                          title="Bookmark Article"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isSaved
                              ? "bg-cyan-50 border-cyan-400 text-cyan-700"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-cyan-800"
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                        </button>

                        <Link
                          href={`/articles/${art.slug}`}
                          className="font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 ml-1"
                        >
                          Read Paper <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: ACADEMIC JOURNALS & UPCOMING CONFERENCES
        ========================================================= */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Featured Academic Journals */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
                    Periodicals
                  </span>
                  <h3 className="text-xl font-bold text-navy-900 tracking-tight mt-0.5">
                    Featured Academic Journals
                  </h3>
                </div>
                <Link href="/journals" className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1">
                  All Journals <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {journals.slice(0, 4).map((journal) => (
                  <div
                    key={journal.id}
                    className="bg-white p-4.5 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="navy" size="sm">
                          {journal.shortTitle || "OPEN ACCESS"}
                        </Badge>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {journal.subject}
                        </span>
                      </div>
                      <Link href={`/journals/${journal.slug}`}>
                        <h4 className="text-sm font-bold text-navy-900 hover:text-cyan-700 mt-1 leading-snug">
                          {journal.title}
                        </h4>
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Impact Factor: <strong className="text-navy-900">{journal.metrics.impactFactor}</strong> • CiteScore: {journal.metrics.citescore}
                      </p>
                    </div>
                    <Link href={`/journals/${journal.slug}`}>
                      <Button variant="ghost" size="sm">
                        Explore
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Academic Conferences */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
                    Proceedings & Symposia
                  </span>
                  <h3 className="text-xl font-bold text-navy-900 tracking-tight mt-0.5">
                    Upcoming Conferences
                  </h3>
                </div>
                <Link href="/conferences" className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1">
                  Full Schedule <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {conferences.slice(0, 3).map((conf) => (
                  <div
                    key={conf.id}
                    className="bg-white p-4.5 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="navy" size="sm">
                          {conf.acronym}
                        </Badge>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-cyan-700" /> {conf.dateRange}
                        </span>
                      </div>
                      <Link href={`/conferences/${conf.slug}`}>
                        <h4 className="text-sm font-bold text-navy-900 hover:text-cyan-700 mt-1 leading-snug">
                          {conf.title}
                        </h4>
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {conf.location}
                      </p>
                    </div>
                    <Link href={`/conferences/${conf.slug}`}>
                      <Button variant="outline" size="sm">
                        CFP Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================
            SECTION 5: PUBLISHING WORKFLOW & EDITORIAL INTEGRITY
        ========================================================= */}
        <section className="py-14 bg-white/60 backdrop-blur-xs border-y border-slate-200/60 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
                Scientific Rigor & Velocity
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
                AI-Accelerated, Human-Governed Publishing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Preserving peer-review integrity with transparent audit trails, COPE compliance, and automated production pipelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflowSteps.map((ws) => {
                const Icon = ws.icon;
                return (
                  <div
                    key={ws.step}
                    className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 relative space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {ws.step}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-navy-950 leading-snug">
                      {ws.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ws.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 6: TRUST PILLARS (RESPONSIVE)
        ========================================================= */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-subtle flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">COPE Compliant</p>
                <p className="text-[10px] text-slate-500">Transparent peer review</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-subtle flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">21-Day Decision</p>
                <p className="text-[10px] text-slate-500">Fast editorial turnaround</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-subtle flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">Permanent DOIs</p>
                <p className="text-[10px] text-slate-500">Crossref guaranteed</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-subtle flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">Global Open Access</p>
                <p className="text-[10px] text-slate-500">Unrestricted dissemination</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 7: CALL TO ACTION
        ========================================================= */}
        <section className="py-20 text-center bg-white/70 backdrop-blur-xs border-t border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
              Join the Future of Science
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-2">
              Publish. Discover. Connect. Advance Research.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-3 mb-8 leading-relaxed">
              Experience transparent, AI-assisted peer review with rapid editorial turnaround
              and global open-access dissemination.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/submit">
                <Button variant="teal" size="lg" className="shadow-md">
                  Submit Your Research
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn About Our Peer Review Model
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Floating dynamic action feedback toast */}
      {toastMessage && (
        <Toast
          type="info"
          title="PUBLICORE Discovery"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Global Official Footer */}
      <Footer />
    </div>
  );
}
