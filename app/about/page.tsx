"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck } from "lucide-react";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              title: "Academic Publishing",
              desc: "Flagship journals spanning foundational computation, biomedicine, physics, and materials.",
            },
            {
              title: "Digital Research Library",
              desc: "Semantic HTML-first reader with vector figures, LaTeX math, and instant citations.",
            },
            {
              title: "AI Research Assistant",
              desc: "Query papers, extract methodologies, cross-examine baselines, and surface contradictions.",
            },
            {
              title: "AI Editorial Workflow",
              desc: "Intake screening, reference verification, and reviewer expertise matching.",
            },
            {
              title: "Discovery Engine",
              desc: "Semantic search across 148,000+ papers linking multi-modal knowledge entities.",
            },
            {
              title: "Research Analytics",
              desc: "Altmetrics, field citation ratios, and emerging research gap identification.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-3 shadow-[0_2px_12px_-4px_rgba(15,30,60,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,78,112,0.14)] hover:border-cyan-500/40 hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden"
            >
              {/* Premium Top Gradient Accent Bar on Hover */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-600 via-[#004e70] to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Subtle Ambient Sheen on Hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 space-y-2.5">
                <h3 className="text-base sm:text-lg font-bold text-navy-950 group-hover:text-[#004e70] transition-colors duration-200 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  {item.desc}
                </p>
              </div>
            </div>
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

