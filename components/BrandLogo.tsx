import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "icon" | "light";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// Exact 8-element Swirling Aperture / Science Nexus Vector Icon from user specification
const LOGO_PATHS = [
  "M 55.2 7.2 C 56.6 7.2, 60.6 6.1, 64.5 7.2 C 68.4 8.3, 75.3 12.2, 78.4 14.1 C 81.5 16.0, 81.5 16.8, 83.0 18.7 C 84.5 20.6, 86.8 24.1, 87.6 25.7 C 88.4 27.3, 87.2 26.9, 87.6 28.0 C 88.0 29.1, 89.5 31.1, 89.9 32.6 C 90.3 34.1, 90.9 36.5, 89.9 37.3 C 89.0 38.1, 85.7 39.2, 84.2 37.3 C 82.7 35.4, 83.4 29.9, 80.7 25.7 C 78.0 21.4, 72.0 14.9, 67.9 11.8 C 63.9 8.7, 58.5 8.0, 56.4 7.2 C 54.3 6.4, 53.9 7.2, 55.2 7.2 Z",
  "M 34.4 9.5 C 35.0 9.3, 36.3 8.3, 36.7 9.5 C 37.1 10.7, 37.3 15.2, 36.7 16.4 C 36.1 17.5, 34.0 16.2, 33.2 16.4 C 32.4 16.6, 33.1 17.2, 32.1 17.6 C 31.1 18.0, 30.1 17.2, 27.4 18.7 C 24.7 20.2, 18.7 24.1, 15.8 26.8 C 12.9 29.5, 11.6 32.0, 10.1 34.9 C 8.6 37.8, 7.2 43.4, 6.6 44.2 C 6.0 45.0, 6.4 40.6, 6.6 39.6 C 6.8 38.6, 7.3 39.9, 7.7 38.4 C 8.1 36.9, 7.7 33.2, 8.9 30.3 C 10.1 27.4, 12.4 23.8, 14.7 21.1 C 17.0 18.4, 20.1 15.8, 22.8 14.1 C 25.5 12.3, 29.2 11.2, 30.9 10.6 C 32.6 10.0, 32.6 10.8, 33.2 10.6 C 33.8 10.4, 33.8 9.7, 34.4 9.5 Z",
  "M 45.9 9.5 C 47.1 9.5, 49.6 9.3, 52.9 10.6 C 56.2 11.9, 62.1 14.5, 65.6 17.6 C 69.1 20.7, 72.3 26.9, 73.7 29.2 C 75.1 31.5, 73.3 30.4, 73.7 31.5 C 74.1 32.6, 75.7 34.0, 76.1 36.1 C 76.5 38.2, 76.3 43.8, 76.1 44.2 C 75.9 44.6, 75.9 40.7, 74.9 38.4 C 73.9 36.1, 73.0 33.4, 70.3 30.3 C 67.6 27.2, 62.0 22.2, 58.7 19.9 C 55.4 17.6, 52.5 17.0, 50.6 16.4 C 48.7 15.8, 47.9 16.6, 47.1 16.4 C 46.3 16.2, 46.1 16.3, 45.9 15.3 C 45.7 14.3, 45.9 11.6, 45.9 10.6 C 45.9 9.6, 44.7 9.5, 45.9 9.5 Z",
  "M 40.2 23.4 C 41.2 23.2, 44.8 23.2, 44.8 23.4 C 44.8 23.6, 42.7 23.4, 40.2 24.5 C 37.7 25.6, 33.0 27.6, 29.7 30.3 C 26.4 33.0, 22.6 37.8, 20.5 40.7 C 18.4 43.6, 17.6 46.0, 17.0 47.7 C 16.4 49.5, 17.2 50.2, 17.0 51.2 C 16.8 52.2, 16.9 53.1, 15.8 53.5 C 14.7 53.9, 10.9 54.9, 10.1 53.5 C 9.3 52.1, 10.3 48.1, 11.2 45.4 C 12.1 42.7, 13.7 40.0, 15.8 37.3 C 17.9 34.6, 20.8 31.3, 23.9 29.2 C 27.0 27.1, 31.9 25.3, 34.4 24.5 C 36.9 23.7, 38.0 24.7, 39.0 24.5 C 40.0 24.3, 39.2 23.6, 40.2 23.4 Z",
  "M 84.2 46.5 C 85.4 46.3, 89.0 45.5, 89.9 46.5 C 90.9 47.5, 90.9 49.6, 89.9 52.3 C 89.0 55.0, 86.5 59.6, 84.2 62.7 C 81.9 65.8, 79.0 68.7, 76.1 70.8 C 73.2 72.9, 70.3 74.5, 66.8 75.5 C 63.3 76.5, 55.2 77.2, 55.2 76.6 C 55.2 76.0, 63.3 74.1, 66.8 72.0 C 70.3 69.9, 73.4 67.2, 76.1 63.9 C 78.8 60.6, 81.8 55.0, 83.0 52.3 C 84.2 49.6, 82.8 48.7, 83.0 47.7 C 83.2 46.7, 83.0 46.7, 84.2 46.5 Z",
  "M 23.9 55.8 C 24.1 56.6, 24.1 59.3, 25.1 61.6 C 26.1 63.9, 27.0 66.6, 29.7 69.7 C 32.4 72.8, 38.0 77.8, 41.3 80.1 C 44.6 82.4, 47.5 83.0, 49.4 83.6 C 51.3 84.2, 52.1 83.4, 52.9 83.6 C 53.7 83.8, 53.9 83.5, 54.1 84.7 C 54.3 85.9, 55.3 89.7, 54.1 90.5 C 52.9 91.3, 49.8 90.4, 47.1 89.4 C 44.4 88.4, 40.7 86.8, 37.8 84.7 C 34.9 82.6, 32.0 80.1, 29.7 76.6 C 27.4 73.1, 24.9 67.2, 23.9 63.9 C 22.9 60.6, 23.9 58.3, 23.9 56.9 C 23.9 55.5, 23.7 55.0, 23.9 55.8 Z",
  "M 92.3 56.9 C 92.5 56.7, 93.4 55.3, 93.4 56.9 C 93.4 58.5, 93.1 63.3, 92.3 66.2 C 91.5 69.1, 90.0 72.2, 88.8 74.3 C 87.6 76.4, 87.2 77.0, 85.3 78.9 C 83.4 80.8, 79.9 84.2, 77.2 85.9 C 74.5 87.7, 71.4 88.6, 69.1 89.4 C 66.8 90.2, 64.3 91.5, 63.3 90.5 C 62.3 89.5, 62.1 84.9, 63.3 83.6 C 64.5 82.3, 67.2 83.8, 70.3 82.4 C 73.4 81.1, 78.5 78.4, 81.8 75.5 C 85.1 72.6, 88.2 68.0, 89.9 65.1 C 91.7 62.2, 91.9 59.5, 92.3 58.1 C 92.7 56.7, 92.1 57.1, 92.3 56.9 Z",
  "M 10.1 62.7 C 11.1 62.5, 14.3 60.8, 15.8 62.7 C 17.3 64.6, 16.6 70.0, 19.3 74.3 C 22.0 78.5, 28.8 85.3, 32.1 88.2 C 35.4 91.1, 36.9 90.9, 39.0 91.7 C 41.1 92.5, 45.9 92.8, 44.8 92.8 C 43.6 92.8, 36.0 92.8, 32.1 91.7 C 28.2 90.6, 24.5 88.2, 21.6 85.9 C 18.7 83.6, 16.4 80.3, 14.7 77.8 C 13.0 75.3, 12.0 73.1, 11.2 70.8 C 10.4 68.5, 10.3 65.3, 10.1 63.9 C 9.9 62.5, 9.1 62.9, 10.1 62.7 Z"
];

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  className = "",
  size = "md",
}) => {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-11 h-11",
    xl: "w-13 h-13",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const isLight = variant === "light";

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* New Swirling Aperture Scientific Core Vector Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-all group-hover:scale-105 group-hover:rotate-6 duration-300 drop-shadow-xs"
        >
          <defs>
            {/* Signature Navy-to-Teal Gradient for Light Theme */}
            <linearGradient id="brandLogoGrad" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#0B1A2C" />
              <stop offset="50%" stopColor="#104A5E" />
              <stop offset="100%" stopColor="#177994" />
            </linearGradient>

            {/* Radiant White-to-Cyan Gradient for Dark / Footer Theme */}
            <linearGradient id="brandLogoGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#67E8F9" />
            </linearGradient>
          </defs>

          {/* 8-Part Swirling Vortex Blades */}
          {LOGO_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={isLight ? "url(#brandLogoGradLight)" : "url(#brandLogoGrad)"}
              className="transition-opacity duration-200"
            />
          ))}
        </svg>
      </div>

      {variant !== "icon" && (
        <div className="flex flex-col text-left">
          <span
            className={`font-bold tracking-tight leading-none ${textSizes[size]} ${
              isLight ? "text-white" : "text-navy-900"
            }`}
          >
            PUBLI<span className={isLight ? "text-cyan-400" : "text-[#177994]"}>CORE</span>
          </span>
          <span
            className={`text-[9px] tracking-widest uppercase font-semibold mt-0.5 ${
              isLight ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Academic Research Ecosystem
          </span>
        </div>
      )}
    </Link>
  );
};
