import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CLIENTS, DISPUTES, EMPLOYEES, PROJECTS, TIMESHEET_ROWS, TIMESHEETS, TS_DAYS, VALIDATION_ISSUES } from "@/data";
import { employeeName } from "@/data/employees";
import { formatDate } from "@/lib/format";
import { statusIcon, toneFor } from "@/lib/status";
import { useApp } from "@/store/AppState";
import { Alert, Button, Crumb, Field, Input, PageHeader, Panel, Select, StatusBadge, Tabs, Textarea } from "@/components/ui/primitives";
import { DataTable, FilterChip, Toolbar } from "@/components/ui/Table";
import { Timeline } from "@/components/ui/overlays";

const dayLabel = (iso: string) => {
  const d = new Date(`${iso}T12:00:00+03:00`);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
};

export function TimesheetListPage() {
  const nav = useNavigate();
  const [status, setStatus] = useState("All");
  const rows = useMemo(() => TIMESHEETS.filter((t) => status === "All" || t.status === status), [status]);
  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Timesheets" }]} />}
        title="Timesheet inbox"
        description="Client files arrive as Excel, PDF, photos or paper. Enter them here."
        actions={
          <Link to="/timesheets/upload">
            <Button variant="gold">Upload timesheet</Button>
          </Link>
        }
      />
      <Toolbar>
        {["All", "New", "Being entered", "Validation issue", "Disputed", "Approved"].map((s) => (
          <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
            {s}
          </FilterChip>
        ))}
      </Toolbar>
      <DataTable
        rows={rows}
        onRowClick={(r) => nav(`/timesheets/${r.id}`)}
        columns={[
          { key: "received", header: "Received", render: (r) => formatDate(r.received) },
          { key: "client", header: "Client", render: (r) => CLIENTS.find((c) => c.id === r.clientId)?.displayName },
          { key: "project", header: "Project", render: (r) => PROJECTS.find((p) => p.id === r.projectId)?.name },
          { key: "period", header: "Period", render: (r) => `${formatDate(r.periodStart)} – ${formatDate(r.periodEnd)}` },
          { key: "source", header: "Source", render: (r) => <span title={r.fileName}>{r.source}</span> },
          { key: "fileName", header: "File" },
          { key: "expected", header: "Employees expected" },
          { key: "progress", header: "Progress", render: (r) => `${r.entered} / ${r.expected}` },
          { key: "issues", header: "Issues" },
          { key: "status", header: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)}>{statusIcon(r.status)} {r.status}</StatusBadge> },
          { key: "clerk", header: "Assigned clerk" },
        ]}
      />
    </div>
  );
}

export function TimesheetUploadPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  const [step] = useState(1);
  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Timesheets", to: "/timesheets" }, { label: "Upload" }]} />}
        title="Upload client timesheet"
        description="Identify the project and period, then enter rows against the original file."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-4">
          <h2 className="font-heading text-[16px] font-semibold">Source file</h2>
          <div className="mt-3 rounded-[8px] border border-dashed border-line px-4 py-10 text-center text-[13px] text-muted">
            Drop PDF, Excel, photo or scan
            <div className="mt-2 text-ink">Using GPS_Weekly_Timesheet_v3_09-15Aug.xlsx</div>
          </div>
          <div className="mt-4 grid gap-3">
            <Field label="Client" required>
              <Select defaultValue="gps">
                {CLIENTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Project" required>
              <Select defaultValue="jub">
                {PROJECTS.filter((p) => p.status !== "Closed").map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Period start">
                <Input type="date" defaultValue="2026-08-09" />
              </Field>
              <Field label="Period end">
                <Input type="date" defaultValue="2026-08-15" />
              </Field>
            </div>
            <Field label="Known template">
              <Select defaultValue="tpl-gps-v3">
                <option value="tpl-gps-v3">GPS Weekly Timesheet v3</option>
                <option>None — map columns</option>
              </Select>
            </Field>
            <Alert tone="info">Column B → Employee ID · C → Name · G → Regular · H → OT. This mapping is saved for GPS.</Alert>
          </div>
        </Panel>
        <Panel className="p-4">
          <h2 className="font-heading text-[16px] font-semibold">Preview</h2>
          <div className="mt-3 h-[420px] overflow-auto bg-surface-2 p-3 font-heading text-[12px] leading-relaxed text-ink">
            <div className="mb-2 font-semibold">Gulf Petrochem Services — Weekly attendance</div>
            <div>Project: Jubail TA 2026 &nbsp; Week: 09–15 Aug 2026</div>
            <table className="mt-3 w-full border border-line bg-white text-start">
              <thead>
                <tr className="bg-surface-2">
                  <th className="border border-line p-1">Emp ID</th>
                  <th className="border border-line p-1">Name</th>
                  <th className="border border-line p-1">09</th>
                  <th className="border border-line p-1">10</th>
                  <th className="border border-line p-1">11</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-line p-1">PS-1042</td>
                  <td className="border border-line p-1">Ahmed Al-Harbi</td>
                  <td className="border border-line p-1">8</td>
                  <td className="border border-line p-1">8</td>
                  <td className="border border-line p-1">A</td>
                </tr>
                <tr>
                  <td className="border border-line p-1">PS-1057</td>
                  <td className="border border-line p-1">M. Imran Khan</td>
                  <td className="border border-line p-1">8</td>
                  <td className="border border-line p-1">8</td>
                  <td className="border border-line p-1">8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => nav("/timesheets")}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                toast("Opened entry workspace. Client, project and assigned workers were prefilled.");
                nav("/timesheets/ts-jub-0815/enter");
              }}
            >
              Continue to entry
            </Button>
          </div>
        </Panel>
      </div>
      <div className="mt-2 text-[12px] text-muted">Step {step} of 5 — Upload → identify → template → enter → validate</div>
    </div>
  );
}

export function TimesheetEnterPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  const [rows, setRows] = useState(TIMESHEET_ROWS);
  const [sel, setSel] = useState<string | null>(null);
  const [undo, setUndo] = useState<typeof TIMESHEET_ROWS | null>(null);

  return (
    <div>
      <PageHeader
        breadcrumb={
          <Crumb
            items={[
              { label: "Projects", to: "/projects" },
              { label: "Jubail Turnaround 2026", to: "/projects/jub" },
              { label: "Timesheets", to: "/timesheets" },
              { label: "09–15 Aug 2026" },
            ]}
          />
        }
        title="Enter timesheet"
        description="Keyboard: arrows move · type hours or pick a code · Ctrl+V pastes from Excel."
        actions={
          <>
            <Button
              onClick={() => {
                if (undo) setRows(undo);
                toast("Last change undone.");
              }}
            >
              Undo
            </Button>
            <Button>Save draft</Button>
            <Button
              variant="primary"
              onClick={() => {
                toast("Validation ran. 4 issues need a decision.");
                nav("/timesheets/ts-jub-0815/validate");
              }}
            >
              Validate
            </Button>
          </>
        }
      />
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="font-medium">Codes:</span>
        {[
          ["P / 8", "Present hours"],
          ["A", "Absent"],
          ["OFF", "Scheduled off"],
          ["L", "Approved leave"],
          ["SICK", "Sick leave"],
          ["H", "Holiday"],
        ].map(([c, l]) => (
          <button
            key={c}
            type="button"
            className="rounded-full border border-line bg-white px-2 py-0.5"
            onClick={() => toast(`Selected code ${c} — click a cell to apply.`)}
          >
            {c} {l}
          </button>
        ))}
        <Button size="sm">Copy previous row</Button>
        <Button size="sm">Bulk status</Button>
        <Button size="sm">Filter exceptions</Button>
      </div>
      <div className="erp-table-wrap erp-scroll">
        <table className="erp-table erp-sheet">
          <thead>
            <tr>
              <th>Employee</th>
              {TS_DAYS.map((d) => (
                <th key={d}>{dayLabel(d)}</th>
              ))}
              <th>Reg</th>
              <th>OT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const emp = EMPLOYEES.find((e) => e.id === r.employeeId);
              return (
                <tr key={r.employeeId}>
                  <td>
                    <div className="font-medium">
                      {emp?.firstName} {emp?.lastName}
                    </div>
                    <div className="text-[11px] text-muted">{r.employeeId}</div>
                  </td>
                  {TS_DAYS.map((d) => {
                    const key = `${r.employeeId}:${d}`;
                    const val = r.days[d] ?? "";
                    return (
                      <td
                        key={d}
                        data-code={val}
                        className={sel === key ? "cell-selected" : undefined}
                        onClick={() => setSel(key)}
                      >
                        <input
                          className="w-12 bg-transparent text-center outline-none"
                          value={val}
                          onChange={(ev) => {
                            setUndo(rows);
                            setRows((rs) =>
                              rs.map((x) => (x.employeeId === r.employeeId ? { ...x, days: { ...x.days, [d]: ev.target.value } } : x)),
                            );
                          }}
                        />
                      </td>
                    );
                  })}
                  <td>{r.regular}</td>
                  <td>{r.ot}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TimesheetValidatePage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div>
      <PageHeader title="Validation" description="Fix these before employees are asked to confirm." />
      <div className="space-y-3">
        {VALIDATION_ISSUES.map((v) => (
          <Panel key={v.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="text-[14px]">{v.text}</div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => nav("/timesheets/ts-jub-0815/enter")}>
                Fix
              </Button>
              <Button size="sm" onClick={() => toast("Accepted with reason recorded in this demo.")}>
                Accept with reason
              </Button>
              {v.id === "v3" ? (
                <Button size="sm" onClick={() => toast("Duplicate row removed.")}>
                  Remove duplicate
                </Button>
              ) : null}
              {v.id === "v4" ? (
                <Button size="sm" onClick={() => toast("Missing workers added from the assignment list.")}>
                  Add missing worker
                </Button>
              ) : null}
            </div>
          </Panel>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => nav("/timesheets/ts-jub-0815/enter")}>Back to entry</Button>
        <Button
          variant="primary"
          onClick={() => {
            toast("Submitted for employee verification.");
            nav("/timesheets/ts-jub-0815");
          }}
        >
          Submit for employee verification
        </Button>
      </div>
    </div>
  );
}

export function TimesheetDetailPage() {
  const { id } = useParams();
  const ts = TIMESHEETS.find((t) => t.id === id) ?? TIMESHEETS[0];
  const [tab, setTab] = useState("sheet");
  const project = PROJECTS.find((p) => p.id === ts.projectId);
  const client = CLIENTS.find((c) => c.id === ts.clientId);
  return (
    <div>
      <PageHeader
        breadcrumb={
          <Crumb
            items={[
              { label: "Projects", to: "/projects" },
              { label: project?.name ?? "Project", to: `/projects/${ts.projectId}` },
              { label: "Timesheets" },
            ]}
          />
        }
        title={`${formatDate(ts.periodStart)} – ${formatDate(ts.periodEnd)}`}
        description={
          <span className="flex flex-wrap gap-2">
            <span>{project?.name}</span>
            <span>· {client?.displayName}</span>
            <StatusBadge tone={toneFor(ts.status)}>
              {statusIcon(ts.status)} {ts.status}
            </StatusBadge>
          </span>
        }
        actions={
          <>
            <Link to={`/timesheets/${ts.id}/enter`}>
              <Button>Open entry</Button>
            </Link>
            <Link to={`/timesheets/${ts.id}/disputes`}>
              <Button variant="gold">Review disputes</Button>
            </Link>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-6 text-[13px]">
        <span>{ts.expected} employees</span>
        <span>{ts.regularHours.toLocaleString()} regular hours</span>
        <span>{ts.otHours.toLocaleString()} OT hours</span>
        <span>{ts.absences} absences</span>
        <span>{ts.disputed} disputes</span>
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "sheet", label: "Timesheet" },
          { id: "verify", label: "Employee verification" },
          { id: "disputes", label: "Disputes" },
          { id: "attendance", label: "Attendance impact" },
          { id: "payroll", label: "Payroll impact" },
          { id: "billing", label: "Billing impact" },
          { id: "source", label: "Source document" },
          { id: "activity", label: "Activity" },
        ]}
      />
      <div className="mt-4">
        {tab === "sheet" ? (
          <DataTable
            rows={TIMESHEET_ROWS.map((r) => ({ ...r, id: r.employeeId }))}
            columns={[
              { key: "employeeId", header: "Employee", render: (r) => employeeName(r.employeeId) },
              ...TS_DAYS.map((d) => ({ key: d, header: dayLabel(d), render: (r: (typeof TIMESHEET_ROWS)[0]) => r.days[d] })),
              { key: "regular", header: "Reg" },
              { key: "ot", header: "OT" },
              { key: "employeeStatus", header: "Employee", render: (r) => <StatusBadge tone={toneFor(r.employeeStatus)}>{statusIcon(r.employeeStatus)} {r.employeeStatus}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "verify" ? (
          <p className="text-[13px]">
            {ts.confirmed} confirmed · {ts.awaiting} awaiting · {ts.disputed} disputed
          </p>
        ) : null}
        {tab === "disputes" ? <DisputeList embedded /> : null}
        {tab === "attendance" ? (
          <Alert tone="info">Approved hours become attendance. A later payroll waiver does not change Absent to Present.</Alert>
        ) : null}
        {tab === "payroll" ? <p className="text-[13px]">This week feeds August payroll after approval. Disputed lines are excluded until resolved.</p> : null}
        {tab === "billing" ? <p className="text-[13px]">4,312 regular + 286 OT bill against GPS rate card after approval. <Link className="underline" to="/invoices/new">Generate invoice</Link></p> : null}
        {tab === "source" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel className="h-[480px] bg-surface-2 p-4 text-[12px]">Original Excel preview (GPS Weekly Timesheet v3)</Panel>
            <Panel className="p-4 text-[13px]">
              <div>File: {ts.fileName}</div>
              <div>Received {formatDate(ts.received)} · {ts.source}</div>
            </Panel>
          </div>
        ) : null}
        {tab === "activity" ? (
          <Panel className="p-4">
            <Timeline
              items={[
                { date: "16 Aug 2026", text: "Ahmed contested 11 Aug." },
                { date: "16 Aug 2026", text: "Omar submitted for employee verification." },
                { date: "16 Aug 2026", text: "File received from Khalid Al-Otaibi." },
              ]}
            />
          </Panel>
        ) : null}
      </div>
    </div>
  );
}

export function DisputeList({ embedded }: { embedded?: boolean } = {}) {
  const inner = (
    <DataTable
      rows={DISPUTES}
      columns={[
        { key: "employeeId", header: "Employee", render: (d) => <Link className="underline" to={`/timesheets/${d.timesheetId}/disputes/${d.id}`}>{employeeName(d.employeeId)}</Link> },
        { key: "date", header: "Date", render: (d) => formatDate(d.date) },
        { key: "clientEntry", header: "Client" },
        { key: "employeeClaim", header: "Employee claim" },
        { key: "status", header: "Status", render: (d) => <StatusBadge tone={toneFor(d.status)}>{statusIcon(d.status)} {d.status}</StatusBadge> },
      ]}
    />
  );
  if (embedded) return inner;
  return (
    <div>
      <PageHeader title="Timesheet disputes" description="Payroll will not use a disputed entry until it is resolved." />
      {inner}
    </div>
  );
}

export function DisputeDetailPage() {
  const { disputeId } = useParams();
  const d = DISPUTES.find((x) => x.id === disputeId) ?? DISPUTES[0];
  const { toast } = useApp();
  const [reason, setReason] = useState("");
  return (
    <div>
      <PageHeader
        breadcrumb={
          <Crumb
            items={[
              { label: "Timesheets", to: "/timesheets" },
              { label: "09–15 Aug", to: "/timesheets/ts-jub-0815" },
              { label: "Dispute" },
            ]}
          />
        }
        title={`${employeeName(d.employeeId)} · ${formatDate(d.date)}`}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-4">
          <h3 className="font-heading text-[16px] font-semibold">Client timesheet</h3>
          <div className="mt-2 text-[22px] font-heading font-semibold">{d.clientEntry}</div>
          <p className="mt-2 text-[13px] text-muted">Source: GPS weekly sheet, row for PS-1042, 11 Aug column marked A.</p>
        </Panel>
        <Panel className="p-4">
          <h3 className="font-heading text-[16px] font-semibold">Employee claim</h3>
          <div className="mt-2 text-[22px] font-heading font-semibold">{d.employeeClaim}</div>
          <p className="mt-2 text-[13px]">{d.note}</p>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel className="h-56 bg-surface-2 p-4 text-[12px]">Source document preview</Panel>
        <Panel className="p-4 text-[13px]">
          <h3 className="font-heading text-[16px] font-semibold">Previous attendance</h3>
          <p className="mt-2">09 Aug Present · 10 Aug Present · 11 Aug Absent (this dispute) · 12–14 Present · 15 Off</p>
        </Panel>
      </div>
      <Field label="Resolution reason" required>
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Required before any action" />
      </Field>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={() => toast("Client entry kept. Employee will be notified. Reason stored on the audit log.")}
        >
          Keep client entry
        </Button>
        <Button onClick={() => toast("Corrected to 8 hours. Payroll and attendance will use 8 hours. Employee notified.")}>Correct to 8 hours</Button>
        <Button onClick={() => toast("Clarification requested from Khalid Al-Otaibi.")}>Request client clarification</Button>
        <Button onClick={() => toast("Message sent to the employee.")}>Ask employee for more information</Button>
      </div>
      <Panel className="mt-4 p-4">
        <h3 className="mb-2 font-heading text-[16px] font-semibold">Timeline</h3>
        <Timeline
          items={[
            { date: "16 Aug 2026 · 06:15", text: "Employee contested" },
            { date: "16 Aug 2026 · 09:12", text: "Coordinator reviewed" },
            { date: "16 Aug 2026 · 09:40", text: "Client clarification requested" },
            { date: "Waiting", text: "Corrected / employee notified — not yet" },
          ]}
        />
      </Panel>
    </div>
  );
}
