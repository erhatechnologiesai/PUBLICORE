"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function ReviewersInfoPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">Peer Review Portal</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Reviewer Guidelines & Best Practices
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Join the PUBLICORE Peer Review Corps. Evaluate cutting-edge science with the assistance of AI consistency diagnostics.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-8 space-y-4">
            <h2 className="text-lg font-bold text-navy-950">The PUBLICORE Peer Review Standard</h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Double-Blind Confidentiality:</strong> Author identities are strictly masked from reviewers, and reviewer identities remain anonymized to ensure unbiased, merit-based scientific critique.
              </p>
              <p>
                <strong>AI Review Assistant Integration:</strong> Reviewers enjoy access to our AI copilot, which summarizes contribution highlights, checks mathematical reproducibility, and suggests key points of inquiry.
              </p>
              <p>
                <strong>Recognition & Credits:</strong> Every completed review earns verified Web of Science / ORCID peer review credits and priority publication waivers.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Link href="/dashboard/reviewer">
                <Button variant="teal" size="md">
                  Enter Reviewer Workspace <ArrowRight className="w-4 h-4 ml-1.5" />
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

