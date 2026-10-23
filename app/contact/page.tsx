"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  FileText,
  Building2,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  Copy,
  Check,
  Paperclip,
  X,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Globe2,
  MessageSquare,
  UploadCloud,
} from "lucide-react";

interface ContactInquiryResult {
  ticketId: string;
  name: string;
  email: string;
  institution: string;
  category: string;
  priority: string;
  manuscriptId?: string | null;
  subject: string;
  fileName?: string | null;
  slaHours: number;
  estimatedResponseTime: string;
  timestamp: string;
}

const INQUIRY_CATEGORIES = [
  {
    id: "editorial",
    name: "Editorial & Peer Review",
    desc: "Inquiries regarding double-blind review progress, editor decisions, or peer feedback",
    hasManuscriptId: true,
  },
  {
    id: "author",
    name: "Author Submissions & Revisions",
    desc: "Formatting assistance, author guidelines, APC inquiries, or revision deadlines",
    hasManuscriptId: true,
  },
  {
    id: "reviewer",
    name: "Reviewer Network & Recognition",
    desc: "Review invitations, reviewer certificates, ethics standards, and review credits",
    hasManuscriptId: false,
  },
  {
    id: "production",
    name: "Production, JATS XML & DOI",
    desc: "Galley proofing, Crossref DOI metadata registration, PDF and XML preservation",
    hasManuscriptId: true,
  },
  {
    id: "technical",
    name: "Platform Technical Support",
    desc: "ORCID Single Sign-On, login credentials, dashboard access, or technical bugs",
    hasManuscriptId: false,
  },
  {
    id: "licensing",
    name: "Institutional Licensing & Memberships",
    desc: "University consortium access, transformative open-access agreements, and bulk APC waivers",
    hasManuscriptId: false,
  },
  {
    id: "ethics",
    name: "Research Ethics & COPE Compliance",
    desc: "Confidential escalation for scientific integrity, duplicate submission, or authorship disputes",
    hasManuscriptId: true,
  },
];

export default function ContactPage() {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [category, setCategory] = useState("Editorial & Peer Review");
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">("Normal");
  const [manuscriptId, setManuscriptId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<ContactInquiryResult | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const selectedCategoryObj = INQUIRY_CATEGORIES.find((c) => c.name === category);

  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File exceeds the 10MB maximum limit. Please attach a smaller file.");
        return;
      }
      setAttachedFile(file);
      setErrorMessage(null);
    }
  };

  // Copy Ticket ID
  const handleCopyTicket = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  // Reset Form
  const handleResetForm = () => {
    setName("");
    setEmail("");
    setInstitution("");
    setCategory("Editorial & Peer Review");
    setPriority("Normal");
    setManuscriptId("");
    setSubject("");
    setMessage("");
    setAttachedFile(null);
    setIsHumanVerified(false);
    setSubmissionResult(null);
    setErrorMessage(null);
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Front-end Validations
    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setErrorMessage("Please provide a valid institutional or scholarly email address.");
      return;
    }
    if (!subject.trim() || subject.trim().length < 4) {
      setErrorMessage("Subject line must contain at least 4 characters.");
      return;
    }
    if (!message.trim() || message.trim().length < 15) {
      setErrorMessage("Your message must contain at least 15 characters to explain your request.");
      return;
    }
    if (!isHumanVerified) {
      setErrorMessage("Please check the verification box to confirm you are a scholar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          institution: institution.trim() || "Independent Scholar",
          category,
          priority,
          manuscriptId: manuscriptId.trim() || null,
          subject: subject.trim(),
          message: message.trim(),
          fileName: attachedFile ? attachedFile.name : null,
        }),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (response.ok && data.success) {
        setSubmissionResult({
          ticketId: data.ticketId,
          name: data.name,
          email: data.email,
          institution: data.institution,
          category: data.category,
          priority: data.priority,
          manuscriptId: data.manuscriptId,
          subject: data.subject,
          fileName: data.fileName,
          slaHours: data.slaHours,
          estimatedResponseTime: data.estimatedResponseTime,
          timestamp: data.timestamp,
        });

        // Save to local registry storage for scholar history
        try {
          const existing = JSON.parse(localStorage.getItem("publicore_scholar_tickets") || "[]");
          existing.unshift(data);
          localStorage.setItem("publicore_scholar_tickets", JSON.stringify(existing.slice(0, 20)));
        } catch {
          // localStorage non-blocking
        }
      } else {
        setErrorMessage(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || "An unexpected network error occurred while submitting.");
    }
  };

  const faqs = [
    {
      q: "What is the typical turnaround time for editorial queries?",
      a: "Our editorial desk responds to all standard peer-review and submission queries within 24 business hours. Urgent queries with active publication deadlines are prioritized within 4 to 12 hours.",
    },
    {
      q: "Can I request an APC (Article Processing Charge) waiver?",
      a: "Yes. Authors originating from Research4Life Group A countries receive automatic 100% waivers, and Group B countries receive 50% waivers. Select 'Author Submissions & Revisions' in the form to request special institutional grants.",
    },
    {
      q: "How can I update author affiliations on an accepted manuscript?",
      a: "Select 'Production, JATS XML & DOI' and provide your Manuscript Tracking ID. Affiliation changes requested before final Crossref DOI minting can be seamlessly integrated into your JATS proof.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full text-left">
        {/* Header Hero */}
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
            Contact Us
          </h1>
        </div>

        {/* Main Grid: Contact Form (Left) + Directory Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: DYNAMIC CONTACT FORM ================= */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-[#f8fbfe] to-[#edf7fa] border border-cyan-100/80 shadow-[0_12px_40px_-8px_rgba(0,78,112,0.1),0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_-8px_rgba(0,78,112,0.16)] hover:border-cyan-400/50 transition-all duration-300 ease-out rounded-3xl space-y-6">
              {/* Dynamic View 1: Submission Result Display */}
              {submissionResult ? (
                <div className="space-y-6 py-2 animate-fadeIn text-left">
                  {/* Success Header */}
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-emerald-950">
                          Inquiry Transmitted to Secretariat
                        </h3>
                        <p className="text-xs text-emerald-800">
                          Your request has been logged and assigned to the active editorial queue.
                        </p>
                      </div>
                    </div>

                    {/* Ticket ID Box */}
                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Official Tracking Ticket ID
                        </span>
                        <span className="text-base sm:text-lg font-mono font-extrabold text-[#004e70]">
                          {submissionResult.ticketId}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyTicket(submissionResult.ticketId)}
                        className="text-xs flex items-center gap-1.5 shrink-0"
                      >
                        {copiedTicket ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Ticket ID</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Inquiry Metadata Summary Table */}
                  <div className="p-4 rounded-xl bg-white/90 border border-slate-200 space-y-2.5 text-xs">
                    <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px]">
                      Ticket Details &amp; Response SLA
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-600 pt-1">
                      <div>
                        <span className="font-semibold text-slate-500 block text-[11px]">Inquirer:</span>
                        <span className="font-medium text-navy-950">{submissionResult.name}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500 block text-[11px]">Target Department:</span>
                        <span className="font-medium text-navy-950">{submissionResult.category}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500 block text-[11px]">Contact Email:</span>
                        <span className="font-medium text-navy-950">{submissionResult.email}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500 block text-[11px]">Assigned Priority:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {submissionResult.priority} Priority
                        </span>
                      </div>
                      {submissionResult.manuscriptId && (
                        <div>
                          <span className="font-semibold text-slate-500 block text-[11px]">Manuscript ID:</span>
                          <span className="font-mono font-bold text-cyan-800">{submissionResult.manuscriptId}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-500 block text-[11px]">Estimated Response:</span>
                        <span className="font-bold text-emerald-700">{submissionResult.estimatedResponseTime}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80">
                      <span className="font-semibold text-slate-500 block text-[11px]">Subject:</span>
                      <p className="text-slate-800 font-medium">{submissionResult.subject}</p>
                    </div>

                    {submissionResult.fileName && (
                      <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Attached Document: <strong>{submissionResult.fileName}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={handleResetForm}
                      className="w-full sm:flex-1 bg-[#004e70] hover:bg-[#003c57] text-white font-bold"
                    >
                      <MessageSquare className="w-4 h-4 mr-1.5" /> Submit Another Inquiry
                    </Button>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-center"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              ) : (
                /* Dynamic View 2: Interactive Form */
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-lg sm:text-xl font-bold text-navy-950 tracking-tight">
                      Send an Editorial / Secretariat Inquiry
                    </h3>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Submission Alert</span>
                        <p className="mt-0.5">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Field 1: Category Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Inquiry Category &amp; Target Desk
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-950 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#004e70]/20 focus:border-[#004e70] transition-colors"
                    >
                      {INQUIRY_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field 2 & 3: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Full Name &amp; Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Arthur Pendelton"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-950 bg-white focus:outline-none focus:ring-2 focus:ring-[#004e70]/20 focus:border-[#004e70] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Institutional Email
                      </label>
                      <input
                        type="email"
                        placeholder="scholar@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-950 bg-white focus:outline-none focus:ring-2 focus:ring-[#004e70]/20 focus:border-[#004e70] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field 4 & 5: Institution & Conditional Manuscript ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Academic Institution / Affiliation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. University of Cambridge"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-950 bg-white focus:outline-none focus:ring-2 focus:ring-[#004e70]/20 focus:border-[#004e70] transition-colors"
                      />
                    </div>

                    {/* Conditional Field: Manuscript ID */}
                    {selectedCategoryObj?.hasManuscriptId ? (
                      <div className="space-y-1.5 animate-fadeIn">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Manuscript ID (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. PUB-MS-2026-8912"
                          value={manuscriptId}
                          onChange={(e) => setManuscriptId(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-3 text-xs font-mono text-navy-950 bg-white focus:outline-none focus:ring-2 focus:ring-[#004e70]/20 focus:border-[#004e70] transition-colors"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Inquiry Priority
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["Normal", "High", "Urgent"] as const).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPriority(p)}
                              className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                                priority === p
                                  ? "bg-[#004e70] text-white border-[#004e70] shadow-xs"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Priority selector if category had manuscriptId */}
                  {selectedCategoryObj?.hasManuscriptId && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Inquiry Urgency Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["Normal", "High", "Urgent"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center ${
                              priority === p
                                ? "bg-[#004e70] text-white border-[#004e70] shadow-xs"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <span>{p}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Field 6: Subject Line */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Inquiry Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Request for review status update on submitted manuscript"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-950 bg-white focus:outline-none focus:ring-2 focus:ring-[#004e70]/20 focus:border-[#004e70] transition-colors"
                    />
                  </div>

                  {/* Field 7: Detailed Message */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Detailed Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Please provide full details of your query..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      maxLength={2500}
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-navy-950 bg-white focus:outline-none focus:ring-2 focus:ring-[#004e70]/20 focus:border-[#004e70] leading-relaxed resize-y transition-colors"
                    />
                  </div>

                  {/* Field 8: Optional File Attachment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Supplementary Attachment (Optional)
                    </label>
                    {attachedFile ? (
                      <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-4 h-4 text-cyan-800 shrink-0" />
                          <span className="font-medium text-navy-950 truncate">{attachedFile.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            ({(attachedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-colors"
                          title="Remove attached file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-300 hover:border-[#004e70] rounded-xl p-3.5 flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-[#004e70] bg-white/70 hover:bg-white transition-all cursor-pointer">
                        <UploadCloud className="w-4 h-4 text-slate-400" />
                        <span>Attach PDF, screenshot, or errata document (Max 10MB)</span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.png,.jpg,.jpeg,.docx,.zip"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Field 9: Human Verification Checkbox */}
                  <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="humanVerification"
                      checked={isHumanVerified}
                      onChange={(e) => setIsHumanVerified(e.target.checked)}
                      className="w-4 h-4 rounded text-[#004e70] focus:ring-[#004e70] border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="humanVerification" className="text-xs text-slate-700 font-medium cursor-pointer select-none">
                      I confirm that this is a legitimate academic inquiry and agree to PUBLICORE COPE publishing ethics guidelines.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting}
                    className="w-full bg-[#004e70] hover:bg-[#003c57] text-white font-bold shadow-xs py-3.5 rounded-xl transition-all active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Transmitting to Secretariat Registry...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>Submit Scholarly Inquiry</span>
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* ================= RIGHT COLUMN: DEPARTMENT DIRECTORY ================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* Headquarters Card */}
            <Card className="p-6 sm:p-7 bg-gradient-to-br from-white via-[#f8fbfe] to-[#edf7fa] border border-cyan-100/80 shadow-[0_8px_30px_-6px_rgba(0,78,112,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(0,78,112,0.14)] hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-300 ease-out rounded-3xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/80 text-[#004e70] flex items-center justify-center font-bold shadow-2xs border border-cyan-200/60">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-950">Global Secretariat</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <span>
                    124 Research Nexus Way, Cambridge Innovation Quad<br />
                    Cambridge CB2 1TN, United Kingdom
                  </span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-700 shrink-0" />
                  <a href="mailto:secretariat@publicore.org" className="hover:text-cyan-800 hover:underline font-medium">
                    secretariat@publicore.org
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span>+44 (0) 1223 884920 (Mon - Fri, 08:00 - 18:00 GMT)</span>
                </p>
              </div>
            </Card>

            {/* Department Direct Routing Cards */}
            <Card className="p-6 sm:p-7 bg-gradient-to-br from-white via-[#f8fbfe] to-[#edf7fa] border border-cyan-100/80 shadow-[0_8px_30px_-6px_rgba(0,78,112,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(0,78,112,0.14)] hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-300 ease-out rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-navy-950">
                Direct Department Desks
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-cyan-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-navy-950">Editorial &amp; Review Operations</span>
                    <span className="font-mono text-[11px] text-[#004e70] font-semibold">editorial.desk@publicore.org</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-cyan-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-navy-950">Production, JATS &amp; Crossref DOI</span>
                    <span className="font-mono text-[11px] text-[#004e70] font-semibold">production@publicore.org</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-cyan-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-navy-950">Billing, Stripe APC &amp; Waivers</span>
                    <span className="font-mono text-[11px] text-[#004e70] font-semibold">apc.finance@publicore.org</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Accordion FAQs */}
            <Card className="p-6 sm:p-7 bg-gradient-to-br from-white via-[#f8fbfe] to-[#edf7fa] border border-cyan-100/80 shadow-[0_8px_30px_-6px_rgba(0,78,112,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(0,78,112,0.14)] hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-300 ease-out rounded-3xl space-y-3.5">
              <h3 className="text-base font-bold text-navy-950">
                Frequently Asked Questions
              </h3>

              <div className="space-y-2.5">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-200/80 bg-white/90 rounded-2xl overflow-hidden hover:border-cyan-400/60 transition-all duration-200">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full text-left p-3.5 text-xs font-bold text-navy-950 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          activeFaq === i ? "rotate-180 text-cyan-700" : ""
                        }`}
                      />
                    </button>
                    {activeFaq === i && (
                      <div className="p-3.5 pt-0 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
