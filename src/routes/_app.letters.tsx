import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CASES } from "@/lib/mock-data";
import { Download, Send, CheckCircle2, Sparkles, Printer, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";


export const Route = createFileRoute("/_app/letters")({ component: LettersPage });

const TEMPLATES = [
  { id: "T1", name: "Promotion approval letter" },
  { id: "T2", name: "Deferral notification" },
  { id: "T3", name: "Interview invite" },
];

const ISSUED = [
  { id: "LTR-2026-0118", case: "PC-1008", employee: "Emma Roberts", template: "Promotion approval", issued: "2026-01-15", channel: "Email + DocuSign", status: "signed" },
  { id: "LTR-2026-0117", case: "PC-1007", employee: "Zain Abbas", template: "Promotion approval", issued: "2026-01-14", channel: "Email + DocuSign", status: "sent" },
  { id: "LTR-2026-0116", case: "PC-1009", employee: "Yuki Tanaka", template: "Deferral notification", issued: "2026-01-12", channel: "Email", status: "sent" },
];

function LettersPage() {
  const [caseId, setCaseId] = useState<string>(CASES.find((c) => c.stage === "completed")?.id || CASES[0].id);
  const [template, setTemplate] = useState<string>("T1");
  const selected = CASES.find((c) => c.id === caseId)!;

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <p className="caption-strong text-muted-cb">Letter generation</p>
        <h1 className="display-md mt-2">Promotion letters</h1>
        <p className="text-body mt-2">Generate, preview, and dispatch official decision letters with audit trail.</p>
      </div>

      <Tabs defaultValue="generate">
        <TabsList className="bg-surface-soft p-1 rounded-full">
          {[["generate", "Generate"], ["issued", "Issued letters"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-white px-4 h-9">{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="generate" className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h3 className="title-md">Configure letter</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <Label>Case</Label>
                  <Select value={caseId} onValueChange={setCaseId}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CASES.map((c) => <SelectItem key={c.id} value={c.id}>{c.id} · {c.employeeName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Template</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>{TEMPLATES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Effective date</Label><Input type="date" defaultValue="2026-04-01" className="mt-2" /></div>
                  <div><Label>New band</Label><Input defaultValue={`B${selected.proposedRank - 9}`} className="mt-2" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>New designation</Label><Input defaultValue={selected.proposedDesignation} className="mt-2" /></div>
                  <div><Label>New CTC</Label><Input defaultValue="₹42,00,000" className="mt-2" /></div>
                </div>
                <div>
                  <Label>Delivery</Label>
                  <Select defaultValue="email_docusign">
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email_docusign">Email + DocuSign signature</SelectItem>
                      <SelectItem value="email">Email only</SelectItem>
                      <SelectItem value="print">Print & hand-deliver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="title-md flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI assistant</h3>
              <p className="text-sm text-body mt-2">Detected tone: <Badge variant="muted">Formal · warm</Badge>. Length looks appropriate.</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">Rewrite paragraph</Button>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline"><Printer className="h-4 w-4" /> Preview PDF</Button>
              <Button onClick={() => toast.success("Letter dispatched")}><Send className="h-4 w-4" /> Generate & send</Button>
            </div>
          </div>

          {/* Preview */}
          <Card className="lg:col-span-3 p-10 bg-white border-hairline">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">P</div>
                <div className="title-md mt-3">Acme Corporation</div>
                <div className="text-xs text-muted-cb">Office of the Chief People Officer</div>
              </div>
              <div className="text-right text-xs text-muted-cb">
                <div>Ref: LTR-2026-{Math.floor(100 + Math.random() * 900)}</div>
                <div>Date: 15 January 2026</div>
              </div>
            </div>

            <div className="text-sm leading-relaxed space-y-4 text-ink">
              <div>
                <div className="font-semibold">{selected.employeeName}</div>
                <div className="text-muted-cb text-xs">Employee ID · {selected.employeeId}</div>
                <div className="text-muted-cb text-xs">{selected.department}</div>
              </div>

              <h2 className="title-md mt-6">Subject: Confirmation of promotion</h2>

              <p>Dear {selected.employeeName.split(" ")[0]},</p>
              <p>
                We are delighted to inform you that, on the recommendation of your Delivery Lead, Line Manager, and
                Head of Department — and following the deliberations of the Promotion Committee — you have been
                promoted to the position of <strong>{selected.proposedDesignation}</strong> (Rank {selected.proposedRank}),
                effective <strong>1 April 2026</strong>.
              </p>
              <p>
                Your revised compensation, benefits, and band placement are detailed in the appended remuneration
                schedule. All other terms of your employment contract remain unchanged.
              </p>
              <p>
                This recognition reflects your sustained contribution and the trust the organisation places in your
                continued growth. We look forward to your leadership in this new capacity.
              </p>
              <p>With our congratulations,</p>

              <div className="pt-8">
                <div className="font-semibold">Imran Siddiqui</div>
                <div className="text-xs text-muted-cb">Chief People Officer</div>
              </div>
            </div>

            <Separator className="my-8" />
            <div className="text-[10px] text-muted-cb font-mono">
              This letter is digitally generated and securely delivered. Audit trail ref: AUD-{selected.id}-04012026.
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="issued" className="mt-6">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-soft">
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb">
                  <th className="px-6 py-3">Letter</th><th className="px-6 py-3">Case</th><th className="px-6 py-3">Employee</th><th className="px-6 py-3">Template</th><th className="px-6 py-3">Issued</th><th className="px-6 py-3">Channel</th><th className="px-6 py-3">Status</th><th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {ISSUED.map((l) => (
                  <tr key={l.id} className="border-t border-hairline-soft">
                    <td className="px-6 py-4 font-mono text-xs">{l.id}</td>
                    <td className="px-6 py-4 font-mono text-xs">{l.case}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7"><AvatarFallback className="bg-surface-strong text-[10px]">{l.employee.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                        <span className="font-medium">{l.employee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body">{l.template}</td>
                    <td className="px-6 py-4 text-muted-cb">{l.issued}</td>
                    <td className="px-6 py-4"><Badge variant="muted">{l.channel}</Badge></td>
                    <td className="px-6 py-4">{l.status === "signed" ? <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Signed</Badge> : <Badge variant="default">Sent</Badge>}</td>
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
