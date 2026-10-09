"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { authService } from "@/services";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [orcid, setOrcid] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authService.register({ name, email, institution, orcid });
    setLoading(false);
    router.push("/dashboard/author");
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 mb-6">
        <BrandLogo size="lg" className="justify-center" />
        <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
          Create Scholar Account
        </h2>
        <p className="text-xs text-slate-500">
          Join the PUBLICORE ecosystem to submit, review, and discover research
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-6 shadow-card">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name & Academic Title"
              placeholder="e.g. Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Institutional Email"
              type="email"
              placeholder="j.smith@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Primary Academic Affiliation"
              placeholder="e.g. University of Oxford"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
            />
            <Input
              label="ORCID iD (Optional)"
              placeholder="0000-0002-XXXX-XXXX"
              value={orcid}
              onChange={(e) => setOrcid(e.target.value)}
            />

            <Button type="submit" variant="teal" size="md" className="w-full shadow-sm" isLoading={loading}>
              Create Scholar Profile
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already registered?{" "}
            <Link href="/login" className="text-cyan-700 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

