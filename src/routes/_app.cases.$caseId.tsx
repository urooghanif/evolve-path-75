import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { getCaseDetail, type CaseDetail } from "@/lib/case-details";
import { STATUS_LABEL } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  ArrowLeft, FileText, Paperclip, CheckCircle2, XCircle, Clock, AlertTriangle,
  TrendingUp, Star, Calendar, Briefcase, Sparkles, Download, MessageSquare,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/_app/cases/$caseId")({
  component: CaseDetailPage,
  loader: ({ params }) => {
    const c = getCaseDetail(params.caseId);
    if (!c) throw notFound();
    return c;
  },
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h2 className="title-lg">Case not found</h2>
      <Button asChild className="mt-4"><Link to="/cases">Back to cases</Link></Button>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10">Error loading case: {error.message}</div>,
});

function CaseDetailPage() {
  const c = Route.useLoaderData() as CaseDetail;
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const canReview = useMemo(() => {
    if (user.role === "delivery_lead" && c.stage === "dl_review") return "Delivery Lead";
    if (user.role === "line_manager" && c.stage === "lm_review") return "Line Manager";
    if (user.role === "hod" && c.stage === "hod_review") return "HOD";
    if (user.role === "panel_member" && (c.stage === "panel_evaluation" || c.stage === "interview_required")) return "Panel";
    if (user.role === "final_authority" && c.stage === "final_approval") return "Final Authority";
    return null;
  }, [user.role, c.stage]);

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/cases" })} className="mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to cases
      </Button>

      {/* Header */}
      <Card className="p-6 lg:p-8 mb-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-white font-semibold">
                {c.employeeName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="muted" className="font-mono normal-case tracking-normal">{c.id}</Badge>
                <StatusBadge status={c.stage} />
                {c.overdue && <Badge variant="destructive"><AlertTriangle className="h-3 w-3" /> Overdue</Badge>}
                {c.rank16Plus && <Badge variant="outline">Rank 16+</Badge>}
              </div>
              <h1 className="display-sm mt-2">{c.employeeName}</h1>
              <p className="text-body mt-1">{c.proposedDesignation} · {c.department}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Metric label="Current rank" value={String(c.currentRank)} />
            <Metric label="Proposed" value={String(c.proposedRank)} accent />
            <Metric label="Days in stage" value={String(c.daysInStage)} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-surface-soft p-1 h-auto inline-flex flex-wrap rounded-full">
              {[
                ["overview", "Overview"],
                ["achievements", "Achievements"],
                ["skills", "Skill assessment"],
                ["evaluations", "Evaluations"],
                ["interview", "Interview"],
                ["timeline", "Timeline"],
              ].map(([v, l]) => (
                <TabsTrigger key={v} value={v} className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-white px-4 h-9">{l}</TabsTrigger>
              ))}
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-6 space-y-4">
              <Card className="p-6">
                <h3 className="title-md mb-4">Employee profile</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <InfoRow label="Employee ID" value={c.employeeId} mono />
                  <InfoRow label="Email" value={c.employeeEmail} />
                  <InfoRow label="Department" value={c.department} />
                  <InfoRow label="Line manager" value={c.managerName} />
                  <InfoRow label="Hire date" value={c.hireDate} />
                  <InfoRow label="Tenure" value={`${c.tenureYears} years`} />
                  <InfoRow label="Last promotion" value={c.lastPromotion} />
                  <InfoRow label="Current → Proposed" value={`Rank ${c.currentRank} → ${c.proposedRank}`} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="title-md mb-4 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI candidate summary</h3>
                <div className="rounded-2xl bg-surface-soft p-5 text-sm leading-relaxed">
                  Candidate demonstrates <strong>consistent above-bar delivery</strong> across 3 quarters with measurable
                  revenue and quality impact. Mentoring footprint is strong (18 mentees, 9 downstream promotions).
                  Primary growth area is <strong>executive stakeholder management</strong>; recommend continued exposure
                  to QBRs over the next two quarters. Overall AI readiness score: <strong>87 / 100</strong>.
                </div>
                <p className="text-[11px] text-muted-cb mt-3">Visible to HRBP, HOD, Final Authority and C-Level reviewers.</p>
              </Card>

              {["hod_review","interview_required","panel_evaluation","final_approval","hr_validation","completed"].includes(c.stage) && (
                <Card className="p-6 border-primary/30">
                  <h3 className="title-md mb-4 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> AI feedback summary (HOD onwards)</h3>
                  <div className="rounded-2xl bg-primary/5 p-5 text-sm leading-relaxed space-y-3">
                    <p><strong>Consolidated reviewer signal:</strong> 3 of 3 prior approvers endorsed with average rating 4.3/5. Sentiment across written comments is <strong>strongly positive</strong> on delivery and mentoring; <strong>neutral-to-cautious</strong> on executive presence.</p>
                    <p><strong>Common themes:</strong> Performance under pressure, ownership of platform reliability, structured mentoring program. <strong>Concerns raised:</strong> Limited exposure to board-level forums (1 reviewer).</p>
                    <p className="text-xs text-muted-cb">AI-generated from {c.evaluations.filter(e => e.decision !== "pending").length} reviewer note(s). For decision support only — does not replace human judgement.</p>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements" className="mt-6 space-y-4">
              {c.achievements.map((a) => (
                <Card key={a.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">{a.category}</Badge>
                        <span className="text-xs text-muted-cb">{a.date}</span>
                      </div>
                      <h4 className="title-md">{a.title}</h4>
                      <p className="text-sm text-body mt-2">{a.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] uppercase tracking-wide text-muted-cb">AI score</div>
                      <div className="tabular text-2xl text-primary">{a.aiScore}</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-surface-soft p-4">
                    <div className="caption-strong text-muted-cb mb-1">Impact</div>
                    <p className="text-sm">{a.impact}</p>
                    <div className="text-xs font-mono text-primary mt-2">{a.metrics}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {a.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {a.evidence.map((e) => (
                      <div key={e.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-xs">
                        <Paperclip className="h-3 w-3" />
                        <span>{e.name}</span>
                        <span className="text-muted-cb">· {e.size}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills" className="mt-6 space-y-4">
              <Card className="p-6">
                <h3 className="title-md">Skill gap vs Rank {c.proposedRank} requirements</h3>
                <p className="text-sm text-body mt-1">Required level (target) compared to current assessed level.</p>
                <div className="h-80 mt-6">
                  <ResponsiveContainer>
                    <BarChart data={c.skills} layout="vertical" margin={{ left: 30 }}>
                      <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: "var(--body)" }} />
                      <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: "var(--body)" }} width={130} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
                      <Legend />
                      <Bar dataKey="required" fill="var(--muted-soft)" radius={[0, 6, 6, 0]} name="Required" />
                      <Bar dataKey="current" fill="var(--primary)" radius={[0, 6, 6, 0]} name="Current" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="title-md mb-4">Gap detail</h3>
                <div className="space-y-3">
                  {c.skills.map((s) => {
                    const gap = s.current - s.required;
                    return (
                      <div key={s.skill}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{s.skill}</span>
                          <span className={gap >= 0 ? "text-success tabular" : "text-destructive tabular"}>
                            {s.current}/{s.required} {gap >= 0 ? `(+${gap})` : `(${gap})`}
                          </span>
                        </div>
                        <Progress value={(s.current / 5) * 100} />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Evaluations */}
            <TabsContent value="evaluations" className="mt-6 space-y-4">
              {c.evaluations.map((e, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="title-md">{e.reviewer}</h4>
                        <Badge variant="muted">{e.reviewerRole}</Badge>
                      </div>
                      <p className="text-xs text-muted-cb mt-1">{e.date}</p>
                    </div>
                    {e.decision === "endorsed" && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Endorsed</Badge>}
                    {e.decision === "rejected" && <Badge variant="destructive"><XCircle className="h-3 w-3" /> Rejected</Badge>}
                    {e.decision === "pending" && <Badge variant="warning"><Clock className="h-3 w-3" /> Pending</Badge>}
                  </div>
                  {e.decision !== "pending" ? (
                    <>
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < e.rating ? "fill-warning text-warning" : "text-muted-soft"}`} />
                        ))}
                      </div>
                      <Section label="Strengths">{e.strengths}</Section>
                      <Section label="Gaps">{e.gaps}</Section>
                      <Section label="Recommendation">{e.recommendation}</Section>
                    </>
                  ) : (
                    <p className="text-sm text-muted-cb italic">Awaiting input from this reviewer.</p>
                  )}
                </Card>
              ))}
            </TabsContent>

            {/* Interview */}
            <TabsContent value="interview" className="mt-6">
              <Card className="p-6">
                <h3 className="title-md flex items-center gap-2"><Calendar className="h-5 w-5" /> Interview schedule</h3>
                {c.interviewScheduled ? (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoBlock label="Date" value={c.interviewScheduled.date} />
                    <InfoBlock label="Time" value={c.interviewScheduled.time} />
                    <InfoBlock label="Mode" value="Hybrid · HQ Room 4B" />
                    <div className="md:col-span-3">
                      <div className="caption-strong text-muted-cb mb-2">Panel members</div>
                      <div className="flex flex-wrap gap-2">
                        {c.interviewScheduled.panel.map((p) => <Badge key={p} variant="outline">{p}</Badge>)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-body mt-4">No interview required for this case (Rank below 16).</p>
                )}
              </Card>
            </TabsContent>

            {/* Timeline */}
            <TabsContent value="timeline" className="mt-6">
              <Card className="p-6">
                <h3 className="title-md mb-6">Case timeline</h3>
                <div className="space-y-5">
                  {c.timeline.map((t, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
                        {i < c.timeline.length - 1 && <div className="w-px flex-1 bg-hairline mt-1" />}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold">{t.actor}</span>
                          <Badge variant="muted" className="text-[10px]">{STATUS_LABEL[t.stage]}</Badge>
                        </div>
                        <p className="text-sm text-body mt-1">{t.action}</p>
                        {t.note && <p className="text-xs text-muted-cb mt-1 italic">"{t.note}"</p>}
                        <p className="text-[11px] text-muted-cb mt-1 tabular">{t.date} · {t.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side panel: actions */}
        <div className="space-y-4">
          {canReview ? (
            <ReviewActionPanel role={canReview} caseId={c.id} />
          ) : user.role === "hr_admin" ? (
            <Card className="p-6 border-warning/40 ring-1 ring-warning/20">
              <div className="flex items-center gap-2 mb-1">
                <ShieldOverrideIcon /> <span className="caption-strong text-warning">HRBP override authority</span>
              </div>
              <h3 className="title-md mb-2">Override or reassign</h3>
              <p className="text-sm text-body mb-4">As HRBP you may override a stuck stage, reassign the reviewer, or fast-track this case. All overrides are written to the audit trail.</p>
              <div className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => toast.success("Reviewer reassigned")}>Reassign reviewer</Button>
                <Button className="w-full" variant="outline" onClick={() => toast.success("Stage skipped — audit logged")}>Override & advance stage</Button>
                <Button className="w-full" variant="destructive" onClick={() => toast.success("Case withdrawn — audit logged")}>Withdraw case</Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="title-md">Your access</h3>
              <p className="text-sm text-body mt-2">
                You're viewing this case as <Badge variant="muted">{user.role}</Badge>. No action required at the current stage.
              </p>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="title-md mb-4">Documents</h3>
            <div className="space-y-2">
              {["Promotion case PDF", "Performance reviews (3y)", "Evidence bundle.zip"].map((d) => (
                <button key={d} className="w-full flex items-center justify-between px-3 py-2.5 rounded-md border border-hairline hover:bg-surface-soft text-sm transition-colors">
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> {d}</span>
                  <Download className="h-4 w-4 text-muted-cb" />
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="title-md mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Notes</h3>
            <Textarea placeholder="Add an internal note (visible to approvers only)..." rows={4} />
            <Button size="sm" className="mt-3 w-full" onClick={() => toast.success("Note added")}>Post note</Button>
          </Card>

          {c.finalDecision && (
            <Card className="p-6 bg-success/10 border-success/30">
              <h3 className="title-md text-success flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Final decision</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="text-muted-cb">Decision:</span> <strong>{c.finalDecision.decision}</strong></div>
                <div><span className="text-muted-cb">Effective:</span> {c.finalDecision.effectiveDate}</div>
                <div><span className="text-muted-cb">New band:</span> {c.finalDecision.newSalary}</div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">Generate letter</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewActionPanel({ role, caseId }: { role: string; caseId: string }) {
  const [decision, setDecision] = useState<string>("endorse");
  const [rating, setRating] = useState(4);
  const [strengths, setStrengths] = useState("");
  const [gaps, setGaps] = useState("");

  const submit = () => {
    if (!strengths.trim()) {
      toast.error("Please document strengths before submitting.");
      return;
    }
    toast.success(`${role} review submitted for ${caseId}`);
  };

  return (
    <Card className="p-6 border-primary/40 ring-1 ring-primary/20">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="caption-strong text-primary">{role} action required</span>
      </div>
      <h3 className="title-md mb-4">Submit your review</h3>

      <div className="space-y-4">
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb mb-2 block">Decision</Label>
          <RadioGroup value={decision} onValueChange={setDecision} className="grid grid-cols-3 gap-2">
            {[
              { v: "endorse", l: "Endorse", c: "text-success" },
              { v: "defer", l: "Defer", c: "text-warning" },
              { v: "reject", l: "Reject", c: "text-destructive" },
            ].map((o) => (
              <label key={o.v} className={`flex items-center gap-2 px-3 py-2.5 rounded-md border cursor-pointer text-sm font-medium transition ${decision === o.v ? "border-primary bg-primary/5" : "border-hairline hover:bg-surface-soft"}`}>
                <RadioGroupItem value={o.v} className="sr-only" />
                <span className={o.c}>{o.l}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb mb-2 block">Rating</Label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onClick={() => setRating(i + 1)} type="button">
                <Star className={`h-6 w-6 transition ${i < rating ? "fill-warning text-warning" : "text-muted-soft hover:text-warning"}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb mb-2 block">Strengths *</Label>
          <Textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={3} placeholder="What stood out about this candidate?" />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb mb-2 block">Gaps / growth areas</Label>
          <Textarea value={gaps} onChange={(e) => setGaps(e.target.value)} rows={3} placeholder="What should they work on at the next level?" />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Button onClick={submit} className="w-full">
            {decision === "endorse" && <CheckCircle2 className="h-4 w-4" />}
            {decision === "reject" && <XCircle className="h-4 w-4" />}
            {decision === "defer" && <Clock className="h-4 w-4" />}
            Submit {decision}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast("Saved as draft")}>Save draft</Button>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-cb">{label}</div>
      <div className={`tabular text-2xl mt-1 ${accent ? "text-primary" : "text-ink"}`}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-cb">{label}</div>
      <div className={`mt-0.5 text-ink ${mono ? "font-mono text-sm" : "text-sm"}`}>{value}</div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-soft p-4">
      <div className="caption-strong text-muted-cb">{label}</div>
      <div className="text-lg mt-1 tabular">{value}</div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-cb mb-1">{label}</div>
      <p className="text-sm text-ink leading-relaxed">{children}</p>
    </div>
  );
}
