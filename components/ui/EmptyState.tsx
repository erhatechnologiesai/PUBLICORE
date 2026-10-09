import React from "react";
import { FolderSearch, AlertCircle, FileX } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No records found",
  description = "No items match your active search filters or query criteria.",
  icon,
  actionText,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-navy-900 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl border border-slate-200/70 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-3.5 bg-slate-200 rounded w-full" />
          <div className="h-3.5 bg-slate-200 rounded w-2/3" />
          <div className="flex gap-2 pt-2">
            <div className="h-5 bg-slate-200 rounded-full w-20" />
            <div className="h-5 bg-slate-200 rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
