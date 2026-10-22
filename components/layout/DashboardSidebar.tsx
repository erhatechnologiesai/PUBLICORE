"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService, manuscriptService } from "@/services";
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
  RotateCcw,
  Database,
  Mail,
  CreditCard,
  Cloud,
} from "lucide-react";

interface DashboardSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onItemClick,
  className = "",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeMsId, setActiveMsId] = useState<string>("ms-001");

  const syncState = () => {
    authService.getCurrentUser().then(setCurrentUser);
    manuscriptService.getActiveSequenceManuscript().then((ms) => {
      if (ms) setActiveMsId(ms.id);
    });
  };

  useEffect(() => {
    syncState();
    const handleStateChange = () => syncState();
    window.addEventListener("publicore_state_change", handleStateChange);
    return () => window.removeEventListener("publicore_state_change", handleStateChange);
  }, []);

  const role = currentUser?.role || "author";

  const handleRoleChange = async (newRole: Role) => {
    const updated = await authService.switchRole(newRole);
    setCurrentUser(updated);
    if (onItemClick) onItemClick();

    if (newRole === "author") router.push("/dashboard/author");
    else if (newRole === "reviewer") router.push("/dashboard/reviewer");
    else if (newRole === "editor") router.push("/dashboard/editor");
    else if (newRole === "production") router.push("/dashboard/production");
    else if (newRole === "admin") router.push("/dashboard/admin");
  };

  const navGroups = {
    author: [
      { label: "Author Overview", href: "/dashboard/author", icon: BookOpen },
      { label: "My Manuscripts", href: "/dashboard/author/manuscripts", icon: FileText },
      { label: "Submit Manuscript", href: "/submit", icon: Send },
      { label: "APC & Invoices", href: "/dashboard/billing", icon: CreditCard },
      { label: "Revision Center", href: `/dashboard/author/revisions/${activeMsId}`, icon: History },
    ],
    reviewer: [
      { label: "Reviewer Hub", href: "/dashboard/reviewer", icon: ShieldCheck },
      { label: "Assigned Queue", href: "/dashboard/reviewer/assigned", icon: Inbox },
      { label: "Review Workspace", href: `/dashboard/reviewer/workspace/${activeMsId}`, icon: FileCheck2 },
    ],
    editor: [
      { label: "Editorial Queue", href: "/dashboard/editor", icon: Inbox },
      { label: "Submissions Table", href: "/dashboard/editor/queue", icon: FileSpreadsheet },
      { label: "AI Screening Desk", href: `/dashboard/editor/screening/${activeMsId}`, icon: Sparkles },
      { label: "Reviewer Matching", href: `/dashboard/editor/assign-reviewers/${activeMsId}`, icon: Users },
      { label: "Editorial Decision", href: `/dashboard/editor/decision/${activeMsId}`, icon: CheckCircle2 },
    ],
    production: [
      { label: "Production Desk", href: "/dashboard/production", icon: Cpu },
      { label: "Crossref Gateway", href: "/dashboard/production", icon: Clock },
      { label: "JATS XML & Assets", href: "/dashboard/production", icon: FileText },
    ],
    admin: [
      { label: "Admin Overview", href: "/dashboard/admin", icon: Layers },
      { label: "User Management", href: "/dashboard/admin/users", icon: Users },
      { label: "APC & Billing Desk", href: "/dashboard/billing", icon: CreditCard },
      { label: "Cloud Deployment", href: "/dashboard/deployment", icon: Cloud },
      { label: "Journal Registry", href: "/dashboard/admin/journals", icon: BookOpen },
      { label: "Volumes & Issues", href: "/dashboard/admin/volumes", icon: FileSpreadsheet },
      { label: "Platform Metrics", href: "/dashboard/admin/metrics", icon: BarChart3 },
      { label: "Audit Logs", href: "/dashboard/admin/audit", icon: History },
      { label: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
  };

  const currentNav = navGroups[role] || navGroups.author;

  return (
    <aside
      className={`w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-5">
        {/* Role Switcher Pills */}
        <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200/70">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1.5 py-0.5">
            Switch Role
          </p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {(["author", "reviewer", "editor", "admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`px-2 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  role === r
                    ? "bg-white text-navy-950 shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-navy-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleRoleChange("production")}
            className={`w-full mt-1 px-2 py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors ${
              role === "production"
                ? "bg-white text-navy-950 shadow-xs border border-slate-200 font-bold"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            Production Desk
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {currentUser?.name.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-navy-950 truncate">
              {currentUser?.name || "Dr. Elena Rostova"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {currentUser?.institution || "University of Cambridge"}
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            {role.toUpperCase()} WORKSPACE
          </p>
          {currentNav.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard/author" && item.href !== "/dashboard/editor" && item.href !== "/dashboard/reviewer" && item.href !== "/dashboard/production" && item.href !== "/dashboard/admin");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-cyan-50 text-cyan-900 font-bold border border-cyan-200 shadow-xs"
                    : "text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-700" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-700 shrink-0" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer in sidebar */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <Link
          href="/dashboard/qa"
          onClick={onItemClick}
          className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
            pathname === "/dashboard/qa"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/90"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Testing & QA Suite</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">
            10/10
          </span>
        </Link>
        <Link
          href="/dashboard/database"
          onClick={onItemClick}
          className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
            pathname === "/dashboard/database"
              ? "bg-amber-50 text-amber-900 border border-amber-200"
              : "text-amber-800 bg-amber-50/80 hover:bg-amber-100/90"
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Firebase Database</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
            Phase 3
          </span>
        </Link>
        <Link
          href="/dashboard/emails"
          onClick={onItemClick}
          className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
            pathname === "/dashboard/emails"
              ? "bg-blue-50 text-blue-900 border border-blue-200"
              : "text-blue-800 bg-blue-50/80 hover:bg-blue-100/90"
          }`}
        >
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Email Center</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-900">
            Phase 4
          </span>
        </Link>
        <Link
          href="/dashboard/billing"
          onClick={onItemClick}
          className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
            pathname === "/dashboard/billing"
              ? "bg-purple-50 text-purple-900 border border-purple-200"
              : "text-purple-800 bg-purple-50/80 hover:bg-purple-100/90"
          }`}
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>APC & Billing</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-900">
            Stripe
          </span>
        </Link>
        <Link
          href="/dashboard/deployment"
          onClick={onItemClick}
          className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
            pathname === "/dashboard/deployment"
              ? "bg-cyan-50 text-cyan-900 border border-cyan-200"
              : "text-cyan-800 bg-cyan-50/80 hover:bg-cyan-100/90"
          }`}
        >
          <div className="flex items-center gap-2">
            <Cloud className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span>Cloud Deployment</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-200 text-cyan-900">
            Vercel
          </span>
        </Link>
        <Link
          href="/ai/assistant"
          onClick={onItemClick}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100/80 rounded-lg transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
          <span>AI Research Copilot</span>
        </Link>
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span>Back to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
};
