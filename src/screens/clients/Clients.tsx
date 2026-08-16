import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CLIENTS, CONTACTS, INVOICES, PROJECTS, TIMESHEETS } from "@/data";
import { ACTIVITY } from "@/data/master";
import { formatDate, money } from "@/lib/format";
import { toneFor, statusIcon } from "@/lib/status";
import { useCan, scopedProjects } from "@/lib/hooks";
import { useApp } from "@/store/AppState";
import { Alert, Button, Checkbox, Crumb, Field, Input, PageHeader, Panel, Select, StatusBadge, Tabs, Textarea } from "@/components/ui/primitives";
import { DataTable, FilterChip, Toolbar } from "@/components/ui/Table";
import { ConfirmDialog, Drawer, Restricted, Timeline } from "@/components/ui/overlays";

export function ClientListPage() {
  const nav = useNavigate();
  const can = useCan();
  const scope = scopedProjects();
  const [filter, setFilter] = useState("Active");
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    let list = CLIENTS.filter((c) => {
      if (filter === "Active" && c.status !== "Active") return false;
      if (filter === "Inactive" && c.status !== "Inactive") return false;
      if (filter === "Overdue" && c.outstanding <= 0) return false;
      if (q && !`${c.displayName} ${c.code} ${c.primaryContact}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (scope) list = list.filter((c) => PROJECTS.some((p) => scope.includes(p.id) && p.clientId === c.id));
    return list;
  }, [filter, q, scope]);

  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Clients" }]} />}
        title="Clients"
        description={`${rows.length} companies. Demo data.`}
        actions={
          <>
            {can("client.create") ? (
              <Link to="/clients/new">
                <Button variant="gold">Add client</Button>
              </Link>
            ) : (
              <Button disabled title="Requires client.create">
                Add client
              </Button>
            )}
            <Button>Export</Button>
            <Button disabled={!can("client.edit")}>Bulk assign coordinator</Button>
          </>
        }
      />
      <Toolbar>
        <Input placeholder="Search clients" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        {["Active", "Inactive", "Overdue"].map((f) => (
          <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === "Overdue" ? "Has overdue invoices" : f}
          </FilterChip>
        ))}
        <Select className="max-w-[180px]">
          <option>All locations</option>
          <option>Jubail</option>
          <option>Dammam</option>
          <option>Ras Tanura</option>
          <option>Yanbu</option>
        </Select>
        <Select className="max-w-[200px]">
          <option>All coordinators</option>
          <option>Fatima Al-Zahra</option>
          <option>Sami Al-Dosari</option>
        </Select>
      </Toolbar>
      <DataTable
        selectable
        rows={rows}
        onRowClick={(r) => nav(`/clients/${r.id}`)}
        emptyTitle="No clients match these filters"
        emptyBody="Clear filters or add a client."
        columns={[
          { key: "displayName", header: "Client", sort: true, render: (r) => <span className="font-medium">{r.displayName}</span> },
          { key: "code", header: "Client code" },
          { key: "activeProjects", header: "Active projects" },
          { key: "deployedWorkers", header: "Deployed workers" },
          { key: "outstanding", header: "Outstanding invoices", render: (r) => money(r.outstanding) },
          { key: "primaryContact", header: "Primary contact" },
          { key: "status", header: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)}>{statusIcon(r.status)} {r.status}</StatusBadge> },
          { key: "coordinator", header: "Coordinator" },
        ]}
      />
    </div>
  );
}

export function ClientFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useApp();
  const can = useCan();
  const existing = CLIENTS.find((c) => c.id === id);
  const [changed] = useState(mode === "edit");
  if (mode === "edit" && !can("client.edit")) return <Restricted explanation="You can view this client but you cannot edit company records." />;
  if (mode === "create" && !can("client.create")) return <Restricted />;

  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Clients", to: "/clients" }, { label: mode === "create" ? "Add client" : existing?.displayName ?? "Edit" }]} />}
        title={mode === "create" ? "Add client" : `Edit ${existing?.displayName}`}
        actions={
          <>
            <Button onClick={() => nav(-1)}>Cancel</Button>
            <Button>Save draft</Button>
            <Button
              variant="primary"
              onClick={() => {
                toast("Client saved. Demo only — nothing was written to a live system.");
                nav(mode === "edit" ? `/clients/${id}` : "/clients/gps");
              }}
            >
              Save
            </Button>
          </>
        }
      />
      {mode === "edit" ? <Alert tone="info">Changed fields are marked. Legal name was not changed.</Alert> : null}
      <form className="mt-4 space-y-8">
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Company details</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Legal name" required>
              <Input defaultValue={existing?.legalName} className={changed ? "ring-1 ring-gold/40" : undefined} />
            </Field>
            <Field label="Display name" required>
              <Input defaultValue={existing?.displayName} />
            </Field>
            <Field label="Client code" required hint="Used on invoices and timesheets">
              <Input defaultValue={existing?.code} />
            </Field>
            <Field label="VAT number">
              <Input defaultValue={existing?.vat} />
            </Field>
            <Field label="CR number">
              <Input defaultValue={existing?.cr} />
            </Field>
            <Field label="Industry">
              <Select defaultValue={existing?.industry}>
                <option>Petrochemical</option>
                <option>Oil & gas maintenance</option>
                <option>EPC / Construction</option>
                <option>Industrial maintenance</option>
              </Select>
            </Field>
            <Field label="Billing currency">
              <Select defaultValue="SAR">
                <option>SAR</option>
              </Select>
            </Field>
            <Field label="Payment terms">
              <Input defaultValue={existing?.paymentTerms ?? "30 days"} />
            </Field>
            <Field label="Default VAT">
              <Select defaultValue="15">
                <option value="15">15%</option>
                <option value="0">0%</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select defaultValue={existing?.status ?? "Active"}>
                <option>Active</option>
                <option>Inactive</option>
              </Select>
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Address</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="City">
              <Input defaultValue={existing?.city} />
            </Field>
            <Field label="Region">
              <Input defaultValue={existing?.region} />
            </Field>
            <Field label="Street">
              <Input defaultValue={existing?.street} />
            </Field>
            <Field label="Postal code">
              <Input defaultValue={existing?.postal} />
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Primary contact</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Name" required>
              <Input defaultValue={existing?.primaryContact} />
            </Field>
            <Field label="Email">
              <Input defaultValue={existing?.primaryEmail} />
            </Field>
            <Field label="Phone">
              <Input defaultValue={existing?.primaryPhone} />
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Billing contact</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Name">
              <Input defaultValue="Huda Al-Naimi" />
            </Field>
            <Field label="Email">
              <Input defaultValue="h.naimi@gps.example" />
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Timesheet preferences</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Default cycle">
              <Select defaultValue="Weekly">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Biweekly</option>
                <option>Monthly</option>
              </Select>
            </Field>
            <Field label="Known template">
              <Select>
                <option>GPS Weekly Timesheet v3</option>
                <option>None</option>
              </Select>
            </Field>
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Notes</h2>
          <Textarea defaultValue={existing?.notes} />
        </section>
        <section>
          <h2 className="mb-3 font-heading text-[20px] font-semibold">Attachments</h2>
          <div className="rounded-[8px] border border-dashed border-line px-4 py-8 text-center text-[13px] text-muted">
            Drop CR, VAT certificate or contract PDF here
          </div>
        </section>
      </form>
    </div>
  );
}

export function ClientDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const can = useCan();
  const { toast } = useApp();
  const c = CLIENTS.find((x) => x.id === id) ?? CLIENTS[0];
  const [tab, setTab] = useState("overview");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const contacts = CONTACTS.filter((x) => x.clientId === c.id);
  const projects = PROJECTS.filter((p) => p.clientId === c.id);
  const invoices = INVOICES.filter((i) => i.clientId === c.id);

  return (
    <div>
      <PageHeader
        breadcrumb={<Crumb items={[{ label: "Clients", to: "/clients" }, { label: c.displayName }]} />}
        title={c.displayName}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={toneFor(c.status)}>
              {statusIcon(c.status)} {c.status}
            </StatusBadge>
            <span>Coordinator {c.coordinator}</span>
            <span>·</span>
            <span>{c.primaryContact}</span>
          </span>
        }
        actions={
          <>
            <Button onClick={() => nav("/clients")}>Back</Button>
            {can("client.edit") ? (
              <Link to={`/clients/${c.id}/edit`}>
                <Button>Edit</Button>
              </Link>
            ) : (
              <Button disabled>Edit</Button>
            )}
            <Link to="/projects/new">
              <Button variant="gold">Add project</Button>
            </Link>
            {can("client.archive") ? (
              <Button variant="danger-outline" onClick={() => setArchiveOpen(true)}>
                Archive
              </Button>
            ) : null}
          </>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "projects", label: "Projects" },
          { id: "contacts", label: "Contacts" },
          { id: "contracts", label: "Contracts & POs" },
          { id: "timesheets", label: "Timesheets" },
          { id: "invoices", label: "Invoices" },
          { id: "documents", label: "Documents" },
          { id: "activity", label: "Activity" },
        ]}
      />
      <div className="mt-4">
        {tab === "overview" ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel className="p-4 lg:col-span-2">
              <h3 className="font-heading text-[16px] font-semibold">At a glance</h3>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <dt className="text-muted">Active projects</dt>
                  <dd className="font-medium">{c.activeProjects}</dd>
                </div>
                <div>
                  <dt className="text-muted">Deployed employees</dt>
                  <dd className="font-medium">{c.deployedWorkers}</dd>
                </div>
                <div>
                  <dt className="text-muted">Outstanding balance</dt>
                  <dd className="font-medium">{money(c.outstanding)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Last timesheet received</dt>
                  <dd className="font-medium">{c.lastTimesheet ? formatDate(c.lastTimesheet) : "None"}</dd>
                </div>
                <div>
                  <dt className="text-muted">VAT</dt>
                  <dd>{c.vat}</dd>
                </div>
                <div>
                  <dt className="text-muted">Payment terms</dt>
                  <dd>{c.paymentTerms} · VAT {c.defaultVat}%</dd>
                </div>
              </dl>
              <p className="mt-3 text-[13px] text-muted">{c.notes}</p>
            </Panel>
            <Panel className="p-4">
              <h3 className="font-heading text-[16px] font-semibold">Billing configuration</h3>
              <p className="mt-2 text-[13px]">Currency SAR · Cycle follows each project · Rate card GPS · Jubail Turnaround 2026</p>
              <Link className="mt-2 inline-block text-[13px] underline" to="/rate-cards/rc-gps-jub">
                Open rate card
              </Link>
            </Panel>
          </div>
        ) : null}
        {tab === "projects" ? (
          <DataTable
            rows={projects}
            columns={[
              { key: "name", header: "Project", render: (p) => <Link className="underline" to={`/projects/${p.id}`}>{p.name}</Link> },
              { key: "code", header: "Code" },
              { key: "status", header: "Status", render: (p) => <StatusBadge tone={toneFor(p.status)}>{statusIcon(p.status)} {p.status}</StatusBadge> },
              { key: "deployed", header: "Deployed" },
            ]}
          />
        ) : null}
        {tab === "contacts" ? (
          <>
            <div className="mb-3">
              <Button variant="gold" onClick={() => setContactOpen(true)}>
                Add contact
              </Button>
            </div>
            <DataTable
              rows={contacts}
              columns={[
                { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
                { key: "position", header: "Position" },
                { key: "email", header: "Email" },
                { key: "phone", header: "Phone" },
                { key: "whatsapp", header: "WhatsApp" },
                { key: "primary", header: "Primary", render: (r) => (r.primary ? "Yes" : "") },
                { key: "status", header: "Status", render: (r) => r.status },
              ]}
            />
          </>
        ) : null}
        {tab === "contracts" ? (
          <Panel className="p-4 text-[13px]">
            <div>GPS-TA-2026-04 · PO-88921 · Jubail Turnaround 2026</div>
            <div className="mt-2 text-muted">EIC-MS-26-11 · PO-44108 is on Eastern Industrial Contracting.</div>
          </Panel>
        ) : null}
        {tab === "timesheets" ? (
          <DataTable
            rows={TIMESHEETS.filter((t) => t.clientId === c.id)}
            columns={[
              { key: "id", header: "Timesheet", render: (t) => <Link className="underline" to={`/timesheets/${t.id}`}>{formatDate(t.periodStart)} – {formatDate(t.periodEnd)}</Link> },
              { key: "status", header: "Status", render: (t) => <StatusBadge tone={toneFor(t.status)}>{statusIcon(t.status)} {t.status}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "invoices" ? (
          <DataTable
            rows={invoices}
            columns={[
              { key: "id", header: "Invoice", render: (i) => <Link className="underline" to={`/invoices/${i.id}`}>{i.id}</Link> },
              { key: "total", header: "Total", render: (i) => money(i.total) },
              { key: "status", header: "Status", render: (i) => <StatusBadge tone={toneFor(i.status)}>{statusIcon(i.status)} {i.status}</StatusBadge> },
            ]}
          />
        ) : null}
        {tab === "documents" ? <EmptyDocs /> : null}
        {tab === "activity" ? (
          <Panel className="p-4">
            <Timeline items={(ACTIVITY.gps ?? []).map((x) => ({ date: formatDate(x.date), text: x.text }))} />
          </Panel>
        ) : null}
      </div>
      <ConfirmDialog
        open={archiveOpen}
        title={`Archive ${c.displayName}?`}
        confirmLabel="Archive client"
        danger
        onClose={() => setArchiveOpen(false)}
        onConfirm={() => {
          setArchiveOpen(false);
          toast(`${c.displayName} archived in this demo. Historical projects and invoices remain available.`);
          nav("/clients");
        }}
        body={
          <p>
            {c.displayName} will no longer appear in active client lists. Existing projects, timesheets and invoices stay in the record. You can reopen the client later.
          </p>
        }
      />
      <Drawer
        open={contactOpen}
        title="Add contact"
        onClose={() => setContactOpen(false)}
        footer={
          <>
            <Button onClick={() => setContactOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setContactOpen(false);
                toast("Contact added in this demo.");
              }}
            >
              Save contact
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Name" required>
            <Input />
          </Field>
          <Field label="Position">
            <Input />
          </Field>
          <Field label="Email">
            <Input />
          </Field>
          <Field label="Phone">
            <Input />
          </Field>
          <Field label="WhatsApp">
            <Input />
          </Field>
          <Field label="Department">
            <Input />
          </Field>
          <Field label="Role in project">
            <Input />
          </Field>
          <Checkbox label="Receives invoices" />
          <Checkbox label="Receives timesheet communication" />
          <Checkbox label="Primary contact" />
        </div>
      </Drawer>
    </div>
  );
}

function EmptyDocs() {
  return (
    <Panel>
      <div className="px-6 py-12 text-center">
        <div className="font-heading text-[16px] font-semibold">No client documents uploaded</div>
        <p className="mt-1 text-[13px] text-muted">Contracts and POs can be attached on the project or here.</p>
        <Button className="mt-3">Upload document</Button>
      </div>
    </Panel>
  );
}

export function ClientNotFound() {
  return (
    <Panel className="p-10 text-center">
      <h1 className="font-heading text-[22px] font-semibold">Client not found</h1>
      <p className="mt-1 text-[13px] text-muted">This client ID is not in the demo data.</p>
      <Link to="/clients">
        <Button className="mt-3">Back to clients</Button>
      </Link>
    </Panel>
  );
}
