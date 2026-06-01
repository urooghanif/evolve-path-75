import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CASES } from "@/lib/mock-data";
import { Users, Calendar, MapPin, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/panels")({ component: PanelsPage });

const PANEL_POOL = [
  { id: "P1", name: "Hamza Sheikh", role: "VP Engineering", expertise: ["System Design", "Leadership"], dept: "Engineering" },
  { id: "P2", name: "Sana Malik", role: "Head of Engineering", expertise: ["React", "Mentoring"], dept: "Front-End" },
  { id: "P3", name: "Dr. Rashid Mahmood", role: "External Advisor", expertise: ["Architecture"], dept: "External" },
  { id: "P4", name: "Nadia Qureshi", role: "Principal Engineer", expertise: ["Performance", "Back-End"], dept: "Back-End" },
  { id: "P5", name: "Aisha Khan", role: "Director QA", expertise: ["SQA", "Automation"], dept: "SQA" },
  { id: "P6", name: "Tahir Bhatti", role: "Staff Engineer", expertise: ["TypeScript", "System Design"], dept: "Front-End" },
];

const PANELS = [
  { id: "PNL-01", case: "PC-1003", candidate: "Bilal Hussain", date: "2026-01-22", time: "15:00 IST", mode: "Hybrid", room: "HQ 4B", members: ["Hamza Sheikh", "Sana Malik", "Dr. Rashid Mahmood"], status: "scheduled" },
  { id: "PNL-02", case: "PC-1005", candidate: "Faisal Iqbal", date: "2026-01-24", time: "11:00 IST", mode: "Virtual", room: "Zoom", members: ["Nadia Qureshi", "Hamza Sheikh"], status: "in_progress" },
  { id: "PNL-03", case: "PC-1007", candidate: "Zain Abbas", date: "2026-01-19", time: "16:30 IST", mode: "On-site", room: "HQ 2A", members: ["Sana Malik", "Aisha Khan", "Tahir Bhatti"], status: "completed" },
];

function PanelsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [caseId, setCaseId] = useState<string>("");
  const rank16Cases = CASES.filter((c) => c.rank16Plus);
  const toggleMember = (n: string) => setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="caption-strong text-muted-cb">HR Admin · Interview Panels</p>
          <h1 className="display-md mt-2">Interview panels</h1>
          <p className="text-body mt-2">Assemble panels for Rank 16+ promotions and track evaluation outcomes.</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Assign panel</Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader><SheetTitle>Assemble interview panel</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-5">
              <div>
                <Label>Case</Label>
                <Select value={caseId} onValueChange={setCaseId}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Select Rank 16+ case" /></SelectTrigger>
                  <SelectContent>
                    {rank16Cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.id} · {c.employeeName} · Rank {c.proposedRank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" className="mt-2" /></div>
                <div><Label>Time</Label><Input type="time" className="mt-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Mode</Label>
                  <Select defaultValue="hybrid">
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Room / link</Label><Input placeholder="HQ 4B or URL" className="mt-2" /></div>
              </div>
              <div>
                <Label className={`flex items-center justify-between ${selected.length === 5 ? "text-success" : ""}`}>
                  <span>Panel members ({selected.length} / 5)</span>
                  {selected.length === 5
                    ? <Badge variant="success">Quorum met</Badge>
                    : <Badge variant={selected.length > 5 ? "destructive" : "warning"}>
                        {selected.length > 5 ? `Remove ${selected.length - 5}` : `Add ${5 - selected.length}`}
                      </Badge>}
                </Label>
                <p className="text-xs text-muted-cb mt-1">Rank 16+ business rule — exactly 5 panel members required (UC-007).</p>
                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {PANEL_POOL.map((p) => {
                    const isChecked = selected.includes(p.name);
                    const blocked = !isChecked && selected.length >= 5;
                    return (
                      <label key={p.id} className={`flex items-start gap-3 p-3 rounded-lg border border-hairline transition-colors ${blocked ? "opacity-50 cursor-not-allowed" : "hover:bg-surface-soft cursor-pointer"}`}>
                        <Checkbox checked={isChecked} disabled={blocked} onCheckedChange={() => !blocked && toggleMember(p.name)} className="mt-1" />
                        <Avatar className="h-9 w-9"><AvatarFallback className="bg-surface-strong text-xs">{p.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold">{p.name}</div>
                          <div className="text-xs text-muted-cb">{p.role} · {p.dept}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {p.expertise.map((e) => <Badge key={e} variant="muted" className="text-[10px]">{e}</Badge>)}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label>Briefing note (optional)</Label>
                <Textarea placeholder="Focus areas for the panel..." rows={3} className="mt-2" />
              </div>
              <Button
                className="w-full"
                disabled={selected.length !== 5 || !caseId}
                onClick={() => {
                  if (!caseId) return toast.error("Select a case.");
                  if (selected.length !== 5) return toast.error("Panel must have exactly 5 members.");
                  toast.success(`5-member panel assigned for ${caseId}`);
                  setSelected([]);
                  setCaseId("");
                }}
              >Confirm 5-member panel</Button>

            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-surface-soft p-1 rounded-full">
          {[["all", "All"], ["scheduled", "Scheduled"], ["in_progress", "In progress"], ["completed", "Completed"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-white px-4 h-9">{l}</TabsTrigger>
          ))}
        </TabsList>
        {["all", "scheduled", "in_progress", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {PANELS.filter((p) => tab === "all" || p.status === tab).map((p) => (
              <Card key={p.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="muted" className="font-mono normal-case tracking-normal">{p.id}</Badge>
                    <h3 className="title-md mt-2">{p.candidate}</h3>
                    <p className="text-xs text-muted-cb font-mono">{p.case}</p>
                  </div>
                  {p.status === "completed" && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>}
                  {p.status === "scheduled" && <Badge variant="default">Scheduled</Badge>}
                  {p.status === "in_progress" && <Badge variant="warning">In progress</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                  <div className="flex items-center gap-2 text-body"><Calendar className="h-4 w-4 text-muted-cb" /> {p.date} · {p.time}</div>
                  <div className="flex items-center gap-2 text-body"><MapPin className="h-4 w-4 text-muted-cb" /> {p.mode} · {p.room}</div>
                </div>
                <div className="mt-5">
                  <div className="caption-strong text-muted-cb mb-2 flex items-center gap-2"><Users className="h-3 w-3" /> Panel ({p.members.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {p.members.map((m) => <Badge key={m} variant="outline">{m}</Badge>)}
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">View case</Button>
                  {p.status !== "completed" && <Button size="sm" className="flex-1">Open evaluation</Button>}
                </div>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
