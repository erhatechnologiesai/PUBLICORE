"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import {
  Briefcase,
  MapPin,
  ArrowRight,
  Search,
  CheckCircle2,
  Upload,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  dept: string;
  location: string;
  type: string;
  experience: string;
  description: string;
}

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantOrcid, setApplicantOrcid] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const jobs: Job[] = [
    {
      id: "job-1",
      title: "Senior Managing Editor (Computer Science)",
      dept: "Editorial Operations",
      location: "London / Hybrid",
      type: "Full-Time",
      experience: "5+ years",
      description: "Direct double-blind peer review pipelines, lead editorial board assemblies, and enforce COPE ethical integrity standards across computational periodicals.",
    },
    {
      id: "job-2",
      title: "Staff Research Engineer — Bibliometric AI",
      dept: "AI Engineering",
      location: "Zurich / Remote",
      type: "Full-Time",
      experience: "3+ years",
      description: "Train and deploy neural citation graph representations, automated methodology verification models, and AI screening engines for scientific discovery.",
    },
    {
      id: "job-3",
      title: "Research Integrity & Ethics Specialist",
      dept: "Governance & COPE",
      location: "Boston / Remote",
      type: "Full-Time",
      experience: "4+ years",
      description: "Supervise automated conflict-of-interest detection algorithms, conduct retraction investigations, and uphold international COPE publishing standards.",
    },
    {
      id: "job-4",
      title: "JATS XML & Production Systems Specialist",
      dept: "Production Systems",
      location: "Remote",
      type: "Full-Time",
      experience: "2+ years",
      description: "Architect automated XML typesetting pipelines, NISO Z39.96 validation schemas, and real-time Crossref DOI deposit batch workflows.",
    },
  ];

  const departments = ["All", "Editorial Operations", "AI Engineering", "Governance & COPE", "Production Systems"];

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === "All" || job.dept === selectedDept;
    const matchesQ =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQ;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `APP-PUB-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(ref);
      setIsSubmitting(false);
      setToastMessage(`Application submitted for ${applyingJob?.title}! Ref: ${ref}`);
    }, 800);
  };

  const handleResetModal = () => {
    setApplyingJob(null);
    setSubmittedRef(null);
    setApplicantName("");
    setApplicantEmail("");
    setApplicantOrcid("");
    setCoverNote("");
    setFileName(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <Badge variant="teal" size="sm">
            Careers & Fellowships
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Join the PUBLICORE Team
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Build the next-generation AI-native publishing ecosystem and accelerate scientific discovery globally with verified open access.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles by keyword, domain, or location..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {departments.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDept(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedDept === d
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
              <Briefcase className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
              <p className="text-sm font-semibold">No open positions matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedDept("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-cyan-700 hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Card
                key={job.id}
                hover
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="navy" size="sm">
                      {job.dept}
                    </Badge>
                    <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {job.type}
                    </span>
                    <span className="text-[11px] font-medium text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                      Exp: {job.experience}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-950 leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {job.description}
                  </p>

                  <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-700" /> {job.location}
                  </p>
                </div>

                <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Button
                    variant="teal"
                    size="sm"
                    onClick={() => setApplyingJob(job)}
                    className="w-full sm:w-auto shadow-sm"
                  >
                    Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Interactive Application Modal */}
      {applyingJob && (
        <Modal
          isOpen={true}
          onClose={handleResetModal}
          title={submittedRef ? "Application Received" : `Apply: ${applyingJob.title}`}
          maxWidth="lg"
        >
          {submittedRef ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-950">
                Application Successfully Logged
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{applicantName}</strong>. Your dossier for{" "}
                <strong>{applyingJob.title}</strong> has been transmitted to our Editorial & HR Talent Committee.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block text-left text-xs space-y-1">
                <p className="text-slate-500">
                  Application Tracking ID: <strong className="font-mono text-cyan-800">{submittedRef}</strong>
                </p>
                <p className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Review Turnaround: <strong>5 Working Days</strong>
                </p>
              </div>

              <div className="pt-3">
                <Button variant="teal" size="sm" onClick={handleResetModal}>
                  Close Window
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 text-left">
              <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-cyan-950 flex items-center justify-between">
                <div>
                  <p className="font-bold">{applyingJob.dept}</p>
                  <p className="text-[11px] text-cyan-800">{applyingJob.location} • {applyingJob.type}</p>
                </div>
                <Badge variant="teal" size="sm">
                  Active Hiring
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Dr. Eleanor Vance"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Academic / Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="e.g. e.vance@stanford.edu"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">
                  ORCID or Google Scholar URL (Optional)
                </label>
                <input
                  type="text"
                  value={applicantOrcid}
                  onChange={(e) => setApplicantOrcid(e.target.value)}
                  placeholder="https://orcid.org/0000-0002-1825-0097"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                />
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">
                  Cover Note / Scholarly Background
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Briefly state your key scientific domain, peer review experience, or technical competencies..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                />
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">
                  Curriculum Vitae (PDF)
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-cyan-600 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-cyan-50/20 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-600">
                    {fileName ? (
                      <span className="font-semibold text-cyan-800 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> {fileName}
                      </span>
                    ) : (
                      "Click to attach your academic CV (PDF/DOCX, max 10MB)"
                    )}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={handleResetModal}>
                  Cancel
                </Button>
                <Button variant="teal" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {toastMessage && (
        <Toast
          type="success"
          title="Application Action"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      <Footer />
    </div>
  );
}
