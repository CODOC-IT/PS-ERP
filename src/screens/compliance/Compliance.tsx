import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DOCUMENTS, EMPLOYEES, MOBILIZATION, PROJECTS } from "@/data";
import { daysUntil, formatDate } from "@/lib/format";
import { employeeName } from "@/data/employees";
import { statusIcon, toneFor } from "@/lib/status";
import { useApp } from "@/store/AppState";
import { Alert, Button, Crumb, Field, Input, PageHeader, Panel, Select, StatusBadge, Tabs, Textarea } from "@/components/ui/primitives";
import { DataTable, FilterChip, Toolbar } from "@/components/ui/Table";
import { Timeline } from "@/components/ui/overlays";

export function DocumentLibraryPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader
        title="Document library"
        actions={
          <Link to="/documents/upload">
            <Button variant="gold">Upload document</Button>
          </Link>
        }
      />
      <DataTable
        rows={DOCUMENTS.filter((d) => d.verification !== "Missing")}
        onRowClick={(d) => nav(`/documents/${d.id}`)}
        columns={[
          { key: "employeeId", header: "Employee", render: (d) => employeeName(d.employeeId) },
          { key: "type", header: "Type" },
          { key: "number", header: "Number" },
          { key: "expiryDate", header: "Expiry", render: (d) => (d.expiryDate ? formatDate(d.expiryDate) : "—") },
          { key: "verification", header: "Status", render: (d) => <StatusBadge tone={toneFor(d.verification)}>{statusIcon(d.verification)} {d.verification}</StatusBadge> },
        ]}
      />
    </div>
  );
}

export function DocumentDetailPage() {
  const { id } = useParams();
  const d = DOCUMENTS.find((x) => x.id === id) ?? DOCUMENTS[0];
  const { toast } = useApp();
  const emp = EMPLOYEES.find((e) => e.id === d.employeeId);
  const days = d.expiryDate ? daysUntil(d.expiryDate) : null;
  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Documents", to: "/documents" }, { label: d.type }]} />}
        title={`${d.type} · ${emp?.firstName} ${emp?.lastName}`}
        description={
          days !== null ? (
            <span>
              {days < 0 ? `Expired ${Math.abs(days)} days ago` : `Expires in ${days} days`} · {d.expiryDate ? formatDate(d.expiryDate) : ""}
            </span>
          ) : (
            "No expiry"
          )
        }
        actions={
          <>
            <Button variant="primary" onClick={() => toast("Document verified.")}>
              Verify
            </Button>
            <Button variant="danger-outline" onClick={() => toast("Document rejected. Employee notified.")}>
              Reject
            </Button>
            <Link to={`/documents/upload?replace=${d.id}`}>
              <Button>Replace / renew</Button>
            </Link>
            <Button>Download</Button>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="flex h-[560px] items-center justify-center bg-surface-2 text-[13px] text-muted">
          {d.fileName ? `Preview · ${d.fileName}` : "No file attached"}
        </Panel>
        <div>
          <Panel className="grid gap-2 p-4 text-[13px]">
            <div>Document number {d.number || "—"}</div>
            <div>Issue {d.issueDate ? formatDate(d.issueDate) : "—"}</div>
            <div>Expiry {d.expiryDate ? formatDate(d.expiryDate) : "—"}</div>
            <div>Issuer {d.issuer || "—"}</div>
            <div>
              Status{" "}
              <StatusBadge tone={toneFor(d.verification)}>
                {statusIcon(d.verification)} {d.verification}
              </StatusBadge>
            </div>
            <div>
              Uploaded by {d.uploadedBy} · {formatDate(d.uploadedDate)}
            </div>
            <div>Current version {d.version || "—"}</div>
            <Link className="underline" to={`/employees/${d.employeeId}`}>
              Open employee
            </Link>
          </Panel>
          <h3 className="mb-2 mt-4 font-heading text-[16px] font-semibold">Previous versions</h3>
          <Timeline
            items={
              d.version > 1
                ? [
                    { date: formatDate(d.uploadedDate), text: `Version ${d.version} current` },
                    { date: "28 Aug 2025", text: "Version 1 archived on renewal" },
                  ]
                : [{ date: formatDate(d.uploadedDate), text: "Version 1 — original" }]
            }
          />
        </div>
      </div>
    </div>
  );
}

export function DocumentUploadPage() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div className="max-w-2xl">
      <PageHeader title="Upload document" />
      <div className="grid gap-3">
        <Field label="Employee" required>
          <Select defaultValue="PS-1042">
            {EMPLOYEES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.id} {e.firstName} {e.lastName}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Document type" required>
          <Select>
            <option>Iqama</option>
            <option>Passport</option>
            <option>Gate pass</option>
            <option>Medical certificate</option>
            <option>Trade certification</option>
          </Select>
        </Field>
        <Field label="Document number">
          <Input />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Issue date">
            <Input type="date" />
          </Field>
          <Field label="Expiry date">
            <Input type="date" />
          </Field>
        </div>
        <Field label="Issuer">
          <Input />
        </Field>
        <div className="rounded-[8px] border border-dashed border-line px-4 py-10 text-center text-[13px] text-muted">Drop PDF or photo</div>
        <div className="flex gap-2">
          <Button onClick={() => nav(-1)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              toast("Document uploaded. Status: Awaiting verification.");
              nav("/documents/d-1042-iqama");
            }}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ExpiryMonitorPage() {
  const [params] = useSearchParams();
  const [windowF, setWindowF] = useState(params.get("window") ?? "30");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [group, setGroup] = useState("urgency");
  const rows = useMemo(() => {
    return DOCUMENTS.filter((d) => d.expiryDate).filter((d) => {
      const days = daysUntil(d.expiryDate!);
      if (windowF === "expired") return days < 0;
      const n = Number(windowF);
      if (days < 0) return true;
      return days <= n;
    });
  }, [windowF]);

  return (
    <div>
      <PageHeader
        title="Expiry monitor"
        description="18 employees may become non-mobilizable within 30 days. Expired Iqama, passport, medical or gate pass blocks site access."
        actions={
          <>
            <Button>Notify employees</Button>
            <Button>Assign renewal task</Button>
            <Button>Export</Button>
            <Button>Mark renewed</Button>
          </>
        }
      />
      <Alert tone="warning">
        Gate passes for Imran Khan, Abdul Rahman and Noor Alam expire before the next Jubail shift.
      </Alert>
      <Toolbar>
        {[
          ["expired", "Already expired"],
          ["7", "7 days"],
          ["30", "30 days"],
          ["60", "60 days"],
          ["90", "90 days"],
        ].map(([k, l]) => (
          <FilterChip key={k} active={windowF === k} onClick={() => setWindowF(k)}>
            {l}
          </FilterChip>
        ))}
        <Select className="max-w-[180px]">
          <option>All document types</option>
          <option>Iqama</option>
          <option>Gate pass</option>
        </Select>
        <Button size="sm" onClick={() => setView(view === "list" ? "calendar" : "list")}>
          {view === "list" ? "Calendar view" : "List view"}
        </Button>
        <Select className="max-w-[180px]" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="urgency">Group by urgency</option>
          <option value="type">Group by document type</option>
          <option value="project">Group by project</option>
        </Select>
      </Toolbar>
      {view === "list" ? (
        <DataTable
          selectable
          rows={rows}
          columns={[
            { key: "employeeId", header: "Employee", render: (d) => <Link className="underline" to={`/employees/${d.employeeId}`}>{employeeName(d.employeeId)}</Link> },
            { key: "type", header: "Document" },
            { key: "expiryDate", header: "Expiry", render: (d) => formatDate(d.expiryDate!) },
            { key: "days", header: "Days", render: (d) => daysUntil(d.expiryDate!) },
            { key: "verification", header: "Status", render: (d) => <StatusBadge tone={toneFor(d.verification)}>{statusIcon(d.verification)} {d.verification}</StatusBadge> },
            { key: "a", header: "", render: (d) => <Link className="underline" to={`/documents/${d.id}`}>Request renewal</Link> },
          ]}
        />
      ) : (
        <Panel className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <div key={d} className={`rounded-[4px] py-3 ${[4, 10, 18, 20, 28].includes(d) ? "bg-danger-bg" : "bg-surface-2"}`}>
                {d}
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

export function MobilizationPage() {
  const [params] = useSearchParams();
  const blockedOnly = params.get("view") === "blocked";
  const rows = blockedOnly ? MOBILIZATION.filter((m) => m.status === "Blocked") : MOBILIZATION;
  const nav = useNavigate();
  return (
    <div>
      <PageHeader
        title="Mobilization"
        description="Each assigned worker must pass readiness checks before site access."
        actions={<Button variant="gold">Bulk mark ready (selected)</Button>}
      />
      <Toolbar>
        <FilterChip active={!blockedOnly} onClick={() => nav("/mobilization")}>
          All
        </FilterChip>
        <FilterChip active={blockedOnly} onClick={() => nav("/mobilization?view=blocked")}>
          Blocked workers
        </FilterChip>
      </Toolbar>
      <DataTable
        selectable
        rows={rows.map((m) => ({ ...m, id: m.employeeId }))}
        onRowClick={(m) => nav(`/mobilization/${m.employeeId}`)}
        columns={[
          { key: "employeeId", header: "Employee", render: (m) => employeeName(m.employeeId) },
          { key: "projectId", header: "Project", render: (m) => PROJECTS.find((p) => p.id === m.projectId)?.name },
          { key: "status", header: "Status", render: (m) => <StatusBadge tone={toneFor(m.status)}>{statusIcon(m.status)} {m.status}</StatusBadge> },
          { key: "blockReason", header: "Blocking reason", render: (m) => m.blockReason ?? "—" },
        ]}
      />
    </div>
  );
}

export function MobilizationDetailPage() {
  const { id } = useParams();
  const m = MOBILIZATION.find((x) => x.employeeId === id) ?? MOBILIZATION[0];
  const { toast } = useApp();
  const emp = EMPLOYEES.find((e) => e.id === m.employeeId);
  const p = PROJECTS.find((x) => x.id === m.projectId);
  return (
    <div>
      <PageHeader
        title={`${emp?.firstName} ${emp?.lastName}`}
        description={`${p?.name} · ${m.status}${m.blockReason ? ` · ${m.blockReason}` : ""}`}
        actions={
          <>
            <Link to={`/documents/upload?employee=${m.employeeId}`}>
              <Button>Upload gate pass</Button>
            </Link>
            <Button onClick={() => toast("Marked not applicable. Reason required in production.")}>Mark not applicable</Button>
            <Button>Request clarification</Button>
            <Button variant="primary" disabled={m.status === "Blocked"} onClick={() => toast("Mobilization approved.")}>
              Approve mobilization
            </Button>
          </>
        }
      />
      {m.status === "Blocked" ? <Alert tone="danger" title="Blocked">{m.blockReason}</Alert> : null}
      <Panel className="mt-4">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Check</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {m.items.map((i) => (
              <tr key={i.label}>
                <td>{i.label}</td>
                <td className={i.ok ? "text-success" : "text-danger"}>{i.ok ? "✓" : "✕"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export function AttendancePage() {
  const days = ["Present", "Present", "Absent", "Present", "Present", "Present", "Off"];
  return (
    <div>
      <PageHeader title="Attendance" description="Timesheets feed attendance. Payroll deductions are a separate decision." />
      <Tabs
        value="project"
        onChange={() => undefined}
        tabs={[
          { id: "project", label: "Project attendance" },
          { id: "absences", label: "Absence list" },
          { id: "overrides", label: "Exception / waiver requests" },
        ]}
      />
      <div className="mt-4">
        <h3 className="mb-2 font-heading text-[16px] font-semibold">Jubail Turnaround 2026 · 09–15 Aug</h3>
        <DataTable
          rows={EMPLOYEES.filter((e) => e.projectId === "jub").slice(0, 12).map((e, i) => ({ ...e, att: days[i % days.length] }))}
          columns={[
            { key: "id", header: "Employee", render: (e) => <Link className="underline" to={`/attendance/${e.id}`}>{e.firstName} {e.lastName}</Link> },
            { key: "trade", header: "Trade" },
            { key: "att", header: "Sample week", render: (e) => e.att },
          ]}
        />
      </div>
      <div className="mt-4">
        <Link to="/attendance/overrides/or-1042" className="text-[13px] underline">
          Open Ahmed’s waiver request
        </Link>
      </div>
    </div>
  );
}

export function AttendanceDetailPage() {
  return (
    <div>
      <PageHeader title="Ahmed Al-Harbi · August attendance" />
      <Panel className="p-4 text-[13px]">
        <p>August absence: 3 days</p>
        <p>Calculated deduction: SAR 480.00</p>
        <p className="mt-2">Manager override: Waive deduction (awaiting Director)</p>
        <div className="mt-4 border-t border-line pt-3">
          <div>Absence: 3 days (unchanged)</div>
          <div>Calculated deduction: SAR 480.00</div>
          <div>Management waiver: SAR 480.00</div>
          <div className="font-semibold">Net absence deduction: SAR 0.00</div>
        </div>
        <p className="mt-3 text-muted">Attendance stays Absent. The waiver only affects payroll.</p>
      </Panel>
    </div>
  );
}

export function OverridePage() {
  const { toast } = useApp();
  return (
    <div className="max-w-xl">
      <PageHeader title="Attendance deduction override" description="Ahmed Al-Harbi · August" />
      <Alert tone="warning">This does not change attendance from Absent to Present.</Alert>
      <div className="mt-4 grid gap-3">
        <div className="text-[13px]">Calculated deduction SAR 480.00</div>
        <Field label="Decision">
          <Select defaultValue="full">
            <option value="full">Full waiver — SAR 0 net</option>
            <option value="partial">Partial override</option>
            <option value="reject">Reject</option>
          </Select>
        </Field>
        <Field label="Reason" required>
          <Textarea defaultValue="Employee absent due to client-side site closure. Management approved paid absence." />
        </Field>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => toast("Waiver sent to Director for approval.")}>
            Submit for Director approval
          </Button>
        </div>
      </div>
    </div>
  );
}
