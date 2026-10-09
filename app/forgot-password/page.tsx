"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 mb-6">
        <BrandLogo size="lg" className="justify-center" />
        <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
          Reset Password
        </h2>
        <p className="text-xs text-slate-500">
          Enter your institutional email to receive a secure login link
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-6 shadow-card">
          {sent ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-navy-950">Password Link Dispatched</h3>
              <p className="text-xs text-slate-500">
                Check your inbox at <strong>{email}</strong> for instructions to access your account.
              </p>
              <Link href="/login" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Institutional Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="teal" size="md" className="w-full">
                Send Reset Link
              </Button>
              <div className="text-center text-xs text-slate-500 pt-2">
                <Link href="/login" className="text-cyan-700 hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

