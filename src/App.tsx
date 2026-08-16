import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "@/store/AppState";
import { AppShell, PortalShell } from "@/components/layout/AppShell";
import { ForgotPage, LoginPage } from "@/screens/auth/LoginPage";
import { HomePage } from "@/screens/dashboards/HomePage";
import {
  ClientDetailPage,
  ClientFormPage,
  ClientListPage,
} from "@/screens/clients/Clients";
import {
  AssignmentDetailPage,
  AssignmentFormPage,
  AssignmentListPage,
  ManpowerDetailPage,
  ManpowerFormPage,
  ManpowerListPage,
  ProjectDetailPage,
  ProjectFormPage,
  ProjectListPage,
} from "@/screens/projects/Projects";
import { CompensationFormPage, EmployeeDetailPage, EmployeeFormPage, EmployeeListPage } from "@/screens/employees/Employees";
import {
  DisputeDetailPage,
  DisputeList,
  TimesheetDetailPage,
  TimesheetEnterPage,
  TimesheetListPage,
  TimesheetUploadPage,
  TimesheetValidatePage,
} from "@/screens/timesheets/Timesheets";
import {
  AttendanceDetailPage,
  AttendancePage,
  DocumentDetailPage,
  DocumentLibraryPage,
  DocumentUploadPage,
  ExpiryMonitorPage,
  MobilizationDetailPage,
  MobilizationPage,
  OverridePage,
} from "@/screens/compliance/Compliance";
import {
  AdvanceDetailPage,
  AdvanceListPage,
  AdvanceNewPage,
  InvoiceDetailPage,
  InvoiceListPage,
  InvoiceNewPage,
  PaymentDetailPage,
  PaymentListPage,
  PaymentNewPage,
  PayrollApprovePage,
  PayrollEmployeePage,
  PayrollListPage,
  PayrollNewPage,
  PayrollPrecheckPage,
  PayrollWorkspacePage,
  RateCardDetailPage,
  RateCardListPage,
} from "@/screens/finance/Finance";
import {
  PortalAdvanceNew,
  PortalAdvances,
  PortalContest,
  PortalDocuments,
  PortalHome,
  PortalPayslips,
  PortalProfile,
  PortalTimesheetDetail,
  PortalTimesheets,
} from "@/screens/portal/Portal";
import {
  ApprovalsPage,
  AuditPage,
  HelpPage,
  ImportCenterPage,
  ImportWizardPage,
  InviteUserPage,
  MasterDataPage,
  NotFoundPage,
  NotificationsPage,
  PrototypeMapPage,
  ReportDetailPage,
  ReportsPage,
  RoleDetailPage,
  RoleListPage,
  SettingsPage,
  StatesPage,
  TemplateDetailPage,
  TemplatesPage,
  UserDetailPage,
  UserListPage,
} from "@/screens/admin/Admin";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPage />} />
          <Route element={<PortalShell />}>
            <Route path="/portal" element={<PortalHome />} />
            <Route path="/portal/timesheets" element={<PortalTimesheets />} />
            <Route path="/portal/timesheets/:id" element={<PortalTimesheetDetail />} />
            <Route path="/portal/timesheets/:id/contest" element={<PortalContest />} />
            <Route path="/portal/advances" element={<PortalAdvances />} />
            <Route path="/portal/advances/new" element={<PortalAdvanceNew />} />
            <Route path="/portal/documents" element={<PortalDocuments />} />
            <Route path="/portal/profile" element={<PortalProfile />} />
            <Route path="/portal/payslips" element={<PortalPayslips />} />
          </Route>
          <Route element={<AppShell />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/prototype" element={<PrototypeMapPage />} />
            <Route path="/clients" element={<ClientListPage />} />
            <Route path="/clients/new" element={<ClientFormPage mode="create" />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/clients/:id/edit" element={<ClientFormPage mode="edit" />} />
            <Route path="/projects" element={<ProjectListPage />} />
            <Route path="/projects/new" element={<ProjectFormPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="/manpower" element={<ManpowerListPage />} />
            <Route path="/manpower/new" element={<ManpowerFormPage />} />
            <Route path="/manpower/:id" element={<ManpowerDetailPage />} />
            <Route path="/assignments" element={<AssignmentListPage />} />
            <Route path="/assignments/new" element={<AssignmentFormPage />} />
            <Route path="/assignments/:id" element={<AssignmentDetailPage />} />
            <Route path="/assignments/:id/edit" element={<AssignmentFormPage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/employees/new" element={<EmployeeFormPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
            <Route path="/employees/:id/compensation/new" element={<CompensationFormPage />} />
            <Route path="/documents" element={<DocumentLibraryPage />} />
            <Route path="/documents/upload" element={<DocumentUploadPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/expiry" element={<ExpiryMonitorPage />} />
            <Route path="/mobilization" element={<MobilizationPage />} />
            <Route path="/mobilization/:id" element={<MobilizationDetailPage />} />
            <Route path="/timesheets" element={<TimesheetListPage />} />
            <Route path="/timesheets/upload" element={<TimesheetUploadPage />} />
            <Route path="/timesheets/:id" element={<TimesheetDetailPage />} />
            <Route path="/timesheets/:id/enter" element={<TimesheetEnterPage />} />
            <Route path="/timesheets/:id/validate" element={<TimesheetValidatePage />} />
            <Route path="/timesheets/:id/disputes" element={<DisputeList />} />
            <Route path="/timesheets/:id/disputes/:disputeId" element={<DisputeDetailPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/attendance/:id" element={<AttendanceDetailPage />} />
            <Route path="/attendance/overrides/:id" element={<OverridePage />} />
            <Route path="/payroll" element={<PayrollListPage />} />
            <Route path="/payroll/new" element={<PayrollNewPage />} />
            <Route path="/payroll/:id" element={<PayrollWorkspacePage />} />
            <Route path="/payroll/:id/precheck" element={<PayrollPrecheckPage />} />
            <Route path="/payroll/:id/approve" element={<PayrollApprovePage />} />
            <Route path="/payroll/:id/employees/:empId" element={<PayrollEmployeePage />} />
            <Route path="/advances" element={<AdvanceListPage />} />
            <Route path="/advances/new" element={<AdvanceNewPage />} />
            <Route path="/advances/:id" element={<AdvanceDetailPage />} />
            <Route path="/rate-cards" element={<RateCardListPage />} />
            <Route path="/rate-cards/:id" element={<RateCardDetailPage />} />
            <Route path="/invoices" element={<InvoiceListPage />} />
            <Route path="/invoices/new" element={<InvoiceNewPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="/payments" element={<PaymentListPage />} />
            <Route path="/payments/new" element={<PaymentNewPage />} />
            <Route path="/payments/:id" element={<PaymentDetailPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:slug" element={<ReportDetailPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/admin/users" element={<UserListPage />} />
            <Route path="/admin/users/invite" element={<InviteUserPage />} />
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
            <Route path="/admin/roles" element={<RoleListPage />} />
            <Route path="/admin/roles/new" element={<RoleDetailPage />} />
            <Route path="/admin/roles/:id" element={<RoleDetailPage />} />
            <Route path="/admin/master" element={<MasterDataPage />} />
            <Route path="/import" element={<ImportCenterPage />} />
            <Route path="/import/new" element={<ImportWizardPage />} />
            <Route path="/import/:id" element={<ImportWizardPage />} />
            <Route path="/timesheet-templates" element={<TemplatesPage />} />
            <Route path="/timesheet-templates/:id" element={<TemplateDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/states" element={<StatesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
