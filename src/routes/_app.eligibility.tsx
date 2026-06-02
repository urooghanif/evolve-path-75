import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CASES } from "@/lib/mock-data";
import {
  Search, CheckCircle2, XCircle, AlertTriangle, Play, Filter, Download,
  ShieldCheck, Briefcase, Building2, Route as RouteIcon, Milestone,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/eligibility")({ component: EligibilityPage });

// PRD-aligned deterministic eligibility rules. These are fixed, ordered,
// auditable inputs — not toggleable policy. The engine produces the same
// verdict for the same employee record on every run.
type Track = "sqa" | "frontend" | "backend";

type Candidate = {
  caseId: string;
  employeeName: string;
  employeeId: string;
  department: string;
  track: Track;
  currentRank: number;
  proposedRank: number;
  previousExperienceYears: number; // pre-joining
  orgTenureYears: number;          // at current org
  totalExperience: number;
};

const CAREER_TRACK_MAP: Record<Track, { years: number; designation: string; rank: number }[]> = {
  sqa: [
    { years: 3, designation: "QA Engineer", rank: 13 },
    { years: 5, designation: "Senior QA Engineer", rank: 14 },
    { years: 7, designation: "Lead QA Engineer", rank: 15 },
    { years: 9, designation: "QA Architect", rank: 16 },
  ],
  frontend: [
    { years: 3, designation: "Software Engineer", rank: 13 },
    { years: 5, designation: "Senior Software Engineer", rank: 14 },
    { years: 7, designation: "Lead Engineer", rank: 15 },
    { years: 9, designation: "Principal Engineer", rank: 16 },
  ],
  backend: [
    { years: 3, designation: "Software Engineer", rank: 13 },
    { years: 5, designation: "Senior Software Engineer", rank: 14 },
    { years: 7, designation: "Staff Engineer", rank: 15 },
    { years: 9, designation: "Principal Engineer", rank: 16 },
  ],
};

const MIN_ORG_TENURE_YEARS = 1; // must have completed ≥ 1y at current org to count milestone

function trackFromDept(dept: string): Track {
  const d = dept.toLowerCase();
  if (d.includes("sqa")) return "sqa";
  if (d.includes("back")) return "backend";
  return "frontend";
}

// Deterministic synthetic experience from the case ID — same input, same output.
function deriveExperience(caseId: string) {
  const seed = caseId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const prev = (seed % 6) + 1;        // 1–6 years previous experience
  const tenure = ((seed * 7) % 6) + 1; // 1–6 years org tenure
  return { prev, tenure, total: prev + tenure };
}

function buildCandidates(): Candidate[] {
  return CASES.map((c) => {
    const { prev, tenure, total } = deriveExperience(c.id);
    return {
      caseId: c.id,
      employeeName: c.employeeName,
      employeeId: c.employeeId,
      department: c.department,
      track: trackFromDept(c.department),
      currentRank: c.currentRank,
      proposedRank: c.proposedRank,
      previousExperienceYears: prev,
      orgTenureYears: tenure,
      totalExperience: total,
    };
  });
}

type Verdict = {
  status: "eligible" | "borderline" | "ineligible";
  milestone: number | null;
  targetDesignation: string | null;
  targetRank: number | null;
  reasons: string[];
  passes: string[];
};

// Deterministic evaluation — pure function of the candidate record.
function evaluateCandidate(c: Candidate): Verdict {
  const reasons: string[] = [];
  const passes: string[] = [];

  // 1. Org tenure gate
  if (c.orgTenureYears >= MIN_ORG_TENURE_YEARS) {
    passes.push(`Org tenure ${c.orgTenureYears}y ≥ ${MIN_ORG_TENURE_YEARS}y`);
  } else {
    reasons.push(`Org tenure ${c.orgTenureYears}y < ${MIN_ORG_TENURE_YEARS}y`);
  }

  // 2. Previous experience accepted (informational, used for total)
  passes.push(`Previous experience ${c.previousExperienceYears}y counted`);

  // 3. Career track milestone — highest milestone the candidate has crossed
  const ladder = CAREER_TRACK_MAP[c.track];
  const reached = [...ladder].reverse().find((m) => c.totalExperience >= m.years) ?? null;

  if (!reached) {
    reasons.push(`Total experience ${c.totalExperience}y below first milestone (3y)`);
    return { status: "ineligible", milestone: null, targetDesignation: null, targetRank: null, reasons, passes };
  }
  passes.push(`Crossed ${reached.years}y milestone → ${reached.designation}`);

  // 4. Rank alignment — proposed rank must equal milestone rank
  const rankAligned = c.proposedRank === reached.rank;
  if (rankAligned) {
    passes.push(`Proposed rank ${c.proposedRank} aligns with track ladder`);
  } else {
    reasons.push(`Proposed rank ${c.proposedRank} ≠ ladder rank ${reached.rank}`);
  }

  // 5. Current rank progression — proposed must be exactly +1
  if (c.proposedRank === c.currentRank + 1) {
    passes.push("Single-rank progression");
  } else {
    reasons.push(`Skipping ranks (${c.currentRank} → ${c.proposedRank})`);
  }

  const status: Verdict["status"] =
    reasons.length === 0 ? "eligible" : reasons.length === 1 ? "borderline" : "ineligible";

  return {
    status,
    milestone: reached.years,
    targetDesignation: reached.designation,
    targetRank: reached.rank,
    reasons,
    passes,
  };
}

function EligibilityPage() {
  const [q, setQ] = useState("");
  const [trackFilter, setTrackFilter] = useState<"all" | Track>("all");

  const candidates = useMemo(() => buildCandidates(), []);
  const results = useMemo(
    () => candidates.map((c) => ({ ...c, verdict: evaluateCandidate(c) })),
    [candidates],
  );

  const filtered = results.filter((r) => {
    if (trackFilter !== "all" && r.track !== trackFilter) return false;
    if (q && !`${r.caseId} ${r.employeeName} ${r.department}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  const stats = useMemo(() => {
    const e = results.filter((r) => r.verdict.status === "eligible").length;
    const b = results.filter((r) => r.verdict.status === "borderline").length;
    const i = results.filter((r) => r.verdict.status === "ineligible").length;
    return { e, b, i, total: results.length };
  }, [results]);

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="caption-strong text-muted-cb">HR Admin · Engine</p>
          <h1 className="display-md mt-2">Eligibility Engine</h1>
          <p className="text-body mt-2">
            Deterministic evaluation based on previous experience, current org tenure,
            career-track mapping and 3/5/7/9-year milestones.
          </p>
          <Badge variant="outline" className="mt-3 gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Deterministic — same input always yields same verdict
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Eligible list exported")}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={() => toast.success("Engine re-evaluated (idempotent run)")}>
            <Play className="h-4 w-4" /> Run engine
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total roster" value={stats.total} />
        <Stat label="Eligible" value={stats.e} tone="success" />
        <Stat label="Borderline" value={stats.b} tone="warning" />
        <Stat label="Ineligible" value={stats.i} tone="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rule reference panel */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="title-md">Deterministic rules</h3>
          <p className="text-sm text-muted-cb mt-1">
            Fixed inputs evaluated in order. Configured by HR Admin under Configuration → Career Tracks.
          </p>

          <div className="mt-5 space-y-4">
            <RuleRow icon={Briefcase} label="Previous experience" value="Counted at face value" />
            <Separator />
            <RuleRow icon={Building2} label="Current organisation tenure" value={`≥ ${MIN_ORG_TENURE_YEARS} year required`} />
            <Separator />
            <RuleRow icon={RouteIcon} label="Career track mapping" value="SQA · Front-End · Back-End" />
            <Separator />
            <RuleRow icon={Milestone} label="Experience milestones" value="3y · 5y · 7y · 9y" />
          </div>

          <div className="mt-6 rounded-xl bg-surface-soft p-4">
            <h4 className="text-xs uppercase tracking-wide text-muted-cb font-semibold">Track ladder reference</h4>
            <div className="mt-3 space-y-3 text-xs">
              {(Object.keys(CAREER_TRACK_MAP) as Track[]).map((t) => (
                <div key={t}>
                  <div className="font-semibold capitalize">{t === "sqa" ? "SQA" : t === "frontend" ? "Front-End" : "Back-End"}</div>
                  <div className="text-muted-cb mt-1 space-y-0.5">
                    {CAREER_TRACK_MAP[t].map((m) => (
                      <div key={m.years} className="flex justify-between tabular">
                        <span>{m.years}y</span>
                        <span>{m.designation}</span>
                        <span>Rank {m.rank}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-surface-soft p-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-cb">Eligibility coverage</span>
              <span className="tabular">{stats.total ? Math.round((stats.e / stats.total) * 100) : 0}%</span>
            </div>
            <Progress value={stats.total ? (stats.e / stats.total) * 100 : 0} />
          </div>
        </Card>

        {/* Candidate pool */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-4 border-b border-hairline-soft flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <h3 className="title-md">Candidate pool</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-cb" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 h-9 w-56" />
              </div>
              <div className="flex items-center gap-1 rounded-md border border-hairline p-0.5">
                {(["all", "sqa", "frontend", "backend"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrackFilter(t)}
                    className={`px-2.5 py-1 text-xs rounded ${trackFilter === t ? "bg-primary text-white" : "text-muted-cb hover:bg-surface-soft"}`}
                  >
                    {t === "all" ? "All tracks" : t === "sqa" ? "SQA" : t === "frontend" ? "Front-End" : "Back-End"}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm"><Filter className="h-4 w-4" /> Filter</Button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface-soft">
              <tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb">
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Track</th>
                <th className="px-5 py-3">Prev · Org · Total</th>
                <th className="px-5 py-3">Milestone</th>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.caseId} className="border-t border-hairline-soft hover:bg-surface-soft transition-colors align-top">
                  <td className="px-5 py-3">
                    <div className="font-medium">{r.employeeName}</div>
                    <div className="text-xs font-mono text-muted-cb">{r.employeeId}</div>
                  </td>
                  <td className="px-5 py-3 text-body capitalize">{r.track === "sqa" ? "SQA" : r.track === "frontend" ? "Front-End" : "Back-End"}</td>
                  <td className="px-5 py-3 tabular text-xs">
                    {r.previousExperienceYears}y · {r.orgTenureYears}y · <strong>{r.totalExperience}y</strong>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {r.verdict.milestone ? (
                      <>
                        <div className="tabular font-semibold">{r.verdict.milestone}y</div>
                        <div className="text-muted-cb">{r.verdict.targetDesignation}</div>
                      </>
                    ) : (
                      <span className="text-muted-cb">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 tabular">{r.currentRank} → {r.proposedRank}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-1.5">
                      {r.verdict.status === "eligible" && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Eligible</Badge>}
                      {r.verdict.status === "borderline" && <Badge variant="warning"><AlertTriangle className="h-3 w-3" /> Borderline</Badge>}
                      {r.verdict.status === "ineligible" && <Badge variant="destructive"><XCircle className="h-3 w-3" /> Ineligible</Badge>}
                      {r.verdict.reasons.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {r.verdict.reasons.map((rs) => (
                            <Badge key={rs} variant="outline" className="text-[10px] font-normal">{rs}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-cb">No candidates match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function RuleRow({ icon: Icon, label, value }: { icon: typeof Briefcase; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <p className="text-xs text-muted-cb mt-0.5">{value}</p>
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
