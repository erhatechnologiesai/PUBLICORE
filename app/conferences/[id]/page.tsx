"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { conferenceService } from "@/services";
import { Conference } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Calendar, MapPin, Users, Send, CheckCircle2, Clock } from "lucide-react";

export default function ConferenceDetailPage() {
  const params = useParams();
  const slug = (params?.id as string) || "icai-2026";
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    conferenceService.getBySlug(slug).then((conf) => {
      setConference(conf);
      setLoading(false);
    });
  }, [slug]);

  if (loading || !conference) {
    return (
      <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
          <LoadingSkeleton rows={4} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="navy" size="sm">{conference.acronym}</Badge>
                <Badge variant="teal" size="sm">{conference.status}</Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                {conference.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  {conference.dateRange}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  {conference.location}
                </span>
              </div>
            </div>

            <Link href="/submit">
              <Button variant="teal" size="lg" className="shadow-sm">
                <Send className="w-4 h-4 mr-1.5" />
                Submit Conference Paper
              </Button>
            </Link>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-navy-950">About the Conference</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {conference.description}
              </p>

              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider pt-4 border-t border-slate-100">
                Conference Tracks & Topics:
              </h3>
              <div className="flex flex-wrap gap-2">
                {conference.topics.map((t, idx) => (
                  <Badge key={idx} variant="navy" size="md">{t}</Badge>
                ))}
              </div>
            </Card>

            {/* Keynote Speakers */}
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-navy-950">Featured Keynote Speakers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {conference.keynoteSpeakers.map((sp, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-800 text-white font-bold flex items-center justify-center text-sm shrink-0">
                      {sp.name.charAt(6)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950">{sp.name}</h4>
                      <p className="text-[11px] text-slate-500">{sp.affiliation}</p>
                      <p className="text-[11px] text-cyan-700 italic mt-0.5">"{sp.topic}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sticky Important Dates */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-700" />
                Important Milestone Dates
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Paper Submission</span>
                  <p className="font-bold text-navy-950 mt-0.5">{conference.importantDates.submissionDeadline}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Author Notification</span>
                  <p className="font-bold text-navy-950 mt-0.5">{conference.importantDates.notificationDate}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Camera-Ready Version</span>
                  <p className="font-bold text-navy-950 mt-0.5">{conference.importantDates.cameraReady}</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                  <span className="text-[10px] text-cyan-800 font-bold uppercase block">Conference Dates</span>
                  <p className="font-bold text-cyan-950 mt-0.5">{conference.importantDates.conferenceDates}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
