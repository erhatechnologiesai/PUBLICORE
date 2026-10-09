"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Send, FileText, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">Author Gateway</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Author Guidelines & Publishing Services
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Learn about our AI-assisted manuscript intake, open-access licensing, and transparent review milestones.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-8 space-y-4">
            <h2 className="text-xl font-bold text-navy-950">Why Publish With PUBLICORE?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <Sparkles className="w-5 h-5 text-cyan-600" />
                <h4 className="text-xs font-bold text-navy-950">AI Intake Assistance</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Upload raw PDFs or LaTeX packages; our AI extracts metadata and flags formatting issues instantly.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="text-xs font-bold text-navy-950">Double-Blind Integrity</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Rigorous, confidential peer review governed exclusively by human academic editors.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-bold text-navy-950">Rapid Dissemination</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Average 24 days to first decision with instant Crossref DOI registration upon acceptance.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Link href="/submit">
                <Button variant="teal" size="md">
                  <Send className="w-4 h-4 mr-1.5" /> Start Manuscript Submission
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

