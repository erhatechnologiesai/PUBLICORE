"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { emailService, ScholarlyEmail, EmailTemplateType } from "@/services/emailService";
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  Key,
  X,
  RotateCw,
  FileText,
  AlertCircle,
  Inbox,
} from "lucide-react";

export default function EmailCenterPage() {
  const [emails, setEmails] = useState<ScholarlyEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ScholarlyEmail | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [isSending, setIsSending] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [resendApiKey, setResendApiKey] = useState("");

  // Test Dispatch State
  const [testTo, setTestTo] = useState("scholar.reviewer@gmail.com");
  const [testName, setTestName] = useState("Dr. Sarah Al-Mansoor");
  const [testTemplate, setTestTemplate] = useState<EmailTemplateType>("REVIEWER_INVITATION");
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  const loadEmails = () => {
    setEmails(emailService.getDispatchedEmails());
  };

  useEffect(() => {
    loadEmails();
    const handleDispatched = () => loadEmails();
    window.addEventListener("publicore_email_dispatched", handleDispatched);
    return () => window.removeEventListener("publicore_email_dispatched", handleDispatched);
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTo.trim()) return;

    setIsSending(true);
    setDispatchNotice(null);

    const result = await emailService.sendEmail({
      to: testTo.trim(),
      toName: testName.trim() || "Respected Scholar",
      templateType: testTemplate,
      data: {
        manuscriptTitle: "Quantum Error Mitigation in Scalable Multi-Qubit Arrays",
        manuscriptCode: "PUB-2026-X89",
        journalName: "PUBLICORE Quantum Systems & Computing",
        decision: testTemplate === "EDITORIAL_DECISION" ? "Accepted for Publication" : undefined,
        doi: testTemplate === "PUBLICATION_NOTICE" ? "10.1042/pub.2026.04189" : undefined,
        actionUrl: "http://localhost:3000/dashboard/reviewer",
      },
      customApiKey: resendApiKey || undefined,
    });

    setIsSending(false);
    loadEmails();

    if (result.mode === "live") {
      setDispatchNotice(`Real email dispatched successfully to ${testTo} via Resend Cloud API!`);
    } else {
      setDispatchNotice(`Email generated and logged in simulated scholarly outbox for ${testTo}.`);
    }
  };

  const filteredEmails =
    activeFilter === "ALL"
      ? emails
      : emails.filter((e) => e.templateType === activeFilter);

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-cyan-600" />
                Transactional Communications
              </span>
              <Badge variant="teal" size="sm" className="font-semibold text-[11px]">
                COPE Standard Verified
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
              Scholarly Email & Notification Dispatch Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Automated reviewer invitations, editorial decisions, submission receipts, and publication notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowConfigModal(true)}
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
            >
              <Key className="w-3.5 h-3.5 text-slate-600" />
              Configure Resend API
            </Button>
          </div>
        </div>

        {/* Dispatch Banner Notice */}
        {dispatchNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{dispatchNotice}</span>
            </div>
            <button
              onClick={() => setDispatchNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Interactive Dispatcher Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Live Test Dispatch Box */}
          <div className="lg:col-span-1">
            <Card className="p-5 shadow-sm border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-700" />
                  Dispatch Test Email
                </h3>
                <Badge variant="green" size="sm" className="text-[10px]">
                  Dual-Mode
                </Badge>
              </div>

              <form onSubmit={handleSendTestEmail} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={testTo}
                    onChange={(e) => setTestTo(e.target.value)}
                    placeholder="e.g. researcher@university.edu"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Scholar Name
                  </label>
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g. Dr. Ada Lovelace"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Academic Notification Template
                  </label>
                  <select
                    value={testTemplate}
                    onChange={(e) => setTestTemplate(e.target.value as EmailTemplateType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:border-cyan-600"
                  >
                    <option value="REVIEWER_INVITATION">Reviewer Invitation Letter</option>
                    <option value="SUBMISSION_RECEIPT">Submission Acknowledgment Receipt</option>
                    <option value="EDITORIAL_DECISION">Editorial Decision Notice</option>
                    <option value="PUBLICATION_NOTICE">Article Published & DOI Announcement</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full gap-2 text-xs bg-cyan-700 hover:bg-cyan-800 text-white mt-2"
                >
                  {isSending ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      Dispatching Email...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Transactional Email
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Notice:</span> If Resend API key is configured, real emails deliver directly to inboxes. Otherwise, outputs are logged below in the simulated outbox.
              </div>
            </Card>
          </div>

          {/* Right Column: Outbox Table & Filters */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { label: "All Dispatched", value: "ALL" },
                { label: "Reviewer Invites", value: "REVIEWER_INVITATION" },
                { label: "Receipts", value: "SUBMISSION_RECEIPT" },
                { label: "Decisions", value: "EDITORIAL_DECISION" },
                { label: "Published", value: "PUBLICATION_NOTICE" },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setActiveFilter(pill.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeFilter === pill.value
                      ? "bg-navy-950 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Email Outbox Cards */}
            <div className="space-y-3">
              {filteredEmails.length === 0 ? (
                <Card className="p-8 text-center text-slate-400 text-xs">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No emails logged under this category yet.
                </Card>
              ) : (
                filteredEmails.map((email) => (
                  <Card
                    key={email.id}
                    className="p-4 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-navy-950 truncate max-w-sm sm:max-w-md">
                          {email.subject}
                        </span>
                        <Badge
                          variant={email.status === "delivered" ? "green" : "teal"}
                          size="sm"
                          className="text-[9px] uppercase font-bold"
                        >
                          {email.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Recipient: <strong className="text-slate-700">{email.toName}</strong> ({email.to}) &bull; Sent at {email.sentAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        onClick={() => setSelectedEmail(email)}
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-700" />
                        Preview HTML
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal: Full HTML Email Preview */}
        {selectedEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider">
                    Rendered Email Preview
                  </span>
                  <h3 className="text-sm font-bold text-navy-950 truncate max-w-md">
                    {selectedEmail.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
                <iframe
                  srcDoc={selectedEmail.htmlContent}
                  title="Email Preview"
                  className="w-full min-h-[460px] rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
                <span>To: {selectedEmail.to}</span>
                <Button size="sm" onClick={() => setSelectedEmail(null)}>
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Resend API Key Config */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-elevated border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-700" />
                  Configure Resend Email Key
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-cyan-700 font-bold hover:underline">Resend.com API Key</a> (e.g. <code>re_123456...</code>) to deliver live emails to real Gmail/Outlook inboxes.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resend API Key
                </label>
                <input
                  type="password"
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  placeholder="re_..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-600 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfigModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowConfigModal(false);
                    alert("Resend API key configured for this session!");
                  }}
                  className="bg-cyan-700 hover:bg-cyan-800 text-white"
                >
                  Save Key
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
