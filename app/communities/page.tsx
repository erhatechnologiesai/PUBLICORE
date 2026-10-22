"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Toast } from "@/components/ui/Toast";
import { communityService } from "@/services";
import { Community } from "@/types";
import {
  Users,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Sparkles,
  Search,
  Check,
  CheckCircle2,
} from "lucide-react";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load joined societies from localStorage
    try {
      const saved = localStorage.getItem("publicore_joined_communities");
      if (saved) {
        setJoinedIds(JSON.parse(saved));
      }
    } catch {
      // fallback
    }

    communityService.getAll().then((data) => {
      setCommunities(data);
      setLoading(false);
    });
  }, []);

  const categories = ["All", "Computer Science", "Biomedical Engineering", "Artificial Intelligence", "Interdisciplinary"];

  const toggleJoin = (comm: Community) => {
    const isJoined = joinedIds.includes(comm.id);
    let next: string[];

    if (isJoined) {
      next = joinedIds.filter((id) => id !== comm.id);
      setToastMessage(`You left the ${comm.name} society.`);
    } else {
      next = [...joinedIds, comm.id];
      setToastMessage(`Welcome to ${comm.name}! Access your community forum anytime.`);
    }

    setJoinedIds(next);
    try {
      localStorage.setItem("publicore_joined_communities", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const filtered = communities.filter((comm) => {
    const matchesCat =
      selectedCategory === "All" ||
      comm.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQ =
      !searchQuery ||
      comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQ;
  });

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="teal" size="sm">
              Scholarly Societies & Networks
            </Badge>
            {joinedIds.length > 0 && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {joinedIds.length} Joined
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Academic Communities
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Join disciplinary societies, participate in peer discussion forums, and co-author emerging research across foundational sciences.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search societies by name, field, or topic..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === c
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            <Users className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
            <p className="text-sm font-semibold">No societies found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-3 text-xs text-cyan-700 hover:underline font-semibold"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((comm) => {
              const isJoined = joinedIds.includes(comm.id);
              const dynamicMembers = comm.membersCount + (isJoined ? 1 : 0);

              return (
                <Card
                  key={comm.id}
                  hover
                  className="p-6 space-y-5 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="navy" size="sm">
                        {comm.category}
                      </Badge>
                      {isJoined && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Member
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-navy-950 leading-snug">
                      {comm.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {comm.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-[10px] text-slate-400">Members</p>
                        <p className="font-bold text-navy-950 mt-0.5">
                          {dynamicMembers.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-[10px] text-slate-400">Papers</p>
                        <p className="font-bold text-navy-950 mt-0.5">
                          {comm.publicationsCount.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-[10px] text-slate-400">Threads</p>
                        <p className="font-bold text-navy-950 mt-0.5">
                          {comm.discussionsCount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1">
                      {comm.topics.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <Button
                      variant={isJoined ? "outline" : "teal"}
                      size="sm"
                      onClick={() => toggleJoin(comm)}
                      className={`shadow-sm transition-all ${
                        isJoined
                          ? "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                          : ""
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Joined
                        </>
                      ) : (
                        "Join Society"
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {toastMessage && (
        <Toast
          type="info"
          title="Community Update"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      <Footer />
    </div>
  );
}
