import React from "react";
import Link from "next/link";
import { BrandLogo } from "../BrandLogo";
import { Sparkles, Globe, Shield, BookOpen, Mail, ArrowRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Ecosystem Callout */}
        <div className="bg-navy-900/90 rounded-2xl p-8 mb-16 border border-navy-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5" />
              Scholarly Intelligence Dispatch
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Stay ahead with peer-reviewed breakthroughs & AI insights
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Receive weekly cross-disciplinary research syntheses, journal call-for-papers, and scientific trend alerts.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your institutional email"
              className="px-4 py-2.5 rounded-lg bg-navy-950/80 border border-navy-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 text-left w-full sm:w-72"
            />
            <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0">
              Subscribe
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-Column Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-navy-800 text-xs">
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <BrandLogo variant="light" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              PUBLICORE is an AI-native academic publishing, peer-review, and research intelligence ecosystem dedicated to accelerating open discovery while preserving human-led scientific rigor.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Global DOI Registry
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                <Shield className="w-3.5 h-3.5 text-cyan-400" /> Open Access CC-BY 4.0
              </span>
            </div>
          </div>

          {/* Research & Publications */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Publications
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/journals" className="hover:text-cyan-400 transition-colors">
                  Peer-Reviewed Journals
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-cyan-400 transition-colors">
                  Recent Articles
                </Link>
              </li>
              <li>
                <Link href="/conferences" className="hover:text-cyan-400 transition-colors">
                  Conference Proceedings
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-cyan-400 transition-colors">
                  Submit Manuscript
                </Link>
              </li>
              <li>
                <Link href="/topics" className="hover:text-cyan-400 transition-colors">
                  Research Topics
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Intelligence */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              AI Research
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/ai/assistant" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  AI Assistant
                  <span className="text-[9px] bg-cyan-900/80 text-cyan-300 px-1 rounded">PRO</span>
                </Link>
              </li>
              <li>
                <Link href="/ai/trends" className="hover:text-cyan-400 transition-colors">
                  Research Trends
                </Link>
              </li>
              <li>
                <Link href="/ai/gaps" className="hover:text-cyan-400 transition-colors">
                  Research Gaps
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-cyan-400 transition-colors">
                  Semantic Search
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-cyan-400 transition-colors">
                  AI Screening Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Governance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/communities" className="hover:text-cyan-400 transition-colors">
                  Research Societies
                </Link>
              </li>
              <li>
                <Link href="/researchers" className="hover:text-cyan-400 transition-colors">
                  Scholars Directory
                </Link>
              </li>
              <li>
                <Link href="/editorial-board" className="hover:text-cyan-400 transition-colors">
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link href="/reviewers" className="hover:text-cyan-400 transition-colors">
                  Peer Reviewers
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-cyan-400 transition-colors">
                  Research News
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional / Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Organization
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About PUBLICORE
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-cyan-400 transition-colors">
                  Careers & Fellowships
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  Editorial FAQ
                </Link>
              </li>
              <li>
                <Link href="/dashboard/author" className="hover:text-cyan-400 transition-colors">
                  Author Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PUBLICORE Foundation. All rights reserved. Peer review under COPE guidelines.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Terms of Publication
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Accessibility
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Research Ethics & AI Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
