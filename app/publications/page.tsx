"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookOpen, Calendar, Send, FileText, ArrowRight } from "lucide-react";

export default function PublicationsHubPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left space-y-10">
        <div>
          <Badge variant="teal" size="sm" className="mb-2">Publications Index</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            PUBLICORE Publishing Ecosystem
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Browse our complete collection of international journals, conference proceedings, preprints, and research topics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="p-6 space-y-4">
            <BookOpen className="w-8 h-8 text-cyan-700" />
            <h3 className="text-lg font-bold text-navy-950">Peer-Reviewed Journals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flagship international journals with high impact factors and rigorous double-blind peer review.
            </p>
            <Link href="/journals">
              <Button variant="teal" size="sm" className="w-full">Browse All Journals</Button>
            </Link>
          </Card>

          <Card hover className="p-6 space-y-4">
            <FileText className="w-8 h-8 text-cyan-600" />
            <h3 className="text-lg font-bold text-navy-950">Published Articles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access individual research articles in our HTML-first scholarly reader with vector figures and math.
            </p>
            <Link href="/articles">
              <Button variant="outline" size="sm" className="w-full">Read Articles</Button>
            </Link>
          </Card>

          <Card hover className="p-6 space-y-4">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <h3 className="text-lg font-bold text-navy-950">Conferences & Proceedings</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Annual international symposia proceedings with indexed digital object identifiers (DOIs).
            </p>
            <Link href="/conferences">
              <Button variant="outline" size="sm" className="w-full">View Conferences</Button>
            </Link>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

