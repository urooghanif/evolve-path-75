import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { HrDashboard } from "@/components/dashboards/hr-dashboard";
import { EmployeeDashboard } from "@/components/dashboards/employee-dashboard";
import { GenericDashboard } from "@/components/dashboards/generic-dashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardRouter,
});

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;
  switch (user.role) {
    case "hr_admin":
      return <HrDashboard />;
    case "employee":
      return <EmployeeDashboard />;
    default:
      return <GenericDashboard />;
  }
}
