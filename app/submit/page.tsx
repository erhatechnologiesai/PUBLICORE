"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { manuscriptService } from "@/services";
import { emailService } from "@/services/emailService";
import { ManuscriptFileUploader, UploadedFileMetadata } from "@/components/upload/ManuscriptFileUploader";
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
  Link2,
  Database,
  FileSpreadsheet,
  Trash2,
  Plus,
  ExternalLink,
  FileCode,
  DollarSign,
  HelpCircle,
  Paperclip,
  Check,
  Building,
  Building2,
  Mail,
  Award,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  Lock,
  Globe,
  Edit3,
  Layers,
  Scale,
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// RESEARCH EXCHANGE 11 PROGRESS STEPS
interface ProgressStepItem {
  id: number;
  key: string;
  label: string;
  desc: string;
}

const PROGRESS_STEPS: ProgressStepItem[] = [
  { id: 1, key: "article-type", label: "Article Type", desc: "Select manuscript category & journal" },
  { id: 2, key: "upload-manuscript", label: "Upload Manuscript", desc: "Manuscript files & designations" },
  { id: 3, key: "title", label: "Title", desc: "Manuscript title & formatting" },
  { id: 4, key: "abstract", label: "Abstract", desc: "Abstract text & keywords" },
  { id: 5, key: "authors", label: "Authors", desc: "Author list & sequence order" },
  { id: 6, key: "affiliations", label: "Affiliations", desc: "Academic institutions & author links" },
  { id: 7, key: "author-details", label: "Author Details", desc: "ORCID iD, CRediT roles & declarations" },
  { id: 8, key: "match-organizations", label: "Match Organizations", desc: "ROR global registry verification" },
  { id: 9, key: "open-access", label: "Open Access", desc: "Publishing model, licensing & APC" },
  { id: 10, key: "additional-info", label: "Additional Information", desc: "Funding, data link, letter & reviewers" },
  { id: 11, key: "final-review", label: "Final Review", desc: "Pre-flight audit & submission" },
];

type FileDesignation =
  | "Main Document"
  | "Cover Letter / Rebuttal"
  | "Supporting Information"
  | "Figure / Graphic"
  | "Table"
  | "Data Availability Link"
  | "Computational Code / Analysis Script";

interface UploadedFileRecord {
  id: string;
  name: string;
  size: string;
  designation: FileDesignation;
  status: "Verified" | "Scanning";
  order: number;
}

interface AuthorRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isCorresponding: boolean;
  order: number;
}

interface AffiliationRecord {
  id: string;
  name: string;
  department: string;
  city: string;
  state: string;
  country: string;
  authorIds: string[];
}

interface MatchedOrgRecord {
  affiliationId: string;
  institutionName: string;
  rorId: string;
  country: string;
  status: "Matched & Verified" | "Pending Review";
}

export default function SubmitResearchPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState<any>(null);

  // STEP 1: Article Type State
  const [articleType, setArticleType] = useState<ArticleType>("Research Article");
  const [selectedJournal, setSelectedJournal] = useState("j-ai");
  const [isSpecialIssue, setIsSpecialIssue] = useState(false);
  const [specialIssueName, setSpecialIssueName] = useState("Special Issue on Foundation Models in Biomedicine");

  // STEP 2: Upload Manuscript State
  const [formatMode, setFormatMode] = useState<"word" | "latex" | "pdf">("pdf");
  const [uploadedFile, setUploadedFile] = useState<string | null>("PathoLatent_Manuscript_Rev01.pdf");
  const [uploadedMeta, setUploadedMeta] = useState<UploadedFileMetadata | null>(null);
  const [manifestFiles, setManifestFiles] = useState<UploadedFileRecord[]>([
    {
      id: "doc-1",
      name: "PathoLatent_Manuscript_Rev01.pdf",
      size: "3.4 MB",
      designation: "Main Document",
      status: "Verified",
      order: 1,
    },
    {
      id: "doc-2",
      name: "Supplementary_Table_S1_Hyperparameters.xlsx",
      size: "420 KB",
      designation: "Supporting Information",
      status: "Verified",
      order: 2,
    },
    {
      id: "doc-3",
      name: "statistical_analysis_pipeline.ipynb",
      size: "1.2 MB",
      designation: "Computational Code / Analysis Script",
      status: "Verified",
      order: 3,
    },
  ]);
  const [supplementaryFiles, setSupplementaryFiles] = useState<Array<{ id: string; name: string; size: string; type: string }>>([
    { id: "supp-1", name: "Supplementary_Table_S1_Hyperparameters.xlsx", size: "420 KB", type: "Spreadsheet Data" },
  ]);
  const [analysisFile, setAnalysisFile] = useState<{ name: string; size: string; type: string } | null>({
    name: "statistical_analysis_pipeline.ipynb",
    size: "1.2 MB",
    type: "Jupyter Notebook",
  });

  // STEP 3: Title State
  const [title, setTitle] = useState(
    "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis and Rare Cancer Subtyping"
  );

  // STEP 4: Abstract & Keywords State
  const [abstract, setAbstract] = useState(
    "Whole-slide histopathology imaging presents profound computational challenges owing to gigapixel dimensions, stain variability, and severe class imbalances in rare neoplastic subtypes. Here, we present PathoLatent-X, a multimodal generative latent diffusion architecture engineered specifically for multi-scale tissue synthesis and zero-shot diagnostic subtyping."
  );
  const [keywords, setKeywords] = useState<string[]>([
    "Latent Diffusion",
    "Digital Pathology",
    "Spatial Transcriptomics",
    "Few-Shot Learning",
    "Generative AI",
  ]);
  const [keywordInput, setKeywordInput] = useState("");
  const [researchField, setResearchField] = useState("Artificial Intelligence & Computational Pathology");
  const [highlights, setHighlights] = useState<string[]>([
    "Novel high-resolution tissue tile generative latent diffusion pipeline",
    "Achieves 94.2% diagnostic accuracy on extremely rare neoplastic biopsy cohorts",
    "Validated on multi-center public benchmark datasets (Zenodo repository)",
  ]);

  // STEP 5: Authors State
  const [authors, setAuthors] = useState<AuthorRecord[]>([
    {
      id: "auth-1",
      firstName: "Elena",
      lastName: "Rostova",
      email: "elena.rostova@cambridge.ac.uk",
      isCorresponding: true,
      order: 1,
    },
    {
      id: "auth-2",
      firstName: "Julian",
      lastName: "Mercer",
      email: "j.mercer@ox.ac.uk",
      isCorresponding: false,
      order: 2,
    },
  ]);
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const [newAuthorFirst, setNewAuthorFirst] = useState("");
  const [newAuthorLast, setNewAuthorLast] = useState("");
  const [newAuthorEmail, setNewAuthorEmail] = useState("");
  const [newAuthorIsCorr, setNewAuthorIsCorr] = useState(false);

  // STEP 6: Affiliations State
  const [affiliations, setAffiliations] = useState<AffiliationRecord[]>([
    {
      id: "aff-1",
      name: "University of Cambridge",
      department: "Department of Pathology & Cambridge AI Clinic",
      city: "Cambridge",
      state: "Cambridgeshire",
      country: "United Kingdom",
      authorIds: ["auth-1"],
    },
    {
      id: "aff-2",
      name: "University of Oxford",
      department: "Department of Engineering Science",
      city: "Oxford",
      state: "Oxfordshire",
      country: "United Kingdom",
      authorIds: ["auth-2"],
    },
  ]);
  const [showAddAffModal, setShowAddAffModal] = useState(false);
  const [newAffName, setNewAffName] = useState("");
  const [newAffDept, setNewAffDept] = useState("");
  const [newAffCity, setNewAffCity] = useState("");
  const [newAffState, setNewAffState] = useState("");
  const [newAffCountry, setNewAffCountry] = useState("United Kingdom");

  // STEP 7: Author Details State (ORCID & CRediT)
  const [activeAuthorTab, setActiveAuthorTab] = useState(0);
  const [authorDetailsMap, setAuthorDetailsMap] = useState<{
    [authorId: string]: {
      orcid: string;
      roles: string[];
      bio: string;
      conflict: "none" | "disclosed";
      conflictStatement: string;
    };
  }>({
    "auth-1": {
      orcid: "0000-0002-1825-0097",
      roles: ["Conceptualization", "Methodology", "Writing - Original Draft", "Funding Acquisition"],
      bio: "Dr. Elena Rostova is a Senior Principal Investigator at the Cambridge Institute for AI Pathology.",
      conflict: "none",
      conflictStatement: "The author declares no commercial competing interests.",
    },
    "auth-2": {
      orcid: "0000-0001-9421-5582",
      roles: ["Software", "Validation", "Formal Analysis", "Writing - Review & Editing"],
      bio: "Julian Mercer is a Senior Computational Fellow specializing in spatial transcriptomics at Oxford.",
      conflict: "none",
      conflictStatement: "The author declares no commercial competing interests.",
    },
  });

  // STEP 8: Match Organizations State (ROR Registry)
  const [matchedOrgs, setMatchedOrgs] = useState<MatchedOrgRecord[]>([
    {
      affiliationId: "aff-1",
      institutionName: "University of Cambridge",
      rorId: "https://ror.org/013meh722",
      country: "United Kingdom",
      status: "Matched & Verified",
    },
    {
      affiliationId: "aff-2",
      institutionName: "University of Oxford",
      rorId: "https://ror.org/052gg0110",
      country: "United Kingdom",
      status: "Matched & Verified",
    },
  ]);

  // STEP 9: Open Access & Publishing Licensing State
  const [openAccessModel, setOpenAccessModel] = useState<"gold" | "subscription">("gold");
  const [openAccessLicense, setOpenAccessLicense] = useState<"cc-by" | "cc-by-nc-nd">("cc-by");
  const [licenseAgreed, setLicenseAgreed] = useState(true);

  // STEP 10: Additional Information State
  const [funderName, setFunderName] = useState("Wellcome Trust / UK Research & Innovation (UKRI)");
  const [grantNumber, setGrantNumber] = useState("WT-2026-NEURO-8821");
  const [fundingStatement, setFundingStatement] = useState(
    "This research was supported by Wellcome Trust grant WT-2026-NEURO-8821. No commercial competing sponsor influenced the conclusions."
  );
  const [datasourceUrl, setDatasourceUrl] = useState("https://zenodo.org/record/1042891");
  const [rebuttalLetter, setRebuttalLetter] = useState(
    "We submit our original investigation for publication consideration. This work introduces an empirical framework resolving severe class imbalances in pathological imaging and provides complete reproduction code. All authors have reviewed and approved this final manuscript."
  );
  const [isPreprint, setIsPreprint] = useState(false);
  const [preprintDoi, setPreprintDoi] = useState("");
  const [suggestedReviewers, setSuggestedReviewers] = useState<
    Array<{ name: string; email: string; institution: string; type: "preferred" | "opposed"; reason: string }>
  >([
    {
      name: "Prof. Kenneth Sterling",
      email: "k.sterling@stanford.edu",
      institution: "Stanford University",
      type: "preferred",
      reason: "Expertise in generative diffusion models for histology.",
    },
  ]);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerEmail, setNewReviewerEmail] = useState("");
  const [newReviewerInst, setNewReviewerInst] = useState("");
  const [newReviewerType, setNewReviewerType] = useState<"preferred" | "opposed">("preferred");
  const [newReviewerReason, setNewReviewerReason] = useState("");

  // STEP 11: Final Review Declarations
  const [finalDeclarations, setFinalDeclarations] = useState({
    allAuthorsApproved: true,
    originalResearch: true,
    ethicsApproval: true,
    openDataAgreement: true,
  });

  // Validation Errors
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});

  // Input Refs
  const genericFileInputRef = useRef<HTMLInputElement>(null);
  const suppFileInputRef = useRef<HTMLInputElement>(null);
  const analysisFileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Live URL Validation
  const isValidUrl = (urlString: string): boolean => {
    if (!urlString || urlString.trim().length === 0) return false;
    try {
      const parsed = new URL(urlString.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Step 2 Handlers
  const handleFileUpload = (meta: UploadedFileMetadata) => {
    setUploadedFile(meta.fileName);
    setUploadedMeta(meta);
    setManifestFiles((prev) => {
      const filtered = prev.filter((f) => f.designation !== "Main Document");
      return [
        {
          id: `main-${Date.now()}`,
          name: meta.fileName,
          size: meta.fileSize,
          designation: "Main Document",
          status: "Verified",
          order: 1,
        },
        ...filtered.map((f, i) => ({ ...f, order: i + 2 })),
      ];
    });
  };

  const handleUpdateDesignation = (id: string, newDesignation: FileDesignation) => {
    setManifestFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, designation: newDesignation } : f))
    );
  };

  const handleMoveFile = (index: number, direction: "up" | "down") => {
    setManifestFiles((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((f, i) => ({ ...f, order: i + 1 }));
    });
  };

  const handleDeleteFile = (id: string) => {
    setManifestFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleGenericFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile: UploadedFileRecord = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        designation: "Supporting Information",
        status: "Verified",
        order: manifestFiles.length + 1,
      };
      setManifestFiles((prev) => [...prev, newFile]);
      setSupplementaryFiles((prev) => [
        ...prev,
        { id: newFile.id, name: newFile.name, size: newFile.size, type: "Supporting Material" },
      ]);
    }
  };

  const handleSuppFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        id: `supp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`,
        type: f.name.endsWith(".xlsx") || f.name.endsWith(".csv") ? "Spreadsheet Data" : "Document",
      }));
      setSupplementaryFiles((prev) => [...prev, ...newFiles]);
      setManifestFiles((prev) => [
        ...prev,
        ...newFiles.map((nf, i) => ({
          id: nf.id,
          name: nf.name,
          size: nf.size,
          designation: "Supporting Information" as FileDesignation,
          status: "Verified" as const,
          order: prev.length + i + 1,
        })),
      ]);
    }
  };

  const removeSupplementaryFile = (id: string) => {
    setSupplementaryFiles((prev) => prev.filter((f) => f.id !== id));
    setManifestFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAnalysisFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const parsedAnalysis = {
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
        type: f.name.endsWith(".ipynb") ? "Jupyter Notebook" : f.name.endsWith(".py") ? "Python Script" : "Analysis Code",
      };
      setAnalysisFile(parsedAnalysis);
      setManifestFiles((prev) => {
        const filtered = prev.filter((item) => item.designation !== "Computational Code / Analysis Script");
        return [
          ...filtered,
          {
            id: `analysis-${Date.now()}`,
            name: parsedAnalysis.name,
            size: parsedAnalysis.size,
            designation: "Computational Code / Analysis Script",
            status: "Verified",
            order: filtered.length + 1,
          },
        ];
      });
    }
  };

  const removeAnalysisFile = () => {
    setAnalysisFile(null);
    setManifestFiles((prev) => prev.filter((f) => f.designation !== "Computational Code / Analysis Script"));
  };

  // Step 4 Keyword Handlers
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  // Step 5 Author Handlers
  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorFirst.trim() || !newAuthorLast.trim() || !newAuthorEmail.trim()) return;

    const newAuth: AuthorRecord = {
      id: `auth-${Date.now()}`,
      firstName: newAuthorFirst.trim(),
      lastName: newAuthorLast.trim(),
      email: newAuthorEmail.trim(),
      isCorresponding: newAuthorIsCorr,
      order: authors.length + 1,
    };

    setAuthors([...authors, newAuth]);
    setAuthorDetailsMap((prev) => ({
      ...prev,
      [newAuth.id]: {
        orcid: "0000-0000-0000-0000",
        roles: ["Investigation", "Writing - Review & Editing"],
        bio: `${newAuth.firstName} ${newAuth.lastName} is an academic researcher.`,
        conflict: "none",
        conflictStatement: "The author declares no commercial competing interests.",
      },
    }));

    setNewAuthorFirst("");
    setNewAuthorLast("");
    setNewAuthorEmail("");
    setNewAuthorIsCorr(false);
    setShowAddAuthorModal(false);
  };

  const handleMoveAuthor = (index: number, direction: "up" | "down") => {
    setAuthors((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((a, i) => ({ ...a, order: i + 1 }));
    });
  };

  const handleDeleteAuthor = (id: string) => {
    if (authors.length <= 1) return;
    setAuthors(authors.filter((a) => a.id !== id).map((a, i) => ({ ...a, order: i + 1 })));
  };

  // Step 6 Affiliation Handlers
  const handleAddAffiliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffName.trim() || !newAffCity.trim() || !newAffCountry.trim()) return;

    const newAff: AffiliationRecord = {
      id: `aff-${Date.now()}`,
      name: newAffName.trim(),
      department: newAffDept.trim(),
      city: newAffCity.trim(),
      state: newAffState.trim(),
      country: newAffCountry.trim(),
      authorIds: [],
    };

    setAffiliations([...affiliations, newAff]);
    setMatchedOrgs((prev) => [
      ...prev,
      {
        affiliationId: newAff.id,
        institutionName: newAff.name,
        rorId: `https://ror.org/0${Math.floor(1000000 + Math.random() * 9000000)}`,
        country: newAff.country,
        status: "Matched & Verified",
      },
    ]);

    setNewAffName("");
    setNewAffDept("");
    setNewAffCity("");
    setNewAffState("");
    setShowAddAffModal(false);
  };

  const toggleAuthorAffiliation = (affId: string, authId: string) => {
    setAffiliations((prev) =>
      prev.map((aff) => {
        if (aff.id !== affId) return aff;
        const hasAuth = aff.authorIds.includes(authId);
        return {
          ...aff,
          authorIds: hasAuth ? aff.authorIds.filter((id) => id !== authId) : [...aff.authorIds, authId],
        };
      })
    );
  };

  // Step Validation Logic
  const validateCurrentStep = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (currentStep === 2) {
      const hasMainDoc = manifestFiles.some((f) => f.designation === "Main Document") || Boolean(uploadedFile);
      if (!hasMainDoc) errs.uploadedFile = "Main manuscript document is compulsory.";
      if (supplementaryFiles.length === 0) errs.supplementaryFiles = "At least one supplementary file is compulsory.";
    } else if (currentStep === 3) {
      if (!title.trim() || title.trim().split(" ").length < 4) {
        errs.title = "Manuscript title is compulsory and should contain at least 4 words.";
      }
    } else if (currentStep === 4) {
      if (!abstract.trim() || abstract.trim().split(" ").length < 30) {
        errs.abstract = "Abstract must be at least 30 words in length.";
      }
      if (keywords.length < 2) {
        errs.keywords = "Please specify at least 2 relevant keywords.";
      }
    } else if (currentStep === 5) {
      if (authors.length === 0) {
        errs.authors = "At least one author is required.";
      }
      const hasCorr = authors.some((a) => a.isCorresponding);
      if (!hasCorr) {
        errs.authors = "At least one author must be designated as the Corresponding Author.";
      }
    } else if (currentStep === 6) {
      if (affiliations.length === 0) {
        errs.affiliations = "At least one institutional affiliation is compulsory.";
      }
    } else if (currentStep === 9) {
      if (!licenseAgreed) {
        errs.license = "You must agree to the publication licensing terms to proceed.";
      }
    } else if (currentStep === 10) {
      if (!funderName.trim()) errs.funderName = "Funding body / sponsor disclosure is compulsory.";
      if (!grantNumber.trim()) errs.grantNumber = "Grant or award identifier is compulsory.";
      if (!rebuttalLetter.trim() || rebuttalLetter.trim().length < 20) {
        errs.rebuttalLetter = "Cover letter / editorial statement must be at least 20 characters.";
      }
      if (!isValidUrl(datasourceUrl)) {
        errs.datasourceUrl = "A valid Open Science data repository URL (e.g. Zenodo, Dryad) is compulsory.";
      }
    }

    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const jumpToStep = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Step 11: Final Master Submission
  const handleSubmitManuscript = async () => {
    setIsSubmitting(true);

    const primaryAuthor = authors.find((a) => a.isCorresponding) || authors[0];
    const firstAff = affiliations.find((aff) => aff.authorIds.includes(primaryAuthor.id)) || affiliations[0];

    const submissionPayload = {
      title,
      abstract,
      keywords,
      articleType,
      journalId: selectedJournal,
      authors: authors.map((a) => {
        const aff = affiliations.find((af) => af.authorIds.includes(a.id)) || affiliations[0];
        const detail = authorDetailsMap[a.id];
        return {
          name: `${a.firstName} ${a.lastName}`,
          email: a.email,
          institution: aff ? aff.name : "Academic Institution",
          orcid: detail ? detail.orcid : undefined,
          isCorresponding: a.isCorresponding,
          order: a.order,
        };
      }),
      fileUrl: `https://storage.publicore.org/vault/${uploadedFile || "manuscript.pdf"}`,
      fundingDetails: {
        funderName,
        grantNumber,
        fundingStatement,
      },
      supplementaryFiles,
      rebuttalLetter,
      datasourceUrl,
      analysisFile: analysisFile || undefined,
      affiliations: affiliations.map((aff) => ({
        id: aff.id,
        name: aff.name,
        department: aff.department,
        city: aff.city,
        state: aff.state,
        country: aff.country,
        rorId: matchedOrgs.find((m) => m.affiliationId === aff.id)?.rorId,
      })),
      authorDetails: authors.map((a) => ({
        authorName: `${a.firstName} ${a.lastName}`,
        orcid: authorDetailsMap[a.id]?.orcid || "",
        roles: authorDetailsMap[a.id]?.roles || [],
        bio: authorDetailsMap[a.id]?.bio,
        competingInterest: authorDetailsMap[a.id]?.conflictStatement,
      })),
      matchedOrgs: matchedOrgs.map((m) => ({
        name: m.institutionName,
        rorId: m.rorId,
        status: m.status,
      })),
      openAccessChoice: {
        model: openAccessModel === "gold" ? ("Gold" as const) : ("Subscription" as const),
        license: openAccessLicense === "cc-by" ? "CC-BY 4.0" : "CC-BY-NC-ND 4.0",
        apcAmount: openAccessModel === "gold" ? 0 : 0, // subsidized
        waiverApplied: true,
      },
      preprintDetails: {
        isPreprint,
        preprintDoi: isPreprint ? preprintDoi : undefined,
      },
      suggestedReviewers,
    };

    try {
      const created = await manuscriptService.createSubmission(submissionPayload);

      // Trigger confirmation email
      emailService.sendEmail({
        to: primaryAuthor.email,
        toName: `${primaryAuthor.firstName} ${primaryAuthor.lastName}`,
        templateType: "SUBMISSION_RECEIPT",
        data: {
          manuscriptCode: created.code,
          manuscriptTitle: created.title,
          journalName: created.journalName,
          actionUrl: `http://localhost:3000/dashboard/author`,
        },
      });

      setSubmissionComplete(created);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasMainDoc = manifestFiles.some((f) => f.designation === "Main Document") || Boolean(uploadedFile);
  const currentAuthorForDetail = authors[activeAuthorTab] || authors[0];
  const currentAuthorDetail = authorDetailsMap[currentAuthorForDetail?.id] || {
    orcid: "0000-0002-1825-0097",
    roles: ["Conceptualization", "Methodology"],
    bio: "",
    conflict: "none",
    conflictStatement: "",
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
        {/* Top Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Submit Scholarly Manuscript
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              Step <span className="text-cyan-800 font-extrabold">{currentStep}</span> of {PROGRESS_STEPS.length}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
              {Math.round((currentStep / PROGRESS_STEPS.length) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Mobile Stepper Toggle Bar (< lg) */}
        <div className="block lg:hidden mb-6 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400">Current Step:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-navy-950">
                  {currentStep}. {PROGRESS_STEPS[currentStep - 1]?.label}
                </span>
                <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                  Tap to view all 11 steps
                </span>
              </div>
            </div>
            {mobileMenuOpen ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
          </button>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#004e70] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / PROGRESS_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Expandable Mobile Steps Drawer */}
          {mobileMenuOpen && (
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
              {PROGRESS_STEPS.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;
                return (
                  <div
                    key={step.id}
                    onClick={() => {
                      if (isCompleted) {
                        jumpToStep(step.id);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`p-2.5 rounded-lg text-xs flex items-center justify-between ${
                      isActive
                        ? "bg-[#004e70] text-white font-bold"
                        : isCompleted
                        ? "text-[#004e70] hover:bg-cyan-50 cursor-pointer font-semibold"
                        : "text-slate-950 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-800 shrink-0" />
                      )}
                      <span>{step.label}</span>
                    </div>
                    {isActive && <ArrowRight className="w-4 h-4 text-white" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2-Column Responsive Layout matching the Progress Design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT SIDEBAR: "Your Progress" ================= */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-20">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              <h2 className="text-xl font-bold text-navy-950 tracking-tight pb-2 border-b border-slate-100">
                Your Progress
              </h2>

              <nav className="space-y-1.5" aria-label="Progress">
                {PROGRESS_STEPS.map((step) => {
                  const isCompleted = step.id < currentStep;
                  const isActive = step.id === currentStep;
                  const isLocked = step.id > currentStep;

                  if (isActive) {
                    return (
                      <div
                        key={step.id}
                        className="bg-[#004e70] text-white font-bold text-sm px-3.5 py-2.5 rounded-lg flex items-center justify-between shadow-2xs transition-all"
                      >
                        <span className="truncate">{step.label}</span>
                        <ArrowRight className="w-4 h-4 text-white shrink-0 ml-1.5" />
                      </div>
                    );
                  }

                  if (isCompleted) {
                    return (
                      <button
                        type="button"
                        key={step.id}
                        onClick={() => jumpToStep(step.id)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#004e70] hover:bg-cyan-50/70 hover:underline flex items-center transition-colors group"
                      >
                        <Check className="w-4 h-4 text-emerald-600 font-bold mr-2.5 shrink-0" />
                        <span className="truncate">{step.label}</span>
                      </button>
                    );
                  }

                  return (
                    <div
                      key={step.id}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-950 flex items-center select-none cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-800 mr-2.5 shrink-0" />
                      <span className="truncate">{step.label}</span>
                    </div>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
                Completed steps remain editable at any time by clicking their link.
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN: Active Step Form ================= */}
          <div className="lg:col-span-9 min-w-0">
            {/* Global Validation Error Banner */}
            {Object.keys(stepErrors).length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-3 shadow-2xs animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">Please resolve the following before continuing:</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                    {Object.values(stepErrors).map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ---------------- STEP 1: Article Type ---------------- */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                    Step 1: Select Article Type & Journal Track
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Specify your manuscript publication classification and intended editorial series.
                  </p>
                </div>

                {/* Article Type Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Manuscript Article Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      {
                        type: "Research Article" as ArticleType,
                        title: "Original Research Article",
                        desc: "Full-length primary investigation presenting novel empirical data, theoretical models, or clinical findings.",
                      },
                      {
                        type: "Review Paper" as ArticleType,
                        title: "Review Paper / Survey",
                        desc: "Comprehensive meta-analysis, state-of-the-art methodology survey, or systematic literature appraisal.",
                      },
                      {
                        type: "Brief Communication" as ArticleType,
                        title: "Brief Communication / Letter",
                        desc: "High-priority concise report of breakthrough scientific observations requiring accelerated peer triage.",
                      },
                      {
                        type: "Survey & Tutorials" as ArticleType,
                        title: "Survey & Tutorials",
                        desc: "Pedagogical primer, educational methodology tutorial, or benchmark reference dataset framework.",
                      },
                    ].map((item) => (
                      <div
                        key={item.type}
                        onClick={() => setArticleType(item.type)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                          articleType === item.type
                            ? "border-cyan-600 bg-cyan-50/60 shadow-2xs ring-1 ring-cyan-600"
                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs text-navy-950">
                          <span>{item.title}</span>
                          {articleType === item.type && <Check className="w-4 h-4 text-cyan-700" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Journal Target Track */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Target Journal Series
                  </label>
                  <select
                    value={selectedJournal}
                    onChange={(e) => setSelectedJournal(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-medium text-navy-950 focus:border-cyan-600 focus:outline-hidden"
                  >
                    <option value="j-ai">Publicore Transactions on Artificial Intelligence (Impact Factor: 8.4)</option>
                    <option value="j-comp">Publicore Computing & Software Engineering Transactions</option>
                    <option value="j-biomed">Publicore Open Journal of Biomedical Engineering</option>
                  </select>
                </div>

                {/* Special Issue Toggle */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isSpecialIssue}
                      onChange={(e) => setIsSpecialIssue(e.target.checked)}
                      className="rounded border-slate-300 text-cyan-700 focus:ring-cyan-600"
                    />
                    <span>This manuscript is part of a thematic Special Issue or Invited Call for Papers</span>
                  </label>

                  {isSpecialIssue && (
                    <div className="pl-6 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Select Themed Call:</label>
                      <input
                        type="text"
                        value={specialIssueName}
                        onChange={(e) => setSpecialIssueName(e.target.value)}
                        placeholder="e.g. Special Issue on Foundation Models in Biomedicine"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- STEP 2: Upload Manuscript ---------------- */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                    Step 2: Upload Manuscript & Files
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Upload your manuscript documents, configure file designations, and verify checksum scan authenticity.
                  </p>
                </div>

                {/* Preparation Format Selector */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Preparation Source Format
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      { id: "pdf", title: "Single Compiled PDF", desc: "Complete paper formatted in .pdf format." },
                      { id: "word", title: "Microsoft Word (.docx)", desc: "Editable docx formatted in journal style." },
                      { id: "latex", title: "LaTeX Archive (.zip / .tex)", desc: "Source archive with compiled PDF." },
                    ].map((mode) => (
                      <div
                        key={mode.id}
                        onClick={() => setFormatMode(mode.id as any)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                          formatMode === mode.id
                            ? "border-cyan-600 bg-white shadow-2xs font-bold"
                            : "border-slate-200 bg-white/60 hover:bg-white text-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span>{mode.title}</span>
                          {formatMode === mode.id && <Check className="w-3.5 h-3.5 text-cyan-700" />}
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">{mode.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Binary Uploader Component */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Upload Primary Document
                  </span>
                  <ManuscriptFileUploader
                    onUploadComplete={handleFileUpload}
                    initialFileName={uploadedFile || undefined}
                  />
                  {stepErrors.uploadedFile && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {stepErrors.uploadedFile}
                    </p>
                  )}
                </div>

                {/* File Manifest & Designation Table */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-navy-950 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-cyan-700" />
                        Uploaded Files & File Designation Table ({manifestFiles.length})
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Assign designations and arrange sequence order for peer review
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Input */}
                  <input
                    type="file"
                    ref={genericFileInputRef}
                    onChange={handleGenericFileUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Max size: 50MB &bull; Executable scripts (.exe, .bat) prohibited
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => genericFileInputRef.current?.click()}
                      className="border-dashed border-cyan-400 text-cyan-800 hover:bg-cyan-50"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                      + Add Supporting File
                    </Button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50">
                          <th className="py-2.5 px-3">Order</th>
                          <th className="py-2.5 px-3">File Name</th>
                          <th className="py-2.5 px-3">Size</th>
                          <th className="py-2.5 px-3">File Designation</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {manifestFiles.map((f, idx) => (
                          <tr key={f.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 font-mono font-bold text-slate-500">#{f.order}</td>
                            <td className="py-3 px-3 font-semibold text-navy-950 max-w-[200px] truncate">{f.name}</td>
                            <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{f.size}</td>
                            <td className="py-3 px-3">
                              <select
                                value={f.designation}
                                onChange={(e) => handleUpdateDesignation(f.id, e.target.value as any)}
                                className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:border-cyan-600 focus:outline-hidden"
                              >
                                <option value="Main Document">Main Document</option>
                                <option value="Cover Letter / Rebuttal">Cover Letter / Rebuttal</option>
                                <option value="Supporting Information">Supporting Information</option>
                                <option value="Figure / Graphic">Figure / Graphic</option>
                                <option value="Table">Table</option>
                                <option value="Data Availability Link">Data Availability Link</option>
                                <option value="Computational Code / Analysis Script">Computational Code / Analysis Script</option>
                              </select>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200 flex items-center gap-1 w-fit">
                                <Check className="w-3 h-3" /> Scanned
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveFile(idx, "up")}
                                  className="p-1 rounded text-slate-400 hover:text-navy-950 hover:bg-slate-200/60 disabled:opacity-30"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === manifestFiles.length - 1}
                                  onClick={() => handleMoveFile(idx, "down")}
                                  className="p-1 rounded text-slate-400 hover:text-navy-950 hover:bg-slate-200/60 disabled:opacity-30"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFile(f.id)}
                                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                                  title="Delete file"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Supplementary Files Requirement */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                        Supplementary Files ({supplementaryFiles.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        At least 1 supporting dataset or document required for reproducibility
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => suppFileInputRef.current?.click()}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Supplementary File
                    </Button>
                    <input
                      type="file"
                      ref={suppFileInputRef}
                      onChange={handleSuppFileChange}
                      multiple
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    {supplementaryFiles.map((sf) => (
                      <div
                        key={sf.id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5 text-cyan-700" />
                          <span className="font-semibold text-navy-950">{sf.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({sf.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSupplementaryFile(sf.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Analysis Code Zone */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-purple-700" />
                        Computational Analysis & Reproduction Script
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Optional Jupyter Notebook, Python or R script (.ipynb, .py, .r)
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Optional
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={analysisFileInputRef}
                    onChange={handleAnalysisFileChange}
                    accept=".py,.r,.ipynb,.zip"
                    className="hidden"
                  />

                  {analysisFile ? (
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-purple-700" />
                        <span className="font-semibold text-navy-950">{analysisFile.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({analysisFile.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAnalysisFile}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => analysisFileInputRef.current?.click()}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Attach Code (.ipynb, .py, .r)
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- STEP 3: Title ---------------- */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                    Step 3: Manuscript Title
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Provide a concise, informative title accurately reflecting the scientific contribution.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Full Manuscript Title
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const converted = title
                            .toLowerCase()
                            .split(" ")
                            .map((word) => (word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
                            .join(" ");
                          setTitle(converted.charAt(0).toUpperCase() + converted.slice(1));
                        }}
                        className="text-[11px] font-bold text-cyan-800 hover:underline bg-cyan-50 px-2 py-0.5 rounded"
                      >
                        Format Title Case
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the complete title of your research paper..."
                    className="w-full text-sm font-semibold p-3.5 rounded-xl border border-slate-300 bg-white text-navy-950 focus:border-cyan-600 focus:outline-hidden leading-relaxed"
                  />

                  {/* Math Symbols Helper Bar */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-500 mr-1">Insert Symbols:</span>
                    {["α", "β", "γ", "Δ", "θ", "μ", "σ", "∞", "±", "≈", "≤", "≥", "×"].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setTitle(title + sym)}
                        className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-cyan-50 font-mono text-xs font-bold text-slate-700"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                  {/* Metrics Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>
                        Words: <strong className="text-navy-950">{title.trim() ? title.trim().split(" ").length : 0}</strong> (Recommended: 10–25)
                      </span>
                      <span>
                        Characters: <strong className="text-navy-950">{title.length}</strong>
                      </span>
                    </div>
                  </div>

                  {stepErrors.title && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {stepErrors.title}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- STEP 4: Abstract ---------------- */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                    Step 4: Abstract & Keywords
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Provide the structured abstract and author index keywords.
                  </p>
                </div>

                {/* Abstract Textarea */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Abstract Text
                    </label>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Word Count: {abstract.trim() ? abstract.trim().split(/\s+/).length : 0} / 250 words
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    placeholder="Provide a comprehensive summary detailing background, methodology, empirical results, and scientific novelty..."
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-300 bg-white text-navy-950 leading-relaxed focus:border-cyan-600 focus:outline-hidden"
                  />

                  {stepErrors.abstract && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {stepErrors.abstract}
                    </p>
                  )}
                </div>

                {/* Research Highlights */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Research Highlights (Key Novel Findings)
                  </label>
                  <div className="space-y-1.5">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {i + 1}
                        </span>
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => {
                            const copy = [...highlights];
                            copy[i] = e.target.value;
                            setHighlights(copy);
                          }}
                          className="flex-1 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-cyan-600 focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords Chips */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Keywords & Index Terms
                  </label>

                  <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 min-h-[50px]">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100/80 text-cyan-900 border border-cyan-200"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => removeKeyword(kw)}
                          className="hover:text-red-600 font-bold ml-0.5"
                        >
                          &times;
                        </button>
                      </span>
                    ))}

                    <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addKeyword();
                          }
                        }}
                        placeholder="Type keyword and press Enter..."
                        className="bg-transparent text-xs p-1 focus:outline-hidden w-full"
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="px-2 py-0.5 rounded text-[11px] font-bold text-cyan-800 bg-cyan-100 hover:bg-cyan-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {stepErrors.keywords && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {stepErrors.keywords}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- STEP 5: Authors ---------------- */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                      Step 5: Author List & Sequencing
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Rank author contribution sequence and designate corresponding editorial contacts.
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowAddAuthorModal(true)}
                    className="bg-[#004e70] hover:bg-[#003c57] text-white"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Co-Author
                  </Button>
                </div>

                {/* Author Sequence Cards */}
                <div className="space-y-3">
                  {authors.map((auth, idx) => (
                    <div
                      key={auth.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold text-xs flex items-center justify-center shrink-0">
                          #{auth.order}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-navy-950">
                              {auth.firstName} {auth.lastName}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{auth.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveAuthor(idx, "up")}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                          title="Move Up in Rank"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === authors.length - 1}
                          onClick={() => handleMoveAuthor(idx, "down")}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                          title="Move Down in Rank"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAuthor(auth.id)}
                          disabled={authors.length <= 1}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                          title="Delete Author"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {stepErrors.authors && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {stepErrors.authors}
                  </p>
                )}

                {/* Add Co-Author Modal Drawer */}
                {showAddAuthorModal && (
                  <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/50 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-100">
                      <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                        Add Academic Co-Author
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddAuthorModal(false)}
                        className="text-slate-400 hover:text-navy-950 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={handleAddAuthor} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">First Name</label>
                          <input
                            type="text"
                            value={newAuthorFirst}
                            onChange={(e) => setNewAuthorFirst(e.target.value)}
                            placeholder="e.g. David"
                            required
                            className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Last Name</label>
                          <input
                            type="text"
                            value={newAuthorLast}
                            onChange={(e) => setNewAuthorLast(e.target.value)}
                            placeholder="e.g. Thorne"
                            required
                            className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Institutional Email</label>
                        <input
                          type="email"
                          value={newAuthorEmail}
                          onChange={(e) => setNewAuthorEmail(e.target.value)}
                          placeholder="e.g. d.thorne@stanford.edu"
                          required
                          className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={newAuthorIsCorr}
                          onChange={(e) => setNewAuthorIsCorr(e.target.checked)}
                          className="rounded border-slate-300 text-cyan-700"
                        />
                        <span className="text-slate-700 font-semibold">Designate as Corresponding Author</span>
                      </label>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowAddAuthorModal(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" className="bg-[#004e70] text-white">
                          Save Co-Author
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- STEP 6: Affiliations ---------------- */}
            {currentStep === 6 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                      Step 6: Institutional Affiliations & Mapping
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Register author institutions and connect each author to their primary university.
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowAddAffModal(true)}
                    className="bg-[#004e70] hover:bg-[#003c57] text-white"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Institution
                  </Button>
                </div>

                {/* Affiliations List with Author Checkboxes */}
                <div className="space-y-4">
                  {affiliations.map((aff, i) => (
                    <div
                      key={aff.id}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-navy-950">{aff.name}</h4>
                            <p className="text-xs text-slate-500">
                              {aff.department ? `${aff.department}, ` : ""}
                              {aff.city}, {aff.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Author Linker Checkboxes */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1.5 uppercase tracking-wider">
                          Linked Authors for this Affiliation:
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {authors.map((auth) => {
                            const isLinked = aff.authorIds.includes(auth.id);
                            return (
                              <button
                                key={auth.id}
                                type="button"
                                onClick={() => toggleAuthorAffiliation(aff.id, auth.id)}
                                className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                                  isLinked
                                    ? "bg-[#004e70] text-white border-[#004e70] font-bold"
                                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                                }`}
                              >
                                {isLinked && <Check className="w-3 h-3 text-white" />}
                                <span>
                                  {auth.firstName} {auth.lastName}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Affiliation Form Drawer */}
                {showAddAffModal && (
                  <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/50 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-100">
                      <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                        Add New Institutional Affiliation
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddAffModal(false)}
                        className="text-slate-400 hover:text-navy-950 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={handleAddAffiliation} className="space-y-3 text-xs">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Institution / University Name
                        </label>
                        <input
                          type="text"
                          value={newAffName}
                          onChange={(e) => setNewAffName(e.target.value)}
                          placeholder="e.g. Stanford University"
                          required
                          className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Department / Laboratory
                          </label>
                          <input
                            type="text"
                            value={newAffDept}
                            onChange={(e) => setNewAffDept(e.target.value)}
                            placeholder="e.g. Department of Computer Science"
                            className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">City</label>
                          <input
                            type="text"
                            value={newAffCity}
                            onChange={(e) => setNewAffCity(e.target.value)}
                            placeholder="e.g. Stanford"
                            required
                            className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">State / Province</label>
                          <input
                            type="text"
                            value={newAffState}
                            onChange={(e) => setNewAffState(e.target.value)}
                            placeholder="e.g. California"
                            className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Country</label>
                          <input
                            type="text"
                            value={newAffCountry}
                            onChange={(e) => setNewAffCountry(e.target.value)}
                            placeholder="e.g. United States"
                            required
                            className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowAddAffModal(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" className="bg-[#004e70] text-white">
                          Save Affiliation
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- STEP 7: Author Details ---------------- */}
            {currentStep === 7 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                    Step 7: Author Details, ORCID & CRediT Taxonomy
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Connect verified 16-digit ORCID identifiers and assign scholarly CRediT contributor roles.
                  </p>
                </div>

                {/* Author Tab Selector */}
                <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                  {authors.map((auth, idx) => (
                    <button
                      key={auth.id}
                      type="button"
                      onClick={() => setActiveAuthorTab(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activeAuthorTab === idx
                          ? "bg-[#004e70] text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {auth.firstName} {auth.lastName} {auth.isCorresponding ? "(Lead)" : ""}
                    </button>
                  ))}
                </div>

                {/* Author Details Card */}
                {currentAuthorForDetail && (
                  <div className="space-y-5">
                    {/* ORCID iD Connection */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          ORCID iD Identifier (16 digits)
                        </label>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-700" /> ORCID Verified
                        </span>
                      </div>

                      <input
                        type="text"
                        value={currentAuthorDetail.orcid}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAuthorDetailsMap((prev) => ({
                            ...prev,
                            [currentAuthorForDetail.id]: { ...currentAuthorDetail, orcid: val },
                          }));
                        }}
                        placeholder="0000-0002-1825-0097"
                        className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    {/* CRediT Contributor Roles */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        CRediT Contributor Roles for {currentAuthorForDetail.firstName} {currentAuthorForDetail.lastName}
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Select all official contribution categories performed by this investigator:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                        {[
                          "Conceptualization",
                          "Methodology",
                          "Software",
                          "Validation",
                          "Formal Analysis",
                          "Investigation",
                          "Data Curation",
                          "Writing - Original Draft",
                          "Writing - Review & Editing",
                          "Supervision",
                          "Project Administration",
                          "Funding Acquisition",
                        ].map((role) => {
                          const isSelected = currentAuthorDetail.roles.includes(role);
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => {
                                const newRoles = isSelected
                                  ? currentAuthorDetail.roles.filter((r) => r !== role)
                                  : [...currentAuthorDetail.roles, role];
                                setAuthorDetailsMap((prev) => ({
                                  ...prev,
                                  [currentAuthorForDetail.id]: { ...currentAuthorDetail, roles: newRoles },
                                }));
                              }}
                              className={`p-2 rounded-lg border text-left text-[11px] font-medium transition-colors flex items-center justify-between ${
                                isSelected
                                  ? "bg-cyan-50 border-cyan-600 text-cyan-900 font-bold"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              <span>{role}</span>
                              {isSelected && <Check className="w-3 h-3 text-cyan-700 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Short Academic Biography */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Brief Academic Biography (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={currentAuthorDetail.bio}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAuthorDetailsMap((prev) => ({
                            ...prev,
                            [currentAuthorForDetail.id]: { ...currentAuthorDetail, bio: val },
                          }));
                        }}
                        placeholder="Elena Rostova received her Ph.D. in Computer Science..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- STEP 8: Match Organizations ---------------- */}
            {currentStep === 8 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-700" />
                    <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                      Step 8: Match Organizations (ROR Registry)
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Verify matched institutional records against the global Open Research Organization Registry (ROR).
                  </p>
                </div>

                {/* Matched Organizations Cards */}
                <div className="space-y-3">
                  {matchedOrgs.map((m, i) => (
                    <div
                      key={m.affiliationId}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-cyan-800" />
                          <h4 className="text-sm font-bold text-navy-950">{m.institutionName}</h4>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {m.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          ROR ID: <a href={m.rorId} target="_blank" rel="noreferrer" className="text-cyan-800 underline">{m.rorId}</a> &bull; {m.country}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(m.rorId, "_blank")}
                          className="text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" /> View ROR Record
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    100% of submitting author affiliations successfully matched to international ROR repositories.
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Audit Passed
                  </span>
                </div>
              </div>
            )}

            {/* ---------------- STEP 9: Open Access ---------------- */}
            {currentStep === 9 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                    Step 9: Open Access & Publishing Licensing
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Select your article dissemination model and Creative Commons publishing license.
                  </p>
                </div>

                {/* Publishing Model Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div
                    onClick={() => setOpenAccessModel("gold")}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      openAccessModel === "gold"
                        ? "border-cyan-600 bg-cyan-50/50 ring-1 ring-cyan-600 shadow-2xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm text-navy-950">
                      <span>Gold Open Access (Recommended)</span>
                      {openAccessModel === "gold" && <Check className="w-4 h-4 text-cyan-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Immediate free global access under Creative Commons attribution upon publication. Highest citation visibility and discoverability.
                    </p>
                    <div className="pt-2 border-t border-cyan-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Standard APC: $1,250</span>
                      <span className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                        100% Institutional Waiver Eligible
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setOpenAccessModel("subscription")}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      openAccessModel === "subscription"
                        ? "border-cyan-600 bg-cyan-50/50 ring-1 ring-cyan-600 shadow-2xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm text-navy-950">
                      <span>Subscription / Traditional Model</span>
                      {openAccessModel === "subscription" && <Check className="w-4 h-4 text-cyan-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Zero author publication fee. Access restricted to institutional subscribers with a standard 12-month green embargo.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Author Cost: $0</span>
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">12-Mo Embargo</span>
                    </div>
                  </div>
                </div>

                {/* Creative Commons Licensing Agreement */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block">
                    Creative Commons Attribution License
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cc_license"
                        checked={openAccessLicense === "cc-by"}
                        onChange={() => setOpenAccessLicense("cc-by")}
                        className="text-cyan-700"
                      />
                      <span className="font-semibold text-navy-950">
                        CC-BY 4.0 (Creative Commons Attribution 4.0 International)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cc_license"
                        checked={openAccessLicense === "cc-by-nc-nd"}
                        onChange={() => setOpenAccessLicense("cc-by-nc-nd")}
                        className="text-cyan-700"
                      />
                      <span className="font-semibold text-navy-950">
                        CC-BY-NC-ND 4.0 (Non-Commercial, No Derivatives)
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={licenseAgreed}
                        onChange={(e) => setLicenseAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-cyan-700"
                      />
                      <span className="text-[11px] text-slate-600">
                        I confirm on behalf of all authors that this work is original and published under the selected Creative Commons framework.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- STEP 10: Additional Information ---------------- */}
            {currentStep === 10 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                    Step 10: Additional Information & Funding
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Provide compulsory grant disclosures, raw data repository links, and editorial cover letters.
                  </p>
                </div>

                {/* Funding & Grant Disclosures */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-cyan-700" />
                      Research Funding & Grant Information
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Funding Agency / Grant Body
                      </label>
                      <input
                        type="text"
                        value={funderName}
                        onChange={(e) => setFunderName(e.target.value)}
                        placeholder="e.g. Wellcome Trust / NIH / NSF"
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Grant / Award ID
                      </label>
                      <input
                        type="text"
                        value={grantNumber}
                        onChange={(e) => setGrantNumber(e.target.value)}
                        placeholder="e.g. WT-2026-NEURO-8821"
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Funding & Competing Interest Statement
                    </label>
                    <textarea
                      rows={2}
                      value={fundingStatement}
                      onChange={(e) => setFundingStatement(e.target.value)}
                      placeholder="Disclose all grant endowments or certify that no commercial conflict exists..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Data Availability Statement & Validated Link */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-cyan-700" />
                      Data Availability & Public Repository Link
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      value={datasourceUrl}
                      onChange={(e) => setDatasourceUrl(e.target.value)}
                      placeholder="https://zenodo.org/record/1042891"
                      className="w-full text-xs font-mono p-2.5 pr-24 rounded-lg border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                    />
                    <div className="absolute right-2 top-2">
                      {isValidUrl(datasourceUrl) ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid URL
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Invalid URL
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Repository validation active (Zenodo, Dryad, Figshare, GitHub)</span>
                    {isValidUrl(datasourceUrl) && (
                      <a
                        href={datasourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-800 font-bold hover:underline flex items-center gap-1"
                      >
                        Test Open Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Cover Letter & Rebuttal Statement */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Cover Letter & Editorial Statement
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {rebuttalLetter.trim().length} chars (min 20)
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={rebuttalLetter}
                    onChange={(e) => setRebuttalLetter(e.target.value)}
                    placeholder="Address the Editor-in-Chief regarding research novelty and significance..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white leading-relaxed focus:border-cyan-600 focus:outline-hidden"
                  />
                </div>

                {/* Preprint Declaration */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isPreprint}
                      onChange={(e) => setIsPreprint(e.target.checked)}
                      className="rounded border-slate-300 text-cyan-700"
                    />
                    <span>This manuscript was previously deposited to a public preprint server (e.g. arXiv, bioRxiv)</span>
                  </label>

                  {isPreprint && (
                    <div className="pl-6 pt-1">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Preprint DOI / URL:</label>
                      <input
                        type="text"
                        value={preprintDoi}
                        onChange={(e) => setPreprintDoi(e.target.value)}
                        placeholder="https://doi.org/10.48550/arXiv.2312.00000"
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- STEP 11: Final Review ---------------- */}
            {currentStep === 11 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                    Step 11: Final Submission Dossier Review
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Review your complete submission record before formally depositing with the editorial office.
                  </p>
                </div>

                {/* Dossier Summary Cards */}
                <div className="space-y-3.5 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Manuscript Title</span>
                      <p className="font-bold text-navy-950 mt-0.5">{title}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Article Type & Journal</span>
                      <p className="font-semibold text-cyan-800 mt-0.5">
                        {articleType} &bull; Publicore Transactions on AI ({formatMode.toUpperCase()})
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Corresponding Author</span>
                      <p className="font-bold text-navy-950 mt-0.5">
                        {authors[0]?.firstName} {authors[0]?.lastName} ({authors[0]?.email})
                      </p>
                      <p className="text-slate-500">
                        {affiliations[0]?.name} &bull; ORCID: {authorDetailsMap[authors[0]?.id]?.orcid || "0000-0002-1825-0097"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Co-Authors & Affiliations</span>
                      <p className="font-bold text-navy-950 mt-0.5">{authors.length} Registered Authors</p>
                      <p className="text-slate-500">{affiliations.length} Academic Affiliations Linked</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        File Inventory ({manifestFiles.length} files)
                      </span>
                      <ul className="mt-1 space-y-0.5 text-slate-600 font-medium">
                        {manifestFiles.map((s) => (
                          <li key={s.id}>
                            &bull; <span className="font-bold text-slate-700">[{s.designation}]</span> {s.name} ({s.size})
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Open Access & Publishing Model</span>
                      <p className="font-bold text-navy-950 mt-0.5">
                        {openAccessModel === "gold" ? "Gold Open Access (CC-BY 4.0)" : "Subscription Model (12-Mo Embargo)"}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                        Institutional Subsidy Applied ($0.00 Author Net Charge)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Funding & Grant ID</span>
                      <p className="font-bold text-navy-950 mt-0.5">{funderName}</p>
                      <p className="text-slate-500 font-mono text-[11px]">{grantNumber}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Data Availability Repository</span>
                      <p className="font-mono text-cyan-800 mt-0.5 truncate">{datasourceUrl}</p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Validated Repository Link
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pre-Flight Checklist */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-navy-950 text-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Pre-Flight Submission Checklist
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-900/60 px-2.5 py-0.5 rounded-full border border-cyan-800">
                      11/11 Steps Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Article Type Approved</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Main Document Uploaded</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Title & Abstract Formatted</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Authors & ORCIDs Linked</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Affiliations & ROR Matched</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Open Access License Signed</span>
                    </div>
                  </div>
                </div>

                {/* Final Declarations */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block">
                    Author Submission Declarations
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={finalDeclarations.allAuthorsApproved}
                      onChange={(e) =>
                        setFinalDeclarations({ ...finalDeclarations, allAuthorsApproved: e.target.checked })
                      }
                      className="rounded border-slate-300 text-cyan-700"
                    />
                    <span className="text-slate-700">All contributing co-authors have approved this manuscript.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={finalDeclarations.originalResearch}
                      onChange={(e) =>
                        setFinalDeclarations({ ...finalDeclarations, originalResearch: e.target.checked })
                      }
                      className="rounded border-slate-300 text-cyan-700"
                    />
                    <span className="text-slate-700">This manuscript represents original research and is not under consideration elsewhere.</span>
                  </label>
                </div>
              </div>
            )}

            {/* Bottom Step Navigation Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                  Step {currentStep} of {PROGRESS_STEPS.length}
                </span>

                {currentStep < 11 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNext}
                    className="bg-[#004e70] hover:bg-[#003c57] text-white text-xs px-5 shadow-2xs"
                  >
                    <span>Save & Continue to {PROGRESS_STEPS[currentStep]?.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSubmitManuscript}
                    disabled={isSubmitting}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-6 font-bold shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submitting Manuscript...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" /> Submit Manuscript
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submission Success Modal */}
      {submissionComplete && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Manuscript Successfully Deposited
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 mt-2">
                Submission Confirmed
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your paper has been allocated tracking code{" "}
                <strong className="text-cyan-800 font-mono text-sm">{submissionComplete.code}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <p>
                <strong>Title:</strong> {submissionComplete.title}
              </p>
              <p>
                <strong>Journal:</strong> {submissionComplete.journalName}
              </p>
              <p>
                <strong>Corresponding Author:</strong> {authors[0]?.firstName} {authors[0]?.lastName} ({authors[0]?.email})
              </p>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                An acknowledgment notice and PDF intake receipt have been dispatched to your email.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-auto text-xs"
              >
                <FileText className="w-3.5 h-3.5 mr-1" /> Download Receipt
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => router.push("/dashboard/author")}
                className="w-full sm:w-auto bg-[#004e70] hover:bg-[#003c57] text-white text-xs font-bold px-5"
              >
                Go to Author Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
