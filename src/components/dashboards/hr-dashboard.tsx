import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CASES, CYCLES, STAGE_COUNTS, STATUS_LABEL } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

export function HrDashboard() {
  const active = CYCLES.find((c) => c.status === "active")!;
  const stageCounts = STAGE_COUNTS();
  const stageData = Object.entries(stageCounts).map(([k, v]) => ({
    stage: STATUS_LABEL[k as keyof typeof STATUS_LABEL].replace("Pending ", ""),
    count: v,
  }));
  const overdue = CASES.filter((c) => c.overdue).length;
  const rank16 = CASES.filter((c) => c.rank16Plus).length;
  const completed = CASES.filter((c) => c.stage === "completed").length;
  const rejected = CASES.filter((c) => c.stage === "rejected").length;
  const deferred = CASES.filter((c) => c.stage === "deferred").length;

  const pieData = [
    { name: "In Progress", value: CASES.length - completed - rejected - deferred, color: "var(--primary)" },
    { name: "Completed", value: completed, color: "var(--success)" },
    { name: "Rejected", value: rejected, color: "var(--destructive)" },
    { name: "Deferred", value: deferred, color: "var(--warning)" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="caption-strong text-muted-cb">HR Admin</p>
          <h1 className="display-md mt-2">Promotion control room</h1>
          <p className="text-body mt-2">Active cycle, queues, and case health at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="muted" className="font-mono normal-case tracking-normal">{active.id}</Badge>
          <Badge variant="success">Cycle Active</Badge>
          <Button asChild>
            <Link to="/cycles">Manage cycles <ArrowUpRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>

      {/* Hero metric band */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-7 lg:col-span-2 bg-surface-dark text-on-dark border-0">
          <div className="caption-strong text-on-dark-soft">Active cycle</div>
          <div className="mt-3 display-sm text-on-dark">{active.name}</div>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div>
              <div className="text-xs uppercase tracking-wide text-on-dark-soft">Cut-off</div>
              <div className="tabular text-lg mt-1.5 text-on-dark">{active.cutoffDate}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-on-dark-soft">Submission deadline</div>
              <div className="tabular text-lg mt-1.5 text-on-dark">{active.submissionDeadline}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-on-dark-soft">Effective</div>
              <div className="tabular text-lg mt-1.5 text-on-dark">{active.effectiveDate}</div>
            </div>
          </div>
        </Card>
        <MetricCard label="Eligible employees" value={147} />
        <MetricCard label="Active cases" value={CASES.length} />
      </div>

      {/* Stage queue grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
        {[
          { l: "Submission", v: stageCounts["submitted"] || 0 },
          { l: "DL Review", v: stageCounts["dl_review"] || 0 },
          { l: "LM Review", v: stageCounts["lm_review"] || 0 },
          { l: "HOD Review", v: stageCounts["hod_review"] || 0 },
          { l: "Panel", v: stageCounts["panel_evaluation"] || 0 },
          { l: "Final Approval", v: stageCounts["final_approval"] || 0 },
          { l: "HR Validation", v: stageCounts["hr_validation"] || 0 },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <div className="text-[11px] uppercase tracking-wide text-muted-cb">{s.l}</div>
            <div className="tabular text-2xl mt-2">{s.v}</div>
          </Card>
        ))}
      </div>

      {/* Flag row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Card className="p-6 flex items-center justify-between">
          <div>
            <div className="caption-strong text-muted-cb">Overdue cases</div>
            <div className="tabular text-3xl mt-2 text-destructive">{overdue}</div>
          </div>
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </Card>
        <Card className="p-6">
          <div className="caption-strong text-muted-cb">Rank 16+ interview cases</div>
          <div className="tabular text-3xl mt-2">{rank16}</div>
          <div className="text-xs text-muted-cb mt-1">Require panel assignment</div>
        </Card>
        <Card className="p-6 flex items-center gap-6">
          <div>
            <div className="tabular text-2xl text-success">{completed}</div>
            <div className="text-xs text-muted-cb">Approved</div>
          </div>
          <div>
            <div className="tabular text-2xl text-destructive">{rejected}</div>
            <div className="text-xs text-muted-cb">Rejected</div>
          </div>
          <div>
            <div className="tabular text-2xl text-warning">{deferred}</div>
            <div className="text-xs text-muted-cb">Deferred</div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <Card className="p-6 lg:col-span-2">
          <h3 className="title-md">Case volume by stage</h3>
          <p className="text-sm text-body mt-1">Where work is sitting today.</p>
          <div className="h-72 mt-6">
            <ResponsiveContainer>
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "var(--body)" }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "var(--body)" }} allowDecimals={false} />
                <Tooltip cursor={{ fill: "var(--surface-strong)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="title-md">Status distribution</h3>
          <p className="text-sm text-body mt-1">All cases this cycle.</p>
          <div className="h-72 mt-6">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-body">{d.name}</span>
                <span className="ml-auto tabular">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent cases */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-hairline flex items-center justify-between">
          <div>
            <h3 className="title-md">Recent promotion cases</h3>
            <p className="text-sm text-body mt-1">Latest activity across the cycle.</p>
          </div>
          <Button variant="outline" size="sm">View all</Button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-soft">
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb">
              <th className="px-6 py-3">Case</th>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Dept</th>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Stage</th>
              <th className="px-6 py-3">Days</th>
              <th className="px-6 py-3">Flag</th>
            </tr>
          </thead>
          <tbody>
            {CASES.slice(0, 7).map((c) => (
              <tr key={c.id} className="border-t border-hairline-soft">
                <td className="px-6 py-4 font-mono">{c.id}</td>
                <td className="px-6 py-4">{c.employeeName}</td>
                <td className="px-6 py-4 text-body">{c.department}</td>
                <td className="px-6 py-4 tabular">{c.currentRank} → {c.proposedRank}</td>
                <td className="px-6 py-4"><StatusBadge status={c.stage} /></td>
                <td className="px-6 py-4 tabular">{c.daysInStage}</td>
                <td className="px-6 py-4">{c.overdue && <Badge variant="destructive">Overdue</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-7">
      <div className="caption-strong text-muted-cb">{label}</div>
      <div className="tabular text-4xl mt-4 text-ink">{value}</div>
    </Card>
  );
}
