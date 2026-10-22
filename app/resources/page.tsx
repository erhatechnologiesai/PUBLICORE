"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, Download, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

export default function ResourcesPage() {
  const resources = [
    { title: "PUBLICORE LaTeX Manuscript Template (v3.2)", type: "ZIP / LaTeX", size: "1.4 MB", desc: "Official two-column template formatted with standard scholarly and Nature bibliography compatibility." },
    { title: "MS Word Author Template (.dotx)", type: "DOCX", size: "480 KB", desc: "Structured macro-free Word template with pre-configured heading styles and equation fields." },
    { title: "AI Ethical Screening Disclosure Guidelines", type: "PDF Guide", size: "320 KB", desc: "Mandatory declarations when employing generative models during research workflows." },
    { title: "Open Science & Data Reproducibility Framework", type: "PDF Guide", size: "610 KB", desc: "Standards for depositing raw datasets into Zenodo, Figshare, or Dryad repositories." },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">Author & Reviewer Toolkit</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Academic Resources & Guidelines
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Download certified publishing templates, consult ethics manuals, and review data availability standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res, idx) => (
            <Card key={idx} hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="navy" size="sm">{res.type}</Badge>
                  <span className="text-[11px] font-mono text-slate-400">{res.size}</span>
                </div>
                <h3 className="text-base font-bold text-navy-950">{res.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{res.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Simulated download: ${res.title}`)}
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Download Resource
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

