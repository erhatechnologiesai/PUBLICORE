"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
