export type EmailTemplateType =
  | "SUBMISSION_RECEIPT"
  | "REVIEWER_INVITATION"
  | "EDITORIAL_DECISION"
  | "PUBLICATION_NOTICE";

export interface ScholarlyEmail {
  id: string;
  to: string;
  toName: string;
  subject: string;
  templateType: EmailTemplateType;
  htmlContent: string;
  sentAt: string;
  status: "delivered" | "simulated" | "failed";
  metadata?: Record<string, any>;
}

const STORAGE_KEY_EMAILS = "publicore_dispatched_emails";

function getStoredEmails(): ScholarlyEmail[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMAILS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveStoredEmails(list: ScholarlyEmail[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("publicore_email_dispatched", { detail: list }));
  } catch (e) {}
}

// Built-in Scholarly Email HTML Generator
export function generateEmailHtml(
  type: EmailTemplateType,
  data: {
    recipientName: string;
    manuscriptTitle?: string;
    manuscriptCode?: string;
    journalName?: string;
    decision?: string;
    doi?: string;
    actionUrl?: string;
    comments?: string;
  }
): { subject: string; html: string } {
  const brandHeader = `
    <div style="background-color: #082f49; padding: 24px 32px; text-align: left; border-radius: 8px 8px 0 0;">
      <span style="color: #38bdf8; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">PUBLICORE Open Access Publishing</span>
      <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 4px 0 0 0;">Scholarly Communications Notification</h1>
    </div>
  `;

  const brandFooter = `
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 11px; color: #64748b; border-radius: 0 0 8px 8px;">
      <p style="margin: 0 0 4px 0;">This communication was dispatched automatically under <strong>PUBLICORE Editorial Governance</strong>.</p>
      <p style="margin: 0;">Preserved in compliance with the Committee on Publication Ethics (COPE) core practices.</p>
    </div>
  `;

  let subject = "";
  let bodyContent = "";

  switch (type) {
    case "SUBMISSION_RECEIPT":
      subject = `[PUBLICORE] Manuscript Receipt: ${data.manuscriptCode || "New Submission"}`;
      bodyContent = `
        <h2 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Submission Acknowledgment</h2>
        <p>Dear ${data.recipientName},</p>
        <p>Thank you for submitting your research paper to <strong>${data.journalName || "PUBLICORE Journals"}</strong>. Your contribution has entered the initial editorial intake queue.</p>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0; font-size: 12px; color: #166534;"><strong>Manuscript ID:</strong> ${data.manuscriptCode || "PUB-2026-X89"}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 600; color: #0f172a;">${data.manuscriptTitle || "Untitled Contribution"}</p>
        </div>
        <p>You may track live editorial progress, review scorecards, and timeline milestones through your Author Dashboard.</p>
      `;
      break;

    case "REVIEWER_INVITATION":
      subject = `[PUBLICORE] Invitation to Peer Review: ${data.manuscriptCode || "Research Paper"}`;
      bodyContent = `
        <h2 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Invitation to Review a Manuscript</h2>
        <p>Dear Dr. ${data.recipientName},</p>
        <p>Because of your recognized expertise in this field, the editorial board of <strong>${data.journalName || "PUBLICORE"}</strong> invites you to evaluate the following double-blind manuscript:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0e7490; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a;">"${data.manuscriptTitle || "Advanced Research Article"}"</p>
        </div>
        <p>Our conflict-of-interest analysis has confirmed zero institutional overlaps. If you are available to evaluate this work within 14 days, please respond via the reviewer portal.</p>
      `;
      break;

    case "EDITORIAL_DECISION":
      subject = `[PUBLICORE] Editorial Decision on Manuscript: ${data.manuscriptCode || "PUB-2026"}`;
      bodyContent = `
        <h2 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Editorial Adjudication Notice</h2>
        <p>Dear ${data.recipientName},</p>
        <p>The peer review process for your manuscript <strong>"${data.manuscriptTitle || "Your Manuscript"}"</strong> is complete. The editor has reached the following decision:</p>
        <div style="background-color: #e0f2fe; border: 1px solid #bae6fd; border-left: 4px solid #0284c7; padding: 14px 18px; border-radius: 6px; margin: 16px 0;">
          <span style="font-size: 11px; font-weight: 800; color: #0369a1; text-transform: uppercase;">Official Decision:</span>
          <h3 style="margin: 2px 0 0 0; font-size: 18px; color: #082f49;">${data.decision || "Accepted"}</h3>
        </div>
        ${data.comments ? `<p style="font-style: italic; color: #475569; background: #fafafa; padding: 10px; border-radius: 4px;"><strong>Editor Notes:</strong> ${data.comments}</p>` : ""}
      `;
      break;

    case "PUBLICATION_NOTICE":
      subject = `[PUBLICORE] Article Published & Crossref DOI Registered: ${data.doi || "10.1042/pub"}`;
      bodyContent = `
        <h2 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Publication & DOI Registration Announcement</h2>
        <p>Dear ${data.recipientName},</p>
        <p>We are delighted to confirm that your peer-reviewed contribution <strong>"${data.manuscriptTitle}"</strong> has completed production typesetting and is officially published with open access.</p>
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-left: 4px solid #059669; padding: 14px 18px; border-radius: 6px; margin: 16px 0;">
          <span style="font-size: 11px; font-weight: 800; color: #065f46; text-transform: uppercase;">Official Registered DOI:</span>
          <p style="margin: 2px 0 0 0; font-family: monospace; font-size: 14px; font-weight: bold; color: #064e3b;">https://doi.org/${data.doi || "10.1042/pub.2026.04189"}</p>
        </div>
      `;
      break;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f1f5f9; color: #334155; }
          .container { max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.03); }
          .content { padding: 28px 32px; font-size: 13.5px; line-height: 1.6; }
          .btn { display: inline-block; padding: 10px 20px; background-color: #082f49; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 12px; border-radius: 6px; margin-top: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${brandHeader}
          <div class="content">
            ${bodyContent}
            ${data.actionUrl ? `<a href="${data.actionUrl}" class="btn" style="color:#ffffff;">View Manuscript In Portal &rarr;</a>` : ""}
          </div>
          ${brandFooter}
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}

export const emailService = {
  getDispatchedEmails(): ScholarlyEmail[] {
    const list = getStoredEmails();
    if (list.length === 0) {
      // Seed realistic initial sent emails
      const initial: ScholarlyEmail[] = [
        {
          id: "em-001",
          to: "elena.rostova@cambridge.ac.uk",
          toName: "Dr. Elena Rostova",
          subject: "[PUBLICORE] Manuscript Receipt: PUB-2026-0891",
          templateType: "SUBMISSION_RECEIPT",
          htmlContent: generateEmailHtml("SUBMISSION_RECEIPT", {
            recipientName: "Dr. Elena Rostova",
            manuscriptCode: "PUB-2026-0891",
            manuscriptTitle: "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis",
            journalName: "PUBLICORE Transactions on AI",
          }).html,
          sentAt: new Date(Date.now() - 3600000 * 24 * 2).toLocaleString(),
          status: "delivered",
        },
        {
          id: "em-002",
          to: "k-sato@kyoto-u.ac.jp",
          toName: "Dr. Kenji Sato",
          subject: "[PUBLICORE] Invitation to Peer Review: PUB-2026-1142",
          templateType: "REVIEWER_INVITATION",
          htmlContent: generateEmailHtml("REVIEWER_INVITATION", {
            recipientName: "Kenji Sato",
            manuscriptCode: "PUB-2026-1142",
            manuscriptTitle: "Adaptive Transformer Distillation on Edge Devices",
            journalName: "PUBLICORE Transactions on AI",
            actionUrl: "http://localhost:3000/dashboard/reviewer",
          }).html,
          sentAt: new Date(Date.now() - 3600000 * 18).toLocaleString(),
          status: "delivered",
        },
      ];
      saveStoredEmails(initial);
      return initial;
    }
    return list;
  },

  async sendEmail(params: {
    to: string;
    toName: string;
    templateType: EmailTemplateType;
    data: {
      manuscriptTitle?: string;
      manuscriptCode?: string;
      journalName?: string;
      decision?: string;
      doi?: string;
      actionUrl?: string;
      comments?: string;
    };
    customApiKey?: string;
  }): Promise<{ success: boolean; mode: "live" | "simulated"; email: ScholarlyEmail; error?: string }> {
    const { subject, html } = generateEmailHtml(params.templateType, {
      recipientName: params.toName,
      ...params.data,
    });

    let deliveryMode: "live" | "simulated" = "simulated";

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: params.to,
          subject,
          html,
          apiKey: params.customApiKey,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.mode === "live") {
          deliveryMode = "live";
        }
      }
    } catch (e) {
      console.warn("Email API endpoint call failed, recording in outbox:", e);
    }

    const newEmail: ScholarlyEmail = {
      id: `em-${Date.now()}`,
      to: params.to,
      toName: params.toName,
      subject,
      templateType: params.templateType,
      htmlContent: html,
      sentAt: new Date().toLocaleString(),
      status: deliveryMode === "live" ? "delivered" : "simulated",
      metadata: params.data,
    };

    const current = getStoredEmails();
    saveStoredEmails([newEmail, ...current]);

    return {
      success: true,
      mode: deliveryMode,
      email: newEmail,
    };
  },
};
