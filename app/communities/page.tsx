"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { communityService } from "@/services";
import { Community } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Users, MessageSquare, BookOpen, ArrowRight, Sparkles } from "lucide-react";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityService.getAll().then((data) => {
      setCommunities(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">
            Scholarly Societies & Networks
          </Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Academic Communities
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Join disciplinary societies, participate in peer discussion forums, and co-author emerging research across foundational sciences.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communities.map((comm) => (
              <Card key={comm.id} hover className="p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <Badge variant="navy" size="sm">{comm.category}</Badge>
                  <h3 className="text-lg font-bold text-navy-950 leading-snug">{comm.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{comm.description}</p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400">Members</p>
                      <p className="font-bold text-navy-950 mt-0.5">{comm.membersCount.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400">Papers</p>
                      <p className="font-bold text-navy-950 mt-0.5">{comm.publicationsCount.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400">Threads</p>
                      <p className="font-bold text-navy-950 mt-0.5">{comm.discussionsCount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {comm.topics.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Button variant="teal" size="sm" onClick={() => alert(`Joined ${comm.name} Society!`)}>
                    Join Society
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

