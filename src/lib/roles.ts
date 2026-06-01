import {
  LayoutDashboard,
  CalendarRange,
  Users,
  Briefcase,
  Settings,
  ScrollText,
  ClipboardList,
  Target,
  FileCheck,
  Gavel,
  UserCheck,
  Award,
  ShieldCheck,
  FilePlus,
  History,
  Sparkles,
  Building2,
  Crown,
} from "lucide-react";

export type Role =
  | "hr_admin"
  | "employee"
  | "delivery_lead"
  | "line_manager"
  | "hod"
  | "panel_member"
  | "final_authority"
  | "c_level"
  | "system_admin"
  | "auditor";

export const ROLE_LABELS: Record<Role, string> = {
  hr_admin: "HR Admin",
  employee: "Employee",
  delivery_lead: "Delivery Lead",
  line_manager: "Line Manager",
  hod: "Head of Department",
  panel_member: "Interview Panel Member",
  final_authority: "Final Approval Authority",
  c_level: "C-Level Executive",
  system_admin: "System Administrator",
  auditor: "Auditor / Viewer",
};

export type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

export const ROLE_NAV: Record<Role, NavItem[]> = {
  hr_admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cycles", label: "Promotion Cycles", icon: CalendarRange },
    { to: "/eligibility", label: "Eligibility Engine", icon: Target },
    { to: "/cases", label: "Promotion Cases", icon: Briefcase },
    { to: "/panels", label: "Interview Panels", icon: Users },
    { to: "/letters", label: "Letters", icon: FileCheck },
    { to: "/admin/users", label: "HR Roles & Permissions", icon: ShieldCheck },
    { to: "/reports", label: "Reports", icon: ScrollText },
    { to: "/config", label: "Configuration", icon: Settings },
    { to: "/audit", label: "Audit Trail", icon: History },
  ],
  employee: [
    { to: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { to: "/submit", label: "Submit Achievements", icon: FilePlus },
    { to: "/my-achievements", label: "My Achievements", icon: Award },
    { to: "/readiness", label: "Readiness Analysis", icon: Sparkles },
    { to: "/cases", label: "My Promotion Case", icon: Briefcase },
  ],
  delivery_lead: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cases", label: "My Cases", icon: ClipboardList },
  ],
  line_manager: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cases", label: "Team Cases", icon: ClipboardList },
    { to: "/submit", label: "My Submission", icon: FilePlus },
    { to: "/my-achievements", label: "My Achievements", icon: Award },
    { to: "/readiness", label: "My Readiness", icon: Sparkles },
  ],
  hod: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cases", label: "Department Cases", icon: Building2 },
  ],
  panel_member: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cases", label: "My Evaluations", icon: UserCheck },
  ],
  final_authority: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cases", label: "Pending Approvals", icon: Gavel },
    { to: "/letters", label: "Letters", icon: FileCheck },
  ],
  c_level: [
    { to: "/dashboard", label: "Executive Dashboard", icon: Crown },
    { to: "/cases", label: "C-Level Approvals", icon: Gavel },
    { to: "/reports", label: "Org Reports", icon: ScrollText },
  ],
  system_admin: [
    { to: "/admin/users", label: "Users & Roles", icon: Users },
    { to: "/cases", label: "Promotion Cases", icon: Briefcase },
    { to: "/config", label: "Master Data", icon: Settings },
    { to: "/admin/system", label: "System Settings", icon: ShieldCheck },
    { to: "/audit", label: "Audit Trail", icon: History },
  ],
  auditor: [
    { to: "/cases", label: "Promotion Cases", icon: Briefcase },
    { to: "/audit", label: "Audit Trail", icon: FileCheck },
  ],
};
