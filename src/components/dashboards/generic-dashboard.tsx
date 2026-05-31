import { useAuth } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CASES } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function GenericDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const mine = CASES.slice(0, 4);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="caption-strong text-muted-cb">{ROLE_LABELS[user.role]}</p>
          <h1 className="display-md mt-2">Welcome, {user.name.split(" ")[0]}.</h1>
        </div>
        <Button asChild><Link to="/cases">Open queue <ArrowUpRight className="h-4 w-4" /></Link></Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Assigned", v: 12 },
          { l: "Pending", v: 5 },
          { l: "Completed", v: 28 },
          { l: "Overdue", v: 2 },
        ].map((m) => (
          <Card key={m.l} className="p-6">
            <div className="text-xs uppercase tracking-wide text-muted-cb">{m.l}</div>
            <div className="tabular text-3xl mt-3 text-ink">{m.v}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-hairline">
          <h2 className="title-md">Recent cases</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-right">Days</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mine.map((c) => (
              <TableRow key={c.id} className="hover:bg-surface-soft">
                <TableCell className="font-mono text-sm">{c.id}</TableCell>
                <TableCell>{c.employeeName}</TableCell>
                <TableCell className="text-body">{c.department}</TableCell>
                <TableCell><StatusBadge status={c.stage} /></TableCell>
                <TableCell className="text-right tabular">{c.daysInStage}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/cases/$caseId" params={{ caseId: c.id }}>Open <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
