import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Download, ShieldCheck, FileText, UserCog, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/_app/audit")({ component: AuditPage });

type EventType = "decision" | "submission" | "config" | "auth" | "security";

const EVENTS: { id: string; ts: string; actor: string; role: string; type: EventType; action: string; target: string; ip: string }[] = [
  { id: "EV-9012", ts: "2026-01-15 14:22:01", actor: "Sarah Chen", role: "Delivery Lead", type: "decision", action: "Endorsed promotion case", target: "PC-1002", ip: "10.42.1.18" },
  { id: "EV-9011", ts: "2026-01-15 13:48:55", actor: "System", role: "System", type: "security", action: "Failed login (3 attempts)", target: "u.test@co", ip: "203.81.4.21" },
  { id: "EV-9010", ts: "2026-01-15 12:01:09", actor: "Michael Torres", role: "Final Authority", type: "decision", action: "Approved promotion", target: "PC-1008", ip: "10.42.4.7" },
  { id: "EV-9009", ts: "2026-01-15 11:14:32", actor: "Priya Sharma", role: "HOD", type: "decision", action: "Deferred case for next cycle", target: "PC-1009", ip: "10.42.2.55" },
  { id: "EV-9008", ts: "2026-01-15 10:42:11", actor: "Rahul Mehta", role: "Employee", type: "submission", action: "Submitted promotion case", target: "PC-1001", ip: "10.42.7.92" },
  { id: "EV-9007", ts: "2026-01-15 09:30:00", actor: "HR Admin", role: "HR Admin", type: "config", action: "Updated eligibility policy", target: "min_tenure: 2y", ip: "10.42.1.2" },
  { id: "EV-9006", ts: "2026-01-14 18:22:43", actor: "System", role: "System", type: "security", action: "Role escalation attempt blocked", target: "u-emp-91", ip: "10.42.6.13" },
  { id: "EV-9005", ts: "2026-01-14 16:10:19", actor: "HR Admin", role: "HR Admin", type: "config", action: "Launched promotion cycle", target: "CY-2026-03", ip: "10.42.1.2" },
  { id: "EV-9004", ts: "2026-01-14 15:01:55", actor: "James Wilson", role: "Panel Member", type: "decision", action: "Submitted panel evaluation", target: "PC-1005", ip: "10.42.4.18" },
  { id: "EV-9003", ts: "2026-01-14 13:45:09", actor: "System Admin", role: "Sys Admin", type: "auth", action: "Created user account", target: "e.roberts@co", ip: "10.42.1.5" },
];

const TYPE_META: Record<EventType, { label: string; variant: "default" | "success" | "warning" | "destructive" | "muted"; icon: typeof FileText }> = {
  decision: { label: "Decision", variant: "default", icon: ShieldCheck },
  submission: { label: "Submission", variant: "muted", icon: FileText },
  config: { label: "Configuration", variant: "warning", icon: UserCog },
  auth: { label: "Auth", variant: "muted", icon: UserCog },
  security: { label: "Security", variant: "destructive", icon: AlertOctagon },
};

function AuditPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const filtered = EVENTS.filter((e) => (type === "all" || e.type === type) && (e.actor.toLowerCase().includes(q.toLowerCase()) || e.target.toLowerCase().includes(q.toLowerCase()) || e.action.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="caption-strong text-muted-cb">Compliance · Auditor</p>
          <h1 className="display-md mt-2">Audit trail</h1>
          <p className="text-body mt-2">Immutable log of every decision, configuration change, and security event.</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Events (24h)", v: 142 },
          { l: "Decisions", v: 38 },
          { l: "Config changes", v: 7 },
          { l: "Security flags", v: 2, danger: true },
        ].map((s) => (
          <Card key={s.l} className="p-5">
            <div className="caption-strong text-muted-cb">{s.l}</div>
            <div className={`tabular text-2xl mt-2 ${s.danger ? "text-destructive" : ""}`}>{s.v}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4 mb-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-cb" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, target, or action…" className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All event types</SelectItem>
            <SelectItem value="decision">Decisions</SelectItem>
            <SelectItem value="submission">Submissions</SelectItem>
            <SelectItem value="config">Configuration</SelectItem>
            <SelectItem value="auth">Auth</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft">
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb">
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Target</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const meta = TYPE_META[e.type];
              const Icon = meta.icon;
              return (
                <tr key={e.id} className="border-t border-hairline-soft hover:bg-surface-soft/40">
                  <td className="px-6 py-4 font-mono text-xs">{e.id}</td>
                  <td className="px-6 py-4 font-mono text-xs text-body">{e.ts}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback className="bg-surface-strong text-[10px]">{e.actor.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                      <div><div className="font-medium">{e.actor}</div><div className="text-[11px] text-muted-cb">{e.role}</div></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{e.action}</td>
                  <td className="px-6 py-4 font-mono text-xs">{e.target}</td>
                  <td className="px-6 py-4"><Badge variant={meta.variant}><Icon className="h-3 w-3" /> {meta.label}</Badge></td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-cb">{e.ip}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
