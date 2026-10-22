import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_USERS } from "@/mock/data";
import { ReviewerMatch } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords = [], authorInstitution = "" } = body;

    const reviewers = MOCK_USERS.filter((u) => u.role === "reviewer");

    const matchedCandidates: ReviewerMatch[] = [
      {
        reviewerId: "usr-006",
        name: "Prof. Anika Patel",
        institution: "ETH Zürich, Switzerland",
        expertiseMatch: 96,
        topics: ["Spiking Neural Networks", "Edge Computing", "Neuromorphic Hardware"],
        publicationRelevance: "Author of 14 seminal publications on neuromorphic spike encoders; h-index: 42",
        availability: "Available",
        conflictStatus: authorInstitution.includes("ETH") ? "Conflict" : "Clear",
        assignedStatus: "Invited",
      },
      {
        reviewerId: "usr-003",
        name: "Dr. Kenji Sato",
        institution: "Kyoto University, Japan",
        expertiseMatch: 92,
        topics: ["Signal Processing", "Quantum Information", "Low-Power Computing"],
        publicationRelevance: "Lead author of 8 papers on asynchronous sensor processing; h-index: 29",
        availability: "Available",
        conflictStatus: authorInstitution.includes("Kyoto") ? "Conflict" : "Clear",
        assignedStatus: "Unassigned",
      },
      {
        reviewerId: "usr-007",
        name: "Dr. Felix Hoffman",
        institution: "Max Planck Institute, Germany",
        expertiseMatch: 88,
        topics: ["Bioacoustics", "Sensor Networks", "Embedded Machine Learning"],
        publicationRelevance: "Published extensively in bioacoustic wildlife telemetry datasets; h-index: 31",
        availability: "Busy",
        conflictStatus: "Clear",
        assignedStatus: "Unassigned",
      },
      {
        reviewerId: "usr-004",
        name: "Dr. Sarah Al-Mansoor",
        institution: "Imperial College London, UK",
        expertiseMatch: 85,
        topics: ["Microfluidics", "Targeted Drug Nanocarriers", "Synthetic Biology"],
        publicationRelevance: "Author of 22 papers on robotic automated biology assays; h-index: 31",
        availability: "Available",
        conflictStatus: authorInstitution.includes("Imperial") ? "Potential Conflict" : "Clear",
        assignedStatus: "Unassigned",
      },
    ];

    return NextResponse.json({ candidates: matchedCandidates });
  } catch (err: any) {
    return NextResponse.json({ error: "Reviewer matching failed", details: err.message }, { status: 500 });
  }
}
