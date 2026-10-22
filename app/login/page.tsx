"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { authService } from "@/services";
import { User, Role } from "@/types";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  User as UserIcon,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  LogOut,
  Copy,
  HelpCircle,
  Sparkles,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "";
  const initialMode = searchParams?.get("mode") === "register" ? "register" : "login";

  // Auth Mode: "login" | "register"
  const [authMode, setAuthMode] = useState<"login" | "register">(initialMode);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Create Account Form State
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState(
    "What was the name of your first elementary or high school?"
  );
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // reCAPTCHA State
  const [isCaptchaChecking, setIsCaptchaChecking] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // Copied ID Toast
  const [copiedId, setCopiedId] = useState(false);

  // Load current session on mount
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session && session.user) {
      setCurrentUser(session.user);
    }
    setLoadingUser(false);
  }, []);

  const handleCaptchaClick = () => {
    if (isCaptchaVerified || isCaptchaChecking) return;
    setIsCaptchaChecking(true);
    setTimeout(() => {
      setIsCaptchaChecking(false);
      setIsCaptchaVerified(true);
    }, 900);
  };

  const routeUserAfterLogin = (role: Role) => {
    if (redirectTarget) {
      router.push(redirectTarget);
      return;
    }
    if (role === "author") router.push("/dashboard/author");
    else if (role === "reviewer") router.push("/dashboard/reviewer");
    else if (role === "editor") router.push("/dashboard/editor");
    else if (role === "production") router.push("/dashboard/production");
    else if (role === "admin") router.push("/dashboard/admin");
    else router.push("/dashboard/author");
  };

  // CREATE ACCOUNT SUBMIT
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    // Validations
    if (!firstName.trim()) {
      setRegError("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setRegError("Last name is required.");
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setRegError("A valid email address is required.");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError("Password must be at least 6 characters long.");
      return;
    }
    if (regPassword !== confirmPassword) {
      setRegError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!securityAnswer.trim()) {
      setRegError("Please provide an answer to your security question.");
      return;
    }
    if (!isCaptchaVerified) {
      setRegError("Please complete the reCAPTCHA verification to confirm you are human.");
      return;
    }

    setRegLoading(true);

    try {
      const res = await (authService as any).registerUser({
        firstName,
        middleName: middleName.trim() || undefined,
        lastName,
        email: regEmail,
        password: regPassword,
        securityQuestion,
        securityAnswer,
      });

      setRegLoading(false);

      if (res.success && res.user) {
        // Pre-fill Sign In form with registered email
        setSignInEmail(regEmail);
        setSignInPassword("");
        setSuccessBanner(
          `Account created successfully! Your unique User ID is ${res.user.id}. Please sign in with your email and password.`
        );
        // Switch to Sign In tab
        setAuthMode("login");

        // Clear create form
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setRegEmail("");
        setRegPassword("");
        setConfirmPassword("");
        setSecurityAnswer("");
        setIsCaptchaVerified(false);
      } else {
        setRegError(res.error || "Failed to create account. Please try again.");
      }
    } catch (err: any) {
      setRegLoading(false);
      setRegError(err?.message || "An unexpected error occurred during account registration.");
    }
  };

  // SIGN IN SUBMIT
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setSuccessBanner(null);

    if (!signInEmail.trim()) {
      setSignInError("Email address is required.");
      return;
    }
    if (!signInPassword) {
      setSignInError("Password is required.");
      return;
    }

    setSignInLoading(true);

    try {
      const res = await authService.login(signInEmail, signInPassword);
      setSignInLoading(false);

      if (res.success && res.user) {
        setCurrentUser(res.user);
        // Dispatch global auth change
        window.dispatchEvent(new CustomEvent("publicore_auth_change", { detail: { user: res.user } }));
      } else {
        setSignInError(res.error || "Invalid institutional email or password.");
      }
    } catch (err: any) {
      setSignInLoading(false);
      setSignInError("Failed to authenticate institutional credentials.");
    }
  };

  // SIGN OUT
  const handleSignOut = async () => {
    await authService.logout();
    setCurrentUser(null);
    setSuccessBanner(null);
    setSignInError(null);
    setSignInPassword("");
    setAuthMode("login");
  };

  const copyUserId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 text-left font-sans">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2 mb-6">
        <BrandLogo size="lg" className="justify-center" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Scholarly Identity & Access Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Role-Based Access Control • Verified Academic Identity • Double-Blind Review Desk
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* ================= TOP SWITCHER BUTTONS ================= */}
        {/* If user is logged in, show their Name and User ID in place of Create Account */}
        <div className="mb-4 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2">
          {currentUser ? (
            <>
              {/* Logged in state replaces the Create Account button with User Name & ID */}
              <div className="flex-1 min-w-0 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-cyan-50/80 border border-cyan-200">
                <div className="w-8 h-8 rounded-full bg-[#004e70] text-cyan-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                  {currentUser.name
                    ? currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "ID"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-navy-950 truncate">{currentUser.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-white" />
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-900 font-bold">
                    <span>ID: {currentUser.id}</span>
                    <button
                      type="button"
                      onClick={() => copyUserId(currentUser.id)}
                      className="hover:text-cyan-700"
                      title="Copy User ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {copiedId && <span className="text-[10px] text-emerald-600 font-normal">Copied!</span>}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-xs text-red-600 hover:bg-red-50 hover:border-red-200 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              {/* Not logged in: Show Create Account Button & Sign In Button */}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setSuccessBanner(null);
                  setRegError(null);
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  authMode === "register"
                    ? "bg-[#004e70] text-white shadow-2xs"
                    : "text-slate-600 hover:text-navy-950 hover:bg-slate-50"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setSignInError(null);
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  authMode === "login"
                    ? "bg-[#004e70] text-white shadow-2xs"
                    : "text-slate-600 hover:text-navy-950 hover:bg-slate-50"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </>
          )}
        </div>

        {/* ================= MAIN AUTH CARD ================= */}
        <Card className="p-6 sm:p-8 space-y-6 shadow-md border-slate-200/90 bg-white rounded-2xl">
          {/* Success Banner */}
          {successBanner && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Account Registration Successful</span>
                <p className="mt-0.5 text-emerald-900 leading-relaxed">{successBanner}</p>
              </div>
            </div>
          )}

          {/* ================= VIEW 1: USER IS ALREADY SIGNED IN ================= */}
          {currentUser ? (
            <div className="space-y-6 text-center py-2 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-cyan-50 border-2 border-cyan-200 text-cyan-800 flex items-center justify-center font-bold text-xl mx-auto shadow-inner">
                {currentUser.name
                  ? currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "U"}
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Authenticated Scholar Session Active
                </span>
                <h3 className="text-xl font-extrabold text-navy-950 mt-2">
                  Welcome, {currentUser.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
              </div>

              {/* ID Display Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Assigned Scholar ID:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyUserId(currentUser.id)}
                    className="text-cyan-800 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3 h-3" /> Copy ID
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono font-extrabold text-navy-950 text-sm flex items-center justify-between">
                  <span>{currentUser.id}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5">
                  <p>
                    <strong>Institution:</strong> {currentUser.institution}
                  </p>
                  <p>
                    <strong>Active Role:</strong> <span className="capitalize font-semibold">{currentUser.role}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Button
                  type="button"
                  size="md"
                  onClick={() => routeUserAfterLogin(currentUser.role)}
                  className="w-full bg-[#004e70] hover:bg-[#003c57] text-white font-bold shadow-xs"
                >
                  <span>Enter Workspace & Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/submit")}
                    className="flex-1 text-xs"
                  >
                    Submit Manuscript
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex-1 text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
                  >
                    Sign Out / Switch
                  </Button>
                </div>
              </div>
            </div>
          ) : authMode === "register" ? (
            /* ================= VIEW 2: CREATE ACCOUNT FORM ================= */
            <form onSubmit={handleCreateAccount} className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-navy-950">Create Scholar Account</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Register with your institutional credentials to submit and review research.
                </p>
              </div>

              {/* Error Alert */}
              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-900 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {/* First Name & Middle Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. John"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Middle Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="e.g. Robert"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="text-xs">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Smith"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                />
              </div>

              {/* Email Address */}
              <div className="text-xs">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. j.smith@university.edu"
                    required
                    className="w-full p-2.5 pl-8 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      className="w-full p-2.5 pr-8 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Security Question */}
              <div className="space-y-1 text-xs">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Security Question <span className="text-red-500">*</span>
                </label>
                <select
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-navy-950 focus:border-cyan-600 focus:outline-hidden text-xs"
                >
                  <option value="What was the name of your first elementary or high school?">
                    What was the name of your first elementary or high school?
                  </option>
                  <option value="In what city or town was your first academic institution located?">
                    In what city or town was your first academic institution located?
                  </option>
                  <option value="What is your primary scientific research discipline?">
                    What is your primary scientific research discipline?
                  </option>
                  <option value="What was the title of your first research paper or thesis?">
                    What was the title of your first research paper or thesis?
                  </option>
                  <option value="What was the model of your first computer or laptop?">
                    What was the model of your first computer or laptop?
                  </option>
                </select>
              </div>

              {/* Security Answer */}
              <div className="text-xs">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Security Answer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Enter secret answer for identity recovery"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                />
              </div>

              {/* reCAPTCHA "You are a human" Widget */}
              <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50/70 flex items-center justify-between text-xs">
                <div
                  onClick={handleCaptchaClick}
                  className="flex items-center gap-3 cursor-pointer select-none"
                >
                  <div
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                      isCaptchaVerified
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : isCaptchaChecking
                        ? "border-cyan-600 bg-white"
                        : "border-slate-400 bg-white hover:border-slate-500"
                    }`}
                  >
                    {isCaptchaChecking ? (
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-700 animate-spin" />
                    ) : isCaptchaVerified ? (
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    ) : null}
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 text-xs">
                      {isCaptchaVerified ? "Verified: You are a human" : "I'm not a robot (You are a human)"}
                    </span>
                    <p className="text-[10px] text-slate-400">Click to perform reCAPTCHA security verification</p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <ShieldCheck className="w-6 h-6 text-cyan-800" />
                  <span className="text-[9px] text-slate-400 font-mono">reCAPTCHA v3</span>
                </div>
              </div>

              {/* Submit Create Account Button */}
              <Button
                type="submit"
                size="md"
                disabled={regLoading}
                className="w-full bg-[#004e70] hover:bg-[#003c57] text-white font-bold shadow-sm"
              >
                {regLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Creating Scholar Account...
                  </span>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>

              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-cyan-700 font-bold hover:underline"
                >
                  Sign in with your email & password
                </button>
              </div>
            </form>
          ) : (
            /* ================= VIEW 3: SIGN IN FORM ================= */
            <form onSubmit={handleSignIn} className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-navy-950">Sign In to Your Workspace</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your registered institutional email and password.
                </p>
              </div>

              {/* Error Alert */}
              {signInError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-900 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              {/* Email */}
              <div className="text-xs">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. elena.rostova@cambridge.ac.uk"
                    required
                    className="w-full p-2.5 pl-8 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Password */}
              <div className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link href="/forgot-password" className="text-[11px] text-cyan-800 hover:underline font-semibold">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full p-2.5 pl-8 pr-8 rounded-xl border border-slate-300 bg-white focus:border-cyan-600 focus:outline-hidden"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showSignInPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-cyan-500" />
                  <span>Remember active session</span>
                </label>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                size="md"
                disabled={signInLoading}
                className="w-full bg-[#004e70] hover:bg-[#003c57] text-white font-bold shadow-sm"
              >
                {signInLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                  </span>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>

              {/* Quick RBAC Role Testing Section */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Demo Profiles:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Password: demo123</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSignInEmail("elena.rostova@cambridge.ac.uk");
                      setSignInPassword("demo123");
                    }}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-center text-[11px]"
                  >
                    Dr. Rostova (Author)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSignInEmail("editor@publicore.org");
                      setSignInPassword("demo123");
                    }}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-center text-[11px]"
                  >
                    Prof. Vance (Editor)
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className="text-cyan-700 font-bold hover:underline"
                >
                  Create Account here
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading authentication portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
