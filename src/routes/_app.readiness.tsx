import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { Sparkles, CheckCircle2, AlertTriangle, TrendingUp, BookOpen, Target } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/_app/readiness")({ component: ReadinessPage });

const SKILLS = [
  { skill: "React", required: 4, current: 5 },
  { skill: "TypeScript", required: 4, current: 4 },
  { skill: "System Design", required: 4, current: 3 },
  { skill: "Mentoring", required: 3, current: 4 },
  { skill: "Accessibility", required: 3, current: 4 },
  { skill: "Performance", required: 3, current: 4 },
  { skill: "Stakeholder Mgmt", required: 4, current: 3 },
];

const PILLARS = [
  { name: "Technical Excellence", score: 88, weight: "25%" },
  { name: "Project Delivery", score: 92, weight: "25%" },
  { name: "Mentoring & Leadership", score: 84, weight: "20%" },
  { name: "Innovation", score: 71, weight: "15%" },
  { name: "Stakeholder Impact", score: 68, weight: "15%" },
];

const RECOMMENDATIONS = [
  { skill: "System Design", course: "Distributed Systems Bootcamp", provider: "Internal Academy", hours: 24 },
  { skill: "Stakeholder Mgmt", course: "Executive Communication Lab", provider: "LUMS Executive Ed.", hours: 12 },
  { skill: "Innovation", course: "Product Discovery Sprint", provider: "Lovable Academy", hours: 8 },
];

function ReadinessPage() {
  const { user } = useAuth();
  if (!user) return null;

  const overall = Math.round(PILLARS.reduce((a, b) => a + b.score, 0) / PILLARS.length);
  const gaps = SKILLS.filter((s) => s.current < s.required);
  const strengths = SKILLS.filter((s) => s.current > s.required);

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="caption-strong text-muted-cb">Employee · AI Insights</p>
          <h1 className="display-md mt-2">Readiness Analysis</h1>
          <p className="text-body mt-2">Where you stand against Rank {user.rank + 1} requirements.</p>
        </div>
        <Button asChild><Link to="/submit">Submit new achievement</Link></Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--surface-soft)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="44" fill="none" stroke="var(--primary)" strokeWidth="8"
                strokeDasharray={`${(overall / 100) * 276} 276`} strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="display-md tabular text-primary">{overall}</div>
              <div className="text-xs text-muted-cb">/ 100</div>
            </div>
          </div>
          <Badge variant="success" className="mt-4"><CheckCircle2 className="h-3 w-3" /> Ready next cycle</Badge>
          <p className="text-sm text-body mt-3 max-w-xs">You're operating above bar in 4 of 7 competencies. Close 1–2 gap areas to lift readiness to <strong className="text-ink">90+</strong>.</p>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="title-md">Competency radar — Rank {user.rank + 1}</h3>
          <div className="h-72 mt-2">
            <ResponsiveContainer>
              <RadarChart data={SKILLS}>
                <PolarGrid stroke="var(--hairline)" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "var(--body)" }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10, fill: "var(--muted-cb)" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
                <Radar name="Required" dataKey="required" stroke="var(--muted-cb)" fill="var(--muted-soft)" fillOpacity={0.4} />
                <Radar name="Current" dataKey="current" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="title-md flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Pillar scores</h3>
          <p className="text-sm text-muted-cb mt-1">Weighted contribution to overall readiness.</p>
          <div className="space-y-4 mt-5">
            {PILLARS.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{p.name} <span className="text-muted-cb text-xs">· {p.weight}</span></span>
                  <span className="tabular font-semibold">{p.score}</span>
                </div>
                <Progress value={p.score} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="title-md flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Skill gap detail</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <BarChart data={SKILLS} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: "var(--body)" }} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: "var(--body)" }} width={110} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
                <Bar dataKey="required" fill="var(--muted-soft)" radius={[0, 6, 6, 0]} name="Required" />
                <Bar dataKey="current" fill="var(--primary)" radius={[0, 6, 6, 0]} name="Current" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {gaps.length > 0 && (
        <Card className="p-6 mt-6 border-destructive/30 bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="title-md text-destructive">Missing competencies</h3>
              <p className="text-sm text-body mt-1">You're below bar on the following skills for Rank {user.rank + 1}:</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {gaps.map((g) => (
                  <Badge key={g.skill} variant="destructive">{g.skill} · {g.current}/{g.required}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 mt-6">
        <h3 className="title-md flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Training recommendations</h3>
        <p className="text-sm text-muted-cb mt-1">AI-curated learning paths to close your top gaps.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {RECOMMENDATIONS.map((r) => (
            <Card key={r.course} className="p-5 bg-surface-soft border-hairline-soft">
              <Badge variant="outline">{r.skill}</Badge>
              <div className="title-md mt-3">{r.course}</div>
              <div className="text-xs text-muted-cb mt-1">{r.provider} · {r.hours} hrs</div>
              <Button size="sm" variant="outline" className="mt-4 w-full">Enroll</Button>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="title-md flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI coach summary</h3>
        <div className="rounded-2xl bg-surface-soft p-5 mt-3 text-sm leading-relaxed">
          You have a <strong>{overall}/100</strong> readiness score for Rank {user.rank + 1}. Your delivery and mentoring footprints are strong
          ({strengths.length} skills above bar). To convert to a confident promotion case next cycle, prioritise
          <strong> System Design</strong> (cohort architecture reviews) and <strong>Executive Stakeholder Management</strong>
          (request shadowing at quarterly business reviews). At your current trajectory, expected readiness in 6 months is <strong className="text-primary">93/100</strong>.
        </div>
      </Card>
    </div>
  );
}
