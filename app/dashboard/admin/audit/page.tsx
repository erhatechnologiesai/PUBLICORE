"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Lock, Clock, UserCheck } from "lucide-react";

export default function AuditLogsPage() {
  const logs = [
    { id: "aud-901", timestamp: "2026-10-07 14:22:10 UTC", user: "Prof. Marcus Vance (Editor)", action: "EDITORIAL_DECISION_ISSUED", target: "PUB-2026-1142", ip: "171.64.12.9" },
    { id: "aud-900", timestamp: "2026-10-07 12:15:02 UTC", user: "Dr. Kenji Sato (Reviewer)", action: "PEER_REVIEW_SUBMITTED", target: "PUB-2026-1142", ip: "133.1.44.18" },
    { id: "aud-899", timestamp: "2026-10-07 09:30:45 UTC", user: "PUBLICORE_AI_AGENT", action: "AI_SCREENING_COMPLETED", target: "PUB-2026-1402", ip: "10.0.4.11" },
    { id: "aud-898", timestamp: "2026-10-06 18:41:19 UTC", user: "Dr. Elena Rostova (Author)", action: "REVISED_VERSION_UPLOADED", target: "PUB-2026-1290", ip: "131.111.8.24" },
    { id: "aud-897", timestamp: "2026-10-06 11:02:50 UTC", user: "System Production Daemon", action: "CROSSREF_DOI_REGISTERED", target: "PUB-2026-0891", ip: "10.0.2.8" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Security & Integrity Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log entries documenting manuscript submissions, reviewer assignments, and editorial decisions under COPE guidelines.
          </p>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Timestamp (UTC)</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action Event</th>
                <th className="p-3.5">Target Manuscript</th>
                <th className="p-3.5">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3.5 text-slate-500">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-navy-950">{log.user}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-cyan-800 px-2 py-0.5 rounded font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700">{log.target}</td>
                  <td className="p-3.5 text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  );
}

