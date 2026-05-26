import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
export const Route = createFileRoute("/_app/my-achievements")({ component: () => <ComingSoon title="My Achievements" /> });
