"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { authService } from "@/services";
import { Role } from "@/types";
import { ShieldAlert, ArrowLeft, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requiredRole = (searchParams?.get("required") as Role) || "admin";
  const currentRole = searchParams?.get("current") || "author";

  const handleSwitchAndProceed = async (targetRole: Role) => {
    await authService.switchRole(targetRole);
    if (targetRole === "admin") router.push("/dashboard/admin");
    else if (targetRole === "editor") router.push("/dashboard/editor");
    else if (targetRole === "reviewer") router.push("/dashboard/reviewer");
    else if (targetRole === "production") router.push("/dashboard/production");
    else router.push("/dashboard/author");
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 mb-6">
        <BrandLogo size="lg" className="justify-center" />
        <Badge variant="rose" size="md" className="mx-auto">
          403 Access Forbidden • RBAC Protected
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Role Permission Required
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          This workspace is restricted under PUBLICORE scholarly editorial security policies.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-6 shadow-card border-rose-200/80">
          <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl border border-rose-200">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-rose-900">
              <p className="font-bold">Access Denied to Protected Route</p>
              <p>
                Your active session is authenticated as{" "}
                <strong className="capitalize underline">{currentRole}</strong>, but this module requires{" "}
                <strong className="capitalize underline">{requiredRole}</strong> governance privileges.
              </p>
            </div>
          </div>

          {/* Quick RBAC Simulator for Phase 2 Evaluation */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Grant Role & Access Workspace:
            </p>
            <Button
              variant="teal"
              size="md"
              className="w-full shadow-sm"
              onClick={() => handleSwitchAndProceed(requiredRole)}
            >
              <KeyRound className="w-4 h-4 mr-1.5" />
              Switch Session to {requiredRole.toUpperCase()} & Enter
            </Button>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <Link
              href="/dashboard/author"
              className="text-cyan-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to My Dashboard
            </Link>
            <Link href="/login" className="text-slate-500 hover:text-slate-800">
              Sign In with Another Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading security permissions...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}
