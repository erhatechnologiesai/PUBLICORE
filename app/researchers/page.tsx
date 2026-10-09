"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_USERS } from "@/mock/data";
import { Search, Quote, BookOpen, ExternalLink } from "lucide-react";

export default function ResearchersDirectoryPage() {
  const [query, setQuery] = useState("");
  const scholars = MOCK_USERS;

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">
            Global Scholarly Registry
          </Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Researchers & Authors Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Discover validated principal investigators, contributing scholars, and peer reviewers indexed with verified ORCIDs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholars.map((s) => (
            <Card key={s.id} hover className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {s.name.charAt(4)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-950">{s.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{s.institution}</p>
                  {s.orcid && (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded">
                      ORCID: {s.orcid}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400">h-Index</p>
                  <p className="font-bold text-navy-950">{s.hIndex || 30}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400">Papers</p>
                  <p className="font-bold text-navy-950">{s.publicationsCount || 40}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400">Citations</p>
                  <p className="font-bold text-navy-950">{s.citationsCount?.toLocaleString() || "1,200"}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {s.researchInterests.slice(0, 2).map((interest, i) => (
                  <Badge key={i} variant="navy" size="sm">{interest}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

