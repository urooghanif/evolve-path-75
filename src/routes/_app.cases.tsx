import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { listCasesForRole } from "@/lib/case-details";
import { STATUS_LABEL, type CaseStatus } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { Search, Download, ArrowUpRight, AlertTriangle, Filter } from "lucide-react";
import { ROLE_LABELS } from "@/lib/roles";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/cases")({ component: CasesPage });

function CasesPage() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<string>("all");
  const [dept, setDept] = useState<string>("all");

  const cases = useMemo(() => (user ? listCasesForRole(user.role) : []), [user]);
  const departments = useMemo(() => Array.from(new Set(cases.map((c) => c.department))), [cases]);

  const filtered = cases.filter((c) => {
    if (q && !`${c.id} ${c.employeeName} ${c.proposedDesignation}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (stage !== "all" && c.stage !== stage) return false;
    if (dept !== "all" && c.department !== dept) return false;
    return true;
  });

  if (!user) return null;
  const titleByRole: Record<string, string> = {
    hr_admin: "All promotion cases",
    delivery_lead: "Cases awaiting your delivery review",
    line_manager: "Cases awaiting your manager review",
    hod: "Department promotion cases",
    panel_member: "Cases assigned for interview",
    final_authority: "Cases awaiting final approval",
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="caption-strong text-muted-cb">{ROLE_LABELS[user.role]}</p>
          <h1 className="display-md mt-2">{titleByRole[user.role] || "Promotion cases"}</h1>
          <p className="text-body mt-2">{filtered.length} of {cases.length} cases</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {
            const header = "Case,Employee,Department,Rank,Designation,Stage,Days\n";
            const rows = filtered.map((c) => `${c.id},${c.employeeName},${c.department},${c.currentRank}->${c.proposedRank},${c.proposedDesignation},${c.stage},${c.daysInStage}`).join("\n");
            const blob = new Blob([header + rows], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `cases-${Date.now()}.csv`; a.click();
            URL.revokeObjectURL(url);
            toast.success(`Exported ${filtered.length} cases to CSV`);
          }}><Download className="h-4 w-4" /> Export CSV</Button>
          {user.role === "hr_admin" && <Button onClick={() => toast.info("Bulk reassign opened — pick a target reviewer.")}>Bulk reassign</Button>}
        </div>
      </div>

      <Card className="p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-cb" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search case ID, employee, designation..." className="pl-9 h-10" />
        </div>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-full md:w-56 h-10"><Filter className="h-4 w-4" /><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {(Object.keys(STATUS_LABEL) as CaseStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger className="w-full md:w-56 h-10"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft">
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb">
              <th className="px-6 py-3">Case</th>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Proposed designation</th>
              <th className="px-6 py-3">Stage</th>
              <th className="px-6 py-3 text-right">Days</th>
              <th className="px-6 py-3">Flags</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-hairline-soft hover:bg-surface-soft transition-colors">
                <td className="px-6 py-4 font-mono">{c.id}</td>
                <td className="px-6 py-4 font-medium">{c.employeeName}</td>
                <td className="px-6 py-4 text-body">{c.department}</td>
                <td className="px-6 py-4 tabular">{c.currentRank} → {c.proposedRank}</td>
                <td className="px-6 py-4 text-body">{c.proposedDesignation}</td>
                <td className="px-6 py-4"><StatusBadge status={c.stage} /></td>
                <td className="px-6 py-4 tabular text-right">{c.daysInStage}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5">
                    {c.overdue && <Badge variant="destructive"><AlertTriangle className="h-3 w-3" /> Overdue</Badge>}
                    {c.rank16Plus && <Badge variant="outline">Rank 16+</Badge>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/cases/$caseId" params={{ caseId: c.id }}>Open <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-6 py-16 text-center text-muted-cb">No cases match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
