import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CASES } from "@/lib/mock-data";
import { Search, CheckCircle2, XCircle, AlertTriangle, Play, Filter, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/eligibility")({ component: EligibilityPage });

type Rule = { id: string; label: string; desc: string; enabled: boolean; threshold?: string };

const DEFAULT_RULES: Rule[] = [
  { id: "tenure", label: "Minimum tenure in current rank", desc: "Employee must have spent at least N years at current rank.", enabled: true, threshold: "2 years" },
  { id: "perf", label: "Performance rating threshold", desc: "Average rating must be ≥ threshold for last 2 cycles.", enabled: true, threshold: "≥ 3.5 / 5" },
  { id: "lastprom", label: "Cool-down after last promotion", desc: "Employee promoted within window is ineligible.", enabled: true, threshold: "18 months" },
  { id: "pip", label: "No active PIP", desc: "Employees on a Performance Improvement Plan are excluded.", enabled: true },
  { id: "attend", label: "Attendance threshold", desc: "Minimum present days in the appraisal year.", enabled: true, threshold: "≥ 92%" },
  { id: "training", label: "Required certifications", desc: "Role-mandated certifications must be valid.", enabled: false },
  { id: "selfnom", label: "Self-nomination allowed", desc: "Employees may self-nominate without manager push.", enabled: true },
];

// Mock evaluation against CASES roster
function evaluate(rules: Rule[]) {
  return CASES.map((c, i) => {
    const seed = (c.id.charCodeAt(3) + i) % 7;
    const tenureOk = rules.find((r) => r.id === "tenure")!.enabled ? seed !== 1 : true;
    const perfOk = rules.find((r) => r.id === "perf")!.enabled ? seed !== 2 : true;
    const coolOk = rules.find((r) => r.id === "lastprom")!.enabled ? seed !== 3 : true;
    const pipOk = rules.find((r) => r.id === "pip")!.enabled ? seed !== 4 : true;
    const attOk = rules.find((r) => r.id === "attend")!.enabled ? seed !== 5 : true;
    const reasons: string[] = [];
    if (!tenureOk) reasons.push("Tenure < 2y");
    if (!perfOk) reasons.push("Rating < 3.5");
    if (!coolOk) reasons.push("Promoted < 18mo");
    if (!pipOk) reasons.push("Active PIP");
    if (!attOk) reasons.push("Attendance 88%");
    const status: "eligible" | "borderline" | "ineligible" =
      reasons.length === 0 ? "eligible" : reasons.length === 1 ? "borderline" : "ineligible";
    return { ...c, status, reasons };
  });
}

function EligibilityPage() {
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES);
  const [q, setQ] = useState("");
  const [ran, setRan] = useState(true);

  const results = useMemo(() => evaluate(rules), [rules]);
  const filtered = results.filter((r) =>
    !q || `${r.id} ${r.employeeName} ${r.department}`.toLowerCase().includes(q.toLowerCase()),
  );

  const stats = useMemo(() => {
    const e = results.filter((r) => r.status === "eligible").length;
    const b = results.filter((r) => r.status === "borderline").length;
    const i = results.filter((r) => r.status === "ineligible").length;
    return { e, b, i, total: results.length };
  }, [results]);

  const toggle = (id: string) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="caption-strong text-muted-cb">HR Admin · Engine</p>
          <h1 className="display-md mt-2">Eligibility Engine</h1>
          <p className="text-body mt-2">Configure promotion eligibility rules and preview the resulting candidate pool.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Eligible list exported")}><Download className="h-4 w-4" /> Export</Button>
          <Button onClick={() => { setRan(true); toast.success("Engine re-evaluated"); }}><Play className="h-4 w-4" /> Run engine</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total roster" value={stats.total} />
        <Stat label="Eligible" value={stats.e} tone="success" />
        <Stat label="Borderline" value={stats.b} tone="warning" />
        <Stat label="Ineligible" value={stats.i} tone="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <h3 className="title-md">Policy rules</h3>
          <p className="text-sm text-muted-cb mt-1">Toggles take effect immediately.</p>
          <div className="mt-5 space-y-4">
            {rules.map((r, idx) => (
              <div key={r.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{r.label}</div>
                    <p className="text-xs text-muted-cb mt-0.5">{r.desc}</p>
                    {r.threshold && (
                      <Input
                        defaultValue={r.threshold}
                        className="mt-2 h-8 text-xs"
                        onBlur={(e) =>
                          setRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, threshold: e.target.value } : x)))
                        }
                      />
                    )}
                  </div>
                  <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} />
                </div>
                {idx < rules.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-surface-soft p-4">
            <div className="flex justify-between text-xs mb-2"><span className="text-muted-cb">Eligibility coverage</span><span className="tabular">{Math.round((stats.e / stats.total) * 100)}%</span></div>
            <Progress value={(stats.e / stats.total) * 100} />
          </div>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-4 border-b border-hairline-soft flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <h3 className="title-md">Candidate pool</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-cb" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 h-9 w-56" />
              </div>
              <Button variant="outline" size="sm"><Filter className="h-4 w-4" /> Filter</Button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface-soft">
              <tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb">
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Reasons</th>
              </tr>
            </thead>
            <tbody>
              {ran && filtered.map((r) => (
                <tr key={r.id} className="border-t border-hairline-soft hover:bg-surface-soft transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium">{r.employeeName}</div>
                    <div className="text-xs font-mono text-muted-cb">{r.employeeId}</div>
                  </td>
                  <td className="px-5 py-3 text-body">{r.department}</td>
                  <td className="px-5 py-3 tabular">{r.currentRank} → {r.proposedRank}</td>
                  <td className="px-5 py-3">
                    {r.status === "eligible" && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Eligible</Badge>}
                    {r.status === "borderline" && <Badge variant="warning"><AlertTriangle className="h-3 w-3" /> Borderline</Badge>}
                    {r.status === "ineligible" && <Badge variant="destructive"><XCircle className="h-3 w-3" /> Ineligible</Badge>}
                  </td>
                  <td className="px-5 py-3">
                    {r.reasons.length === 0 ? (
                      <span className="text-xs text-muted-cb">All policy checks passed</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {r.reasons.map((rs) => <Badge key={rs} variant="outline" className="text-[10px]">{rs}</Badge>)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "success" | "warning" | "destructive" }) {
  const color =
    tone === "success" ? "text-success" :
    tone === "warning" ? "text-warning" :
    tone === "destructive" ? "text-destructive" : "text-ink";
  return (
    <Card className="p-5">
      <div className="caption-strong text-muted-cb">{label}</div>
      <div className={`display-sm mt-2 tabular ${color}`}>{value}</div>
    </Card>
  );
}
