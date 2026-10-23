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
  X,
  Users,
  Copy,
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
            HERO SECTION: FULL NETWORK BACKGROUND & CENTERED HEADLINE
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#07111E] border-b border-cyan-500/20 py-14 sm:py-20 md:py-28 lg:py-34">
          {/* High-Resolution Futuristic Digital Network Skyline Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.82] contrast-[1.10] scale-100 transition-transform duration-1000"
            style={{ backgroundImage: "url('/images/hero-network-bg.jpg')" }}
          />

          {/* Professional Multi-Layer Vignette & Contrast Gradients for Superior Visual Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07111E]/85 via-[#0B1A2C]/70 to-[#07111E]/92" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,17,30,0.72)_0%,rgba(7,17,30,0.35)_55%,transparent_90%)] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-transparent to-[#07111E]/40 pointer-events-none" />

          {/* Subtle Cyber-Cyan Glow Accents matching network nodes */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[850px] h-[300px] bg-cyan-400/15 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Fluid Centered Headline (White & Gradient Cyan) with Crisp Contrast Drop-Shadow */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-4xl mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Advance Research
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-100 drop-shadow-md">
                Accelerate Discovery
              </span>
            </h1>

            {/* Subheading in Clean Crisp Slate-100 with High Readability */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-100/95 leading-relaxed max-w-2xl sm:max-w-3xl mx-auto font-normal pt-5 pb-8 sm:pb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              An AI-native academic research and publishing platform built to help
              researchers submit, review, publish, discover, and measure knowledge
              faster — with human-controlled scientific integrity at every milestone.
            </p>

            {/* Centered Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <Link href="/submit" className="w-full sm:w-auto">
                <Button
                  variant="teal"
                  size="lg"
                  className="w-full sm:w-auto shadow-2xl shadow-cyan-950/60 font-bold justify-center bg-gradient-to-r from-cyan-600 via-[#177994] to-cyan-700 hover:from-cyan-500 hover:to-teal-600 text-white border border-cyan-400/30 px-7 sm:px-8 py-3.5 text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Submit Manuscript
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link href="/journals" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/40 hover:border-cyan-300 text-white hover:text-cyan-200 bg-[#0B1A2C]/60 hover:bg-[#0B1A2C]/80 backdrop-blur-md font-bold justify-center shadow-xl px-7 sm:px-8 py-3.5 text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4 mr-2 text-cyan-300" />
                  Explore Journals
                </Button>
              </Link>
            </div>

            {/* Dynamic Value Badges in Clean Frosted Pill Style */}
            <div className="pt-10 sm:pt-14 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-slate-200">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1A2C]/75 backdrop-blur-md border border-cyan-400/25 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">148,000+</span>
                <span className="text-slate-300">Articles</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1A2C]/75 backdrop-blur-md border border-cyan-400/25 shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">COPE</span>
                <span className="text-slate-300">Double-Blind</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1A2C]/75 backdrop-blur-md border border-cyan-400/25 shadow-lg">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">100%</span>
                <span className="text-slate-300">Open Access</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1A2C]/75 backdrop-blur-md border border-cyan-400/25 shadow-lg">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">21-Day</span>
                <span className="text-slate-300">Turnaround</span>
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
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs">
                {/* All Disciplines Dropdown */}
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
            SECTION 3: FEATURED PEER-REVIEWED ARTICLES (DYNAMIC & RESPONSIVE)
        ========================================================= */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 border-y border-slate-200/70 overflow-hidden text-left">
          {/* Subtle Ambient Decorative Gradient Glows for 4K Depth */}
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 left-10 w-96 h-96 bg-teal-200/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-slate-200/70 gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200/70">
                  <Sparkles className="w-3 h-3 text-cyan-600" />
                  Latest Scholarly Discoveries
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 tracking-tight">
                  Featured Peer-Reviewed Publications
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Verified open-access research articles, dynamically indexed with persistent Crossref DOIs.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-700 hover:text-cyan-800 bg-white hover:bg-cyan-50/80 border border-slate-200/90 hover:border-cyan-300 px-4 py-2 rounded-xl transition-all duration-200 shadow-2xs group"
                >
                  <span>Browse All Publications</span>
                  <ChevronRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Dynamic Quick Subject Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs">
              <span className="text-slate-400 font-medium text-xs mr-1 shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /> Filter:
              </span>
              {["All", "Computer Science", "Artificial Intelligence", "Biomedical Engineering", "Medicine", "Quantum Computing"].map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 shadow-2xs ${
                      isActive
                        ? "bg-cyan-700 text-white shadow-sm ring-2 ring-cyan-700/30"
                        : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    {category}
                    {category === "All" ? ` (${featuredArticles.length})` : ""}
                  </button>
                );
              })}
              {selectedCategory !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="shrink-0 text-xs font-semibold text-cyan-700 hover:text-cyan-800 underline ml-2 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Responsive Article Cards Grid */}
            {filteredArticles.length === 0 ? (
              <div className="py-16 text-center bg-white/80 rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
                <p className="text-sm font-semibold text-slate-600">
                  No publications currently match the filter &ldquo;{selectedCategory}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-700 text-white text-xs font-bold hover:bg-cyan-800 transition-colors shadow-2xs"
                >
                  View All Publications
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
                {filteredArticles.slice(0, 4).map((art) => {
                  const isSaved = savedArticleIds.includes(art.id);
                  const isCopied = copiedDoi === art.doi;

                  return (
                    <article
                      key={art.id}
                      className="group relative bg-gradient-to-br from-white via-[#fcfefe] to-[#f4f8fb] rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-cyan-400/80 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-950/[0.08]"
                    >
                      {/* Top Animated Multicolor Accent Glow Line on Hover */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-t-2xl sm:rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Ambient Radial Sheen on Top Right */}
                      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-cyan-500/[0.04] to-transparent rounded-bl-full pointer-events-none group-hover:from-cyan-500/[0.08] transition-all duration-300" />

                      {/* Card Content Top Section */}
                      <div className="space-y-3.5 relative z-10">
                        {/* Meta Header: DOI & Status Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => handleCopyCitation(art)}
                            title="Click to copy citation & persistent DOI"
                            className="group/doi inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 hover:bg-cyan-50/90 border border-slate-200/90 hover:border-cyan-300 text-xs font-mono font-semibold text-slate-700 hover:text-cyan-950 transition-colors shadow-2xs"
                          >
                            <span className="text-cyan-700 font-bold">DOI:</span>
                            <span>{art.doi}</span>
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 ml-0.5 shrink-0" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400 group-hover/doi:text-cyan-700 ml-0.5 opacity-60 group-hover/doi:opacity-100 transition-opacity shrink-0" />
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Open Access
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {art.publishedAt}
                            </span>
                          </div>
                        </div>

                        {/* Article Title */}
                        <Link href={`/articles/${art.slug}`} className="block group/title">
                          <h3 className="text-base sm:text-lg lg:text-[1.15rem] font-bold text-navy-950 group-hover/title:text-cyan-700 transition-colors duration-200 leading-snug tracking-tight">
                            {art.title}
                          </h3>
                        </Link>

                        {/* Abstract / Excerpt */}
                        <p className="text-[13px] sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal">
                          {art.abstract}
                        </p>

                        {/* Authors List with Micro Badge */}
                        <div className="text-xs sm:text-[13px] text-slate-600 font-medium flex items-center gap-2 pt-0.5">
                          <div className="w-5 h-5 rounded-full bg-cyan-100/70 border border-cyan-200/60 flex items-center justify-center shrink-0 text-cyan-800">
                            <Users className="w-3 h-3" />
                          </div>
                          <span className="truncate">{art.authors.map((a) => a.name).join(", ")}</span>
                        </div>
                      </div>

                      {/* Card Footer: Metrics & Interactive Action Buttons */}
                      <div className="pt-4 sm:pt-5 mt-5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs text-slate-600 relative z-10">
                        {/* Metrics Counters */}
                        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-default"
                            title="Total Views"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {art.metrics?.views?.toLocaleString() ?? 0}
                          </span>
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-default"
                            title="Citations Count"
                          >
                            <Quote className="w-3.5 h-3.5 text-slate-400" />
                            {art.metrics?.citations?.toLocaleString() ?? 0}
                          </span>
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-default"
                            title="Manuscript Downloads"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            {art.metrics?.downloads?.toLocaleString() ?? 0}
                          </span>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-2 ml-auto sm:ml-0 flex-wrap sm:flex-nowrap">
                          {/* Copy APA Citation Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyCitation(art)}
                            title="Copy formatted APA Citation"
                            className={`w-9 h-9 rounded-xl border transition-all duration-200 active:scale-95 shadow-2xs flex items-center justify-center ${
                              isCopied
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-emerald-500/10"
                                : "border-slate-200/90 text-slate-600 hover:bg-cyan-50/80 hover:text-cyan-800 hover:border-cyan-300"
                            }`}
                          >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Quote className="w-4 h-4" />}
                          </button>

                          {/* Download Manuscript Button */}
                          <button
                            type="button"
                            onClick={() => handleDownloadPaper(art)}
                            title="Download Publication Manuscript"
                            className="w-9 h-9 rounded-xl border border-slate-200/90 text-slate-600 hover:bg-cyan-50/80 hover:text-cyan-800 hover:border-cyan-300 transition-all duration-200 active:scale-95 shadow-2xs flex items-center justify-center"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Bookmark Article Button */}
                          <button
                            type="button"
                            onClick={() => toggleBookmark(art)}
                            title={isSaved ? "Remove from Reading List" : "Bookmark Article"}
                            className={`w-9 h-9 rounded-xl border transition-all duration-200 active:scale-95 shadow-2xs flex items-center justify-center ${
                              isSaved
                                ? "bg-cyan-50 border-cyan-400 text-cyan-800 shadow-cyan-500/10"
                                : "border-slate-200/90 text-slate-600 hover:bg-cyan-50/80 hover:text-cyan-800 hover:border-cyan-300"
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-cyan-700 text-cyan-700" : ""}`} />
                          </button>

                          {/* Read Paper CTA Button */}
                          <Link
                            href={`/articles/${art.slug}`}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-700 to-cyan-800 hover:from-cyan-800 hover:to-cyan-900 text-white text-xs sm:text-[13px] font-bold shadow-xs hover:shadow-md hover:shadow-cyan-900/20 transition-all duration-200 group/btn active:scale-95 ml-1"
                          >
                            <span>Read Paper</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            SECTION 4: ACADEMIC JOURNALS & UPCOMING CONFERENCES (ALIGNED & RESPONSIVE)
        ========================================================= */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/70 text-left overflow-hidden">
          {/* Subtle Ambient Decorative Accents */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-100/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              
              {/* Featured Academic Journals */}
              <div className="flex flex-col justify-between space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200/70">
                      <BookOpen className="w-3 h-3 text-cyan-600" />
                      Periodicals
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
                      Featured Academic Journals
                    </h3>
                  </div>
                  <Link
                    href="/journals"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-cyan-700 hover:text-cyan-800 bg-white hover:bg-cyan-50/80 border border-slate-200/90 hover:border-cyan-300 px-3.5 py-1.5 rounded-xl transition-all duration-200 shadow-2xs group"
                  >
                    <span>All Journals</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* 4 Journal Cards */}
                <div className="space-y-4">
                  {journals.slice(0, 4).map((journal) => (
                    <article
                      key={journal.id}
                      className="group relative bg-gradient-to-br from-white via-[#fcfefe] to-[#f4f8fb] p-5 rounded-2xl border border-slate-200/90 hover:border-cyan-400/80 shadow-xs hover:shadow-xl hover:shadow-cyan-950/[0.07] transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col justify-between gap-3 min-h-[148px]"
                    >
                      {/* Top Animated Multicolor Accent Glow Line on Hover */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="space-y-2">
                        {/* Meta: Badge + Subject */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold text-cyan-950 bg-cyan-50/90 border border-cyan-200/80 shadow-2xs">
                              {journal.shortTitle || "OA"}
                            </span>
                            <span className="text-xs text-slate-500 font-medium truncate max-w-[240px] sm:max-w-[320px]">
                              {journal.subject}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Q1 Tier
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/journals/${journal.slug}`} className="block group/title">
                          <h4 className="text-base font-bold text-navy-950 group-hover/title:text-cyan-700 transition-colors leading-snug tracking-tight">
                            {journal.title}
                          </h4>
                        </Link>

                        {/* Metrics Pills */}
                        <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50/90 border border-emerald-200/70 text-emerald-800 font-bold text-[11px]">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            IF: {journal.metrics.impactFactor}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-50/90 border border-cyan-200/70 text-cyan-900 font-semibold text-[11px]">
                            <TrendingUp className="w-3 h-3 text-cyan-600" />
                            CiteScore: {journal.metrics.citescore}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                            • Peer-Reviewed Open Access
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-400">
                          Scopus & Crossref Indexed
                        </span>
                        <Link
                          href={`/journals/${journal.slug}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-cyan-50/90 text-cyan-800 hover:text-cyan-900 border border-slate-200/90 hover:border-cyan-300 text-xs font-bold transition-all duration-200 shadow-2xs group/btn active:scale-95"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-600 group-hover/btn:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Upcoming Academic Conferences */}
              <div className="flex flex-col justify-between space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200/70">
                      <Calendar className="w-3 h-3 text-cyan-600" />
                      Proceedings & Symposia
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
                      Upcoming Conferences
                    </h3>
                  </div>
                  <Link
                    href="/conferences"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-cyan-700 hover:text-cyan-800 bg-white hover:bg-cyan-50/80 border border-slate-200/90 hover:border-cyan-300 px-3.5 py-1.5 rounded-xl transition-all duration-200 shadow-2xs group"
                  >
                    <span>Full Schedule</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* 4 Conference Cards */}
                <div className="space-y-4">
                  {conferences.slice(0, 4).map((conf) => (
                    <article
                      key={conf.id}
                      className="group relative bg-gradient-to-br from-white via-[#fcfefe] to-[#f4f8fb] p-5 rounded-2xl border border-slate-200/90 hover:border-cyan-400/80 shadow-xs hover:shadow-xl hover:shadow-cyan-950/[0.07] transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col justify-between gap-3 min-h-[148px]"
                    >
                      {/* Top Animated Multicolor Accent Glow Line on Hover */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="space-y-2">
                        {/* Meta: Badge + Date */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold text-cyan-950 bg-cyan-50/90 border border-cyan-200/80 shadow-2xs">
                              {conf.acronym}
                            </span>
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                              {conf.dateRange}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            CFP Active
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/conferences/${conf.slug}`} className="block group/title">
                          <h4 className="text-base font-bold text-navy-950 group-hover/title:text-cyan-700 transition-colors leading-snug tracking-tight">
                            {conf.title}
                          </h4>
                        </Link>

                        {/* Location */}
                        <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 truncate max-w-[280px] sm:max-w-[360px]">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            {conf.location}
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-400">
                          Proceedings published with DOI
                        </span>
                        <Link
                          href={`/conferences/${conf.slug}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-700 to-cyan-800 hover:from-cyan-800 hover:to-cyan-900 text-white text-xs font-bold transition-all duration-200 shadow-2xs group/btn active:scale-95"
                        >
                          <span>CFP Details</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
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
