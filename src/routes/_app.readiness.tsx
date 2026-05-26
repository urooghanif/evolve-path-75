import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
export const Route = createFileRoute("/_app/readiness")({ component: () => <ComingSoon title="Readiness Analysis" /> });
