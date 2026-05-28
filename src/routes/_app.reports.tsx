import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CASES, CYCLES } from "@/lib/mock-data";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

const byDept = ["Front-End Dev", "Back-End Dev", "SQA"].map((d) => {
  const dept = CASES.filter((c) => c.department === d);
  return { dept: d, submitted: dept.length, approved: dept.filter((c) => c.stage === "completed").length, pending: dept.filter((c) => !["completed", "rejected", "deferred"].includes(c.stage)).length };
});

const trendData = [
  { month: "Aug", submitted: 22, approved: 14 },
  { month: "Sep", submitted: 34, approved: 21 },
  { month: "Oct", submitted: 41, approved: 28 },
  { month: "Nov", submitted: 38, approved: 26 },
  { month: "Dec", submitted: 52, approved: 34 },
  { month: "Jan", submitted: CASES.length, approved: CASES.filter((c) => c.stage === "completed").length },
];

const cycleTimeData = [
  { stage: "DL", days: 3.2 },
  { stage: "LM", days: 4.5 },
  { stage: "HOD", days: 5.1 },
  { stage: "Panel", days: 6.8 },
  { stage: "Final", days: 2.9 },
  { stage: "HR", days: 1.4 },
];

const outcomeData = [
  { name: "Approved", value: 34, color: "var(--success)" },
  { name: "Rejected", value: 8, color: "var(--destructive)" },
  { name: "Deferred", value: 5, color: "var(--warning)" },
  { name: "In progress", value: 12, color: "var(--primary)" },
];

const SAVED_REPORTS = [
  { id: "RPT-01", name: "Cycle health — March 2026", type: "Operational", updated: "2 hours ago" },
  { id: "RPT-02", name: "Department equity audit", type: "DEI", updated: "Yesterday" },
  { id: "RPT-03", name: "Rank 16+ panel outcomes", type: "Executive", updated: "3 days ago" },
  { id: "RPT-04", name: "SLA breach register", type: "Compliance", updated: "1 week ago" },
];

function ReportsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="caption-strong text-muted-cb">HR Admin · Analytics</p>
          <h1 className="display-md mt-2">Reports & insights</h1>
          <p className="text-body mt-2">Cycle health, outcomes, equity, and SLA performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue={CYCLES[0].id}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>{CYCLES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline"><Download className="h-4 w-4" /> Export PDF</Button>
        </div>
      </div>

      {/* KPI band */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPI label="Submitted" value="187" delta="+12%" up />
        <KPI label="Approved" value="124" delta="+8%" up />
        <KPI label="Approval rate" value="66%" delta="−3pp" />
        <KPI label="Avg cycle time" value="24d" delta="−2d" up />
      </div>

      <Tabs defaultValue="outcomes">
        <TabsList className="bg-surface-soft p-1 rounded-full">
          {[["outcomes", "Outcomes"], ["throughput", "Throughput"], ["sla", "SLA & cycle time"], ["equity", "Equity"], ["saved", "Saved reports"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-white px-4 h-9">{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="outcomes" className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-6 lg:col-span-2">
            <h3 className="title-md">Outcomes by department</h3>
            <div className="h-80 mt-6">
              <ResponsiveContainer>
                <BarChart data={byDept}>
                  <XAxis dataKey="dept" tick={{ fontSize: 12, fill: "var(--body)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--body)" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
                  <Legend />
                  <Bar dataKey="approved" stackId="a" fill="var(--success)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pending" stackId="a" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="title-md">Decision mix</h3>
            <div className="h-80 mt-6">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={outcomeData} dataKey="value" innerRadius={55} outerRadius={95} paddingAngle={2}>
                    {outcomeData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="throughput" className="mt-6">
          <Card className="p-6">
            <h3 className="title-md">Submission & approval trend</h3>
            <div className="h-80 mt-6">
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--body)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--body)" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
                  <Legend />
                  <Area type="monotone" dataKey="submitted" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2} />
                  <Line type="monotone" dataKey="approved" stroke="var(--success)" strokeWidth={2} dot />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="title-md">Average days per stage</h3>
            <div className="h-72 mt-6">
              <ResponsiveContainer>
                <BarChart data={cycleTimeData}>
                  <XAxis dataKey="stage" tick={{ fontSize: 12, fill: "var(--body)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--body)" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
                  <Bar dataKey="days" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="title-md">SLA breaches</h3>
            <table className="w-full text-sm mt-4">
              <thead><tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb"><th className="py-2">Case</th><th className="py-2">Stage</th><th className="py-2">Days over</th></tr></thead>
              <tbody>
                {CASES.filter((c) => c.overdue).map((c) => (
                  <tr key={c.id} className="border-t border-hairline-soft">
                    <td className="py-3 font-mono">{c.id}</td>
                    <td className="py-3">{c.stage.replace(/_/g, " ")}</td>
                    <td className="py-3 tabular text-destructive">+{c.daysInStage - 5}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="equity" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="title-md">Approval rate by department</h3>
            <div className="mt-6 space-y-4">
              {byDept.map((d) => {
                const rate = d.submitted ? Math.round((d.approved / d.submitted) * 100) : 0;
                return (
                  <div key={d.dept}>
                    <div className="flex justify-between text-sm mb-1.5"><span>{d.dept}</span><span className="tabular">{rate}%</span></div>
                    <div className="h-2 rounded-full bg-surface-strong overflow-hidden"><div className="h-full bg-primary" style={{ width: `${rate || 5}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="title-md">Gender split (approved)</h3>
            <div className="h-64 mt-6">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={[{ name: "Women", value: 42, color: "var(--primary)" }, { name: "Men", value: 56, color: "var(--ink)" }, { name: "Non-binary", value: 4, color: "var(--warning)" }]} dataKey="value" innerRadius={45} outerRadius={85}>
                    <Cell fill="var(--primary)" /><Cell fill="var(--ink)" /><Cell fill="var(--warning)" />
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-soft"><tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb"><th className="px-6 py-3">ID</th><th className="px-6 py-3">Name</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Updated</th><th className="px-6 py-3"></th></tr></thead>
              <tbody>
                {SAVED_REPORTS.map((r) => (
                  <tr key={r.id} className="border-t border-hairline-soft">
                    <td className="px-6 py-4 font-mono">{r.id}</td>
                    <td className="px-6 py-4">{r.name}</td>
                    <td className="px-6 py-4"><Badge variant="muted">{r.type}</Badge></td>
                    <td className="px-6 py-4 text-muted-cb">{r.updated}</td>
                    <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></td>
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

function KPI({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <Card className="p-6">
      <div className="caption-strong text-muted-cb">{label}</div>
      <div className="tabular text-3xl mt-3">{value}</div>
      <div className={`mt-2 text-xs flex items-center gap-1 ${up ? "text-success" : "text-destructive"}`}>
        {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />} {delta} vs last cycle
      </div>
    </Card>
  );
}
