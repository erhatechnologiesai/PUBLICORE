"use client";

import React from "react";
import { ManuscriptStatus, ManuscriptTimelineEvent } from "@/types";
import { Check, Clock, AlertCircle } from "lucide-react";

interface ManuscriptTimelineProps {
  currentStatus: ManuscriptStatus;
  timeline?: ManuscriptTimelineEvent[];
  compact?: boolean;
}

const ALL_STAGES: ManuscriptStatus[] = [
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

export const ManuscriptTimeline: React.FC<ManuscriptTimelineProps> = ({
  currentStatus,
  timeline = [],
  compact = false,
}) => {
  const currentIndex = ALL_STAGES.indexOf(
    ALL_STAGES.includes(currentStatus) ? currentStatus : "Submitted"
  );

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Publishing Lifecycle Timeline
          </h4>
          <p className="text-sm font-semibold text-navy-900 mt-0.5">
            Stage {currentIndex + 1} of {ALL_STAGES.length}:{" "}
            <span className="text-cyan-700">{currentStatus}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Complete
          </span>
          <span className="flex items-center gap-1 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 animate-pulse inline-block" />
            In Progress
          </span>
        </div>
      </div>

      {/* Horizontal on md+, Vertical on mobile */}
      <div className="hidden lg:grid grid-cols-10 gap-1 relative pt-2">
        {ALL_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && currentStatus === "DOI Registered");
          const isCurrent = idx === currentIndex && currentStatus !== "DOI Registered";
          const isPending = idx > currentIndex;

          const event = timeline.find((t) => t.stage === stage);

          return (
            <div key={stage} className="flex flex-col items-center text-center relative group">
              {/* Connector line */}
              {idx < ALL_STAGES.length - 1 && (
                <div
                  className={`absolute top-3.5 left-1/2 w-full h-[2px] -z-0 transition-colors ${
                    idx < currentIndex ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}

              {/* Node Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold z-10 transition-all ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-100"
                    : isCurrent
                    ? "bg-cyan-600 text-white ring-4 ring-cyan-100 shadow-md scale-110"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Stage Title */}
              <div className="mt-2.5 w-full px-1">
                <p
                  className={`text-[11px] leading-tight font-medium ${
                    isCurrent
                      ? "text-cyan-800 font-bold"
                      : isCompleted
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {stage}
                </p>
                {event?.date && (
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {event.date}
                  </p>
                )}
                {event?.note && (
                  <div className="mt-1">
                    <span className="text-[9px] bg-cyan-50 text-cyan-800 px-1 py-0.5 rounded border border-cyan-100 line-clamp-1" title={event.note}>
                      {event.note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet Vertical list */}
      <div className="lg:hidden space-y-3 pt-2">
        {ALL_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && currentStatus === "DOI Registered");
          const isCurrent = idx === currentIndex && currentStatus !== "DOI Registered";
          const event = timeline.find((t) => t.stage === stage);

          return (
            <div key={stage} className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-cyan-600 text-white ring-2 ring-cyan-100"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      isCurrent ? "text-cyan-700 font-bold" : isCompleted ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {stage}
                  </span>
                  {event?.date && (
                    <span className="text-[11px] text-slate-400 font-mono">{event.date}</span>
                  )}
                </div>
                {event?.note && (
                  <p className="text-[11px] text-cyan-800 mt-0.5">{event.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
