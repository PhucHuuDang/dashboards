export { SalaryHistorySheet } from "./salary-history-sheet";
export { PromotionHistorySheet } from "./promotion-history-sheet";
export { AttendanceSheet } from "./attendance-sheet";
export { LeaveRequestsSheet } from "./leave-requests-sheet";
export { EquipmentSheet } from "./equipment-sheet";
export { KPIBreakdownSheet } from "./kpi-breakdown-sheet";
export { SkillMatrixSheet } from "./skill-matrix-sheet";
export { AccessPermissionsSheet } from "./access-permissions-sheet";
export { TransferDepartmentDialog } from "./transfer-department-dialog";
export { TerminateEmploymentDialog } from "./terminate-employment-dialog";

export type EmployeeActionVariant =
  | "view"
  | "assign-task"
  | "salary-history"
  | "promotion-history"
  | "attendance"
  | "leave-requests"
  | "equipment"
  | "kpi-breakdown"
  | "skill-matrix"
  | "access-permissions"
  | "transfer-department"
  | "terminate";
