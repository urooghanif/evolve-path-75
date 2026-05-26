import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, STATUS_VARIANT, type CaseStatus } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: CaseStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
