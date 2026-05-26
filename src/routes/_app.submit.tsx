import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ACHIEVEMENT_CATEGORIES, REQUIRED_SKILLS_FOR_RANK_14_FE, SKILL_DICTIONARY } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { Plus, Sparkles, Trash2, Upload, AlertCircle, FileText, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/_app/submit")({
  component: SubmitAchievements,
});

const achievementSchema = z.object({
  title: z.string().min(3, "Title required"),
  category: z.string().min(1, "Category required"),
  description: z.string().min(20, "Describe in at least 20 characters"),
  impact: z.string().min(1, "Impact required"),
  role: z.string().min(1, "Your role required"),
  periodStart: z.string().min(1, "Required"),
  periodEnd: z.string().min(1, "Required"),
  project: z.string().optional(),
  highImpact: z.boolean(),
  evidence: z.string().optional(),
});
const skillSchema = z.object({
  name: z.string().min(1, "Skill required"),
  category: z.string(),
  level: z.string().min(1, "Rate the skill"),
  evidence: z.string().optional(),
});
const schema = z.object({
  achievements: z.array(achievementSchema).min(1, "Add at least one achievement"),
  skills: z.array(skillSchema).min(1, "Add at least one skill"),
  justification: z.string().min(50, "Provide at least 50 characters"),
}).refine(
  (d) => d.achievements.every((a) => !a.highImpact || (a.evidence && a.evidence.length > 0)),
  { message: "High-impact achievements require evidence", path: ["achievements"] },
);

type FormValues = z.infer<typeof schema>;
const STEPS = ["Details", "Achievements", "Skills", "Review", "Submit"];

function SubmitAchievements() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      achievements: [{ title: "", category: "", description: "", impact: "", role: "", periodStart: "", periodEnd: "", project: "", highImpact: false, evidence: "" }],
      skills: [{ name: "", category: "", level: "", evidence: "" }],
      justification: "",
    },
    mode: "onBlur",
  });

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form;
  const achievements = useFieldArray({ control, name: "achievements" });
  const skills = useFieldArray({ control, name: "skills" });

  const onSubmit = (values: FormValues) => {
    console.log("Submitted", values);
    toast.success("Achievements submitted for review", { description: "Routed to your Delivery Lead." });
    setStep(4);
  };
  const saveDraft = () => toast("Draft saved", { description: "You can resume any time before the deadline." });

  if (!user) return null;

  return (
    <div className="p-6 lg:p-10 max-w-[1100px] mx-auto">
      <div className="mb-8">
        <p className="caption-strong text-muted-cb">Employee</p>
        <h1 className="display-md mt-2">Submit achievements</h1>
        <p className="text-body mt-2">Build a complete case for your promotion review.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${i <= step ? "bg-primary text-white" : "bg-surface-strong text-muted-cb"}`}>{i + 1}</div>
            <span className={`text-sm ${i === step ? "text-ink font-semibold" : "text-muted-cb"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-primary" : "bg-hairline"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section A — Details */}
        <Card className="p-7">
          <h3 className="title-md">Your details</h3>
          <p className="text-sm text-body mt-1">Auto-populated from your profile.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
            <ReadOnly label="Name" value={user.name} />
            <ReadOnly label="ID" value={user.id} mono />
            <ReadOnly label="Department" value={user.department} />
            <ReadOnly label="Current rank" value={String(user.rank)} mono />
            <ReadOnly label="Proposed rank" value={String(user.rank + 1)} mono />
            <ReadOnly label="Proposed designation" value="Lead Engineer" />
            <ReadOnly label="Total experience" value="7.2 yrs" />
            <ReadOnly label="Submission deadline" value="2026-06-10" />
          </div>
        </Card>

        {/* Section B — Achievements */}
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="title-md">Achievements</h3>
              <p className="text-sm text-body mt-1">Add work that demonstrates your readiness for the next rank.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() =>
              achievements.append({ title: "", category: "", description: "", impact: "", role: "", periodStart: "", periodEnd: "", project: "", highImpact: false, evidence: "" })
            }><Plus className="h-4 w-4" /> Add achievement</Button>
          </div>

          <div className="mt-6 space-y-5">
            {achievements.fields.map((f, i) => (
              <AchievementCard key={f.id} index={i} form={form} onRemove={() => achievements.remove(i)} canRemove={achievements.fields.length > 1} />
            ))}
          </div>
          {errors.achievements?.root && <p className="text-xs text-destructive mt-3">{errors.achievements.root.message}</p>}
        </Card>

        {/* Section C — Skills */}
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="title-md">Skill set</h3>
              <p className="text-sm text-body mt-1">Rate skills from the company dictionary.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => skills.append({ name: "", category: "", level: "", evidence: "" })}>
              <Plus className="h-4 w-4" /> Add skill
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {skills.fields.map((f, i) => {
              const selected = SKILL_DICTIONARY.find((s) => s.name === watch(`skills.${i}.name`));
              return (
                <div key={f.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_2fr_auto] gap-4 items-end p-4 rounded-lg bg-surface-soft">
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-cb">Skill</Label>
                    <Select
                      value={watch(`skills.${i}.name`)}
                      onValueChange={(v) => {
                        const s = SKILL_DICTIONARY.find((x) => x.name === v);
                        setValue(`skills.${i}.name`, v);
                        if (s) setValue(`skills.${i}.category`, s.category);
                      }}
                    >
                      <SelectTrigger className="mt-1.5 h-11 bg-canvas"><SelectValue placeholder="Choose…" /></SelectTrigger>
                      <SelectContent>
                        {SKILL_DICTIONARY.map((s) => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-cb">Category</Label>
                    <div className="mt-1.5 h-11 flex items-center"><Badge variant="muted">{selected?.category || "—"}</Badge></div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-cb">Proficiency</Label>
                    <RadioGroup
                      value={watch(`skills.${i}.level`)}
                      onValueChange={(v) => setValue(`skills.${i}.level`, v)}
                      className="mt-2 flex gap-3"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <label key={n} className="flex items-center gap-1.5 text-sm">
                          <RadioGroupItem value={String(n)} />
                          <span className="tabular">L{n}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => skills.remove(i)} disabled={skills.fields.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Section D — Justification */}
        <Card className="p-7">
          <h3 className="title-md">Self-justification</h3>
          <p className="text-sm text-body mt-1">In your words, why are you ready for this promotion?</p>
          <Textarea {...register("justification")} className="mt-4 min-h-[140px] rounded-md" placeholder="Walk through your impact, growth, and next-rank readiness…" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-cb">{watch("justification")?.length || 0} characters</span>
            {errors.justification && <p className="text-xs text-destructive">{errors.justification.message}</p>}
          </div>
        </Card>

        {/* Section E — Skill Gap */}
        <Card className="p-7">
          <Accordion type="single" collapsible defaultValue="gap">
            <AccordionItem value="gap" className="border-0">
              <AccordionTrigger className="hover:no-underline py-0">
                <div className="text-left">
                  <h3 className="title-md">Skill gap analysis</h3>
                  <p className="text-sm text-body mt-1">See how your skills line up against the next rank's requirements.</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6">
                <SkillGapAnalysis currentSkills={watch("skills")} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Footer */}
        <div className="flex flex-wrap justify-end gap-3 sticky bottom-0 -mx-6 px-6 py-4 bg-canvas/95 backdrop-blur border-t border-hairline">
          <Button type="button" variant="outline" onClick={saveDraft}>Save as draft</Button>
          <Button type="submit">Submit for review</Button>
        </div>
      </form>
    </div>
  );
}

function ReadOnly({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-cb">{label}</Label>
      <div className={`mt-1.5 text-ink ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function AchievementCard({ index, form, onRemove, canRemove }: { index: number; form: ReturnType<typeof useForm<FormValues>>; onRemove: () => void; canRemove: boolean }) {
  const { register, watch, setValue, formState: { errors } } = form;
  const highImpact = watch(`achievements.${index}.highImpact`);
  const hasEvidence = !!watch(`achievements.${index}.evidence`);
  const aErr = errors.achievements?.[index];

  return (
    <div className="p-6 rounded-xl border border-hairline-soft bg-surface-soft">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Badge variant="muted" className="font-mono normal-case tracking-normal">#{index + 1}</Badge>
          <span className="title-sm">Achievement</span>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} disabled={!canRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label className="text-xs uppercase tracking-wide text-muted-cb">Title</Label>
          <Input {...register(`achievements.${index}.title`)} className="mt-1.5 h-11 bg-canvas" />
          {aErr?.title && <p className="text-xs text-destructive mt-1">{aErr.title.message}</p>}
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb">Category</Label>
          <Select value={watch(`achievements.${index}.category`)} onValueChange={(v) => setValue(`achievements.${index}.category`, v)}>
            <SelectTrigger className="mt-1.5 h-11 bg-canvas"><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent>
              {ACHIEVEMENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          {aErr?.category && <p className="text-xs text-destructive mt-1">{aErr.category.message}</p>}
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb">Project</Label>
          <Input {...register(`achievements.${index}.project`)} className="mt-1.5 h-11 bg-canvas" placeholder="Optional" />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wide text-muted-cb">Description</Label>
            <AiRewritePanel current={watch(`achievements.${index}.description`)} onAccept={(t) => setValue(`achievements.${index}.description`, t)} />
          </div>
          <Textarea {...register(`achievements.${index}.description`)} className="mt-1.5 min-h-[100px] bg-canvas" />
          {aErr?.description && <p className="text-xs text-destructive mt-1">{aErr.description.message}</p>}
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb">Measurable impact</Label>
          <Input {...register(`achievements.${index}.impact`)} className="mt-1.5 h-11 bg-canvas" placeholder="e.g. 38% faster checkout" />
          {aErr?.impact && <p className="text-xs text-destructive mt-1">{aErr.impact.message}</p>}
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb">Your role</Label>
          <Input {...register(`achievements.${index}.role`)} className="mt-1.5 h-11 bg-canvas" placeholder="e.g. Tech lead" />
          {aErr?.role && <p className="text-xs text-destructive mt-1">{aErr.role.message}</p>}
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb">Period start</Label>
          <Input type="date" {...register(`achievements.${index}.periodStart`)} className="mt-1.5 h-11 bg-canvas" />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-cb">Period end</Label>
          <Input type="date" {...register(`achievements.${index}.periodEnd`)} className="mt-1.5 h-11 bg-canvas" />
        </div>

        <div className="md:col-span-2 flex items-center justify-between p-4 rounded-lg bg-canvas border border-hairline-soft">
          <div>
            <Label className="text-sm text-ink">High-impact</Label>
            <p className="text-xs text-muted-cb">Evidence becomes mandatory when on.</p>
          </div>
          <Switch checked={highImpact} onCheckedChange={(c) => setValue(`achievements.${index}.highImpact`, c)} />
        </div>

        <div className="md:col-span-2">
          <Label className="text-xs uppercase tracking-wide text-muted-cb">Evidence {highImpact && <span className="text-destructive">*</span>}</Label>
          <EvidenceUpload value={watch(`achievements.${index}.evidence`) || ""} onChange={(v) => setValue(`achievements.${index}.evidence`, v)} />
          {highImpact && !hasEvidence && (
            <Alert variant="destructive" className="mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>High-impact achievements require uploaded evidence (PDF, JPG, or PNG).</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

function EvidenceUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const handle = (file?: File | null) => {
    if (!file) return;
    const ok = /\.(pdf|jpg|jpeg|png)$/i.test(file.name);
    if (!ok) { setError("Only PDF, JPG, or PNG files are allowed."); return; }
    setError(null);
    onChange(file.name);
  };
  if (value) {
    return (
      <div className="mt-1.5 flex items-center justify-between p-3 rounded-md bg-canvas border border-hairline">
        <div className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-primary" />{value}</div>
        <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}><X className="h-4 w-4" /></Button>
      </div>
    );
  }
  return (
    <>
      <label className="mt-1.5 block border-2 border-dashed border-hairline rounded-lg p-6 text-center cursor-pointer hover:bg-canvas transition-colors">
        <Upload className="h-5 w-5 mx-auto text-muted-cb" />
        <div className="text-sm mt-2">Drop a file or <span className="text-primary font-semibold">browse</span></div>
        <div className="text-xs text-muted-cb mt-1">PDF, JPG, PNG</div>
        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handle(e.target.files?.[0])} />
      </label>
      {error && <Alert variant="destructive" className="mt-2"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
    </>
  );
}

function AiRewritePanel({ current, onAccept }: { current: string; onAccept: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generate = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const base = current.trim() || "Led the initiative to improve product reliability across multiple releases.";
      const variants: Record<string, string> = {
        short: `Drove ${base.split(".")[0].toLowerCase()}, accelerating delivery and improving outcomes.`,
        medium: `Owned and executed an initiative to ${base.toLowerCase().slice(0, 80)} — partnering with cross-functional stakeholders to ship measurable improvements within the cycle.`,
        detailed: `As the responsible lead, I architected and delivered a multi-quarter program to ${base.toLowerCase()} Working alongside engineering, product, and design, I scoped deliverables, ran weekly reviews, unblocked the team, and shipped the work with measurable customer outcomes — while documenting patterns the broader org now reuses.`,
        leadership: `Acting as a cross-team multiplier, I framed the problem, aligned senior stakeholders, and coached two engineers through delivery. The initiative — ${base.toLowerCase()} — set the org standard and is now referenced in onboarding.`,
      };
      setResult(variants[mode]);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen((o) => !o)} className="text-primary">
        <Sparkles className="h-4 w-4" /> AI Rewrite
      </Button>
      {open && (
        <div className="md:col-span-2 mt-3 p-5 rounded-lg bg-canvas border border-hairline">
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList>
              <TabsTrigger value="short">Short</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4 flex items-center gap-2">
            <Button type="button" size="sm" onClick={generate} disabled={loading}>{loading ? "Generating…" : "Generate rewrite"}</Button>
            {result && <Button type="button" size="sm" variant="ghost" onClick={generate}>Regenerate</Button>}
          </div>

          {loading && <div className="mt-4 space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-11/12" /><Skeleton className="h-3 w-3/4" /></div>}

          {result && !loading && (
            <>
              <div className="mt-4 p-4 rounded-md bg-surface-soft text-sm text-ink leading-relaxed">{result}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => { onAccept(result); setOpen(false); toast.success("AI rewrite applied"); }}>Accept</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => onAccept(result)}>Edit</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setResult(null)}>Discard</Button>
              </div>
              <Alert className="mt-4">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Review before accepting</AlertTitle>
                <AlertDescription>AI hasn't added unverified metrics. Add measurable outcomes yourself.</AlertDescription>
              </Alert>
            </>
          )}
        </div>
      )}
    </>
  );
}

function SkillGapAnalysis({ currentSkills }: { currentSkills: { name: string; level: string }[] }) {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => { setAnalyzed(true); setLoading(false); }, 1200);
  };

  if (!analyzed && !loading) {
    return <Button type="button" onClick={run}><Sparkles className="h-4 w-4" /> Run skill gap analysis</Button>;
  }
  if (loading) {
    return <div className="space-y-3"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-32 w-full" /></div>;
  }

  const rows = REQUIRED_SKILLS_FOR_RANK_14_FE.map((r) => {
    const my = currentSkills.find((s) => s.name === r.skill);
    const myLvl = my ? Number(my.level) : 0;
    const gap = myLvl >= r.required ? "Met" : myLvl >= r.required - 1 ? "Gap" : "Critical";
    return { skill: r.skill, required: r.required, my: myLvl, gap };
  });
  const gapPct = Math.round((rows.filter((r) => r.gap === "Met").length / rows.length) * 100);
  const missing = rows.filter((r) => r.my === 0).map((r) => r.skill);
  const below = rows.filter((r) => r.my > 0 && r.gap !== "Met").map((r) => r.skill);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-sm mb-2"><span>Skill match</span><span className="tabular font-semibold">{gapPct}%</span></div>
        <Progress value={gapPct} className="h-2" />
      </div>

      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <XAxis dataKey="skill" tick={{ fontSize: 11, fill: "var(--body)" }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "var(--body)" }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--hairline)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="required" name="Required" fill="var(--surface-strong)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="my" name="My level" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-hidden rounded-lg border border-hairline-soft">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft text-xs uppercase tracking-wide text-muted-cb">
            <tr><th className="px-4 py-2 text-left">Skill</th><th className="px-4 py-2 text-right">Required</th><th className="px-4 py-2 text-right">My level</th><th className="px-4 py-2 text-right">Gap</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.skill} className="border-t border-hairline-soft">
                <td className="px-4 py-3">{r.skill}</td>
                <td className="px-4 py-3 text-right tabular">L{r.required}</td>
                <td className="px-4 py-3 text-right tabular">{r.my ? `L${r.my}` : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {r.gap === "Met" ? <Badge variant="success">Met</Badge>
                    : r.gap === "Gap" ? <Badge variant="warning">Gap</Badge>
                    : <Badge variant="destructive">Critical</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {missing.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing competencies</AlertTitle>
          <AlertDescription>{missing.join(", ")}</AlertDescription>
        </Alert>
      )}
      {below.length > 0 && (
        <Alert className="border-warning/40 bg-warning/5">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertTitle>Below required level</AlertTitle>
          <AlertDescription>{below.join(", ")}</AlertDescription>
        </Alert>
      )}

      <div>
        <h4 className="title-sm mb-2">Recommended learning</h4>
        <div className="flex flex-wrap gap-2">
          {["Frontend System Design — Course", "Mentoring playbook", "WCAG 2.2 Practitioner", "Tech-talk: Performance budgets"].map((t) => (
            <Badge key={t} variant="muted">{t}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
