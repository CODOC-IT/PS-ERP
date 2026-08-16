import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { APPROVALS, AUDIT, IMPORTS, USERS } from "@/data";
import { ROLES } from "@/data/roles";
import { ATTENDANCE_CODES, BANKS, DOCUMENT_TYPES, HOLIDAYS, LOCATIONS, NATIONALITIES, TEMPLATES, TRADES } from "@/data/master";
import { formatDate, formatDateTime, money } from "@/lib/format";
import { statusIcon, toneFor } from "@/lib/status";
import { useApp } from "@/store/AppState";
import { Alert, Button, Checkbox, Field, Input, PageHeader, Panel, Select, StatusBadge, EmptyState, SkeletonRows } from "@/components/ui/primitives";
import { DataTable, FilterChip, Toolbar } from "@/components/ui/Table";
import { Restricted } from "@/components/ui/overlays";

export function ApprovalsPage() {
  const [params] = useSearchParams();
  const cat = params.get("cat");
  const [filter, setFilter] = useState("Waiting");
  const rows = APPROVALS.filter((a) => {
    if (filter !== "All" && a.status !== filter) return false;
    if (cat === "advances" && a.category !== "Salary advances") return false;
    if (cat === "attendance" && a.category !== "Attendance waivers") return false;
    if (cat === "invoices" && a.category !== "Invoice exceptions") return false;
    return true;
  });
  return (
    <div>
      <PageHeader title="Approval center" description="What changed, why it needs you, and the money involved." />
      <Toolbar>
        {["Waiting", "Approved", "Rejected", "All"].map((f) => (
          <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === "Waiting" ? "Waiting for me" : f}
          </FilterChip>
        ))}
      </Toolbar>
      <div className="space-y-3">
        {rows.map((a) => (
          <Panel key={a.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[12px] text-muted">{a.category}</div>
                <div className="font-heading text-[16px] font-semibold">{a.title}</div>
                <dl className="mt-2 grid gap-1 text-[13px]">
                  <div>
                    <span className="text-muted">Who requested · </span>
                    {a.who}
                  </div>
                  <div>
                    <span className="text-muted">Why approval is required · </span>
                    {a.why}
                  </div>
                  <div>
                    <span className="text-muted">Financial impact · </span>
                    {a.impact}
                  </div>
                </dl>
              </div>
              <div className="flex gap-2">
                <Link to={a.href}>
                  <Button size="sm">Open</Button>
                </Link>
                <Button size="sm" variant="primary">
                  Approve
                </Button>
                <Button size="sm" variant="danger-outline">
                  Reject
                </Button>
                <Button size="sm">Return for changes</Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function NotificationsPage() {
  const { notifications, markRead, locale } = useApp();
  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="divide-y divide-line rounded-[8px] border border-line bg-white">
        {notifications.map((n) => (
          <Link key={n.id} to={n.href} onClick={() => markRead(n.id)} className="block px-4 py-3 hover:bg-canvas">
            <div className="font-medium">{locale === "ar" ? n.titleAr : n.title}</div>
            <div className="text-[13px] text-muted">{n.body}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ReportsPage() {
  const groups = [
    {
      name: "Workforce",
      items: [
        ["Employees by trade", "trade"],
        ["Employees by nationality", "nationality"],
        ["Deployed vs available", "deployed"],
        ["Manpower shortages", "shortages"],
        ["Utilization", "util"],
      ],
    },
    {
      name: "Compliance",
      items: [
        ["Expired documents", "expired"],
        ["Documents expiring", "expiring"],
        ["Mobilization readiness", "ready"],
      ],
    },
    {
      name: "Attendance",
      items: [
        ["Absences", "absences"],
        ["Overtime", "ot"],
      ],
    },
    {
      name: "Payroll",
      items: [
        ["Payroll summary", "pay"],
        ["Employee cost", "cost"],
        ["Advances", "adv"],
      ],
    },
    {
      name: "Billing",
      items: [
        ["Revenue by client", "rev-client"],
        ["Unbilled approved time", "unbilled"],
        ["Receivables aging", "aging"],
      ],
    },
    {
      name: "Profitability",
      items: [["Project margin", "margin"]],
    },
  ];
  return (
    <div>
      <PageHeader title="Reports" description="Tables first. Charts only where they help." />
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.name}>
            <h2 className="mb-2 font-heading text-[16px] font-semibold">{g.name}</h2>
            <ul className="divide-y divide-line rounded-[8px] border border-line bg-white">
              {g.items.map(([l, id]) => (
                <li key={id}>
                  <Link className="block px-4 py-2.5 text-[13px] hover:bg-canvas" to={`/reports/${id}`}>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportDetailPage() {
  const { slug } = useParams();
  if (slug === "margin") {
    return (
      <div>
        <PageHeader title="Project margin" description="Client billing minus employee cost. Demo data." />
        <table className="erp-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client billing</th>
              <th>Employee cost</th>
              <th>Other costs</th>
              <th>Gross margin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jubail Turnaround 2026</td>
              <td>{money(327474)}</td>
              <td>{money(210400)}</td>
              <td>{money(18400)}</td>
              <td>{money(98674)}</td>
            </tr>
            <tr>
              <td>Ras Tanura Maintenance</td>
              <td>{money(188400)}</td>
              <td>{money(142200)}</td>
              <td>{money(9000)}</td>
              <td>{money(37200)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  if (slug === "trade") {
    return (
      <div>
        <PageHeader title="Employees by trade" />
        <table className="erp-table">
          <thead>
            <tr>
              <th>Trade</th>
              <th>Headcount</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Rigger I", 48],
              ["WPR", 22],
              ["Firewatcher", 31],
              ["Safety Officer", 14],
              ["Helper", 90],
            ].map(([t, n]) => (
              <tr key={String(t)}>
                <td>{t}</td>
                <td>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div>
      <PageHeader title="Report" description="Demo table for this report." />
      <Panel className="p-4 text-[13px]">Open a named report from the list. This demo includes workforce, margin and aging samples.</Panel>
    </div>
  );
}

export function AuditPage() {
  return (
    <div>
      <PageHeader title="Audit log" description="Immutable. These rows cannot be edited or deleted." />
      <DataTable
        rows={AUDIT}
        columns={[
          { key: "time", header: "Time", render: (a) => formatDateTime(a.time) },
          { key: "user", header: "User" },
          { key: "action", header: "Action" },
          { key: "module", header: "Module" },
          { key: "record", header: "Record" },
          { key: "change", header: "Change" },
          { key: "reason", header: "Reason" },
          { key: "ip", header: "Device" },
        ]}
      />
    </div>
  );
}

export function UserListPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader
        title="Users"
        actions={
          <Link to="/admin/users/invite">
            <Button variant="gold">Invite user</Button>
          </Link>
        }
      />
      <DataTable
        rows={USERS}
        onRowClick={(u) => nav(`/admin/users/${u.id}`)}
        columns={[
          { key: "name", header: "User" },
          { key: "employeeId", header: "Employee link", render: (u) => u.employeeId ?? "Staff" },
          { key: "title", header: "Role" },
          { key: "scopeLabel", header: "Scope" },
          { key: "mfa", header: "MFA", render: (u) => (u.mfa ? "On" : "Off") },
          { key: "lastLogin", header: "Last login", render: (u) => formatDateTime(u.lastLogin) },
          { key: "status", header: "Status", render: (u) => <StatusBadge tone={toneFor(u.status)}>{statusIcon(u.status)} {u.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function UserDetailPage() {
  const { id } = useParams();
  const u = USERS.find((x) => x.id === id) ?? USERS[0];
  const { toast } = useApp();
  return (
    <div>
      <PageHeader
        title={u.name}
        description={u.email}
        actions={
          <>
            <Button onClick={() => toast("MFA reset in this demo.")}>Reset MFA</Button>
            <Button variant="danger-outline" onClick={() => toast(u.status === "Locked" ? "Account unlocked." : "Account disabled.")}>
              {u.status === "Locked" ? "Unlock" : "Disable account"}
            </Button>
          </>
        }
      />
      <Panel className="grid gap-2 p-4 text-[13px]">
        <div>Role {u.title}</div>
        <div>Scope {u.scopeLabel}</div>
        <div>MFA {u.mfa ? "On" : "Off"}</div>
        <div>Last login {formatDateTime(u.lastLogin)}</div>
      </Panel>
    </div>
  );
}

export function InviteUserPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div className="max-w-lg">
      <PageHeader title="Invite user" />
      <div className="grid gap-3">
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Email">
          <Input />
        </Field>
        <Field label="Role">
          <Select>
            {ROLES.map((r) => (
              <option key={r.id}>{r.label}</option>
            ))}
          </Select>
        </Field>
        <div className="flex gap-2">
          <Button onClick={() => nav(-1)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              toast("Invite sent in this demo.");
              nav("/admin/users");
            }}
          >
            Send invite
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RoleListPage() {
  return (
    <div>
      <PageHeader
        title="Roles"
        actions={
          <Link to="/admin/roles/new">
            <Button variant="gold">Create role</Button>
          </Link>
        }
      />
      <DataTable
        rows={ROLES}
        columns={[
          { key: "label", header: "Role", render: (r) => <Link className="underline" to={`/admin/roles/${r.id}`}>{r.label}</Link> },
          { key: "description", header: "Purpose" },
        ]}
      />
    </div>
  );
}

export function RoleDetailPage() {
  const { id } = useParams();
  const r = ROLES.find((x) => x.id === id) ?? ROLES[3];
  const { toast } = useApp();
  const groups = [
    { name: "Employees", items: ["View employee profiles", "Edit employee profiles", "View compensation", "Download passport / Iqama", "View assigned-project employees only"] },
    { name: "Timesheets", items: ["Enter timesheets", "Submit for verification", "Review", "Resolve disputes", "Approve"] },
    { name: "Payroll", items: ["Generate", "Review", "Approve", "Override", "Finalize"] },
    { name: "Billing", items: ["Create invoices", "Review", "Finalize", "Void"] },
  ];
  return (
    <div>
      <PageHeader title={r.label} description={r.description} />
      <Field label="Project scope">
        <Select defaultValue={r.scopedProjects ? "selected" : "all"}>
          <option value="all">All projects</option>
          <option value="selected">Only selected projects</option>
        </Select>
      </Field>
      {r.scopedProjects ? (
        <p className="mt-1 text-[13px] text-muted">Fatima: Jubail Turnaround 2026 and Dammam Civil Works only.</p>
      ) : null}
      <div className="mt-4 space-y-4">
        {groups.map((g) => (
          <Panel key={g.name} className="p-4">
            <h3 className="font-heading text-[16px] font-semibold">{g.name}</h3>
            <div className="mt-2 grid gap-2">
              {g.items.map((item, i) => (
                <Checkbox key={item} label={item} defaultChecked={i < 2 || r.id === "owner"} />
              ))}
            </div>
          </Panel>
        ))}
      </div>
      <Button className="mt-4" variant="primary" onClick={() => toast("Permissions saved in this demo.")}>
        Save role
      </Button>
    </div>
  );
}

const SETTINGS_NAV = [
  ["company", "Company"],
  ["payroll", "Payroll"],
  ["attendance", "Attendance"],
  ["documents", "Documents"],
  ["timesheets", "Timesheets"],
  ["billing", "Billing"],
  ["notifications", "Notifications"],
  ["localization", "Localization"],
  ["security", "Security"],
];

export function SettingsPage() {
  const { hijri, setHijri, toast } = useApp();
  const [tab, setTab] = useState("company");
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="rounded-[8px] border border-line bg-white p-2">
          {SETTINGS_NAV.map(([id, l]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`block w-full rounded-[6px] px-2 py-1.5 text-start text-[13px] ${tab === id ? "bg-[#f7f1e6]" : "hover:bg-surface-2"}`}
            >
              {l}
            </button>
          ))}
        </nav>
        <Panel className="p-4">
          {tab === "company" ? (
            <div className="grid max-w-lg gap-3">
              <Field label="Company name">
                <Input defaultValue="Power Solid" />
              </Field>
              <Field label="CR">
                <Input defaultValue="2055xxxxxx" />
              </Field>
              <Field label="VAT">
                <Input defaultValue="3100xxxxxx003" />
              </Field>
              <Field label="Address">
                <Input defaultValue="Jubail Industrial City, Eastern Province" />
              </Field>
              <div className="flex items-center gap-3">
                <img src="/brand/power-solid-logo.png" alt="Power Solid official logo" className="h-12 w-12 object-contain" />
                <span className="text-[13px] text-muted">Official logo on file</span>
              </div>
            </div>
          ) : null}
          {tab === "payroll" ? (
            <div className="grid max-w-lg gap-3">
              <Field label="Payroll period">
                <Select>
                  <option>Calendar month</option>
                </Select>
              </Field>
              <Field label="Absence deduction">
                <Input defaultValue="Daily rate = monthly / 30" />
              </Field>
              <Field label="Overtime">
                <Input defaultValue="1.5 × hourly equivalent" />
              </Field>
            </div>
          ) : null}
          {tab === "attendance" ? (
            <div className="grid max-w-lg gap-3">
              <Field label="Working week">
                <Input defaultValue="Sunday – Thursday" />
              </Field>
              <Field label="Standard hours">
                <Input defaultValue="8" />
              </Field>
            </div>
          ) : null}
          {tab === "documents" ? (
            <div className="text-[13px]">Warning periods: 7 / 30 / 60 / 90 days. Types: {DOCUMENT_TYPES.join(", ")}.</div>
          ) : null}
          {tab === "timesheets" ? <div className="text-[13px]">Default cycle weekly. Codes P, A, OFF, L, SICK, H.</div> : null}
          {tab === "billing" ? <div className="text-[13px]">VAT 15%. Invoice numbers INV-YYYY-####. ZATCA clearance before issue where required.</div> : null}
          {tab === "notifications" ? <div className="text-[13px]">Email + in-app. Expiry thresholds follow document settings.</div> : null}
          {tab === "localization" ? (
            <div className="grid max-w-lg gap-3">
              <Field label="Timezone">
                <Input defaultValue="Asia/Riyadh" readOnly />
              </Field>
              <Field label="Currency">
                <Input defaultValue="SAR" readOnly />
              </Field>
              <Checkbox label="Show Hijri dates next to Gregorian" checked={hijri} onChange={(e) => setHijri(e.target.checked)} />
            </div>
          ) : null}
          {tab === "security" ? (
            <div className="text-[13px]">Password: 10 characters. MFA required for finance and owner. Session 8 hours.</div>
          ) : null}
          <Button className="mt-4" variant="primary" onClick={() => toast("Settings saved in this demo.")}>
            Save
          </Button>
        </Panel>
      </div>
    </div>
  );
}

export function MasterDataPage() {
  const sets = [
    ["Trades", TRADES],
    ["Locations", LOCATIONS],
    ["Nationalities", NATIONALITIES],
    ["Banks", BANKS],
    ["Document types", DOCUMENT_TYPES],
  ];
  return (
    <div>
      <PageHeader title="Master data" description="Shared lists used on forms. Archive, do not hard-delete, if already in use." />
      <div className="grid gap-4 md:grid-cols-2">
        {sets.map(([name, items]) => (
          <Panel key={String(name)} className="p-4">
            <h2 className="font-heading text-[16px] font-semibold">{name}</h2>
            <ul className="mt-2 text-[13px]">
              {(items as string[]).slice(0, 8).map((i) => (
                <li key={i} className="flex justify-between border-b border-line py-1">
                  {i}
                  <button type="button" className="text-muted">
                    Archive
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
        <Panel className="p-4">
          <h2 className="font-heading text-[16px] font-semibold">Attendance codes</h2>
          {ATTENDANCE_CODES.map((c) => (
            <div key={c.code} className="text-[13px]">
              {c.code} — {c.label}
            </div>
          ))}
        </Panel>
        <Panel className="p-4">
          <h2 className="font-heading text-[16px] font-semibold">Holidays</h2>
          {HOLIDAYS.map((h) => (
            <div key={h.date} className="text-[13px]">
              {formatDate(h.date)} {h.name}
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function ImportCenterPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title="Import / Export" />
      <div className="mb-4 flex gap-2">
        <Link to="/import/new">
          <Button variant="gold">New import</Button>
        </Link>
      </div>
      <DataTable
        rows={IMPORTS}
        onRowClick={(i) => nav(`/import/${i.id}`)}
        columns={[
          { key: "type", header: "Import" },
          { key: "when", header: "When", render: (i) => formatDateTime(i.when) },
          { key: "who", header: "Who" },
          { key: "result", header: "Result" },
        ]}
      />
    </div>
  );
}

export function ImportWizardPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div className="max-w-2xl">
      <PageHeader title="Import employees from Excel" />
      <ol className="mb-4 flex gap-3 text-[12px] text-muted">
        <li className="text-ink">1 Upload</li>
        <li>2 Map columns</li>
        <li>3 Preview</li>
        <li>4 Validate</li>
        <li>5 Import</li>
      </ol>
      <div className="rounded-[8px] border border-dashed border-line px-4 py-10 text-center text-[13px]">employees_aug2026.xlsx</div>
      <Alert tone="info" title="Validation">
        484 rows ready · 12 rows require attention. Download error rows to fix and re-import.
      </Alert>
      <div className="mt-3 flex gap-2">
        <Button>Download error rows</Button>
        <Button
          variant="primary"
          onClick={() => {
            toast("484 employees imported in this demo.");
            nav("/import");
          }}
        >
          Import ready rows
        </Button>
      </div>
    </div>
  );
}

export function TemplatesPage() {
  return (
    <div>
      <PageHeader title="Timesheet templates" />
      <DataTable
        rows={TEMPLATES}
        columns={[
          { key: "name", header: "Template", render: (t) => <Link className="underline" to={`/timesheet-templates/${t.id}`}>{t.name}</Link> },
          { key: "status", header: "Status" },
        ]}
      />
    </div>
  );
}

export function TemplateDetailPage() {
  const { id } = useParams();
  const t = TEMPLATES.find((x) => x.id === id) ?? TEMPLATES[0];
  return (
    <div>
      <PageHeader title={t.name} />
      <table className="erp-table">
        <thead>
          <tr>
            <th>Column</th>
            <th>Field</th>
          </tr>
        </thead>
        <tbody>
          {t.mapping.map((m) => (
            <tr key={m.column}>
              <td>{m.column}</td>
              <td>{m.field}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[13px] text-muted">Next GPS weekly file will use this mapping automatically.</p>
    </div>
  );
}

export function HelpPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Help" description="Short operational notes. Not marketing." />
      <ul className="list-disc space-y-2 ps-5 text-[14px]">
        <li>Timesheets from the client are the source for hours. Employees confirm or contest; they do not overwrite the sheet.</li>
        <li>Attendance can stay Absent even if payroll waives the deduction.</li>
        <li>Salary and client billing use different rate cards.</li>
        <li>Finalized payroll and issued invoices are corrected with adjustments, not silent edits.</li>
      </ul>
    </div>
  );
}

export function PrototypeMapPage() {
  const groups = [
    ["00 Cover", ["/prototype"]],
    ["03 Authentication", ["/", "/forgot-password"]],
    ["04 Role dashboards", ["/home", "Preview as… in the user menu"]],
    ["05 Clients", ["/clients", "/clients/new", "/clients/gps", "/clients/gps/edit"]],
    ["06 Projects & manpower", ["/projects", "/projects/new", "/projects/jub", "/manpower", "/manpower/req-rig1", "/manpower/new"]],
    ["07 Employees", ["/employees", "/employees/new", "/employees/PS-1042", "/employees/PS-1042/edit"]],
    ["08 Documents", ["/documents", "/documents/d-1042-iqama", "/documents/upload", "/expiry"]],
    ["09 Assignments & mobilization", ["/assignments", "/assignments/new", "/assignments/as-1042", "/mobilization", "/mobilization/PS-1042"]],
    ["10 Timesheets", ["/timesheets", "/timesheets/upload", "/timesheets/ts-jub-0815", "/timesheets/ts-jub-0815/enter", "/timesheets/ts-jub-0815/validate", "/timesheets/ts-jub-0815/disputes/dsp-1042-11"]],
    ["11 Attendance", ["/attendance", "/attendance/PS-1042", "/attendance/overrides/or-1042"]],
    ["12 Payroll", ["/payroll", "/payroll/pr-2026-08/precheck", "/payroll/pr-2026-08", "/payroll/pr-2026-08/employees/PS-1042", "/payroll/pr-2026-08/approve"]],
    ["13 Salary advances", ["/advances", "/advances/ADV-2026-0084", "/advances/ADV-2026-0091"]],
    ["14 Billing", ["/rate-cards", "/rate-cards/rc-gps-jub", "/invoices", "/invoices/new", "/invoices/INV-2026-0087"]],
    ["15 Payments", ["/payments", "/payments/PAY-C-0087", "/payments/new"]],
    ["16 Approvals", ["/approvals", "/notifications"]],
    ["17 Reports", ["/reports", "/reports/margin", "/reports/trade"]],
    ["18 Users & RBAC", ["/admin/users", "/admin/roles", "/admin/roles/coordinator"]],
    ["19 Audit & settings", ["/audit", "/settings", "/admin/master", "/import", "/timesheet-templates"]],
    ["20 Employee portal", ["/portal", "/portal/timesheets/ts-jub-0815", "/portal/timesheets/ts-jub-0815/contest", "/portal/advances/new"]],
    ["21 Arabic / RTL", ["Use العربية in the top bar"]],
    ["22 States", ["/states"]],
  ];
  return (
    <div>
      <PageHeader title="Power Solid ERP — product map" description="Clickable prototype. Demo data. Official logo from powersolid-intl.com." />
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map(([name, links]) => (
          <Panel key={String(name)} className="p-4">
            <h2 className="font-heading text-[16px] font-semibold">{name}</h2>
            <ul className="mt-2 text-[13px]">
              {(links as string[]).map((l) =>
                l.startsWith("/") ? (
                  <li key={l}>
                    <Link className="underline" to={l}>
                      {l}
                    </Link>
                  </li>
                ) : (
                  <li key={l}>{l}</li>
                ),
              )}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function StatesPage() {
  const [which, setWhich] = useState("loading");
  return (
    <div>
      <PageHeader title="States & edge cases" />
      <Toolbar>
        {["loading", "empty", "error", "denied", "offline", "notfound", "validation"].map((w) => (
          <FilterChip key={w} active={which === w} onClick={() => setWhich(w)}>
            {w}
          </FilterChip>
        ))}
      </Toolbar>
      {which === "loading" ? (
        <Panel>
          <SkeletonRows />
        </Panel>
      ) : null}
      {which === "empty" ? (
        <Panel>
          <EmptyState title="No disputed timesheets" body="Everything submitted by employees is currently resolved." />
        </Panel>
      ) : null}
      {which === "error" ? (
        <Alert tone="danger" title="Upload failed">
          The scan could not be read. Try a clearer photo, or enter the timesheet without the file.
        </Alert>
      ) : null}
      {which === "denied" ? <Restricted explanation="Downloading Iqama files is limited to HR and Document Control." /> : null}
      {which === "offline" ? (
        <Alert tone="warning" title="No network">
          You can keep entering this timesheet. It will send when the connection returns.
        </Alert>
      ) : null}
      {which === "notfound" ? (
        <Panel className="p-10 text-center">
          <h2 className="font-heading text-[20px] font-semibold">Record not found</h2>
          <p className="text-[13px] text-muted">This employee ID is not in the demo file.</p>
        </Panel>
      ) : null}
      {which === "validation" ? (
        <Field label="Iqama number" error="This Iqama number is already assigned to employee PS-1018.">
          <Input defaultValue="2498-1042-1" />
        </Field>
      ) : null}
    </div>
  );
}

export function NotFoundPage() {
  return (
    <Panel className="p-10 text-center">
      <h1 className="font-heading text-[22px] font-semibold">Page not found</h1>
      <p className="text-[13px] text-muted">This screen is not in the prototype.</p>
      <Link to="/home" className="mt-3 inline-block underline">
        Home
      </Link>
    </Panel>
  );
}
