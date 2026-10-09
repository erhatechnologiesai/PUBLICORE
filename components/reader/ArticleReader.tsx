"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Article } from "@/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import {
  Download,
  Share2,
  Bookmark,
  Quote,
  Eye,
  FileText,
  Moon,
  Sun,
  BookOpen,
  ZoomIn,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ArticleReaderProps {
  article: Article;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ article }) => {
  const [readerTheme, setReaderTheme] = useState<"light" | "sepia" | "dark">("light");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [fontFamily, setFontFamily] = useState<"sans" | "serif">("sans");
  const [activeSection, setActiveSection] = useState<string>("abstract");
  const [citationModalOpen, setCitationModalOpen] = useState<boolean>(false);
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [zoomFigure, setZoomFigure] = useState<any | null>(null);
  const [citationFormat, setCitationFormat] = useState<"BibTeX" | "RIS" | "APA" | "IEEE">("BibTeX");
  const [copied, setCopied] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const getBibtex = () => `@article{${article.slug},
  title = {${article.title}},
  author = {${article.authors.map((a) => a.name).join(" and ")}},
  journal = {${article.journalName}},
  volume = {${article.volume}},
  number = {${article.issue}},
  year = {2026},
  doi = {${article.doi}}
}`;

  const getFormattedCitation = () => {
    switch (citationFormat) {
      case "APA":
        return `${article.authors[0].name} et al. (2026). ${article.title}. ${article.journalName}, ${article.volume}(${article.issue}). https://doi.org/${article.doi}`;
      case "IEEE":
        return `[1] ${article.authors.map((a) => a.name).join(", ")}, "${article.title}," ${article.journalName}, vol. ${article.volume}, no. ${article.issue}, 2026, doi: ${article.doi}.`;
      case "RIS":
        return `TY  - JOUR\nTI  - ${article.title}\nAU  - ${article.authors[0].name}\nJO  - ${article.journalName}\nVL  - ${article.volume}\nIS  - ${article.issue}\nPY  - 2026\nDO  - ${article.doi}\nER  -`;
      default:
        return getBibtex();
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(getFormattedCitation());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeClasses = {
    light: "bg-[#F5F9FB] text-slate-900",
    sepia: "bg-[#F7F2E7] text-[#2C2416]",
    dark: "bg-[#0B1524] text-slate-100",
  };

  const fontClasses = {
    sm: "text-sm leading-relaxed",
    md: "text-base leading-relaxed",
    lg: "text-lg leading-loose",
  };

  const outlineItems = [
    { id: "abstract", label: "Abstract" },
    ...article.sections.map((s) => ({ id: s.id, label: s.heading })),
    ...(article.figures.length ? [{ id: "figures", label: "Figures & Images" }] : []),
    ...(article.tables.length ? [{ id: "tables", label: "Tables & Benchmarks" }] : []),
    ...(article.references.length ? [{ id: "references", label: "References" }] : []),
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses[readerTheme]}`}>
      {/* Top Floating Reading Controls Bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Breadcrumb Info */}
          <div className="flex items-center gap-2 truncate">
            <Link href="/journals" className="text-cyan-700 hover:underline">
              {article.journalName}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-mono text-[11px] truncate">
              Vol {article.volume}, Issue {article.issue}
            </span>
          </div>

          {/* Reader Preferences & Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setReaderTheme("light")}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  readerTheme === "light"
                    ? "bg-white text-navy-900 shadow-sm"
                    : "text-slate-500 hover:text-navy-900"
                }`}
                title="Light Mode"
              >
                Light
              </button>
              <button
                onClick={() => setReaderTheme("sepia")}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  readerTheme === "sepia"
                    ? "bg-[#EFE8D8] text-[#332A1C] shadow-sm"
                    : "text-slate-500 hover:text-navy-900"
                }`}
                title="Sepia Reading Mode"
              >
                Sepia
              </button>
              <button
                onClick={() => setReaderTheme("dark")}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  readerTheme === "dark"
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-white"
                }`}
                title="Dark Mode"
              >
                Dark
              </button>
            </div>

            {/* Font Family */}
            <button
              onClick={() => setFontFamily(fontFamily === "sans" ? "serif" : "sans")}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {fontFamily === "sans" ? "Serif" : "Sans"}
            </button>

            {/* Action CTAs */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCitationModalOpen(true)}
              className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            >
              <Quote className="w-3.5 h-3.5 mr-1" />
              Cite
            </Button>

            <Button
              variant="teal"
              size="sm"
              onClick={() => setPdfModalOpen(true)}
              className="shadow-sm"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              PDF
            </Button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1.5 rounded-lg border transition-colors ${
                bookmarked
                  ? "bg-cyan-50 border-cyan-400 text-cyan-700"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Bookmark Article"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Reader Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Metadata Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="teal" size="sm">
              {article.articleType}
            </Badge>
            {article.isOpenAccess && (
              <Badge variant="green" size="sm">
                Open Access CC-BY 4.0
              </Badge>
            )}
            <span className="text-xs text-slate-400 font-mono">
              DOI: {article.doi}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          {/* Authors and affiliations */}
          <div className="space-y-2 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {article.authors.map((author, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-navy-900 dark:text-slate-200">
                    {author.name}
                  </span>
                  {author.orcid && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-mono">
                      ORCID
                    </span>
                  )}
                  {author.isCorresponding && (
                    <span className="text-[10px] text-cyan-700 bg-cyan-50 px-1 py-0.2 rounded font-mono">
                      Corresponding
                    </span>
                  )}
                  {i < article.authors.length - 1 && <span className="text-slate-300">,</span>}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {article.authors[0].institution}
            </p>
          </div>

          {/* Publication Timeline & Metrics banner */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <span>Received: <strong>{article.receivedAt}</strong></span>
              <span>Accepted: <strong>{article.acceptedAt}</strong></span>
              <span>Published: <strong>{article.publishedAt}</strong></span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Quote className="w-3.5 h-3.5 text-cyan-600" />
                <strong>{article.metrics.citations}</strong> Citations
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-600" />
                <strong>{article.metrics.views.toLocaleString()}</strong> Views
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-cyan-600" />
                <strong>{article.metrics.downloads.toLocaleString()}</strong> Downloads
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Full Scholarly HTML Prose */}
          <div
            className={`lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm article-prose ${
              fontFamily === "serif" ? "font-serif" : "font-sans"
            } ${fontClasses[fontSize]}`}
          >
            {/* Abstract */}
            <section id="abstract" className="mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-navy-950 dark:text-white uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                Abstract
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {article.abstract}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400">Keywords:</span>
                {article.keywords.map((kw, idx) => (
                  <Badge key={idx} variant="navy" size="sm">
                    {kw}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Article Sections (Introduction, Formulation, Methods, etc.) */}
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-10">
                <h2>{section.heading}</h2>
                <div
                  className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: section.content
                      .replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">$$$1$$</div>')
                      .replace(/\$(.*?)\$/g, '<code class="px-1.5 py-0.5 bg-slate-100 rounded text-cyan-800 font-mono text-[0.9em]">$1</code>'),
                  }}
                />
              </section>
            ))}

            {/* Figures Gallery */}
            {article.figures.length > 0 && (
              <section id="figures" className="mb-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h2>Figures & Scientific Visualizations</h2>
                <div className="space-y-6">
                  {article.figures.map((fig) => (
                    <div
                      key={fig.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="relative group cursor-pointer" onClick={() => setZoomFigure(fig)}>
                        <img
                          src={fig.imageUrl}
                          alt={fig.title}
                          className="w-full h-80 object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2">
                          <ZoomIn className="w-5 h-5" />
                          <span className="text-xs font-semibold">Click to Zoom Figure</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-xs font-bold text-navy-950 dark:text-slate-100">
                          {fig.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {fig.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tables & Benchmarks */}
            {article.tables.length > 0 && (
              <section id="tables" className="mb-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h2>Tables & Quantitative Benchmarks</h2>
                {article.tables.map((tbl) => (
                  <div key={tbl.id} className="space-y-2 mb-6">
                    <h4 className="text-xs font-bold text-navy-950 dark:text-slate-100">
                      {tbl.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-2">{tbl.caption}</p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            {tbl.headers.map((h, idx) => (
                              <th key={idx} className="p-3">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {tbl.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 font-mono text-slate-700 dark:text-slate-300">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* References */}
            {article.references.length > 0 && (
              <section id="references" className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h2>References</h2>
                <div className="space-y-3">
                  {article.references.map((ref) => (
                    <div key={ref.id} className="text-xs text-slate-600 dark:text-slate-400 pl-6 relative">
                      <span className="absolute left-0 top-0 font-bold text-cyan-700">
                        [{ref.citationNumber}]
                      </span>
                      <p>
                        {ref.authors} ({ref.year}). {ref.title}.{" "}
                        <em className="text-slate-800 dark:text-slate-300">{ref.journal}</em>
                        {ref.volume && `, ${ref.volume}`}
                        {ref.pages && `, pp. ${ref.pages}`}.
                        {ref.doi && (
                          <span className="block mt-0.5 text-cyan-700 dark:text-cyan-400 font-mono text-[11px]">
                            doi:{ref.doi}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sticky Table of Contents, Metrics, AI Summary & Related Articles */}
          <div className="lg:col-span-4 sticky top-32 space-y-6">
            {/* Table of contents outline */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm text-left">
              <h4 className="text-xs font-bold text-navy-950 dark:text-slate-200 uppercase tracking-wider mb-3">
                Article Outline
              </h4>
              <nav className="space-y-1 text-xs">
                {outlineItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveSection(item.id)}
                    className={`block py-1.5 px-2 rounded-lg transition-colors truncate ${
                      activeSection === item.id
                        ? "text-cyan-700 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/40"
                        : "text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* AI Assistant Quick Insight Card */}
            <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-xl p-5 shadow-md space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Ask AI About This Paper
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Query methodology, benchmark validations, or explore potential research gaps stemming from this paper.
              </p>
              <Link href={`/ai/assistant?article=${article.slug}`}>
                <Button variant="teal" size="sm" className="w-full mt-1">
                  Launch Paper Copilot
                </Button>
              </Link>
            </div>

            {/* Article Metrics Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm text-left space-y-3">
              <h4 className="text-xs font-bold text-navy-950 dark:text-slate-200 uppercase tracking-wider">
                Article Intelligence Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-400">Altmetric Attention</p>
                  <p className="text-base font-extrabold text-cyan-700 dark:text-cyan-400 mt-0.5">
                    {article.metrics.altmetricScore}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-400">Field Citation Ratio</p>
                  <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                    {article.metrics.fieldCitationRatio}x
                  </p>
                </div>
              </div>
            </div>

            {/* Related Research */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm text-left space-y-3">
              <h4 className="text-xs font-bold text-navy-950 dark:text-slate-200 uppercase tracking-wider">
                Related Research
              </h4>
              <div className="space-y-3 text-xs">
                <Link
                  href="/articles/quantum-coherence-superconducting-qubits"
                  className="block group"
                >
                  <p className="font-semibold text-navy-900 dark:text-slate-200 group-hover:text-cyan-700 leading-snug">
                    Mitigating Non-Markovian Decoherence in Scalable Transmon Qubits
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Publicore Quantum Systems • 2026
                  </p>
                </Link>
                <Link
                  href="/articles/autonomous-swarm-robotics-distributed-coordination"
                  className="block group pt-2 border-t border-slate-100 dark:border-slate-800"
                >
                  <p className="font-semibold text-navy-900 dark:text-slate-200 group-hover:text-cyan-700 leading-snug">
                    Asynchronous Consensus and Swarm Coordination
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Publicore Transactions on AI • 2026
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Citation Modal */}
      <Modal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        title="Export Citation"
        description="Download or copy formatted bibliographic citation records"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["BibTeX", "APA", "IEEE", "RIS"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setCitationFormat(fmt)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  citationFormat === fmt
                    ? "bg-navy-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-60 text-navy-900">
            {getFormattedCitation()}
          </pre>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCitationModalOpen(false)}>
              Close
            </Button>
            <Button variant="teal" size="sm" onClick={handleCopyCitation}>
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Citation
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* PDF Download Simulation Modal */}
      <Modal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title="Download Article PDF"
        description="Official publication copy formatted under PUBLICORE standards"
      >
        <div className="space-y-4 text-center p-4">
          <div className="w-16 h-16 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-navy-900">{article.title}</h4>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              PUBLICORE-ART-{article.volume}-{article.issue}-OFFICIAL.pdf (2.4 MB)
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 text-left space-y-1">
            <p>✓ Includes full vector figures & tables</p>
            <p>✓ Embedded digital object identifier (DOI: {article.doi})</p>
            <p>✓ Open access license notice attached</p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setPdfModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={() => {
                alert("Simulated download: PDF compiled and retrieved.");
                setPdfModalOpen(false);
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download PDF (2.4 MB)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Figure Zoom Modal */}
      {zoomFigure && (
        <Modal
          isOpen={!!zoomFigure}
          onClose={() => setZoomFigure(null)}
          maxWidth="4xl"
          title={zoomFigure.title}
          description={zoomFigure.caption}
        >
          <div className="space-y-3">
            <img
              src={zoomFigure.imageUrl}
              alt={zoomFigure.title}
              className="w-full max-h-[70vh] object-contain rounded-lg border border-slate-200"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
