import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "teal"
    | "navy"
    | "blue"
    | "green"
    | "amber"
    | "rose"
    | "gray"
    | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  variant = "teal",
  size = "sm",
  ...props
}) => {
  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5",
    md: "text-xs px-3 py-1",
  };

  const variantStyles = {
    teal: "bg-cyan-50 text-cyan-800 border border-cyan-200/80 font-medium",
    navy: "bg-navy-50 text-navy-800 border border-navy-200/80 font-medium",
    blue: "bg-blue-50 text-blue-700 border border-blue-200 font-medium",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium",
    amber: "bg-amber-50 text-amber-800 border border-amber-200 font-medium",
    rose: "bg-rose-50 text-rose-700 border border-rose-200 font-medium",
    gray: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    outline: "bg-transparent text-slate-600 border border-slate-300 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full leading-none transition-colors select-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
