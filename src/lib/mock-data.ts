export type CaseStatus =
  | "draft"
  | "submitted"
  | "dl_review"
  | "lm_review"
  | "hod_review"
  | "interview_required"
  | "panel_evaluation"
  | "final_approval"
  | "hr_validation"
  | "completed"
  | "rejected"
  | "deferred";

export const STATUS_LABEL: Record<CaseStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  dl_review: "Pending DL Review",
  lm_review: "Pending LM Review",
  hod_review: "Pending HOD Review",
  interview_required: "Interview Required",
  panel_evaluation: "Panel Evaluation",
  final_approval: "Pending Final Approval",
  hr_validation: "Pending HR Validation",
  completed: "Completed",
  rejected: "Rejected",
  deferred: "Deferred",
};

export const STATUS_VARIANT: Record<CaseStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  draft: "secondary",
  submitted: "default",
  dl_review: "default",
  lm_review: "default",
  hod_review: "default",
  interview_required: "outline",
  panel_evaluation: "outline",
  final_approval: "default",
  hr_validation: "default",
  completed: "success",
  rejected: "destructive",
  deferred: "warning",
};

export type Cycle = {
  id: string;
  name: string;
  type: "March" | "October";
  status: "draft" | "active" | "closed";
  cutoffDate: string;
  effectiveDate: string;
  submissionDeadline: string;
};

export const CYCLES: Cycle[] = [
  { id: "CY-2026-03", name: "March 2026 Promotion Cycle", type: "March", status: "active", cutoffDate: "2026-02-28", effectiveDate: "2026-04-01", submissionDeadline: "2026-06-10" },
  { id: "CY-2026-10", name: "October 2026 Promotion Cycle", type: "October", status: "draft", cutoffDate: "2026-09-30", effectiveDate: "2026-11-01", submissionDeadline: "2026-10-15" },
];

export type PromotionCase = {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  currentRank: number;
  proposedRank: number;
  proposedDesignation: string;
  stage: CaseStatus;
  daysInStage: number;
  overdue: boolean;
  rank16Plus: boolean;
};

export const CASES: PromotionCase[] = [
  { id: "PC-1001", employeeName: "Ahmed Raza", employeeId: "U-EMP-07", department: "Front-End Dev", currentRank: 13, proposedRank: 14, proposedDesignation: "Lead Engineer", stage: "submitted", daysInStage: 2, overdue: false, rank16Plus: false },
  { id: "PC-1002", employeeName: "Ayesha Siddiqa", employeeId: "E-208", department: "Back-End Dev", currentRank: 14, proposedRank: 15, proposedDesignation: "Staff Engineer", stage: "dl_review", daysInStage: 5, overdue: false, rank16Plus: false },
  { id: "PC-1003", employeeName: "Bilal Hussain", employeeId: "E-311", department: "SQA", currentRank: 15, proposedRank: 16, proposedDesignation: "QA Architect", stage: "interview_required", daysInStage: 9, overdue: true, rank16Plus: true },
  { id: "PC-1004", employeeName: "Hira Nawaz", employeeId: "E-402", department: "Front-End Dev", currentRank: 13, proposedRank: 14, proposedDesignation: "Lead Engineer", stage: "lm_review", daysInStage: 3, overdue: false, rank16Plus: false },
  { id: "PC-1005", employeeName: "Faisal Iqbal", employeeId: "E-512", department: "Back-End Dev", currentRank: 16, proposedRank: 17, proposedDesignation: "Principal Engineer", stage: "panel_evaluation", daysInStage: 12, overdue: true, rank16Plus: true },
  { id: "PC-1006", employeeName: "Mariam Asif", employeeId: "E-619", department: "SQA", currentRank: 14, proposedRank: 15, proposedDesignation: "Senior QA Engineer", stage: "hod_review", daysInStage: 1, overdue: false, rank16Plus: false },
  { id: "PC-1007", employeeName: "Zain Abbas", employeeId: "E-708", department: "Front-End Dev", currentRank: 15, proposedRank: 16, proposedDesignation: "Engineering Manager", stage: "final_approval", daysInStage: 6, overdue: false, rank16Plus: true },
  { id: "PC-1008", employeeName: "Sadia Khan", employeeId: "E-822", department: "Back-End Dev", currentRank: 13, proposedRank: 14, proposedDesignation: "Lead Engineer", stage: "completed", daysInStage: 0, overdue: false, rank16Plus: false },
  { id: "PC-1009", employeeName: "Adnan Mehmood", employeeId: "E-901", department: "SQA", currentRank: 13, proposedRank: 14, proposedDesignation: "Lead QA", stage: "deferred", daysInStage: 18, overdue: true, rank16Plus: false },
];

export const STAGE_COUNTS = () => {
  const out: Record<string, number> = {};
  CASES.forEach((c) => (out[c.stage] = (out[c.stage] || 0) + 1));
  return out;
};

export const SKILL_DICTIONARY = [
  { name: "React", category: "Front-End", levels: 5 },
  { name: "TypeScript", category: "Languages", levels: 5 },
  { name: "Node.js", category: "Back-End", levels: 5 },
  { name: "System Design", category: "Architecture", levels: 5 },
  { name: "Test Automation", category: "SQA", levels: 5 },
  { name: "Mentoring", category: "Leadership", levels: 5 },
  { name: "Stakeholder Management", category: "Leadership", levels: 5 },
  { name: "Performance Tuning", category: "Engineering", levels: 5 },
  { name: "GraphQL", category: "Back-End", levels: 5 },
  { name: "Accessibility (WCAG)", category: "Front-End", levels: 5 },
];

export const ACHIEVEMENT_CATEGORIES = [
  "Technical Excellence",
  "Project Delivery",
  "Mentoring & Leadership",
  "Innovation",
  "Process Improvement",
  "Customer Impact",
];

export const REQUIRED_SKILLS_FOR_RANK_14_FE = [
  { skill: "React", required: 4 },
  { skill: "TypeScript", required: 4 },
  { skill: "System Design", required: 3 },
  { skill: "Mentoring", required: 3 },
  { skill: "Accessibility (WCAG)", required: 3 },
];
