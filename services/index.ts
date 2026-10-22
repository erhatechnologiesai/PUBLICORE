import {
  MOCK_ARTICLES,
  MOCK_JOURNALS,
  MOCK_CONFERENCES,
  MOCK_COMMUNITIES,
  MOCK_MANUSCRIPTS,
  MOCK_RESEARCH_GAPS,
  MOCK_RESEARCH_TRENDS,
  MOCK_USERS,
} from "../mock/data";
import {
  Article,
  Journal,
  Conference,
  Community,
  Manuscript,
  ResearchGap,
  ResearchTrend,
  User,
  ReviewerMatch,
  ManuscriptStatus,
  AIChatMessage,
} from "../types";

// Helper for simulating async API network latency
const delay = (ms: number = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// Persistent State Management Keys
// ==========================================
const STORAGE_KEY_MANUSCRIPTS = "publicore_phase2_manuscripts";
const STORAGE_KEY_ARTICLES = "publicore_phase2_articles";
const STORAGE_KEY_ACTIVE_MS = "publicore_phase2_active_ms";
const STORAGE_KEY_USER = "publicore_phase2_user";

// In-Memory cache with localStorage synchronization
let inMemoryManuscripts: Manuscript[] = [...MOCK_MANUSCRIPTS];
let inMemoryArticles: Article[] = [...MOCK_ARTICLES];
let inMemoryActiveMsId: string = MOCK_MANUSCRIPTS[0]?.id || "ms-001";
let currentUser: User = MOCK_USERS[0]; // Default: Dr. Elena Rostova (Author)

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function notifyStateChange() {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent("publicore_state_change"));
  }
}

function loadManuscriptsFromStorage(): Manuscript[] {
  if (!isBrowser()) return inMemoryManuscripts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MANUSCRIPTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryManuscripts = parsed;
        return inMemoryManuscripts;
      }
    }
    // Initialize storage if empty
    localStorage.setItem(STORAGE_KEY_MANUSCRIPTS, JSON.stringify(inMemoryManuscripts));
  } catch (err) {
    console.warn("Storage access failed, using in-memory state:", err);
  }
  return inMemoryManuscripts;
}

function saveManuscriptsToStorage(list: Manuscript[]) {
  inMemoryManuscripts = list;
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEY_MANUSCRIPTS, JSON.stringify(list));
    } catch (err) {
      console.warn("Storage save failed:", err);
    }
    notifyStateChange();
  }
}

function loadArticlesFromStorage(): Article[] {
  if (!isBrowser()) return inMemoryArticles;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryArticles = parsed;
        return inMemoryArticles;
      }
    }
    localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(inMemoryArticles));
  } catch (err) {
    console.warn("Articles storage access failed:", err);
  }
  return inMemoryArticles;
}

function saveArticlesToStorage(list: Article[]) {
  inMemoryArticles = list;
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(list));
    } catch (err) {
      console.warn("Articles save failed:", err);
    }
    notifyStateChange();
  }
}

// Helper to progress manuscript timeline sequentially
function updateTimelineForStatus(ms: Manuscript, newStatus: ManuscriptStatus): Manuscript {
  const STAGES_ORDER: ManuscriptStatus[] = [
    "Submitted",
    "Screening",
    "Editor Assigned",
    "Reviewer Invited",
    "Under Review",
    "Revision",
    "Accepted",
    "Production",
    "Published",
    "DOI Registered",
  ];

  const targetIdx = STAGES_ORDER.indexOf(newStatus);
  const todayStr = new Date().toISOString().split("T")[0];

  const updatedTimeline = STAGES_ORDER.map((stageName, idx) => {
    if (newStatus === "Rejected") {
      if (stageName === "Submitted" || stageName === "Screening") {
        return { stage: stageName, date: todayStr, completed: true, current: false };
      }
      return { stage: stageName, date: "N/A", completed: false, current: false };
    }

    if (idx < targetIdx) {
      return { stage: stageName, date: todayStr, completed: true, current: false };
    } else if (idx === targetIdx) {
      const isComplete = newStatus === "Accepted" || newStatus === "Published" || newStatus === "DOI Registered";
      return { stage: stageName, date: "Today", completed: isComplete, current: true };
    } else {
      return { stage: stageName, date: "Pending", completed: false, current: false };
    }
  });

  return {
    ...ms,
    status: newStatus,
    updatedAt: todayStr,
    timeline: updatedTimeline,
  };
}

// ==========================================
// 1. Auth Service (Cookie & Token Backed)
// ==========================================
import { authManager } from "./auth";
export const authService = authManager;
export { authManager };

// ==========================================
// 2. Article Service (Scholarly Discovery)
// ==========================================
export const articleService = {
  async getAll(params?: {
    journalId?: string;
    query?: string;
    subject?: string;
    openAccessOnly?: boolean;
  }): Promise<Article[]> {
    await delay(100);
    let list = loadArticlesFromStorage();
    if (params?.journalId) {
      list = list.filter((a) => a.journalId === params.journalId);
    }
    if (params?.openAccessOnly) {
      list = list.filter((a) => a.isOpenAccess);
    }
    if (params?.query) {
      const q = params.query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.abstract.toLowerCase().includes(q) ||
          a.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async getByIdOrSlug(idOrSlug: string): Promise<Article | null> {
    await delay(80);
    const articles = loadArticlesFromStorage();
    const article = articles.find(
      (a) => a.id === idOrSlug || a.slug === idOrSlug
    );
    if (article) return article;

    // Check if it's a published manuscript that needs an on-the-fly article view
    const manuscripts = loadManuscriptsFromStorage();
    const ms = manuscripts.find((m) => m.id === idOrSlug || m.code === idOrSlug);
    if (ms) {
      return {
        id: ms.id,
        slug: ms.code.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        doi: ms.doi || `10.1042/pub.2026.${Math.floor(1000 + Math.random() * 9000)}`,
        title: ms.title,
        articleType: ms.articleType,
        isOpenAccess: true,
        journalId: ms.journalId,
        journalName: ms.journalName,
        volume: "14",
        issue: "2",
        publishedAt: ms.updatedAt || new Date().toISOString().split("T")[0],
        receivedAt: ms.submittedAt,
        acceptedAt: ms.updatedAt,
        authors: ms.authors,
        abstract: ms.abstract,
        keywords: ms.keywords,
        metrics: {
          views: 142,
          downloads: 38,
          citations: 0,
          altmetricScore: 12,
          fieldCitationRatio: 1.0,
        },
        sections: [
          {
            id: "introduction",
            heading: "1. Introduction & Theoretical Foundations",
            content: `The dissemination of scholarly research in computational science necessitates reproducible frameworks. In this study, we present the empirical evaluation of ${ms.title}. Our method addresses prior constraints observed in existing benchmarks.`,
          },
          {
            id: "methodology",
            heading: "2. Methodology & Experimental Architecture",
            content: `We establish an end-to-end processing pipeline validating ${ms.keywords.join(", ")}. Experiments were carried out across standardized multi-center cohorts with strict statistical cross-validation.`,
          },
          {
            id: "results",
            heading: "3. Empirical Results & Discussion",
            content: `The results demonstrate consistent gains across standard metrics. Peer review feedback provided by academic reviewers confirmed mathematical rigor and validity under double-blind assessment.`,
          },
          {
            id: "conclusion",
            heading: "4. Conclusion & Broader Scientific Impact",
            content: `We have presented ${ms.title}. Complete replication scripts and datasets are archived under open-access repositories under PUBLICORE guidelines.`,
          },
        ],
        figures: [],
        tables: [],
        references: [
          {
            id: "ref-1",
            citationNumber: 1,
            authors: "Rostova, E., Mercer, J. H., et al.",
            title: "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis",
            journal: "Publicore Transactions on Artificial Intelligence",
            year: 2026,
            doi: "10.1042/pub.2026.04189",
          },
        ],
        relatedArticleIds: ["art-001", "art-002"],
      };
    }

    return articles[0] || null;
  },

  async getFeatured(): Promise<Article[]> {
    await delay(100);
    const articles = loadArticlesFromStorage();
    return articles.slice(0, 3);
  },
};

// ==========================================
// 3. Manuscript Service (Full Lifecycle Sequential Engine)
// ==========================================
export const manuscriptService = {
  async getAll(): Promise<Manuscript[]> {
    await delay(100);
    return loadManuscriptsFromStorage();
  },

  async getByAuthorEmail(email: string): Promise<Manuscript[]> {
    await delay(80);
    const list = loadManuscriptsFromStorage();
    return list.filter((m) =>
      m.authors.some((a) => a.email.toLowerCase() === email.toLowerCase())
    );
  },

  async getById(id: string): Promise<Manuscript | null> {
    await delay(80);
    const list = loadManuscriptsFromStorage();
    return list.find((m) => m.id === id || m.code === id) || null;
  },

  async getActiveSequenceManuscript(): Promise<Manuscript> {
    const list = loadManuscriptsFromStorage();
    let activeId = inMemoryActiveMsId;
    if (isBrowser()) {
      activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_MS) || inMemoryActiveMsId;
    }
    const found = list.find((m) => m.id === activeId);
    return found || list[0] || MOCK_MANUSCRIPTS[0];
  },

  async setActiveSequenceManuscript(id: string): Promise<void> {
    inMemoryActiveMsId = id;
    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE_MS, id);
      } catch (e) {}
      notifyStateChange();
    }
  },

  // SEQUENCE STEP 1: Author Submission
  async createSubmission(
    payload: Partial<Manuscript> & { file?: File }
  ): Promise<Manuscript> {
    await delay(300);
    const list = loadManuscriptsFromStorage();
    const newId = `ms-${Date.now()}`;
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const todayStr = new Date().toISOString().split("T")[0];

    const newMs: Manuscript = {
      id: newId,
      code: `PUB-2026-${codeNumber}`,
      title: payload.title || "Untitled Manuscript",
      abstract: payload.abstract || "",
      keywords: payload.keywords && payload.keywords.length ? payload.keywords : ["Computational Science", "Artificial Intelligence"],
      articleType: payload.articleType || "Research Article",
      journalId: payload.journalId || "j-ai",
      journalName:
        MOCK_JOURNALS.find((j) => j.id === payload.journalId)?.title ||
        "Publicore Transactions on Artificial Intelligence",
      authors: payload.authors && payload.authors.length ? payload.authors : [
        {
          name: currentUser.name || "Dr. Elena Rostova",
          email: currentUser.email || "elena.rostova@cambridge.ac.uk",
          institution: currentUser.institution || "University of Cambridge",
          isCorresponding: true,
          order: 1,
        },
      ],
      status: "Submitted",
      submittedAt: todayStr,
      updatedAt: todayStr,
      version: 1,
      fileUrl: payload.fileUrl,
      fundingDetails: payload.fundingDetails,
      supplementaryFiles: payload.supplementaryFiles,
      rebuttalLetter: payload.rebuttalLetter,
      datasourceUrl: payload.datasourceUrl,
      analysisFile: payload.analysisFile,
      affiliations: payload.affiliations,
      authorDetails: payload.authorDetails,
      matchedOrgs: payload.matchedOrgs,
      openAccessChoice: payload.openAccessChoice,
      preprintDetails: payload.preprintDetails,
      suggestedReviewers: payload.suggestedReviewers,
      aiScreening: {
        scopeMatch: 95,
        completeness: 98,
        researchArea: "Applied Computational Intelligence",
        secondaryAreas: ["Algorithms & Machine Learning"],
        noveltyScore: 92,
        methodologyRigor: 94,
        plagiarismSimilarity: 3.2,
        potentialIssues: [],
        keyHighlights: [
          "Complete mathematical proofs provided in Appendix",
          "Open science repository link included in methodology",
        ],
        suggestedKeywords: ["Deep Learning", "Empirical Evaluation", "Reproducibility"],
      },
      timeline: [
        { stage: "Submitted", date: "Today", completed: true, current: true },
        { stage: "Screening", date: "Pending", completed: false, current: false },
        { stage: "Editor Assigned", date: "Pending", completed: false, current: false },
        { stage: "Reviewer Invited", date: "Pending", completed: false, current: false },
        { stage: "Under Review", date: "Pending", completed: false, current: false },
        { stage: "Revision", date: "Pending", completed: false, current: false },
        { stage: "Accepted", date: "Pending", completed: false, current: false },
        { stage: "Production", date: "Pending", completed: false, current: false },
        { stage: "Published", date: "Pending", completed: false, current: false },
        { stage: "DOI Registered", date: "Pending", completed: false, current: false },
      ],
    };

    const updatedList = [newMs, ...list];
    saveManuscriptsToStorage(updatedList);
    this.setActiveSequenceManuscript(newMs.id);
    return newMs;
  },

  // SEQUENCE STEP 2: Desk Screening
  async screenManuscript(
    id: string,
    action: "pass" | "reject",
    notes?: string
  ): Promise<Manuscript | null> {
    await delay(200);
    const list = loadManuscriptsFromStorage();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    const nextStatus: ManuscriptStatus = action === "pass" ? "Reviewer Invited" : "Rejected";
    const updated = updateTimelineForStatus(list[idx], nextStatus);
    list[idx] = updated;
    saveManuscriptsToStorage([...list]);
    return updated;
  },

  // SEQUENCE STEP 3: Assign Reviewers
  async assignReviewers(
    manuscriptId: string,
    reviewerCandidates: ReviewerMatch[]
  ): Promise<Manuscript | null> {
    await delay(250);
    const list = loadManuscriptsFromStorage();
    const idx = list.findIndex((m) => m.id === manuscriptId);
    if (idx === -1) return null;

    const ms = list[idx];
    const updatedMs = updateTimelineForStatus(
      {
        ...ms,
        reviewers: reviewerCandidates,
      },
      "Under Review"
    );

    list[idx] = updatedMs;
    saveManuscriptsToStorage([...list]);
    return updatedMs;
  },

  // SEQUENCE STEP 4: Reviewer Submits Peer Review
  async submitReview(
    manuscriptId: string,
    reviewPayload: {
      reviewerName?: string;
      recommendation: "Accept" | "Minor Revision" | "Major Revision" | "Reject";
      commentsForAuthors: string;
      confidentialEditorComments: string;
      scores: {
        originality: number;
        methodology: number;
        clarity: number;
        significance: number;
      };
    }
  ): Promise<Manuscript | null> {
    await delay(250);
    const list = loadManuscriptsFromStorage();
    const idx = list.findIndex((m) => m.id === manuscriptId);
    if (idx === -1) return null;

    const ms = list[idx];
    const existingComments = ms.reviewerComments || [];
    const newComment = {
      id: `rev-${Date.now()}`,
      reviewerName: reviewPayload.reviewerName || currentUser.name || "Dr. Kenji Sato",
      date: new Date().toISOString().split("T")[0],
      recommendation: reviewPayload.recommendation,
      comments: reviewPayload.commentsForAuthors,
      aiSummary: `Reviewer recommends ${reviewPayload.recommendation} with high rigor (${reviewPayload.scores.methodology}/5).`,
    };

    const updatedMs: Manuscript = {
      ...ms,
      reviewerComments: [newComment, ...existingComments],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    list[idx] = updatedMs;
    saveManuscriptsToStorage([...list]);
    return updatedMs;
  },

  // SEQUENCE STEP 5: Editorial Decision
  async submitDecision(
    manuscriptId: string,
    decision: "Accept" | "Minor Revision" | "Major Revision" | "Reject",
    comments: string
  ): Promise<Manuscript | null> {
    await delay(250);
    const list = loadManuscriptsFromStorage();
    const idx = list.findIndex((m) => m.id === manuscriptId);
    if (idx === -1) return null;

    let targetStatus: ManuscriptStatus = "Accepted";
    if (decision === "Minor Revision" || decision === "Major Revision") {
      targetStatus = "Revision";
    } else if (decision === "Reject") {
      targetStatus = "Rejected";
    }

    const updated = updateTimelineForStatus(list[idx], targetStatus);
    list[idx] = updated;
    saveManuscriptsToStorage([...list]);
    return updated;
  },

  // SEQUENCE STEP 6: Author Revision Submission
  async submitRevision(
    manuscriptId: string,
    payload: {
      revisionNotes?: string[];
      revisedFile?: string;
    }
  ): Promise<Manuscript | null> {
    await delay(300);
    const list = loadManuscriptsFromStorage();
    const idx = list.findIndex((m) => m.id === manuscriptId);
    if (idx === -1) return null;

    const ms = list[idx];
    const updatedMs = updateTimelineForStatus(
      {
        ...ms,
        version: (ms.version || 1) + 1,
      },
      "Under Review"
    );

    list[idx] = updatedMs;
    saveManuscriptsToStorage([...list]);
    return updatedMs;
  },

  // SEQUENCE STEP 7 & 8: Production Ingestion & Live Publication
  async publishToProduction(manuscriptId: string): Promise<{
    manuscript: Manuscript;
    article: Article;
  } | null> {
    await delay(350);
    const list = loadManuscriptsFromStorage();
    const idx = list.findIndex((m) => m.id === manuscriptId);
    if (idx === -1) return null;

    const ms = list[idx];
    const officialDoi = ms.doi || `10.1042/pub.2026.0${Math.floor(1000 + Math.random() * 9000)}`;

    const publishedMs = updateTimelineForStatus(
      {
        ...ms,
        doi: officialDoi,
      },
      "Published"
    );

    list[idx] = publishedMs;
    saveManuscriptsToStorage([...list]);

    // Convert manuscript to official published Article
    const articles = loadArticlesFromStorage();
    const newArticle: Article = {
      id: publishedMs.id,
      slug: publishedMs.code.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      doi: officialDoi,
      title: publishedMs.title,
      articleType: publishedMs.articleType,
      isOpenAccess: true,
      journalId: publishedMs.journalId,
      journalName: publishedMs.journalName,
      volume: "14",
      issue: "2",
      publishedAt: new Date().toISOString().split("T")[0],
      receivedAt: publishedMs.submittedAt,
      acceptedAt: new Date().toISOString().split("T")[0],
      authors: publishedMs.authors,
      abstract: publishedMs.abstract,
      keywords: publishedMs.keywords,
      metrics: {
        views: 312,
        downloads: 84,
        citations: 1,
        altmetricScore: 18,
        fieldCitationRatio: 1.15,
      },
      sections: [
        {
          id: "introduction",
          heading: "1. Introduction",
          content: `Scholarly publishing demands end-to-end transparency. In this peer-reviewed contribution, we present "${publishedMs.title}". The theoretical model was verified through open peer evaluation under PUBLICORE editorial governance.`,
        },
        {
          id: "methodology",
          heading: "2. Methodology & Validation",
          content: `Our evaluation protocol examines core paradigms across ${publishedMs.keywords.join(", ")}. Experimental artifacts are permanently preserved with registered Crossref DOI: ${officialDoi}.`,
        },
        {
          id: "results",
          heading: "3. Results & Peer Discussion",
          content: `Independent peer review scored this work with strong marks for originality and reproducibility. Revisions addressing reviewer feedback were verified prior to production indexing.`,
        },
        {
          id: "conclusion",
          heading: "4. Conclusion",
          content: `We conclude that the findings provide significant empirical value to the scientific community. Open access dissemination ensures unrestricted academic utility worldwide.`,
        },
      ],
      figures: [],
      tables: [],
      references: [
        {
          id: "ref-1",
          citationNumber: 1,
          authors: publishedMs.authors.map((a) => a.name).join(", "),
          title: publishedMs.title,
          journal: publishedMs.journalName,
          year: 2026,
          doi: officialDoi,
        },
      ],
      relatedArticleIds: ["art-001", "art-002"],
    };

    saveArticlesToStorage([newArticle, ...articles.filter((a) => a.id !== newArticle.id)]);

    return {
      manuscript: publishedMs,
      article: newArticle,
    };
  },

  async updateStatus(id: string, status: ManuscriptStatus): Promise<Manuscript | null> {
    await delay(150);
    const list = loadManuscriptsFromStorage();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    const updated = updateTimelineForStatus(list[idx], status);
    list[idx] = updated;
    saveManuscriptsToStorage([...list]);
    return updated;
  },

  // Reset Demo to fresh state
  resetDemoData(): void {
    if (isBrowser()) {
      try {
        localStorage.removeItem(STORAGE_KEY_MANUSCRIPTS);
        localStorage.removeItem(STORAGE_KEY_ARTICLES);
        localStorage.removeItem(STORAGE_KEY_ACTIVE_MS);
      } catch (e) {}
    }
    inMemoryManuscripts = [...MOCK_MANUSCRIPTS];
    inMemoryArticles = [...MOCK_ARTICLES];
    inMemoryActiveMsId = MOCK_MANUSCRIPTS[0]?.id || "ms-001";
    saveManuscriptsToStorage(inMemoryManuscripts);
    saveArticlesToStorage(inMemoryArticles);
    notifyStateChange();
  },
};

// ==========================================
// 4. Editor Service (Queue & Actions)
// ==========================================
export const editorService = {
  async getEditorialQueue(): Promise<Manuscript[]> {
    return manuscriptService.getAll();
  },

  async assignReviewers(
    manuscriptId: string,
    reviewerCandidates: ReviewerMatch[]
  ): Promise<Manuscript | null> {
    return manuscriptService.assignReviewers(manuscriptId, reviewerCandidates);
  },

  async submitDecision(
    manuscriptId: string,
    decision: "Accept" | "Minor Revision" | "Major Revision" | "Reject",
    comments: string
  ): Promise<Manuscript | null> {
    return manuscriptService.submitDecision(manuscriptId, decision, comments);
  },
};

// ==========================================
// 5. Reviewer Service (Workspace & Reviews)
// ==========================================
export const reviewService = {
  async getAssignedReviews(reviewerId?: string): Promise<Manuscript[]> {
    await delay(100);
    const list = await manuscriptService.getAll();
    // Return all manuscripts under review or revision for demonstration
    return list.filter(
      (m) =>
        m.status === "Under Review" ||
        m.status === "Revision" ||
        m.status === "Reviewer Invited"
    );
  },

  async submitReview(
    manuscriptId: string,
    payload: {
      reviewerName?: string;
      recommendation: "Accept" | "Minor Revision" | "Major Revision" | "Reject";
      commentsForAuthors: string;
      confidentialEditorComments: string;
      scores: {
        originality: number;
        methodology: number;
        clarity: number;
        significance: number;
      };
    }
  ): Promise<boolean> {
    const res = await manuscriptService.submitReview(manuscriptId, payload);
    return !!res;
  },
};

// ==========================================
// 6. Journal Service
// ==========================================
export const journalService = {
  async getAll(): Promise<Journal[]> {
    await delay(80);
    return MOCK_JOURNALS;
  },

  async getBySlug(slug: string): Promise<Journal | null> {
    await delay(80);
    return MOCK_JOURNALS.find((j) => j.slug === slug || j.id === slug) || MOCK_JOURNALS[0];
  },
};

// ==========================================
// 7. Conference Service
// ==========================================
export const conferenceService = {
  async getAll(): Promise<Conference[]> {
    await delay(80);
    return MOCK_CONFERENCES;
  },

  async getBySlug(slug: string): Promise<Conference | null> {
    await delay(80);
    return (
      MOCK_CONFERENCES.find((c) => c.slug === slug || c.id === slug) ||
      MOCK_CONFERENCES[0]
    );
  },
};

// ==========================================
// 8. Community Service
// ==========================================
export const communityService = {
  async getAll(): Promise<Community[]> {
    await delay(80);
    return MOCK_COMMUNITIES;
  },

  async getBySlug(slug: string): Promise<Community | null> {
    await delay(80);
    return (
      MOCK_COMMUNITIES.find((c) => c.slug === slug || c.id === slug) ||
      MOCK_COMMUNITIES[0]
    );
  },
};

// ==========================================
// 9. AI Research Intelligence Service
// ==========================================
export const aiService = {
  async askAssistant(
    prompt: string,
    history: AIChatMessage[] = []
  ): Promise<AIChatMessage> {
    await delay(400);

    const q = prompt.toLowerCase();
    let content = "";
    let sources: AIChatMessage["sources"] = [
      {
        id: "art-001",
        title: "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis",
        authors: "Dr. Elena Rostova et al.",
        year: 2026,
        doi: "10.1042/pub.2026.04189",
        excerpt:
          "Conditioned reverse diffusion reliably mirrors biological cellular architecture without losing fine chromatic differentiation across 14,200 specimens.",
      },
      {
        id: "art-002",
        title: "Mitigating Non-Markovian Decoherence in Scalable Transmon Qubits",
        authors: "Dr. Kenji Sato et al.",
        year: 2026,
        doi: "10.1042/pub.2026.03871",
        excerpt:
          "Neural feedback filters extend transverse coherence time T2* by 340% (42 μs to 185 μs) on 128-qubit superconducting transmon arrays.",
      },
    ];

    if (q.includes("contribution") || q.includes("main")) {
      content = `Based on peer-reviewed analysis of recent publications, the core contribution centers on **hierarchical multimodal conditioning** [Source: Rostova et al., 2026]. Specifically:
1. **Bridging Modality Gaps**: Direct alignment between gigapixel morphological patches and spatial transcriptomic RNA velocities.
2. **Empirical Diagnostic Gain**: Elevates few-shot rare neoplastic subtyping AUROC from 0.841 to 0.963 across 11 multicenter cohorts.
3. **Clinical Interpretability**: Verified by triple-blind board-certified pathologist reader studies.`;
    } else if (q.includes("method") || q.includes("explain")) {
      content = `The methodology relies on an anisotropic continuous latent manifold coupled with a dual cross-attention bridge:
- **Diffusion Schedule**: An anisotropic forward Gaussian perturbation over continuous time steps.
- **Cross-Attention Bridge**: Tokenized clinical notes are mapped into joint embeddings with localized spatial transcriptomic markers.
- **Validation**: Evaluated using frozen Vision Transformer backbones under zero-shot and few-shot diagnostic benchmarks.`;
    } else {
      content = `**PUBLICORE AI Synthesis**:
In response to your inquiry regarding *"${prompt}"*, scholarly literature indicates rapid progress toward multi-omics foundation models and closed-loop robotic empirical validation. All generated hypotheses are cross-referenced with peer-reviewed literature indexed on PUBLICORE.`;
    }

    return {
      id: `ai-msg-${Date.now()}`,
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content,
      sources,
      suggestedQuestions: [
        "What are the mathematical formulations behind this?",
        "Compare with baseline StyleGAN3 and DDPM",
        "What potential research gaps remain open in this area?",
      ],
    };
  },

  async getResearchGaps(): Promise<ResearchGap[]> {
    await delay(100);
    return MOCK_RESEARCH_GAPS;
  },

  async getResearchTrends(): Promise<ResearchTrend[]> {
    await delay(100);
    return MOCK_RESEARCH_TRENDS;
  },
};

// ==========================================
// 10. Search Service
// ==========================================
export const searchService = {
  async search(params: {
    query: string;
    mode?: "all" | "semantic" | "ai" | "keywords";
    subject?: string;
    year?: string;
    articleType?: string;
    openAccessOnly?: boolean;
  }): Promise<{
    articles: Article[];
    journals: Journal[];
    conferences: Conference[];
    aiInterpretation?: string;
    totalResults: number;
  }> {
    await delay(150);
    const q = params.query.toLowerCase().trim();

    let articles = loadArticlesFromStorage();
    let journals = [...MOCK_JOURNALS];
    let conferences = [...MOCK_CONFERENCES];

    if (q) {
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.abstract.toLowerCase().includes(q) ||
          a.keywords.some((k) => k.toLowerCase().includes(q)) ||
          a.authors.some((author) => author.name.toLowerCase().includes(q))
      );
      journals = journals.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.subject.toLowerCase().includes(q) ||
          j.topics.some((t) => t.toLowerCase().includes(q))
      );
      conferences = conferences.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.acronym.toLowerCase().includes(q) ||
          c.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.openAccessOnly) {
      articles = articles.filter((a) => a.isOpenAccess);
    }

    const aiInterpretation = q
      ? `AI Query Understanding: Searching scholarly records for concepts related to "${params.query}". Semantically aligned with Multimodal Machine Learning and Diagnostic Validation.`
      : undefined;

    return {
      articles,
      journals,
      conferences,
      aiInterpretation,
      totalResults: articles.length + journals.length + conferences.length,
    };
  },
};

// ==========================================
// 11. Metrics Service
// ==========================================
export const metricsService = {
  async getGlobalMetrics() {
    await delay(80);
    const articles = loadArticlesFromStorage();
    return {
      publishedArticles: 148200 + articles.length,
      activeResearchers: 42350,
      peerReviewedJournals: 42,
      participatingCountries: 114,
      totalCitations: 1984200,
      annualDownloads: 5410000,
      averageReviewTurnaroundDays: 24.6,
      openAccessPercentage: 86.4,
    };
  },
};
