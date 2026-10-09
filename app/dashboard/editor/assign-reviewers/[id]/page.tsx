"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { manuscriptService, editorService } from "@/services";
import { Manuscript, ReviewerMatch } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Mail,
  UserCheck,
} from "lucide-react";

export default function ReviewerAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "ms-002";

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);

  const [candidates, setCandidates] = useState<ReviewerMatch[]>([
    {
      reviewerId: "usr-006",
      name: "Prof. Anika Patel",
      institution: "ETH Zürich, Switzerland",
      expertiseMatch: 96,
      topics: ["Spiking Neural Networks", "Edge Computing", "Neuromorphic Hardware"],
      publicationRelevance: "Author of 14 seminal publications on neuromorphic spike encoders; h-index: 42",
      availability: "Available",
      conflictStatus: "Clear",
      assignedStatus: "Invited",
    },
    {
      reviewerId: "usr-003",
      name: "Dr. Kenji Sato",
      institution: "Kyoto University, Japan",
      expertiseMatch: 92,
      topics: ["Signal Processing", "Neuromorphic Circuits", "Low-Power Computing"],
      publicationRelevance: "Lead author of 8 papers on asynchronous event-driven sensor processing; h-index: 29",
      availability: "Available",
      conflictStatus: "Clear",
      assignedStatus: "Unassigned",
    },
    {
      reviewerId: "usr-007",
      name: "Dr. Felix Hoffman",
      institution: "Max Planck Institute, Germany",
      expertiseMatch: 88,
      topics: ["Bioacoustics", "Sensor Networks", "Embedded Machine Learning"],
      publicationRelevance: "Published extensively in bioacoustic wildlife telemetry datasets; h-index: 31",
      availability: "Busy",
      conflictStatus: "Clear",
      assignedStatus: "Unassigned",
    },
    {
      reviewerId: "usr-008",
      name: "Prof. David Miller",
      institution: "MIT Computer Science, USA",
      expertiseMatch: 84,
      topics: ["Transformer Distillation", "Model Compression"],
      publicationRelevance: "Co-author with candidate's lab in 2023",
      availability: "Available",
      conflictStatus: "Potential Conflict",
      assignedStatus: "Unassigned",
    },
  ]);

  useEffect(() => {
    manuscriptService.getById(id).then((ms) => {
      setManuscript(ms || null);
      setLoading(false);
    });
  }, [id]);

  const toggleInvite = (reviewerId: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.reviewerId === reviewerId
          ? {
              ...c,
              assignedStatus: c.assignedStatus === "Invited" ? "Unassigned" : "Invited",
            }
          : c
      )
    );
  };

  const handleConfirmAssignments = async () => {
    const invitedIds = candidates
      .filter((c) => c.assignedStatus === "Invited")
      .map((c) => c.reviewerId);
    await editorService.assignReviewers(id, invitedIds);
    alert("Review invitations successfully dispatched! Double-blind review period initiated.");
    router.push("/dashboard/editor");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSkeleton rows={4} />
      </DashboardLayout>
    );
  }

  const totalInvited = candidates.filter((c) => c.assignedStatus === "Invited").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-5xl">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard/editor" className="hover:text-navy-950 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editorial Queue
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {manuscript?.code || "PUB-2026-1142"}
              </span>
              <Badge variant="teal" size="sm">
                AI Reviewer Matching Engine
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-950 mt-1">
              Match Peer Reviewers: {manuscript?.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Target: 2 to 3 independent double-blind reviewers • Currently Selected: {totalInvited}
            </p>
          </div>

          <Button
            variant="teal"
            size="md"
            disabled={totalInvited === 0}
            onClick={handleConfirmAssignments}
            className="shadow-sm shrink-0"
          >
            <Mail className="w-4 h-4 mr-1.5" />
            Dispatch Invitations ({totalInvited})
          </Button>
        </div>

        <div className="bg-cyan-50/80 border border-cyan-200 rounded-2xl p-5 flex items-start gap-3.5">
          <Sparkles className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
          <div className="text-xs text-cyan-950 space-y-1">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-cyan-900">
              AI Expertise Matching Logic
            </h4>
            <p className="leading-relaxed text-slate-700">
              Reviewer candidates are ranked using embedding vector cosine similarity between the manuscript's methodology and the reviewer's recent publication record, citation network, and past review reliability. Conflict-of-interest (COI) filters flag institutional and co-authorship overlaps.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              AI Recommended Reviewers ({candidates.length})
            </h3>
            <span className="text-xs text-slate-400">Ranked by Topical Expertise</span>
          </div>

          <div className="space-y-4">
            {candidates.map((cand) => {
              const isInvited = cand.assignedStatus === "Invited";
              const isConflict = cand.conflictStatus !== "Clear";

              return (
                <Card
                  key={cand.reviewerId}
                  className={`p-6 transition-all ${
                    isInvited ? "border-cyan-500 ring-1 ring-cyan-500/20 bg-white" : "bg-white"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-600" />
                          {cand.expertiseMatch}% Expertise Match
                        </span>

                        <Badge
                          variant={cand.availability === "Available" ? "green" : "amber"}
                          size="sm"
                        >
                          {cand.availability}
                        </Badge>

                        <Badge
                          variant={isConflict ? "rose" : "gray"}
                          size="sm"
                        >
                          {isConflict ? (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Potential COI
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> COI Clear
                            </span>
                          )}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-navy-950">
                          {cand.name}
                        </h4>
                        <p className="text-xs text-slate-500">{cand.institution}</p>
                      </div>

                      <p className="text-xs text-slate-600 italic">
                        "{cand.publicationRelevance}"
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cand.topics.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Button
                        variant={isInvited ? "teal" : "outline"}
                        size="sm"
                        disabled={isConflict}
                        onClick={() => toggleInvite(cand.reviewerId)}
                      >
                        {isInvited ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Invited (Selected)
                          </>
                        ) : (
                          "Select for Review"
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
