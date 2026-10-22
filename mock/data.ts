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
} from "../types";

export const MOCK_USERS: User[] = [
  {
    id: "usr-001",
    name: "Dr. Elena Rostova",
    email: "elena.rostova@cambridge.ac.uk",
    role: "author",
    title: "Principal Investigator & Senior Research Fellow",
    institution: "University of Cambridge",
    department: "Department of Computer Science and Technology",
    orcid: "0000-0002-1825-0097",
    hIndex: 34,
    publicationsCount: 68,
    citationsCount: 4210,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    researchInterests: [
      "Multimodal Representation Learning",
      "Medical Diagnostic AI",
      "Explainable Machine Learning",
      "Computational Biology",
    ],
  },
  {
    id: "usr-002",
    name: "Prof. Marcus Vance",
    email: "m.vance@stanford.edu",
    role: "editor",
    title: "Professor of Electrical Engineering & Editor-in-Chief",
    institution: "Stanford University",
    department: "School of Engineering",
    orcid: "0000-0001-9243-7711",
    hIndex: 58,
    publicationsCount: 142,
    citationsCount: 18450,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    researchInterests: [
      "Autonomous Robotics",
      "Edge Computing",
      "Reinforcement Learning Systems",
    ],
  },
  {
    id: "usr-003",
    name: "Dr. Kenji Sato",
    email: "k-sato@kyoto-u.ac.jp",
    role: "reviewer",
    title: "Associate Professor of Quantum Information",
    institution: "Kyoto University",
    department: "Graduate School of Informatics",
    orcid: "0000-0003-4412-8902",
    hIndex: 29,
    publicationsCount: 51,
    citationsCount: 3120,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    researchInterests: [
      "Quantum Coherence",
      "Superconducting Qubits",
      "Noise Mitigation Algorithms",
    ],
  },
  {
    id: "usr-004",
    name: "Dr. Sarah Al-Mansoor",
    role: "reviewer",
    email: "s.almansoor@imperial.ac.uk",
    title: "Reader in Molecular Bioengineering",
    institution: "Imperial College London",
    orcid: "0000-0002-6114-934X",
    hIndex: 31,
    publicationsCount: 47,
    citationsCount: 3890,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    researchInterests: [
      "Targeted Drug Nanocarriers",
      "Synthetic Biology",
      "Lipid Nanoparticles",
    ],
  },
  {
    id: "usr-005",
    name: "Dr. Robert Sterling",
    role: "admin",
    email: "admin@publicore.org",
    title: "Head of Editorial Operations & Research Integrity",
    institution: "PUBLICORE Global Secretariat",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    researchInterests: [
      "Research Integrity",
      "Bibliometrics",
      "Open Science Infrastructure",
    ],
  },
];

export const MOCK_JOURNALS: Journal[] = [
  {
    id: "j-ai",
    slug: "transactions-artificial-intelligence",
    title: "Publicore Transactions on Artificial Intelligence",
    shortTitle: "PTAI",
    issn: "2834-9102",
    subject: "Artificial Intelligence & Computational Intelligence",
    topics: [
      "Deep Learning Architectures",
      "Foundation Models",
      "Computer Vision",
      "Natural Language Understanding",
      "Reinforcement Learning",
      "AI Safety & Alignment",
    ],
    description:
      "A flagship international peer-reviewed journal publishing breakthrough foundational and applied research in machine intelligence, deep learning systems, neural representations, and scalable AI infrastructure.",
    aimsAndScope:
      "PTAI solicits high-impact original contributions that push mathematical boundaries, algorithmic efficiencies, and empirical rigor across all branches of computational learning. Submissions undergo rigorous double-blind peer review augmented by AI screening.",
    metrics: {
      impactFactor: 14.82,
      citescore: 18.4,
      acceptanceRate: 14,
      timeToFirstDecisionDays: 21,
      timeToPublishDays: 45,
    },
    openAccess: true,
    chiefEditor: {
      name: "Prof. Marcus Vance",
      institution: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    latestIssue: "Vol. 12, Issue 4 (October 2026)",
    totalArticles: 1420,
  },
  {
    id: "j-bio",
    slug: "journal-bioengineering-health",
    title: "Publicore Journal of Bioengineering & Medicine",
    shortTitle: "PJBM",
    issn: "2834-9110",
    subject: "Biomedical Engineering & Translational Medicine",
    topics: [
      "Targeted Nanomedicine",
      "Genomic Engineering",
      "Biomaterials",
      "Computational Pathology",
      "Prosthetic Neural Interfaces",
    ],
    description:
      "Publishing cross-disciplinary investigations at the convergence of clinical medicine, synthetic biology, molecular design, and microfluidics.",
    aimsAndScope:
      "The journal is dedicated to rapid dissemination of pre-clinical validations, clinical cohort trials, and biophysical engineering frameworks advancing human wellness.",
    metrics: {
      impactFactor: 11.65,
      citescore: 15.2,
      acceptanceRate: 18,
      timeToFirstDecisionDays: 24,
      timeToPublishDays: 52,
    },
    openAccess: true,
    chiefEditor: {
      name: "Prof. Diane Kingsley, MD",
      institution: "Johns Hopkins Medicine",
      avatar: "https://images.unsplash.com/photo-1594824813511-209a8966ec06?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80",
    latestIssue: "Vol. 9, Issue 8 (September 2026)",
    totalArticles: 980,
  },
  {
    id: "j-quantum",
    slug: "quantum-systems-computing",
    title: "Publicore Quantum Systems & Computing",
    shortTitle: "PQSC",
    issn: "2834-9129",
    subject: "Quantum Information Science & Engineering",
    topics: [
      "Superconducting Circuits",
      "Trapped Ion Hardware",
      "Quantum Error Correction",
      "Topological Quantum Matter",
      "Quantum Cryptography",
    ],
    description:
      "The primary venue for physical demonstrations and theoretical advances across scalable quantum hardware architectures and quantum algorithmic complexity.",
    aimsAndScope:
      "We prioritize manuscripts presenting reproducible quantum experimental data, fault-tolerant fault rates, and provable quantum advantages.",
    metrics: {
      impactFactor: 16.3,
      citescore: 21.0,
      acceptanceRate: 12,
      timeToFirstDecisionDays: 19,
      timeToPublishDays: 39,
    },
    openAccess: true,
    chiefEditor: {
      name: "Prof. Arthur Chen, FRS",
      institution: "ETH Zürich",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    latestIssue: "Vol. 6, Issue 3 (September 2026)",
    totalArticles: 640,
  },
  {
    id: "j-energy",
    slug: "sustainable-energy-materials",
    title: "Publicore Sustainable Energy & Materials",
    shortTitle: "PSEM",
    issn: "2834-9137",
    subject: "Renewable Energy & Advanced Materials",
    topics: [
      "Solid-State Batteries",
      "Perovskite Photovoltaics",
      "Direct Carbon Capture",
      "Hydrogen Catalysis",
      "Grid Optimization",
    ],
    description:
      "A peer-reviewed journal delivering research on electrochemical energy storage, decarbonization technologies, and thermodynamic transport phenomena.",
    aimsAndScope:
      "Articles must validate lifecycle scalability and sustainable synthesis pathways.",
    metrics: {
      impactFactor: 9.84,
      citescore: 12.7,
      acceptanceRate: 22,
      timeToFirstDecisionDays: 26,
      timeToPublishDays: 58,
    },
    openAccess: true,
    chiefEditor: {
      name: "Dr. Hiroshi Tanaka",
      institution: "Tokyo Institute of Technology",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
    latestIssue: "Vol. 8, Issue 5 (August 2026)",
    totalArticles: 790,
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: "art-001",
    slug: "multimodal-latent-diffusion-pathology",
    doi: "10.1042/pub.2026.04189",
    title:
      "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis and Rare Cancer Subtyping",
    articleType: "Research Article",
    isOpenAccess: true,
    journalId: "j-ai",
    journalName: "Publicore Transactions on Artificial Intelligence",
    volume: "12",
    issue: "4",
    publishedAt: "2026-09-28",
    receivedAt: "2026-05-14",
    acceptedAt: "2026-09-02",
    authors: [
      {
        name: "Dr. Elena Rostova",
        email: "elena.rostova@cambridge.ac.uk",
        institution: "Department of Computer Science and Technology, University of Cambridge, UK",
        orcid: "0000-0002-1825-0097",
        isCorresponding: true,
        order: 1,
      },
      {
        name: "Julian H. Mercer",
        email: "j.mercer@ox.ac.uk",
        institution: "Nuffield Department of Clinical Neurosciences, University of Oxford, UK",
        isCorresponding: false,
        order: 2,
      },
      {
        name: "Dr. Sarah Al-Mansoor",
        email: "s.almansoor@imperial.ac.uk",
        institution: "Department of Bioengineering, Imperial College London, UK",
        orcid: "0000-0002-6114-934X",
        isCorresponding: false,
        order: 3,
      },
      {
        name: "Prof. Marcus Vance",
        email: "m.vance@stanford.edu",
        institution: "Department of Electrical Engineering, Stanford University, USA",
        isCorresponding: false,
        order: 4,
      },
    ],
    abstract:
      "Whole-slide histopathology imaging presents profound computational challenges owing to gigapixel dimensions, stain variability, and severe class imbalances in rare neoplastic subtypes. Here, we present PathoLatent-X, a hierarchical multimodal latent diffusion architecture conditioned on paired clinical notes and spatial transcriptomic profiles. By formulating diffusion steps over an anisotropic continuous representation space, PathoLatent-X synthesizes gigapixel-equivalent patches with cellular-level fidelity while preserving genetic marker associations. Across a cohort of 14,200 multi-center histological specimens spanning 11 rare oncology classes, PathoLatent-X improves downstream diagnostic area under the curve (AUC) from 0.841 to 0.963 (p < 0.001) in extreme few-shot regimes (n <= 5 samples per class). Furthermore, attention analysis demonstrates that our cross-attention guidance captures verifiable cytomorphological nuclear atypia, offering biological interpretability for clinical pathology workflows.",
    keywords: [
      "Latent Diffusion Models",
      "Digital Pathology",
      "Spatial Transcriptomics",
      "Few-Shot Learning",
      "Medical Diagnostics",
      "Explainable AI",
    ],
    metrics: {
      views: 14820,
      downloads: 4310,
      citations: 87,
      altmetricScore: 312,
      fieldCitationRatio: 4.8,
    },
    sections: [
      {
        id: "introduction",
        heading: "1. Introduction",
        content: `
Diagnostic oncology increasingly relies on digitized whole-slide images (WSIs) to discern intricate histomorphological patterns indicative of malignant transformation. However, supervised deep learning architectures are severely impeded when confronted with ultra-rare tumor phenotypes, where fewer than ten validated specimens may exist across national registries.

Recent progress in generative diffusion probabilistic models has transformed natural image synthesis. Nevertheless, applying standard discrete pixel-space diffusion to gigapixel pathology introduces prohibitive memory complexities and frequently hallucinates pathologically non-viable cellular structures.

In this work, we formulate PathoLatent-X, a multimodal generative paradigm that explicitly couples micro-anatomical image patches with spatial transcriptomic gene expression profiles $G \\in \\mathbb{R}^{D_g}$ and structured oncology clinical reports. By projecting slide features into a compact manifold $\\mathcal{Z}$, we demonstrate that conditional reverse diffusion reliably mirrors biological cellular architecture without losing fine chromatic differentiation.
        `,
      },
      {
        id: "mathematical-formulation",
        heading: "2. Mathematical Formulation & Architecture",
        content: `
Let $x_0 \\in \\mathcal{X}$ denote a gigapixel tissue patch encoded into latent representation $z_0 = \\mathcal{E}(x_0) \\in \\mathbb{R}^{C \\times H \\times W}$. The forward diffusion process adds Gaussian perturbations over $T$ continuous time intervals according to variance schedule $\\beta_1, \\dots, \\beta_T$:

$$q(z_t | z_{t-1}) = \\mathcal{N}\\left(z_t; \\sqrt{1 - \\beta_t} z_{t-1}, \\beta_t \\mathbf{I}\\right)$$

The joint conditioning objective minimizes the expected squared error over predicted noise $\\epsilon_\\theta$:

$$\\mathcal{L}_{\\text{Patho}}(θ) = \\mathbb{E}_{z_0, \\epsilon \\sim \\mathcal{N}(0, \\mathbf{I}), t, c}\\left[ \\left\\| \\epsilon - \\epsilon_\\theta\\left(z_t, t, \\tau_\\theta(c_{\\text{transcript}}, c_{\\text{notes}})\\right) \\right\\|^2 \\right]$$

where $\\tau_\\theta(\\cdot)$ represents our dual cross-attention bridge aligning tokenized clinical summaries with localized gene-expression signatures.
        `,
      },
      {
        id: "methods",
        heading: "3. Methods and Experimental Protocol",
        content: `
We evaluated PathoLatent-X on the International Rare Tumor Consortium (IRTC) dataset encompassing 14,200 digitized biopsy specimens digitized at 40× magnification. All images were stained via standard Hematoxylin and Eosin (H&E) protocols across 7 academic medical hospitals.

For baseline benchmarking, we implemented state-of-the-art comparative methods: StyleGAN3-Path, Denoising Diffusion Probabilistic Models (DDPM), and Classifier-Free Guided Latent Diffusion (LDM-Base). Downstream classification evaluated zero-shot and few-shot diagnostic sensitivity via frozen Vision Transformer backbones (ViT-H/14).
        `,
      },
      {
        id: "results",
        heading: "4. Experimental Results",
        content: `
Quantitative results indicate superior fidelity and pathological consistency. PathoLatent-X achieved a Fréchet Inception Distance (FID) of 4.12 on test cohorts, substantially outperforming StyleGAN3 (FID 18.74) and baseline LDM (FID 9.85).

In clinical reader studies blinded to three board-certified pathologists, synthetic tissue samples generated by PathoLatent-X were distinguished from authentic biopsies at an accuracy rate no higher than random chance (51.2% indistinguishability, p = 0.89). When synthetic samples were integrated into few-shot classifier training, the diagnostic F1-score across 11 rare malignancies surged by +28.4% relative to standard synthetic augmentation.
        `,
      },
      {
        id: "discussion",
        heading: "5. Discussion & Clinical Implications",
        content: `
Our findings emphasize that conditioning generative models on spatial transcriptomics exerts strong regularizing constraints against histological hallucinations. The synthetic tiles preserve critical cellular landmarks, such as nuclear pleomorphism, chromatin distribution, and stromal desmoplasia.

Crucially, in clinical deployment scenarios, AI systems must operate strictly as decision-support instruments. PathoLatent-X provides uncertainty bounds along each synthesized boundary, enabling pathologists to inspect confidence distributions directly before rendering diagnostic verdicts.
        `,
      },
      {
        id: "conclusion",
        heading: "6. Conclusion",
        content: `
PathoLatent-X establishes a new foundation for multimodal generative modeling in computational medicine. By bridging gigapixel morphology with cellular genomics, our framework mitigates acute data scarcity for rare oncological diseases while ensuring verifiable visual and biological interpretability.
        `,
      },
    ],
    figures: [
      {
        id: "fig-1",
        title: "Figure 1: Architectural Schematic of PathoLatent-X",
        caption:
          "Overview of multimodal conditioning pipeline. High-resolution patch embeddings are coupled with spatial transcriptomics and structured clinical notes through our cross-attention transformer bridge before reverse diffusion.",
        imageUrl:
          "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&auto=format&fit=crop&q=80",
      },
      {
        id: "fig-2",
        title: "Figure 2: Qualitative Comparison of Synthesized Tissue Patches",
        caption:
          "Comparison between authentic biopsy (Column A), PathoLatent-X (Column B), and baseline StyleGAN3 (Column C). Notice preserved nuclear membrane boundaries and chromatin textures in our method.",
        imageUrl:
          "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200&auto=format&fit=crop&q=80",
      },
    ],
    tables: [
      {
        id: "tbl-1",
        title: "Table 1: Few-Shot Diagnostic Performance Benchmark (n = 5 per class)",
        caption:
          "Mean Area Under the ROC Curve (AUROC) and F1 scores with 95% confidence intervals across 11 rare oncology categories.",
        headers: ["Model Pipeline", "AUROC (95% CI)", "F1-Score", "FID ↓", "Pathologist Confusion %"],
        rows: [
          ["ViT-H Baseline (No Aug)", "0.841 (0.82-0.86)", "0.742", "—", "—"],
          ["ViT-H + StyleGAN3-Path", "0.869 (0.85-0.89)", "0.781", "18.74", "32.1%"],
          ["ViT-H + Standard LDM", "0.914 (0.89-0.93)", "0.835", "9.85", "41.6%"],
          ["ViT-H + PathoLatent-X (Ours)", "0.963 (0.95-0.98)", "0.918", "4.12", "51.2%"],
        ],
      },
    ],
    references: [
      {
        id: "ref-1",
        citationNumber: 1,
        authors: "Rombach, R., Blattmann, A., Lorenz, D., Esser, P., & Ommer, B.",
        title: "High-Resolution Image Synthesis with Latent Diffusion Models",
        journal: "Conference on Computer Vision and Pattern Recognition (CVPR)",
        year: 2022,
        pages: "10684-10695",
        doi: "10.1109/CVPR52688.2022.01042",
      },
      {
        id: "ref-2",
        citationNumber: 2,
        authors: "Campanella, G., Hanna, M. G., Geneslaw, L., et al.",
        title: "Clinical-grade computational pathology using weakly supervised deep learning",
        journal: "Nature Medicine",
        year: 2019,
        volume: "25",
        pages: "1301-1309",
        doi: "10.1038/s41591-019-0508-1",
      },
      {
        id: "ref-3",
        citationNumber: 3,
        authors: "Ståhl, P. L., Salmén, F., Vickovic, S., et al.",
        title: "Visualization and analysis of gene expression in tissue sections by spatial transcriptomics",
        journal: "Science",
        year: 2016,
        volume: "353",
        pages: "78-82",
        doi: "10.1126/science.aaf2403",
      },
      {
        id: "ref-4",
        citationNumber: 4,
        authors: "Lu, M. Y., Williamson, D. F., Chen, T. Y., et al.",
        title: "Data-efficient and weakly supervised computational pathology on whole-slide images",
        journal: "Nature Biomedical Engineering",
        year: 2021,
        volume: "5",
        pages: "555-570",
        doi: "10.1038/s41551-020-00682-w",
      },
    ],
    relatedArticleIds: ["art-002", "art-003", "art-004"],
  },
  {
    id: "art-002",
    slug: "quantum-coherence-superconducting-qubits",
    doi: "10.1042/pub.2026.03871",
    title:
      "Mitigating Non-Markovian Decoherence in Scalable Transmon Qubits via Dynamical Decoupling Neural Filters",
    articleType: "Research Article",
    isOpenAccess: true,
    journalId: "j-quantum",
    journalName: "Publicore Quantum Systems & Computing",
    volume: "6",
    issue: "3",
    publishedAt: "2026-09-15",
    receivedAt: "2026-04-10",
    acceptedAt: "2026-08-20",
    authors: [
      {
        name: "Dr. Kenji Sato",
        email: "k-sato@kyoto-u.ac.jp",
        institution: "Department of Quantum Engineering, Kyoto University, Japan",
        orcid: "0000-0003-4412-8902",
        isCorresponding: true,
        order: 1,
      },
      {
        name: "Arthur Chen",
        email: "a.chen@phys.ethz.ch",
        institution: "Department of Physics, ETH Zürich, Switzerland",
        isCorresponding: false,
        order: 2,
      },
    ],
    abstract:
      "Scaling superconducting transmon arrays beyond 1,000 qubits is restricted by low-frequency charge-flux noise and cross-talk decoherence exhibiting complex non-Markovian memory kernels. In this work, we demonstrate a closed-loop neural controller that optimizes microwave dynamical decoupling pulses in real time. Deployed across a 128-qubit planar architecture, our neural filter extends transverse coherence time T2* by 340% (from 42 μs to 185 μs) and reduces two-qubit gate error rates below the fault-tolerant threshold (0.12% vs. 0.85%).",
    keywords: [
      "Quantum Computing",
      "Superconducting Transmons",
      "Dynamical Decoupling",
      "Decoherence Suppression",
      "Quantum Optimal Control",
    ],
    metrics: {
      views: 9450,
      downloads: 2840,
      citations: 54,
      altmetricScore: 198,
      fieldCitationRatio: 3.9,
    },
    sections: [
      {
        id: "intro",
        heading: "1. Introduction",
        content:
          "Practical quantum advantage demands gate fidelities surpassing the quantum error correction threshold. However, solid-state transmon devices interact persistently with two-level fluctuators in dielectric substrates.",
      },
      {
        id: "results",
        heading: "2. Empirical Validations",
        content:
          "Real-time feedback loops achieved randomized benchmarking fidelities of 99.88% across all active couplers.",
      },
    ],
    figures: [],
    tables: [],
    references: [],
    relatedArticleIds: ["art-001"],
  },
  {
    id: "art-003",
    slug: "autonomous-swarm-robotics-distributed-coordination",
    doi: "10.1042/pub.2026.02940",
    title:
      "Asynchronous Consensus and Resilient Swarm Coordination under Adversarial Packet Disruption",
    articleType: "Research Article",
    isOpenAccess: false,
    journalId: "j-ai",
    journalName: "Publicore Transactions on Artificial Intelligence",
    volume: "12",
    issue: "3",
    publishedAt: "2026-08-30",
    receivedAt: "2026-03-12",
    acceptedAt: "2026-07-28",
    authors: [
      {
        name: "Prof. Marcus Vance",
        email: "m.vance@stanford.edu",
        institution: "Department of Electrical Engineering, Stanford University, USA",
        orcid: "0000-0001-9243-7711",
        isCorresponding: true,
        order: 1,
      },
    ],
    abstract:
      "Decentralized multi-robot teams in GPS-denied environments face severe radio interference and malicious sensor spoofing. We establish an asynchronous Byzantine-tolerant consensus theorem for swarm kinematics.",
    keywords: ["Swarm Robotics", "Distributed Systems", "Byzantine Fault Tolerance", "Autonomous Vehicles"],
    metrics: {
      views: 7120,
      downloads: 1940,
      citations: 39,
      altmetricScore: 84,
      fieldCitationRatio: 2.7,
    },
    sections: [],
    figures: [],
    tables: [],
    references: [],
    relatedArticleIds: ["art-001"],
  },
  {
    id: "art-004",
    slug: "solid-state-sulfide-electrolytes-lithium",
    doi: "10.1042/pub.2026.01239",
    title:
      "Doped Argyrodite Sulfide Electrolytes with Ultra-High Ionic Conductivity at Sub-Zero Temperatures",
    articleType: "Research Article",
    isOpenAccess: true,
    journalId: "j-energy",
    journalName: "Publicore Sustainable Energy & Materials",
    volume: "8",
    issue: "5",
    publishedAt: "2026-08-12",
    receivedAt: "2026-02-18",
    acceptedAt: "2026-07-15",
    authors: [
      {
        name: "Dr. Hiroshi Tanaka",
        email: "tanaka@energy.titech.ac.jp",
        institution: "Tokyo Institute of Technology, Japan",
        isCorresponding: true,
        order: 1,
      },
    ],
    abstract:
      "Solid-state lithium batteries promise unprecedented safety and gravimetric density. Here we synthesize a halogen-substituted argyrodite exhibiting record ionic conductivity of 24.2 mS/cm at -20°C.",
    keywords: ["Solid-State Batteries", "Electrolytes", "Energy Storage", "Materials Chemistry"],
    metrics: {
      views: 11200,
      downloads: 3650,
      citations: 72,
      altmetricScore: 245,
      fieldCitationRatio: 3.4,
    },
    sections: [],
    figures: [],
    tables: [],
    references: [],
    relatedArticleIds: ["art-001"],
  },
];

export const MOCK_MANUSCRIPTS: Manuscript[] = [
  {
    id: "ms-001",
    code: "PUB-2026-0891",
    title:
      "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis and Rare Cancer Subtyping",
    abstract:
      "Whole-slide histopathology imaging presents profound computational challenges owing to gigapixel dimensions, stain variability, and severe class imbalances in rare neoplastic subtypes. Here, we present PathoLatent-X, a hierarchical multimodal latent diffusion architecture conditioned on paired clinical notes and spatial transcriptomic profiles.",
    keywords: ["Latent Diffusion", "Histopathology", "Spatial Transcriptomics", "Few-Shot"],
    articleType: "Research Article",
    journalId: "j-ai",
    journalName: "Publicore Transactions on Artificial Intelligence",
    authors: [
      {
        name: "Dr. Elena Rostova",
        email: "elena.rostova@cambridge.ac.uk",
        institution: "University of Cambridge",
        isCorresponding: true,
        order: 1,
      },
    ],
    status: "Published",
    submittedAt: "2026-05-14",
    updatedAt: "2026-09-28",
    version: 2,
    doi: "10.1042/pub.2026.04189",
    timeline: [
      { stage: "Submitted", date: "May 14, 2026", completed: true, current: false },
      { stage: "Screening", date: "May 16, 2026", completed: true, current: false },
      { stage: "Editor Assigned", date: "May 18, 2026", completed: true, current: false },
      { stage: "Reviewer Invited", date: "May 22, 2026", completed: true, current: false },
      { stage: "Under Review", date: "Jun 10, 2026", completed: true, current: false },
      { stage: "Revision", date: "Jul 15, 2026", completed: true, current: false },
      { stage: "Accepted", date: "Sep 02, 2026", completed: true, current: false },
      { stage: "Production", date: "Sep 15, 2026", completed: true, current: false },
      { stage: "Published", date: "Sep 28, 2026", completed: true, current: false },
      { stage: "DOI Registered", date: "Sep 29, 2026", completed: true, current: true },
    ],
  },
  {
    id: "ms-002",
    code: "PUB-2026-1142",
    title:
      "Adaptive Transformer Distillation on Edge Neuromorphic Processors for Low-Power Bioacoustic Tracking",
    abstract:
      "Edge sensory devices in ecological conservation are constrained by battery capacity and compute budgets. We introduce NeuroBioTrans, a neuromorphic spike-timing distillation technique reducing inference wattage by 88% while retaining species recognition accuracy above 94.2%.",
    keywords: ["Edge AI", "Neuromorphic Computing", "Model Compression", "Bioacoustics"],
    articleType: "Research Article",
    journalId: "j-ai",
    journalName: "Publicore Transactions on Artificial Intelligence",
    authors: [
      {
        name: "Dr. Elena Rostova",
        email: "elena.rostova@cambridge.ac.uk",
        institution: "University of Cambridge",
        isCorresponding: true,
        order: 1,
      },
      {
        name: "Dr. Liam Zhao",
        email: "lzhao@tudelft.nl",
        institution: "TU Delft",
        isCorresponding: false,
        order: 2,
      },
    ],
    status: "Under Review",
    submittedAt: "2026-08-20",
    updatedAt: "2026-09-14",
    version: 1,
    aiScreening: {
      scopeMatch: 95,
      completeness: 98,
      researchArea: "Edge AI & Neuromorphic Architecture",
      secondaryAreas: ["Acoustic Ecology", "Embedded Systems"],
      noveltyScore: 91,
      methodologyRigor: 94,
      plagiarismSimilarity: 4.2,
      potentialIssues: [
        "Hardware benchmark conducted on single silicon revision (Loihi 2); recommend discussing thermal dissipation variability.",
      ],
      keyHighlights: [
        "Comprehensive empirical energy benchmarks",
        "Novel spike-rate loss formulation mathematically proven",
        "Open-source dataset of 80,000 avian audio clips",
      ],
      suggestedKeywords: ["Neuromorphic Audio", "Spiking Transformers", "Ultra-Low Power"],
    },
    timeline: [
      { stage: "Submitted", date: "Aug 20, 2026", completed: true, current: false },
      { stage: "Screening", date: "Aug 22, 2026", completed: true, current: false },
      { stage: "Editor Assigned", date: "Aug 25, 2026", completed: true, current: false },
      { stage: "Reviewer Invited", date: "Aug 29, 2026", completed: true, current: false },
      { stage: "Under Review", date: "Sep 08, 2026", completed: false, current: true, note: "2 of 3 reviews completed" },
      { stage: "Revision", date: "Pending", completed: false, current: false },
      { stage: "Accepted", date: "Pending", completed: false, current: false },
      { stage: "Production", date: "Pending", completed: false, current: false },
      { stage: "Published", date: "Pending", completed: false, current: false },
      { stage: "DOI Registered", date: "Pending", completed: false, current: false },
    ],
    assignedEditor: {
      id: "usr-002",
      name: "Prof. Marcus Vance",
      email: "m.vance@stanford.edu",
    },
    reviewers: [
      {
        reviewerId: "usr-003",
        name: "Dr. Kenji Sato",
        institution: "Kyoto University",
        expertiseMatch: 92,
        topics: ["Neuromorphic Computing", "Signal Processing"],
        publicationRelevance: "Author of 6 papers on low-power neural circuits",
        availability: "Available",
        conflictStatus: "Clear",
        assignedStatus: "Completed",
      },
      {
        reviewerId: "usr-006",
        name: "Prof. Anika Patel",
        institution: "ETH Zürich",
        expertiseMatch: 96,
        topics: ["Spiking Neural Networks", "Edge Computing"],
        publicationRelevance: "Led European project on Bio-acoustic sensor nodes",
        availability: "Available",
        conflictStatus: "Clear",
        assignedStatus: "Completed",
      },
      {
        reviewerId: "usr-007",
        name: "Dr. Felix Hoffman",
        institution: "Max Planck Institute",
        expertiseMatch: 88,
        topics: ["Acoustic Ecology", "Embedded AI"],
        publicationRelevance: "Published on wildlife monitoring sensor networks",
        availability: "Busy",
        conflictStatus: "Clear",
        assignedStatus: "Accepted",
      },
    ],
  },
  {
    id: "ms-003",
    code: "PUB-2026-1290",
    title:
      "Autonomous Multi-Agent CRISPR Target Validation using Closed-Loop Laboratory Automation",
    abstract:
      "High-throughput genetic editing frequently generates off-target variations that elude manual wet-lab inspection. We present an autonomous physical robotic loop that synthesizes, tests, and sequences guide RNAs autonomously based on active Bayesian exploration.",
    keywords: ["CRISPR-Cas9", "Laboratory Automation", "Bayesian Optimization", "Off-Target Modeling"],
    articleType: "Methodology",
    journalId: "j-bio",
    journalName: "Publicore Journal of Bioengineering & Medicine",
    authors: [
      {
        name: "Dr. Elena Rostova",
        email: "elena.rostova@cambridge.ac.uk",
        institution: "University of Cambridge",
        isCorresponding: true,
        order: 1,
      },
    ],
    status: "Revision",
    submittedAt: "2026-07-02",
    updatedAt: "2026-09-24",
    version: 1,
    timeline: [
      { stage: "Submitted", date: "Jul 02, 2026", completed: true, current: false },
      { stage: "Screening", date: "Jul 04, 2026", completed: true, current: false },
      { stage: "Editor Assigned", date: "Jul 07, 2026", completed: true, current: false },
      { stage: "Reviewer Invited", date: "Jul 12, 2026", completed: true, current: false },
      { stage: "Under Review", date: "Aug 01, 2026", completed: true, current: false },
      { stage: "Revision", date: "Sep 18, 2026", completed: false, current: true, note: "Minor revision requested by Editor" },
      { stage: "Accepted", date: "Pending", completed: false, current: false },
      { stage: "Production", date: "Pending", completed: false, current: false },
      { stage: "Published", date: "Pending", completed: false, current: false },
      { stage: "DOI Registered", date: "Pending", completed: false, current: false },
    ],
    reviewerComments: [
      {
        id: "rev-c1",
        reviewerName: "Reviewer 1 (Double-Blind)",
        date: "Sep 14, 2026",
        recommendation: "Minor Revision",
        comments:
          "The autonomous wet-lab loop is remarkably innovative. However, the author must clarify how pipette calibration drift was monitored over continuous 72-hour automated runs in Section 3.2. Adding a small table on liquid handler error variance will make the methodology bulletproof.",
        aiSummary:
          "Reviewer appreciates the experimental loop but requests validation metrics on pipette calibration drift and liquid handler error variance over long 72h cycles.",
      },
      {
        id: "rev-c2",
        reviewerName: "Reviewer 2 (Double-Blind)",
        date: "Sep 16, 2026",
        recommendation: "Accept",
        comments:
          "Outstanding paper. The Bayesian active learning policy significantly outperforms heuristic sgRNA selection. Reproducibility artifacts are thoroughly documented.",
        aiSummary:
          "Strong positive appraisal. No major methodological objections.",
      },
    ],
  },
  {
    id: "ms-004",
    code: "PUB-2026-1402",
    title:
      "Topological Phase Transitions in Hexagonal Boron Nitride Superlattices under Extreme Hydrostatic Pressures",
    abstract:
      "Moiré superlattices exhibit rich quantum phenomena. Here we report transport measurements under hydrostatic pressures up to 35 GPa, revealing an unexpected re-entrant topological Chern insulator state.",
    keywords: ["Topological Insulators", "Superlattices", "High Pressure", "Condensed Matter"],
    articleType: "Research Article",
    journalId: "j-quantum",
    journalName: "Publicore Quantum Systems & Computing",
    authors: [
      {
        name: "Dr. Kenji Sato",
        email: "k-sato@kyoto-u.ac.jp",
        institution: "Kyoto University",
        isCorresponding: true,
        order: 1,
      },
    ],
    status: "Screening",
    submittedAt: "2026-09-30",
    updatedAt: "2026-10-01",
    version: 1,
    aiScreening: {
      scopeMatch: 98,
      completeness: 96,
      researchArea: "Topological Matter & Condensed Matter Physics",
      secondaryAreas: ["Quantum Transport"],
      noveltyScore: 97,
      methodologyRigor: 93,
      plagiarismSimilarity: 2.1,
      potentialIssues: [],
      keyHighlights: [
        "Unprecedented 35 GPa diamond anvil cell measurement",
        "Clear quantum Hall quantization plateaus demonstrated",
      ],
      suggestedKeywords: ["Chern Insulator", "Diamond Anvil", "Moiré Physics"],
    },
    timeline: [
      { stage: "Submitted", date: "Sep 30, 2026", completed: true, current: false },
      { stage: "Screening", date: "Oct 01, 2026", completed: false, current: true, note: "AI Pre-screening completed; awaiting Associate Editor assignment" },
      { stage: "Editor Assigned", date: "Pending", completed: false, current: false },
      { stage: "Reviewer Invited", date: "Pending", completed: false, current: false },
      { stage: "Under Review", date: "Pending", completed: false, current: false },
      { stage: "Revision", date: "Pending", completed: false, current: false },
      { stage: "Accepted", date: "Pending", completed: false, current: false },
      { stage: "Production", date: "Pending", completed: false, current: false },
      { stage: "Published", date: "Pending", completed: false, current: false },
      { stage: "DOI Registered", date: "Pending", completed: false, current: false },
    ],
  },
];

export const MOCK_CONFERENCES: Conference[] = [
  {
    id: "conf-001",
    slug: "icai-2026",
    title: "International Conference on Autonomous Intelligence & Learning Systems",
    acronym: "ICAI 2026",
    year: 2026,
    dateRange: "November 14–18, 2026",
    location: "Zurich Convention Center, Switzerland & Hybrid",
    isVirtual: false,
    status: "Upcoming",
    description:
      "The premier annual gathering of global scholars, roboticists, and machine learning researchers addressing foundation models, autonomous agents, and safety-critical physical systems.",
    topics: [
      "Foundation Models in Robotics",
      "Reinforcement Learning with Human Feedback",
      "Causal Machine Learning",
      "Neuromorphic Sensory Networks",
      "AI Verification & Provable Bounds",
    ],
    importantDates: {
      submissionDeadline: "July 15, 2026 (Passed)",
      notificationDate: "September 25, 2026",
      cameraReady: "October 15, 2026",
      conferenceDates: "November 14–18, 2026",
    },
    keynoteSpeakers: [
      {
        name: "Prof. Yoshua Bengio",
        affiliation: "Mila & Université de Montréal",
        topic: "Amortized Inference & Biological Plausibility",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Dr. Elena Rostova",
        affiliation: "University of Cambridge",
        topic: "Multimodal Synthesis at Biological Scales",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      },
    ],
    callForPapersUrl: "/conferences/icai-2026/cfp",
  },
  {
    id: "conf-002",
    slug: "qcomp-2026",
    title: "Global Symposium on Quantum Information & Fault-Tolerant Architectures",
    acronym: "QComp 2026",
    year: 2026,
    dateRange: "December 02–05, 2026",
    location: "Kyoto International Conference Center, Japan",
    isVirtual: false,
    status: "Upcoming",
    description:
      "A high-impact conference convening quantum physicists, cryogenics engineers, and complexity theorists developing scalable quantum hardware platforms.",
    topics: [
      "Surface Code Implementations",
      "Trapped Ion Quantum Logic",
      "Cryogenic CMOS Control Electronics",
      "Quantum Algorithms for Molecular Dynamics",
    ],
    importantDates: {
      submissionDeadline: "August 10, 2026",
      notificationDate: "October 05, 2026",
      cameraReady: "October 30, 2026",
      conferenceDates: "December 02–05, 2026",
    },
    keynoteSpeakers: [
      {
        name: "Prof. Arthur Chen",
        affiliation: "ETH Zürich",
        topic: "Fault-Tolerant Milestones in 1,000+ Qubit Arrays",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    callForPapersUrl: "/conferences/qcomp-2026/cfp",
  },
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: "comm-ai",
    slug: "artificial-intelligence",
    name: "Artificial Intelligence & Computational Intelligence",
    description:
      "A global scholarly society of over 34,000 researchers pioneering machine learning, foundation model theory, neuromorphic systems, and ethical AI deployment.",
    category: "Computer Science",
    membersCount: 34820,
    publicationsCount: 14200,
    discussionsCount: 3180,
    topics: ["Deep Learning", "Computer Vision", "LLMs", "Robotics", "Ethics"],
    recentDiscussions: [
      {
        id: "disc-1",
        title: "Is diffusion modeling fundamentally bounded by sample entropy in histology?",
        author: "Dr. Julian H. Mercer",
        replies: 28,
        lastActive: "2 hours ago",
      },
      {
        id: "disc-2",
        title: "Benchmarking state-space models (Mamba) vs. sparse attention on 1M token contexts",
        author: "Prof. Marcus Vance",
        replies: 64,
        lastActive: "6 hours ago",
      },
    ],
  },
  {
    id: "comm-bio",
    slug: "biotechnology-medicine",
    name: "Biotechnology & Precision Medicine",
    description:
      "Advancing molecular medicine, genetic editing, computational pathology, and bioengineering through open peer collaboration.",
    category: "Life Sciences",
    membersCount: 22150,
    publicationsCount: 9400,
    discussionsCount: 1820,
    topics: ["CRISPR", "Nanomedicine", "Pathology", "Genomics", "Immunotherapy"],
    recentDiscussions: [
      {
        id: "disc-3",
        title: "Standardized protocols for spatial transcriptomic alignment in formalin-fixed tissues",
        author: "Dr. Sarah Al-Mansoor",
        replies: 19,
        lastActive: "Yesterday",
      },
    ],
  },
  {
    id: "comm-quantum",
    slug: "quantum-systems",
    name: "Quantum Information & Applied Physics",
    description:
      "Connecting experimentalists and theorists across quantum materials, cryogenic control, quantum chemistry, and information theory.",
    category: "Physics",
    membersCount: 15400,
    publicationsCount: 6100,
    discussionsCount: 1430,
    topics: ["Transmon Qubits", "Quantum Error Correction", "Topological Materials"],
    recentDiscussions: [
      {
        id: "disc-4",
        title: "Mitigating two-level system dielectric losses in niobium microwave resonators",
        author: "Dr. Kenji Sato",
        replies: 34,
        lastActive: "3 days ago",
      },
    ],
  },
];

export const MOCK_RESEARCH_GAPS: ResearchGap[] = [
  {
    id: "gap-001",
    field: "Computational Oncology & Generative AI",
    topic: "Continuous Spatial Transcriptomic Guidance in Multimodal Histopathology",
    gapTitle: "Sparse Gene Alignment vs. Gigapixel Cellular Morphology",
    description:
      "While recent generative diffusion approaches generate plausible cell nuclei, current methods discretize transcriptomic spot arrays (e.g. 55-micron Visium spots), failing to capture intracellular RNA gradients across contiguous cancer-stroma boundaries.",
    currentLiteratureSummary:
      "Over 48 studies published in 2024–2026 examine patch-level synthesis; however, 92% rely on spot-aggregated expression profiles rather than single-cell resolution imputation.",
    majorFindings: [
      "Cell nuclear morphology reflects localized transcriptomic upregulation (Rostova et al., 2026).",
      "Standard diffusion models hallucinate non-functional tissue margins under out-of-distribution staining.",
      "Discrete spot interpolation yields up to 34% boundary spatial error in invasive ductal carcinomas.",
    ],
    commonMethodologies: [
      "Patch-level conditional LDM with CLIP text encoding",
      "Graph neural networks on spatial adjacency graphs",
      "Histology-to-gene cross-attention bridges",
    ],
    knownLimitations: [
      "Inability to preserve micro-RNA spatial variance under low capture efficiency",
      "High GPU memory footprint preventing end-to-end WSI backpropagation",
      "Lack of standardized multi-stain benchmark cohorts",
    ],
    contradictions: [
      "Study A (Nature Med 2025) claims text descriptions suffice for subtype synthesis, whereas Study B (Cell Sys 2026) proves direct gene conditioning is strictly required to prevent aberrant grade prediction.",
    ],
    potentialResearchDirections: [
      "Develop continuous neural implicit field representations directly linking coordinates (x,y) to continuous single-cell RNA velocity.",
      "Explore physics-informed diffusion schedules incorporating cytochemical stain diffusion kinetics.",
      "Formulate zero-shot generalization metrics measuring biological validity via transcriptomic preservation score (TPS).",
    ],
    suggestedByAIConfidence: 89,
    supportingPapers: [
      {
        id: "art-001",
        title: "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis",
        doi: "10.1042/pub.2026.04189",
        year: 2026,
      },
      {
        id: "art-002",
        title: "Spatial Transcriptomic Spot Deconvolution using Deep Generative Latents",
        doi: "10.1038/s41587-025-01994",
        year: 2025,
      },
    ],
  },
  {
    id: "gap-002",
    field: "Quantum Information & Hardware",
    topic: "Sub-Kelvin CMOS Control Dissipation in 10,000-Qubit Cryogenic Refrigerators",
    gapTitle: "Thermal Budget Bottleneck in Scalable Transmon Control",
    description:
      "Commercial dilution refrigerators provide under 1.5 Watts of cooling power at 4 Kelvin and 20 microwatts at 20 millikelvin. Routing discrete coaxial cables for 10,000 transmon qubits introduces unsustainable heat loads.",
    currentLiteratureSummary:
      "Recent demonstrations utilize custom cryogenic CMOS multiplexers; however, thermal dissipation exceeds the 10 mK stage cooling capacity when operating at gigahertz frequencies.",
    majorFindings: [
      "Coaxial thermal conductance accounts for 68% of 4K stage passive load (Sato et al., 2026).",
      "Cryo-CMOS logic operating at 3K introduces phase noise into adjacent superconducting circuits.",
    ],
    commonMethodologies: [
      "Optical interconnects with micro-photodiode arrays",
      "Superconducting single-flux quantum (SFQ) pulse generators",
      "Passive microwave frequency-comb reflectometry",
    ],
    knownLimitations: [
      "Quantum efficiency of cryogenic electro-optic modulators remains below 45%",
      "Fabrication yield of dense Nb-based SFQ circuits",
    ],
    contradictions: [
      "Laboratory X claims optical fibers eliminate heat entirely, while Laboratory Y demonstrates photodiode dark-current dissipation negates the thermal savings.",
    ],
    potentialResearchDirections: [
      "Investigate photonics-integrated silicon-on-insulator (SOI) modulators operating at sub-millikelvin temperatures.",
      "Design neural pulse shapers that pre-compensate dispersion directly at room temperature before fiber entry.",
    ],
    suggestedByAIConfidence: 94,
    supportingPapers: [
      {
        id: "art-002",
        title: "Mitigating Non-Markovian Decoherence in Scalable Transmon Qubits",
        doi: "10.1042/pub.2026.03871",
        year: 2026,
      },
    ],
  },
];

export const MOCK_RESEARCH_TRENDS: ResearchTrend[] = [
  {
    topic: "Multimodal Latent Diffusion in Biomedicine",
    category: "Artificial Intelligence",
    growthRate: 142,
    fiveYearPublicationVolume: [320, 890, 2410, 5800, 11200],
    years: ["2022", "2023", "2024", "2025", "2026"],
    description:
      "Rapidly rising research convergence combining spatial transcriptomics, whole-slide histology, and radiological imaging through cross-attentive diffusion priors.",
    keyKeywords: ["Diffusion Models", "Histopathology", "Spatial Biology", "Few-Shot Synthesis"],
    topInstitutions: ["Cambridge", "Stanford", "MIT", "Max Planck", "Tsinghua"],
  },
  {
    topic: "Fault-Tolerant Quantum Error Correction",
    category: "Quantum Computing",
    growthRate: 88,
    fiveYearPublicationVolume: [540, 920, 1680, 2900, 4850],
    years: ["2022", "2023", "2024", "2025", "2026"],
    description:
      "Transition from noisy intermediate-scale quantum (NISQ) demonstrations to physical logical qubits and neutral atom array entanglement.",
    keyKeywords: ["Surface Codes", "Logical Qubits", "Transmons", "Neutral Atoms"],
    topInstitutions: ["ETH Zürich", "Harvard", "Kyoto University", "TU Delft", "Oxford"],
  },
  {
    topic: "Closed-Loop Robotic Autonomous Laboratories",
    category: "Bioengineering & Chemistry",
    growthRate: 116,
    fiveYearPublicationVolume: [180, 420, 1100, 2450, 4700],
    years: ["2022", "2023", "2024", "2025", "2026"],
    description:
      "Autonomous wet-lab synthesis, automated liquid handlers, and active Bayesian experimental design driving self-driving discovery loops.",
    keyKeywords: ["Self-Driving Labs", "Active Learning", "CRISPR", "Materials Discovery"],
    topInstitutions: ["University of Toronto", "Imperial College", "Berkeley", "EPFL"],
  },
];
