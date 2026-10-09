"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "Editorial Query", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="mb-8">
          <Badge variant="teal" size="sm" className="mb-2">Support & Secretariat</Badge>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Contact PUBLICORE
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Reach out to our managing editors, technical support team, or institutional licensing desks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-navy-950">Global Secretariat</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <span>PUBLICORE Global Research Foundation<br />124 Research Nexus Way, Cambridge, UK</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span>secretariat@publicore.org</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span>+44 (0) 1223 884920</span>
                </p>
              </div>
            </Card>
          </div>

          <div className="md:col-span-7">
            <Card className="p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-navy-950">Send an Editorial Inquiry</h3>

              {submitted ? (
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-950">Inquiry Transmitted</h4>
                  <p className="text-xs text-emerald-800">
                    A managing editor will review your request and reply within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Institutional Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full rounded-lg border border-slate-300 p-3 text-xs text-navy-900 focus:outline-none focus:border-cyan-600"
                    />
                  </div>
                  <Button type="submit" variant="teal" size="md">
                    <Send className="w-4 h-4 mr-1.5" /> Submit Inquiry
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

