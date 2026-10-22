"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "../BrandLogo";
import { authService } from "@/services";
import { User, Role } from "@/types";
import {
  Search,
  Bot,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Layers,
  ShieldCheck,
  Cpu,
  FileCheck2,
  Users,
  Compass,
  TrendingUp,
  Lightbulb,
  GraduationCap,
  Globe,
  FileText,
  UserCheck,
  Building2,
  HelpCircle,
  Newspaper,
  User as UserIcon,
  LogOut,
} from "lucide-react";

interface SubMenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface DropdownMenu {
  id: string;
  label: string;
  items: SubMenuItem[];
}

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const portalMenuRef = useRef<HTMLDivElement>(null);

  const rolePortals: {
    role: Role;
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }[] = [
    {
      role: "author",
      title: "Author Portal",
      description: "Submit manuscripts, track peer review & revisions",
      href: "/dashboard/author",
      icon: BookOpen,
      badge: "Author Desk",
    },
    {
      role: "reviewer",
      title: "Reviewer Portal",
      description: "Double-blind peer reviews, rubrics & evaluations",
      href: "/dashboard/reviewer",
      icon: ShieldCheck,
      badge: "Peer Review",
    },
    {
      role: "editor",
      title: "Editor Portal",
      description: "Desk triage, reviewer matching & publication decisions",
      href: "/dashboard/editor",
      icon: FileCheck2,
      badge: "Editorial Desk",
    },
    {
      role: "production",
      title: "Production Desk",
      description: "ANSI/NISO JATS XML typesetting & Crossref DOI minting",
      href: "/dashboard/production",
      icon: Cpu,
      badge: "JATS / XML",
    },
    {
      role: "admin",
      title: "Admin Portal",
      description: "Consortium telemetry, open-access funds & security",
      href: "/dashboard/admin",
      icon: Layers,
      badge: "Console",
    },
  ];

  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session && session.user) {
      setCurrentUser(session.user);
    } else {
      setCurrentUser(null);
    }

    const handleAuthChange = (e: any) => {
      setCurrentUser(e.detail?.user || null);
    };
    window.addEventListener("publicore_auth_change", handleAuthChange);
    return () => window.removeEventListener("publicore_auth_change", handleAuthChange);
  }, []);

  const handleSignOut = async () => {
    await authService.logout();
    setCurrentUser(null);
    router.push("/login");
  };

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setPortalDropdownOpen(false);
  }, [pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (portalMenuRef.current && !portalMenuRef.current.contains(event.target as Node)) {
        setPortalDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSwitch = async (role: Role) => {
    const updated = await authService.switchRole(role);
    setCurrentUser(updated);
    setUserDropdownOpen(false);
    setPortalDropdownOpen(false);
    setMobileMenuOpen(false);

    // Direct user to appropriate dashboard
    if (role === "author") router.push("/dashboard/author");
    else if (role === "reviewer") router.push("/dashboard/reviewer");
    else if (role === "editor") router.push("/dashboard/editor");
    else if (role === "production") router.push("/dashboard/production");
    else if (role === "admin") router.push("/dashboard/admin");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ").filter((p) => !p.endsWith("."));
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    return (name[0] || "U").toUpperCase();
  };

  // Structured Dropdowns
  const dropdownMenus: DropdownMenu[] = [
    {
      id: "research",
      label: "Research & AI",
      items: [
        {
          title: "Explore Research",
          description: "Discover cross-disciplinary open access preprints & papers",
          href: "/research",
          icon: Compass,
        },
        {
          title: "AI Research Assistant",
          description: "Interactive paper synthesis, QA & methodology analysis",
          href: "/ai/assistant",
          icon: Bot,
        },
        {
          title: "Research Trends",
          description: "Real-time topic momentum & 5-year growth trajectory curves",
          href: "/ai/trends",
          icon: TrendingUp,
        },
        {
          title: "Research Gaps",
          description: "AI-identified scientific blindspots & high-impact grant areas",
          href: "/ai/gaps",
          icon: Lightbulb,
        },
        {
          title: "Research Topics",
          description: "Explore taxonomy taxonomy trees and emerging discipline clusters",
          href: "/topics",
          icon: Layers,
        },
      ],
    },
    {
      id: "publications",
      label: "Publications",
      items: [
        {
          title: "All Publications",
          description: "Comprehensive catalog of peer-reviewed journals & books",
          href: "/publications",
          icon: BookOpen,
        },
        {
          title: "Academic Journals",
          description: "High-impact factor journals across STEM & social sciences",
          href: "/journals",
          icon: FileText,
        },
        {
          title: "Conferences & Symposia",
          description: "Upcoming proceedings, workshop tracks & Call for Papers (CFP)",
          href: "/conferences",
          icon: Globe,
        },
        {
          title: "Peer-Reviewed Articles",
          description: "Indexed scientific archive with full HTML reading experience",
          href: "/articles",
          icon: FileCheck2,
        },
      ],
    },
    {
      id: "communities",
      label: "Community",
      items: [
        {
          title: "Research Communities",
          description: "Special Interest Groups (SIGs) and working collaborations",
          href: "/communities",
          icon: Users,
        },
        {
          title: "Researchers Directory",
          description: "Connect with verified scholars by field and ORCID",
          href: "/researchers",
          icon: GraduationCap,
        },
        {
          title: "Authors Hub",
          description: "Submission formatting guidelines, templates & APC assistance",
          href: "/authors",
          icon: Building2,
        },
        {
          title: "Editorial Board",
          description: "Distinguished editors-in-chief, associate editors & review chairs",
          href: "/editorial-board",
          icon: UserCheck,
        },
        {
          title: "Reviewer Network",
          description: "Certified peer reviewers, COPE ethical standards & recognition",
          href: "/reviewers",
          icon: ShieldCheck,
        },
      ],
    },
  ];

  const directLinks = [
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_8px_-2px_rgba(11,26,44,0.06)] py-1.5 sm:py-2 transition-all">

        {/* Main Header Bar - Compact Sleek Sizing with Dynamic Responsive Alignment */}
        <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-5 md:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-2 sm:gap-3.5 min-h-[42px] sm:min-h-[46px]">
          {/* Left: Brand Logo (Streamlined Compact Size matching exact toolbar proportions) */}
          <div className="flex items-center shrink-0">
            <BrandLogo size="sm" />
          </div>

          {/* Center/Right: Signature Logo-Themed Responsive Navigation Pill */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4.5 2xl:gap-6 bg-gradient-to-r from-navy-950 via-[#0B1A2C] to-[#0891B2] text-white px-3.5 xl:px-5 py-1 xl:py-1.5 rounded-full shadow-[0_2px_8px_-2px_rgba(8,145,178,0.22),0_1px_3px_0_rgba(11,26,44,0.08)] border border-cyan-400/30 text-[10.5px] xl:text-[11.5px] font-bold uppercase tracking-wider transition-all my-auto shrink-0 overflow-hidden">
            <Link
              href="/about"
              className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${
                pathname === "/about" ? "text-cyan-300 font-extrabold" : "text-white/90 hover:text-cyan-200"
              }`}
            >
              About
            </Link>
            <Link
              href="/research"
              className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${
                pathname.startsWith("/research") ? "text-cyan-300 font-extrabold" : "text-white/90 hover:text-cyan-200"
              }`}
            >
              Research
            </Link>
            <Link
              href="/publications"
              className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${
                pathname.startsWith("/publications") ? "text-cyan-300 font-extrabold" : "text-white/90 hover:text-cyan-200"
              }`}
            >
              Publications
            </Link>
            <Link
              href="/communities"
              className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${
                pathname.startsWith("/communities") ? "text-cyan-300 font-extrabold" : "text-white/90 hover:text-cyan-200"
              }`}
            >
              Communities
            </Link>
            <Link
              href="/contact"
              className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${
                pathname === "/contact" ? "text-cyan-300 font-extrabold" : "text-white/90 hover:text-cyan-200"
              }`}
            >
              Contact
            </Link>
            <Link
              href="/search"
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white text-white hover:text-navy-950 flex items-center justify-center transition-all duration-200 shrink-0 group ml-0.5"
              title="Search"
            >
              <Search className="w-3 h-3 transition-transform group-hover:scale-110" />
            </Link>
          </nav>

          {/* Right: Portals, Auth Buttons & Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Dedicated Role Portals Dropdown (Author + 4 Portals: Reviewer, Editor, Production, Admin) */}
            <div ref={portalMenuRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setPortalDropdownOpen(!portalDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold rounded-xl border transition-all shadow-2xs whitespace-nowrap cursor-pointer ${
                  portalDropdownOpen
                    ? "bg-[#0B1A2C] text-cyan-300 border-[#0B1A2C] shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-800 hover:text-navy-950 border-slate-300/90 hover:border-slate-400"
                }`}
                title="Explore 5 Academic Role Portals"
                aria-expanded={portalDropdownOpen}
              >
                <Layers className={`w-3.5 h-3.5 transition-colors ${portalDropdownOpen ? "text-cyan-300" : "text-[#004e70]"}`} />
                <span className="font-bold">Portals</span>
                <span className="inline-flex px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-cyan-100/80 text-[#004e70]">
                  5
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    portalDropdownOpen ? "rotate-180 text-cyan-300" : "text-slate-400"
                  }`}
                />
              </button>

              {portalDropdownOpen && (
                <div className="absolute right-0 sm:right-auto sm:left-0 mt-2.5 w-76 sm:w-84 bg-white/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 p-3 shadow-2xl ring-1 ring-slate-900/10 z-50 animate-in fade-in-95 slide-in-from-top-2">
                  <div className="px-2.5 pb-2.5 pt-1 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-extrabold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#004e70]" /> Role Workspaces (5)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Direct access to double-blind publishing desks
                      </p>
                    </div>
                    {currentUser?.role && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {currentUser.role.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="py-2 space-y-1">
                    {rolePortals.map((portal) => {
                      const Icon = portal.icon;
                      const isActive = currentUser?.role === portal.role;
                      return (
                        <button
                          key={portal.role}
                          type="button"
                          onClick={() => handleRoleSwitch(portal.role)}
                          className={`w-full text-left p-2 rounded-xl flex items-center justify-between gap-2.5 transition-all duration-150 group cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-cyan-50 to-white text-navy-950 font-bold border border-cyan-200/90 shadow-2xs"
                              : "text-slate-700 hover:text-navy-950 hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                                isActive
                                  ? "bg-[#004e70] text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 group-hover:bg-cyan-50 group-hover:text-[#004e70]"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-navy-950 truncate">
                                  {portal.title}
                                </p>
                                <span className="text-[8.5px] font-semibold text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                                  {portal.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">
                                {portal.description}
                              </p>
                            </div>
                          </div>

                          {isActive ? (
                            <span className="shrink-0 text-[8.5px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              ACTIVE
                            </span>
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-300 group-hover:text-cyan-600 transition-colors shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 px-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>COPE & Double-blind standards</span>
                    <Link
                      href="/about"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="text-[#004e70] hover:underline font-semibold"
                    >
                      Workflow Guide →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons / User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* User ID & Name Display Pill */}
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 text-xs font-bold text-navy-950 bg-cyan-50/80 border border-cyan-200/80 hover:bg-cyan-100/70 rounded-xl transition-all font-mono shadow-2xs"
                  title="View Account Profile & User ID"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate max-w-[120px] xl:max-w-[170px]">{currentUser.name}</span>
                </Link>

                {/* Workspace Persona Dropdown */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="group flex items-center gap-1.5 sm:gap-2 p-0.5 pr-2 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50/90 shadow-2xs transition-all duration-200"
                    title="Switch Role or View Workspace"
                  >
                    <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-navy-950 via-navy-900 to-[#0E7490] text-cyan-200 flex items-center justify-center font-bold text-[10.5px] tracking-tight shadow-inner">
                      {getInitials(currentUser?.name)}
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0E7490] transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180 text-[#0E7490]" : ""
                      }`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-72 bg-gradient-to-b from-white via-slate-50/95 to-slate-100/95 backdrop-blur-xl rounded-2xl border border-white/80 p-3 shadow-2xl ring-1 ring-slate-900/5 z-50 animate-in fade-in-95">
                      <div className="px-3 pb-3 border-b border-slate-200/60">
                        <p className="text-xs font-bold text-navy-900 truncate">
                          {currentUser?.name}
                        </p>
                        {currentUser?.id && (
                          <p className="text-[10px] font-mono font-bold text-cyan-800 truncate">
                            ID: {currentUser.id}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 truncate">
                          {currentUser?.institution}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200/60 text-[#0E7490] text-[10px] font-bold capitalize">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0E7490] animate-pulse" />
                          Active Role: {currentUser?.role}
                        </div>
                      </div>

                      <div className="py-2 space-y-0.5">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Switch Workspace Role
                        </div>
                        {rolePortals.map((item) => (
                          <button
                            key={item.role}
                            onClick={() => handleRoleSwitch(item.role)}
                            className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-all duration-150 ${
                              currentUser?.role === item.role
                                ? "bg-gradient-to-r from-cyan-50 to-white text-[#0E7490] font-bold shadow-xs border border-cyan-200/60"
                                : "text-slate-700 hover:text-[#0E7490] hover:bg-white/80 hover:translate-x-0.5"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <item.icon className="w-4 h-4 text-slate-400" />
                              {item.title}
                            </span>
                            {currentUser?.role === item.role && (
                              <span className="text-[9px] bg-[#0E7490] text-white font-bold px-1.5 py-0.5 rounded-full">
                                ACTIVE
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-slate-200/60 pt-2 px-1">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50/80 rounded-xl transition-colors font-medium text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Two Buttons: Create Account & Sign In */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/login?mode=register"
                  className="hidden sm:inline-flex items-center justify-center px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-bold text-slate-700 hover:text-[#004e70] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs whitespace-nowrap"
                >
                  Create Account
                </Link>
                <Link
                  href="/login?mode=login"
                  className="inline-flex items-center justify-center px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-bold text-white bg-[#004e70] hover:bg-[#003c57] rounded-xl transition-all shadow-xs whitespace-nowrap"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Search Button (< lg screens) */}
            <Link
              href="/search"
              className="lg:hidden p-1 sm:p-1.5 text-slate-600 hover:text-navy-950 rounded-xl hover:bg-slate-100 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 sm:p-1.5 text-slate-700 hover:text-navy-950 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 w-84 max-w-[90vw] h-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <BrandLogo size="md" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="mt-4 pb-4 border-b border-slate-100">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200">
                      <p className="text-xs font-bold text-navy-950 truncate">{currentUser.name}</p>
                      <p className="text-[11px] font-mono text-cyan-800 font-bold">ID: {currentUser.id}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full text-center py-2 text-xs font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login?mode=register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-xs font-bold text-slate-800 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Create Account
                    </Link>
                    <Link
                      href="/login?mode=login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-xs font-bold text-white bg-[#004e70] hover:bg-[#003c57] rounded-xl transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Search Shortcut */}
              <div className="mt-4">
                <Link
                  href="/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 text-xs font-medium hover:border-cyan-400 transition-colors"
                >
                  <Search className="w-4 h-4 text-cyan-600" />
                  <span>Search articles, authors, journals...</span>
                </Link>
              </div>

              {/* Primary Mobile Navigation Links matching desktop pill */}
              <div className="mt-5 space-y-1">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                    pathname === "/about"
                      ? "bg-cyan-50 text-[#0891B2] font-extrabold"
                      : "text-navy-900 hover:text-[#0891B2] hover:bg-cyan-50/50"
                  }`}
                >
                  About
                </Link>
                <Link
                  href="/research"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                    pathname.startsWith("/research")
                      ? "bg-cyan-50 text-[#0891B2] font-extrabold"
                      : "text-navy-900 hover:text-[#0891B2] hover:bg-cyan-50/50"
                  }`}
                >
                  Research
                </Link>
                <Link
                  href="/publications"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                    pathname.startsWith("/publications")
                      ? "bg-cyan-50 text-[#0891B2] font-extrabold"
                      : "text-navy-900 hover:text-[#0891B2] hover:bg-cyan-50/50"
                  }`}
                >
                  Publications
                </Link>
                <Link
                  href="/communities"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                    pathname.startsWith("/communities")
                      ? "bg-cyan-50 text-[#0891B2] font-extrabold"
                      : "text-navy-900 hover:text-[#0891B2] hover:bg-cyan-50/50"
                  }`}
                >
                  Communities
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                    pathname === "/contact"
                      ? "bg-cyan-50 text-[#0891B2] font-extrabold"
                      : "text-navy-900 hover:text-[#0891B2] hover:bg-cyan-50/50"
                  }`}
                >
                  Contact
                </Link>
              </div>

              {/* Navigation Accordions for Detailed Sections */}
              <div className="mt-3 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Explore Portals
                </p>
                {dropdownMenus.map((menu) => {
                  const isExpanded = mobileSubmenu === menu.id;
                  return (
                    <div key={menu.id} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setMobileSubmenu(isExpanded ? null : menu.id)}
                        className="w-full flex items-center justify-between p-3 text-xs font-bold text-navy-900 hover:text-[#0891B2] bg-slate-50/60 hover:bg-slate-50 text-left transition-colors"
                      >
                        <span>{menu.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-180 text-[#0891B2]" : "text-slate-400"
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-2 space-y-1 bg-white border-t border-slate-100">
                          {menu.items.map((subItem) => {
                            const Icon = subItem.icon;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-slate-700 hover:text-[#0891B2] hover:bg-cyan-50/50 transition-colors"
                              >
                                <Icon className="w-4 h-4 text-cyan-600" />
                                <span>{subItem.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Role Portals (5) in Mobile Drawer */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between px-2 pb-1">
                  <p className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#004e70]" /> Role Workspaces (5)
                  </p>
                  {currentUser?.role && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-50 text-[#004e70] border border-cyan-200">
                      {currentUser.role.toUpperCase()}
                    </span>
                  )}
                </div>
                {rolePortals.map((portal) => {
                  const Icon = portal.icon;
                  const isActive = currentUser?.role === portal.role;
                  return (
                    <button
                      key={portal.role}
                      type="button"
                      onClick={() => handleRoleSwitch(portal.role)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-50 to-white text-navy-950 font-bold border border-cyan-200 shadow-2xs"
                          : "text-slate-700 hover:bg-slate-50 hover:text-navy-950 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive ? "bg-[#004e70] text-white shadow-xs" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{portal.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{portal.description}</p>
                        </div>
                      </div>
                      {isActive ? (
                        <span className="shrink-0 text-[8.5px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
                          ACTIVE
                        </span>
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Submit CTA */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-navy-950 via-navy-900 to-[#0891B2] rounded-xl shadow-sm hover:opacity-95 transition-opacity"
              >
                Submit Manuscript
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
