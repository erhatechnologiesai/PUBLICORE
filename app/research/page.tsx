"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Sparkles, BookOpen, TrendingUp, Compass, ArrowRight } from "lucide-react";

export default function ResearchPortalPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left space-y-10">
        <div>
          <Badge variant="teal" size="sm" className="mb-2">Discovery Hub</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Research & Scholarly Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore peer-reviewed publications, investigate potential research gaps, and track global scientific trajectories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="p-6 space-y-4">
            <Sparkles className="w-8 h-8 text-cyan-600" />
            <h3 className="text-lg font-bold text-navy-950">AI Research Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Synthesize cross-disciplinary papers, dissect methodology derivations, and query citations.
            </p>
            <Link href="/ai/assistant">
              <Button variant="teal" size="sm" className="w-full">Open Assistant Workspace</Button>
            </Link>
          </Card>

          <Card hover className="p-6 space-y-4">
            <Compass className="w-8 h-8 text-cyan-700" />
            <h3 className="text-lg font-bold text-navy-950">Potential Research Gaps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discover literature contradictions, common bottlenecks, and under-researched areas across disciplines.
            </p>
            <Link href="/ai/gaps">
              <Button variant="outline" size="sm" className="w-full">Explore Research Gaps</Button>
            </Link>
          </Card>

          <Card hover className="p-6 space-y-4">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            <h3 className="text-lg font-bold text-navy-950">Emerging Research Trends</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track 5-year publication trajectories, fastest growing scientific concepts, and top institutions.
            </p>
            <Link href="/ai/trends">
              <Button variant="outline" size="sm" className="w-full">View Global Trends</Button>
            </Link>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

