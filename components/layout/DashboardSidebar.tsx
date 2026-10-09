"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services";
import { User, Role } from "@/types";
import {
  BookOpen,
  FileText,
  FileCheck2,
  Clock,
  History,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Cpu,
  Users,
  Settings,
  BarChart3,
  Layers,
  Send,
  Sparkles,
  Inbox,
  LogOut,
  ChevronRight,
} from "lucide-react";

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser);
  }, []);

  const role = currentUser?.role || "author";

  const handleRoleChange = async (newRole: Role) => {
    const updated = await authService.switchRole(newRole);
    setCurrentUser(updated);
    if (newRole === "author") router.push("/dashboard/author");
    else if (newRole === "reviewer") router.push("/dashboard/reviewer");
    else if (newRole === "editor") router.push("/dashboard/editor");
    else if (newRole === "production") router.push("/dashboard/production");
    else if (newRole === "admin") router.push("/dashboard/admin");
  };

  const navGroups = {
    author: [
      { label: "Overview", href: "/dashboard/author", icon: BookOpen },
      { label: "My Manuscripts", href: "/dashboard/author/manuscripts", icon: FileText },
      { label: "Submit Manuscript", href: "/submit", icon: Send },
      { label: "Revision Center", href: "/dashboard/author/revisions/ms-003", icon: History },
    ],
    reviewer: [
      { label: "Reviewer Hub", href: "/dashboard/reviewer", icon: ShieldCheck },
      { label: "Assigned Reviews", href: "/dashboard/reviewer/assigned", icon: Inbox },
      { label: "Review Workspace", href: "/dashboard/reviewer/workspace/ms-002", icon: FileCheck2 },
    ],
    editor: [
      { label: "Editorial Queue", href: "/dashboard/editor", icon: Inbox },
      { label: "Full Submissions Queue", href: "/dashboard/editor/queue", icon: FileSpreadsheet },
      { label: "AI Screening Demo", href: "/dashboard/editor/screening/ms-002", icon: Sparkles },
      { label: "Reviewer Matching", href: "/dashboard/editor/assign-reviewers/ms-002", icon: Users },
      { label: "Editorial Decision", href: "/dashboard/editor/decision/ms-002", icon: CheckCircle2 },
    ],
    production: [
      { label: "Production Queue", href: "/dashboard/production", icon: Cpu },
      { label: "JATS XML & Formats", href: "/dashboard/production", icon: FileText },
      { label: "DOI Registrations", href: "/dashboard/production", icon: Clock },
    ],
    admin: [
      { label: "Admin Overview", href: "/dashboard/admin", icon: Layers },
      { label: "User Management", href: "/dashboard/admin/users", icon: Users },
      { label: "Journal Registry", href: "/dashboard/admin/journals", icon: BookOpen },
      { label: "Volumes & Issues", href: "/dashboard/admin/volumes", icon: FileSpreadsheet },
      { label: "Platform Metrics", href: "/dashboard/admin/metrics", icon: BarChart3 },
      { label: "Audit Logs", href: "/dashboard/admin/audit", icon: History },
      { label: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
  };

  const currentNav = navGroups[role] || navGroups.author;

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Role Switcher Pills */}
        <div className="bg-slate-100 p-1 rounded-xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
            Current Workspace
          </p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {(["author", "reviewer", "editor", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`px-2 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  role === r
                    ? "bg-white text-navy-900 shadow-sm border border-slate-200/70"
                    : "text-slate-600 hover:text-navy-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleRoleChange("production")}
            className={`w-full mt-1 px-2 py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors ${
              role === "production"
                ? "bg-white text-navy-900 shadow-sm border border-slate-200/70"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            Production Desk
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser?.name.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-navy-900 truncate">
              {currentUser?.name}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {currentUser?.institution}
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            {role.toUpperCase()} WORKSPACE
          </p>
          {currentNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-cyan-50 text-cyan-800 font-bold border border-cyan-200/70"
                    : "text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${isActive ? "text-cyan-700" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-700" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer in sidebar */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <Link
          href="/ai/assistant"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100/80 rounded-lg transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          AI Research Copilot
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Back to Public Portal
        </Link>
      </div>
    </aside>
  );
};
