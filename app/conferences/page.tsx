"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { conferenceService } from "@/services";
import { Conference } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Calendar, MapPin, Users, ArrowRight, ExternalLink } from "lucide-react";

export default function ConferencesPage() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    conferenceService.getAll().then((data) => {
      setConferences(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">
            Academic Symposia & Proceedings
          </Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Scholarly Conferences & Events
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore global conferences sponsored by PUBLICORE, track call-for-papers deadlines, and discover peer-reviewed proceedings.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <div className="space-y-6">
            {conferences.map((conf) => (
              <Card key={conf.id} hover className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="navy" size="sm">{conf.acronym}</Badge>
                      <Badge variant="teal" size="sm">{conf.status}</Badge>
                      <span className="text-xs text-slate-400 font-mono">Proceedings in PTAI</span>
                    </div>

                    <Link href={`/conferences/${conf.slug}`}>
                      <h2 className="text-xl font-bold text-navy-950 hover:text-cyan-700 transition-colors">
                        {conf.title}
                      </h2>
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                        {conf.dateRange}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                        {conf.location}
                      </span>
                    </div>
                  </div>

                  <Link href={`/conferences/${conf.slug}`}>
                    <Button variant="teal" size="sm">
                      View CFP & Schedule <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {conf.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {conf.topics.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-400 font-medium">
                    Submission Deadline: <strong>{conf.importantDates.submissionDeadline}</strong>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

