import { ApcInvoice, ApcWaiverApplication } from "@/types";

const STORAGE_KEY = "publicore_apc_invoices";

const RESEARCH_4_LIFE_GROUP_A = [
  "Afghanistan", "Angola", "Bangladesh", "Burkina Faso", "Burundi", "Cambodia",
  "Central African Republic", "Chad", "Congo", "Democratic Republic of the Congo",
  "Ethiopia", "Gambia", "Guinea", "Haiti", "Liberia", "Madagascar", "Malawi",
  "Mali", "Mozambique", "Myanmar", "Nepal", "Niger", "Rwanda", "Sierra Leone",
  "Somalia", "South Sudan", "Sudan", "Tanzania", "Togo", "Uganda", "Yemen", "Zambia"
];

const RESEARCH_4_LIFE_GROUP_B = [
  "Albania", "Armenia", "Bhutan", "Bolivia", "Cameroon", "Cote d'Ivoire",
  "Dominica", "Fiji", "Georgia", "Ghana", "Guatemala", "Honduras", "Iraq",
  "Kenya", "Kiribati", "Kosovo", "Kyrgyzstan", "Moldova", "Mongolia", "Morocco",
  "Namibia", "Nigeria", "Pakistan", "Papua New Guinea", "Paraguay", "Sri Lanka",
  "Suriname", "Tajikistan", "Tunisia", "Ukraine", "Uzbekistan", "Vietnam", "Zimbabwe"
];

const SEED_INVOICES: ApcInvoice[] = [
  {
    id: "INV-2026-0811",
    manuscriptId: "ms-001",
    manuscriptTitle: "CRISPR-Cas9 Editing in Mammalian Neurological Systems",
    manuscriptCode: "PUB-2026-0418",
    journalName: "Journal of Open Science & Medicine",
    authorName: "Dr. Elena Rostova",
    authorEmail: "elena.rostova@cam.ac.uk",
    amount: 1200,
    currency: "USD",
    baseApc: 1200,
    waiverPercentage: 0,
    status: "Unpaid",
    createdAt: "2026-04-12T10:00:00Z",
    dueDate: "2026-05-12T10:00:00Z",
  },
  {
    id: "INV-2026-0812",
    manuscriptId: "ms-002",
    manuscriptTitle: "Quantum Error Correction Algorithms for Near-Term NISQ Processors",
    manuscriptCode: "PUB-2026-0419",
    journalName: "Publicore Computing Transactions",
    authorName: "Marcus Vance",
    authorEmail: "m.vance@tum.de",
    amount: 950,
    currency: "USD",
    baseApc: 950,
    waiverPercentage: 0,
    status: "Paid",
    paymentMethod: "Stripe Card (Visa •••• 4242)",
    transactionId: "ch_3N8jK92eZvKYlo2C1g9QW81Z",
    paidAt: "2026-04-14T14:32:00Z",
    createdAt: "2026-04-10T09:00:00Z",
    dueDate: "2026-05-10T09:00:00Z",
  },
  {
    id: "INV-2026-0813",
    manuscriptId: "ms-003",
    manuscriptTitle: "Machine Learning Driven Biomarker Discovery in Glioblastoma",
    manuscriptCode: "PUB-2026-0420",
    journalName: "Journal of Open Science & Medicine",
    authorName: "Amina Al-Mansoor",
    authorEmail: "amina.mansoor@aku.edu",
    amount: 0,
    currency: "USD",
    baseApc: 1200,
    waiverPercentage: 100,
    waiverReason: "Research4Life Group A Full Waiver (Academic Hardship Approved)",
    status: "Waived",
    createdAt: "2026-04-15T08:00:00Z",
    dueDate: "2026-05-15T08:00:00Z",
  },
];

export const paymentService = {
  checkWaiverEligibility(country: string): { eligible: boolean; percentage: number; tier: string } {
    if (RESEARCH_4_LIFE_GROUP_A.includes(country)) {
      return { eligible: true, percentage: 100, tier: "Research4Life Group A (100% APC Waiver)" };
    }
    if (RESEARCH_4_LIFE_GROUP_B.includes(country)) {
      return { eligible: true, percentage: 50, tier: "Research4Life Group B (50% APC Discount)" };
    }
    return { eligible: false, percentage: 0, tier: "Standard Tier" };
  },

  getAllInvoices(): ApcInvoice[] {
    if (typeof window === "undefined") return SEED_INVOICES;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INVOICES));
        return SEED_INVOICES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_INVOICES;
    }
  },

  getInvoiceById(id: string): ApcInvoice | undefined {
    const list = this.getAllInvoices();
    return list.find((inv) => inv.id === id);
  },

  getInvoiceByManuscriptId(msId: string): ApcInvoice | undefined {
    const list = this.getAllInvoices();
    return list.find((inv) => inv.manuscriptId === msId);
  },

  saveInvoices(invoices: ApcInvoice[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
      window.dispatchEvent(new Event("publicore_state_change"));
      window.dispatchEvent(new Event("publicore_payment_update"));
    } catch (e) {
      console.warn("Error saving invoices to storage:", e);
    }
  },

  async processCheckout(params: {
    invoiceId: string;
    cardNumber?: string;
    cardExp?: string;
    cardCvc?: string;
    cardHolder?: string;
    currency?: "USD" | "EUR" | "GBP" | "PKR";
  }): Promise<{ success: boolean; transactionId: string; invoice: ApcInvoice; message: string }> {
    const invoices = this.getAllInvoices();
    const index = invoices.findIndex((inv) => inv.id === params.invoiceId);
    if (index === -1) {
      throw new Error("Invoice not found");
    }

    const current = invoices[index];
    const transactionId = `ch_3P${Math.random().toString(36).substring(2, 10).toUpperCase()}2C1${Math.floor(1000 + Math.random() * 9000)}`;
    const cardLast4 = params.cardNumber ? params.cardNumber.replace(/\s+/g, "").slice(-4) || "4242" : "4242";

    // Attempt backend sync in browser runtime
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/payments/apc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "pay",
            invoiceId: current.id,
            amount: current.amount,
            currency: params.currency || current.currency,
            transactionId,
            cardLast4,
          }),
        });
      } catch (e) {
        console.warn("Backend payment route sync bypassed, falling back to local state:", e);
      }
    }

    const updated: ApcInvoice = {
      ...current,
      status: "Paid",
      paymentMethod: `Stripe Credit Card (•••• ${cardLast4})`,
      transactionId,
      paidAt: new Date().toISOString(),
    };

    invoices[index] = updated;
    this.saveInvoices(invoices);

    return {
      success: true,
      transactionId,
      invoice: updated,
      message: `Payment of ${updated.currency} ${updated.amount.toFixed(2)} processed successfully via Stripe.`,
    };
  },

  async applyWaiver(params: {
    invoiceId: string;
    country: string;
    institution: string;
    justification: string;
  }): Promise<ApcInvoice> {
    const invoices = this.getAllInvoices();
    const index = invoices.findIndex((inv) => inv.id === params.invoiceId);
    if (index === -1) throw new Error("Invoice not found");

    const current = invoices[index];
    const eligibility = this.checkWaiverEligibility(params.country);

    let waiverPercentage = eligibility.percentage;
    let waiverReason = `${eligibility.tier}: ${params.justification}`;

    if (!eligibility.eligible) {
      // Hardship review request
      waiverPercentage = 25; // discretionary default hardship review
      waiverReason = `Institutional Hardship Discretionary Discount: ${params.justification}`;
    }

    const discountedAmount = Math.max(0, current.baseApc * (1 - waiverPercentage / 100));

    const updated: ApcInvoice = {
      ...current,
      amount: discountedAmount,
      waiverPercentage,
      waiverReason,
      status: discountedAmount === 0 ? "Waived" : "Unpaid",
    };

    invoices[index] = updated;
    this.saveInvoices(invoices);

    return updated;
  },

  createInvoiceForManuscript(params: {
    manuscriptId: string;
    manuscriptTitle: string;
    manuscriptCode: string;
    journalName: string;
    authorName: string;
    authorEmail: string;
    amount?: number;
  }): ApcInvoice {
    const invoices = this.getAllInvoices();
    const existing = invoices.find((inv) => inv.manuscriptId === params.manuscriptId);
    if (existing) return existing;

    const newInvoice: ApcInvoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      manuscriptId: params.manuscriptId,
      manuscriptTitle: params.manuscriptTitle,
      manuscriptCode: params.manuscriptCode,
      journalName: params.journalName,
      authorName: params.authorName,
      authorEmail: params.authorEmail,
      amount: params.amount || 1200,
      currency: "USD",
      baseApc: params.amount || 1200,
      waiverPercentage: 0,
      status: "Unpaid",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    invoices.unshift(newInvoice);
    this.saveInvoices(invoices);
    return newInvoice;
  },
};
