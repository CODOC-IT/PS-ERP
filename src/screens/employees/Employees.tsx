import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ADVANCES, ASSIGNMENTS, DOCUMENTS, EMPLOYEES, MOBILIZATION, PAYROLL_LINES, PROJECTS, TIMESHEET_ROWS } from "@/data";
import { ACTIVITY, COMP_HISTORY } from "@/data/master";
import { formatDate, money } from "@/lib/format";
import { useCan } from "@/lib/hooks";
import { statusIcon, toneFor } from "@/lib/status";
import { useApp } from "@/store/AppState";
import { Alert, Button, Crumb, Field, Input, PageHeader, Panel, Select, StatusBadge, Tabs, Textarea, Avatar } from "@/components/ui/primitives";
import { DataTable, FilterChip, Toolbar } from "@/components/ui/Table";
import { ConfirmDialog, Timeline } from "@/components/ui/overlays";

const VIEWS = ["All", "Available Rigger I", "Documents Expiring", "Not Assigned", "Currently Deployed", "Payroll Exceptions"];

export function EmployeeListPage() {
  const nav = useNavigate();
  const can = useCan();
  const [view, setView] = useState("All");
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    return EMPLOYEES.filter((e) => {
      if (q && !`${e.id} ${e.firstName} ${e.lastName} ${e.trade}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (view === "Available Rigger I") return e.trade === "Rigger I" && !e.projectId;
      if (view === "Documents Expiring") return e.documentStatus === "Expiring soon" || e.documentStatus === "Expired";
      if (view === "Not Assigned") return !e.projectId;
      if (view === "Currently Deployed") return !!e.projectId;
      if (view === "Payroll Exceptions") return ["PS-1042", "PS-1011", "PS-1077"].includes(e.id);
      return true;
    });
  }, [view, q]);

  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Employees" }]} />}
        title="Employees"
        description={`${rows.length} shown · ${EMPLOYEES.length} in demo file. Saved views are per user.`}
        actions={
          <>
            {can("employee.create") ? (
              <Link to="/employees/new">
                <Button variant="gold">Add employee</Button>
              </Link>
            ) : (
              <Button disabled>Add employee</Button>
            )}
            <Button>Export selected</Button>
            <Button>Assign to project</Button>
            <Button>Request document renewal</Button>
          </>
        }
      />
      <Toolbar>
        <Input className="max-w-xs" placeholder="Search name, ID or trade" value={q} onChange={(e) => setQ(e.target.value)} />
        {VIEWS.map((v) => (
          <FilterChip key={v} active={view === v} onClick={() => setView(v)}>
            {v}
          </FilterChip>
        ))}
        <Select className="max-w-[160px]">
          <option>All trades</option>
          <option>Rigger I</option>
          <option>WPR</option>
        </Select>
        <Select className="max-w-[160px]">
          <option>All nationalities</option>
          <option>Saudi</option>
          <option>Indian</option>
        </Select>
        <Button size="sm">Columns</Button>
        <Button size="sm">Compact</Button>
      </Toolbar>
      <DataTable
        selectable
        rows={rows}
        onRowClick={(e) => nav(`/employees/${e.id}`)}
        emptyTitle="No employees match this view"
        emptyBody="Try another saved view or clear search."
        columns={[
          { key: "id", header: "Employee ID", sort: true },
          { key: "name", header: "Name", sort: true, value: (e) => `${e.firstName} ${e.lastName}`, render: (e) => <span className="font-medium">{e.firstName} {e.lastName}</span> },
          { key: "trade", header: "Trade" },
          { key: "nationality", header: "Nationality" },
          { key: "projectId", header: "Current project", render: (e) => (e.projectId ? PROJECTS.find((p) => p.id === e.projectId)?.name : "Not assigned") },
          { key: "employmentType", header: "Employment type" },
          { key: "salaryType", header: "Compensation type" },
          { key: "mobile", header: "Mobile" },
          { key: "documentStatus", header: "Document status", render: (e) => <StatusBadge tone={toneFor(e.documentStatus)}>{statusIcon(e.documentStatus)} {e.documentStatus}</StatusBadge> },
          { key: "mobilization", header: "Mobilization", render: (e) => <StatusBadge tone={toneFor(e.mobilization)}>{statusIcon(e.mobilization)} {e.mobilization}</StatusBadge> },
          { key: "status", header: "Employee status", render: (e) => <StatusBadge tone={toneFor(e.status)}>{statusIcon(e.status)} {e.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function EmployeeFormPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  const { id } = useParams();
  const e = EMPLOYEES.find((x) => x.id === id);
  const [showComp, setShowComp] = useState(true);
  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Employees", to: "/employees" }, { label: e ? `Edit ${e.firstName}` : "Add employee" }]} />}
        title={e ? `Edit ${e.firstName} ${e.lastName}` : "Add employee"}
        actions={
          <>
            <Button onClick={() => nav(-1)}>Cancel</Button>
            <Button>Save draft</Button>
            <Button
              variant="primary"
              onClick={() => {
                toast("Employee saved in this demo.");
                nav(e ? `/employees/${e.id}` : "/employees/PS-1042");
              }}
            >
              Save
            </Button>
          </>
        }
      />
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Personal information</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Employee ID" required>
              <Input defaultValue={e?.id ?? "PS-"} />
            </Field>
            <Field label="First name" required>
              <Input defaultValue={e?.firstName} />
            </Field>
            <Field label="Middle name">
              <Input defaultValue={e?.middleName} />
            </Field>
            <Field label="Last name" required>
              <Input defaultValue={e?.lastName} />
            </Field>
            <Field label="Preferred name">
              <Input defaultValue={e?.preferredName} />
            </Field>
            <Field label="Date of birth">
              <Input type="date" defaultValue={e?.dob} />
            </Field>
            <Field label="Nationality">
              <Input defaultValue={e?.nationality} />
            </Field>
            <Field label="Gender">
              <Select defaultValue={e?.gender}>
                <option>Male</option>
                <option>Female</option>
              </Select>
            </Field>
            <Field label="Mobile">
              <Input defaultValue={e?.mobile} />
            </Field>
            <Field label="Email">
              <Input defaultValue={e?.email} />
            </Field>
            <div className="md:col-span-3">
              <Field label="Address">
                <Input defaultValue={e?.address} />
              </Field>
            </div>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Employment</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Joining date">
              <Input type="date" defaultValue={e?.joiningDate} />
            </Field>
            <Field label="Employment status">
              <Select defaultValue={e?.status}>
                <option>Active</option>
                <option>On leave</option>
                <option>Inactive</option>
              </Select>
            </Field>
            <Field label="Trade / category">
              <Input defaultValue={e?.trade} />
            </Field>
            <Field label="Grade">
              <Input defaultValue={e?.grade} />
            </Field>
            <Field label="Coordinator">
              <Input defaultValue={e?.coordinator} />
            </Field>
            <Field label="Default branch">
              <Input defaultValue={e?.branch} />
            </Field>
          </div>
        </section>
        <section>
          <button type="button" className="mb-3 font-heading text-[20px] font-semibold" onClick={() => setShowComp(!showComp)}>
            Compensation {showComp ? "▾" : "▸"}
          </button>
          {showComp ? (
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Salary type">
                <Select defaultValue={e?.salaryType}>
                  <option>Monthly salary</option>
                  <option>Daily rate</option>
                  <option>Hourly rate</option>
                  <option>Percentage</option>
                  <option>Custom</option>
                </Select>
              </Field>
              <Field label="Salary amount">
                <Input defaultValue={e?.salary} />
              </Field>
              <Field label="Daily rate">
                <Input defaultValue={e?.dailyRate} />
              </Field>
              <Field label="Hourly rate">
                <Input defaultValue={e?.hourlyRate} />
              </Field>
              <Field label="Effective date">
                <Input type="date" defaultValue="2026-07-01" />
              </Field>
            </div>
          ) : null}
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Bank / payment</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Bank">
              <Input defaultValue={e?.bank} />
            </Field>
            <Field label="IBAN">
              <Input defaultValue={e?.iban} />
            </Field>
            <Field label="Account holder">
              <Input defaultValue={e ? `${e.firstName} ${e.lastName}` : ""} />
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Emergency contact</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Name">
              <Input defaultValue={e?.emergencyName} />
            </Field>
            <Field label="Phone">
              <Input defaultValue={e?.emergencyPhone} />
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Notes</h2>
          <Textarea />
        </section>
      </div>
    </div>
  );
}

export function EmployeeDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const can = useCan();
  const { toast, remember } = useApp();
  const e = EMPLOYEES.find((x) => x.id === id) ?? EMPLOYEES[0];
  const [tab, setTab] = useState("overview");
  const [archive, setArchive] = useState(false);
  const docs = DOCUMENTS.filter((d) => d.employeeId === e.id);
  const mob = MOBILIZATION.find((m) => m.employeeId === e.id);
  const project = PROJECTS.find((p) => p.id === e.projectId);
  useEffect(() => {
    remember(`${e.firstName} ${e.lastName}`, `/employees/${e.id}`);
  }, [e.id, e.firstName, e.lastName, remember]);

  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Employees", to: "/employees" }, { label: `${e.firstName} ${e.lastName}` }]} />}
        title=""
        actions={
          <>
            <Button onClick={() => nav(-1)}>Back</Button>
            {can("employee.edit") ? (
              <Link to={`/employees/${e.id}/edit`}>
                <Button>Edit</Button>
              </Link>
            ) : (
              <Button disabled>Edit</Button>
            )}
            <Link to="/assignments/new">
              <Button>Assign to project</Button>
            </Link>
            <Link to={`/documents/upload?employee=${e.id}`}>
              <Button>Add document</Button>
            </Link>
            <Button variant="gold" onClick={() => toast("Renewal request sent to the employee in this demo.")}>
              Request renewal
            </Button>
            <Button onClick={() => setArchive(true)}>Archive</Button>
          </>
        }
      />
      <div className="-mt-2 mb-4 flex flex-wrap items-center gap-4">
        <Avatar name={`${e.firstName} ${e.lastName}`} size={56} />
        <div>
          <div className="text-[12px] text-muted">{e.id}</div>
          <h1 className="font-heading text-[28px] font-semibold leading-tight">
            {e.firstName} {e.lastName}
          </h1>
          <div className="text-[14px] text-muted">{e.trade}</div>
        </div>
        <StatusBadge tone={toneFor(e.status)}>
          {statusIcon(e.status)} {e.status}
        </StatusBadge>
        <div className="text-[13px]">
          Assignment: {project?.name ?? "Not assigned"}
          <div>
            Mobilization:{" "}
            <StatusBadge tone={toneFor(e.mobilization)}>
              {statusIcon(e.mobilization)} {e.mobilization}
            </StatusBadge>
          </div>
          {e.blockReason ? <div className="mt-1 max-w-xl text-[13px] text-danger">{e.blockReason}</div> : null}
        </div>
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "assignments", label: "Assignments" },
          { id: "documents", label: "Documents" },
          { id: "timesheets", label: "Timesheets" },
          { id: "attendance", label: "Attendance" },
          { id: "compensation", label: "Compensation" },
          { id: "advances", label: "Salary Advances" },
          { id: "payroll", label: "Payroll History" },
          { id: "activity", label: "Activity" },
        ]}
      />
      <div className="mt-4">
        {tab === "overview" ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel className="p-4 text-[13px] lg:col-span-2">
              <h3 className="font-heading text-[16px] font-semibold">Personal</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>Nationality {e.nationality}</div>
                <div>Born {formatDate(e.dob)}</div>
                <div>{e.mobile}</div>
                <div>{e.email}</div>
                <div className="col-span-2">{e.address}</div>
              </div>
              <h3 className="mt-4 font-heading text-[16px] font-semibold">Employment</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>Joined {formatDate(e.joiningDate)}</div>
                <div>{e.employmentType}</div>
                <div>Coordinator {e.coordinator}</div>
                <div>Branch {e.branch}</div>
              </div>
              <h3 className="mt-4 font-heading text-[16px] font-semibold">Emergency</h3>
              <div>
                {e.emergencyName} · {e.emergencyPhone}
              </div>
            </Panel>
            <Panel className="p-4">
              <h3 className="font-heading text-[16px] font-semibold">Readiness</h3>
              <ul className="mt-2 space-y-2 text-[13px]">
                {(mob?.items ?? [
                  { label: "Iqama", ok: e.documentStatus === "Valid" },
                  { label: "Passport", ok: true },
                  { label: "Trade certificate", ok: true },
                  { label: "Medical", ok: e.documentStatus !== "Expired" },
                  { label: "Gate pass", ok: false },
                ]).map((i) => (
                  <li key={i.label} className="flex justify-between gap-2">
                    <span>{i.label}</span>
                    <span className={i.ok ? "text-success" : "text-danger"}>{i.ok ? "✓ Valid" : "× Missing / blocking"}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-line pt-3 text-[13px] font-medium">
                Result: {e.mobilization === "Ready" || e.mobilization === "On site" ? "Ready for mobilization" : "Not ready for mobilization"}
              </div>
              {e.id === "PS-1042" ? <div className="mt-1 text-[12px] text-muted">Iqama valid until 28 Aug 2026</div> : null}
            </Panel>
          </div>
        ) : null}
        {tab === "documents" ? (
          <DataTable
            rows={docs.length ? docs : [{ id: "none", employeeId: e.id, type: "—", number: "", issueDate: "", expiryDate: null, issuer: "", fileName: "", verification: "Missing" as const, uploadedBy: "", uploadedDate: "", version: 0 }]}
            columns={[
              { key: "type", header: "Document", render: (d) => (d.id === "none" ? "No documents on file" : <Link className="underline" to={`/documents/${d.id}`}>{d.type}</Link>) },
              { key: "number", header: "Number" },
              { key: "expiryDate", header: "Expiry", render: (d) => (d.expiryDate ? formatDate(d.expiryDate) : "—") },
              { key: "verification", header: "Status", render: (d) => <StatusBadge tone={toneFor(d.verification)}>{statusIcon(d.verification)} {d.verification}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "assignments" ? (
          <DataTable
            rows={ASSIGNMENTS.filter((a) => a.employeeId === e.id)}
            emptyTitle="No assignments"
            emptyBody="This worker is on the bench."
            columns={[
              { key: "projectId", header: "Project", render: (a) => PROJECTS.find((p) => p.id === a.projectId)?.name },
              { key: "trade", header: "Trade" },
              { key: "status", header: "Status" },
            ]}
          />
        ) : null}
        {tab === "timesheets" ? (
          <DataTable
            rows={TIMESHEET_ROWS.filter((r) => r.employeeId === e.id).map((r) => ({ ...r, id: r.employeeId }))}
            columns={[
              { key: "employeeId", header: "Period", render: () => <Link className="underline" to="/timesheets/ts-jub-0815">09–15 Aug 2026</Link> },
              { key: "regular", header: "Regular" },
              { key: "ot", header: "OT" },
              { key: "employeeStatus", header: "Verification", render: (r) => <StatusBadge tone={toneFor(r.employeeStatus)}>{statusIcon(r.employeeStatus)} {r.employeeStatus}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "attendance" ? (
          <Panel className="p-4 text-[13px]">
            <p>August absence: 3 days recorded. Calculated deduction {money(480)}.</p>
            <p className="mt-2">Management waiver requested: {money(480)}. Attendance remains Absent.</p>
            <Link className="mt-2 inline-block underline" to="/attendance/PS-1042">
              Open attendance detail
            </Link>
          </Panel>
        ) : null}
        {tab === "compensation" ? (
          <Panel className="p-4">
            {(COMP_HISTORY[e.id as keyof typeof COMP_HISTORY] ?? COMP_HISTORY["PS-1042"]).map((c) => (
              <div key={c.from} className="flex justify-between border-b border-line py-2 text-[13px]">
                <div>
                  <div className="font-medium">{c.note}</div>
                  <div className="text-muted">
                    {formatDate(c.from)} – {c.to ? formatDate(c.to) : "open"} · {c.type}
                  </div>
                </div>
                <div>{c.amount ? money(c.amount) : "—"}</div>
              </div>
            ))}
            <p className="mt-3 text-[12px] text-muted">Historical compensation is never overwritten. Add a future plan instead of editing a closed one.</p>
            <Link to={`/employees/${e.id}/compensation/new`}>
              <Button className="mt-2">Add compensation plan</Button>
            </Link>
          </Panel>
        ) : null}
        {tab === "advances" ? (
          <DataTable
            rows={ADVANCES.filter((a) => a.employeeId === e.id)}
            emptyTitle="No salary advances"
            columns={[
              { key: "id", header: "Advance", render: (a) => <Link className="underline" to={`/advances/${a.id}`}>{a.id}</Link> },
              { key: "requested", header: "Requested", render: (a) => money(a.requested) },
              { key: "status", header: "Status", render: (a) => <StatusBadge tone={toneFor(a.status)}>{statusIcon(a.status)} {a.status}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "payroll" ? (
          <DataTable
            rows={PAYROLL_LINES.filter((p) => p.employeeId === e.id).map((p) => ({ ...p, id: p.employeeId }))}
            columns={[
              { key: "project", header: "Project" },
              { key: "net", header: "Net", render: (p) => money(p.net) },
              { key: "status", header: "Status" },
            ]}
          />
        ) : null}
        {tab === "activity" ? (
          <Panel className="p-4">
            <Timeline items={(ACTIVITY["PS-1042"] ?? []).map((x) => ({ date: formatDate(x.date), text: x.text }))} />
          </Panel>
        ) : null}
      </div>
      <ConfirmDialog
        open={archive}
        title={`Archive ${e.firstName} ${e.lastName}?`}
        confirmLabel="Archive employee"
        danger
        onClose={() => setArchive(false)}
        onConfirm={() => {
          setArchive(false);
          toast(`${e.firstName} will no longer appear in active lists. Historical assignments, payroll and timesheets remain available.`);
          nav("/employees");
        }}
        body={`${e.firstName} will no longer appear in active employee lists. Historical assignments, payroll and timesheets will remain available.`}
      />
    </div>
  );
}

export function CompensationFormPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div className="max-w-xl">
      <PageHeader title="Add compensation plan" description="This becomes current on the effective date. The previous plan is closed, not overwritten." />
      <div className="grid gap-3">
        <Field label="Type">
          <Select>
            <option>Monthly salary</option>
            <option>Daily rate</option>
            <option>Hourly rate</option>
            <option>Percentage</option>
            <option>Custom</option>
          </Select>
        </Field>
        <Field label="Amount">
          <Input defaultValue="4800" />
        </Field>
        <Field label="Effective date">
          <Input type="date" defaultValue="2026-09-01" />
        </Field>
        <div className="flex gap-2">
          <Button onClick={() => nav(-1)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              toast("Future compensation plan added in this demo.");
              nav(-1);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
