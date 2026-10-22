"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { manuscriptService, authService } from "@/services";
import { Manuscript, ManuscriptStatus, Role } from "@/types";
import { Badge } from "../ui/Badge";
import {
  Send,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  History,
  Cpu,
  BookOpen,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Layers,
  Clock,
  AlertCircle,
  Mail,
  CreditCard,
  Cloud,
} from "lucide-react";

export const PublishingSequenceBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMs, setActiveMs] = useState<Manuscript | null>(null);
  const [allManuscripts, setAllManuscripts] = useState<Manuscript[]>([]);
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const loadData = () => {
    Promise.all([
      manuscriptService.getActiveSequenceManuscript(),
      manuscriptService.getAll(),
    ]).then(([active, all]) => {
      setActiveMs(active);
      setAllManuscripts(all);
    });
  };

  useEffect(() => {
    loadData();
    const handleStateChange = () => loadData();
    window.addEventListener("publicore_state_change", handleStateChange);
    return () => window.removeEventListener("publicore_state_change", handleStateChange);
  }, []);

  const handleSelectManuscript = async (id: string) => {
    await manuscriptService.setActiveSequenceManuscript(id);
    const ms = await manuscriptService.getById(id);
    if (ms) setActiveMs(ms);
  };

  const handleResetData = () => {
    if (window.confirm("Reset all publishing sequence demo data to initial state?")) {
      setIsResetting(true);
      manuscriptService.resetDemoData();
      setTimeout(() => {
        setIsResetting(false);
        router.push("/dashboard/author");
      }, 300);
    }
  };

  if (!activeMs) return null;

  const msId = activeMs.id;
  const status = activeMs.status;

  // Determine stage active index based on manuscript status
  // 0: Submit, 1: Screen, 2: Assign, 3: Review, 4: Decide, 5: Revise, 6: Production, 7: Published
  const getStageIndex = (st: ManuscriptStatus): number => {
    switch (st) {
      case "Submitted":
        return 1; // ready for screening
      case "Screening":
        return 1;
      case "Reviewer Invited":
        return 2; // ready for reviewer assignment
      case "Under Review":
        return 3; // reviewer reviewing or ready for decision
      case "Revision":
        return 5; // revision needed
      case "Accepted":
        return 6; // ready for production
      case "Production":
        return 6;
      case "Published":
      case "DOI Registered":
        return 7;
      case "Rejected":
        return 1;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(status);

  const SEQUENCE_STEPS = [
    {
      idx: 0,
      title: "1. Submission",
      role: "Author" as Role,
      icon: Send,
      href: "/submit",
      description: "Manuscript intake & AI extraction",
      isComplete: true,
      isCurrent: status === "Submitted",
    },
    {
      idx: 1,
      title: "2. Desk Screen",
      role: "editor" as Role,
      icon: Sparkles,
      href: `/dashboard/editor/screening/${msId}`,
      description: "AI scope & novelty report",
      isComplete: currentStageIdx > 1,
      isCurrent: currentStageIdx === 1,
    },
    {
      idx: 2,
      title: "3. Assign Reviewers",
      role: "editor" as Role,
      icon: Users,
      href: `/dashboard/editor/assign-reviewers/${msId}`,
      description: "COI checks & invite experts",
      isComplete: currentStageIdx > 2,
      isCurrent: currentStageIdx === 2,
    },
    {
      idx: 3,
      title: "4. Peer Review",
      role: "reviewer" as Role,
      icon: ShieldCheck,
      href: `/dashboard/reviewer/workspace/${msId}`,
      description: "Double-blind rubric scoring",
      isComplete: currentStageIdx > 3 || (activeMs.reviewerComments && activeMs.reviewerComments.length > 0),
      isCurrent: currentStageIdx === 3,
    },
    {
      idx: 4,
      title: "5. Editorial Decision",
      role: "editor" as Role,
      icon: CheckCircle2,
      href: `/dashboard/editor/decision/${msId}`,
      description: "Accept, Revise or Reject",
      isComplete: status === "Accepted" || status === "Published" || status === "DOI Registered",
      isCurrent: currentStageIdx === 4 || (currentStageIdx === 3 && activeMs.reviewerComments && activeMs.reviewerComments.length > 0),
    },
    {
      idx: 5,
      title: "6. Revision Center",
      role: "author" as Role,
      icon: History,
      href: `/dashboard/author/revisions/${msId}`,
      description: "Author rebuttals & Version 2",
      isComplete: activeMs.version > 1,
      isCurrent: status === "Revision",
    },
    {
      idx: 6,
      title: "7. Production Desk",
      role: "production" as Role,
      icon: Cpu,
      href: `/dashboard/production`,
      description: "JATS XML & Crossref DOI",
      isComplete: status === "Published" || status === "DOI Registered",
      isCurrent: status === "Accepted" || status === "Production",
    },
    {
      idx: 7,
      title: "8. Live Publication",
      role: "author" as Role,
      icon: BookOpen,
      href: `/articles/${msId}`,
      description: "Indexed discovery & reader",
      isComplete: status === "Published" || status === "DOI Registered",
      isCurrent: status === "Published" || status === "DOI Registered",
    },
  ];

  const currentStepObj = SEQUENCE_STEPS[Math.min(currentStageIdx, 7)];

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-xs transition-all">
      {/* Top Banner: Sequence Header & Controls */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Left: Active Sequence Tracker */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-cyan-800 bg-cyan-50 px-2 py-1 rounded-md text-[11px] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-cyan-700" />
              Phase 2 Publishing Sequence
            </span>

            {/* Manuscript Picker */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold px-1.5 hidden sm:inline">Active:</span>
              <select
                value={activeMs.id}
                onChange={(e) => handleSelectManuscript(e.target.value)}
                className="bg-transparent text-navy-950 font-bold text-xs py-1 px-1 focus:outline-none cursor-pointer max-w-[210px] sm:max-w-[280px] truncate"
              >
                {allManuscripts.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} — {m.title.slice(0, 32)}... ({m.status})
                  </option>
                ))}
              </select>
            </div>

            <Badge variant="teal" size="sm">
              Status: {activeMs.status}
            </Badge>
          </div>

          {/* Right: Quick Next Step Action & Mobile Toggle */}
          <div className="flex items-center gap-2 justify-between md:justify-end">
            <Link
              href={currentStepObj.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <span>Next Action: {currentStepObj.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>

            <Link
              href="/dashboard/qa"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors"
              title="View automated test suite and coverage reports"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>QA: 10/10</span>
            </Link>

            <Link
              href="/dashboard/emails"
              className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold transition-colors"
              title="View transactional emails and dispatch test letters"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Emails</span>
            </Link>

            <Link
              href="/dashboard/billing"
              className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-bold transition-colors"
              title="Article Processing Charges (APC) and Stripe Billing"
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-600" />
              <span>APC Billing</span>
            </Link>

            <Link
              href="/dashboard/deployment"
              className="hidden 2xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-[11px] font-bold transition-colors"
              title="Cloud Deployment & Vercel Telemetry Desk"
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-600" />
              <span>Deploy</span>
            </Link>

            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-navy-950 hover:bg-slate-100 text-[11px] font-medium transition-colors"
              title="Reset all sequence states to initial mock baseline"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Mobile Expand Accordion Button */}
            <button
              onClick={() => setExpandedMobile(!expandedMobile)}
              className="md:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              <span>Sequence</span>
              {expandedMobile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Stepper Bar (Full 8-Stage Flow) */}
      <div className="hidden md:block border-t border-slate-100 bg-slate-50/70 overflow-x-auto py-2">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-8 gap-2 min-w-[980px]">
            {SEQUENCE_STEPS.map((step) => {
              const StepIcon = step.icon;
              const isActive = step.isCurrent;
              const isDone = step.isComplete;

              return (
                <Link
                  key={step.idx}
                  href={step.href}
                  className={`group p-2 rounded-lg border transition-all text-left flex flex-col justify-between ${
                    isActive
                      ? "bg-white border-cyan-500 shadow-sm ring-2 ring-cyan-500/20"
                      : isDone
                      ? "bg-white/80 border-emerald-200 hover:border-emerald-300"
                      : "bg-white/40 border-slate-200 opacity-60 hover:opacity-100 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? "bg-cyan-600 text-white animate-pulse"
                          : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : step.idx + 1}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      {step.role}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <StepIcon
                        className={`w-3.5 h-3.5 ${
                          isActive
                            ? "text-cyan-700"
                            : isDone
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`text-xs font-bold truncate ${
                          isActive
                            ? "text-cyan-900"
                            : isDone
                            ? "text-slate-800"
                            : "text-slate-500"
                        }`}
                      >
                        {step.title.split(". ")[1]}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Stepper Drawer (Visible when expanded or compact on mobile) */}
      {expandedMobile && (
        <div className="md:hidden border-t border-slate-200 bg-slate-50 p-3 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Publishing Sequence Pipeline:
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {SEQUENCE_STEPS.map((step) => {
              const StepIcon = step.icon;
              const isActive = step.isCurrent;
              const isDone = step.isComplete;

              return (
                <Link
                  key={step.idx}
                  href={step.href}
                  onClick={() => setExpandedMobile(false)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs font-medium ${
                    isActive
                      ? "bg-cyan-50 border-cyan-400 text-cyan-950 font-bold"
                      : isDone
                      ? "bg-white border-emerald-200 text-slate-800"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isActive
                          ? "bg-cyan-600 text-white"
                          : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : step.idx + 1}
                    </span>
                    <StepIcon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">{step.title}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">
                    {step.role}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
