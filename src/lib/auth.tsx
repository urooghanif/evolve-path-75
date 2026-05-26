import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role } from "./roles";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  rank: number;
  designation: string;
  avatarColor: string;
};

const STORAGE_KEY = "hrms_demo_user";

const DEMO_USERS: Record<Role, DemoUser> = {
  hr_admin: { id: "U-HR-01", name: "Aisha Khan", email: "aisha.khan@company.com", role: "hr_admin", department: "Human Resources", rank: 18, designation: "HR Director", avatarColor: "#0052ff" },
  employee: { id: "U-EMP-07", name: "Rahul Mehta", email: "rahul.mehta@company.com", role: "employee", department: "Engineering — Front-End", rank: 13, designation: "Senior Software Engineer", avatarColor: "#05b169" },
  delivery_lead: { id: "U-DL-02", name: "Sarah Chen", email: "sarah.chen@company.com", role: "delivery_lead", department: "Engineering", rank: 16, designation: "Delivery Lead", avatarColor: "#f4b000" },
  line_manager: { id: "U-LM-03", name: "David Park", email: "david.park@company.com", role: "line_manager", department: "Engineering — Front-End", rank: 15, designation: "Engineering Manager", avatarColor: "#cf202f" },
  hod: { id: "U-HOD-01", name: "Priya Sharma", email: "priya.sharma@company.com", role: "hod", department: "Engineering", rank: 17, designation: "Head of Engineering", avatarColor: "#0052ff" },
  panel_member: { id: "U-PM-04", name: "James Wilson", email: "james.wilson@company.com", role: "panel_member", department: "Engineering", rank: 17, designation: "Principal Engineer", avatarColor: "#05b169" },
  final_authority: { id: "U-FA-01", name: "Michael Torres", email: "michael.torres@company.com", role: "final_authority", department: "Executive", rank: 19, designation: "Chief People Officer", avatarColor: "#0a0b0d" },
  system_admin: { id: "U-SA-01", name: "Linda Wu", email: "linda.wu@company.com", role: "system_admin", department: "IT", rank: 16, designation: "Systems Administrator", avatarColor: "#7c828a" },
  auditor: { id: "U-AU-01", name: "Robert Davis", email: "robert.davis@company.com", role: "auditor", department: "Compliance", rank: 16, designation: "Internal Auditor", avatarColor: "#5b616e" },
};

type AuthCtx = {
  user: DemoUser | null;
  loginAs: (role: Role) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const loginAs = (role: Role) => {
    const u = DEMO_USERS[role];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loginAs, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}

export { DEMO_USERS };
