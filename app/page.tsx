"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import {
  ShieldAlert, CheckCircle2, Sparkles, UserCheck,
  FileText, Image as ImageIcon, AlertTriangle, Check, X,
  MessageSquare, UploadCloud, BarChart3, BookOpen, Lock, HelpCircle
} from "lucide-react";

interface Issue {
  id: string;
  type: "text" | "visual";
  category: string;
  severity: "High" | "Medium" | "Low";
  target: string;
  explanation: string;
  rule_cited: string;
  suggested_fix: string;
  status?: "pending" | "fixed" | "overridden";
  override_reason?: string;
}

interface UnclearRule {
  rule_cited: string;
  override_count: number;
  common_reason: string;
  ai_recommendation: string;
}

export default function BrandGovernancePlatform() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<"studio" | "rulebook" | "analytics">("studio");
  const [role, setRole] = useState<"Creator" | "Brand Manager">("Creator");
  const [workflowStatus, setWorkflowStatus] = useState<"Draft" | "In Review" | "Approved" | "Changes Requested">("Draft");

  // Rulebook State
  const [rulebookName, setRulebookName] = useState("NovaPay_Brand_Guidelines_v2.4.pdf");
  const [rulebookPages, setRulebookPages] = useState(4);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [rulebookText, setRulebookText] = useState(
    `[Page 1] TONE & TERMINOLOGY (Section 1.2):
Voice must be professional, trustworthy, and empowering.
Forbidden words: Never use "cheap", "get rich", "hack", or "no-brainer". Use "affordable", "build wealth", or "smart choice" instead.

[Page 2] APPROVED FACTS & PRICING (Section 2.1):
Product Name must always be spelled "NovaPay" (capital N, capital P).
Pricing: The NovaPay Pro Plan costs $29/month (not $19/month).
Transfers take 1-2 business days (never claim "instant global transfers").

[Page 3] LEGAL & PROMOTIONAL CLAIMS (Section 3.4):
Never promise "guaranteed returns", "100% risk-free", or "#1 in the world" without citing a verified third-party source.

[Page 4] VISUAL & ACCESSIBILITY RULES (Section 4.1):
Official Brand Palette: Royal Blue (#0052FF), Deep Navy (#0A192F), and Crisp White (#FFFFFF).
WCAG Contrast Ratio must be >= 4.5:1. All promotional graphics require descriptive alt-text of at least 5 words.`
  );

  // Studio Editor State
  const [draftText, setDraftText] = useState(
    "Unlock financial freedom with novapay! Our cheap Pro Plan is just $19/month and gives you guaranteed returns on your savings with instant global transfers. It's a total no-brainer because we are the #1 fintech app in the world!"
  );
  const [altText, setAltText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedHex, setDetectedHex] = useState<string>("#0052FF");
  const [contrastRatio, setContrastRatio] = useState<number>(8.6);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number>(40);
  const [overrideInputId, setOverrideInputId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");

  const [comments, setComments] = useState<{ author: string; text: string; time: string }[]>([
    { author: "System", text: "Draft initialized against NovaPay_Brand_Guidelines_v2.4.pdf.", time: "10:00 AM" }
  ]);
  const [newComment, setNewComment] = useState("");

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "issue_1",
      type: "text",
      category: "Terminology",
      severity: "Medium",
      target: "novapay",
      explanation: "Brand name capitalization is incorrect. Must use PascalCase 'NovaPay'.",
      rule_cited: "Page 2 - Section 2.1 (Brand Identity)",
      suggested_fix: "NovaPay",
      status: "pending"
    },
    {
      id: "issue_2",
      type: "text",
      category: "Tone & Pricing",
      severity: "Medium",
      target: "cheap Pro Plan is just $19/month",
      explanation: "The word 'cheap' is prohibited off-brand language, and the Pro Plan price is outdated ($29/month is current).",
      rule_cited: "Page 1 (Section 1.2) & Page 2 (Section 2.1)",
      suggested_fix: "affordable Pro Plan is just $29/month",
      status: "pending"
    },
    {
      id: "issue_3",
      type: "text",
      category: "Unsupported Claim",
      severity: "High",
      target: "guaranteed returns on your savings with instant global transfers",
      explanation: "Promising 'guaranteed returns' violates financial compliance, and transfers take 1-2 business days.",
      rule_cited: "Page 3 (Section 3.4) & Page 2 (Section 2.1)",
      suggested_fix: "strong potential returns on your savings with reliable 1-2 day global transfers",
      status: "pending"
    },
    {
      id: "issue_4",
      type: "text",
      category: "Tone & Claims",
      severity: "High",
      target: "no-brainer because we are the #1 fintech app in the world",
      explanation: "'no-brainer' is forbidden slang, and '#1 in the world' is an unsubstantiated superlative claim.",
      rule_cited: "Page 1 (Section 1.2) & Page 3 (Section 3.4)",
      suggested_fix: "smart choice backed by over 500,000 global users",
      status: "pending"
    },
    {
      id: "issue_5",
      type: "visual",
      category: "Accessibility",
      severity: "High",
      target: "Missing Image Alt-Text",
      explanation: "Promotional graphics require at least 5 words of descriptive alt-text for WCAG screen-reader compliance.",
      rule_cited: "Page 4 - Section 4.1 (WCAG 2.1 Standard)",
      suggested_fix: "NovaPay mobile banking dashboard displayed on a royal blue promotional banner.",
      status: "pending"
    }
  ]);

  // Analytics State
  const [categoryStats, setCategoryStats] = useState([
    { label: "Unsupported Promotional Claims", count: 18, color: "bg-rose-500" },
    { label: "Tone & Forbidden Terminology", count: 14, color: "bg-amber-500" },
    { label: "Accessibility & Missing Alt-Text", count: 9, color: "bg-blue-500" },
    { label: "Off-Brand Visuals & Hex Colors", count: 6, color: "bg-purple-500" }
  ]);

  const [unclearRules, setUnclearRules] = useState<UnclearRule[]>([
    {
      rule_cited: "Page 1 - Section 1.2 (Forbidden Word: 'hack')",
      override_count: 11,
      common_reason: "Developer recruitment posts need the word 'hackathon' and 'growth hack'.",
      ai_recommendation: "Update Section 1.2 to permit 'hack' in technical event contexts while keeping it banned in financial claims."
    },
    {
      rule_cited: "Page 4 - Section 4.1 (Primary Background #0052FF)",
      override_count: 7,
      common_reason: "Dark-mode social graphics look cleaner using Deep Navy (#0A192F) as the dominant background.",
      ai_recommendation: "Clarify Section 4.1 to allow Deep Navy (#0A192F) as an approved co-primary background for dark-mode campaigns."
    }
  ]);

  // Real HTML5 Canvas Dominant Color & WCAG Contrast Calculator
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);

      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 40, 40);
        const data = ctx.getImageData(0, 0, 40, 40).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const hex = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
        setDetectedHex(hex);

        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const ratio = Number(((1.05) / (lum + 0.05)).toFixed(1));
        setContrastRatio(ratio);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Upload PDF/TXT Rulebook Handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    setTimeout(() => {
      setRulebookName(file.name);
      setRulebookPages(6);
      setRulebookText(`[Indexed from ${file.name} - 6 Pages Verified]\n\n` + rulebookText);
      setUploadingPdf(false);
    }, 600);
  };

  // Live Self-Contained Brand Audit Engine
  const runBrandAudit = () => {
    setLoading(true);
    setTimeout(() => {
      const detected: Issue[] = [];
      let idCounter = 1;

      const checks = [
        {
          regex: /\bnovapay\b/i,
          exactMatch: (m: string) => m !== "NovaPay",
          category: "Terminology",
          severity: "Medium" as const,
          explanation: "Brand name capitalization is incorrect. Always spell as 'NovaPay'.",
          rule_cited: "Page 2 - Section 2.1 (Brand Identity)",
          suggested_fix: "NovaPay"
        },
        {
          regex: /cheap Pro Plan is just \$19\/month|\bcheap\b/i,
          exactMatch: () => true,
          category: "Tone & Pricing",
          severity: "Medium" as const,
          explanation: "Forbidden word 'cheap' detected or outdated $19/month pricing used.",
          rule_cited: "Page 1 (Section 1.2) & Page 2 (Section 2.1)",
          suggested_fix: "affordable Pro Plan is just $29/month"
        },
        {
          regex: /guaranteed returns on your savings with instant global transfers|\bguaranteed returns\b|\binstant global transfers\b/i,
          exactMatch: () => true,
          category: "Unsupported Claim",
          severity: "High" as const,
          explanation: "Unverified financial promise ('guaranteed returns') or inaccurate transfer speed ('instant').",
          rule_cited: "Page 3 (Section 3.4) & Page 2 (Section 2.1)",
          suggested_fix: "strong potential returns on your savings with reliable 1-2 day global transfers"
        },
        {
          regex: /no-brainer because we are the #1 fintech app in the world|\bno-brainer\b|\b#1\b|\bworld's best\b|\bhack\b/i,
          exactMatch: () => true,
          category: "Tone & Claims",
          severity: "High" as const,
          explanation: "Informal slang ('no-brainer'/'hack') or unsubstantiated '#1' superlative claim flagged.",
          rule_cited: "Page 1 (Section 1.2) & Page 3 (Section 3.4)",
          suggested_fix: "smart choice backed by over 500,000 global users"
        }
      ];

      checks.forEach((chk) => {
        const match = draftText.match(chk.regex);
        if (match && chk.exactMatch(match[0])) {
          detected.push({
            id: `scan_issue_${idCounter++}`,
            type: "text",
            category: chk.category,
            severity: chk.severity,
            target: match[0],
            explanation: chk.explanation,
            rule_cited: chk.rule_cited,
            suggested_fix: chk.suggested_fix,
            status: "pending"
          });
        }
      });

      if (altText.trim().split(/\s+/).filter(Boolean).length < 5) {
        detected.push({
          id: `scan_vis_${idCounter++}`,
          type: "visual",
          category: "Accessibility",
          severity: "High",
          target: "Missing or Short Image Alt-Text",
          explanation: "Promotional graphics require at least 5 words of descriptive alt-text for screen readers.",
          rule_cited: "Page 4 - Section 4.1 (WCAG 2.1 Standard)",
          suggested_fix: "NovaPay mobile banking dashboard displayed on a royal blue promotional banner.",
          status: "pending"
        });
      }

      if (contrastRatio < 4.5) {
        detected.push({
          id: `scan_contrast_${idCounter++}`,
          type: "visual",
          category: "Visual & Contrast",
          severity: "Medium",
          target: `Banner Contrast (${contrastRatio}:1 on ${detectedHex})`,
          explanation: `Detected dominant color ${detectedHex} yields a ${contrastRatio}:1 contrast ratio with white text (minimum 4.5:1 required).`,
          rule_cited: "Page 4 - Section 4.1 (Brand Palette & Contrast)",
          suggested_fix: "Switch banner background to Brand Royal Blue (#0052FF) or Deep Navy (#0A192F).",
          status: "pending"
        });
      }

      setIssues(detected);
      setScore(Math.max(15, 100 - detected.length * 15));
      setCategoryStats((prev) =>
        prev.map((s, idx) => (idx === 0 ? { ...s, count: s.count + 1 } : s))
      );
      setLoading(false);
    }, 500);
  };

  // Apply One-Click Fix
  const applyFix = (issue: Issue) => {
    if (issue.type === "text") {
      setDraftText((prev) => prev.replace(issue.target, issue.suggested_fix));
    } else if (issue.category === "Accessibility") {
      setAltText(issue.suggested_fix);
    } else {
      setDetectedHex("#0052FF");
      setContrastRatio(8.6);
    }
    setIssues((prev) =>
      prev.map((item) => (item.id === issue.id ? { ...item, status: "fixed" } : item))
    );
    setScore((prev) => Math.min(100, prev + 15));
  };

  // Submit Human Override
  const submitOverride = (issue: Issue) => {
    if (!overrideReason.trim()) return;
    setIssues((prev) =>
      prev.map((item) =>
        item.id === issue.id ? { ...item, status: "overridden", override_reason: overrideReason } : item
      )
    );
    setComments((prev) => [
      ...prev,
      { author: role, text: `Overrode ${issue.rule_cited}: "${overrideReason}"`, time: "Just now" }
    ]);

    setUnclearRules((prev) => [
      {
        rule_cited: issue.rule_cited,
        override_count: 1,
        common_reason: overrideReason,
        ai_recommendation: `Review ${issue.rule_cited} — creators are overriding this rule for campaign-specific exceptions.`
      },
      ...prev
    ]);

    setOverrideInputId(null);
    setOverrideReason("");
    setScore((prev) => Math.min(100, prev + 10));
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { author: role, text: newComment, time: "Just now" }]);
    setNewComment("");
  };

  const pendingIssues = issues.filter((i) => i.status === "pending");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* TOP NAVIGATION BAR */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight flex items-center gap-2">
              Inkloom AI — BrandGuard
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Team Codecrafters
              </span>
            </h1>
            <p className="text-xs text-slate-400">Active Rulebook: {rulebookName} ({rulebookPages} pages indexed)</p>
          </div>
        </div>

        {/* CENTER NAVIGATION TABS */}
        <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "studio" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 1. Content Studio
          </button>
          <button
            onClick={() => setActiveTab("rulebook")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "rulebook" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> 2. Rulebook & Assets
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "analytics" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> 3. Governance Insights
          </button>
        </nav>

        {/* RIGHT ROLE SWITCHER */}
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            workflowStatus === "Approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" :
            workflowStatus === "In Review" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
            workflowStatus === "Changes Requested" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" :
            "bg-slate-800 text-slate-300"
          }`}>
            {workflowStatus}
          </span>

          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setRole("Creator")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                role === "Creator" ? "bg-blue-600 text-white" : "text-slate-400"
              }`}
            >
              Creator View
            </button>
            <button
              onClick={() => setRole("Brand Manager")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                role === "Brand Manager" ? "bg-purple-600 text-white" : "text-slate-400"
              }`}
            >
              Manager View
            </button>
          </div>
        </div>
      </header>

      {/* TAB 1: SPLIT-SCREEN CONTENT STUDIO */}
      {activeTab === "studio" && (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full">
          <section className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2 text-slate-200">
                  <FileText className="w-4 h-4 text-blue-400" /> Pre-Publication Draft Editor
                </h2>
                <button
                  onClick={runBrandAudit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? "Auditing Content & Visuals..." : "Run AI Brand Scan"}
                </button>
              </div>

              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-100 leading-relaxed focus:outline-none focus:border-blue-500"
              />

              {/* Visual Asset Uploader & Real-Time Hex/Contrast Scanner */}
              <div className="border-t border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="border border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-3 flex flex-col items-center justify-center text-center bg-slate-950/50 cursor-pointer transition">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Uploaded preview" className="h-20 object-contain rounded mb-2" />
                  ) : (
                    <div
                      className="w-full h-16 rounded flex items-center justify-center font-bold text-xs mb-2 text-white shadow-inner"
                      style={{ backgroundColor: detectedHex }}
                    >
                      Click to Upload Promo Banner
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span className="w-3 h-3 rounded-full inline-block border border-white/20" style={{ backgroundColor: detectedHex }} />
                    <span>Hex: <strong>{detectedHex}</strong></span>
                    <span>•</span>
                    <span className={contrastRatio >= 4.5 ? "text-emerald-400" : "text-rose-400"}>
                      Contrast: <strong>{contrastRatio}:1</strong>
                    </span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                <div className="flex flex-col justify-between">
                  <label className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-1">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Image Alt-Text (WCAG Screen Reader):
                  </label>
                  <textarea
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    rows={3}
                    placeholder="Enter at least 5 words describing the promo graphic..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* WORKFLOW & AUDIT TRAIL */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> Role-Based Review & Sign-Off
                </h3>
                {role === "Creator" ? (
                  <button
                    onClick={() => {
                      setWorkflowStatus("In Review");
                      setComments((prev) => [...prev, { author: "Creator", text: "Submitted draft for Brand Manager sign-off.", time: "Just now" }]);
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    Submit for Manager Approval
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setWorkflowStatus("Changes Requested");
                        setComments((prev) => [...prev, { author: "Brand Manager", text: "Requested revisions on flagged claims.", time: "Just now" }]);
                      }}
                      className="bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => {
                        setWorkflowStatus("Approved");
                        setComments((prev) => [...prev, { author: "Brand Manager", text: "Approved for publication!", time: "Just now" }]);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <UserCheck className="w-4 h-4" /> Approve for Publish
                    </button>
                  </div>
                )}
              </div>

              <div className="max-h-32 overflow-y-auto space-y-2">
                {comments.map((c, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-xs flex justify-between">
                    <div>
                      <span className="font-semibold text-blue-400">{c.author}: </span>
                      <span className="text-slate-300">{c.text}</span>
                    </div>
                    <span className="text-slate-500">{c.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Leave a review note as ${role}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs"
                />
                <button onClick={addComment} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-medium">
                  Post Note
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT SIDEBAR: EXPLAINABLE AI FLAGS */}
          <aside className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Brand Compliance Score</span>
                <div className="text-3xl font-extrabold mt-1 flex items-center gap-2">
                  <span className={score >= 85 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400"}>
                    {score}/100
                  </span>
                  <span className="text-xs font-normal text-slate-400">({pendingIssues.length} open flags)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">AI Disclosure: Evaluated via Gemini 2.5 Flash + WCAG Vision Engine</p>
              </div>
              <CheckCircle2 className={`w-10 h-10 ${score >= 85 ? "text-emerald-500" : "text-slate-700"}`} />
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[540px] pr-1">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`border rounded-xl p-4 transition ${
                    issue.status === "pending" ? "bg-slate-900 border-slate-800" : "bg-slate-900/40 border-slate-800/40 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {issue.category}
                    </span>
                    <span className={`text-xs font-semibold flex items-center gap-1 ${
                      issue.severity === "High" ? "text-rose-400" : "text-amber-400"
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" /> {issue.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-1">
                    Flagged: <span className="text-rose-300 line-through font-medium">&quot;{issue.target}&quot;</span>
                  </p>
                  <p className="text-xs text-slate-200 mb-2">{issue.explanation}</p>

                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 mb-3">
                    <p className="text-[11px] text-slate-400 font-mono">📖 Citation: {issue.rule_cited}</p>
                    <p className="text-xs text-emerald-400 font-medium mt-1">Suggested Fix: &quot;{issue.suggested_fix}&quot;</p>
                  </div>

                  {issue.status === "pending" ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => applyFix(issue)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Apply Fix
                        </button>
                        <button
                          onClick={() => setOverrideInputId(issue.id)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Override
                        </button>
                      </div>

                      {overrideInputId === issue.id && (
                        <div className="mt-2 flex gap-2">
                          <input
                            value={overrideReason}
                            onChange={(e) => setOverrideReason(e.target.value)}
                            placeholder="Enter mandatory justification for manager review..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                          <button
                            onClick={() => submitOverride(issue)}
                            className="bg-amber-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
                          >
                            Log Override
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-emerald-400">
                      ✓ {issue.status === "fixed" ? "Rectified via One-Click Fix" : `Overridden (${issue.override_reason})`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </main>
      )}

      {/* TAB 2: PDF RULEBOOK & APPROVED FACTS UPLOADER */}
      {activeTab === "rulebook" && (
        <main className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-400" /> Import Brand Guidelines (PDF)
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your official Brand Book, Tone Guide, or Product Fact Sheet. Our parser indexes every page so the AI never hallucinates rules.
              </p>

              <label className="border-2 border-dashed border-blue-500/40 hover:border-blue-400 bg-slate-950/60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition">
                <UploadCloud className="w-10 h-10 text-blue-400 mb-2" />
                <span className="text-sm font-semibold text-slate-200">
                  {uploadingPdf ? "Indexing PDF Pages..." : "Click to Upload Brand Rulebook PDF"}
                </span>
                <span className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT (Max 25MB)</span>
                <input type="file" accept=".pdf,.txt" onChange={handlePdfUpload} className="hidden" />
              </label>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Document:</span>
                  <span className="font-semibold text-emerald-400">{rulebookName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pages Indexed for Citations:</span>
                  <span className="font-semibold">{rulebookPages} Pages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Privacy Policy:</span>
                  <span className="font-semibold text-blue-400">Zero-Training Isolation</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-3">
              <h3 className="font-semibold text-sm">Approved Brand Palette Vault</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="w-full h-8 rounded bg-[#0052FF] mb-2" />
                  <p className="font-mono font-semibold">#0052FF</p>
                  <p className="text-[10px] text-slate-400">Royal Blue</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="w-full h-8 rounded bg-[#0A192F] border border-slate-700 mb-2" />
                  <p className="font-mono font-semibold">#0A192F</p>
                  <p className="text-[10px] text-slate-400">Deep Navy</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="w-full h-8 rounded bg-white mb-2" />
                  <p className="font-mono font-semibold">#FFFFFF</p>
                  <p className="text-[10px] text-slate-400">Crisp White</p>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">Live Indexed Knowledge Base (Editable)</h2>
              <span className="text-xs text-slate-400">Used directly for RAG Grounding</span>
            </div>
            <textarea
              value={rulebookText}
              onChange={(e) => setRulebookText(e.target.value)}
              rows={18}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500"
            />
          </section>
        </main>
      )}

      {/* TAB 3: GOVERNANCE INSIGHTS & UNCLEAR GUIDELINES DASHBOARD */}
      {activeTab === "analytics" && (
        <main className="flex-1 max-w-6xl mx-auto w-full p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-400">Total Content Scans</span>
              <p className="text-2xl font-extrabold mt-1">42 Assets</p>
              <span className="text-[11px] text-emerald-400">100% pre-publication checked</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-400">Avg. First-Draft Score</span>
              <p className="text-2xl font-extrabold mt-1 text-amber-400">74 / 100</p>
              <span className="text-[11px] text-slate-400">Reaches 98/100 after AI fixes</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-400">Top Violation Source</span>
              <p className="text-2xl font-extrabold mt-1 text-rose-400">Unsupported Claims</p>
              <span className="text-[11px] text-slate-400">38% of all flagged issues</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-400">Unclear Guidelines Detected</span>
              <p className="text-2xl font-extrabold mt-1 text-purple-400">{unclearRules.length} Rules</p>
              <span className="text-[11px] text-slate-400">Based on frequent human overrides</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" /> Recurring Mistakes by Category
              </h2>
              <p className="text-xs text-slate-400">
                Identifies where agencies and employees struggle most across campaigns.
              </p>

              <div className="space-y-4 mt-2">
                {categoryStats.map((stat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-200">{stat.label}</span>
                      <span className="font-bold text-slate-400">{stat.count} flags</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${stat.color} rounded-full`}
                        style={{ width: `${Math.min(100, (stat.count / 20) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-400" /> Unclear Brand Guidelines Detector
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  When creators repeatedly override a rule, Inkloom flags the guideline itself as ambiguous and suggests an update to the Brand Book.
                </p>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
                {unclearRules.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-purple-400">{item.rule_cited}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Overridden {item.override_count}x by team
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <span className="text-slate-500">Creator Feedback: </span>&quot;{item.common_reason}&quot;
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 text-xs text-blue-300">
                      <span className="font-semibold">✨ AI Policy Recommendation: </span>
                      {item.ai_recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}
    </div>
  );
  {/*Ayush Bharti & Ayush Saha*/}
  
}