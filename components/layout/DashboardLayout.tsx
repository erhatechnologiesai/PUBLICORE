"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { DashboardSidebar } from "./DashboardSidebar";
import { PublishingSequenceBar } from "../sequence/PublishingSequenceBar";
import { authService } from "@/services";
import { User } from "@/types";
import { Menu, X, Layers, User as UserIcon } from "lucide-react";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser);
    const handleState = () => authService.getCurrentUser().then(setCurrentUser);
    window.addEventListener("publicore_state_change", handleState);
    return () => window.removeEventListener("publicore_state_change", handleState);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Interactive Sequence Controller Bar */}
      <PublishingSequenceBar />

      {/* Mobile Top Action Sub-Bar (Visible < lg screens) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-xs sticky top-16 z-20">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          aria-label="Open Workspace Menu"
        >
          <Menu className="w-4 h-4 text-cyan-700" />
          <span>Dashboard Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Role:
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-100 text-cyan-900 capitalize">
            {currentUser?.role || "Author"}
          </span>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer with Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-elevated z-10">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-700" />
                Workspace Navigation
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-navy-950 hover:bg-slate-200 transition-colors"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DashboardSidebar
                onItemClick={() => setMobileSidebarOpen(false)}
                className="w-full border-r-0 min-h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar (visible on lg+) */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
