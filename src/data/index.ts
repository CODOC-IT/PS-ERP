import { CLIENTS } from "./clients";
import { PROJECTS, REQUIREMENTS } from "./projects";
import { EMPLOYEES } from "./employees";

export { CLIENTS, CONTACTS } from "./clients";
export { PROJECTS, REQUIREMENTS } from "./projects";
export { EMPLOYEES, employeeById, employeeName } from "./employees";
export { DOCUMENTS, ASSIGNMENTS, MOBILIZATION } from "./compliance";
export { TIMESHEETS, TIMESHEET_ROWS, DISPUTES, TS_DAYS, VALIDATION_ISSUES } from "./timesheets";
export {
  PAYROLL_RUNS,
  ADVANCES,
  INVOICES,
  PAYMENTS,
  APPROVALS,
  NOTIFICATIONS,
  AUDIT,
  RATE_CARDS,
  PAYROLL_LINES,
} from "./finance";
export { ROLES, USERS, roleById, userForRole, can, canModule } from "./roles";
export * from "./master";

export function clientById(id: string) {
  return CLIENTS.find((c) => c.id === id);
}

export function projectById(id: string) {
  return PROJECTS.find((p) => p.id === id);
}

export function projectByCode(code: string) {
  return PROJECTS.find((p) => p.code === code);
}

export function reqsForProject(projectId: string) {
  return REQUIREMENTS.filter((r) => r.projectId === projectId);
}

export function employeesForProject(projectId: string) {
  return EMPLOYEES.filter((e) => e.projectId === projectId);
}
