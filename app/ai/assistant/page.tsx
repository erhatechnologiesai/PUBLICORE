"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AIChatWorkspace } from "@/components/ai/AIChatWorkspace";

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <AIChatWorkspace />
      </main>
    </div>
  );
}

