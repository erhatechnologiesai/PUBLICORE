"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id?: string;
  type?: "success" | "info" | "warning";
  title: string;
  message?: string;
  onClose?: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = "success",
  title,
  message,
  onClose,
  duration = 3200,
}) => {
  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 bg-white/95 text-navy-950",
    info: "border-cyan-200 bg-white/95 text-navy-950",
    warning: "border-amber-200 bg-white/95 text-navy-950",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-5 right-5 z-50 max-w-sm w-full mx-auto sm:mx-0 p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 transition-all",
        borders[type]
      )}
    >
      {icons[type]}
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-xs font-bold leading-snug">{title}</h4>
        {message && (
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-0.5 -mr-1 rounded-md transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
