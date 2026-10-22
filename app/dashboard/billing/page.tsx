"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { paymentService } from "@/services/paymentService";
import { ApcInvoice } from "@/types";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Printer,
  ShieldCheck,
  Globe,
  FileText,
  AlertCircle,
  X,
  HelpCircle,
  Receipt,
  ExternalLink,
} from "lucide-react";

export default function BillingDashboardPage() {
  const [invoices, setInvoices] = useState<ApcInvoice[]>([]);
  const [filter, setFilter] = useState<"all" | "Unpaid" | "Paid" | "Waived">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<ApcInvoice | null>(null);

  // Modals state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [waiverModalOpen, setWaiverModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Checkout form state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("892");
  const [cardHolder, setCardHolder] = useState("Dr. Elena Rostova");
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);

  // Waiver form state
  const [waiverCountry, setWaiverCountry] = useState("Pakistan");
  const [waiverInstitution, setWaiverInstitution] = useState("Aga Khan University");
  const [waiverJustification, setWaiverJustification] = useState(
    "Research funded under public low-and-middle income country health grant. Requesting Research4Life scholarly discount."
  );
  const [isSubmittingWaiver, setIsSubmittingWaiver] = useState(false);

  const loadData = () => {
    const list = paymentService.getAllInvoices();
    setInvoices(list);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("publicore_payment_update", handleUpdate);
    window.addEventListener("publicore_state_change", handleUpdate);
    return () => {
      window.removeEventListener("publicore_payment_update", handleUpdate);
      window.removeEventListener("publicore_state_change", handleUpdate);
    };
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === "all") return true;
    return inv.status === filter;
  });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.baseApc, 0);
  const totalPaid = invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0);
  const totalWaived = invoices.reduce((sum, inv) => sum + (inv.baseApc - inv.amount), 0);
  const totalPending = invoices.filter((inv) => inv.status === "Unpaid").reduce((sum, inv) => sum + inv.amount, 0);

  const handleOpenCheckout = (inv: ApcInvoice) => {
    setSelectedInvoice(inv);
    setPaySuccessMsg(null);
    setCardHolder(inv.authorName);
    setCheckoutModalOpen(true);
  };

  const handleOpenWaiver = (inv: ApcInvoice) => {
    setSelectedInvoice(inv);
    setWaiverModalOpen(true);
  };

  const handleOpenReceipt = (inv: ApcInvoice) => {
    setSelectedInvoice(inv);
    setReceiptModalOpen(true);
  };

  const handleExecutePayment = async () => {
    if (!selectedInvoice) return;
    setIsProcessingPay(true);
    try {
      const res = await paymentService.processCheckout({
        invoiceId: selectedInvoice.id,
        cardNumber,
        cardExp,
        cardCvc,
        cardHolder,
        currency: selectedInvoice.currency,
      });
      setIsProcessingPay(false);
      setPaySuccessMsg(`Stripe payment confirmed! Receipt #${res.transactionId}`);
      loadData();
      setSelectedInvoice(res.invoice);
    } catch (err: any) {
      setIsProcessingPay(false);
      alert(`Payment error: ${err?.message || "Payment declined"}`);
    }
  };

  const handleExecuteWaiver = async () => {
    if (!selectedInvoice) return;
    setIsSubmittingWaiver(true);
    try {
      const updated = await paymentService.applyWaiver({
        invoiceId: selectedInvoice.id,
        country: waiverCountry,
        institution: waiverInstitution,
        justification: waiverJustification,
      });
      setIsSubmittingWaiver(false);
      setWaiverModalOpen(false);
      loadData();
      alert(`Waiver discount of ${updated.waiverPercentage}% successfully applied to Invoice ${updated.id}!`);
    } catch (err: any) {
      setIsSubmittingWaiver(false);
      alert(`Waiver error: ${err?.message}`);
    }
  };

  const eligibilityCheck = paymentService.checkWaiverEligibility(waiverCountry);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 text-left max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
              Open Access Financial Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
              Article Processing Charges (APC) & Billing Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Secure Stripe-integrated APC checkout, Research4Life waiver applications, and verifiable PDF receipts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Stripe Gateway Active
            </span>
          </div>
        </div>

        {/* Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5">
            <span className="text-xs font-medium text-slate-500">Total APC Invoiced</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
              ${totalInvoiced.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              {invoices.length} Manuscripts Invoiced
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <span className="text-xs font-medium text-slate-500">Paid & Collected</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              ${totalPaid.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Stripe Settled Gross Funds
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <span className="text-xs font-medium text-slate-500">Waivers Granted</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-1">
              ${totalWaived.toLocaleString()}
            </p>
            <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
              Research4Life & Hardship Relief
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <span className="text-xs font-medium text-slate-500">Pending Collection</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              ${totalPending.toLocaleString()}
            </p>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
              Awaiting Author Remittance
            </p>
          </Card>
        </div>

        {/* Filter Tabs & Invoices Table */}
        <Card className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-cyan-700" />
                APC Invoice Registry ({filteredInvoices.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage APC payment sessions, grant equity waivers, or download itemized receipts.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(["all", "Unpaid", "Paid", "Waived"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    filter === tab
                      ? "bg-white text-navy-950 shadow-xs font-bold"
                      : "text-slate-600 hover:text-navy-900"
                  }`}
                >
                  {tab === "all" ? "All Invoices" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Invoice Cards List (Responsive for mobile & desktop) */}
          <div className="space-y-3">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No invoices found matching current filter.
              </div>
            ) : (
              filteredInvoices.map((inv) => {
                const isPaid = inv.status === "Paid";
                const isWaived = inv.status === "Waived";
                const isUnpaid = inv.status === "Unpaid";

                return (
                  <div
                    key={inv.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                          {inv.id}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {inv.manuscriptCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800"
                              : isWaived
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {inv.status.toUpperCase()}
                        </span>
                        {inv.waiverPercentage > 0 && (
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {inv.waiverPercentage}% Waiver Applied
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-navy-950">
                        {inv.manuscriptTitle}
                      </h4>

                      <p className="text-xs text-slate-500">
                        Author: <span className="font-semibold text-slate-700">{inv.authorName}</span> ({inv.authorEmail}) • Journal: {inv.journalName}
                      </p>

                      {inv.waiverReason && (
                        <p className="text-[11px] text-purple-800 bg-purple-50/70 p-1.5 rounded border border-purple-100 inline-block">
                          Note: {inv.waiverReason}
                        </p>
                      )}
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-xl font-black text-navy-950">
                          ${inv.amount.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-slate-500">{inv.currency}</span>
                        </p>
                        {inv.baseApc !== inv.amount && (
                          <p className="text-[11px] text-slate-400 line-through">
                            Original: ${inv.baseApc.toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {isUnpaid && (
                          <>
                            <Button
                              variant="teal"
                              size="sm"
                              onClick={() => handleOpenCheckout(inv)}
                              className="shadow-sm"
                            >
                              <CreditCard className="w-3.5 h-3.5 mr-1" />
                              Pay APC (Stripe)
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenWaiver(inv)}
                              className="text-purple-700 border-purple-200 hover:bg-purple-50"
                            >
                              <Globe className="w-3.5 h-3.5 mr-1" />
                              Waiver
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReceipt(inv)}
                          className="text-slate-700"
                        >
                          <Receipt className="w-3.5 h-3.5 mr-1" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Informational Guidance Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-cyan-900 to-navy-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Publicore Open Access Equity & Research4Life Waiver Policy
            </h4>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              We provide automatic 100% APC waivers for corresponding authors based in World Bank Group A low-income economies, and 50% waivers for Group B lower-middle-income nations to ensure zero financial barriers to scientific dissemination.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (invoices[0]) handleOpenWaiver(invoices[0]);
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors shrink-0 shadow-xs"
          >
            Check Waiver Eligibility
          </button>
        </div>

        {/* MODAL 1: Stripe Checkout Modal */}
        {checkoutModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-left">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-950">
                      Stripe Scholarly APC Checkout
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Invoice: {selectedInvoice.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {paySuccessMsg ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-900">
                      Payment Successfully Processed
                    </h4>
                    <p className="text-xs text-emerald-700">{paySuccessMsg}</p>
                    <div className="pt-2">
                      <Button
                        variant="teal"
                        size="sm"
                        onClick={() => {
                          setCheckoutModalOpen(false);
                          handleOpenReceipt(selectedInvoice);
                        }}
                      >
                        <Receipt className="w-3.5 h-3.5 mr-1" />
                        View Printable Receipt
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Invoice Item Breakdown */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Manuscript:</span>
                        <span className="font-semibold text-navy-950 text-right truncate max-w-[200px]">
                          {selectedInvoice.manuscriptTitle}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Base APC Charge:</span>
                        <span className="font-mono text-slate-700">${selectedInvoice.baseApc.toFixed(2)}</span>
                      </div>
                      {selectedInvoice.waiverPercentage > 0 && (
                        <div className="flex justify-between text-xs text-purple-700 font-semibold">
                          <span>Waiver Discount ({selectedInvoice.waiverPercentage}%):</span>
                          <span>-${(selectedInvoice.baseApc - selectedInvoice.amount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-navy-950">
                        <span>Total Payable:</span>
                        <span className="text-emerald-700 font-black">
                          ${selectedInvoice.amount.toFixed(2)} {selectedInvoice.currency}
                        </span>
                      </div>
                    </div>

                    {/* Card Details Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-cyan-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full text-xs font-mono p-2.5 pr-10 rounded-lg border border-slate-300 focus:outline-hidden focus:border-cyan-600"
                          />
                          <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-cyan-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            CVC / CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-cyan-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Encrypted 256-bit SSL transaction via Stripe PCI-DSS Level 1 Gateway</span>
                    </div>

                    {/* Submit Button */}
                    <Button
                      variant="teal"
                      className="w-full py-2.5 shadow-md"
                      isLoading={isProcessingPay}
                      onClick={handleExecutePayment}
                    >
                      Authorize Payment of ${selectedInvoice.amount.toFixed(2)} USD
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: APC Waiver Application Modal */}
        {waiverModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-left">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-950">
                      Research4Life APC Waiver Application
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Invoice #{selectedInvoice.id} • Base APC: ${selectedInvoice.baseApc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setWaiverModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  PUBLICORE automatically awards fee waivers based on the corresponding author’s verified primary institutional country in accordance with Research4Life eligibility criteria.
                </p>

                {/* Country Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Country of Corresponding Author Institution
                  </label>
                  <select
                    value={waiverCountry}
                    onChange={(e) => setWaiverCountry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-cyan-600 bg-white"
                  >
                    <option value="Pakistan">Pakistan (Research4Life Group B — 50% Waiver)</option>
                    <option value="Bangladesh">Bangladesh (Research4Life Group A — 100% Full Waiver)</option>
                    <option value="Yemen">Yemen (Research4Life Group A — 100% Full Waiver)</option>
                    <option value="Ethiopia">Ethiopia (Research4Life Group A — 100% Full Waiver)</option>
                    <option value="Kenya">Kenya (Research4Life Group B — 50% Waiver)</option>
                    <option value="Ukraine">Ukraine (Research4Life Group B — 50% Waiver)</option>
                    <option value="Nigeria">Nigeria (Research4Life Group B — 50% Waiver)</option>
                    <option value="United Kingdom">United Kingdom (Standard / Hardship Application)</option>
                    <option value="United States">United States (Standard / Hardship Application)</option>
                    <option value="Germany">Germany (Standard / Hardship Application)</option>
                  </select>
                </div>

                {/* Eligibility Result Banner */}
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    eligibilityCheck.percentage === 100
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : eligibilityCheck.percentage === 50
                      ? "bg-purple-50 border-purple-200 text-purple-900"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    <span>Eligibility Status: {eligibilityCheck.tier}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Calculated Discount:{" "}
                    <span className="font-bold">{eligibilityCheck.percentage}%</span> off standard APC.
                    New invoice total will be:{" "}
                    <span className="font-bold font-mono">
                      ${(selectedInvoice.baseApc * (1 - eligibilityCheck.percentage / 100)).toFixed(2)} USD
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Institution / University Name
                  </label>
                  <input
                    type="text"
                    value={waiverInstitution}
                    onChange={(e) => setWaiverInstitution(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Grant / Hardship Justification
                  </label>
                  <textarea
                    rows={3}
                    value={waiverJustification}
                    onChange={(e) => setWaiverJustification(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-cyan-600"
                  />
                </div>

                <Button
                  variant="teal"
                  className="w-full py-2.5"
                  isLoading={isSubmittingWaiver}
                  onClick={handleExecuteWaiver}
                >
                  Apply {eligibilityCheck.percentage}% Waiver to Invoice
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: Printable Formal Scholarly Invoice & Receipt Modal */}
        {receiptModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto text-left">
              {/* Receipt Header Controls */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-cyan-700" />
                  Official Scholarly Tax Receipt & Invoice
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Print / Save PDF
                  </Button>
                  <button
                    onClick={() => setReceiptModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Sheet */}
              <div className="p-6 sm:p-8 space-y-6 text-slate-800" id="printable-invoice">
                {/* Letterhead */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-xl font-black text-navy-950 tracking-tight">
                      PUBLICORE FOUNDATION
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Open Scholarly Communications & Archival Registry
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ISSN: 2834-9102 • Tax EIN: US-89-2149021 • Crossref Depositor: 10.1042
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-500 block">
                      INVOICE #{selectedInvoice.id}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                    </span>
                    {selectedInvoice.status === "Paid" && (
                      <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-sm border border-emerald-300 uppercase tracking-widest">
                        PAID IN FULL
                      </span>
                    )}
                    {selectedInvoice.status === "Waived" && (
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-black rounded-sm border border-purple-300 uppercase tracking-widest">
                        FEE WAIVED
                      </span>
                    )}
                  </div>
                </div>

                {/* Billed To / Manuscript Info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Billed To
                    </span>
                    <p className="font-bold text-navy-950 mt-1">{selectedInvoice.authorName}</p>
                    <p className="text-slate-600">{selectedInvoice.authorEmail}</p>
                    <p className="text-slate-500 mt-1">Corresponding Author</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Publication Reference
                    </span>
                    <p className="font-bold text-navy-950 mt-1">{selectedInvoice.journalName}</p>
                    <p className="font-mono text-slate-600 text-[11px] mt-0.5">
                      ID: {selectedInvoice.manuscriptCode}
                    </p>
                    <p className="text-slate-500 truncate mt-0.5">
                      {selectedInvoice.manuscriptTitle}
                    </p>
                  </div>
                </div>

                {/* Itemized Table */}
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 text-left font-bold text-slate-600">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-right">Standard Rate</th>
                      <th className="py-2 text-right">Discount</th>
                      <th className="py-2 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3">
                        <p className="font-semibold text-navy-950">Article Processing Charge (APC)</p>
                        <p className="text-[11px] text-slate-500">
                          Peer review coordination, JATS XML generation, Crossref DOI minting & permanent archiving
                        </p>
                      </td>
                      <td className="py-3 text-right font-mono">${selectedInvoice.baseApc.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono text-purple-700">
                        {selectedInvoice.waiverPercentage > 0
                          ? `-$${(selectedInvoice.baseApc - selectedInvoice.amount).toFixed(2)} (${selectedInvoice.waiverPercentage}%)`
                          : "$0.00"}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-navy-950">
                        ${selectedInvoice.amount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-300 font-bold text-xs">
                      <td colSpan={3} className="py-2 text-right">Subtotal:</td>
                      <td className="py-2 text-right font-mono">${selectedInvoice.amount.toFixed(2)}</td>
                    </tr>
                    <tr className="font-bold text-xs text-slate-500">
                      <td colSpan={3} className="py-1 text-right">Tax (VAT 0% Scholarly Exemption):</td>
                      <td className="py-1 text-right font-mono">$0.00</td>
                    </tr>
                    <tr className="font-black text-sm text-navy-950 border-t border-slate-300">
                      <td colSpan={3} className="py-2 text-right">Total Net Amount:</td>
                      <td className="py-2 text-right font-mono text-emerald-700">
                        ${selectedInvoice.amount.toFixed(2)} {selectedInvoice.currency}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Settlement Metadata */}
                {selectedInvoice.transactionId && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] font-mono space-y-1">
                    <p className="text-slate-700">
                      Stripe Transaction ID: <span className="font-bold">{selectedInvoice.transactionId}</span>
                    </p>
                    <p className="text-slate-500">
                      Payment Method: {selectedInvoice.paymentMethod}
                    </p>
                    <p className="text-slate-500">
                      Paid Timestamp: {selectedInvoice.paidAt ? new Date(selectedInvoice.paidAt).toUTCString() : "Confirmed"}
                    </p>
                  </div>
                )}

                {/* Footer notes */}
                <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 text-center space-y-0.5">
                  <p>PUBLICORE Foundation • 100% CC-BY 4.0 Gold Open Access Publishing Protocol</p>
                  <p>Questions? Contact apc-billing@publicore.org</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
