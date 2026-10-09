"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";

export default function NewsPage() {
  const news = [
    {
      title: "PUBLICORE Launches Automated JATS XML & DOI Pipeline Across All Flagship Journals",
      date: "October 04, 2026",
      category: "Platform Milestone",
      excerpt: "Accepted manuscripts are now indexed with Crossref DOIs within 6 hours of editorial sign-off, establishing an open-access speed record.",
    },
    {
      title: "Major Breakthrough in Histopathology Latent Diffusion Featured in PTAI",
      date: "September 29, 2026",
      category: "Research Spotlight",
      excerpt: "Dr. Elena Rostova and colleagues synthesize gigapixel tumor morphology validated by board-certified pathologists with 51% indistinguishability.",
    },
    {
      title: "Call for Papers Announced for ICAI 2026 Zurich Symposium",
      date: "September 18, 2026",
      category: "Conferences",
      excerpt: "Submissions open for foundation models in robotics, provable AI bounds, and neuromorphic edge sensor arrays.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">Dispatches & Press</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Research News & Editorial Updates
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Stay informed on journal milestones, research spotlights, and open science policy updates.
          </p>
        </div>

        <div className="space-y-4">
          {news.map((item, idx) => (
            <Card key={idx} hover className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="navy" size="sm">{item.category}</Badge>
                <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
              </div>
              <h3 className="text-lg font-bold text-navy-950 hover:text-cyan-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.excerpt}
              </p>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

