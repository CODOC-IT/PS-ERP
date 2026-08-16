import type { NavItem, Permission, RoleId } from "@/lib/types";
import { can, canModule, roleById } from "@/data/roles";

export const NAV_GROUPS: { id: string; label: string; labelAr: string; items: NavItem[] }[] = [
  {
    id: "home",
    label: "",
    labelAr: "",
        items: [{ to: "/home", label: "Home", labelAr: "الرئيسية", icon: "home", module: "home" }],
  },
  {
    id: "ops",
    label: "Operations",
    labelAr: "العمليات",
    items: [
      { to: "/clients", label: "Clients", labelAr: "العملاء", icon: "building", module: "clients", permission: "client.view" },
      { to: "/projects", label: "Projects", labelAr: "المشاريع", icon: "folder", module: "projects", permission: "project.view" },
      { to: "/manpower", label: "Manpower", labelAr: "القوى العاملة", icon: "hardhat", module: "manpower", permission: "project.view" },
      { to: "/employees", label: "Employees", labelAr: "الموظفون", icon: "users", module: "employees", permission: "employee.view" },
      { to: "/assignments", label: "Assignments", labelAr: "التعيينات", icon: "link", module: "employees", permission: "employee.view" },
      { to: "/mobilization", label: "Mobilization", labelAr: "التجهيز", icon: "truck", module: "mobilization" },
      { to: "/timesheets", label: "Timesheets", labelAr: "الجداول", icon: "calendar", module: "timesheets" },
      { to: "/attendance", label: "Attendance", labelAr: "الحضور", icon: "clipboard", module: "attendance" },
    ],
  },
  {
    id: "fin",
    label: "Finance",
    labelAr: "المالية",
    items: [
      { to: "/payroll", label: "Payroll", labelAr: "الرواتب", icon: "wallet", module: "payroll" },
      { to: "/advances", label: "Salary Advances", labelAr: "السلف", icon: "banknote", module: "advances" },
      { to: "/invoices", label: "Invoices", labelAr: "الفواتير", icon: "filetext", module: "invoices" },
      { to: "/payments", label: "Payments", labelAr: "المدفوعات", icon: "creditcard", module: "payments" },
      { to: "/rate-cards", label: "Rate Cards", labelAr: "تعرفة العملاء", icon: "tags", module: "invoices" },
    ],
  },
  {
    id: "comp",
    label: "Compliance",
    labelAr: "الامتثال",
    items: [
      { to: "/documents", label: "Documents", labelAr: "الوثائق", icon: "files", module: "documents", permission: "employee.document.view" },
      { to: "/expiry", label: "Expiry Monitor", labelAr: "مراقبة الانتهاء", icon: "alert", module: "expiry" },
    ],
  },
  {
    id: "mgmt",
    label: "Management",
    labelAr: "الإدارة",
    items: [
      { to: "/approvals", label: "Approvals", labelAr: "الاعتمادات", icon: "check", module: "approvals" },
      { to: "/reports", label: "Reports", labelAr: "التقارير", icon: "chart", module: "reports", permission: "reports.view" },
      { to: "/audit", label: "Audit Log", labelAr: "سجل المراجعة", icon: "scroll", module: "audit", permission: "audit.view" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    labelAr: "النظام",
    items: [
      { to: "/admin/users", label: "Users & Roles", labelAr: "المستخدمون والصلاحيات", icon: "shield", module: "users", permission: "admin.users" },
      { to: "/import", label: "Import / Export", labelAr: "الاستيراد والتصدير", icon: "upload", module: "import" },
      { to: "/admin/master", label: "Master Data", labelAr: "البيانات الأساسية", icon: "database", module: "settings", permission: "admin.settings" },
      { to: "/settings", label: "Settings", labelAr: "الإعدادات", icon: "settings", module: "settings", permission: "admin.settings" },
    ],
  },
];

export function visibleNav(role: RoleId) {
  const def = roleById(role);
  if (role === "employee") return [];
  return NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) => {
      if (def.modules.includes("all")) return true;
      if (item.permission && !can(role, item.permission as Permission)) {
        if (!canModule(role, item.module) && !def.modules.includes("all")) return false;
      }
      return canModule(role, item.module) || def.modules.includes("all");
    }),
  })).filter((g) => g.items.length > 0);
}

export function hasPermission(role: RoleId, permission?: Permission) {
  if (!permission) return true;
  return can(role, permission);
}
