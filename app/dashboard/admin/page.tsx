"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { metricsService } from "@/services";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Layers,
  Users,
  BookOpen,
  History,
  Settings,
  BarChart3,
  ShieldCheck,
  Server,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    metricsService.getGlobalMetrics().then((m) => {
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        <div>
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
            Global Ecosystem Operations & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage institutional users, journal registries, archival volumes, integrity audits, and platform configuration.
          </p>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Registered Scholars", value: metrics?.activeResearchers?.toLocaleString() || "42,350", icon: Users },
            { label: "Active Journals", value: metrics?.peerReviewedJournals || "42", icon: BookOpen },
            { label: "Total Articles", value: metrics?.publishedArticles?.toLocaleString() || "148,200", icon: Layers },
            { label: "System Health", value: "99.99%", icon: Activity, highlight: true },
          ].map((item, idx) => (
            <Card key={idx} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{item.label}</span>
                <item.icon className="w-4 h-4 text-cyan-700" />
              </div>
              <p className="text-2xl font-extrabold text-navy-950 mt-1">{item.value}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Operational</p>
            </Card>
          ))}
        </div>

        {/* Admin Quick Module Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "User & Role Management",
              description: "Manage authors, reviewers, editors, and assign security credentials.",
              href: "/dashboard/admin/users",
              icon: Users,
              count: "42,350 users",
            },
            {
              title: "Journal Registry",
              description: "Configure ISSNs, aims and scopes, impact metrics, and editorial boards.",
              href: "/dashboard/admin/journals",
              icon: BookOpen,
              count: "42 journals",
            },
            {
              title: "Volumes & Issues",
              description: "Organize published articles into quarterly issues and archival volumes.",
              href: "/dashboard/admin/volumes",
              icon: Layers,
              count: "186 volumes",
            },
            {
              title: "Scholarly Analytics",
              description: "Deep analytics on citation ratios, altmetric distributions, and downloads.",
              href: "/dashboard/admin/metrics",
              icon: BarChart3,
              count: "Real-time sync",
            },
            {
              title: "Integrity Audit Logs",
              description: "Immutable security records of reviews, decisions, and logins.",
              href: "/dashboard/admin/audit",
              icon: History,
              count: "Audit verified",
            },
            {
              title: "System Configuration",
              description: "Configure AI intake thresholds, storage endpoints, and email services.",
              href: "/dashboard/admin/settings",
              icon: Settings,
              count: "Production ready",
            },
          ].map((mod, i) => (
            <Card key={i} hover className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700">
                  <mod.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-navy-950">{mod.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{mod.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">{mod.count}</span>
                <Link href={mod.href} className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1">
                  Access Module <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

