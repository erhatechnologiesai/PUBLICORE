"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { authService } from "@/services";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("elena.rostova@cambridge.ac.uk");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authService.login(email);
    setLoading(false);
    router.push("/dashboard/author");
  };

  const handleQuickDemo = async (role: "author" | "reviewer" | "editor" | "admin") => {
    setLoading(true);
    await authService.switchRole(role);
    setLoading(false);
    if (role === "author") router.push("/dashboard/author");
    else if (role === "reviewer") router.push("/dashboard/reviewer");
    else if (role === "editor") router.push("/dashboard/editor");
    else if (role === "admin") router.push("/dashboard/admin");
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 mb-6">
        <BrandLogo size="lg" className="justify-center" />
        <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
          Sign In to Scholarly Portal
        </h2>
        <p className="text-xs text-slate-500">
          Access your author dashboard, reviewer workspace, or editorial queue
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-6 shadow-card">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                <input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-cyan-500" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-cyan-700 hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="teal" size="md" className="w-full shadow-sm" isLoading={loading}>
              Sign In to Workspace
            </Button>
          </form>

          {/* Instant Role Simulation Buttons for Phase 1 Demo */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick Role Simulation (Phase 1)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo("author")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-navy-950 font-semibold text-center"
              >
                Author View
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("reviewer")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-navy-950 font-semibold text-center"
              >
                Reviewer View
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("editor")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-navy-950 font-semibold text-center"
              >
                Editor View
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-navy-950 font-semibold text-center"
              >
                Admin View
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don't have an institutional account?{" "}
            <Link href="/register" className="text-cyan-700 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

