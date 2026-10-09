export type Role = 'author' | 'reviewer' | 'editor' | 'production' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  title?: string;
  institution: string;
  department?: string;
  orcid?: string;
  hIndex?: number;
  publicationsCount?: number;
  citationsCount?: number;
  researchInterests: string[];
}

export type ArticleType = 
  | 'Research Article'
  | 'Review Paper'
  | 'Methodology'
  | 'Short Communication'
  | 'Editorial'
  | 'Systematic Review';

export type ManuscriptStatus =
  | 'Submitted'
  | 'Screening'
  | 'Editor Assigned'
  | 'Reviewer Invited'
  | 'Under Review'
  | 'Revision'
  | 'Accepted'
  | 'Production'
  | 'Published'
  | 'DOI Registered'
  | 'Rejected';

export interface ManuscriptAuthor {
  name: string;
  email: string;
  institution: string;
  orcid?: string;
  isCorresponding: boolean;
  order: number;
}

export interface ReviewerMatch {
  reviewerId: string;
  name: string;
  institution: string;
  expertiseMatch: number; // 0 - 100 percentage
  topics: string[];
  publicationRelevance: string;
  availability: 'Available' | 'Busy' | 'On Leave';
  conflictStatus: 'Clear' | 'Potential Conflict' | 'Conflict';
  assignedStatus?: 'Unassigned' | 'Invited' | 'Accepted' | 'Declined' | 'Completed';
}

export interface ManuscriptAIScreening {
  scopeMatch: number; // 0 - 100
  completeness: number; // 0 - 100
  researchArea: string;
  secondaryAreas: string[];
  noveltyScore: number;
  methodologyRigor: number;
  plagiarismSimilarity: number;
  potentialIssues: string[];
  keyHighlights: string[];
  suggestedKeywords: string[];
}

export interface ManuscriptTimelineEvent {
  stage: ManuscriptStatus;
  date: string;
  completed: boolean;
  current: boolean;
  note?: string;
}

export interface Manuscript {
  id: string;
  code: string; // e.g. "PUB-2026-0891"
  title: string;
  abstract: string;
  keywords: string[];
  articleType: ArticleType;
  journalId: string;
  journalName: string;
  authors: ManuscriptAuthor[];
  status: ManuscriptStatus;
  submittedAt: string;
  updatedAt: string;
  version: number;
  views?: number;
  downloads?: number;
  citations?: number;
  doi?: string;
  fileUrl?: string;
  aiScreening?: ManuscriptAIScreening;
  timeline: ManuscriptTimelineEvent[];
  assignedEditor?: {
    id: string;
    name: string;
    email: string;
  };
  reviewers?: ReviewerMatch[];
  reviewerComments?: Array<{
    id: string;
    reviewerName: string;
    date: string;
    recommendation: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject';
    comments: string;
    aiSummary?: string;
  }>;
}

export interface ArticleFigure {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
}

export interface ArticleTable {
  id: string;
  title: string;
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface ArticleReference {
  id: string;
  citationNumber: number;
  authors: string;
  title: string;
  journal: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  content: string; // HTML or markdown formatted text
  subsections?: {
    id: string;
    heading: string;
    content: string;
  }[];
}

export interface Article {
  id: string;
  slug: string;
  doi: string;
  title: string;
  articleType: ArticleType;
  isOpenAccess: boolean;
  journalId: string;
  journalName: string;
  volume: string;
  issue: string;
  publishedAt: string;
  receivedAt: string;
  acceptedAt: string;
  authors: ManuscriptAuthor[];
  abstract: string;
  keywords: string[];
  metrics: {
    views: number;
    downloads: number;
    citations: number;
    altmetricScore: number;
    fieldCitationRatio: number;
  };
  sections: ArticleSection[];
  figures: ArticleFigure[];
  tables: ArticleTable[];
  references: ArticleReference[];
  relatedArticleIds: string[];
}

export interface Journal {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  issn: string;
  subject: string;
  topics: string[];
  description: string;
  aimsAndScope: string;
  metrics: {
    impactFactor: number;
    citescore: number;
    acceptanceRate: number; // percentage
    timeToFirstDecisionDays: number;
    timeToPublishDays: number;
  };
  openAccess: boolean;
  chiefEditor: {
    name: string;
    institution: string;
    avatar?: string;
  };
  coverImage: string;
  latestIssue: string;
  totalArticles: number;
}

export interface Conference {
  id: string;
  slug: string;
  title: string;
  acronym: string;
  year: number;
  dateRange: string;
  location: string;
  isVirtual: boolean;
  status: 'Upcoming' | 'Past' | 'Ongoing';
  description: string;
  topics: string[];
  importantDates: {
    submissionDeadline: string;
    notificationDate: string;
    cameraReady: string;
    conferenceDates: string;
  };
  keynoteSpeakers: {
    name: string;
    affiliation: string;
    topic: string;
    avatar?: string;
  }[];
  callForPapersUrl: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  membersCount: number;
  publicationsCount: number;
  discussionsCount: number;
  topics: string[];
  recentDiscussions: {
    id: string;
    title: string;
    author: string;
    replies: number;
    lastActive: string;
  }[];
}

export interface ResearchGap {
  id: string;
  field: string;
  topic: string;
  gapTitle: string;
  description: string;
  currentLiteratureSummary: string;
  majorFindings: string[];
  commonMethodologies: string[];
  knownLimitations: string[];
  contradictions: string[];
  potentialResearchDirections: string[];
  suggestedByAIConfidence: number; // 0 - 100%
  supportingPapers: {
    id: string;
    title: string;
    doi: string;
    year: number;
  }[];
}

export interface ResearchTrend {
  topic: string;
  category: string;
  growthRate: number; // e.g. +38%
  fiveYearPublicationVolume: number[];
  years: string[];
  description: string;
  keyKeywords: string[];
  topInstitutions: string[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  content: string;
  sources?: {
    id: string;
    title: string;
    authors: string;
    year: number;
    doi: string;
    excerpt: string;
  }[];
  suggestedQuestions?: string[];
}
