"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_JOURNALS, MOCK_USERS } from "@/mock/data";

export default function EditorialBoardPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">Scholarly Governance</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            International Editorial Board
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Distinguished scholars and editors-in-chief providing strategic peer review leadership and ensuring scientific excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_JOURNALS.map((j) => (
            <Card key={j.id} className="p-6 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  {j.shortTitle}
                </span>
                <h3 className="text-base font-bold text-navy-950 mt-1">{j.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-800 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {j.chiefEditor.name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.)\s*/i, "").charAt(0) || "E"}
                </div>
                <div>
                  <Badge variant="navy" size="sm" className="mb-0.5">Editor-in-Chief</Badge>
                  <h4 className="text-sm font-bold text-navy-950">{j.chiefEditor.name}</h4>
                  <p className="text-xs text-slate-500">{j.chiefEditor.institution}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

