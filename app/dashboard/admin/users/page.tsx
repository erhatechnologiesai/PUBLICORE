"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_USERS } from "@/mock/data";
import { User, Role } from "@/types";
import { Search, UserPlus, Shield, Check, Edit2 } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.institution.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">User & Scholar Directory</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage accounts, institutional affiliations, ORCIDs, and RBAC security credentials.
            </p>
          </div>
          <Button variant="teal" size="sm" onClick={() => alert("Simulated: Invitation email dispatched.")}>
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Add Scholar
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or institution..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} Users Found</span>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Institution</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">ORCID</th>
                <th className="p-3.5">h-Index</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5">
                    <div className="font-bold text-navy-950">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </td>
                  <td className="p-3.5 text-slate-700">{u.institution}</td>
                  <td className="p-3.5">
                    <Badge variant={u.role === "admin" ? "navy" : u.role === "editor" ? "teal" : "gray"} size="sm" className="capitalize">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">{u.orcid || "—"}</td>
                  <td className="p-3.5 font-bold text-navy-950">{u.hIndex || "—"}</td>
                  <td className="p-3.5 text-right">
                    <Button variant="ghost" size="sm" onClick={() => alert(`Edit profile for ${u.name}`)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  );
}

