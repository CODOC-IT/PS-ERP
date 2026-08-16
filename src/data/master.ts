export const TRADES = [
  "Rigger I",
  "Rigger II",
  "Rigger III",
  "Work Permit Receiver",
  "Firewatcher",
  "Safety Officer",
  "Helper",
  "Electrician",
  "Welder",
  "6G Welder",
  "Mechanical Technician",
  "Instrument Technician",
  "Equipment Operator",
];

export const PROJECT_TYPES = [
  "Shutdown / Turnaround",
  "Industrial maintenance",
  "Construction / EPC",
  "Civil",
  "HSE support",
  "Equipment with operator",
];

export const DOCUMENT_TYPES = [
  "Iqama",
  "Passport",
  "Driving licence",
  "Trade certification",
  "WPR certification",
  "Rigger I certification",
  "Medical certificate",
  "Safety certification",
  "Gate pass",
  "Client approval",
  "Employment documents",
];

export const ATTENDANCE_CODES = [
  { code: "P", label: "Present" },
  { code: "8 / 10 / 12", label: "Hours present" },
  { code: "A", label: "Absent" },
  { code: "OFF", label: "Scheduled off" },
  { code: "L", label: "Approved leave" },
  { code: "SICK", label: "Sick leave" },
  { code: "H", label: "Holiday" },
];

export const SALARY_TYPES = ["Monthly salary", "Daily rate", "Hourly rate", "Percentage", "Custom"];

export const ALLOWANCE_TYPES = ["Transport", "Housing", "Site", "Food", "Phone"];

export const DEDUCTION_TYPES = ["Absence", "Advance recovery", "Loan", "Other"];

export const BILLING_UNITS = ["Hourly", "Daily", "Monthly", "Fixed", "Custom"];

export const LOCATIONS = [
  "Jubail Industrial City",
  "Ras Tanura",
  "Dammam 2nd Industrial City",
  "Yanbu Industrial City",
  "Khobar office",
];

export const DEPARTMENTS = ["Operations", "HR", "Finance", "HSE", "Administration"];

export const BANKS = ["Al Rajhi Bank", "SABB", "SNB", "Riyad Bank", "Alinma Bank"];

export const NATIONALITIES = ["Saudi", "Pakistani", "Indian", "Filipino", "Bangladeshi", "Egyptian", "Jordanian", "Nepali"];

export const HOLIDAYS = [
  { date: "2026-02-28", name: "Saudi Founding Day" },
  { date: "2026-03-20", name: "Eid al-Fitr (observed start)" },
  { date: "2026-05-27", name: "Eid al-Adha (observed start)" },
  { date: "2026-09-23", name: "National Day" },
];

export const TEMPLATES = [
  {
    id: "tpl-gps-v3",
    name: "GPS Weekly Timesheet v3",
    clientId: "gps",
    status: "Active",
    mapping: [
      { column: "B", field: "Employee ID" },
      { column: "C", field: "Employee name" },
      { column: "G", field: "Regular hours" },
      { column: "H", field: "OT hours" },
    ],
  },
  {
    id: "tpl-eic-m",
    name: "EIC Monthly attendance",
    clientId: "eic",
    status: "Active",
    mapping: [
      { column: "A", field: "Client employee ID" },
      { column: "B", field: "Name" },
      { column: "C–AG", field: "Daily hours" },
    ],
  },
];

export const IMPORTS = [
  { id: "imp-1", type: "Employees from Excel", when: "2026-08-12T11:20:00+03:00", who: "Layla Hassan", result: "484 ready · 12 need attention" },
  { id: "imp-2", type: "Timesheet GPS week 02–08 Aug", when: "2026-08-09T14:02:00+03:00", who: "Omar Farooq", result: "94 rows imported" },
  { id: "imp-3", type: "Client list", when: "2026-06-01T09:00:00+03:00", who: "Noura Al-Mutairi", result: "5 clients updated" },
];

export const ACTIVITY = {
  "PS-1042": [
    { date: "2026-08-16", text: "Iqama renewal requested. Task assigned to Ahmed." },
    { date: "2026-08-16", text: "Timesheet 09–15 Aug contested for 11 Aug (client: Absent)." },
    { date: "2026-08-14", text: "Timesheet 02–08 Aug confirmed." },
    { date: "2026-08-14", text: "Salary advance ADV-2026-0091 requested (SAR 1,500)." },
    { date: "2026-08-01", text: "Assigned to Jubail Turnaround 2026 as Rigger I." },
    { date: "2021-06-01", text: "Joined Power Solid. Employee ID PS-1042." },
  ],
  gps: [
    { date: "2026-08-16", text: "Weekly timesheet 09–15 Aug received (Excel, GPS v3)." },
    { date: "2026-08-14", text: "Partial payment SAR 200,000 allocated to INV-2026-0087." },
    { date: "2026-08-10", text: "INV-2026-0087 issued. ZATCA pending clearance." },
  ],
  jub: [
    { date: "2026-08-16", text: "Short 4 Rigger I, 1 Safety Officer, 2 Helpers." },
    { date: "2026-08-16", text: "Timesheet 09–15 Aug in dispute (4 employees)." },
    { date: "2026-08-01", text: "Project moved from Mobilizing to Active." },
  ],
};

export const COMP_HISTORY = {
  "PS-1042": [
    { type: "Monthly salary", amount: 4800, from: "2026-07-01", to: null, note: "Current" },
    { type: "Monthly salary", amount: 4500, from: "2026-01-01", to: "2026-06-30", note: "Closed" },
    { type: "Monthly salary", amount: 4200, from: "2021-06-01", to: "2025-12-31", note: "Closed" },
  ],
};
