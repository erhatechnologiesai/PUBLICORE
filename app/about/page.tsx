"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/BrandLogo";
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Cpu,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-left space-y-12">
        <div className="space-y-4">
          <Badge variant="teal" size="sm">Our Mission & Principles</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
            About PUBLICORE
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            PUBLICORE is an AI-native academic research, publishing, and research intelligence ecosystem engineered to eliminate friction in scientific dissemination while upholding rigorous, human-controlled peer review.
          </p>
        </div>

        {/* The 6 Pillars Diagram Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Academic Publishing", desc: "Flagship journals spanning foundational computation, biomedicine, physics, and materials.", icon: BookOpen },
            { title: "Digital Research Library", desc: "Semantic HTML-first reader with vector figures, LaTeX math, and instant citations.", icon: Compass },
            { title: "AI Research Assistant", desc: "Query papers, extract methodologies, cross-examine baselines, and surface contradictions.", icon: Sparkles },
            { title: "AI Editorial Workflow", desc: "Intake screening, reference verification, and reviewer expertise matching.", icon: Cpu },
            { title: "Discovery Engine", desc: "Semantic search across 148,000+ papers linking multi-modal knowledge entities.", icon: Compass },
            { title: "Research Analytics", desc: "Altmetrics, field citation ratios, and emerging research gap identification.", icon: ShieldCheck },
          ].map((item, idx) => (
            <Card key={idx} className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Core Principle Callout */}
        <div className="bg-navy-950 text-white rounded-2xl p-8 sm:p-10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Fundamental Governance Axiom
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            High-Stakes Scientific Decisions Remain Human-Controlled
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            In PUBLICORE, AI automates repetitive administrative work—intake extraction, plagiarism screening, formatting verification, and reviewer candidate suggestions. However, <strong>AI never makes final publication decisions</strong>. Every acceptance, revision request, and rejection is deliberated and authorized by human peer reviewers and editors.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

