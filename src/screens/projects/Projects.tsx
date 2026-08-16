import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ASSIGNMENTS, CLIENTS, EMPLOYEES, PROJECTS, REQUIREMENTS, TIMESHEETS, employeesForProject, reqsForProject } from "@/data";
import { ACTIVITY } from "@/data/master";
import { formatDate } from "@/lib/format";
import { useCan, scopedProjects } from "@/lib/hooks";
import { statusIcon, toneFor } from "@/lib/status";
import { useApp } from "@/store/AppState";
import { Alert, Button, Crumb, Field, Input, PageHeader, Panel, Select, StatusBadge, Tabs, Textarea } from "@/components/ui/primitives";
import { DataTable, FilterChip, Toolbar } from "@/components/ui/Table";
import { Timeline } from "@/components/ui/overlays";

export function ProjectListPage() {
  const nav = useNavigate();
  const can = useCan();
  const scope = scopedProjects();
  const [status, setStatus] = useState("All");
  const rows = useMemo(() => {
    let list = PROJECTS;
    if (scope) list = list.filter((p) => scope.includes(p.id));
    if (status !== "All") list = list.filter((p) => p.status === status);
    return list;
  }, [status, scope]);
  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Projects" }]} />}
        title="Projects"
        description={scope ? "Showing only Jubail Turnaround 2026 and Dammam Civil Works." : `${rows.length} projects. Demo data.`}
        actions={
          can("project.create") ? (
            <Link to="/projects/new">
              <Button variant="gold">Add project</Button>
            </Link>
          ) : (
            <Button disabled>Add project</Button>
          )
        }
      />
      <Toolbar>
        {["All", "Draft", "Mobilizing", "Active", "Suspended", "Closing", "Closed"].map((s) => (
          <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
            {s}
          </FilterChip>
        ))}
      </Toolbar>
      <DataTable
        rows={rows}
        onRowClick={(p) => nav(`/projects/${p.id}`)}
        columns={[
          { key: "name", header: "Project", sort: true, render: (p) => <span className="font-medium">{p.name}</span> },
          { key: "code", header: "Code" },
          { key: "client", header: "Client", render: (p) => CLIENTS.find((c) => c.id === p.clientId)?.displayName },
          { key: "location", header: "Location" },
          { key: "type", header: "Type" },
          { key: "start", header: "Start", render: (p) => formatDate(p.start) },
          { key: "end", header: "End", render: (p) => formatDate(p.end) },
          { key: "requested", header: "Requested" },
          { key: "deployed", header: "Deployed" },
          { key: "timesheetCycle", header: "Timesheet cycle" },
          { key: "status", header: "Status", render: (p) => <StatusBadge tone={toneFor(p.status)}>{statusIcon(p.status)} {p.status}</StatusBadge> },
          { key: "coordinator", header: "Coordinator" },
        ]}
      />
    </div>
  );
}

export function ProjectFormPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  const { id } = useParams();
  const existing = PROJECTS.find((p) => p.id === id);
  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Projects", to: "/projects" }, { label: existing ? existing.name : "Add project" }]} />}
        title={existing ? `Edit ${existing.name}` : "Add project"}
        actions={
          <>
            <Button onClick={() => nav(-1)}>Cancel</Button>
            <Button>Save draft</Button>
            <Button
              variant="primary"
              onClick={() => {
                toast("Project saved in this demo.");
                nav("/projects/jub");
              }}
            >
              Save
            </Button>
          </>
        }
      />
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Project identity</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Project name" required>
              <Input defaultValue={existing?.name} />
            </Field>
            <Field label="Project code" required>
              <Input defaultValue={existing?.code} />
            </Field>
            <Field label="Client" required>
              <Select defaultValue={existing?.clientId ?? "gps"}>
                {CLIENTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Location">
              <Input defaultValue={existing?.location} />
            </Field>
            <Field label="Project type">
              <Select defaultValue={existing?.type}>
                <option>Shutdown / Turnaround</option>
                <option>Industrial maintenance</option>
                <option>Construction / EPC</option>
                <option>Civil</option>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <Textarea defaultValue={existing?.description} />
              </Field>
            </div>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Dates</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Planned start">
              <Input type="date" defaultValue={existing?.start} />
            </Field>
            <Field label="Planned end">
              <Input type="date" defaultValue={existing?.end} />
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Commercial</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Contract reference">
              <Input defaultValue={existing?.contractRef} />
            </Field>
            <Field label="PO reference">
              <Input defaultValue={existing?.poRef} />
            </Field>
            <Field label="Invoice cycle">
              <Input defaultValue={existing?.invoiceCycle} />
            </Field>
            <Field label="Payment terms">
              <Input defaultValue={existing?.paymentTerms} />
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Timesheet configuration</h2>
          <Field label="Cycle">
            <Select defaultValue={existing?.timesheetCycle ?? "Weekly"}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Biweekly</option>
              <option>Monthly</option>
              <option>Custom</option>
            </Select>
          </Field>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Operations</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Coordinator">
              <Input defaultValue={existing?.coordinator ?? "Fatima Al-Zahra"} />
            </Field>
            <Field label="Operations manager">
              <Input defaultValue={existing?.opsManager ?? "Sami Al-Dosari"} />
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Attachments</h2>
          <div className="rounded-[8px] border border-dashed border-line px-4 py-8 text-center text-[13px] text-muted">Drop PO or scope PDF</div>
        </section>
      </div>
    </div>
  );
}

export function ProjectDetailPage() {
  const { id } = useParams();
  const p = PROJECTS.find((x) => x.id === id) ?? PROJECTS[0];
  const [tab, setTab] = useState("overview");
  const reqs = reqsForProject(p.id);
  const workers = employeesForProject(p.id);
  const client = CLIENTS.find((c) => c.id === p.clientId);
  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Projects", to: "/projects" }, { label: p.name }]} />}
        title={p.name}
        description={
          <span className="flex flex-wrap gap-2">
            <span>{client?.displayName}</span>
            <StatusBadge tone={toneFor(p.status)}>
              {statusIcon(p.status)} {p.status}
            </StatusBadge>
            <span>
              {formatDate(p.start)} – {formatDate(p.end)}
            </span>
            <span>Coordinator {p.coordinator}</span>
          </span>
        }
        actions={
          <>
            <Link to="/manpower/new">
              <Button variant="gold">Add manpower requirement</Button>
            </Link>
            <Link to="/assignments/new">
              <Button>Assign workers</Button>
            </Link>
            <Link to="/timesheets/upload">
              <Button>Upload timesheet</Button>
            </Link>
            <Link to={`/projects/${p.id}/edit`}>
              <Button>Edit</Button>
            </Link>
          </>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "manpower", label: "Manpower" },
          { id: "workers", label: "Assigned Workers" },
          { id: "mobilization", label: "Mobilization" },
          { id: "timesheets", label: "Timesheets" },
          { id: "attendance", label: "Attendance" },
          { id: "billing", label: "Billing" },
          { id: "documents", label: "Documents" },
          { id: "activity", label: "Activity" },
        ]}
      />
      <div className="mt-4">
        {tab === "overview" ? (
          <div>
            <p className="mb-3 text-[13px] text-muted">{p.description}</p>
            <h3 className="mb-2 font-heading text-[16px] font-semibold">Requested vs deployed</h3>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Trade</th>
                  <th>Requested</th>
                  <th>Deployed</th>
                  <th>Short</th>
                </tr>
              </thead>
              <tbody>
                {reqs.map((r) => {
                  const short = r.quantity - r.filled;
                  return (
                    <tr key={r.id}>
                      <td>
                        <Link className="underline" to={`/manpower/${r.id}`}>
                          {r.trade}
                        </Link>
                      </td>
                      <td>{r.quantity}</td>
                      <td>{r.filled}</td>
                      <td className={short > 0 ? "font-semibold text-danger" : "text-success"}>{short > 0 ? short : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {reqs.length === 0 ? (
              <Panel className="mt-3 p-8 text-center">
                <div className="font-heading text-[16px] font-semibold">No manpower requirements yet</div>
                <Link to="/manpower/new">
                  <Button className="mt-3" variant="gold">
                    Add first requirement
                  </Button>
                </Link>
              </Panel>
            ) : null}
          </div>
        ) : null}
        {tab === "manpower" ? (
          <DataTable
            rows={reqs}
            columns={[
              { key: "trade", header: "Trade", render: (r) => <Link className="underline" to={`/manpower/${r.id}`}>{r.trade}</Link> },
              { key: "qty", header: "Filled", render: (r) => `${r.filled} / ${r.quantity}` },
              { key: "status", header: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)}>{statusIcon(r.status)} {r.status}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "workers" ? (
          <DataTable
            rows={workers}
            columns={[
              { key: "id", header: "ID" },
              { key: "name", header: "Name", render: (e) => <Link className="underline" to={`/employees/${e.id}`}>{e.firstName} {e.lastName}</Link> },
              { key: "trade", header: "Trade" },
              { key: "mobilization", header: "Mobilization", render: (e) => <StatusBadge tone={toneFor(e.mobilization)}>{statusIcon(e.mobilization)} {e.mobilization}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "mobilization" ? (
          <Link to="/mobilization" className="text-[13px] underline">
            Open mobilization board for this project
          </Link>
        ) : null}
        {tab === "timesheets" ? (
          <DataTable
            rows={TIMESHEETS.filter((t) => t.projectId === p.id)}
            columns={[
              { key: "period", header: "Period", render: (t) => <Link className="underline" to={`/timesheets/${t.id}`}>{formatDate(t.periodStart)} – {formatDate(t.periodEnd)}</Link> },
              { key: "status", header: "Status", render: (t) => <StatusBadge tone={toneFor(t.status)}>{statusIcon(t.status)} {t.status}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "attendance" ? (
          <Link to="/attendance" className="text-[13px] underline">
            Open project attendance
          </Link>
        ) : null}
        {tab === "billing" ? (
          <Panel className="p-4 text-[13px]">
            Unbilled approved hours on this project: 4,312 regular + 286 OT for 09–15 Aug (pending dispute close).{" "}
            <Link className="underline" to="/invoices/new">
              Generate invoice
            </Link>
          </Panel>
        ) : null}
        {tab === "documents" ? <p className="text-[13px] text-muted">Gate pass list and client induction pack live in Documents.</p> : null}
        {tab === "activity" ? (
          <Panel className="p-4">
            <Timeline items={(ACTIVITY.jub ?? []).map((x) => ({ date: formatDate(x.date), text: x.text }))} />
          </Panel>
        ) : null}
      </div>
    </div>
  );
}

export function ManpowerListPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader
        title="Manpower requirements"
        actions={
          <Link to="/manpower/new">
            <Button variant="gold">Add requirement</Button>
          </Link>
        }
      />
      <DataTable
        rows={REQUIREMENTS}
        onRowClick={(r) => nav(`/manpower/${r.id}`)}
        columns={[
          { key: "trade", header: "Trade" },
          { key: "project", header: "Project", render: (r) => PROJECTS.find((p) => p.id === r.projectId)?.name },
          { key: "qty", header: "Filled", render: (r) => `${r.filled} / ${r.quantity}` },
          { key: "from", header: "From", render: (r) => formatDate(r.from) },
          { key: "until", header: "Until", render: (r) => formatDate(r.until) },
          { key: "status", header: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)}>{statusIcon(r.status)} {r.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function ManpowerFormPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div className="max-w-2xl">
      <PageHeader title="Add manpower requirement" breadcrumb={<Crumb items={[{ label: "Manpower", to: "/manpower" }, { label: "Add" }]} />} />
      <div className="grid gap-3">
        <Field label="Project" required>
          <Select defaultValue="jub">
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Trade" required>
          <Select>
            <option>Rigger I</option>
            <option>Work Permit Receiver</option>
            <option>Safety Officer</option>
            <option>Firewatcher</option>
            <option>Helper</option>
          </Select>
        </Field>
        <Field label="Quantity" required>
          <Input type="number" defaultValue={40} />
        </Field>
        <Field label="Required from">
          <Input type="date" defaultValue="2026-08-20" />
        </Field>
        <Field label="Required until">
          <Input type="date" defaultValue="2026-09-30" />
        </Field>
        <Field label="Minimum certification">
          <Input defaultValue="Rigger I valid certificate" />
        </Field>
        <Field label="Other requirements">
          <Textarea defaultValue="Valid Iqama, valid medical, client gate pass, site induction" />
        </Field>
        <div className="flex gap-2">
          <Button onClick={() => nav(-1)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              toast("Requirement saved in this demo.");
              nav("/manpower/req-rig1");
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ManpowerDetailPage() {
  const { id } = useParams();
  const r = REQUIREMENTS.find((x) => x.id === id) ?? REQUIREMENTS[0];
  const p = PROJECTS.find((x) => x.id === r.projectId);
  const candidates = EMPLOYEES.filter((e) => e.trade.includes(r.trade.split(" ")[0]) || e.trade === r.trade).slice(0, 8);
  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Manpower", to: "/manpower" }, { label: r.trade }]} />}
        title={`${r.trade} · ${p?.name}`}
        description={`${r.filled} / ${r.quantity} filled`}
        actions={
          <>
            <Link to="/assignments/new">
              <Button variant="gold">Assign workers</Button>
            </Link>
            <Button>Edit</Button>
            <Button variant="danger-outline">Close requirement</Button>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="p-4 lg:col-span-2">
          <dl className="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <dt className="text-muted">Required from</dt>
              <dd>{formatDate(r.from)}</dd>
            </div>
            <div>
              <dt className="text-muted">Required until</dt>
              <dd>{formatDate(r.until)}</dd>
            </div>
            <div>
              <dt className="text-muted">Minimum certification</dt>
              <dd>{r.minCert}</dd>
            </div>
            <div>
              <dt className="text-muted">Status</dt>
              <dd>
                <StatusBadge tone={toneFor(r.status)}>
                  {statusIcon(r.status)} {r.status}
                </StatusBadge>
              </dd>
            </div>
          </dl>
          <ul className="mt-3 list-disc ps-5 text-[13px]">
            {r.extras.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-4">
          <div className="text-[12px] text-muted">Filled</div>
          <div className="font-heading text-[28px] font-semibold">
            {r.filled} / {r.quantity}
          </div>
          {r.quantity - r.filled > 0 ? <div className="text-[13px] text-danger">Short {r.quantity - r.filled}</div> : <div className="text-success">Filled</div>}
        </Panel>
      </div>
      <h2 className="mb-2 mt-6 font-heading text-[20px] font-semibold">Candidate matching</h2>
      <DataTable
        rows={candidates}
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Name", render: (e) => `${e.firstName} ${e.lastName}` },
          { key: "trade", header: "Trade" },
          { key: "documentStatus", header: "Documents", render: (e) => <StatusBadge tone={toneFor(e.documentStatus)}>{statusIcon(e.documentStatus)} {e.documentStatus}</StatusBadge> },
          { key: "projectId", header: "Current project", render: (e) => (e.projectId ? PROJECTS.find((p) => p.id === e.projectId)?.name : "Available") },
          { key: "a", header: "", render: (e) => (e.projectId ? "—" : <Link className="underline" to="/assignments/new">Assign</Link>) },
        ]}
      />
    </div>
  );
}

export function AssignmentListPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader
        title="Assignments"
        actions={
          <Link to="/assignments/new">
            <Button variant="gold">Assign worker</Button>
          </Link>
        }
      />
      <DataTable
        rows={ASSIGNMENTS}
        onRowClick={(a) => nav(`/assignments/${a.id}`)}
        columns={[
          { key: "employeeId", header: "Employee", render: (a) => {
            const e = EMPLOYEES.find((x) => x.id === a.employeeId);
            return e ? `${e.firstName} ${e.lastName}` : a.employeeId;
          } },
          { key: "project", header: "Project", render: (a) => PROJECTS.find((p) => p.id === a.projectId)?.name },
          { key: "trade", header: "Trade" },
          { key: "start", header: "Start", render: (a) => formatDate(a.start) },
          { key: "plannedEnd", header: "Planned end", render: (a) => formatDate(a.plannedEnd) },
          { key: "status", header: "Status", render: (a) => <StatusBadge tone={toneFor(a.status)}>{statusIcon(a.status)} {a.status}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function AssignmentFormPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  const { id } = useParams();
  const existing = ASSIGNMENTS.find((a) => a.id === id);
  return (
    <div className="max-w-2xl">
      <PageHeader title={existing ? "Edit assignment" : "Assign worker"} />
      <div className="grid gap-3">
        <Field label="Employee" required>
          <Select defaultValue={existing?.employeeId ?? "PS-1042"}>
            {EMPLOYEES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.id} {e.firstName} {e.lastName}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Project" required>
          <Select defaultValue={existing?.projectId ?? "jub"}>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Manpower requirement">
          <Select defaultValue={existing?.requirementId ?? "req-rig1"}>
            {REQUIREMENTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.trade}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Trade on assignment">
          <Input defaultValue={existing?.trade ?? "Rigger I"} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date">
            <Input type="date" defaultValue={existing?.start ?? "2026-08-20"} />
          </Field>
          <Field label="Planned end">
            <Input type="date" defaultValue={existing?.plannedEnd ?? "2026-09-30"} />
          </Field>
        </div>
        <Field label="Client employee ID">
          <Input defaultValue={existing?.clientEmployeeId} />
        </Field>
        <Field label="Site number">
          <Input defaultValue={existing?.siteNumber} />
        </Field>
        <Field label="Billing category">
          <Input defaultValue={existing?.billingCategory} />
        </Field>
        <Field label="Compensation plan">
          <Input defaultValue={existing?.compensationPlan} />
        </Field>
        <Field label="Shift">
          <Select defaultValue={existing?.shift ?? "Day"}>
            <option>Day</option>
            <option>Night</option>
          </Select>
        </Field>
        <Field label="Site">
          <Input defaultValue={existing?.site} />
        </Field>
        <Field label="Status">
          <Select defaultValue={existing?.status ?? "Planned"}>
            <option>Planned</option>
            <option>Mobilizing</option>
            <option>Active</option>
            <option>On hold</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </Select>
        </Field>
        <Field label="Notes">
          <Textarea />
        </Field>
        <div className="flex gap-2">
          <Button onClick={() => nav(-1)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              toast("Assignment saved in this demo.");
              nav("/assignments/as-1042");
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AssignmentDetailPage() {
  const { id } = useParams();
  const a = ASSIGNMENTS.find((x) => x.id === id) ?? ASSIGNMENTS[0];
  const e = EMPLOYEES.find((x) => x.id === a.employeeId);
  const p = PROJECTS.find((x) => x.id === a.projectId);
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div>
      <PageHeader
        title={`${e?.firstName} ${e?.lastName} → ${p?.name}`}
        actions={
          <>
            <Link to={`/assignments/${a.id}/edit`}>
              <Button>Edit dates / rates</Button>
            </Link>
            <Button
              onClick={() => {
                toast("Transfer started in this demo.");
                nav("/assignments/new");
              }}
            >
              Transfer
            </Button>
            <Button variant="danger-outline" onClick={() => toast("Assignment ended in this demo. Historical timesheets remain.")}>
              End assignment
            </Button>
          </>
        }
      />
      <Panel className="grid gap-3 p-4 text-[13px] md:grid-cols-3">
        <div>
          <div className="text-muted">Client employee ID</div>
          {a.clientEmployeeId}
        </div>
        <div>
          <div className="text-muted">Site / shift</div>
          {a.site} · {a.shift}
        </div>
        <div>
          <div className="text-muted">Status</div>
          <StatusBadge tone={toneFor(a.status)}>
            {statusIcon(a.status)} {a.status}
          </StatusBadge>
        </div>
        <div>
          <div className="text-muted">Billing category</div>
          {a.billingCategory}
        </div>
        <div>
          <div className="text-muted">Compensation plan</div>
          {a.compensationPlan}
        </div>
        <div>
          <div className="text-muted">Dates</div>
          {formatDate(a.start)} – {formatDate(a.plannedEnd)}
        </div>
      </Panel>
    </div>
  );
}
