import React from "react";
import { ManuscriptStatus } from "@/types";
import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: ManuscriptStatus | string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "sm" }) => {
  switch (status) {
    case "Published":
    case "DOI Registered":
      return (
        <Badge variant="teal" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          {status}
        </Badge>
      );
    case "Accepted":
      return (
        <Badge variant="green" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {status}
        </Badge>
      );
    case "Under Review":
      return (
        <Badge variant="blue" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          {status}
        </Badge>
      );
    case "Revision":
      return (
        <Badge variant="amber" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {status}
        </Badge>
      );
    case "Screening":
    case "Editor Assigned":
    case "Reviewer Invited":
      return (
        <Badge variant="navy" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          {status}
        </Badge>
      );
    case "Submitted":
      return (
        <Badge variant="gray" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {status}
        </Badge>
      );
    case "Rejected":
      return (
        <Badge variant="rose" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {status}
        </Badge>
      );
    default:
      return (
        <Badge variant="gray" size={size}>
          {status}
        </Badge>
      );
  }
};
