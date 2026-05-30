import { CASES, type PromotionCase, type CaseStatus } from "./mock-data";

export type Achievement = {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: string;
  metrics: string;
  date: string;
  evidence: { name: string; type: string; size: string }[];
  skills: string[];
  aiScore: number;
};

export type Evaluation = {
  reviewer: string;
  reviewerRole: string;
  date: string;
  decision: "endorsed" | "rejected" | "deferred" | "pending";
  rating: number;
  strengths: string;
  gaps: string;
  recommendation: string;
};

export type TimelineEvent = {
  date: string;
  time: string;
  actor: string;
  action: string;
  stage: CaseStatus;
  note?: string;
};

export type SkillAssessment = {
  skill: string;
  required: number;
  current: number;
};

export type CaseDetail = PromotionCase & {
  employeeEmail: string;
  managerName: string;
  hireDate: string;
  tenureYears: number;
  lastPromotion: string;
  achievements: Achievement[];
  evaluations: Evaluation[];
  timeline: TimelineEvent[];
  skills: SkillAssessment[];
  interviewScheduled?: { date: string; time: string; panel: string[] };
  finalDecision?: { decision: string; effectiveDate: string; newSalary: string };
};

const baseAchievements = (caseId: string): Achievement[] => [
  {
    id: `${caseId}-A1`,
    category: "Technical Excellence",
    title: "Re-architected design-system component library",
    description:
      "Led the migration of 84 legacy components to a token-driven, accessible design system. Established Storybook coverage and visual-regression CI.",
    impact:
      "Reduced UI defect rate by 38% and cut new-feature build time by 22% across 6 product squads.",
    metrics: "84 components migrated · 38% defect reduction · 22% faster delivery",
    date: "2025-11-14",
    evidence: [
      { name: "design-system-rfc.pdf", type: "PDF", size: "1.2 MB" },
      { name: "defect-trend-q3.png", type: "Image", size: "412 KB" },
    ],
    skills: ["React", "TypeScript", "Accessibility (WCAG)", "System Design"],
    aiScore: 92,
  },
  {
    id: `${caseId}-A2`,
    category: "Mentoring & Leadership",
    title: "Front-end guild lead",
    description:
      "Established a cross-team front-end guild. Ran bi-weekly RFC reviews and a 12-week internal React deep-dive curriculum for 18 engineers.",
    impact:
      "9 mentees promoted in the same cycle. Internal NPS for engineering enablement up 31 points.",
    metrics: "18 mentees · 24 RFCs reviewed · 9 promotions",
    date: "2025-09-02",
    evidence: [{ name: "guild-roadmap.pdf", type: "PDF", size: "880 KB" }],
    skills: ["Mentoring", "Stakeholder Management"],
    aiScore: 88,
  },
  {
    id: `${caseId}-A3`,
    category: "Project Delivery",
    title: "Checkout funnel performance overhaul",
    description:
      "Owned the technical plan to bring LCP below 1.8s on the checkout funnel for the top-3 markets. Coordinated 3 squads and the platform team.",
    impact: "Conversion +4.6%, +$3.1M annualised revenue. Zero rollback incidents.",
    metrics: "LCP 3.4s → 1.6s · +4.6% conversion · +$3.1M ARR",
    date: "2025-07-21",
    evidence: [
      { name: "perf-readout.pdf", type: "PDF", size: "2.1 MB" },
      { name: "lighthouse-before-after.png", type: "Image", size: "640 KB" },
    ],
    skills: ["Performance Tuning", "System Design", "Stakeholder Management"],
    aiScore: 95,
  },
];

const baseSkills = (): SkillAssessment[] => [
  { skill: "React", required: 4, current: 5 },
  { skill: "TypeScript", required: 4, current: 4 },
  { skill: "System Design", required: 4, current: 3 },
  { skill: "Mentoring", required: 3, current: 4 },
  { skill: "Accessibility (WCAG)", required: 3, current: 4 },
  { skill: "Performance Tuning", required: 3, current: 4 },
  { skill: "Stakeholder Management", required: 4, current: 3 },
];

const baseEvaluations = (stage: CaseStatus): Evaluation[] => {
  const out: Evaluation[] = [];
  const order: CaseStatus[] = ["dl_review", "lm_review", "hod_review", "panel_evaluation", "final_approval"];
  const rolesPerStage: Record<string, { reviewer: string; role: string }> = {
    dl_review: { reviewer: "Bilal Ahmad", role: "Delivery Lead" },
    lm_review: { reviewer: "Usman Tariq", role: "Line Manager" },
    hod_review: { reviewer: "Sana Malik", role: "Head of Engineering" },
    panel_evaluation: { reviewer: "Interview Panel", role: "Panel" },
    final_approval: { reviewer: "Imran Siddiqui", role: "Chief People Officer" },
  };
  const stageIdx = order.indexOf(stage);
  const completed = stageIdx === -1 ? order.length : stageIdx;
  for (let i = 0; i < completed; i++) {
    const meta = rolesPerStage[order[i]];
    out.push({
      reviewer: meta.reviewer,
      reviewerRole: meta.role,
      date: `2026-01-${10 + i * 3}`,
      decision: "endorsed",
      rating: 4 + (i % 2),
      strengths:
        "Strong technical leadership, measurable delivery impact, and consistent mentoring track record across squads.",
      gaps:
        "Stakeholder management at executive level still developing — recommend exposure to quarterly business reviews.",
      recommendation:
        "Endorse promotion. Candidate is operating at the next rank for the past two cycles.",
    });
  }
  if (stageIdx !== -1) {
    out.push({
      reviewer: rolesPerStage[stage]?.reviewer || "Reviewer",
      reviewerRole: rolesPerStage[stage]?.role || "Reviewer",
      date: "Pending",
      decision: "pending",
      rating: 0,
      strengths: "",
      gaps: "",
      recommendation: "",
    });
  }
  return out;
};

const baseTimeline = (c: PromotionCase): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    { date: "2026-01-04", time: "09:12", actor: c.employeeName, action: "Submitted promotion case", stage: "submitted" },
    { date: "2026-01-04", time: "09:13", actor: "System", action: "Eligibility checks passed (tenure, performance, last promotion)", stage: "submitted" },
    { date: "2026-01-05", time: "11:40", actor: "Bilal Ahmad", action: "Endorsed — Delivery Lead review", stage: "dl_review", note: "Strong delivery record this cycle." },
  ];
  if (["lm_review", "hod_review", "interview_required", "panel_evaluation", "final_approval", "hr_validation", "completed"].includes(c.stage)) {
    events.push({ date: "2026-01-08", time: "14:02", actor: "Usman Tariq", action: "Endorsed — Line Manager review", stage: "lm_review" });
  }
  if (["hod_review", "interview_required", "panel_evaluation", "final_approval", "hr_validation", "completed"].includes(c.stage)) {
    events.push({ date: "2026-01-12", time: "10:15", actor: "Sana Malik", action: "Endorsed — HOD review", stage: "hod_review" });
  }
  if (c.rank16Plus) {
    events.push({ date: "2026-01-13", time: "09:00", actor: "System", action: "Interview required (Rank 16+ promotion)", stage: "interview_required" });
  }
  return events;
};

const cache = new Map<string, CaseDetail>();

export function getCaseDetail(caseId: string): CaseDetail | undefined {
  if (cache.has(caseId)) return cache.get(caseId);
  const base = CASES.find((c) => c.id === caseId);
  if (!base) return undefined;
  const detail: CaseDetail = {
    ...base,
    employeeEmail: `${base.employeeName.toLowerCase().replace(/\s+/g, ".")}@company.com`,
    managerName: "Usman Tariq",
    hireDate: "2019-08-15",
    tenureYears: 6.4,
    lastPromotion: "2024-04-01",
    achievements: baseAchievements(base.id),
    evaluations: baseEvaluations(base.stage),
    timeline: baseTimeline(base),
    skills: baseSkills(),
    interviewScheduled: base.rank16Plus
      ? { date: "2026-01-22", time: "15:00 IST", panel: ["Hamza Sheikh", "Sana Malik", "External: Dr. Rashid Mahmood"] }
      : undefined,
    finalDecision:
      base.stage === "completed"
        ? { decision: "Approved", effectiveDate: "2026-04-01", newSalary: "Band 14 · ₹42L CTC" }
        : undefined,
  };
  cache.set(caseId, detail);
  return detail;
}

export function listCasesForRole(role: string): PromotionCase[] {
  switch (role) {
    case "delivery_lead":
      return CASES.filter((c) => ["submitted", "dl_review"].includes(c.stage)).concat(
        CASES.filter((c) => !["submitted", "dl_review"].includes(c.stage)).slice(0, 3),
      );
    case "line_manager":
      return CASES.filter((c) => c.stage === "lm_review").concat(CASES.slice(0, 4));
    case "hod":
      return CASES.filter((c) => c.stage === "hod_review").concat(CASES.slice(0, 5));
    case "panel_member":
      return CASES.filter((c) => c.rank16Plus);
    case "final_authority":
      return CASES.filter((c) => c.stage === "final_approval").concat(CASES.filter((c) => c.stage === "hr_validation"));
    default:
      return CASES;
  }
}
