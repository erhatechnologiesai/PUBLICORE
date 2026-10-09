import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "teal" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-2.5 gap-2.5 font-semibold",
    };

    const variantStyles = {
      primary:
        "bg-navy-900 text-white hover:bg-navy-950 focus:ring-navy-700 shadow-sm",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400 border border-slate-200/60",
      teal:
        "bg-cyan-700 text-white hover:bg-cyan-800 focus:ring-cyan-500 shadow-sm",
      outline:
        "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-300 bg-white",
      ghost:
        "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 focus:ring-slate-300",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-400 shadow-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
