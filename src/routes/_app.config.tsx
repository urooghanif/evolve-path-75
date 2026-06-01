import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SKILL_DICTIONARY, ACHIEVEMENT_CATEGORIES } from "@/lib/mock-data";
import { Plus, Pencil, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/config")({ component: ConfigPage });

const RANKS = Array.from({ length: 12 }).map((_, i) => ({
  rank: 10 + i,
  designation: ["Engineer I", "Engineer II", "Senior Engineer", "Lead Engineer", "Staff Engineer", "Senior Staff", "Engineering Manager", "Principal Engineer", "Director", "Senior Director", "VP Engineering", "SVP"][i],
  band: `B${i + 1}`,
  interview: 10 + i >= 16,
}));

const DEPTS = [
  { id: "FE", name: "Front-End Dev", hod: "Sana Malik", strength: 64, roleUpdated: true, rankUpdated: true },
  { id: "BE", name: "Back-End Dev", hod: "Nadia Qureshi", strength: 78, roleUpdated: true, rankUpdated: false },
  { id: "SQA", name: "SQA", hod: "Aisha Khan", strength: 41, roleUpdated: true, rankUpdated: true },
  { id: "DO", name: "DevOps", hod: "Hassan Rauf", strength: 22, roleUpdated: true, rankUpdated: false },
  { id: "DS", name: "Data Science", hod: "Asma Pervez", strength: 18, roleUpdated: true, rankUpdated: false },
  { id: "PM", name: "Product Mgmt", hod: "Rizwan Ali", strength: 14, roleUpdated: true, rankUpdated: true },
];

const DECLARED_RULES = [
  { id: "R-01", name: "Rank 16+ mandatory 5-member panel", scope: "Cycle-wide", status: "Active", updated: "2026-01-12" },
  { id: "R-02", name: "Minimum 18 months since last promotion", scope: "All departments", status: "Active", updated: "2025-12-04" },
  { id: "R-03", name: "Front-End: WCAG AA mandatory for Rank 14+", scope: "Front-End Dev", status: "Active", updated: "2026-01-08" },
  { id: "R-04", name: "SQA: Test automation coverage ≥70% for Rank 15+", scope: "SQA", status: "Draft", updated: "2026-01-20" },
];

const TEMPLATES = [
  { id: "T1", name: "Promotion approval letter", lang: "EN", updated: "2026-01-04" },
  { id: "T2", name: "Deferral notification", lang: "EN", updated: "2025-12-12" },
  { id: "T3", name: "Interview invite", lang: "EN", updated: "2025-11-30" },
];

// UC-014 — Job role / experience / rank mapping per career track
const CAREER_TRACKS = [
  {
    track: "SQA",
    rows: [
      { milestone: "3 years", designation: "Senior QA Engineer", rank: 14, interview: false },
      { milestone: "5 years", designation: "Lead QA Engineer", rank: 15, interview: false },
      { milestone: "7 years", designation: "QA Architect", rank: 16, interview: true },
      { milestone: "9 years", designation: "QA Manager", rank: 17, interview: true },
    ],
  },
  {
    track: "Front-End",
    rows: [
      { milestone: "3 years", designation: "Senior Software Engineer", rank: 14, interview: false },
      { milestone: "5 years", designation: "Lead Engineer", rank: 15, interview: false },
      { milestone: "7 years", designation: "Engineering Manager", rank: 16, interview: true },
      { milestone: "9 years", designation: "Principal Engineer (pending HR confirmation)", rank: 17, interview: true },
    ],
  },
  {
    track: "Back-End",
    rows: [
      { milestone: "3 years", designation: "Senior Software Engineer", rank: 14, interview: false },
      { milestone: "5 years", designation: "Lead Engineer", rank: 15, interview: false },
      { milestone: "7 years", designation: "Staff Engineer", rank: 16, interview: true },
      { milestone: "9 years", designation: "Principal Engineer (pending HR confirmation)", rank: 17, interview: true },
    ],
  },
];


function ConfigPage() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <p className="caption-strong text-muted-cb">HR Admin · Configuration</p>
        <h1 className="display-md mt-2">Master data & policy</h1>
        <p className="text-body mt-2">Ranks, departments, declared rules, skills, eligibility policy, and letter templates.</p>
      </div>

      <Tabs defaultValue="ranks">
        <TabsList className="bg-surface-soft p-1 rounded-full flex flex-wrap h-auto">
          {[["ranks", "Ranks"], ["departments", "Departments"], ["careers", "Career tracks"], ["rules", "Rule Declaration"], ["skills", "Skills"], ["categories", "Achievement categories"], ["policy", "Eligibility policy"], ["templates", "Letter templates"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-white px-4 h-9">{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="ranks" className="mt-6">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-hairline flex justify-between"><h3 className="title-md">Rank ladder</h3><Button variant="outline" size="sm"><Plus className="h-4 w-4" /> Add rank</Button></div>
            <table className="w-full text-sm">
              <thead className="bg-surface-soft"><tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb"><th className="px-6 py-3">Rank</th><th className="px-6 py-3">Default designation</th><th className="px-6 py-3">Band</th><th className="px-6 py-3">Interview required</th><th className="px-6 py-3"></th></tr></thead>
              <tbody>
                {RANKS.map((r) => (
                  <tr key={r.rank} className="border-t border-hairline-soft">
                    <td className="px-6 py-4 tabular font-semibold">R{r.rank}</td>
                    <td className="px-6 py-4">{r.designation}</td>
                    <td className="px-6 py-4 font-mono text-xs">{r.band}</td>
                    <td className="px-6 py-4">{r.interview ? <Badge variant="warning">Required</Badge> : <Badge variant="muted">Not required</Badge>}</td>
                    <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="mt-6 space-y-6">
          <Card className="p-5 border-warning/40 bg-warning/5">
            <h3 className="title-md flex items-center gap-2">⚠️ Departments — role updated, rank pending</h3>
            <p className="text-sm text-body mt-1">These departments have updated role definitions but the rank ladder hasn't been refreshed. Promotion eligibility may be inaccurate until ranks are reconciled.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {DEPTS.filter((d) => d.roleUpdated && !d.rankUpdated).map((d) => (
                <div key={d.id} className="px-3 py-2 rounded-full bg-canvas border border-warning/40 text-sm flex items-center gap-2">
                  <Badge variant="warning">Rank pending</Badge>
                  <span className="font-semibold">{d.name}</span>
                  <Button size="sm" variant="ghost" onClick={() => toast.success(`${d.name}: rank reconciliation queued`)}>Reconcile</Button>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEPTS.map((d) => (
              <Card key={d.id} className="p-6">
                <div className="flex justify-between"><div><Badge variant="muted" className="font-mono normal-case">{d.id}</Badge><h3 className="title-md mt-2">{d.name}</h3></div><Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button></div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><div className="text-xs text-muted-cb">Head of dept</div><div className="font-semibold mt-1">{d.hod}</div></div>
                  <div><div className="text-xs text-muted-cb">Strength</div><div className="tabular text-lg mt-1">{d.strength}</div></div>
                  <div><div className="text-xs text-muted-cb">Role definitions</div><div className="mt-1">{d.roleUpdated ? <Badge variant="success">Up to date</Badge> : <Badge variant="muted">Outdated</Badge>}</div></div>
                  <div><div className="text-xs text-muted-cb">Rank ladder</div><div className="mt-1">{d.rankUpdated ? <Badge variant="success">Up to date</Badge> : <Badge variant="warning">Pending</Badge>}</div></div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="mt-6">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-hairline flex justify-between items-center">
              <div>
                <h3 className="title-md">Declared promotion rules</h3>
                <p className="text-sm text-body mt-1">HR Admin-declared rules applied across cycles. Each rule is versioned and audit-logged.</p>
              </div>
              <Button onClick={() => toast.success("New rule draft created")}><Plus className="h-4 w-4" /> Declare new rule</Button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-surface-soft"><tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb"><th className="px-6 py-3">ID</th><th className="px-6 py-3">Rule</th><th className="px-6 py-3">Scope</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Updated</th><th className="px-6 py-3"></th></tr></thead>
              <tbody>
                {DECLARED_RULES.map((r) => (
                  <tr key={r.id} className="border-t border-hairline-soft">
                    <td className="px-6 py-4 font-mono">{r.id}</td>
                    <td className="px-6 py-4 font-medium">{r.name}</td>
                    <td className="px-6 py-4"><Badge variant="muted">{r.scope}</Badge></td>
                    <td className="px-6 py-4">{r.status === "Active" ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Draft</Badge>}</td>
                    <td className="px-6 py-4 text-muted-cb">{r.updated}</td>
                    <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-hairline flex justify-between"><h3 className="title-md">Skill dictionary</h3><Button variant="outline" size="sm"><Plus className="h-4 w-4" /> Add skill</Button></div>
            <table className="w-full text-sm">
              <thead className="bg-surface-soft"><tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb"><th className="px-6 py-3">Skill</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Levels</th><th className="px-6 py-3"></th></tr></thead>
              <tbody>
                {SKILL_DICTIONARY.map((s) => (
                  <tr key={s.name} className="border-t border-hairline-soft">
                    <td className="px-6 py-4 font-semibold">{s.name}</td>
                    <td className="px-6 py-4"><Badge variant="muted">{s.category}</Badge></td>
                    <td className="px-6 py-4 tabular">{s.levels}</td>
                    <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between"><h3 className="title-md">Achievement categories</h3><Button variant="outline" size="sm"><Plus className="h-4 w-4" /> Add</Button></div>
            <div className="mt-4 flex flex-wrap gap-2">
              {ACHIEVEMENT_CATEGORIES.map((c) => (
                <div key={c} className="px-4 py-2 rounded-full border border-hairline text-sm flex items-center gap-2">
                  {c} <Pencil className="h-3 w-3 text-muted-cb" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="policy" className="mt-6 space-y-4">
          <Card className="p-6">
            <h3 className="title-md mb-5">Eligibility rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><Label>Minimum tenure (years)</Label><Input type="number" defaultValue={2} className="mt-2" /></div>
              <div><Label>Minimum time since last promotion (months)</Label><Input type="number" defaultValue={18} className="mt-2" /></div>
              <div><Label>Minimum performance rating</Label><Input type="number" defaultValue={3.5} step={0.1} className="mt-2" /></div>
              <div><Label>Minimum achievements (cycle)</Label><Input type="number" defaultValue={3} className="mt-2" /></div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              {[
                ["Allow self-nomination", true],
                ["Require manager endorsement before submission", true],
                ["Auto-flag SLA breaches at +3 days", true],
                ["Mandatory panel for Rank 16+", true],
                ["Mask candidate names during panel review", false],
              ].map(([label, val]) => (
                <div key={label as string} className="flex items-center justify-between">
                  <div><div className="text-sm font-medium">{label}</div></div>
                  <Switch defaultChecked={val as boolean} />
                </div>
              ))}
            </div>
            <Button className="mt-6" onClick={() => toast.success("Policy saved")}><Save className="h-4 w-4" /> Save policy</Button>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-hairline flex justify-between"><h3 className="title-md">Letter templates</h3><Button variant="outline" size="sm"><Plus className="h-4 w-4" /> New template</Button></div>
            <table className="w-full text-sm">
              <thead className="bg-surface-soft"><tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb"><th className="px-6 py-3">ID</th><th className="px-6 py-3">Name</th><th className="px-6 py-3">Lang</th><th className="px-6 py-3">Updated</th><th className="px-6 py-3"></th></tr></thead>
              <tbody>
                {TEMPLATES.map((t) => (
                  <tr key={t.id} className="border-t border-hairline-soft">
                    <td className="px-6 py-4 font-mono">{t.id}</td>
                    <td className="px-6 py-4">{t.name}</td>
                    <td className="px-6 py-4"><Badge variant="muted">{t.lang}</Badge></td>
                    <td className="px-6 py-4 text-muted-cb">{t.updated}</td>
                    <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
