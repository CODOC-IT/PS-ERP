import type { Locale } from "@/lib/types";

const dict = {
  searchPh: { en: "Search employee, project, client or invoice…", ar: "ابحث عن موظف أو مشروع أو عميل أو فاتورة…" },
  quickCreate: { en: "Quick create", ar: "إنشاء سريع" },
  notifications: { en: "Notifications", ar: "التنبيهات" },
  help: { en: "Help", ar: "مساعدة" },
  signIn: { en: "Sign in", ar: "تسجيل الدخول" },
  demoData: { en: "Demo data", ar: "بيانات تجريبية" },
  previewAs: { en: "Preview as…", ar: "معاينة بصلاحية…" },
  prototypePreview: { en: "Prototype role preview", ar: "معاينة الدور للتجربة فقط" },
  prototypeNote: {
    en: "This switch is only for the mockup. It is not a production security feature.",
    ar: "هذا التحويل للعرض فقط وليس خاصية أمنية في النظام الفعلي.",
  },
  needsApproval: { en: "Needs your approval", ar: "بانتظار اعتمادك" },
  snapshot: { en: "Business snapshot", ar: "صورة العمل" },
  financial: { en: "Financial overview", ar: "نظرة مالية" },
  risks: { en: "Operational risks", ar: "مخاطر تشغيلية" },
  attention: { en: "Needs your attention", ar: "يحتاج انتباهك" },
  reviewTimesheet: { en: "Review timesheet", ar: "مراجعة الجدول" },
  confirm: { en: "Confirm timesheet", ar: "تأكيد الجدول" },
  somethingWrong: { en: "Something is wrong", ar: "هناك خطأ" },
  save: { en: "Save", ar: "حفظ" },
  saveDraft: { en: "Save draft", ar: "حفظ مسودة" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  back: { en: "Back", ar: "رجوع" },
  edit: { en: "Edit", ar: "تعديل" },
  archive: { en: "Archive", ar: "أرشفة" },
  export: { en: "Export", ar: "تصدير" },
  add: { en: "Add", ar: "إضافة" },
  more: { en: "More", ar: "المزيد" },
  empty: { en: "Nothing to show", ar: "لا يوجد شيء للعرض" },
  permissionDenied: { en: "You do not have permission for this action.", ar: "ليست لديك صلاحية لهذا الإجراء." },
  goodEvening: { en: "Good evening, Ahmed", ar: "مساء الخير يا أحمد" },
  myTimesheets: { en: "My Timesheets", ar: "جداولي" },
  myAdvances: { en: "My Salary Advances", ar: "سلفي" },
  myDocuments: { en: "My Documents", ar: "وثائقي" },
  myProfile: { en: "My Profile", ar: "ملفي" },
  myPayslips: { en: "My Payslips", ar: "رواتبي" },
  product: { en: "Workforce & Project Operations", ar: "تشغيل القوى العاملة والمشاريع" },
  remember: { en: "Remember this device", ar: "تذكر هذا الجهاز" },
  forgot: { en: "Forgot password", ar: "نسيت كلمة المرور" },
  email: { en: "Email or employee ID", ar: "البريد أو رقم الموظف" },
  password: { en: "Password", ar: "كلمة المرور" },
} as const;

export type I18nKey = keyof typeof dict;

export function t(locale: Locale, key: I18nKey) {
  return dict[key][locale];
}
