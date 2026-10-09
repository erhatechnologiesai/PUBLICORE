"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What role does AI play in manuscript acceptance decisions?",
      a: "AI does NOT independently make acceptance or rejection decisions. High-stakes editorial choices remain strictly under the governance of qualified human academic editors. AI assists by automating formatting checks, extracting citations, checking scope fit, and identifying reviewer expertise matches.",
    },
    {
      q: "Are all published articles Open Access?",
      a: "Yes. All PUBLICORE journals publish under the Creative Commons Attribution 4.0 International (CC-BY 4.0) license, enabling free global reading, downloading, and reuse with proper attribution.",
    },
    {
      q: "How does the AI Reviewer Matching algorithm prevent conflicts of interest?",
      a: "The system runs automated cross-checks against the author's co-authorship history over the prior 48 months, institutional email domain overlaps, and active grant collaborations before ranking candidate reviewers.",
    },
    {
      q: "What formats can I upload during manuscript submission?",
      a: "Our automated intake agent natively parses PDF, Microsoft Word (.docx), and LaTeX source archives (.tar.gz, .zip).",
    },
    {
      q: "How are DOIs registered?",
      a: "Accepted manuscripts automatically trigger JATS XML generation and Crossref metadata deposit within our automated production desk.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">Knowledge Base</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Common inquiries regarding editorial workflows, AI screening policies, and open-access publishing.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              className="p-5 cursor-pointer transition-all hover:border-slate-300"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-600 shrink-0" />
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openIdx === idx ? "transform rotate-180" : ""
                  }`}
                />
              </div>

              {openIdx === idx && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
                  {faq.a}
                </p>
              )}
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

