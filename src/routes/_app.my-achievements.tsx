import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ACHIEVEMENT_CATEGORIES } from "@/lib/mock-data";
import { Search, Paperclip, Plus, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/my-achievements")({ component: MyAchievementsPage });

type Status = "draft" | "submitted" | "reviewed" | "approved";

type Item = {
  id: string;
  title: string;
  category: string;
  date: string;
  impact: string;
  metrics: string;
  status: Status;
  aiScore: number;
  evidence: number;
  cycle: string;
};

const ITEMS: Item[] = [
  { id: "A-2024", title: "Re-architected design-system component library", category: "Technical Excellence", date: "2025-11-14", impact: "Reduced UI defect rate by 38% across 6 squads.", metrics: "84 components · 38% defects ↓", status: "approved", aiScore: 92, evidence: 2, cycle: "March 2026" },
  { id: "A-2023", title: "Front-end guild lead — 12-week React curriculum", category: "Mentoring & Leadership", date: "2025-09-02", impact: "9 mentees promoted; engineering NPS +31 pts.", metrics: "18 mentees · 24 RFCs · 9 promotions", status: "reviewed", aiScore: 88, evidence: 1, cycle: "March 2026" },
  { id: "A-2022", title: "Checkout funnel performance overhaul", category: "Project Delivery", date: "2025-07-21", impact: "Conversion +4.6%, +PKR 870M annualised revenue.", metrics: "LCP 3.4s → 1.6s · +4.6% conv", status: "approved", aiScore: 95, evidence: 3, cycle: "October 2025" },
  { id: "A-2021", title: "Accessibility audit & WCAG remediation", category: "Process Improvement", date: "2025-05-03", impact: "Closed 142 a11y issues across 8 surfaces.", metrics: "142 issues · WCAG 2.2 AA", status: "submitted", aiScore: 79, evidence: 2, cycle: "March 2026" },
  { id: "A-2020", title: "Build pipeline migration to Turbo", category: "Innovation", date: "2025-03-19", impact: "CI time cut from 14m to 4m.", metrics: "14m → 4m · −71%", status: "approved", aiScore: 84, evidence: 1, cycle: "October 2025" },
  { id: "A-2019", title: "On-call runbook overhaul", category: "Customer Impact", date: "2025-02-11", impact: "MTTR down 46% over the quarter.", metrics: "MTTR −46% · P1s −3", status: "draft", aiScore: 0, evidence: 0, cycle: "March 2026" },
];

const STATUS_META: Record<Status, { label: string; variant: "secondary" | "default" | "outline" | "success" }> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "default" },
  reviewed: { label: "Under review", variant: "outline" },
  approved: { label: "Approved", variant: "success" },
};

function MyAchievementsPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<string>("all");

  const filtered = ITEMS.filter((i) => {
    if (q && !`${i.title} ${i.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (tab !== "all" && i.status !== tab) return false;
    return true;
  });

  const stats = {
    total: ITEMS.length,
    approved: ITEMS.filter((i) => i.status === "approved").length,
    avgScore: Math.round(ITEMS.filter((i) => i.aiScore > 0).reduce((a, b) => a + b.aiScore, 0) / ITEMS.filter((i) => i.aiScore > 0).length),
    categories: new Set(ITEMS.map((i) => i.category)).size,
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="caption-strong text-muted-cb">Employee</p>
          <h1 className="display-md mt-2">My Achievements</h1>
          <p className="text-body mt-2">Track every achievement you've logged across promotion cycles.</p>
        </div>
        <Button asChild><Link to="/submit"><Plus className="h-4 w-4" /> New achievement</Link></Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="caption-strong text-muted-cb">Total logged</div><div className="display-sm tabular mt-2">{stats.total}</div></Card>
        <Card className="p-5"><div className="caption-strong text-muted-cb">Approved</div><div className="display-sm tabular mt-2 text-success">{stats.approved}</div></Card>
        <Card className="p-5"><div className="caption-strong text-muted-cb">Avg AI score</div><div className="display-sm tabular mt-2 text-primary">{stats.avgScore}</div></Card>
        <Card className="p-5"><div className="caption-strong text-muted-cb">Categories covered</div><div className="display-sm tabular mt-2">{stats.categories} / {ACHIEVEMENT_CATEGORIES.length}</div></Card>
      </div>

      <Card className="p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-cb" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or category…" className="pl-9 h-10" />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-surface-soft rounded-full p-1">
            {(["all","draft","submitted","reviewed","approved"] as const).map((t) => (
              <TabsTrigger key={t} value={t} className="rounded-full px-4 h-8 data-[state=active]:bg-ink data-[state=active]:text-white capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      <Tabs value={tab}>
        <TabsContent value={tab} forceMount className="space-y-4">
          {filtered.map((i) => {
            const meta = STATUS_META[i.status];
            return (
              <Card key={i.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="default">{i.category}</Badge>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <span className="text-xs text-muted-cb">{i.date} · {i.cycle}</span>
                    </div>
                    <h4 className="title-md">{i.title}</h4>
                    <p className="text-sm text-body mt-2">{i.impact}</p>
                    <div className="text-xs font-mono text-primary mt-2">{i.metrics}</div>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-cb">
                      <span className="flex items-center gap-1"><Paperclip className="h-3 w-3" />{i.evidence} evidence file{i.evidence !== 1 ? "s" : ""}</span>
                      <span className="font-mono">{i.id}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] uppercase tracking-wide text-muted-cb flex items-center gap-1 justify-end"><Sparkles className="h-3 w-3" /> AI score</div>
                    <div className="tabular text-3xl text-primary mt-1">{i.aiScore || "—"}</div>
                    <Button variant="outline" size="sm" className="mt-3">View detail</Button>
                  </div>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <Card className="p-16 text-center text-muted-cb">
              <TrendingUp className="h-8 w-8 mx-auto text-muted-cb" />
              <p className="mt-3">No achievements match the current view.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
