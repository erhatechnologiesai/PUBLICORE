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
const delay = (ms: number = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// 1. Auth Service
// ==========================================
let currentUser: User = MOCK_USERS[0]; // Default: Dr. Elena Rostova (Author)

export const authService = {
  async getCurrentUser(): Promise<User> {
    await delay(150);
    return currentUser;
  },

  async switchRole(role: User["role"]): Promise<User> {
    await delay(200);
    const found = MOCK_USERS.find((u) => u.role === role);
    if (found) {
      currentUser = found;
      return found;
    }
    currentUser = { ...currentUser, role };
    return currentUser;
  },

  async login(email: string): Promise<User> {
    await delay(400);
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      currentUser = user;
      return user;
    }
    // Fallback default
    currentUser = {
      ...MOCK_USERS[0],
      email,
      name: email.split("@")[0].replace(".", " "),
    };
    return currentUser;
  },

  async register(data: Partial<User>): Promise<User> {
    await delay(400);
    currentUser = {
      id: `usr-${Date.now()}`,
      name: data.name || "Dr. New Scholar",
      email: data.email || "scholar@university.edu",
      role: data.role || "author",
      institution: data.institution || "Global Research Institute",
      researchInterests: data.researchInterests || ["Artificial Intelligence"],
      publicationsCount: 0,
      citationsCount: 0,
      hIndex: 0,
    };
    return currentUser;
  },

  async logout(): Promise<void> {
    await delay(150);
    currentUser = MOCK_USERS[0];
  },
};

// ==========================================
// 2. Article Service
// ==========================================
export const articleService = {
  async getAll(params?: {
    journalId?: string;
    query?: string;
    subject?: string;
    openAccessOnly?: boolean;
  }): Promise<Article[]> {
    await delay(250);
    let list = [...MOCK_ARTICLES];
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
    await delay(200);
    const article = MOCK_ARTICLES.find(
      (a) => a.id === idOrSlug || a.slug === idOrSlug
    );
    return article || MOCK_ARTICLES[0]; // fallback to first realistic paper
  },

  async getFeatured(): Promise<Article[]> {
    await delay(200);
    return MOCK_ARTICLES.slice(0, 3);
  },
};

// ==========================================
// 3. Manuscript Service (Author / Lifecycle)
// ==========================================
let manuscriptsState = [...MOCK_MANUSCRIPTS];

export const manuscriptService = {
  async getAll(): Promise<Manuscript[]> {
    await delay(250);
    return [...manuscriptsState];
  },

  async getByAuthorEmail(email: string): Promise<Manuscript[]> {
    await delay(200);
    return manuscriptsState.filter((m) =>
      m.authors.some((a) => a.email.toLowerCase() === email.toLowerCase())
    );
  },

  async getById(id: string): Promise<Manuscript | null> {
    await delay(150);
    return manuscriptsState.find((m) => m.id === id) || null;
  },

  async createSubmission(
    payload: Partial<Manuscript> & { file?: File }
  ): Promise<Manuscript> {
    await delay(600);
    const newMs: Manuscript = {
      id: `ms-${Date.now()}`,
      code: `PUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: payload.title || "Untitled Manuscript",
      abstract: payload.abstract || "",
      keywords: payload.keywords || ["Computational Science"],
      articleType: payload.articleType || "Research Article",
      journalId: payload.journalId || "j-ai",
      journalName:
        MOCK_JOURNALS.find((j) => j.id === payload.journalId)?.title ||
        "Publicore Transactions on Artificial Intelligence",
      authors: payload.authors || [
        {
          name: currentUser.name,
          email: currentUser.email,
          institution: currentUser.institution,
          isCorresponding: true,
          order: 1,
        },
      ],
      status: "Submitted",
      submittedAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      version: 1,
      aiScreening: {
        scopeMatch: 94,
        completeness: 98,
        researchArea: "Applied Computational Intelligence",
        secondaryAreas: ["Algorithms & Machine Learning"],
        noveltyScore: 92,
        methodologyRigor: 95,
        plagiarismSimilarity: 3.4,
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

    manuscriptsState = [newMs, ...manuscriptsState];
    return newMs;
  },

  async updateStatus(id: string, status: ManuscriptStatus): Promise<Manuscript | null> {
    await delay(300);
    const idx = manuscriptsState.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    const ms = manuscriptsState[idx];
    const updated = {
      ...ms,
      status,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    manuscriptsState[idx] = updated;
    return updated;
  },
};

// ==========================================
// 4. Editor Service
// ==========================================
export const editorService = {
  async getEditorialQueue(): Promise<Manuscript[]> {
    await delay(250);
    return manuscriptsState;
  },

  async assignReviewers(
    manuscriptId: string,
    reviewerIds: string[]
  ): Promise<Manuscript | null> {
    await delay(400);
    const ms = await manuscriptService.getById(manuscriptId);
    if (!ms) return null;
    return ms;
  },

  async submitDecision(
    manuscriptId: string,
    decision: "Accept" | "Minor Revision" | "Major Revision" | "Reject",
    comments: string
  ): Promise<Manuscript | null> {
    await delay(400);
    const statusMap: Record<string, ManuscriptStatus> = {
      Accept: "Accepted",
      "Minor Revision": "Revision",
      "Major Revision": "Revision",
      Reject: "Rejected",
    };
    return manuscriptService.updateStatus(manuscriptId, statusMap[decision]);
  },
};

// ==========================================
// 5. Reviewer Service
// ==========================================
export const reviewService = {
  async getAssignedReviews(reviewerId?: string): Promise<Manuscript[]> {
    await delay(250);
    // Return manuscripts under review or revision
    return manuscriptsState.filter(
      (m) => m.status === "Under Review" || m.status === "Revision"
    );
  },

  async submitReview(
    manuscriptId: string,
    payload: {
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
    await delay(500);
    return true;
  },
};

// ==========================================
// 6. Journal Service
// ==========================================
export const journalService = {
  async getAll(): Promise<Journal[]> {
    await delay(200);
    return MOCK_JOURNALS;
  },

  async getBySlug(slug: string): Promise<Journal | null> {
    await delay(150);
    return MOCK_JOURNALS.find((j) => j.slug === slug || j.id === slug) || MOCK_JOURNALS[0];
  },
};

// ==========================================
// 7. Conference Service
// ==========================================
export const conferenceService = {
  async getAll(): Promise<Conference[]> {
    await delay(200);
    return MOCK_CONFERENCES;
  },

  async getBySlug(slug: string): Promise<Conference | null> {
    await delay(150);
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
    await delay(200);
    return MOCK_COMMUNITIES;
  },

  async getBySlug(slug: string): Promise<Community | null> {
    await delay(150);
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
    await delay(700);

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
1. **Bridging Modality Gaps**: Direct alignment between gigapixel morphological patches and spatial transcriptomic RNA velocities without requiring full-resolution pixel backpropagation.
2. **Empirical Diagnostic Gain**: Elevates few-shot rare neoplastic subtyping AUROC from 0.841 to 0.963 across 11 multicenter cohorts.
3. **Clinical Interpretability**: Verified by triple-blind board-certified pathologist reader studies with indistinguishability rates equivalent to natural tissue (51.2%).`;
    } else if (q.includes("method") || q.includes("explain")) {
      content = `The methodology relies on an anisotropic continuous latent manifold $\\mathcal{Z}$ coupled with a dual cross-attention bridge:
- **Diffusion Schedule**: An anisotropic forward Gaussian perturbation over $T$ continuous time steps.
- **Cross-Attention Bridge**: Tokenized clinical notes are mapped into joint embeddings with localized spatial transcriptomic markers.
- **Validation**: Evaluated using frozen Vision Transformer backbones under zero-shot and extreme few-shot ($n \\le 5$) diagnostic benchmarks.`;
    } else if (q.includes("limitation") || q.includes("gap") || q.includes("weakness")) {
      content = `Identified limitations across the current literature [Source: PUBLICORE Research Intelligence]:
1. **Spot Resolution Constraints**: Current spatial transcriptomics operates at 55-micron array resolution, aggregating 5–10 cells per spot rather than true single-cell sequencing.
2. **Compute Bottlenecks**: Full whole-slide backpropagation still requires patch-based tiling rather than unified slide representations.
3. **Out-of-Distribution Stains**: While H&E stains generalize reliably, non-standard immunohistochemical stains (IHC) exhibit higher variance.`;
    } else {
      content = `**PUBLICORE AI Synthesis**:
In response to your inquiry regarding *"${prompt}"*, current literature highlights two major paradigms:
1. **Generative Foundation Models** are increasingly moving toward multi-omics conditioning (coupling imaging, clinical records, and genomics).
2. **Active Bayesian Experimentation** is enabling autonomous closed-loop laboratories that test hypotheses iteratively with physical validation.

*Note: AI research syntheses are compiled to assist scholarly exploration and require empirical researcher validation.*`;
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
    await delay(300);
    return MOCK_RESEARCH_GAPS;
  },

  async getResearchTrends(): Promise<ResearchTrend[]> {
    await delay(300);
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
    await delay(350);
    const q = params.query.toLowerCase().trim();

    let articles = [...MOCK_ARTICLES];
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
      ? `AI Query Understanding: Searching scholarly records for concepts related to "${params.query}". Semantically aligned with Multimodal Machine Learning, Digital Pathology, and High-Throughput Diagnostic Validation.`
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
    await delay(200);
    return {
      publishedArticles: 148200,
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
