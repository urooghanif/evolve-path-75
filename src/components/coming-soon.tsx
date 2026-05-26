import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function ComingSoon({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <Card className="p-12 text-center">
        <Construction className="h-10 w-10 mx-auto text-primary" />
        <h1 className="display-sm mt-6">{title}</h1>
        <p className="text-body mt-3">{subtitle || "This module ships in the next phase. Sidebar navigation is wired so you can preview the full structure."}</p>
      </Card>
    </div>
  );
}
