export type Locale = "en" | "ar";

export type RoleId =
  | "owner"
  | "admin"
  | "ops_manager"
  | "coordinator"
  | "hr"
  | "timesheet_clerk"
  | "accountant"
  | "finance"
  | "employee"
  | "auditor";

export type Permission =
  | "client.view"
  | "client.create"
  | "client.edit"
  | "client.archive"
  | "project.view"
  | "project.create"
  | "project.edit"
  | "project.archive"
  | "employee.view"
  | "employee.create"
  | "employee.edit"
  | "employee.archive"
  | "employee.document.view"
  | "employee.document.upload"
  | "employee.document.download"
  | "timesheet.enter"
  | "timesheet.submit"
  | "timesheet.review"
  | "timesheet.resolve_dispute"
  | "timesheet.approve"
  | "payroll.generate"
  | "payroll.review"
  | "payroll.approve"
  | "payroll.override"
  | "payroll.finalize"
  | "advance.review"
  | "advance.approve"
  | "advance.pay"
  | "invoice.create"
  | "invoice.review"
  | "invoice.finalize"
  | "invoice.void"
  | "audit.view"
  | "admin.users"
  | "admin.settings"
  | "payment.record"
  | "mobilization.approve"
  | "attendance.override"
  | "reports.view";

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info" | "gold";

export interface RoleDef {
  id: RoleId;
  label: string;
  labelAr: string;
  description: string;
  permissions: Permission[];
  modules: string[];
  scopedProjects?: string[];
}

export interface StaffUser {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: RoleId;
  title: string;
  employeeId?: string;
  mfa: boolean;
  lastLogin: string;
  status: "Active" | "Locked" | "Disabled";
  scopeLabel: string;
}

export interface ClientRecord {
  id: string;
  code: string;
  legalName: string;
  displayName: string;
  vat: string;
  cr: string;
  industry: string;
  city: string;
  region: string;
  street: string;
  postal: string;
  currency: "SAR";
  paymentTerms: string;
  defaultVat: number;
  status: "Active" | "Inactive";
  coordinator: string;
  coordinatorId: string;
  primaryContact: string;
  primaryEmail: string;
  primaryPhone: string;
  activeProjects: number;
  deployedWorkers: number;
  outstanding: number;
  lastTimesheet: string;
  notes: string;
}

export interface ContactRecord {
  id: string;
  clientId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  whatsapp: string;
  department: string;
  projectRole: string;
  receivesInvoices: boolean;
  receivesTimesheets: boolean;
  primary: boolean;
  status: "Active" | "Inactive";
}

export interface ProjectRecord {
  id: string;
  code: string;
  name: string;
  clientId: string;
  location: string;
  type: string;
  start: string;
  end: string;
  requested: number;
  deployed: number;
  timesheetCycle: "Daily" | "Weekly" | "Biweekly" | "Monthly";
  status: "Draft" | "Mobilizing" | "Active" | "Suspended" | "Closing" | "Closed";
  coordinator: string;
  coordinatorId: string;
  opsManager: string;
  contractRef: string;
  poRef: string;
  invoiceCycle: string;
  paymentTerms: string;
  description: string;
}

export interface ManpowerReq {
  id: string;
  projectId: string;
  trade: string;
  quantity: number;
  filled: number;
  from: string;
  until: string;
  minCert: string;
  extras: string[];
  status: "Open" | "Partially filled" | "Filled" | "Closed" | "Cancelled";
}

export type EmploymentType = "Direct" | "Contract" | "Temporary";
export type SalaryType = "Monthly salary" | "Daily rate" | "Hourly rate" | "Percentage" | "Custom";
export type MobilizationStatus = "Ready" | "Blocked" | "Mobilizing" | "On site" | "Demobilized";

export interface EmployeeRecord {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  nameAr: string;
  trade: string;
  nationality: string;
  gender: "Male" | "Female";
  dob: string;
  mobile: string;
  email: string;
  address: string;
  projectId: string | null;
  employmentType: EmploymentType;
  salaryType: SalaryType;
  salary: number;
  dailyRate?: number;
  hourlyRate?: number;
  joiningDate: string;
  status: "Active" | "Inactive" | "On leave" | "Archived";
  documentStatus: "Valid" | "Expiring soon" | "Expired" | "Incomplete";
  mobilization: MobilizationStatus;
  blockReason?: string;
  coordinator: string;
  branch: string;
  bank: string;
  iban: string;
  emergencyName: string;
  emergencyPhone: string;
  grade: string;
}

export interface DocumentRecord {
  id: string;
  employeeId: string;
  type: string;
  number: string;
  issueDate: string;
  expiryDate: string | null;
  issuer: string;
  fileName: string;
  verification: "Valid" | "Expiring soon" | "Expired" | "Missing" | "Awaiting verification";
  uploadedBy: string;
  uploadedDate: string;
  version: number;
  notes?: string;
}

export interface AssignmentRecord {
  id: string;
  employeeId: string;
  projectId: string;
  requirementId: string;
  trade: string;
  start: string;
  plannedEnd: string;
  actualEnd: string | null;
  clientEmployeeId: string;
  siteNumber: string;
  billingCategory: string;
  compensationPlan: string;
  shift: string;
  site: string;
  status: "Planned" | "Mobilizing" | "Active" | "On hold" | "Completed" | "Cancelled";
  notes: string;
}

export interface MobilizationCheck {
  employeeId: string;
  projectId: string;
  items: { label: string; ok: boolean; na?: boolean }[];
  status: "Ready" | "Blocked" | "Cleared";
  blockReason?: string;
}

export type DayCode = "8" | "10" | "12" | "P" | "A" | "OFF" | "L" | "SICK" | "H" | "";

export interface TimesheetRow {
  employeeId: string;
  days: Record<string, string>;
  regular: number;
  ot: number;
  employeeStatus: "Confirmed" | "Awaiting" | "Disputed" | "Not sent";
}

export interface TimesheetRecord {
  id: string;
  clientId: string;
  projectId: string;
  periodStart: string;
  periodEnd: string;
  source: "PDF" | "Excel" | "Image" | "Scan" | "Physical" | "Text";
  fileName: string;
  expected: number;
  entered: number;
  received: string;
  status:
    | "New"
    | "Being entered"
    | "Validation issue"
    | "Ready for employee review"
    | "Employee review"
    | "Disputed"
    | "Coordinator review"
    | "Approved"
    | "Payroll processed"
    | "Invoiced";
  clerk: string;
  issues: number;
  regularHours: number;
  otHours: number;
  absences: number;
  confirmed: number;
  awaiting: number;
  disputed: number;
}

export interface DisputeRecord {
  id: string;
  timesheetId: string;
  employeeId: string;
  date: string;
  clientEntry: string;
  employeeClaim: string;
  note: string;
  status: "Waiting for client clarification" | "Coordinator review" | "Resolved" | "Kept client entry";
}

export interface AdvanceRecord {
  id: string;
  employeeId: string;
  requested: number;
  approved: number | null;
  paid: number;
  recovered: number;
  outstanding: number;
  reason: string;
  recovery: "Next salary" | "Installments";
  status:
    | "Requested"
    | "Under review"
    | "Approved"
    | "Partially approved"
    | "Rejected"
    | "Paid"
    | "Recovering"
    | "Recovered"
    | "Cancelled";
  requestedOn: string;
}

export interface PayrollRun {
  id: string;
  period: string;
  monthKey: string;
  employees: number;
  gross: number;
  deductions: number;
  advances: number;
  overrides: number;
  net: number;
  status: "Draft" | "Pre-check" | "Calculated" | "Awaiting approval" | "Finalized" | "Paid";
}

export interface InvoiceRecord {
  id: string;
  clientId: string;
  projectId: string;
  period: string;
  subtotal: number;
  vat: number;
  total: number;
  paid: number;
  outstanding: number;
  status:
    | "Draft"
    | "Awaiting review"
    | "Approved"
    | "Pending ZATCA"
    | "Issued"
    | "Partially paid"
    | "Paid"
    | "Overdue"
    | "Voided";
  zatca: "Not submitted" | "Pending clearance" | "Cleared" | "Rejected";
  issued: string;
}

export interface PaymentRecord {
  id: string;
  kind: "Salary batch" | "Client receipt";
  reference: string;
  date: string;
  amount: number;
  status: "Draft" | "Submitted" | "Paid" | "Partial" | "Failed" | "Reconciled";
  party: string;
  notes: string;
}

export interface AuditEvent {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  record: string;
  change: string;
  reason: string;
  ip: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleAr: string;
  body: string;
  href: string;
  time: string;
  read: boolean;
  tone: StatusTone;
}

export interface ApprovalItem {
  id: string;
  category: string;
  title: string;
  who: string;
  why: string;
  impact: string;
  href: string;
  status: "Waiting" | "Approved" | "Rejected" | "Returned";
}

export interface NavItem {
  to: string;
  label: string;
  labelAr: string;
  icon: string;
  module: string;
  permission?: Permission;
}
