"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { manuscriptService, reviewService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Send,
  FileText,
  Star,
  ChevronDown,
} from "lucide-react";

export default function ReviewWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "ms-002";

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recommendation, setRecommendation] = useState<
    "Accept" | "Minor Revision" | "Major Revision" | "Reject"
  >("Minor Revision");
  const [scores, setScores] = useState({
    originality: 4,
    methodology: 4,
    clarity: 5,
    significance: 4,
  });
  const [authorComments, setAuthorComments] = useState(
    "The manuscript presents a rigorous mathematical and empirical contribution. The spiking neural distillation protocol demonstrates strong energy efficiency gains. However, please address the thermal drift sensitivity on Loihi 2 silicon in Section 4.2."
  );
  const [editorComments, setEditorComments] = useState(
    "Solid paper. Recommend publication after author clarifies hardware thermal benchmarks."
  );

  useEffect(() => {
    manuscriptService.getById(id).then((ms) => {
      setManuscript(ms || null);
      setLoading(false);
    });
  }, [id]);

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    await reviewService.submitReview(id, {
      recommendation,
      commentsForAuthors: authorComments,
      confidentialEditorComments: editorComments,
      scores,
    });
    setIsSubmitting(false);
    alert("Scientific review submitted to Editor-in-Chief! Thank you for maintaining peer review integrity.");
    router.push("/dashboard/reviewer");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSkeleton rows={4} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {manuscript?.code || "PUB-2026-1142"}
              </span>
              <Badge variant="navy" size="sm">
                Double-Blind Peer Review
              </Badge>
              <span className="text-xs text-slate-400">Due in 14 days</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-950 mt-1">
              {manuscript?.title}
            </h1>
          </div>

          <Button
            variant="teal"
            size="md"
            isLoading={isSubmitting}
            onClick={handleSubmitReview}
            className="shadow-sm shrink-0"
          >
            <Send className="w-4 h-4 mr-1.5" />
            Submit Final Review
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-[#0A1D36] text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    PUBLICORE AI Review Assistant
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Advisory Only • Human Makes Decision
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-cyan-400 text-[11px] uppercase tracking-wider">
                  1. Paper Summary:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Proposes a spike-timing distillation framework (NeuroBioTrans) to compress large audio transformers onto edge neuromorphic hardware, achieving 88% wattage reduction.
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-cyan-400 text-[11px] uppercase tracking-wider">
                  2. Key Contributions:
                </span>
                <ul className="text-slate-300 space-y-1 list-disc list-inside">
                  <li>Formal mathematical convergence bound for spike-rate knowledge transfer.</li>
                  <li>Empirical silicon evaluation across 80,000 bioacoustic field audio recordings.</li>
                </ul>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 3. Potential Methodological Weaknesses:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Silicon benchmarks tested on a single chip variant without documenting ambient temperature fluctuation effects or voltage drops.
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-cyan-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> 4. Questions Worth Posing to Authors:
                </span>
                <p className="text-slate-300 italic leading-relaxed">
                  "How does spike quantization degrade when deploying across non-stationary acoustic noise environments?"
                </p>
              </div>
            </div>

            <Card className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                Manuscript Abstract & Keywords
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {manuscript?.abstract}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {manuscript?.keywords.map((kw, i) => (
                  <Badge key={i} variant="navy" size="sm">
                    {kw}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                  Scientific Assessment Form
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Overall Recommendation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ["Accept", "Minor Revision", "Major Revision", "Reject"] as const
                  ).map((rec) => (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => setRecommendation(rec)}
                      className={`p-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                        recommendation === rec
                          ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {rec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Quantitative Scores (1 - 5)
                </label>

                {[
                  { key: "originality", label: "Scientific Originality" },
                  { key: "methodology", label: "Methodological Rigor" },
                  { key: "clarity", label: "Exposition & Clarity" },
                  { key: "significance", label: "Field Significance" },
                ].map((crit) => (
                  <div key={crit.key} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{crit.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() =>
                            setScores({ ...scores, [crit.key]: score })
                          }
                          className={`w-6 h-6 rounded text-xs font-bold ${
                            (scores as any)[crit.key] === score
                              ? "bg-cyan-700 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Comments for Authors
                </label>
                <textarea
                  rows={4}
                  value={authorComments}
                  onChange={(e) => setAuthorComments(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-900 focus:outline-none focus:border-cyan-600 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Confidential Comments for Editor
                </label>
                <textarea
                  rows={2}
                  value={editorComments}
                  onChange={(e) => setEditorComments(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-900 focus:outline-none focus:border-cyan-600 bg-slate-50"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
