import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ADVANCES, INVOICES, PAYMENTS, PAYROLL_LINES, PAYROLL_RUNS, PROJECTS, RATE_CARDS, TIMESHEETS } from "@/data";
import { CLIENTS } from "@/data/clients";
import { employeeName } from "@/data/employees";
import { formatDate, money } from "@/lib/format";
import { statusIcon, toneFor } from "@/lib/status";
import { useCan } from "@/lib/hooks";
import { useApp } from "@/store/AppState";
import { Alert, Button, Crumb, Field, Input, PageHeader, Panel, Select, StatusBadge, Tabs, Textarea } from "@/components/ui/primitives";
import { DataTable } from "@/components/ui/Table";
import { Restricted } from "@/components/ui/overlays";

export function PayrollListPage() {
  const nav = useNavigate();
  const can = useCan();
  return (
    <div>
      <PageHeader
        title="Payroll"
        actions={
          can("payroll.generate") ? (
            <Link to="/payroll/new">
              <Button variant="gold">Create payroll run</Button>
            </Link>
          ) : (
            <Button disabled>Create payroll run</Button>
          )
        }
      />
      <DataTable
        rows={PAYROLL_RUNS}
        onRowClick={(r) => nav(`/payroll/${r.id}`)}
        columns={[
          { key: "period", header: "Period", render: (r) => <span className="font-medium">{r.period}</span> },
          { key: "status", header: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)}>{statusIcon(r.status)} {r.status}</StatusBadge> },
          { key: "employees", header: "Employees" },
          { key: "net", header: "Net payroll", render: (r) => money(r.net) },
          { key: "a", header: "", render: (r) => (
            <span className="flex gap-2 text-[12px]">
              <Link to={`/payroll/${r.id}`} onClick={(e) => e.stopPropagation()}>Open</Link>
              {r.status === "Finalized" || r.status === "Paid" ? <span>Export bank file</span> : null}
            </span>
          ) },
        ]}
      />
    </div>
  );
}

export function PayrollNewPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div className="max-w-lg">
      <PageHeader title="Create payroll run" />
      <Field label="Period">
        <Select defaultValue="2026-08">
          <option value="2026-08">August 2026</option>
          <option value="2026-09">September 2026</option>
        </Select>
      </Field>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => nav(-1)}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            toast("Opened August 2026 payroll. Duplicate rules from July applied.");
            nav("/payroll/pr-2026-08/precheck");
          }}
        >
          Continue to pre-check
        </Button>
      </div>
    </div>
  );
}

export function PayrollPrecheckPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title="August 2026 · Pre-check" />
      <Alert tone="warning" title="Payroll cannot be finalized yet.">
        Resolve the items below, or record why they remain. Director approval is still required after calculation.
      </Alert>
      <ul className="mt-4 space-y-3 text-[14px]">
        <li>
          8 employees have unresolved timesheet disputes.{" "}
          <Link className="underline" to="/timesheets/ts-jub-0815/disputes">
            Open disputes
          </Link>
        </li>
        <li>
          3 employees are missing approved timesheets.{" "}
          <Link className="underline" to="/timesheets">
            Open timesheet inbox
          </Link>
        </li>
        <li>
          2 compensation plans are incomplete.{" "}
          <Link className="underline" to="/employees?view=Payroll+Exceptions">
            Open payroll exceptions
          </Link>
        </li>
        <li>
          4 approved advances have no recovery rule.{" "}
          <Link className="underline" to="/advances">
            Open advances
          </Link>
        </li>
      </ul>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => nav("/payroll")}>Back</Button>
        <Button variant="primary" onClick={() => nav("/payroll/pr-2026-08")}>
          Calculate anyway (exceptions remain)
        </Button>
      </div>
    </div>
  );
}

export function PayrollWorkspacePage() {
  const nav = useNavigate();
  const run = PAYROLL_RUNS[0];
  const can = useCan();
  return (
    <div>
      <PageHeader
        title={run.period}
        description={`Gross ${money(run.gross)} · Deductions ${money(run.deductions)} · Advance recovery ${money(run.advances)} · Overrides ${money(run.overrides)} · Net ${money(run.net)}`}
        actions={
          <>
            <Link to="/payroll/pr-2026-08/precheck">
              <Button>Pre-check</Button>
            </Link>
            {can("payroll.approve") ? (
              <Link to="/payroll/pr-2026-08/approve">
                <Button variant="gold">Director approval</Button>
              </Link>
            ) : (
              <Button disabled>Director approval</Button>
            )}
            <Button>Export payroll register</Button>
          </>
        }
      />
      <DataTable
        rows={PAYROLL_LINES.map((r) => ({ ...r, id: r.employeeId }))}
        onRowClick={(r) => nav(`/payroll/pr-2026-08/employees/${r.employeeId}`)}
        columns={[
          { key: "employeeId", header: "Employee", render: (r) => employeeName(r.employeeId) },
          { key: "project", header: "Project" },
          { key: "base", header: "Base", render: (r) => money(r.base) },
          { key: "regular", header: "Regular", render: (r) => money(r.regular) },
          { key: "ot", header: "OT", render: (r) => money(r.ot) },
          { key: "allowances", header: "Allowances", render: (r) => money(r.allowances) },
          { key: "absence", header: "Absence", render: (r) => money(r.absence) },
          { key: "advances", header: "Advances", render: (r) => money(r.advances) },
          { key: "other", header: "Other deductions", render: (r) => money(r.other) },
          { key: "overrides", header: "Overrides", render: (r) => money(r.overrides) },
          { key: "net", header: "Net", render: (r) => <span className="font-medium">{money(r.net)}</span> },
          { key: "status", header: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)}>{statusIcon(r.status)} {r.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function PayrollEmployeePage() {
  const { empId } = useParams();
  const line = PAYROLL_LINES.find((p) => p.employeeId === empId) ?? PAYROLL_LINES[0];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="max-w-xl">
      <PageHeader title={employeeName(line.employeeId)} description="August 2026" />
      <Panel>
        {[
          ["Base salary", line.base, "Monthly salary in force from 01 Jul 2026"],
          ["Overtime", line.ot, "OT hours × OT rate from the compensation plan"],
          ["Transport allowance", line.allowances, "Fixed monthly transport"],
          ["Absence deduction", line.absence, "1 absence day × SAR 160 daily deduction"],
          ["Management waiver", line.overrides, "Director waiver. Attendance remains Absent."],
          ["Advance recovery", line.advances, "Installment from ADV-2026-0084"],
        ].map(([l, v, exp]) => (
          <div key={String(l)} className="flex items-start justify-between border-b border-line px-4 py-2 text-[13px]">
            <div>
              <button type="button" className="font-medium underline" onClick={() => setOpen(open === l ? null : String(l))}>
                {l}
              </button>
              {open === l ? <div className="text-muted">View calculation: {exp}</div> : null}
            </div>
            <div className="tabular-nums">{money(Number(v))}</div>
          </div>
        ))}
        <div className="flex justify-between px-4 py-3 font-heading text-[16px] font-semibold">
          <span>Net payable</span>
          <span>{money(line.net)}</span>
        </div>
      </Panel>
    </div>
  );
}

export function PayrollApprovePage() {
  const can = useCan();
  const { toast } = useApp();
  const nav = useNavigate();
  if (!can("payroll.approve")) {
    return <Restricted explanation="Only Owner / Director can approve payroll in this demo." />;
  }
  return (
    <div className="max-w-2xl">
      <PageHeader title="Approve August 2026 payroll" />
      <Panel className="grid grid-cols-2 gap-3 p-4 text-[13px]">
        <div>Employees 524</div>
        <div>Gross {money(2458760)}</div>
        <div>Deductions {money(112320)}</div>
        <div>Advance recovery {money(44600)}</div>
        <div>Management overrides {money(18400)}</div>
        <div className="font-semibold">Net {money(2320240)}</div>
      </Panel>
      <h3 className="mb-2 mt-4 font-heading text-[16px] font-semibold">Exceptions still open</h3>
      <ul className="list-disc ps-5 text-[13px]">
        <li>Ahmed Al-Harbi — absence waiver SAR 480 awaiting this approval</li>
        <li>Bilal Ahmad — timesheet dispute still open (excluded from this run)</li>
      </ul>
      <Alert tone="warning" title="After finalization">
        Amounts cannot be edited directly. Corrections require an adjustment.
      </Alert>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => toast("Returned to Abdullah Al-Ghamdi.")}>Return to accountant</Button>
        <Button
          variant="primary"
          onClick={() => {
            toast("Payroll approved. Ready to finalize.");
            nav("/payroll/pr-2026-08");
          }}
        >
          Approve payroll
        </Button>
        <Button
          variant="gold"
          onClick={() => toast("Payroll finalized. Bank file can now be exported. No undo.")}
        >
          Finalize
        </Button>
      </div>
    </div>
  );
}

export function AdvanceListPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader
        title="Salary advances"
        actions={
          <Link to="/advances/new">
            <Button variant="gold">Record request</Button>
          </Link>
        }
      />
      <DataTable
        rows={ADVANCES}
        onRowClick={(a) => nav(`/advances/${a.id}`)}
        columns={[
          { key: "id", header: "Advance" },
          { key: "employeeId", header: "Employee", render: (a) => employeeName(a.employeeId) },
          { key: "requested", header: "Requested", render: (a) => money(a.requested) },
          { key: "approved", header: "Approved", render: (a) => (a.approved == null ? "—" : money(a.approved)) },
          { key: "outstanding", header: "Outstanding", render: (a) => money(a.outstanding) },
          { key: "status", header: "Status", render: (a) => <StatusBadge tone={toneFor(a.status)}>{statusIcon(a.status)} {a.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function AdvanceDetailPage() {
  const { id } = useParams();
  const a = ADVANCES.find((x) => x.id === id) ?? ADVANCES[0];
  const can = useCan();
  const { toast } = useApp();
  const [amount, setAmount] = useState(String(a.requested));
  return (
    <div className="max-w-xl">
      <PageHeader title={a.id} description={employeeName(a.employeeId)} />
      <Panel className="grid grid-cols-2 gap-3 p-4 text-[13px]">
        <div>Requested {money(a.requested)}</div>
        <div>Current salary {a.employeeId === "PS-1057" ? money(5200) : money(4800)}</div>
        <div>Outstanding advances {money(a.outstanding)}</div>
        <div>
          Status <StatusBadge tone={toneFor(a.status)}>{statusIcon(a.status)} {a.status}</StatusBadge>
        </div>
      </Panel>
      {a.id === "ADV-2026-0084" ? (
        <Panel className="mt-4 p-4 text-[13px]">
          <div>Approved {money(1200)} · Paid {money(1200)} · Recovered {money(600)} · Remaining {money(600)}</div>
          <h3 className="mt-3 font-heading text-[16px] font-semibold">Recovery schedule</h3>
          <div className="mt-2">August payroll {money(600)} · Recovered</div>
          <div>September payroll {money(600)} · Planned</div>
        </Panel>
      ) : null}
      {can("advance.approve") && (a.status === "Requested" || a.status === "Under review") ? (
        <div className="mt-4 space-y-3">
          <Button variant="primary" onClick={() => toast(`Approved ${money(a.requested)}.`)}>
            Approve {money(a.requested)}
          </Button>
          <Field label="Or approve a different amount">
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="Reason">
            <Input defaultValue="Maximum advance approved this month" />
          </Field>
          <Button onClick={() => toast(`Partially approved SAR ${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}.`)}>
            Approve different amount
          </Button>
          <Button variant="danger-outline" onClick={() => toast("Request rejected. Employee will see the reason.")}>
            Reject
          </Button>
        </div>
      ) : null}
      {can("advance.pay") && a.status === "Approved" ? (
        <Button className="mt-3" variant="gold" onClick={() => toast("Payment recorded.")}>
          Record payment
        </Button>
      ) : null}
    </div>
  );
}

export function AdvanceNewPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div className="max-w-lg">
      <PageHeader title="Salary advance (on behalf of employee)" />
      <div className="grid gap-3">
        <Field label="Employee">
          <Select defaultValue="PS-1042">
            <option value="PS-1042">PS-1042 Ahmed Al-Harbi</option>
          </Select>
        </Field>
        <Field label="Requested amount">
          <Input defaultValue="1500" />
        </Field>
        <Field label="Reason">
          <Textarea />
        </Field>
        <Field label="Preferred recovery">
          <Select>
            <option>Next salary</option>
            <option>Installments</option>
          </Select>
        </Field>
        <div className="flex gap-2">
          <Button onClick={() => nav(-1)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              toast("Request submitted for management review.");
              nav("/advances/ADV-2026-0091");
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RateCardListPage() {
  return (
    <div>
      <PageHeader title="Client rate cards" description="Billing rates are separate from employee salary." />
      <DataTable
        rows={RATE_CARDS}
        columns={[
          { key: "name", header: "Rate card", render: (r) => <Link className="underline" to={`/rate-cards/${r.id}`}>{r.name}</Link> },
          { key: "effective", header: "Effective", render: (r) => formatDate(r.effective) },
          { key: "status", header: "Status" },
        ]}
      />
    </div>
  );
}

export function RateCardDetailPage() {
  const { id } = useParams();
  const rc = RATE_CARDS.find((x) => x.id === id) ?? RATE_CARDS[0];
  return (
    <div>
      <PageHeader title={rc.name} description={`Effective ${formatDate(rc.effective)}`} />
      <table className="erp-table">
        <thead>
          <tr>
            <th>Trade</th>
            <th>Unit</th>
            <th>Regular</th>
            <th>OT</th>
          </tr>
        </thead>
        <tbody>
          {rc.lines.map((l) => (
            <tr key={l.trade}>
              <td>{l.trade}</td>
              <td>{l.unit}</td>
              <td>{l.unit === "Hourly" ? `SAR ${l.regular}/hour` : money(l.regular)}</td>
              <td>{l.ot ? (l.unit === "Hourly" ? `SAR ${l.ot}/hour` : money(l.ot)) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InvoiceListPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader
        title="Invoices"
        actions={
          <Link to="/invoices/new">
            <Button variant="gold">Generate invoice</Button>
          </Link>
        }
      />
      <DataTable
        rows={INVOICES.filter((i) => i.id !== "INV-2026-0089" || true)}
        onRowClick={(i) => nav(`/invoices/${i.id}`)}
        columns={[
          { key: "id", header: "Invoice" },
          { key: "client", header: "Client", render: (i) => CLIENTS.find((c) => c.id === i.clientId)?.displayName },
          { key: "project", header: "Project", render: (i) => PROJECTS.find((p) => p.id === i.projectId)?.name },
          { key: "total", header: "Total", render: (i) => money(i.total) },
          { key: "outstanding", header: "Outstanding", render: (i) => money(i.outstanding) },
          { key: "zatca", header: "ZATCA", render: (i) => <StatusBadge tone={toneFor(i.zatca)}>{statusIcon(i.zatca)} {i.zatca}</StatusBadge> },
          { key: "status", header: "Status", render: (i) => <StatusBadge tone={toneFor(i.status)}>{statusIcon(i.status)} {i.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function InvoiceNewPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div>
      <PageHeader title="Generate invoice from approved timesheets" />
      <div className="grid max-w-xl gap-3">
        <Field label="Client">
          <Select defaultValue="gps">
            <option value="gps">Gulf Petrochem Services</option>
          </Select>
        </Field>
        <Field label="Project">
          <Select defaultValue="jub">
            <option value="jub">Jubail Turnaround 2026</option>
          </Select>
        </Field>
        <Field label="Billing period">
          <Input defaultValue="01–31 Aug 2026" />
        </Field>
      </div>
      <Alert tone="info" title="Found">
        6 approved timesheets · 4,312 regular hours · 286 OT hours. Rate card GPS · Jubail Turnaround 2026 applied.
      </Alert>
      <table className="erp-table mt-4">
        <thead>
          <tr>
            <th>Line</th>
            <th>Hours / qty</th>
            <th>Rate</th>
            <th>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rigger I regular</td>
            <td>1,280 h</td>
            <td>SAR 32/hour</td>
            <td>{money(40960)}</td>
            <td>
              <button type="button" className="underline" onClick={() => toast("Opens source hours from approved timesheets.")}>
                View source hours
              </button>
            </td>
          </tr>
          <tr>
            <td>WPR regular</td>
            <td>576 h</td>
            <td>SAR 42/hour</td>
            <td>{money(24192)}</td>
            <td>
              <span className="underline">View source hours</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => nav(-1)}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            toast("Draft invoice created.");
            nav("/invoices/INV-2026-0087");
          }}
        >
          Create draft invoice
        </Button>
      </div>
    </div>
  );
}

export function InvoiceDetailPage() {
  const { id } = useParams();
  const inv = INVOICES.find((x) => x.id === id) ?? INVOICES[0];
  const [tab, setTab] = useState("invoice");
  const { toast } = useApp();
  const can = useCan();
  const client = CLIENTS.find((c) => c.id === inv.clientId);
  const project = PROJECTS.find((p) => p.id === inv.projectId);
  return (
    <div>
      <PageHeader
        title={inv.id}
        description={
          <span className="flex flex-wrap gap-2">
            <span>{client?.displayName}</span>
            <span>{project?.name}</span>
            <span>{inv.period}</span>
            <StatusBadge tone={toneFor(inv.status)}>
              {statusIcon(inv.status)} {inv.status}
            </StatusBadge>
          </span>
        }
        actions={
          <>
            {can("invoice.finalize") ? <Button variant="primary" onClick={() => toast("Invoice finalized. ZATCA submission queued.")}>Finalize</Button> : null}
            <Button onClick={() => toast("Marked as sent to Huda Al-Naimi.")}>Record sending</Button>
            {can("invoice.void") ? (
              <Button variant="danger-outline" onClick={() => toast("Void requires a reason. Demo only.")}>
                Void
              </Button>
            ) : null}
          </>
        }
      />
      <div className="mb-4 grid grid-cols-2 gap-2 text-[13px] md:grid-cols-4">
        <div>Subtotal {money(inv.subtotal)}</div>
        <div>VAT {money(inv.vat)}</div>
        <div>Total {money(inv.total)}</div>
        <div>
          ZATCA <StatusBadge tone={toneFor(inv.zatca)}>{statusIcon(inv.zatca)} {inv.zatca}</StatusBadge>
        </div>
        <div>Paid {money(inv.paid)}</div>
        <div>Outstanding {money(inv.outstanding)}</div>
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "invoice", label: "Invoice" },
          { id: "source", label: "Source Timesheets" },
          { id: "payments", label: "Payments" },
          { id: "zatca", label: "ZATCA" },
          { id: "attachments", label: "Attachments" },
          { id: "activity", label: "Activity" },
        ]}
      />
      <div className="mt-4 text-[13px]">
        {tab === "invoice" ? <p>Line items follow the GPS rate card. Each line traces to approved timesheet hours.</p> : null}
        {tab === "source" ? (
          <DataTable
            rows={TIMESHEETS.filter((t) => t.projectId === inv.projectId && (t.status === "Approved" || t.status === "Invoiced" || t.status === "Disputed"))}
            columns={[
              { key: "id", header: "Timesheet", render: (t) => <Link className="underline" to={`/timesheets/${t.id}`}>{formatDate(t.periodStart)} – {formatDate(t.periodEnd)}</Link> },
              { key: "regularHours", header: "Regular" },
              { key: "otHours", header: "OT" },
              { key: "status", header: "Status" },
            ]}
          />
        ) : null}
        {tab === "payments" ? (
          <p>
            Payment received {money(inv.paid)}. Remaining {money(inv.outstanding)}.{" "}
            <Link className="underline" to="/payments/new">
              Record payment
            </Link>
          </p>
        ) : null}
        {tab === "zatca" ? <p>Pending clearance. The invoice is issued to the client but ZATCA has not returned a cleared UUID yet.</p> : null}
        {tab === "attachments" ? <p>No extra files.</p> : null}
        {tab === "activity" ? <p>Issued 10 Aug · Partial payment 14 Aug · ZATCA pending.</p> : null}
      </div>
    </div>
  );
}

export function PaymentListPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader
        title="Payments"
        actions={
          <Link to="/payments/new">
            <Button variant="gold">Record client payment</Button>
          </Link>
        }
      />
      <DataTable
        rows={PAYMENTS}
        onRowClick={(p) => nav(`/payments/${p.id}`)}
        columns={[
          { key: "reference", header: "Reference" },
          { key: "kind", header: "Type" },
          { key: "party", header: "Party" },
          { key: "date", header: "Date", render: (p) => formatDate(p.date) },
          { key: "amount", header: "Amount", render: (p) => money(p.amount) },
          { key: "status", header: "Status", render: (p) => <StatusBadge tone={toneFor(p.status)}>{statusIcon(p.status)} {p.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function PaymentDetailPage() {
  const { id } = useParams();
  const p = PAYMENTS.find((x) => x.id === id) ?? PAYMENTS[0];
  return (
    <div>
      <PageHeader title={p.reference} description={p.kind} />
      <Panel className="p-4 text-[13px]">
        <div>{p.party}</div>
        <div>{formatDate(p.date)} · {money(p.amount)}</div>
        <div className="mt-2">{p.notes}</div>
        {p.id === "PAY-S-2026-07" ? <div className="mt-2 text-danger">3 items failed IBAN validation and were paid by cheque.</div> : null}
      </Panel>
    </div>
  );
}

export function PaymentNewPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div className="max-w-lg">
      <PageHeader title="Record client payment" />
      <div className="grid gap-3">
        <Field label="Client">
          <Select>
            <option>Gulf Petrochem Services</option>
          </Select>
        </Field>
        <Field label="Amount received">
          <Input defaultValue="200000" />
        </Field>
        <Field label="Allocate to">
          <Select>
            <option>INV-2026-0087 · remaining SAR 127,474.00</option>
          </Select>
        </Field>
        <p className="text-[13px] text-muted">Invoice SAR 327,474.00 · this receipt SAR 200,000.00 · remaining SAR 127,474.00. Overpayments can sit as unallocated credit.</p>
        <div className="flex gap-2">
          <Button onClick={() => nav(-1)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              toast("Partial payment allocated to INV-2026-0087.");
              nav("/invoices/INV-2026-0087");
            }}
          >
            Allocate
          </Button>
        </div>
      </div>
    </div>
  );
}
