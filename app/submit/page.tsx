"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { manuscriptService } from "@/services";
import { ArticleType } from "@/types";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Send,
} from "lucide-react";

export default function SubmitResearchPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [articleType, setArticleType] = useState<ArticleType>("Research Article");
  const [selectedJournal, setSelectedJournal] = useState("j-ai");
  const [uploadedFile, setUploadedFile] = useState<string | null>("PathoLatent_Manuscript_Rev01.pdf");
  const [title, setTitle] = useState(
    "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis and Rare Cancer Subtyping"
  );
  const [abstract, setAbstract] = useState(
    "Whole-slide histopathology imaging presents profound computational challenges owing to gigapixel dimensions, stain variability, and severe class imbalances in rare neoplastic subtypes. Here, we present PathoLatent-X..."
  );
  const [keywords, setKeywords] = useState("Latent Diffusion, Digital Pathology, Spatial Transcriptomics, Few-Shot Learning");
  const [researchField, setResearchField] = useState("Artificial Intelligence & Computational Pathology");
  const [authors, setAuthors] = useState([
    { name: "Dr. Elena Rostova", email: "elena.rostova@cambridge.ac.uk", institution: "University of Cambridge", isCorresponding: true },
    { name: "Julian H. Mercer", email: "j.mercer@ox.ac.uk", institution: "University of Oxford", isCorresponding: false },
  ]);
  const [declarations, setDeclarations] = useState({
    originalWork: true,
    conflictOfInterest: true,
    dataAvailability: true,
    ethicsApproval: true,
  });

  const STEPS = [
    { num: 1, label: "Article Type" },
    { num: 2, label: "Manuscript File" },
    { num: 3, label: "AI Metadata" },
    { num: 4, label: "Co-Authors" },
    { num: 5, label: "Declarations" },
    { num: 6, label: "AI Pre-Screen" },
    { num: 7, label: "Final Review" },
    { num: 8, label: "Submit" },
  ];

  const handleSimulatedUpload = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setUploadedFile("PathoLatent_Manuscript_Rev01.pdf");
      setIsExtracting(false);
      setCurrentStep(3);
    }, 1500);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await manuscriptService.createSubmission({
      title,
      abstract,
      keywords: keywords.split(",").map((k) => k.trim()),
      articleType,
      journalId: selectedJournal,
    });
    setIsSubmitting(false);
    router.push("/dashboard/author");
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <Badge variant="teal" size="sm" className="mb-2">
            Step-by-Step Submission System
          </Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Submit Scholarly Manuscript
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Our AI intake agent automatically extracts metadata, formats citations, and screens scope compatibility while leaving you in full control.
          </p>
        </div>

        {/* Multi-Step Horizontal Stepper */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[640px] px-2">
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step.num < currentStep
                        ? "bg-emerald-500 text-white"
                        : step.num === currentStep
                        ? "bg-cyan-600 text-white ring-4 ring-cyan-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.num < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${
                      step.num === currentStep
                        ? "text-cyan-800"
                        : step.num < currentStep
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {step.num < STEPS.length && (
                  <div
                    className={`w-10 sm:w-14 h-[2px] mx-2 ${
                      step.num < currentStep ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Body Cards */}
        <Card className="p-6 sm:p-10 shadow-card">
          {/* STEP 1: Article Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy-950">
                Step 1: Select Journal & Article Type
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Journal
                  </label>
                  <select
                    value={selectedJournal}
                    onChange={(e) => setSelectedJournal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-navy-900"
                  >
                    <option value="j-ai">Publicore Transactions on Artificial Intelligence</option>
                    <option value="j-bio">Publicore Journal of Bioengineering & Medicine</option>
                    <option value="j-quantum">Publicore Quantum Systems & Computing</option>
                    <option value="j-energy">Publicore Sustainable Energy & Materials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Manuscript Article Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(
                      [
                        "Research Article",
                        "Review Paper",
                        "Methodology",
                        "Short Communication",
                        "Editorial",
                        "Systematic Review",
                      ] as ArticleType[]
                    ).map((type) => (
                      <div
                        key={type}
                        onClick={() => setArticleType(type)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          articleType === type
                            ? "border-cyan-600 bg-cyan-50/50 text-cyan-900 font-bold"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Manuscript Upload */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy-950">
                Step 2: Upload Manuscript Document
              </h2>
              <p className="text-xs text-slate-500">
                Supported formats: PDF, DOCX, LaTeX (.tar.gz). Our AI will parse the structure automatically.
              </p>

              <div
                onClick={handleSimulatedUpload}
                className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-12 text-center bg-slate-50 hover:bg-cyan-50/30 cursor-pointer transition-all space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-cyan-50 text-cyan-700 mx-auto flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-950">
                    Click to upload or drag and drop manuscript file
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Maximum size: 50 MB
                  </p>
                </div>
              </div>

              {isExtracting && (
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center gap-3 text-xs text-cyan-900">
                  <Sparkles className="w-5 h-5 text-cyan-600 animate-spin shrink-0" />
                  <div>
                    <p className="font-bold">AI Manuscript Parser Active</p>
                    <p className="text-[11px] text-cyan-800">
                      Extracting title, abstract, authors, keywords, and citations...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Metadata (AI extracted) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="p-4 bg-cyan-50/80 border border-cyan-200 rounded-xl flex items-start gap-3 text-xs text-cyan-900">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    AI Extraction Successful
                  </span>
                  <p className="mt-0.5 leading-relaxed">
                    AI automatically extracted metadata from <code>{uploadedFile}</code>. Please review and edit any details below prior to submission.
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-navy-950">
                Step 3: Review & Edit Manuscript Metadata
              </h2>

              <div className="space-y-4">
                <Input
                  label="Manuscript Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Abstract
                  </label>
                  <textarea
                    rows={4}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-navy-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <Input
                  label="Keywords (Comma separated)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />

                <Input
                  label="Research Classification Field"
                  value={researchField}
                  onChange={(e) => setResearchField(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Authors */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy-950">
                Step 4: Contributing Authors & Affiliations
              </h2>

              <div className="space-y-3">
                {authors.map((auth, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-navy-950">{auth.name}</p>
                      <p className="text-slate-500">{auth.email} • {auth.institution}</p>
                    </div>
                    {auth.isCorresponding && (
                      <Badge variant="teal" size="sm">
                        Corresponding Author
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setAuthors([
                    ...authors,
                    {
                      name: "New Collaborator",
                      email: "collab@university.edu",
                      institution: "Global Institute",
                      isCorresponding: false,
                    },
                  ])
                }
              >
                + Add Another Author
              </Button>
            </div>
          )}

          {/* STEP 5: Declarations */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy-950">
                Step 5: Publishing & Ethics Declarations
              </h2>

              <div className="space-y-3 text-xs">
                {[
                  { key: "originalWork", label: "This manuscript is original work and is not currently under review by another journal." },
                  { key: "conflictOfInterest", label: "All potential financial and non-financial conflicts of interest have been disclosed." },
                  { key: "dataAvailability", label: "Underlying datasets, code, and materials conform to open-science reproducibility standards." },
                  { key: "ethicsApproval", label: "Research involving human or animal subjects complied with institutional review board (IRB) ethics." },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(declarations as any)[item.key]}
                      onChange={(e) =>
                        setDeclarations({ ...declarations, [item.key]: e.target.checked })
                      }
                      className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-slate-700 leading-relaxed font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: AI Pre-Screening */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold">AI Pre-Screening Passed (Score: 96/100)</h4>
                  <p className="text-[11px] text-emerald-800">
                    High scope alignment with Publicore Transactions on AI. Complete structural sections verified.
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-navy-950">
                Step 6: AI Screening Diagnostic Report
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Scope Match</p>
                  <p className="text-2xl font-extrabold text-cyan-800 mt-1">98%</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">High Topical Fit</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Completeness</p>
                  <p className="text-2xl font-extrabold text-cyan-800 mt-1">100%</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">All 6 Sections Present</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Similarity Index</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">3.4%</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Clear Plagiarism Check</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Final Review */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy-950">
                Step 7: Final Submission Summary
              </h2>

              <div className="space-y-3 text-xs bg-slate-50 p-5 rounded-xl border border-slate-200">
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Journal:</strong> Publicore Transactions on Artificial Intelligence</p>
                <p><strong>Article Type:</strong> {articleType}</p>
                <p><strong>File:</strong> {uploadedFile}</p>
                <p><strong>Authors:</strong> {authors.map((a) => a.name).join(", ")}</p>
                <p><strong>AI Screening:</strong> Passed with 98% scope match</p>
              </div>
            </div>
          )}

          {/* STEP 8: Submit Confirmation */}
          {currentStep === 8 && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 mx-auto flex items-center justify-center">
                <FileCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-navy-950">
                Ready to Transmit Manuscript
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Once transmitted, your manuscript code will be assigned and our Editorial Screening Board will be notified.
              </p>
              <div className="pt-2">
                <Button
                  variant="teal"
                  size="lg"
                  isLoading={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="shadow-md"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  Confirm & Submit Manuscript
                </Button>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          {currentStep < 8 && (
            <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Previous Step
              </Button>

              <Button
                variant="teal"
                size="sm"
                onClick={() => setCurrentStep((prev) => Math.min(8, prev + 1))}
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}

