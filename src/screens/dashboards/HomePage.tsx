import { Link, useNavigate } from "react-router-dom";
import {
  APPROVALS,
  CLIENTS,
  DISPUTES,
  DOCUMENTS,
  EMPLOYEES,
  INVOICES,
  PAYMENTS,
  PAYROLL_RUNS,
  PROJECTS,
  REQUIREMENTS,
  TIMESHEETS,
  USERS,
} from "@/data";
import { employeeName } from "@/data/employees";
import { money } from "@/lib/format";
import { t } from "@/lib/i18n";
import { toneFor, statusIcon } from "@/lib/status";
import { useApp } from "@/store/AppState";
import { Alert, Button, Kpi, PageHeader, Panel, StatusBadge } from "@/components/ui/primitives";
import { DataTable } from "@/components/ui/Table";
import { daysUntil, formatDate } from "@/lib/format";

export function HomePage() {
  const { role, locale } = useApp();
  if (role === "owner") return <OwnerDash />;
  if (role === "admin") return <AdminDash />;
  if (role === "ops_manager") return <OpsDash />;
  if (role === "coordinator") return <CoordinatorDash />;
  if (role === "hr") return <HrDash />;
  if (role === "timesheet_clerk") return <ClerkDash />;
  if (role === "accountant") return <AccountantDash />;
  if (role === "finance") return <FinanceDash />;
  if (role === "auditor") return <AuditorDash />;
  return <OwnerDash />;
}

function OwnerDash() {
  const { locale } = useApp();
  const waiting = APPROVALS.filter((a) => a.status === "Waiting");
  return (
    <div>
      <PageHeader
        title={locale === "ar" ? "اليوم — الأحد 16 أغسطس 2026" : "Sunday 16 Aug 2026"}
        description={locale === "ar" ? "اعتمادات ومخاطر تشغيلية تحتاج قرارك." : "Approvals and operational risks that need a decision today."}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <h2 className="mb-2 font-heading text-[20px] font-semibold">{t(locale, "needsApproval")}</h2>
          <Panel>
            <ul className="divide-y divide-line">
              {[
                { n: 4, label: locale === "ar" ? "سلف رواتب" : "salary advances", to: "/approvals?cat=advances" },
                { n: 1, label: locale === "ar" ? "رواتب أغسطس" : "August payroll", to: "/payroll/pr-2026-08/approve" },
                { n: 3, label: locale === "ar" ? "تجاوزات خصم الحضور" : "attendance deduction overrides", to: "/approvals?cat=attendance" },
                { n: 2, label: locale === "ar" ? "استثناءات فواتير" : "invoice exceptions", to: "/approvals?cat=invoices" },
              ].map((x) => (
                <li key={x.to} className="flex items-center justify-between px-4 py-3">
                  <div className="text-[14px]">
                    <span className="font-heading text-[18px] font-semibold text-gold-deep">{x.n}</span>
                    <span className="ms-2">{x.label}</span>
                  </div>
                  <Link to={x.to} className="text-[13px] font-medium text-ink underline">
                    Review
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <h2 className="mb-2 mt-6 font-heading text-[20px] font-semibold">{t(locale, "snapshot")}</h2>
          <Panel className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 md:grid-cols-3">
            <Kpi label="Active workforce" value="524" />
            <Kpi label="Currently deployed" value="472" />
            <Kpi label="Bench / available" value="34" />
            <Kpi label="Documents blocking mobilization" value="18" tone="danger" />
            <Kpi label="Active projects" value="23" />
            <Kpi label="Unbilled approved hours" value="6,428" tone="gold" />
          </Panel>
          <h2 className="mb-2 mt-6 font-heading text-[20px] font-semibold">{t(locale, "financial")}</h2>
          <Panel className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
            <Kpi label="Payroll this month" value={money(2320240)} />
            <Kpi label="Client billing this month" value={money(327474)} />
            <Kpi label="Outstanding receivables" value={money(434354)} />
            <Kpi label="Advances outstanding" value={money(44600)} />
            <div className="col-span-2">
              <div className="text-[12px] text-muted">Gross manpower margin (3 months)</div>
              <svg viewBox="0 0 240 64" className="mt-2 h-16 w-full max-w-sm text-gold-deep">
                <polyline fill="none" stroke="currentColor" strokeWidth="2" points="0,48 80,40 160,28 240,22" />
                <polyline fill="none" stroke="#17191C" strokeWidth="1.5" points="0,52 80,46 160,42 240,38" />
              </svg>
              <div className="text-[12px] text-muted">Gold: billing · Charcoal: employee cost</div>
            </div>
          </Panel>
        </div>
        <div>
          <h2 className="mb-2 font-heading text-[20px] font-semibold">{t(locale, "risks")}</h2>
          <Panel>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Urgency</th>
                  <th>Issue</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <StatusBadge tone="danger">{statusIcon("expired")} Critical</StatusBadge>
                  </td>
                  <td>8 Iqamas already expired</td>
                  <td>
                    <Link className="text-[13px] underline" to="/expiry?window=expired">
                      Open expiry list
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <StatusBadge tone="danger">{statusIcon("expired")} Critical</StatusBadge>
                  </td>
                  <td>3 gate passes expire before next shift</td>
                  <td>
                    <Link className="text-[13px] underline" to="/expiry?type=Gate+pass&window=7">
                      Review gate passes
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <StatusBadge tone="danger">{statusIcon("expired")} Critical</StatusBadge>
                  </td>
                  <td>Jubail Turnaround short of 6 Rigger I workers</td>
                  <td>
                    <Link className="text-[13px] underline" to="/manpower/req-rig1">
                      Fill shortage
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <StatusBadge tone="warning">{statusIcon("wait")} Warning</StatusBadge>
                  </td>
                  <td>14 timesheets awaiting employee verification</td>
                  <td>
                    <Link className="text-[13px] underline" to="/timesheets?status=Employee+review">
                      Open timesheets
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <StatusBadge tone="warning">{statusIcon("wait")} Warning</StatusBadge>
                  </td>
                  <td>4 timesheets disputed</td>
                  <td>
                    <Link className="text-[13px] underline" to="/timesheets/ts-jub-0815/disputes">
                      Review 4 disputed timesheets
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <StatusBadge tone="warning">{statusIcon("wait")} Warning</StatusBadge>
                  </td>
                  <td>7 invoices waiting approval</td>
                  <td>
                    <Link className="text-[13px] underline" to="/invoices?status=Awaiting+review">
                      Review invoices
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <div className="mt-4 text-[12px] text-muted">Waiting queue: {waiting.length} items in Approvals.</div>
        </div>
      </div>
    </div>
  );
}

function CoordinatorDash() {
  const mine = PROJECTS.filter((p) => p.id === "jub" || p.id === "dmm");
  const absentees = ["PS-1042 Ahmed Al-Harbi — 11 Aug disputed", "PS-1011 Bilal Ahmad — 09–10 Aug absent"];
  return (
    <div>
      <PageHeader
        title="Coordinator — Fatima Al-Zahra"
        description="Your projects: Jubail Turnaround 2026 and Dammam Civil Works. Other projects are outside your scope."
      />
      <Alert tone="info" title="Project scope">
        You can view and act only on workers assigned to Jubail Turnaround 2026 and Dammam Civil Works.
      </Alert>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <Panel className="p-4">
          <Kpi label="Workers awaiting mobilization" value="9" tone="warning" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Missing client timesheets" value="1" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Awaiting employee confirmation" value="10" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Contested timesheets" value="4" tone="danger" />
        </Panel>
      </div>
      <h2 className="mb-2 mt-6 font-heading text-[20px] font-semibold">Project workload</h2>
      <DataTable
        rows={mine}
        columns={[
          { key: "name", header: "Project", render: (p) => <Link className="font-medium underline" to={`/projects/${p.id}`}>{p.name}</Link> },
          { key: "code", header: "Code" },
          { key: "requested", header: "Requested" },
          { key: "deployed", header: "Deployed" },
          { key: "short", header: "Short", render: (p) => <span className={p.requested - p.deployed > 0 ? "text-danger" : ""}>{p.requested - p.deployed}</span> },
          { key: "status", header: "Status", render: (p) => <StatusBadge tone={toneFor(p.status)}>{statusIcon(p.status)} {p.status}</StatusBadge> },
        ]}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel className="p-4">
          <h3 className="font-heading text-[16px] font-semibold">Today’s absent workers</h3>
          <ul className="mt-2 space-y-1 text-[13px]">
            {absentees.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <Link className="mt-3 inline-block text-[13px] underline" to="/attendance">
            Open attendance
          </Link>
        </Panel>
        <Panel className="p-4">
          <h3 className="font-heading text-[16px] font-semibold">Expiring site credentials</h3>
          <ul className="mt-2 space-y-1 text-[13px]">
            <li>PS-1057 Imran Khan — gate pass 20 Aug</li>
            <li>PS-1042 Ahmed Al-Harbi — Iqama 28 Aug</li>
            <li>PS-1088 Abdul Rahman — gate pass 18 Aug</li>
          </ul>
          <Link className="mt-3 inline-block text-[13px] underline" to="/expiry">
            Open expiry monitor
          </Link>
        </Panel>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/timesheets/ts-jub-0815/disputes">
          <Button variant="primary">Review 4 disputed timesheets</Button>
        </Link>
        <Link to="/mobilization?view=blocked">
          <Button>Open blocked workers</Button>
        </Link>
      </div>
    </div>
  );
}

function HrDash() {
  const nav = useNavigate();
  const expired = DOCUMENTS.filter((d) => d.verification === "Expired");
  const soon = DOCUMENTS.filter((d) => d.verification === "Expiring soon");
  const missing = DOCUMENTS.filter((d) => d.verification === "Missing" || d.verification === "Awaiting verification");
  return (
    <div>
      <PageHeader title="Documents & readiness" description="Expired and soon-to-expire credentials across the workforce." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="p-4">
          <Kpi label="Already expired" value={expired.length} tone="danger" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Expiring in 7 days" value={soon.filter((d) => d.expiryDate && daysUntil(d.expiryDate) <= 7).length} tone="warning" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Expiring in 30 days" value={soon.length} tone="warning" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Incomplete / unverified" value={missing.length} />
        </Panel>
      </div>
      <h2 className="mb-2 mt-6 font-heading text-[20px] font-semibold">Renewal queue</h2>
      <DataTable
        rows={[...expired, ...soon].map((d) => ({ ...d }))}
        onRowClick={(d) => nav(`/documents/${d.id}`)}
        columns={[
          { key: "employeeId", header: "Employee", render: (d) => employeeName(d.employeeId) },
          { key: "type", header: "Document" },
          { key: "expiryDate", header: "Expiry", render: (d) => (d.expiryDate ? formatDate(d.expiryDate) : "—") },
          { key: "verification", header: "Status", render: (d) => <StatusBadge tone={toneFor(d.verification)}>{statusIcon(d.verification)} {d.verification}</StatusBadge> },
          { key: "a", header: "", render: () => <span className="underline">Request renewal</span> },
        ]}
      />
      <div className="mt-6">
        <h2 className="mb-2 font-heading text-[20px] font-semibold">August expiry calendar</h2>
        <Panel className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-muted">
                {d}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
              const hit = d === 4 || d === 10 || d === 18 || d === 20 || d === 28;
              return (
                <div key={d} className={`rounded-[4px] py-2 ${hit ? "bg-danger-bg text-danger" : "bg-surface-2"}`}>
                  {d}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[12px] text-muted">Red dates have at least one expiry. 18 employees may become non-mobilizable within 30 days.</p>
        </Panel>
      </div>
    </div>
  );
}

function ClerkDash() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title="Timesheet intake queue" description="Enter what the client sent. Do not wait for a perfect file." actions={<Link to="/timesheets/upload"><Button variant="gold">Upload timesheet</Button></Link>} />
      <DataTable
        rows={TIMESHEETS}
        onRowClick={(r) => nav(`/timesheets/${r.id}`)}
        columns={[
          { key: "clientId", header: "Client", render: (r) => CLIENTS.find((c) => c.id === r.clientId)?.displayName },
          { key: "projectId", header: "Project", render: (r) => PROJECTS.find((p) => p.id === r.projectId)?.name },
          { key: "period", header: "Period", render: (r) => `${formatDate(r.periodStart)} – ${formatDate(r.periodEnd)}` },
          { key: "source", header: "Format" },
          { key: "received", header: "Received", render: (r) => formatDate(r.received) },
          { key: "expected", header: "Expected workers" },
          { key: "entered", header: "Rows entered" },
          { key: "issues", header: "Validation issues" },
          { key: "status", header: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)}>{statusIcon(r.status)} {r.status}</StatusBadge> },
          { key: "clerk", header: "Assigned to" },
        ]}
      />
    </div>
  );
}

function AccountantDash() {
  const run = PAYROLL_RUNS[0];
  return (
    <div>
      <PageHeader title="Payroll & billing" description={`${run.period} is ${run.status.toLowerCase()}.`} />
      <Alert tone="warning" title="Payroll cannot be finalized yet.">
        8 employees have unresolved timesheet disputes · 3 employees are missing approved timesheets · 2 compensation plans are incomplete · 4 approved advances have no recovery rule.
      </Alert>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Panel className="p-4">
          <Kpi label="August net payroll" value={money(run.net)} />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Draft invoices" value={INVOICES.filter((i) => i.status === "Draft" || i.status === "Awaiting review").length} />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Unbilled approved hours" value="6,428" tone="gold" />
        </Panel>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/payroll/pr-2026-08/precheck">
          <Button variant="primary">Open payroll pre-check</Button>
        </Link>
        <Link to="/invoices/new">
          <Button>Generate invoice from timesheets</Button>
        </Link>
        <Link to="/invoices?status=Overdue">
          <Button>Invoices overdue</Button>
        </Link>
      </div>
      <h2 className="mb-2 mt-6 font-heading text-[20px] font-semibold">VAT / ZATCA</h2>
      <DataTable
        rows={INVOICES.filter((i) => i.id !== "INV-2026-0089")}
        columns={[
          { key: "id", header: "Invoice", render: (i) => <Link className="underline" to={`/invoices/${i.id}`}>{i.id}</Link> },
          { key: "zatca", header: "ZATCA", render: (i) => <StatusBadge tone={toneFor(i.zatca)}>{statusIcon(i.zatca)} {i.zatca}</StatusBadge> },
          { key: "status", header: "Payment", render: (i) => i.status },
        ]}
      />
    </div>
  );
}

function FinanceDash() {
  return (
    <div>
      <PageHeader title="Payments" description="Salary batches and client receipts." />
      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="p-4">
          <Kpi label="August salary batch (draft)" value={money(2320240)} />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Advances approved but unpaid" value="0" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Outstanding client balances" value={money(434354)} />
        </Panel>
      </div>
      <h2 className="mb-2 mt-6 font-heading text-[20px] font-semibold">Reconciliation queue</h2>
      <DataTable
        rows={PAYMENTS}
        columns={[
          { key: "id", header: "Payment", render: (p) => <Link className="underline" to={`/payments/${p.id}`}>{p.reference}</Link> },
          { key: "kind", header: "Type" },
          { key: "party", header: "Party" },
          { key: "amount", header: "Amount", render: (p) => money(p.amount) },
          { key: "status", header: "Status", render: (p) => <StatusBadge tone={toneFor(p.status)}>{statusIcon(p.status)} {p.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

function AdminDash() {
  return (
    <div>
      <PageHeader title="Users & system" description="Office administration. Failed jobs are written in plain language." />
      <div className="grid gap-4 md:grid-cols-4">
        <Panel className="p-4">
          <Kpi label="Active users" value={USERS.filter((u) => u.status === "Active").length} />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Locked accounts" value={USERS.filter((u) => u.status === "Locked").length} tone="danger" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Roles" value="10" />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Failed background jobs" value="1" tone="warning" />
        </Panel>
      </div>
      <Panel className="mt-4 p-4">
        <h3 className="font-heading text-[16px] font-semibold">Needs attention</h3>
        <ul className="mt-2 space-y-2 text-[13px]">
          <li>
            Yousef Al-Harbi’s account is locked after failed sign-in attempts.{" "}
            <Link className="underline" to="/admin/users/u-locked">
              Unlock or reset
            </Link>
          </li>
          <li>
            GPS weekly timesheet import finished with 12 rows that need a clerk.{" "}
            <Link className="underline" to="/import/imp-1">
              Open import results
            </Link>
          </li>
          <li>Email sending to employees is working. No configuration issue.</li>
        </ul>
      </Panel>
      <div className="mt-4 flex gap-2">
        <Link to="/admin/users">
          <Button variant="primary">Users & roles</Button>
        </Link>
        <Link to="/admin/roles">
          <Button>Permission editor</Button>
        </Link>
        <Link to="/audit">
          <Button>Recent admin activity</Button>
        </Link>
      </div>
    </div>
  );
}

function OpsDash() {
  return (
    <div>
      <PageHeader title="Operations" description="Manpower vs request, mobilization and timesheet flow." />
      <DataTable
        rows={PROJECTS.filter((p) => p.status !== "Closed")}
        columns={[
          { key: "name", header: "Project", render: (p) => <Link className="underline" to={`/projects/${p.id}`}>{p.name}</Link> },
          { key: "status", header: "Status", render: (p) => <StatusBadge tone={toneFor(p.status)}>{statusIcon(p.status)} {p.status}</StatusBadge> },
          { key: "requested", header: "Requested" },
          { key: "deployed", header: "Deployed" },
          { key: "short", header: "Short", render: (p) => p.requested - p.deployed },
          { key: "coordinator", header: "Coordinator" },
        ]}
      />
      <h2 className="mb-2 mt-6 font-heading text-[20px] font-semibold">Open shortages</h2>
      <DataTable
        rows={REQUIREMENTS.filter((r) => r.status === "Partially filled" || r.status === "Open")}
        columns={[
          { key: "trade", header: "Trade", render: (r) => <Link className="underline" to={`/manpower/${r.id}`}>{r.trade}</Link> },
          { key: "projectId", header: "Project", render: (r) => PROJECTS.find((p) => p.id === r.projectId)?.name },
          { key: "filled", header: "Filled", render: (r) => `${r.filled} / ${r.quantity}` },
          { key: "status", header: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)}>{statusIcon(r.status)} {r.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

function AuditorDash() {
  return (
    <div>
      <PageHeader title="Read-only view" description="You can open records and the audit log. You cannot edit, approve, or void." />
      <Alert tone="info">Create, edit, approve and void actions are hidden for this role.</Alert>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Panel className="p-4">
          <Kpi label="Employees (active lists)" value={EMPLOYEES.length} />
        </Panel>
        <Panel className="p-4">
          <Kpi label="Open disputes" value={DISPUTES.length} />
        </Panel>
        <Panel className="p-4">
          <Kpi label="August payroll status" value="Awaiting approval" />
        </Panel>
      </div>
      <div className="mt-4">
        <Link to="/audit">
          <Button variant="primary">Open audit log</Button>
        </Link>
      </div>
    </div>
  );
}
