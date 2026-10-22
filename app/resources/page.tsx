"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import {
  FileText,
  Download,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Search,
  CheckCircle2,
  FileCode,
  Layers,
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  category: "Templates" | "Ethics & COPE" | "Data & Open Science";
  type: string;
  size: string;
  filename: string;
  desc: string;
  content: string;
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resources: ResourceItem[] = [
    {
      id: "res-latex",
      title: "PUBLICORE LaTeX Manuscript Template (v3.2)",
      category: "Templates",
      type: "LaTeX (.tex)",
      size: "1.4 MB",
      filename: "publicore_manuscript_template_v3.2.tex",
      desc: "Official two-column LaTeX template formatted with standard scholarly equations, vector figure wrappers, and Nature/IEEE BibTeX styles.",
      content: `% PUBLICORE Scholarly Publishing Platform Template v3.2
\\documentclass[10pt,journal,compsoc]{IEEEtran}
\\usepackage{amsmath,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}

\\begin{document}
\\title{Your High-Impact Scholarly Manuscript Title Here}
\\author{Author One, Author Two, and Author Three
\\thanks{Manuscript submitted to PUBLICORE Open Access Platform.}}

\\markboth{PUBLICORE DIGITAL REPOSITORY, VOL. 14, NO. 8, 2026}%
{Shell \\MakeLowercase{\\textit{et al.}}: Bare Demo of IEEEtran.cls for Computer Science Journals}

\\maketitle

\\begin{abstract}
Your structured abstract summarizing objective, methodology, empirical findings, and scientific significance goes here.
\\end{abstract}

\\begin{IEEEkeywords}
Artificial Intelligence, Scholarly Communication, Peer Review, Open Access.
\\end{IEEEkeywords}

\\section{Introduction}
Scientific progress relies on verifiable, reproducible research methodologies...

\\end{document}`,
    },
    {
      id: "res-word",
      title: "MS Word Author Template (.dotx)",
      category: "Templates",
      type: "DOCX (.docx)",
      size: "480 KB",
      filename: "publicore_author_guidelines_template.txt",
      desc: "Structured macro-free Word template with pre-configured heading styles, high-res image placeholders, and equation formatting.",
      content: `PUBLICORE SCHOLARLY PUBLISHING TEMPLATE (MS WORD COMPATIBLE)
=============================================================
Title: [Insert Manuscript Title Here]
Authors: [Author Names, Affiliations, ORCID Identifiers]

Abstract (Max 250 words):
Summarize research hypothesis, method, quantitative results, and conclusions.

Keywords: 4-6 comma-separated keywords.

1. INTRODUCTION
State background, gap in scientific literature, and principal contributions.

2. METHODOLOGY & DATASETS
Specify experimental parameters, cohort sizes, and baseline benchmarks.

3. RESULTS & EMPIRICAL FINDINGS
Provide statistical significance metrics (p-values, confidence intervals).

4. DISCUSSION & LIMITATIONS
Address potential confounders and generalizability boundaries.

5. DATA AVAILABILITY STATEMENT
Mandatory statement identifying persistent data repository (e.g. Zenodo DOI).`,
    },
    {
      id: "res-ethics",
      title: "AI Ethical Screening Disclosure Guidelines",
      category: "Ethics & COPE",
      type: "PDF / Markdown Guide",
      size: "320 KB",
      filename: "publicore_ai_ethics_disclosure_policy_2026.md",
      desc: "Mandatory declarations when employing generative models during research workflows, literature extraction, or code synthesis.",
      content: `# PUBLICORE COPE Compliance: Generative AI Disclosure Framework (2026)
## Section 1: Authorship Integrity
Generative AI tools (LLMs, code generation assistants) do not qualify as authors under COPE principles.

## Section 2: Required Manuscript Declaration
Authors must include a statement in the Methods section:
"During preparation of this work, the authors employed [Model/Tool Name] for [purpose: e.g. syntax checking, code scaffolding]. All empirical results and data interpretations were verified by the authors."

## Section 3: Hallucination & Factuality Screening
Manuscripts will undergo automated citation graph cross-checks to verify all cited references exist in verified indexes (Crossref, PubMed, Scopus).`,
    },
    {
      id: "res-data",
      title: "Open Science & Data Reproducibility Framework",
      category: "Data & Open Science",
      type: "PDF Guide",
      size: "610 KB",
      filename: "publicore_open_data_standards.md",
      desc: "Standards for depositing raw datasets into Zenodo, Figshare, or Dryad repositories with FAIR compliance.",
      content: `# FAIR Data Standards for PUBLICORE Publications
1. Findable: Assign persistent DOIs to raw experimental data.
2. Accessible: Store in unrestricted public repositories (Zenodo, Dryad, Figshare).
3. Interoperable: Use standardized CSV, HDF5, JSON-LD, or parquet schemas.
4. Reusable: Apply CC0 or CC-BY open science licensing.`,
    },
  ];

  const categories = ["All", "Templates", "Ethics & COPE", "Data & Open Science"];

  const filtered = resources.filter((res) => {
    const matchesCat = activeCategory === "All" || res.category === activeCategory;
    const matchesQ =
      !searchQuery ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  const handleDownload = (res: ResourceItem) => {
    setDownloadingId(res.id);

    setTimeout(() => {
      // Create and trigger direct browser blob download
      const blob = new Blob([res.content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = res.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingId(null);
      if (!downloadedIds.includes(res.id)) {
        setDownloadedIds([...downloadedIds, res.id]);
      }
      setToastMessage(`Downloaded ${res.filename} successfully!`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <Badge variant="teal" size="sm">
            Author & Reviewer Toolkit
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Academic Resources & Guidelines
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Download certified publishing templates, consult ethics manuals, and review data availability standards for global open access.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter resources by name, format, or category..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeCategory === c
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
              <FileCode className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
              <p className="text-sm font-semibold">No toolkit resources match your current filter.</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-cyan-700 hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filtered.map((res) => {
              const isDownloaded = downloadedIds.includes(res.id);
              const isDownloading = downloadingId === res.id;

              return (
                <Card
                  key={res.id}
                  hover
                  className="p-6 space-y-4 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="navy" size="sm">
                          {res.category}
                        </Badge>
                        <span className="text-[11px] font-mono font-medium text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                          {res.type}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{res.size}</span>
                    </div>

                    <h3 className="text-base font-bold text-navy-950 leading-snug">
                      {res.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {res.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                      {res.filename}
                    </span>

                    <Button
                      variant={isDownloaded ? "outline" : "teal"}
                      size="sm"
                      disabled={isDownloading}
                      onClick={() => handleDownload(res)}
                      className="shadow-sm"
                    >
                      {isDownloading ? (
                        "Downloading..."
                      ) : isDownloaded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Downloaded
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 mr-1" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </main>

      {toastMessage && (
        <Toast
          type="success"
          title="Toolkit Download"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      <Footer />
    </div>
  );
}
