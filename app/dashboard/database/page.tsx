"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { firebaseService, FirebaseSyncResult } from "@/services/firebaseService";
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Copy,
  Check,
  Server,
  Layers,
  Flame,
  ShieldCheck,
  FileText,
  Users,
  BookOpen,
} from "lucide-react";

export default function FirebaseDatabasePage() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<FirebaseSyncResult | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  useEffect(() => {
    setIsConfigured(firebaseService.isConfigured());
  }, []);

  const handleSeedFirebase = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    const res = await firebaseService.seedFirestore();
    setSyncResult(res);
    setIsSyncing(false);
  };

  const sampleEnvConfig = `# PUBLICORE Phase-3 Firebase Configuration (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyYourActualApiKeyHere"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnvConfig);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                Phase 3 Cloud Database
              </span>
              <Badge variant={isConfigured ? "green" : "amber"} className="gap-1 text-[11px] font-semibold">
                {isConfigured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Firebase Live Connected
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" /> Standby (Ready for Credentials)
                  </>
                )}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
              Google Firebase & Firestore Control Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              NoSQL real-time document collections, binary PDF bucket storage, and role-based security rules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleSeedFirebase}
              disabled={isSyncing}
              size="sm"
              className="gap-2 text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
            >
              {isSyncing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Syncing to Firestore...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Seed / Sync to Firestore
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncResult && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              syncResult.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {syncResult.success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Firestore Sync Successful!
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Sync Notice:
                </>
              )}
            </div>
            {syncResult.success ? (
              <p className="mt-1">
                Synced {syncResult.usersCount} users, {syncResult.journalsCount} journals,{" "}
                {syncResult.manuscriptsCount} manuscripts, and {syncResult.articlesCount} published articles into Firestore collections.
              </p>
            ) : (
              <p className="mt-1">
                {syncResult.error} Add your Firebase API credentials into{" "}
                <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">.env.local</code> to enable direct cloud writing.
              </p>
            )}
          </div>
        )}

        {/* 4 Core Collection Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Users Collection</span>
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-navy-950">5 Documents</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Authors, Reviewers, Editors, Admins</p>
          </Card>

          <Card className="p-4 sm:p-5 border-l-4 border-l-purple-500 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Journals Registry</span>
              <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                <BookOpen className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-navy-950">6 Journals</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ISSN, Scope, Editorial Boards</p>
          </Card>

          <Card className="p-4 sm:p-5 border-l-4 border-l-amber-500 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Manuscripts Collection</span>
              <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-navy-950">8 Submissions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Lifecycle stages, reviews & timelines</p>
          </Card>

          <Card className="p-4 sm:p-5 border-l-4 border-l-emerald-500 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Articles Collection</span>
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <Layers className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-navy-950">4 Published</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Indexed with Crossref DOIs & XML</p>
          </Card>
        </div>

        {/* Firebase Setup Instructions & Env Helper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Step-by-Step Connection Instructions */}
          <Card className="p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-700" />
              Firebase Database Setup Steps
            </h3>
            <ol className="space-y-3 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>
                Go to the{" "}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-700 font-bold hover:underline"
                >
                  Firebase Console
                </a>{" "}
                and click <strong>"Add Project"</strong> (e.g. <code>publicore-journal</code>).
              </li>
              <li>
                In the sidebar, navigate to <strong>Build ➔ Firestore Database</strong> and click{" "}
                <strong>"Create Database"</strong> (start in Test mode or Production mode).
              </li>
              <li>
                Go to <strong>Project Settings (Gear Icon) ➔ General</strong>, scroll down to <strong>"Your apps"</strong>, and select the Web icon <code>&lt;/&gt;</code> to register your web application.
              </li>
              <li>
                Copy the <code>firebaseConfig</code> values into your project's{" "}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded font-semibold text-navy-950">
                  .env.local
                </code>{" "}
                file (use template on the right).
              </li>
              <li>
                Click the <strong>"Seed / Sync to Firestore"</strong> button above to populate your database with initial users, journals, and manuscripts!
              </li>
            </ol>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-navy-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Security Rules Included:
              </span>
              <p className="text-slate-500 mt-1">
                A production-grade <code className="font-mono text-cyan-800">firestore.rules</code> file has been generated in your project root with double-blind review protections.
              </p>
            </div>
          </Card>

          {/* Copyable .env Template Card */}
          <Card className="p-5 shadow-sm space-y-3 bg-slate-950 text-slate-100 font-mono text-xs border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                .env.local Configuration Template
              </span>
              <button
                onClick={handleCopyEnv}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans transition-colors"
              >
                {copiedEnv ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Template
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 bg-slate-900 rounded-lg overflow-x-auto text-[11px] text-emerald-400 leading-relaxed scrollbar-thin">
              {sampleEnvConfig}
            </pre>

            <p className="text-[11px] text-slate-400 font-sans pt-1">
              Paste these environment variables in your <code className="text-slate-300 font-mono">phase-2/.env.local</code> file and restart the development server (<code className="text-slate-300 font-mono">npm run dev</code>).
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
