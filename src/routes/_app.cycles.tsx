import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CYCLES } from "@/lib/mock-data";
import { MoreHorizontal, Plus, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/cycles")({
  component: Cycles,
});

const schema = z.object({
  name: z.string().min(3, "Cycle name is required"),
  type: z.enum(["March", "October"]),
  reviewStart: z.string().min(1, "Required"),
  reviewEnd: z.string().min(1, "Required"),
  cutoffDate: z.string().min(1, "Required"),
  submissionDeadline: z.string().min(1, "Required"),
  approvalDeadline: z.string().min(1, "Required"),
  interviewDeadline: z.string().min(1, "Required"),
  effectiveDate: z.string().min(1, "Required"),
  departments: z.string().min(1, "Select at least one department"),
  ranks: z.string().min(1, "Select at least one rank"),
});
type FormValues = z.infer<typeof schema>;

function Cycles() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="caption-strong text-muted-cb">HR Admin</p>
          <h1 className="display-md mt-2">Promotion cycles</h1>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">All cycles</TabsTrigger>
          <TabsTrigger value="create">Create cycle</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cut-off</TableHead>
                  <TableHead>Effective</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CYCLES.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs font-mono text-muted-cb">{c.id}</div>
                    </TableCell>
                    <TableCell>{c.type}</TableCell>
                    <TableCell>
                      {c.status === "active" ? <Badge variant="success">Active</Badge>
                        : c.status === "draft" ? <Badge variant="muted">Draft</Badge>
                        : <Badge variant="outline">Closed</Badge>}
                    </TableCell>
                    <TableCell className="tabular">{c.cutoffDate}</TableCell>
                    <TableCell className="tabular">{c.effectiveDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Amend</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <CreateCycleForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateCycleForm() {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitted } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "March" },
  });
  const [missing, setMissing] = useState<string[]>([]);

  const submit = (mode: "draft" | "launch") => handleSubmit(
    (v) => {
      if (mode === "launch") {
        // simulate completeness check
        const m: string[] = [];
        if (!v.approvalDeadline) m.push("Approval deadline");
        if (!v.interviewDeadline) m.push("Interview deadline");
        if (m.length) { setMissing(m); return; }
      }
      setMissing([]);
      toast.success(mode === "draft" ? "Cycle saved as draft" : `Cycle "${v.name}" launched`);
    },
    () => {
      if (mode === "launch") setMissing(["Required fields"]);
    },
  );

  const field = (key: keyof FormValues, label: string, type: string = "text") => (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-cb">{label}</Label>
      <Input type={type} className="mt-1.5 h-11 rounded-md" {...register(key)} />
      {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]?.message}</p>}
    </div>
  );

  return (
    <Card className="p-8">
      <h2 className="title-lg">New promotion cycle</h2>
      <p className="text-sm text-body mt-1">Configure the schedule, eligibility, and approval windows.</p>

      {isSubmitted && missing.length > 0 && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Launch blocked</AlertTitle>
          <AlertDescription>
            Complete the following before launching:
            <ul className="mt-2 list-disc list-inside text-sm">
              {missing.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form className="mt-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        <Section title="Basics">
          {field("name", "Cycle name")}
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-cb">Cycle month</Label>
            <Select value={watch("type")} onValueChange={(v) => setValue("type", v as "March" | "October")}>
              <SelectTrigger className="mt-1.5 h-11 rounded-md"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="October">October</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Schedule">
          {field("reviewStart", "Review period — start", "date")}
          {field("reviewEnd", "Review period — end", "date")}
          {field("cutoffDate", "Cut-off date", "date")}
          {field("submissionDeadline", "Submission deadline", "date")}
          {field("approvalDeadline", "Approval deadline", "date")}
          {field("interviewDeadline", "Interview deadline", "date")}
          {field("effectiveDate", "Effective date", "date")}
        </Section>

        <Section title="Eligibility">
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-cb">Eligible departments</Label>
            <Input className="mt-1.5 h-11 rounded-md" placeholder="e.g. Engineering, SQA, Product" {...register("departments")} />
            {errors.departments && <p className="text-xs text-destructive mt-1">{errors.departments.message}</p>}
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-cb">Eligible ranks</Label>
            <Input className="mt-1.5 h-11 rounded-md" placeholder="e.g. 11-18" {...register("ranks")} />
            {errors.ranks && <p className="text-xs text-destructive mt-1">{errors.ranks.message}</p>}
          </div>
        </Section>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-hairline">
          <Button type="button" variant="outline" onClick={submit("draft")}>Save as draft</Button>
          <Button type="button" onClick={submit("launch")}>Launch cycle</Button>
        </div>
      </form>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 pb-8 border-b border-hairline-soft last:border-0 last:pb-0">
      <div>
        <h4 className="title-sm">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}
