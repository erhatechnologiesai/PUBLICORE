"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { journalService } from "@/services";
import { Journal } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { BookOpen, ExternalLink, ArrowRight, CheckCircle2, Search } from "lucide-react";

export default function JournalsPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    journalService.getAll().then((data) => {
      setJournals(data);
      setLoading(false);
    });
  }, []);

  const filtered = journals.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.subject.toLowerCase().includes(query.toLowerCase()) ||
      j.topics.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">
            Peer-Reviewed Journal Portfolio
          </Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            PUBLICORE Academic Journals
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Our high-impact, open-access international journals span fundamental computation, biomedical engineering, physical sciences, and renewable energy.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-subtle mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search journals by discipline, topic, or title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <span className="text-xs text-slate-500 font-mono text-right">{filtered.length} Journals</span>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((j) => (
              <Card key={j.id} hover className="p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                      {j.shortTitle} • ISSN {j.issn}
                    </span>
                    {j.openAccess && (
                      <Badge variant="green" size="sm">
                        Open Access CC-BY 4.0
                      </Badge>
                    )}
                  </div>

                  <Link href={`/journals/${j.slug}`}>
                    <h2 className="text-xl font-bold text-navy-950 hover:text-cyan-700 transition-colors leading-snug">
                      {j.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {j.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400">Impact Factor</p>
                      <p className="text-base font-extrabold text-cyan-800">{j.metrics.impactFactor}</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400">CiteScore</p>
                      <p className="text-base font-extrabold text-cyan-800">{j.metrics.citescore}</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400">First Decision</p>
                      <p className="text-base font-extrabold text-navy-950">{j.metrics.timeToFirstDecisionDays}d</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Editor: <strong>{j.chiefEditor.name}</strong>
                  </span>
                  <Link href={`/journals/${j.slug}`}>
                    <Button variant="teal" size="sm">
                      Visit Journal <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
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

