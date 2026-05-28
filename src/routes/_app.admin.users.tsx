import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { Search, Plus, MoreHorizontal, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/users")({ component: UsersPage });

const USERS: { id: string; name: string; email: string; role: Role; dept: string; status: "active" | "invited" | "suspended"; lastSeen: string }[] = [
  { id: "U-001", name: "Sarah Chen", email: "sarah.chen@co", role: "delivery_lead", dept: "Front-End", status: "active", lastSeen: "2m ago" },
  { id: "U-002", name: "David Park", email: "david.park@co", role: "line_manager", dept: "Front-End", status: "active", lastSeen: "1h ago" },
  { id: "U-003", name: "Priya Sharma", email: "priya.s@co", role: "hod", dept: "Engineering", status: "active", lastSeen: "4h ago" },
  { id: "U-004", name: "James Wilson", email: "james.w@co", role: "panel_member", dept: "Engineering", status: "active", lastSeen: "Yesterday" },
  { id: "U-005", name: "Michael Torres", email: "m.torres@co", role: "final_authority", dept: "People", status: "active", lastSeen: "30m ago" },
  { id: "U-006", name: "Rahul Mehta", email: "rahul.m@co", role: "employee", dept: "Front-End", status: "active", lastSeen: "10m ago" },
  { id: "U-007", name: "Aditi Verma", email: "aditi.v@co", role: "hr_admin", dept: "People", status: "active", lastSeen: "Just now" },
  { id: "U-008", name: "Carlos Mendoza", email: "c.mendoza@co", role: "auditor", dept: "Compliance", status: "active", lastSeen: "3d ago" },
  { id: "U-009", name: "Yuki Tanaka", email: "yuki.t@co", role: "employee", dept: "SQA", status: "suspended", lastSeen: "12d ago" },
  { id: "U-010", name: "Hassan Rauf", email: "hassan.r@co", role: "hod", dept: "DevOps", status: "invited", lastSeen: "—" },
];

function UsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const filtered = USERS.filter((u) => (role === "all" || u.role === role) && (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase())));

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="caption-strong text-muted-cb">System Administrator</p>
          <h1 className="display-md mt-2">Users & roles</h1>
          <p className="text-body mt-2">Provision accounts, assign roles, and review access.</p>
        </div>
        <Sheet>
          <SheetTrigger asChild><Button><Plus className="h-4 w-4" /> Invite user</Button></SheetTrigger>
          <SheetContent>
            <SheetHeader><SheetTitle>Invite a new user</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-4">
              <div><Label>Full name</Label><Input placeholder="Jane Doe" className="mt-2" /></div>
              <div><Label>Work email</Label><Input type="email" placeholder="jane@company.com" className="mt-2" /></div>
              <div>
                <Label>Role</Label>
                <Select defaultValue="employee">
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Department</Label><Input placeholder="Front-End Dev" className="mt-2" /></div>
              <div className="flex items-center justify-between pt-2"><Label>Send invite email now</Label><Switch defaultChecked /></div>
              <Button className="w-full" onClick={() => toast.success("Invite sent")}>Send invite</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="p-4 mb-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-cb" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…" className="pl-9" />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft">
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-cb">
              <th className="px-6 py-3">User</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Department</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Last active</th><th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-hairline-soft">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9"><AvatarFallback className="bg-surface-strong text-xs">{u.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                    <div><div className="font-semibold">{u.name}</div><div className="text-xs text-muted-cb">{u.email}</div></div>
                  </div>
                </td>
                <td className="px-6 py-4"><Badge variant="muted"><Shield className="h-3 w-3" /> {ROLE_LABELS[u.role]}</Badge></td>
                <td className="px-6 py-4 text-body">{u.dept}</td>
                <td className="px-6 py-4">
                  {u.status === "active" && <Badge variant="success">Active</Badge>}
                  {u.status === "invited" && <Badge variant="warning">Invited</Badge>}
                  {u.status === "suspended" && <Badge variant="destructive">Suspended</Badge>}
                </td>
                <td className="px-6 py-4 text-muted-cb">{u.lastSeen}</td>
                <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
