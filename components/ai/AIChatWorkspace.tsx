"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { aiService } from "@/services";
import { AIChatMessage } from "@/types";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
  Sparkles,
  Send,
  BookOpen,
  Quote,
  ExternalLink,
  RotateCcw,
  Sliders,
  CheckCircle2,
  FileText,
  Search,
  HelpCircle,
} from "lucide-react";

export const AIChatWorkspace: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "init-1",
      sender: "assistant",
      timestamp: "10:00 AM",
      content: `Welcome to the **PUBLICORE AI Research Intelligence Workspace**.

I am your scholarly copilot trained across peer-reviewed publications, citation networks, and empirical datasets. You can query specific papers, dissect methodology derivations, contrast contradictory findings, or surface under-investigated research gaps.

*All responses cross-reference validated peer-reviewed source literature.*`,
      sources: [
        {
          id: "art-001",
          title: "Multimodal Latent Diffusion for High-Resolution Histopathology Synthesis",
          authors: "Dr. Elena Rostova et al.",
          year: 2026,
          doi: "10.1042/pub.2026.04189",
          excerpt:
            "Conditioned reverse diffusion reliably mirrors biological cellular architecture across 14,200 specimens.",
        },
      ],
      suggestedQuestions: [
        "What is the main contribution of Rostova et al. (2026)?",
        "Explain the mathematical formulation behind anisotropic latent diffusion",
        "What are the known limitations in spatial transcriptomic spot resolution?",
        "Compare PathoLatent-X with baseline StyleGAN3 and DDPM",
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSources, setActiveSources] = useState<any[]>(messages[0].sources || []);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setLoading(true);

    const assistantMsg = await aiService.askAssistant(text, messages);
    setMessages((prev) => [...prev, assistantMsg]);
    if (assistantMsg.sources && assistantMsg.sources.length > 0) {
      setActiveSources(assistantMsg.sources);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
      {/* =========================================================
          LEFT / CENTER: CHAT STREAM & PROMPT CONTROLS (col-span-8)
      ========================================================= */}
      <div className="flex-1 flex flex-col h-full bg-white border-r border-slate-200/80">
        {/* Workspace Sub-header */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 animate-pulse" />
            <span className="font-bold text-navy-950 uppercase tracking-wider text-[11px]">
              Scholarly Copilot Engine
            </span>
            <Badge variant="teal" size="sm">
              Model: Publicore-Scholar-v4
            </Badge>
          </div>

          <button
            onClick={() => {
              setMessages([messages[0]]);
              setActiveSources(messages[0].sources || []);
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-navy-900 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Thread</span>
          </button>
        </div>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1 px-1">
                {msg.sender === "assistant" ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-cyan-800">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    PUBLICORE AI Assistant
                  </span>
                ) : (
                  <span className="text-xs font-bold text-navy-950">
                    You (Researcher)
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {/* Message Box */}
              <div
                className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed max-w-3xl ${
                  msg.sender === "user"
                    ? "bg-navy-900 text-white shadow-sm rounded-tr-sm"
                    : "bg-[#F8FAFC] border border-slate-200/80 text-navy-950 shadow-subtle rounded-tl-sm"
                }`}
              >
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(
                        /\[Source: (.*?)\]/g,
                        '<span class="bg-cyan-100 text-cyan-900 px-1 py-0.2 rounded font-mono text-xs">Source: $1</span>'
                      ),
                  }}
                />

                {/* Inline Citations preview if available */}
                {msg.sources && msg.sources.length > 0 && msg.sender === "assistant" && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Citations:
                    </span>
                    {msg.sources.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSources([s])}
                        className="text-[10px] font-mono bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                      >
                        <Quote className="w-2.5 h-2.5" />
                        {s.authors.split(" ")[0]} et al., {s.year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Starter Question Chips */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 max-w-2xl">
                  {msg.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-xs bg-white border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 text-slate-700 px-3 py-1.5 rounded-full transition-all text-left shadow-subtle flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-600 shrink-0" />
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-cyan-600 animate-spin" />
                <span>Synthesizing cross-literature evidence & validating peer-review citations...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Composer */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask a scholarly question or prompt (e.g. 'Explain methodology', 'Find related research')..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white focus:ring-1 focus:ring-cyan-600"
            />
            <Button
              type="submit"
              variant="teal"
              size="md"
              disabled={!inputPrompt.trim() || loading}
              className="shadow-sm shrink-0"
            >
              <Send className="w-4 h-4 mr-1" />
              Ask AI
            </Button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            PUBLICORE AI syntheses are decision-support aids. Always verify findings against official peer-reviewed manuscripts.
          </p>
        </div>
      </div>

      {/* =========================================================
          RIGHT: DEDICATED SOURCES, CITATIONS & PAPERS PANE (col-span-4)
      ========================================================= */}
      <div className="w-full lg:w-96 bg-[#F8FAFC] border-t lg:border-t-0 p-5 overflow-y-auto space-y-4 text-left shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-700" />
            Verified Source Literature
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">
            {activeSources.length} Cited
          </span>
        </div>

        {activeSources.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">
            Sources will appear here as citations are referenced in the AI dialogue.
          </p>
        ) : (
          <div className="space-y-4">
            {activeSources.map((source, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle space-y-2.5"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-700">
                  <span className="font-bold">DOI: {source.doi}</span>
                  <span className="bg-cyan-50 px-1.5 py-0.5 rounded">Verified</span>
                </div>

                <h4 className="text-xs font-bold text-navy-950 leading-snug">
                  {source.title}
                </h4>

                <p className="text-[11px] text-slate-500">
                  {source.authors} ({source.year})
                </p>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 italic leading-relaxed">
                  "{source.excerpt}"
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/articles/${source.id === "art-001" ? "multimodal-latent-diffusion-pathology" : "quantum-coherence-superconducting-qubits"}`}
                    className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
                  >
                    Read Paper <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(source.doi);
                      alert(`Copied DOI: ${source.doi}`);
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-700"
                  >
                    Copy DOI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
