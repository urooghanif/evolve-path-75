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
  { id: "FE", name: "Front-End Dev", hod: "Priya Sharma", strength: 64 },
  { id: "BE", name: "Back-End Dev", hod: "Lin Zhao", strength: 78 },
  { id: "SQA", name: "SQA", hod: "Aisha Khan", strength: 41 },
  { id: "DO", name: "DevOps", hod: "Hassan Rauf", strength: 22 },
];

const TEMPLATES = [
  { id: "T1", name: "Promotion approval letter", lang: "EN", updated: "2026-01-04" },
  { id: "T2", name: "Deferral notification", lang: "EN", updated: "2025-12-12" },
  { id: "T3", name: "Interview invite", lang: "EN", updated: "2025-11-30" },
];

function ConfigPage() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <p className="caption-strong text-muted-cb">HR Admin · Configuration</p>
        <h1 className="display-md mt-2">Master data & policy</h1>
        <p className="text-body mt-2">Ranks, departments, skills, eligibility rules, and letter templates.</p>
      </div>

      <Tabs defaultValue="ranks">
        <TabsList className="bg-surface-soft p-1 rounded-full">
          {[["ranks", "Ranks"], ["departments", "Departments"], ["skills", "Skills"], ["categories", "Achievement categories"], ["policy", "Eligibility policy"], ["templates", "Letter templates"]].map(([v, l]) => (
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

        <TabsContent value="departments" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEPTS.map((d) => (
            <Card key={d.id} className="p-6">
              <div className="flex justify-between"><div><Badge variant="muted" className="font-mono normal-case">{d.id}</Badge><h3 className="title-md mt-2">{d.name}</h3></div><Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button></div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-xs text-muted-cb">Head of dept</div><div className="font-semibold mt-1">{d.hod}</div></div>
                <div><div className="text-xs text-muted-cb">Strength</div><div className="tabular text-lg mt-1">{d.strength}</div></div>
              </div>
            </Card>
          ))}
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
