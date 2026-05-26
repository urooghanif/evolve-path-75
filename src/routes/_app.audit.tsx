import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
export const Route = createFileRoute("/_app/audit")({ component: () => <ComingSoon title="Audit Trail" /> });
