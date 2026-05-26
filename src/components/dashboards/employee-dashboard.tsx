import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { ArrowRight, FileText, Sparkles, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { CYCLES } from "@/lib/mock-data";

const READINESS = 64;
const MISSING = [
  "Add 1 more achievement in 'Technical Excellence'",
  "Upload evidence for high-impact achievement",
  "Rate 2 missing skills: System Design, Mentoring",
];

const ROUTE = [
  { label: "Eligible", done: true },
  { label: "Submitted", done: false, current: true },
  { label: "DL Review", done: false },
  { label: "LM Review", done: false },
  { label: "HOD", done: false },
  { label: "HR Validation", done: false },
  { label: "Letter", done: false },
];

export function EmployeeDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const cycle = CYCLES.find((c) => c.status === "active")!;
  const deadline = new Date(cycle.submissionDeadline);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const readinessColor = READINESS >= 70 ? "var(--success)" : READINESS >= 40 ? "var(--warning)" : "var(--destructive)";
  const chartData = [{ name: "readiness", value: READINESS, fill: readinessColor }];

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      {/* Profile card */}
      <Card className="p-6 mb-8 flex flex-col md:flex-row md:items-center gap-6">
        <Avatar className="h-16 w-16">
          <AvatarFallback style={{ backgroundColor: user.avatarColor, color: "white" }} className="text-xl">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="display-sm">{user.name}</h1>
            <Badge variant="success">Eligible</Badge>
          </div>
          <p className="text-body mt-1">{user.designation} · {user.department}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-2 text-sm text-muted-cb">
            <span>ID <span className="font-mono text-ink">{user.id}</span></span>
            <span>Rank <span className="tabular text-ink">{user.rank}</span> → <span className="tabular text-primary">{user.rank + 1}</span></span>
            <span>Experience <span className="tabular text-ink">7.2 yrs</span></span>
          </div>
        </div>
        <div className="text-right">
          <div className="caption-strong text-muted-cb">Submission deadline</div>
          <div className="tabular text-2xl mt-1">{daysLeft}d</div>
          <div className="text-xs text-muted-cb">{cycle.submissionDeadline}</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Readiness Meter */}
        <Card className="p-7 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="title-md">Promotion readiness</h3>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="h-48 mt-2 relative">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="75%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "var(--surface-strong)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="tabular text-5xl" style={{ color: readinessColor }}>{READINESS}%</div>
              <div className="text-xs text-muted-cb mt-1">Ready</div>
            </div>
          </div>
          <Alert className="mt-4 border-warning/40 bg-warning/5">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-sm">3 items to address</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1 text-xs">
                {MISSING.map((m) => <li key={m} className="flex gap-2"><Circle className="h-3 w-3 mt-0.5 shrink-0" />{m}</li>)}
              </ul>
            </AlertDescription>
          </Alert>
        </Card>

        {/* Promotion route stepper */}
        <Card className="p-7 lg:col-span-2">
          <h3 className="title-md">Promotion route</h3>
          <p className="text-sm text-body mt-1">Where your case sits in the workflow.</p>
          <div className="mt-8 flex items-center justify-between gap-2">
            {ROUTE.map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center text-center">
                <div className="relative w-full flex items-center justify-center">
                  {i > 0 && <div className={`absolute left-0 right-1/2 h-0.5 ${step.done || step.current ? "bg-primary" : "bg-hairline"}`} />}
                  {i < ROUTE.length - 1 && <div className={`absolute left-1/2 right-0 h-0.5 ${step.done ? "bg-primary" : "bg-hairline"}`} />}
                  <div className={`relative w-9 h-9 rounded-full flex items-center justify-center ${
                    step.done ? "bg-primary text-white" : step.current ? "bg-canvas border-2 border-primary text-primary" : "bg-surface-strong text-muted-cb"
                  }`}>
                    {step.done ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-semibold">{i + 1}</span>}
                  </div>
                </div>
                <div className={`text-[11px] mt-2 ${step.current ? "text-ink font-semibold" : "text-muted-cb"}`}>{step.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface-soft">
              <div className="caption-strong text-muted-cb">Proposed designation</div>
              <div className="title-md mt-2">Lead Engineer</div>
            </div>
            <div className="p-4 rounded-lg bg-surface-soft">
              <div className="caption-strong text-muted-cb">Cycle</div>
              <div className="title-md mt-2">{cycle.name}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Improvement suggestions + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-7 lg:col-span-2">
          <h3 className="title-md">Improvement suggestions</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              "Document the search-performance improvement project — it qualifies as high-impact.",
              "Add Accessibility (WCAG) skill — your role's career track requires it at Level 3.",
              "Request a mentoring evidence note from your tech lead.",
            ].map((t, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-md hover:bg-surface-soft">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">{i + 1}</div>
                <span className="text-ink">{t}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-7 bg-surface-dark text-on-dark border-0 flex flex-col">
          <h3 className="title-md text-on-dark">Ready to submit?</h3>
          <p className="text-sm text-on-dark-soft mt-2">Walk through achievements, skills, and a self-justification. AI will help you sharpen it.</p>
          <div className="flex-1" />
          <div className="mt-6 space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link to="/submit">Submit achievements <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline-dark" className="w-full">
              <Link to="/my-achievements"><FileText className="h-4 w-4" /> View submitted</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
