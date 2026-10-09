"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    { title: "Senior Managing Editor (Computer Science)", dept: "Editorial Operations", location: "London / Hybrid", type: "Full-Time" },
    { title: "Staff Research Engineer — Bibliometric AI", dept: "AI Engineering", location: "Zurich / Remote", type: "Full-Time" },
    { title: "Research Integrity & Ethics Specialist", dept: "Governance & COPE", location: "Boston / Remote", type: "Full-Time" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">Careers & Fellowships</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Join the PUBLICORE Team
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Build the next-generation AI-native publishing ecosystem and accelerate scientific discovery globally.
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <Card key={idx} hover className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="navy" size="sm">{job.dept}</Badge>
                  <span className="text-xs text-slate-400">{job.type}</span>
                </div>
                <h3 className="text-base font-bold text-navy-950">{job.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-700" /> {job.location}
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={() => alert(`Applied for ${job.title}`)}>
                Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

