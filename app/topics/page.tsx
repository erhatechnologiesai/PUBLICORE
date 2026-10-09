"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkles, Layers, Cpu, Database, Compass, Globe2, BarChart3, ArrowRight } from "lucide-react";

export default function TopicsPage() {
  const topics = [
    { title: "Multimodal Foundation Models", category: "Artificial Intelligence", count: "12,480 papers", desc: "Vision-language-audio representations and cross-modal attention mechanics." },
    { title: "Spatial Transcriptomics & Oncology", category: "Life Sciences", count: "8,920 papers", desc: "In-situ genomic sequencing coupled with cellular morphological staining." },
    { title: "Superconducting Qubit Coherence", category: "Quantum Physics", count: "4,310 papers", desc: "Decoherence suppression, dynamical decoupling, and surface code architectures." },
    { title: "Solid-State Argyrodite Batteries", category: "Materials & Energy", count: "6,140 papers", desc: "Sub-zero ionic conductivity, sulfide interfaces, and dendrite inhibition." },
    { title: "Byzantine-Resilient Swarm Kinematics", category: "Robotics", count: "3,820 papers", desc: "Decentralized consensus under GPS denial and packet loss disruptions." },
    { title: "Bayesian Closed-Loop Laboratories", category: "Bioengineering", count: "2,940 papers", desc: "Self-driving automated laboratory workflows and robotic liquid handlers." },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">
            Disciplinary Taxonomy
          </Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Research Topics & Fields
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore curated topic dossiers, track emerging keyword trends, and discover cross-disciplinary papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((top, idx) => (
            <Card key={idx} hover className="p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <Badge variant="navy" size="sm">{top.category}</Badge>
                <h3 className="text-base font-bold text-navy-950">{top.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{top.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">{top.count}</span>
                <Link href={`/search?q=${encodeURIComponent(top.title)}`}>
                  <Button variant="outline" size="sm">
                    Explore Topic <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

