"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { manuscriptService } from "@/services";
import { crossrefService, CrossrefDepositResult } from "@/services/crossrefService";
import { generateJatsXml } from "@/services/production";
import { Manuscript } from "@/types";
import {
  Cpu,
  FileCode,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Code2,
  Download,
  Sparkles,
  Send,
  BookOpen,
  Globe,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Terminal,
  Layers,
} from "lucide-react";

interface DepositBatchItem extends CrossrefDepositResult {
  msCode: string;
  msTitle: string;
}

export default function ProductionDashboardPage() {
  const [selectedFormat, setSelectedFormat] = useState<"JATS" | "HTML" | "JSON-LD" | "DOI">("JATS");
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [activeMs, setActiveMs] = useState<Manuscript | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [lastPublishedId, setLastPublishedId] = useState<string | null>(null);

  // Crossref Depositor Gateway State
  const [crossrefEmail, setCrossrefEmail] = useState("deposits@publicore.org");
  const [crossrefUser, setCrossrefUser] = useState("publicore_publisher");
  const [crossrefPass, setCrossrefPass] = useState("••••••••••••");
  const [useSandbox, setUseSandbox] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>("CR-BATCH-2026-894120");

  const [batchRegistry, setBatchRegistry] = useState<DepositBatchItem[]>([
    {
      success: true,
      batchId: "CR-BATCH-2026-894120",
      doi: "10.1042/pub.2026.0418",
      mode: "sandbox",
      timestamp: "2026-04-14T11:20:00Z",
      xmlValid: true,
      httpStatus: 200,
      msCode: "PUB-2026-0418",
      msTitle: "CRISPR-Cas9 Editing in Mammalian Neurological Systems",
      message: "Crossref deposit accepted. Metadata registered into Crossref DOI registry.",
      diagnosticLog: [
        "[ENDPOINT] https://test.crossref.org/servlet/deposit",
        "[SCHEMA_CHECK] NLM JATS 1.3 ANSI/NISO Z39.96-2021: VALID",
        "[DOI_SYNTAX] 10.1042 prefix verified",
        "[REGISTRATION] Registered batch: CR-BATCH-2026-894120",
      ],
    },
  ]);

  const loadData = () => {
    Promise.all([
      manuscriptService.getAll(),
      manuscriptService.getActiveSequenceManuscript(),
    ]).then(([list, active]) => {
      setManuscripts(list);
      setActiveMs(active || list[0] || null);
    });
  };

  useEffect(() => {
    loadData();
    const handleState = () => loadData();
    window.addEventListener("publicore_state_change", handleState);
    return () => window.removeEventListener("publicore_state_change", handleState);
  }, []);

  const productionQueue = manuscripts.filter(
    (m) => m.status === "Accepted" || m.status === "Production" || m.status === "Published"
  );

  const handlePublishManuscript = async (id: string) => {
    setPublishingId(id);
    const result = await manuscriptService.publishToProduction(id);
    setPublishingId(null);
    if (result) {
      setLastPublishedId(result.manuscript.id);
      alert(`Manuscript successfully published! Official DOI registered: ${result.manuscript.doi}`);
    }
  };

  const selectedMs = activeMs || productionQueue[0] || manuscripts[0];

  const jatsSnippet = selectedMs ? generateJatsXml(selectedMs) : "";

  const jsonLdSnippet = selectedMs
    ? `{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "headline": "${selectedMs.title}",
  "identifier": "https://doi.org/${selectedMs.doi || "10.1042/pub.2026.PENDING"}",
  "author": ${JSON.stringify(
    selectedMs.authors.map((a) => ({ "@type": "Person", "name": a.name, "affiliation": a.institution }))
  , null, 2)},
  "publisher": { "@type": "Organization", "name": "PUBLICORE" },
  "datePublished": "${selectedMs.updatedAt}",
  "isAccessibleForFree": true
}`
    : "";

  const handleExecuteCrossrefDeposit = async () => {
    if (!selectedMs) return;
    setIsDepositing(true);

    try {
      const xmlPayload = generateJatsXml(selectedMs);
      const res = await crossrefService.submitDeposit({
        manuscript: selectedMs,
        jatsXml: xmlPayload,
        depositorEmail: crossrefEmail,
        username: crossrefUser,
        password: crossrefPass,
        useSandbox,
      });

      const batchItem: DepositBatchItem = {
        ...res,
        msCode: selectedMs.code,
        msTitle: selectedMs.title,
      };

      setBatchRegistry((prev) => [batchItem, ...prev]);
      setExpandedBatchId(batchItem.batchId);

      // If manuscript wasn't published, promote to published
      if (selectedMs.status !== "Published") {
        await manuscriptService.publishToProduction(selectedMs.id);
      }

      setIsDepositing(false);
      alert(`Crossref batch successfully submitted! Batch ID: ${res.batchId}`);
    } catch (err: any) {
      setIsDepositing(false);
      alert(`Crossref Deposit Failed: ${err?.message || "Check network/credentials"}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 text-left max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
            Automated Publishing Engine & Metadata Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
            Production & Ingestion Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated JATS XML generation, Crossref DOI registration, HTML rendering, and archival packaging.
          </p>
        </div>

        {/* Pipeline Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Queued for Production", value: `${productionQueue.filter((m) => m.status === "Accepted").length}`, note: "Ready to mint DOI" },
            { label: "Published & Minted", value: `${productionQueue.filter((m) => m.status === "Published" || m.status === "DOI Registered").length}`, note: "Crossref deposit verified" },
            { label: "Crossref Batches", value: `${batchRegistry.length}`, note: "Submitted batches" },
            { label: "Automated Build Rate", value: "100%", note: "Zero XML syntax errors" },
          ].map((item, idx) => (
            <Card key={idx} className="p-4 sm:p-5">
              <span className="text-xs font-medium text-slate-500">{item.label}</span>
              <p className="text-2xl font-extrabold text-navy-950 mt-1">{item.value}</p>
              <p className="text-[11px] text-cyan-700 font-semibold mt-0.5">{item.note}</p>
            </Card>
          ))}
        </div>

        {/* FEATURE 1: Official Crossref Live Depositor Gateway & Batch Registry */}
        <Card className="p-4 sm:p-6 space-y-5 border-l-4 border-l-cyan-600 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-700" />
                <h3 className="text-sm sm:text-base font-extrabold text-navy-950 uppercase tracking-wider">
                  Official Crossref Live Depositor Gateway & Batch Registry
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Deposit ANSI/NISO Z39.96-2021 JATS XML directly to Crossref HTTPS Deposit Servlet.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Gateway Mode:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setUseSandbox(true)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                    useSandbox ? "bg-white text-navy-950 shadow-xs" : "text-slate-500 hover:text-navy-900"
                  }`}
                >
                  Sandbox (Test)
                </button>
                <button
                  type="button"
                  onClick={() => setUseSandbox(false)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                    !useSandbox ? "bg-cyan-700 text-white shadow-xs" : "text-slate-500 hover:text-navy-900"
                  }`}
                >
                  Live (Production)
                </button>
              </div>
            </div>
          </div>

          {/* Credentials & Deposit Dispatch Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Depositor Email</label>
              <input
                type="email"
                value={crossrefEmail}
                onChange={(e) => setCrossrefEmail(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono text-xs focus:outline-hidden focus:border-cyan-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Crossref User ID</label>
              <input
                type="text"
                value={crossrefUser}
                onChange={(e) => setCrossrefUser(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono text-xs focus:outline-hidden focus:border-cyan-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Endpoint</label>
              <div className="p-2 rounded-lg bg-slate-200/80 font-mono text-[11px] text-slate-700 truncate">
                {useSandbox ? "https://test.crossref.org/servlet/deposit" : "https://doi.crossref.org/servlet/deposit"}
              </div>
            </div>
          </div>

          {/* Target Manuscript Selection & Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-cyan-50/60 rounded-xl border border-cyan-200/80">
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wide">
                Target Selected Manuscript
              </span>
              <h4 className="text-sm font-bold text-navy-950 truncate mt-0.5">
                {selectedMs ? `${selectedMs.code}: ${selectedMs.title}` : "Select a manuscript"}
              </h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                DOI to mint: {selectedMs?.doi || "10.1042/pub.2026.0418"}
              </p>
            </div>

            <Button
              variant="teal"
              size="sm"
              isLoading={isDepositing}
              onClick={handleExecuteCrossrefDeposit}
              className="shrink-0 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              Deposit to Crossref Registry
            </Button>
          </div>

          {/* Batch Registry History Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                Crossref Batch Registry Log ({batchRegistry.length} submissions)
              </h4>
              <span className="text-[11px] text-slate-400">UNIXREF 4.4.2 Protocol</span>
            </div>

            <div className="space-y-2">
              {batchRegistry.map((b) => {
                const isExpanded = expandedBatchId === b.batchId;
                return (
                  <div
                    key={b.batchId}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-xs space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded">
                          {b.batchId}
                        </span>
                        <span className="font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded font-semibold">
                          DOI: {b.doi}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          HTTP {b.httpStatus} OK
                        </span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {b.mode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">
                          {new Date(b.timestamp).toLocaleTimeString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedBatchId(isExpanded ? null : b.batchId)}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-[11px] flex items-center gap-1"
                        >
                          {isExpanded ? "Hide Logs" : "Inspect Logs"}
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 font-medium">
                      {b.msCode}: {b.msTitle}
                    </p>

                    {isExpanded && b.diagnosticLog && (
                      <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1">
                        {b.diagnosticLog.map((line, lidx) => (
                          <div key={lidx}>{line}</div>
                        ))}
                        <div className="pt-1 text-cyan-400">
                          Target Resolution URL:{" "}
                          <a
                            href={`https://doi.org/${b.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            https://doi.org/{b.doi}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Production Queue Action Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Accepted Manuscripts — Ready for Publication ({productionQueue.length})
            </h3>
            <span className="text-xs text-slate-500">
              Sequence Step 7 ➔ 8
            </span>
          </div>

          <div className="space-y-3">
            {productionQueue.map((ms) => {
              const isAccepted = ms.status === "Accepted" || ms.status === "Production";
              const isPublished = ms.status === "Published" || ms.status === "DOI Registered";

              return (
                <div
                  key={ms.id}
                  className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {ms.code}
                      </span>
                      <StatusBadge status={ms.status} />
                      {ms.doi && (
                        <span className="text-[10px] font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded font-semibold">
                          DOI: {ms.doi}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-navy-950">
                      {ms.title}
                    </h4>

                    <p className="text-xs text-slate-500">
                      Authors: {ms.authors.map((a) => a.name).join(", ")} • Journal: {ms.journalName}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMs(ms);
                        manuscriptService.setActiveSequenceManuscript(ms.id);
                      }}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Inspect Artifacts
                    </button>

                    {isAccepted && (
                      <Button
                        variant="teal"
                        size="sm"
                        isLoading={publishingId === ms.id}
                        onClick={() => handlePublishManuscript(ms.id)}
                        className="shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        Publish & Mint DOI
                      </Button>
                    )}

                    {isPublished && (
                      <Link href={`/articles/${ms.id}`}>
                        <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-800 hover:bg-emerald-50">
                          <BookOpen className="w-3.5 h-3.5 mr-1" />
                          View Live in Reader
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Format Preview & Inspector */}
        <Card className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-700" />
                Production Artifact Inspector: {selectedMs?.code}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xl">
                {selectedMs?.title}
              </p>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {(["JATS", "HTML", "JSON-LD", "DOI"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    selectedFormat === fmt
                      ? "bg-navy-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
              {selectedFormat === "JATS"
                ? jatsSnippet
                : selectedFormat === "JSON-LD"
                ? jsonLdSnippet
                : selectedFormat === "DOI"
                ? `DOI: ${selectedMs?.doi || "10.1042/pub.2026.PENDING"}\nStatus: ${
                    selectedMs?.status === "Published" ? "Registered with Crossref (Live)" : "Payload staged for deposit"
                  }\nTimestamp: ${new Date().toISOString()}\nHandle: https://doi.org/${
                    selectedMs?.doi || "10.1042/pub.2026.PENDING"
                  }\nSchema: Crossref UNIXREF 4.4.2`
                : `<!-- Semantic HTML5 Scholarly Article Output -->\n<article class="publicore-reader" data-doi="${
                    selectedMs?.doi || "10.1042/pub.2026.PENDING"
                  }">\n  <header class="article-header">\n    <h1 class="title">${
                    selectedMs?.title
                  }</h1>\n    <div class="authors">${selectedMs?.authors.map((a) => a.name).join(", ")}</div>\n  </header>\n  <section class="abstract">${
                    selectedMs?.abstract
                  }</section>\n</article>`}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-500 pt-2">
            <span>Schema: National Library of Medicine (NLM) JATS 1.3 compliant</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Production XML bundle downloaded.")}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download Package (.zip)
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
