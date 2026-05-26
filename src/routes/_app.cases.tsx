import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
export const Route = createFileRoute("/_app/cases")({ component: () => <ComingSoon title="Promotion Cases" /> });
